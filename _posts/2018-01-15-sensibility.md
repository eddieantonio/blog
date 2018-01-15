---
title: "Syntax and Sensibility: Using language models to detect and correct syntax errors"
---

Has this ever happened to you?

You're writing source code, say this:

```java
package ca.ualberta.cs.example;

public class Hello {
    public static void main(string args[]) {
        if (args.length != 2)
            int exitstatus = 2;
            system.out.println("not enough args");
            system.exit(exitstatus);
        }
        system.out.println("hello, world!");
    }
}
```

And when you go to compile it, you're bombarded with error messages:

```
Hello.java:6: error: variable declaration not allowed here
            int exitstatus = 2;
                ^
Hello.java:10: error: <identifier> expected
        system.out.println("hello, world!");
                          ^
Hello.java:10: error: illegal start of type
        system.out.println("hello, world!");
                           ^
Hello.java:12: error: class, interface, or enum expected
}
^
4 errors
```

Four error messages! So the error must be on at least **line 6**, right?
Right...?

After scratching your head for a while, you figure out that **line
5**, which looks like this:

```java
if (args.length != 2)
```

...should actually have an open brace at the end of the line, like this:

```java
if (args.length != 2) {
```

How the crumb was I supposed to figure *that* out from pouring over the
error messages?

# There's got to be a better way

Introducing *[Sensibility][code]*, a tool designed to not only **find** where
these syntax errors are, but also to tell you how you might be able to
**fix** it!

The secret: use natural language models---specifically *n*-gram and LSTM
language models---to figure out where the "unnatural" code lurks.

> But Eddie... using NLP on code? That's craziness!

Nope! It's [*naturalness*](https://cacm.acm.org/magazines/2016/5/201595-on-the-naturalness-of-software/fulltext).

*Sensibility* can produce a valid fix for about 50% of all single-token
syntax errors, often producing the *true* fix that a novice programmer
would have made. For example, given the broken code above, *Sensibility*
produces this output:

```
Hello.java:5:29: try inserting '{'
        if (args.length != 2)
                               ^
                               {
Hello.java:6:13: try replacing int with {
            int exitStatus = 2;
            ^
            {
```

Either of which will fix the file, but the former is probably what you
intended :).

For more details, read our paper *Syntax and Sensibility: Using language
models to detect and correct syntax errors* to appear in [SANER
2018](http://saner.unimol.it/). [Here's a link to a
preprint](http://softwareprocess.es/pubs/santos2018SANER-syntax.pdf).
And here's the BibTeX.

    @inproceedings{eddie2018SANER2018sasulmtdacse,
     accepted = {2017-12-18},
     author = {Eddie Antonio Santos and Joshua Charles Campbell and Dhvani Patel and Abram Hindle and José Nelson Amaral},
     authors = {Eddie Antonio Santos, Joshua Charles Campbell, Dhvani Patel, Abram Hindle, José Nelson Amaral},
     booktitle = {25th IEEE International Conference on Software Analysis, Evolution, and Reengineering (SANER 2018)},
     date = {2018-04-21},
     funding = {NSERC Discovery, MITACS Accelerate},
     location = {Campobasso, Italy},
     pagerange = {1--11},
     pages = {1--11},
     role = { Author},
     title = {Syntax and Sensibility: Using language models to detect and correct syntax errors},
     type = {inproceedings},
     url = {http://softwareprocess.ca/pubs/santos2018SANER-syntax.pdf},
     venue = {25th IEEE International Conference on Software Analysis, Evolution, and Reengineering (SANER 2018)},
     year = {2018}
    }

[The code is available on GitHub][code].


Special thanks to my coauthors, Joshua Charles Campbell, Dhvani Patel,
[Abram Hindle](http://softwareprocess.es/) and [José Nelson
Amaral](http://www.cs.ualberta.ca/~amaral).

[code]: https://github.com/naturalness/sensibility/tree/saner2018
