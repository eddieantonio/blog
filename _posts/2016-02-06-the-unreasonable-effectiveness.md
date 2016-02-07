---
title:  The Unreasonable Effectiveness of Traditional Information Retrieval in Crash Report Deduplication
---

Last week, [Joshua Charles Campbell][josh], [Abram Hindle][abram], and
I wrote a paper on crash report bucketing.

You know when a program crashes, and it asks you to "Send a report," so
you just click "Okay" to make the message go away? This paper addresses
the other side of that story, where thousands of people dismiss that
message with an innocent "Okay" every single day leads to a deluge of
crash reports that leave the developers with more reports than they know
how to deal with.

We developed and evaluated a technique called [PartyCrasher][] that's
like Google for crash reports. Basically, we get the thousands of
crashes, do some very basic text search, and find a "bucket" of crashes
that look most like it.

![Check out the crash in the bucket]({{ site.baseurl
}}/images/unreasonable/crashbuckit.svg)

Here's the official abstract:

> Organizations like Mozilla, Microsoft, and Apple are flooded with
> thousands of automated crash reports per day. Although crash reports
> contain valuable information for debugging, there are often too many
> for developers to examine individually. Therefore, in industry, crash
> reports are often automatically grouped together in buckets. Ubuntu’s
> repository contains crashes from hundreds of software systems
> available with Ubuntu. A variety of crash report bucketing methods are
> evaluated using data collected by Ubuntu’s Apport automated crash
> reporting system. The trade-off between precision and recall of
> numerous scalable crash 7 deduplication techniques is explored. A set
> of criteria that a crash deduplication method must meet is presented
> and several methods that meet these criteria are evaluated on a new
> dataset. The evaluations presented in this paper show that using
> off-the-shelf information retrieval techniques, that were not designed
> to be used with crash reports, outperform other techniques which are
> specifically designed for the task of crash bucketing at realistic
> industrial scales. This research indicates that automated crash
> bucketing still has a lot of room for improvement, especially in terms
> of identifier tokenization.

Still interested? [Read the preprint!][preprint]

[abram]: http://softwareprocess.es/
[josh]: http://jcc.space/
[preprint]: https://peerj.com/preprints/1705v1/
[PartyCrasher]: https://github.com/orezpraw/partycrasher
