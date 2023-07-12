---
title: "{n} times faster than C ...with Python"
---

I was reading Owen Shepherd's post "[{n} times faster than C][og-post]",
which explores how to hand-tune x86-64 assembly to make a certain
problem faster (see below). Originally, this inspired me to write a short
introduction to using Rust's [portable SIMD][] to manually speed up
problems like this. I rewrote the problem in Rust (of course), used
explicit [SIMD][], and observed a substantial speed-up.

However, that is not why I'm writing this blog post. Before getting
started on writing that SIMD tutorial, I had an idea:

> What if I compare the performance of my hand-rolled SIMD solution to
> a Python version that uses [NumPy][]?

This innocent thought, dear reader, destroyed my productivity for the
following two days. I learned, that you _can_ indeed write plain ol'
Python code that can compute certain problems faster than
a straightforward implementation in C and Rust.
The secret, of course, is to [write your Python program so that it's
doing all its work outside of Python][berger], but I'm getting ahead of
myself.

So instead of a tutorial on portable SIMD, we get this blog post — I've
wasted so much time on this problem, I might as well write up some of my
findings to wrap things up. This is how Python can be more performant
than C or Rust.

But first, what is the problem we're trying to solve?

# The problem

The problem from [Owen's blog post][og-post] is as follows:

Given a null-terminated buffer, maintain a count: increment that count
for every `s` encountered. Decrement the count for every `p`
encountered. Finally, return the count.

Here is Owen's original C solution:

```c
int run_switches(char *input) {
  int res = 0;
  while (true) {
    char c = *input++;
    switch (c) {
      case '\0':
        return res;
      case 's':
        res += 1;
        break;
      case 'p':
        res -= 1;
        break;
      default:
        break;
    }
  }
}
```

[Owen's post][og-post] goes into detail about profiling this on his
x86-64 machine, including hand-tuning assembly. I'm running this on
my 2020 M1 MacBook Pro (see the appendix for more information on my
testing setup), which uses an entirely different architecture (ARM
AArch64 instead of x86-64), so Owen's hand-tuned assembly won't do me
any good. So how does this code run on my computer?

I ran the above code with a test case of 12 MiB of random ASCII
printable characters and got the following results:

Runtime
 : 7,794,642 nanoseconds per iteration 🦙

Throughput
 : 1.478 GiB/s

With a test case of 12 MiB of random `s` or `p` bytes, I get the
following results:

Runtime
 : 41,617,334 nanoseconds per iteration 🐢

Throughput
 : 0.278 GiB/s or 284.9 MiB/s

Speedup
 : 0.19x

I didn't do any investigation into why the same code is so much slower
when given just `s` and `p` bytes, but if you peek at the compiled
machine code (see it here on [Compiler Explorer](https://godbolt.org/z/foYrr1e6K)),
it has 4 conditional branches. In general, modern CPUs work well if the
branches are few, and if the outcome of the branches that _do_ exist are
predictable. Preferably, the only conditional branch you have is the one
controlling the loop itself (e.g., `while (condition) {...}`). I'm
guessing that the latter test case seems to make the branch predictor
mispredict _a lot_, which is why it's about 20% of the speed.

None of the remaining of the code examples seem to demonstrate an
appreciable difference on performance when given either input, so I will
only present the speed and any comparisons on the first test case,
namely the random ASCII printable test case.

# Rewrite it in Rust™

Naturally, being a tediously predictable Rustacean, I had to rewrite
this in Rust. Here's how that looks like:

```rust
use std::ffi::CStr;  // for C interoperability

pub fn rust_iter(s: &CStr) -> isize {
    s.to_bytes()
        .iter()
        .map(|c| match c {
            b's' => 1,
            b'p' => -1,
            _ => 0,
        })
        .sum()
}
```

On the random ASCII test case, it had this performance:

Runtime
 : 2,864,421 nanoseconds per iteration 🐆

Throughput
 : 3.979 GiB/s

Speedup
 : 2.72x

A few notes on this solution:

Unlike the C version, the Rust version knows the length of the buffer,
and does not need to check for the null-terminator for each and every
byte of the input.

Using iterators (that is, `s.to_bytes().iter()`) tends to enable a lot
of optimizations in Rust, including [auto-vectorization][] (that is,
automatically using SIMD; see below).

Taking a quick peak at the assembly (see it here on [Compiler
Explorer](https://godbolt.org/z/jja8PMqTr)) shows the use of
instructions such as:

```asm
        movi    v1.16b, #112
```

Wow! `movi` is creating 16 copies of the number #112 (the ASCII value of the letter
`p`) and putting them into a vector register `v1`!

And look!

```asm
        ldr     q19, [x11], #16
```

`ldr` loading 16 bytes from the input into a 128-bit wide-register `q19`, while
incrementing the pointer by 16!

And then you have this absolute banger:

```asm
        cmeq    v20.16b, v19.16b, v1.16b
```

Which is using `cmeq` to simultaneously compare the 16 bytes from `v1`
against the 16 bytes just loaded into `v19` (a.k.a., `q19`, the data
from the input) and dumps the 16 individual comparisons into `v20`. Nice!

This is not the SIMD tutorial, so I won't go into much depth about
what's happening here, but the Rust compiler definitely figured out how
to automatically parallelize some parts of this algorithm, which is
cool, and partially explains the speedup. Loading 16 bytes at a time is
a whole lot faster than loading one byte at a time.

That said, the vectorized code that the compiler generated was not
ideal. The majority of the instructions in the hot loop are the compiler
attempting to maintain 16 simultaneous 64-bit sums, but in order to do
that with the M1's 128-bit wide SIMD registers, it must tediously shift bits
around. This uses a lot of instructions and a lot of registers, which is
work that should probably be avoided.

I thought that I could do better.

# Rust portable SIMD: The fastest solution

Here is the Rust version that uses portable SIMD:

```rust
use std::ffi::CStr;
use std::simd::{u8x16, SimdInt, SimdPartialEq};

pub fn rust_portable_simd(s: &CStr) -> isize {
    let bytes = s.to_bytes();
    let (prefix, middle, suffix) = bytes.as_simd();

    let s = u8x16::splat(b's');
    let p = u8x16::splat(b'p');

    let mut result = 0;
    for &window in middle {
        let neg_ss = window.simd_eq(s).to_int();
        let neg_ps = window.simd_eq(p).to_int();
        let pairwise = neg_ps - neg_ss;

        result += pairwise.reduce_sum() as isize;
    }

    _count_scalar(prefix) + result + _count_scalar(suffix)
}

// Note: _count_scalar omitted for brevity
```

You can check out the assembly [in Compiler Explorer](https://godbolt.org/z/TPj7KTsaY).

So, how fast is this version?

Runtime
 : 584,040 nanoseconds per iteration 🚀

Throughput
 : 19.870 GiB/s

Speedup
 : 13.3x (compared to original C version)

584,040 nanoseconds is a bit difficult for me to conceptualize. I think
milliseconds are bit easier to grok. 584,040 nanoseconds is 0.58
milliseconds. It took my three year old laptop just over half
a millisecond to analyze over 12 and a half million letters. That's
sick. Computers are awesome. 🤘🏼

# Predictably slow: the straightforward Python solution

The way that I generated test data for my benchmarks was by using NumPy,
which is why I was using Python in the first place. Just for fun, let's
see what happens when we use the most route one Python code that you can
imagine to iterate over the NumPy `ndarray` of random ASCII bytes and
get a solution:

```python
def python_for_loop(array):
    result = 0
    for element in array:
        if element == b"s":
            result += 1
        elif element == b"p":
            result -= 1
    return result
```

And how fast was this on my machine?

Runtime
 : 18,894,861,583 nanoseconds per iteration — that's 18.89 seconds 🗿

Throughput
 : 0.617 MiB/s (measuring in gigabytes per second is a bit optimistic 💀)

Speedup
 : 0.000407x (compared to original C version)

So it turns out that calculating things one byte at a time in Python is
really, really slow. Who knew!

However, there is another option.

# Literally the first thing I tried in NumPy

This is where we get into the day-ruiner. I can't remember my thought
process clearly, but I have the vague notion in my head that operations
that operate on entire vectors are really fast in NumPy, so try to think
in vectors. And here is what I came up with:

```python
def python_numpy(array):
    num_s = np.count_nonzero(array == b"s")
    num_p = np.count_nonzero(array == b"p")
    return num_s - num_p
```

This counts how many `s`s there are and then subtracts how many `p`s
there are, and there's your answer. How fast is it?

Runtime
 : 1,992,393 nanoseconds per iteration 🏎

Throughput
 : 5.800 GiB/s 🤯

Speedup
 : 3.91x (compared to original C version)

Yes. **NumPy is nearly four times as fast as C**.
Of course, the original C code is hampered by having to iterate
byte-by-byte to look for that null-terminator, not to mention that NumPy
itself is a library written in C and Fortran, and it uses explicit SIMD parallelism
to do its operations quickly.

However, I spent _hours_ trying to replicate this algorithm with all its
irreducible steps in Rust. That is, I could not find a way to write
Rust code that could do the following:

 1. Allocate a boolean vector whose elements are true if the
    corresponding byte in the input is equal to `s`.
 2. Allocate a boolean vector whose elements are true if the
    corresponding byte in the input is equal to `p`.
 3. Count how many non-zero values appear in the first vector.
 4. Count how many non-zero values appears in the second vector.
 5. Subtract the counts.

I'll spare you the details, but in my attempts to write Rust code that
faithfully does all these steps -- steps that NumPy _must_ do, given
it's working in Python -- the best I could do is a solution that
takes 3,769,195 nanoseconds per iteration or 3.031 GiB/s.
It took me an entire working day of doing this, employing
nasty tricks like using `std::mem::transmute::<&[bool], &[u8]>(input)` and
`unsafe { vec.set_len(input.len()) }`. It got ugly! And I never managed
to write any Rust code that did all that much faster than NumPy. 😖

# Final results

|    | Implementation        | Time per iteration   | Throughput   | Speedup   |
|----|-----------------------|---------------------:|-------------:|----------:|
| 🥇 | Rust - portable SIMD  |           584,040 ns | 19.870 GiB/s |  13.3x    |
| 🥈 | Python - NumPy        |         1,992,393 ns |  5.800 GiB/s |  3.91x    |
| 🥉 | Rust - iterators      |         2,864,421 ns |  3.979 GiB/s |  2.72x    |
|    | C - original          |         7,794,642 ns |  1.478 GiB/s |  1.00x    |
|    | Python - byte-by-byte |    18,894,861,583 ns | <0.001 GiB/s | <0.01x    |

So Rust, using a manually-crafted SIMD algorithm is still the winner,
but I am frankly alarmed to know that code can be nearly 4 times as fast
as C with just NumPy, having to write only 4 lines of Python code.

There's a lot more I could do here to investigate performance
differences—I did not really employ any fancy profilers. I started to
investigate [NumPy's source code][numpy-src] and confirmed that the
developers indeed wrote explicit SIMD, but that's as far as I got. I'm
curious how fast some straightforward [Polars][] implementation would
be.

# Conclusion

You might not need to rewrite it in Rust, if you can somehow get NumPy
to do all the heavy-lifting for you.

# Appendix: Benchmarking set up

You can find all my code, including my janky benchmarking setup in
[this GitHub repository][repo].

For all results, I used the same 12 MiB test case. For Rust and C,
I used `cargo bench` to run benchmarks, however [the docs are
sparse][cargo-test], so I'm not entirely sure how many iterations were
taken. For Python, I used `timeit`, taking 5 samples with 200 iterations
per sample and reported the fastest mean time.

I compiled all C code with Clang with `-O2` and `-mcpu=apple-m1` to try
to coax LLVM to generate code best suited for my machine. I compiled
all Rust code with `--release`.

Here are the exact versions of the software I used.

Clang:

```
$ clang --version
Apple clang version 14.0.0 (clang-1400.0.29.202)
Target: arm64-apple-darwin21.6.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
```

Rust:

```
$ rustc --version
rustc 1.73.0-nightly (8ca44ef9c 2023-07-10)
```

Python and NumPy:

```
$ python3 --version
Python 3.11.0
$ python3 -c "import numpy; print('NumPy', numpy.__version__)"
NumPy 1.25.1
```

The machine I was testing on is just my personal laptop, a 2020 M1
MacBook Pro. Details of its specs are a bit complicated (4 performance
cores?! 4 energy cores?! What? It has _how_ large of a shared L2
cache?), but here is what macOS tells me:

```
$ uname -srm
Darwin 21.6.0 arm64
$ sysctl machdep.cpu.brand_string machdep.cpu.core_count hw.l1icachesize hw.l1dcachesize hw.l2cachesize
machdep.cpu.brand_string: Apple M1
machdep.cpu.core_count: 8
hw.l1icachesize: 131072
hw.l1dcachesize: 65536
hw.l2cachesize: 4194304
```

[og-post]: https://owen.cafe/posts/six-times-faster-than-c/
[portable SIMD]: https://github.com/rust-lang/portable-simd
[numpy]: https://numpy.org/
[numpy-src]: https://github.com/numpy/numpy/blob/c6a449c7972e97afd9401d098939fe29d3e7c891/numpy/core/src/multiarray/item_selection.c#L2377-L2395
[berger]: https://www.youtube.com/watch?v=vVUnCXKuNOg
[repo]: https://github.com/eddieantonio/fast-sp/
[auto-vectorization]: https://en.wikipedia.org/wiki/Automatic_vectorization
[polars]: https://www.pola.rs/
[cargo-test]: https://doc.rust-lang.org/nightly/unstable-book/library-features/test.html
[simd]: https://en.wikipedia.org/wiki/Single_instruction,_multiple_data
