---
title:  Judging a Commit by Its Cover
---

For the [MSR 2016 Challenge][msr], I applied **data science** to test
a gut feeling I had: commits with weird, unusual log messages are often
of lower quality than code with boring, ordinary commit messages.

So: Are commits that *look* fishy...

[![Commit message: "Maybe now it's working?"]({{ site.baseurl }}/images/judging-commits/josh-commit.png)][commit]

...actually hiding dubious code?

Is my hunch true? (Spoilers: <span class="spoliers">Marginally</span>).

To test, we correlated build status from [Travis-CI][travis] with [*n*-gram
language models][n-grams] on commit messages.

Intrigued? [Read the preprint!][preprint] (And fork the [replication
code][code] and [data][data]!)

Acknowledgements to my supervisor, [Abram Hindle], and my colleagues [S.
Kalen Romansky][kalen], and [Shaiful Chowdhury][shaiful] for their
reviews and comments.

[msr]: http://2016.msrconf.org/#/challenge
[commit]: https://github.com/orezpraw/unnaturalcode/commit/7c15e369fe58b1537141eb31f28f549a01d10380
[preprint]: https://peerj.com/preprints/1771/?td=bl
[travis]: https://travis-ci.org/
[Abram Hindle]: http://softwareprocess.es
[kalen]: http://dl.acm.org/author_page.cfm?id=88158695357&coll=DL&dl=ACM&trk=0&cfid=583931408&cftoken=65482945
[shaiful]: https://sites.google.com/site/shaifulhome/home
[code]: https://github.com/eddieantonio/judging-commits
[data]: https://drive.google.com/open?id=0ByMXxDHxG3WSbzEtc1BoTk1NcTA