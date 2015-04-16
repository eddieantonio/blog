---
layout: post
title:  Using Naturalness for Code Suggestion
date:   2015-01-12 14:16:42
categories: naturalness gamboge
---

[*Gamboge*][] for [Atom][] is a novel way of generating code
suggestions. It's a proof-of-concept implementation that I wrote as part
of my undergraduate research project under the supervision of Abram
Hindle. It's doesn't require any knowledge of the underlying programming
language other than its lexical tokens. That is, unlike many
contemporary techniques, it doesn't need to know anything about the
syntax <!--footnote here--> or the type system of the language. This
makes it relatively easy to apply to new dynamic programming languages,
where knowledge about the type system and what is currently in scope is
difficult to come by. Yet, Gamboge is not a *replacement* for
traditional code suggestion systems; indeed, it can be used to
supplement existing techniques. In this post, I'll explain the secret to
Gamboge--naturalness--and how naturalness can be exploited for uses far
greater than code suggestions. I'll also list the current issues with
using Gamboge, and how it can be extended in the future to become the
best code suggestion engine---ever. I'll end by imploring you to explore
the use of naturalness of software---whether it be with Gamboge. Code
suggestion is just the tip of the iceberg.

# Naturalness

If you own a smartphone, you're probably already familiar with keyboards
give suggestions for the next word you want to type. For example,
I have SwiftKey on my phone. For certain stock phrases, I merely have to
tap the center suggestion repeatedly, and the entire phase is typed out
for me.

<!-- TODO: get a screenshot. Don't goad it. -->

[!Typing okie dokie lokie]({{baseurl}}/assets/okie-dokie-lokie.gif).
 
Prediciive typing systems are appearing all of the place: on the iPhone,
on the PS4, and on Google's stock Android keyboard. These systems work
-- with mixed results -- but they work. And their secret is *not* having
an intimate knowledge of the syntax and the semantics of the English
language--or Russian--or any natural language for that matter. They work
by using *statistics*. They work using the magic of [*n*-gram language
models][ngrams]. These are dumb statical models that rely on the fact
that natural language is *repetitive and predictable*. The idea is, you
have a *corpus* of text in that language already, and you load it into
the model. The model then "predict" by spitting out what has *already*
appeared in the model. **Can we use this idea for code?**

That's exactly what researchers asked in the paper [*On the Naturalness
of Software*][Naturalness], published in 2012 by Abram Hindle, Earl
Barr, Mark Gabel, Zhendong Su, and Prem Devanbu. They sought to confirm
that code, being the "natural product of human effort", exhibited
naturalness--that is, they asked if code just as repetitive and
predictable as natural language. The result was a resounding double yes.
They found that

> Corpus-based statistical language models can capture a high level of
local regularity in software, even more so than in English.

<!-- place figure here -->

Earlier, I claimed that the *n*-gram language models are dumb: to
predict a natural language like English, they don't need to know English
syntax or the meaning in English words, or what words go with what other
words. Similarly, for predicting code, an *n*-gram language model *knows
nothing about the syntax of the language it's predicting*. So what
*does* it have to know?

Just the *tokens* of the programming language. **If we can tokenize it, we
can predict it.** And do a whole bunch of nifty things, but I'll get to
this later.


# Future applications

## Corpora


## Tokenizing

"n-gram models are so easy," I said. "All you need to know are the tokens
of a language!" Unfortunately, that's easier said than done. Originally,
I thought that I'd just use the tokens that the syntax highlighter spits
out. It needs to do *some* tokenizing in order to do the syntax
highlighting, after all. Unfortunately, the results weren't nice, clean
tokens like `for`, `i`, `in`, `range` or even entire strings. Since all
that the grammars for syntax highlighting do is... highlight syntax,
they don't care about things like forming proper 

### Solution

A *parameterized* tokenizer. That is, a general tokenizer that takes
a configuration file, and can tokenize most of the languages being used
today. This stems from the observation that the lexical models from
programming language to programming language don't change very much. Is
tokenizing Java really *that* much different from tokenizing *C*? So why
not capture the *differences* in configuration file, and have one
tokenizer that can do. Again, this might be easier said than done. But
the result is

## Whitespace

# Improvements

# Localness

# Idioms


[Naturalness]: http://macbeth.cs.ucdavis.edu/natural.pdf
[UnnaturalCode]: https://github.com/orezpraw/unnaturalcode
[MITLM]: https://code.google.com/p/mitlm/
[Abram]: https://www.youtube.com/watch?v=5LicSW5nNd8
[Hindle]:  http://softwareprocess.es/
[GHTorrent]: http://ghtorrent.org/
[Atom]: https://atom.io/packages/gamboge
[NLP]: http://en.wikipedia.org/wiki/Natural_language_processing
[ngrams]: http://en.wikipedia.org/wiki/N-gram#n-gram_models

# To research:

ICSE paper: specific phrases they used + applications
SwiftKey + predictive typers



