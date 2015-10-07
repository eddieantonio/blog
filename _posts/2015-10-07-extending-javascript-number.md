---
title: Extending JavaScript's Number prototype for fun and... well, pretty much just for fun
---

Here are some dumb things to do with JavaScript's `Number` prototype!

> **DISCLAIMER**: Fooling around with any native object's `prototype` is
> generally considered to be a [bad idea][no-extend-native]. These
> examples are provided as demonstrations only, but they're not
> recommended for use in "serious" code, or at least, any code you share
> with anybody.

[no-extend-native]: http://eslint.org/docs/rules/no-extend-native.html

# Ain't no time like Ruby `#times`

You can add a `times` method to JavaScript, just like Ruby's [`#times`
method][#times]

[#times]: http://devdocs.io/ruby/integer#method-i-times

{% gist eddieantonio/ec906d2e952652c68f92 %}

(**Note**: you *have* to wrap the number in parentheses!)

~~~ javascript
(5).times(i => console.log(`I can count to ${i}!`));
~~~

But if Ruby's not your thing, or you don't want to deal with an awkward
callback there's another way to do the same thing, but with a for-loop:

# for (let i of number)

This uses a few feature introduced in ECMAScript 2015: [generators][],
and [iterators][] (accessed with `Symbol.iterator`).

[generators]: http://www.2ality.com/2015/03/es6-generators.html
[iterators]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols

{% gist eddieantonio/8ece9dfa9c8a237b484f %}

This allows for the following usage:

~~~ javascript
for (let i of 5) {
    console.log(i);
}
~~~

How is this different from the classical C-styled for-loop (e.g., `for
(var i = 0; i < MAX; i++)`)? In behaviour, it's almost identical. The
only difference is that modifying the "counter" variable (in this case,
`i`), has no effect. The amount of repetitions stays the same (since the
counting state is actually kept inside the generator). For example, the
following will print "Hi!" 5 times:

~~~ javascript
var i;
for (i of 5) {
    console.log("Hi!");
    i = 4;
}
~~~

You can still exit early using `break`, however:

~~~ javascript
for (let i of 5) {
    console.log("Hi!");
    break;
}
~~~

As for performance, it's up to the JavaScript engine (V8 or
SpiderMonkey, or what-have-you) to optimize one approach over the other
faster than the other.

The `for (let i of number)` syntax is read with the same intent as the
classical for-loop, but with a minimal amount of tokens. Less tokens,
means less surface area for bugs and tiny, seemingly innocuous mistakes.
For example, there is no keeping track of an explicit counter variable;
this is entirely handled by the iterator. Mutating the "counter" has no
effect, as demonstrated above (a feature, or annoyance, depending on
your point of few). This new for-loop is attractive, as it gets straight
to the point of what you're trying to do: just do a thing `n` times!

Maybe we'll get over the stigma of extending native prototypes—so long
as we abide by the [open/closed principle][ocp], our assumptions should
not be violated. And it might even allow for cleaner, less error-prone
code!

[ocp]: https://en.wikipedia.org/wiki/Open/closed_principle
