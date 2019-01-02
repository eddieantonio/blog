---
title:  Stupid Things I Wrote in Ruby Last Week
---

![slowpoke]({{ '/images/stupid-ruby/Slowpoke.svg' | relative_url }})

Last Saturday, I mentored the [Ladies Learning Code Introduction to
Ruby][llcyeg].

[llcyeg]: http://ladieslearningcode.com/chapters/edmonton/

Problem was, one week ago, I didn't really _know_ Ruby---at least not at
the level where I could claim I'm an authority capable of teaching it to
others. My experience with Ruby to that point had been so insignificant,
I could enumerate just about _everything_ I've ever written in Ruby:

 - A Jekyll extension
 - Simple code generators for my compiler class project
 - A weird C/[GraphViz][] state machine generator for a [DNA...
   thing?][smt] I guess?
 - And configuration files in at least two Ruby DSLs:
   [Vagrantfile][Vagrant], [Homebrew Formulae][brew]

[Vagrant]: https://www.vagrantup.com/
[brew]: http://brew.sh/
[GraphViz]: http://www.graphviz.org/
[smt]: https://github.com/eddieantonio/state-machine-tomfoolery

Since Ruby is a dynamic, imperative, object-oriented programming
language, I got by just fine through piecing together its syntax from
pre-existing examples. I thought of Ruby as "that weird Smalltalk/Perl
language with Lisp symbols" and it all kind of worked out in the end.
After all, that combination is hella rad! But now, it's about time for
me to semi-seriously learn the language.

However, I've learned enough programming languages that going through in
depth tutorials over the basic syntax of the language and its features
is pretty dang boring. I *did* study such a tutorial, but it was to
ensure I knew enough of the language to teach the material in the
[slides for the Ladies Learning Code workshop][llc-slides].

[llc-slides]: http://jfeaver.github.io/ladieslearningcode-Ruby/ladies-learning-ruby.html#1

What can I say? I'm impatient! And I've always _heard_ of the ease of
metaprogramming and monkey-patching in Ruby. Now's my time to _live it!_
So I decided to dive into it head-first. After completing all of the
exercises in the aforementioned absolute beginners slides, I hit Google
and found resources on what makes Ruby different from the other
programming languages I'm familiar with.

So I somehow found Jonan Scheffler's articles on [Weird Ruby][], as well
as [this list of metaprogramming idioms][metaidioms], and went to town.
Here's a semi-chronological retrospective of the egregious things
I wrote throughout my experience learning Ruby. Let's start!

[Weird Ruby]: https://blog.newrelic.com/2014/11/13/weird-ruby-begin-end/
[metaidioms]: https://gist.github.com/Integralist/a29212a8eb10bc8154b7

## I don't even know

I must prefix this by saying:

 1. This is not the way I'd ever solve this problem in a serious domain.
 2. I literally don't even understand what compelled me to write this.

I could have just installed the `proc-wait3` Ruby gem, but I decided to
take it in a bit of a different direction. Pouring over
[ruby-doc.org][], I found [`Kernel#syscall`][syscall] and I just could
not resist, you guys! I just had to use it to call arbitrary system
calls on my machine! I just had to! So that's exactly what this program
does. I don't even know.

{% gist eddieantonio/1dcbcc8f6ed53e1a4b63 %}

[ruby-doc.org]: http://ruby-doc.org/core-2.2.2/
[syscall]: http://ruby-doc.org/core-2.2.0/Kernel.html#method-i-syscall

You may notice this invocation to `xcrun` at the top. It's meant to deal
with a some weird Apple things.  At some OS X/Xcode update, _Apple_
decided the path to C things should differ from the traditional Unix
prefix of `/usr/{lib,include}` to some branching thing... There probably
is good rationale behind displacing all of this standard C developer
stuff to some different directory, but I never really noticed when it
happened. I guess they want to have several different platform versions
you can link against on one machine, but their solution is leaves a bit
to be desired. Regardless! You can get the effective path to the current
platform using `xcrun --show-sdk-path`, which is exactly what I did:

~~~ irb
irb(main):001:0> `xcrun --show-sdk-path`.chomp
=> "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.10.sdk"
~~~

Why did I do this, you may ask? Well of course, to inspect the
contents of the C header called `sys/syscall.h`. It's a big ol' list of
C defines that looks a little bit like this:

~~~ c
#define	SYS_syscall        0
#define	SYS_exit           1
#define	SYS_fork           2
#define	SYS_read           3
#define	SYS_write          4
#define	SYS_open           5
#define	SYS_close          6
#define	SYS_wait4          7
			/* 8  old creat */
#define	SYS_link           9
#define	SYS_unlink         10
/* ... */
~~~

When your code needs to prod the kernel to do things, such as read from
a file, send a signal to another process, or map more pages of memory
(for memory allocation), it invokes an interrupt instruction to tag in
the operating system kernel to do the nasty work. What specific
operating system function actually gets used is determined by an
integer, and this file lists all of those integers for my particular
install of OS X.

And what did I do with this file? I grep'd it, and found the syscall for
[`sigsuspend(2)`][sigsuspend]. Yes. My file extracts the system call
constant from the C header file. And then it invokes it using
`Kernel#syscall`. Because I could, and that is literally the only reason
why.

[sigsuspend]: https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man2/sigsuspend.2.html

## A fake database wrapper class 

I then moved on to implementing control flow using exceptions---probably
a bad idea, but kind of neat.

{% gist eddieantonio/7e6a588426663604dbbf %}

There are a few notable things here. There's this semi-private
`UpdateError` exception class that's raised by `_execute` to indicate
that the "statement" failed. This is caught by `transaction` that
returns true or false, depending on whether a statement failed in the
transaction. The bang method `transaction!` is the same, except it
raises a `TransactionFailed` exception---and here I start to show my
fondness of Ruby naming conventions. I have an boolean attribute
`@in_transaction` that can be accessed using the method
`in_transaction?`. Allowing `!` and `?` at the end of method names is
really nice, and is one of the reasons I like Ruby. As an aside, it's
also my reason for my artificial preference of Scheme over Common Lisp.
Seriously though, Common Lisp. Are you listening? Why do you use `p` to
indicate predicates [when you could just use a `?`][lisp-naming]?

Er... that brings me to the next thing I programmed:

# `attr_boolean`

And so begins my dangerous fascination with metaprogramming and monkey
patching! I acknowledge that these two features of Ruby can be horribly,
horribly abused... and I decided to take full advantage of it! Note to
future collaborators: I promise not to use these techniques in
production code. Much.

`attr_boolean` is similar to `attr_reader` except it adds a _boolean_
reader with a question mark at the end. That is, if you have an instance
variable `@is_okay`, it creates a method called `is_okay?`, and this
simply returns `@is_okay`, which should presumably be `true` or `false`

The dumb part here is I straight-up don't know how to access instance
variables by name. My Googlefu failed me here so I decided to take it in
a bit of a different direction...

[cl]: https://www.cs.cmu.edu/Groups/AI/html/cltl/clm/node69.html
[lisp-naming]: http://www.cliki.net/Naming+conventions
[google lisp]: https://google-styleguide.googlecode.com/svn/trunk/lispguide.xml#Predicate_names 

{% gist eddieantonio/b3fa5310e52710b4808e %}

I used `eval`. Never use `eval`, ya'll. It will probably go horribly
wrong. That said, it didn't stop me from trying to do a little input
validation. I wanted a _single_ Ruby identifier, since this is the only
that would make syntactic sense in my template code in the `eval`. But
how would I know that I have a Ruby identifier? I _could_ write a cheap
regular expression, but I knew there had to be a better way.

This led me to find out whether Ruby has standard libraries to parse
itself. And it does! I used [Ripper][] to lex the input and assert that
it was a valid identifier. And hopefully this is enough to prevent
arbitrary code execution!

[Ripper]: http://ruby-doc.org/stdlib-2.2.2/libdoc/ripper/rdoc/Ripper.html

# `glozell.rb`

And here's a demonstration of `attr_boolean` in action:

{% gist eddieantonio/2d77f5550975dd5b3700 %}

There isn't really anything technically notable about it. I just wanted
to remind the world of GloZell Green's Cereal Challenge. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/Mc06khDks1w" frameborder="0" allowfullscreen></iframe>

That is all.

# `rubydoc_org` gem

At this point, most of my googling landed me on [ruby-doc.org][]. I had
_not_ learned how to use `ri` at this point, and frankly, it's broken on
my system due to... reasons. I also just wanted to program more Ruby, so
here we are.

The problem with my Google searches for Ruby documentation is that it
would return documentation for all _different_ versions of Ruby. I only
wanted what was most relevant to my current version of Ruby---2.2.2. So
I decided to monkey-patch (of course) a method that would give me
documentation for any object I'm using. This comes from my habit of
using `help(obj)` in Python.

{% gist eddieantonio/c7d533bfac66f678b730 %}

I decided to turn this one into a [full-blown gem][rubydoc_org], just to
get my feet wet in writing gems and using bundler.

[rubydoc_org]: https://github.com/eddieantonio/rubydoc_org

# Unicode Literal

This came about because I realized I could. It allows me to write use
Unicode `U+HHHH` notation for code points, and return a UTF-8 string:

{% gist eddieantonio/3e3c1c2ca22629299d71 %}

Well, sort of. You see, you still need to write a valid hexadecimal
literal after it in `0xHHHH` notation. Because of this, I also decided
to throw in support for anything `.to_s`-able, which provides nifty
notation for when the first hex digit is an alphabetic character.

~~~ irb
irb(main):001:0> U+0x1F4A9
=> "💩"
irb(main):002:0> [U+:CA0].*(2).insert(1, '_').join
=> "ಠ_ಠ"
irb(main):003:0> U+'1F5FF'
=> "🗿"
~~~

Unfortunately, you can't concatenate two literals in a row:

~~~ irb
irb(main):004:0> U+0x1F51C + U+0x1F52A
TypeError: no implicit conversion of Module into String
from (pry):1:in `+'
~~~

Of course, you could always just use a Unicode escape in a string
literal...

~~~ irb
irb(main):005:0> "\u{0122D7}"
=> "𒋗"
~~~

...but that would be boring.

# `Numeric#to_utf8`

I kind of glossed over my use of `Array#pack` in the above example to
turn any integer to the UTF-8 string encoding its code point. We may
very well monkey-patch `Integer` or even `Numeric` with this method.

{% gist eddieantonio/e0ca7c36c4c75690fe67 %}

Here, I dump it all into its own module, and provide a method to
_explicitly_ install it. This might be preferable than to simply go
ahead and install the monkey-patch on `require`.

# Blackjack

This is the largest one. The end project of the Ladies Learning Code
workshop was writing a blackjack game. I, of course, would not just
write it like a normal human being. I'd apply all sorts of unnecessary
abstraction to the task an order of magnitude more time writing it than
a sane person. But I did! What results is quite a hefty piece of code,
but I have cool things like my use of Unicode playing card code points!
I mean... someone's gotta use 'em, right?

(Feel free to skim over this one though...)

{% gist eddieantonio/1df5f33bd889a6a2d8e5 %}

# `mean_girls`

I'd like to end with a stupid thing someone _else_ wrote.

Enter the [`mean_girls`][mean_girls] gem. It's only job is to do this:

~~~ irb
irb(main):001:0> cool_people = {:regina_george => true, :cady_heron => true, :karen_smith => true }
=> {:regina_george=>true, :cady_heron=>true, :karen_smith=>true}
irb(main):002:0> cool_people.fetch :gretchen_wieners
KeyError: Stop trying to make fetch happen, :gretchen_wieners!
~~~

[mean_girls]: https://github.com/gabebw/mean_girls

Though I'd personally change its implementation to this:

~~~ ruby
class Hash
  def fetch(key, *args, &block)
    raise KeyError.new "Stop try to make fetch happen! It's not going to happen!"
  end
end
~~~

I'd recommend installing my improved version of this gem, and replacing
the default `ruby` on your path with the following shell script:

~~~ sh
#!/bin/sh
/usr/bin/env ruby-original -r mean_girls $@
~~~

Install it with the following shell script:

~~~ sh
RUBY=`which ruby`
ORIGINAL_RUBY=`dirname $RUBY`/ruby-original

mv $RUBY $ORIGINAL_RUBY
cat > $RUBY << EOF
#!/bin/sh
/usr/bin/env ruby-original -r mean_girls $@
EOF
chmod +x $RUBY
~~~

And overall, enjoy breaking practically every Ruby codebase ever.

![So fetch!](http://media2.giphy.com/media/G6ojXggFcXWCs/giphy.gif)
