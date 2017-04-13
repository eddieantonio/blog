---
title:  Authoring man pages in Markdown with Pandoc
---

[man pages][man page] are one of the most tenacious forms of
programmer-oriented documentation. These _manual pages_ have changed
relatively little since their [first publication in 1971][ken&dmr].
Regardless of whether or not they're still relevant in the age of *the
internet*, they remain an invaluable reference for any serious command
line application or C library function.

![Giphy](http://media2.giphy.com/media/WQD6NEEsVTvxK/giphy.gif)

Yet, in the whimsical technological wonderland that is 2015, one often
wonders: there has *got* to be a better way of authoring man pages than
in their native form: crusty old [`troff`][troff] macros--document
publishing's equivalent of assembly language. Alas, dear reader, there is
a way! It's called [Pandoc][]: a self-touted "universal document
converter". For our purposes, it can translate a modern expressive
document formatting language such as Markdown into a troff-formated man
page.

So let's get started!

First, install Pandoc somehow. I recommend using [cabal][] if you plan
on writing your own Pandoc filters in Haskell. Sane people can probably
get by just fine installing Pandoc using their favourite package
manager, or following the instructions on [Pandoc's website][installing
pandoc].

The Markdown template
=====================

Although you may write your man page in any input format that Pandoc
understands, I use Markdown since Pandoc provides a few Markdown
extensions that are quite useful for man page authoring. Here's the
general template I use ([view its raw Markdown source text][view raw]):

{% gist eddieantonio/55752dd76a003fefb562 %}

There are a few things to note:

Headers
-------

man pages generally have at least the following sections:

 * **NAME** — The name of the command or function and a minimal
   description.
 * **SYNOPSIS** — A terse listing of command line arguments or the
   function prototype.
 - **DESCRIPTION** — The bulk of the man page; describes in-detail how
   to use the command, or function.

man pages also tend to include some of the following sections:

 * **OPTIONS** — Command line options; this may also be a subsection of
   **DESCRIPTION**.
 * **EXAMPLES** — Informative usage examples. Personally, I prefer man
   pages that list the most common use cases in the **DESCRIPTION**, but
   it's also handy to have a section purely dedicated to example usage.
 * **FILES** — Descriptions names of important files, such as
   configuration files.
 * **ENVIRONMENT** — Description of relevant environment variables that affect
   functionality.
 * **BUGS** — well-known bugs; however, I generally just throw a link to
   the corresponding issue tracker.
 * **AUTHORS** — Who made it?
 * **SEE ALSO** — References to other man pages.

Another useful resource on these headings is [TLDP's man page
HOW-TO][tldp].

Section numbers
-------------------

All manual pages reside in a numbered section. A man page is often
referenced by its name and section number as in **hello(1)**. A list
of section numbers can be found in [`man`'s man page][man man], but some
more common sections are section 1, general user commands; and section
3, C library functions.

The filename
------------

For this file, I've chosen `hello.1.md`. The filename ends with `.md` to
indicate it's a Markdown document. Since its ultimate goal is to become
a man page called `hello.1`, `.md` is prefixed with `.1`. **Do not
mistake `.1` for a file extension!** It's just convention that a man
page's "file extension" is the manual section number it belongs to.

In order for man pages to be generally accessible, they must be
stored in a path matching this pattern:

~~~ sh
$PREFIX/share/man/man$SECTION/$NAME.$SECTION
~~~

Where `$NAME` is the name of the man page (i.e., you will type `man
$NAME` to view it); `$SECTION` is the section number of the man page;
and `$PREFIX` is a prefix to install tools in Unix such as `/usr/local`
or `/opt`.

For example, my `hello` binary will live in the following path:

    /usr/local/bin/hello

Its corresponding man page will live beside it here:

    /usr/local/share/man/man1/hello.1

The metadata block
------------------

Pandoc's Markdown parses the first three lines as metadata [if they are
prefixed with a `%` sign][metadata blocks]. The first line is special:
it's the document title, and for man pages in particular, it has
the following format:

    % NAME(#) Version | Header

In this case, we have a command named `hello`. It's a general command,
so its manual section is `1`. It's the very first major version of this
command, so it gets `Version 1.0`. Finally, the header--separated from
the rest of the title by a pipe character (`|`)--usually indicates
what set of documentation this manual page belongs to.

    % HELLO(1) Version 1.0 | Frivolous "Hello World" Documentation

If we provided author names using the second metadata line, Pandoc would
automatically append an `AUTHORS` section to the very end of the man
page. I have opted to write this section by hand, however, for greater
control over the formatting of this section.

Useful Pandoc Markdown Extensions
---------------------------------

I have found two Pandoc Markdown extensions particularly useful for man
page authoring: [definition lists][] and [line blocks][].

Definition lists are useful for describing particular command line
arguments, files, and environment variables in depth.

~~~ markdown
-o, --output *file*

:  The --out option changes the default output to the specified file...
~~~

Line blocks, which preserve leading spaces and line breaks, are useful
for writing multi-line synopses. Often, multiple lines are needed if
there are several mutually-exclusive invocations (such as using the
`--help` option in most commands).

~~~ markdown
| **hello** \[**-o**|**--out** _file_] \[_dedication_]
| **hello** \[**-v**|**--version**]
| **hello** \[**-h**|**--help**]
~~~

Note the escaped square brackets (`\[ ... ]`). Since line blocks still
contain formatted text--only initial spacing and line-breaking are
preserved--any Markdown syntax such as link brackets are still
interpreted. This is useful for marking individual options with bold
text and filenames with italics. However, this gets in the way when
using idiomatic square brackets to denote optional components. The
opening square bracket must be escaped to avoid text being interpreted
as link text.

Building the man page
=====================

Now, to turn our Markdown into an actual man page, we just run this
command:

~~~ sh
pandoc --standalone --to man hello.1.md -o hello.1
~~~

The `--standalone` option is necessary; without it, Pandoc will
naïvely translate the Markdown to troff without providing the header,
footer, or the general man page structure to the output.

Building with a Makefile
========================

I often create man pages in conjunction with a simple `make`
build system. The following is a file you can copy paste or `include`
into your Makefile to make it convert any Markdown-formatted man page
into appropriate troff output.

{% gist b8fee891304be526a5c1 pandoc-man.mk %}

To use, simply include `pandoc-man.mk` in your Makefile, set
`MANSECTION` as appropriate for your man page (unnecessary if it's in
section 1), and declare the name of your desired man page as a build
dependency. For my `hello(1)` example, my Makefile is as follows:

{% gist b8fee891304be526a5c1 Makefile %}

Useful Examples
===============

I have authored a few man pages this way:

 - **[imgcat(1)][imgcat]**
 - **[license(1)][license]**
 - **[unormalize(1)][unormalize]**, and its friends **nfc(1)**,
   **nfd(1)**, **nfkc(1)**, **nfkd(1)** (which all point to the same man
   page by way of symbolic links).

As well, it's useful to look at other well-written man pages for
inspiration. For example, **[curl(1)][curl]** is particularly good.

[cabal]: https://www.haskell.org/cabal/
[curl man page]: http://curl.haxx.se/docs/manpage.html
[curl]: http://curl.haxx.se/docs/manpage.html
[definition lists]: http://pandoc.org/README.html#definition-lists
[imgcat]: https://github.com/eddieantonio/imgcat/blob/master/doc/imgcat.1.md
[installing pandoc]: http://pandoc.org/installing.html
[ken&dmr]: https://www.bell-labs.com/usr/dmr/www/manintro.html
[license]: https://github.com/eddieantonio/license/blob/master/license.1.md
[line blocks]: http://pandoc.org/README.html#line-blocks
[man man]: http://linux.die.net/man/1/man
[man page]: https://en.wikipedia.org/wiki/Man_page
[metadata blocks]: http://pandoc.org/README.html#metadata-blocks
[Pandoc]: http://pandoc.org/
[tldp]: http://www.tldp.org/HOWTO/Man-Page/q3.html
[troff]: https://en.wikipedia.org/wiki/Troff
[unormalize]: https://github.com/eddieantonio/unormalize/blob/master/man/unormalize.1.md
[view raw]: https://gist.githubusercontent.com/eddieantonio/55752dd76a003fefb562/raw/38f6eb9de250feef22ff80da124b0f439fba432d/hello.1.md
