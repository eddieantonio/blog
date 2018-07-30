---
title:  Why I made yet another Cree syllabics converter
---

![Ruben Quinn demonstrating the Cree syllabics star chart]({{ site.baseurl }}/images/yasc/ruben-quinn-star-chart.jpg)

<small> Image source: [Ruben Quinn demonstrating the Cree syllabics star chart](https://www.youtube.com/watch?v=_08Kxo424sg)</small>

Lately, I've been working on language technology for [Plains Cree].
Plains Cree is primarily written in two systems: **standard Roman
orthography** (**SRO**) and **syllabics**. Since SRO uses the Latin
alphabet---just like English---it is rather straightforward to type on
a standard Canadian English keyboard. Syllabics keyboards are an ongoing
struggle, however (I may expand on this some other time on this blog).
Therefore, if one wants to write Cree in syllabics, it is sometimes
easier to type it in SRO first, then use a *transliterator* to convert
from SRO to syllabics.

In summary, I created a new bidirectional transliterator called
[`crk_orthography`][repo]. It's a *new* transliterator, because several
transliterators already exist. So what do the others look like?

[Plains Cree]: https://en.wikipedia.org/wiki/Plains_Cree

What are the freely available transliterators?
----------------------------------------------

A quick Google search will net you at least the following SRO to
syllabics transliterators.

 - [The Maskwacîs Plains Cree Syllabic Converter][ocd][^1]
 - [The Algonquian Linguistic Atlas Cree Syllabics Converter][ala]
 - [Syllabics.net's Plains Cree Syllabics Converter][syl]

[ocd]: http://www.creedictionary.com/converter/maskwacis.php
[ala]: https://syllabics.atlas-ling.ca/
[syl]: http://www.syllabics.net/convert/plainscree

However, none of these transliterators are perfect.

[^1]: I don't have an iPhone to confirm this, but I believe this is the
    same converter bundled in the [Cree Dictionary
    app](http://www.creedictionary.com/software/index.php).

The issues
----------

### Word final "hk"

In syllabics, a word that ends with an "hk"---or "ᐦᐠ" in syllabics---are
supposed end with "ᕽ" instead. However, this replacement can never occur
in the middle of a word.

For example, the word "ê-wêpâpîhkêwêpinamâhk" ("we (and not you) are
setting it swinging"), contains both a final "hk" and a "hk" cluster in
the middle of the word. Its syllabic transcription is **ᐁᐍᐹᐲᐦᑫᐍᐱᐊᒫᕽ**.

Although [the Algonquian Linguistic Atlas's converter][ala] and
[syllabics.net's converter][syl] both handle this, the [Maskwacîs
Converter][ocd] does not, instead producing **ᐁ ᐁᐧᐸᐱᐦᑫᐁᐧᐱᓇᒪᐦᐠ**, with an
erroneous "ᐦᐠ" cluster at the end.


### Transliterating non-Cree words

Some transliterators attempt to convert every Latin character, even if
it doesn't make sense. Take the case of "Maskêkosihk Trail"---a road
that goes from Edmonton to [Enoch Cree Nation][enoch]. The City of
Edmonton unveiled the street sign, and they also unveiled an
embarrassment:

![Maskêkosihk trail rendered as "ᒪᐢᑫᑯᓯᐦᐠ  ᐟrᐊᐃl"]({{ site.baseurl }}/images/yasc/mayor-and-chief.JPG)

<small> Image source: [CBC](https://www.cbc.ca/news/canada/edmonton/renamed-maskekosihk-trail-part-of-city-s-ongoing-reconciliation-commitment-1.3446162)</small>

Not only does the syllabics transliteration of the sign contain the "hk"
error as mentioned above, but it half-transliterates *the English word*
"trail" into syllabics. The result is that "trail" is rendered as
"ᐟrᐊᐃl", which *contains Latin characters in the transliteration!*

In my opinion, an SRO to syllabics transliterator should refuse to
transliterate words that are do not have the structure of a Cree word.
However, all three of the mentioned transliterators do attempt to
transliterate "trail" with differing results:[^2]

|:----------------------------|----------|
| Maskwacîs Cree Dictionary   | ᐟrᐊᐃl    |
| Algonquian Linguistic Atlas | ᐟᕒᐊᐃᐪ    |
| Syllabics.net               | ᐟᕒᐊᐃᓬ    |


[enoch]: http://enochnation.ca/

[^2]: I wonder if the sign designer used the Maskwacîs transliterator to
    get this result.

### Long vowels

Long vowels (âêîô) are distinct from short vowels (aio) in Cree. Long
vowels are written with a dot above in syllabics. The exception is for
"ê" because it is always long; as a result, some writers also drop the
diacritic when writing "e" in SRO as well. It's important to differentiate
between long and short vowels, because it makes distinctions between
words. For example, nipiy/ᓂƣᕀ means "water" while nîpiy/ᓃᐱᕀ means
"leaf". However, there is such a thing as "plain" script, where the
vowel dots are omitted, and [pointed] script where the vowels have all
dots.

Another complication is that the "standard" Roman orthography in
practice has multiple conventions for writing long vowels: using
a macron (◌̄) and using a circumflex (◌̂).[^3]

How do the various converters handle long vowel diacritics? [The Maskwacîs
converter][ocd] does not produce dots for long vowels at all, however it
accepts both macrons and circumflexes as input. The [Algonquian Lingustic
Atlas's converter][ala] not only produces dots, but supports input in
either macrons or circumflexes. The [syllabics.net converter][syl] does
worst of all, handling *only* macrons for long vowels. It simply spits
out characters written with circumflexes. Additionally, it does not
handle "ê" without an diacritics, which all other converters do.


[pointed]: https://en.wikipedia.org/wiki/Canadian_Aboriginal_syllabics#Pointing

[^3]: Anecdotally, I find that most writers near Edmonton and Maskwacîs
    prefer circumflexes to macrons; however noted Algonquian linguist
    Arok Wolvengrey prefers macrons. Heck, Jean Okimāsis writes her
    surname with a macron!

### Other odds and ends

Other issues for syllabics converters include how they deal with dashes,
how they deal with combining diacritics, rather than pre-composed
characters, and whether they produce the correct Unicode characters for
the syllabics rather than very convincing look-alikes. There's also the
[sandhi orthographic rule][sandhi], but honestly, I'm not sure I fully
comprehend how to apply this rule myself.


[sandhi]: https://crk-orthography.readthedocs.io/en/stable/glossary.html#term-sandhi

### Summary

Here's a breakdown of the previous issues, and whether each
transliterator can handle it correctly.

|                             | Word-final "hk"   | Non-Cree words   | Long vowels   |
|:----------------------------|------------------:|-----------------:|--------------:|
| Maskwacîs Cree Dictionary   | ❌                | ❌               | ❌            |
| Algonquian Linguistic Atlas | ✅                | ❌               | ✅            |
| Syllabics.net               | ✅                | ❌               | ❌            |


Where's the source code?
------------------------

The most pressing issue to me personally is that I cannot find source
code for any of these converters! This means that if other people  want
to incorporate a converter into their own app without an active internet
connection, they can't. They have to either reverse-engineer the
converters online, or write their own code to do the conversion.


`crk_orthography`: an open-source Python library for syllabics conversion
-----------------------------------------------------------------------

My solution was to create a [Python library][pypi] that is **free and
open source**.

It does handles all the issues previously mentioned. Try it with the
following test cases:

 - [Maskekosihk trail](https://crk-orthography-demo.herokuapp.com/#!sro:Maskekosihk%20trail)
 - [êwêpâpîhkêwêpinamahk](https://crk-orthography-demo.herokuapp.com/#!sro:êwêpâpîhkêwêpinamahk)
 - [ēwēpâpīhkēwēpinamahk](https://crk-orthography-demo.herokuapp.com/#!sro:ēwēpâpīhkēwēpinamahk)
 - [ewepapihkewepinamahk](https://crk-orthography-demo.herokuapp.com/#!sro:ewepapihkewepinamahk)

<!--
It can also convert from syllabics to SRO:

 - [ᒣᕒᐃᕀ](https://crk-orthography-demo.herokuapp.com/#!syl:ᒣᕒᐃᕀ)
 - [ᐁᑯᓯ](https://crk-orthography-demo.herokuapp.com/#!syl:ᐁᑯᓯ)

-->

The source code for `crk_orthography` can be found on its [GitHub
page][repo], but it can also be seamlessly incorporated into a Python
project that uses `pip` by installing it with:

    pip install crk_orthography

This also installs command line utilities that can transliterate
entire text files written in SRO ([sro2syllabics]) and back again
([syllabics2sro]).

[sro2syllabics]: https://github.com/eddieantonio/crk_orthography#sro2syllabics
[syllabics2sro]: https://github.com/eddieantonio/crk_orthography#syllabics2sro


The future
----------

I hope in future versions to add support for Woods Cree and other West
Cree dialects. There are also a few interesting things that can be done
to make sure SRO and syllabics conversions can be completely reversed
without losing information about morpheme boundaries.

[repo]: https://github.com/eddieantonio/crk_orthography
[pypi]: https://pypi.org/project/crk-orthography/
