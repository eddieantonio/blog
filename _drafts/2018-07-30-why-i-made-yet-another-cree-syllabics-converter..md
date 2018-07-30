---
title:  Why I made yet another Cree syllabics converter
---

![Ruben Quinn demonstrating the Cree syllabics star chart]({{ site.baseurl }}/images/yasc/ruben-quinn-star-chart.jpg)

<small> Image source: [Ruben Quinn demonstrating the Cree syllabics star chart](https://www.youtube.com/watch?v=_08Kxo424sg)</small>

Lately, I've been working on language technology for [Plains Cree].
Plains Cree is primarily written in two systems: **standard Roman
orthography** (**SRO**) and **syllabics**. Since SRO uses the Latin
alphabet, just like English, it is rather straightforward to type on
a standard Canadian English keyboard. Syllabics keyboards are an ongoing
struggle however (I may expand on this some other time on this blog).
Therefore, if one wants to write Cree in syllabics, it is sometimes
easier to type it in SRO first, then use a *transliterator* to convert
from SRO to syllabics.

[Plains Cree]: https://en.wikipedia.org/wiki/Plains_Cree

What are the freely available transliterators?
----------------------------------------------

A quick Google search will net you at least the following SRO to
syllabics transliterators.

 - [The Maskwacîs Plains Cree Syllabic Converter][ocd]
 - [The Algonquian Linguistic Atlas Cree Syllabics Converter][ala]
 - [Syllabics.net's Plains Cree Syllabics Converter][syl]

[ocd]: http://www.creedictionary.com/converter/maskwacis.php
[ala]: https://syllabics.atlas-ling.ca/
[syl]: http://www.syllabics.net/convert/plainscree

However, none of these transliterators are perfect.

The issues
----------

### Word final "hk"

In syllabics, a word that ends with an "hk"---or "ᐦᐠ" in syllabics---are
supposed end with "ᕽ" instead. However, this replacement can never occur
happen in the middle of a word.

For example, the word "ê-wêpâpîhkêwêpinamâhk" ("we are setting it to
swing"), contains both a final "hk" and a "hk" cluster in the middle of
the word. Its syllabic transcription is **ᐁᐍᐹᐲᐦᑫᐍᐱᐊᒫᕽ**.

Although [the Algonquian Linguistic Atlas's converter][ala] and
[syllabics.net's converter][syl] both handle this, the [Maskwacîs
Converter][ocd] does not, instead producing **ᐁ ᐁᐧᐸᐱᐦᑫᐁᐧᐱᓇᒪᐦᐠ**, with an
erroneous "ᐦᐠ" cluster at the end.


### Transliterating non-Cree words

Some transliterators attempt to convert every Latin character, even if
it doesn't make sense. Take the case of "Maskêkosihk Trail"---a road
that goes from Edmonton to [Enoch Cree Nation][enoch]. The City of
Edmonton unveiled the street sign, and what they unveiled was an
embarrassment:

![Maskêkosihk trail rendered as "ᒪᐢᑫᑯᓯᐦᐠ  ᐟrᐊᐃl"]({{ site.baseurl }}/images/yasc/mayor-and-chief.JPG)

<small> Image source: [CBC](https://www.cbc.ca/news/canada/edmonton/renamed-maskekosihk-trail-part-of-city-s-ongoing-reconciliation-commitment-1.3446162)</small>

Not only does the syllabics transliteration of the sign contain the "hk"
error as mentioned above, but it half-transliterates *the English word*
"trail" into syllabics. The result is that "trail" is rendered as
"ᐟrᐊᐃl", which *contains Latin characters in the transliteration!*

In my opinion, an SRO to syllabics transliterator should refuse to
transliterate words that are obviously not Cree.
However, all three of the mentioned transliterators do attempt to
transliterate "trail" with differing results:

|:--------------------------|--------|
|Maskwacîs Cree Dictionary  | ᐟrᐊᐃl  |
|Algonquian Language        | ᐟᕒᐊᐃᐪ  |
|Syllabics.net              | ᐟᕒᐊᐃᓬ  |

(I wonder if the sign designer used the Maskwacîs transliterator to get this result).

[enoch]: http://enochnation.ca/

### Long vowels and "pointed" script

Cannot deal with "pointed" scripts (i.e., long vowels, either macrons or
circumflexes): compare http://www.syllabics.net/convert/plainscree : ᐁᐍᑊâᐲᐦᑫᐍᐱᓇᒪᕽ
     with crk_orthography: https://crk-orthography-demo.herokuapp.com/#!sro:%C4%93w%C4%93p%C3%A2p%C4%ABhk%C4%93w%C4%93pinamahk

(Cree Dictionary does not produce accents)

### Online-only


### Summary


|                           | Word-final "hk" | non-Cree words | long vowels |
|:--------------------------|----------------:|---------------:|------------:|
|Maskwacîs Cree Dictionary  |        ✘        |       ✘        |     ✘       |
|Algonquian Language        |        ✅       |       ✘        |     ✅      |
|Syllabics.net              |        ✅       |       ✘        |     ✘       |


Where's the source code?
------------------------

MOST IMPORTANTLY: I cannot get the source code for the other converters.
This means that if other people need a converter without an internet
connection, or if they want to incorporate a converter into their own
app, they can't. They have to either reverse-engineer the converters
online, or make their own version. Yet another converter! So my solution
was to create a library that is free and open source. You can get the
source code online, and if you're using the Python programming language,
the converter can be installed like any other "software library". My
source code is available at
https://github.com/eddieantonio/crk_orthography

[repo]: https://github.com/eddieantonio/crk_orthography
[pypi]: https://pypi.org/project/crk-orthography/

https://crk-orthography-demo.herokuapp.com/#!sro:%C4%93w%C4%93p%C3%A2p%C4%ABhk%C4%93w%C4%93pinamahk
