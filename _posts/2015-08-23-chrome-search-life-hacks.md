---
title:  Google Chrome Search LIFE HACKS
---

Ready for some searching **LIFE HACKS**?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">if u feel like the &quot;omw&quot; to &quot;On my way!&quot; expansion conveys unwarranted enthusiasm try deleting the &quot;!&quot; <a href="https://twitter.com/hashtag/lifehack?src=hash">#lifehack</a></p>&mdash; Tim Pope (@tpope) <a href="https://twitter.com/tpope/status/608840697463062528">June 11, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

> **TL;DR:** [Customize your search engines in Chrome][chrome-docs] with
> one-letter shortcuts.


But before I get into that, here are some nifty documentation searching
tricks you can use anywhere---not just in Chrome.

## Use `mdn.io`

If you're constantly looking up web development documentation (think
HTML 5, CSS, and standard JavaScript/DOM stuff), just type this in your
address bar:

    mdn.io/[literaly any search term ever]

And receive the top result on the [Mozilla Developer Network][mdn].

![Using mdn.io]({{ site.baseurl }}/images/chrome-search/using-mdn.gif)

This avoids a trip to Google and avoids the [(formerly attrocious)
w3schools landmines][w3s] that inevitably spring up when in search for
that precious, precious documentation.

## But seriously, use `devdocs.io`

But if you're looking for documentation in general---not just web
documentation---use [devdocs.io][]. It pools a bunch of documentation
sources, including common JavaScript libraries like [Underscore][] and
[jQuery][], as well as sourcing the entirety of MDN in its results. It's
even got Python, Ruby, and C documentation!

You can customize what sources it uses and even [use it
offline][devdocs-offline]!

# Google Chrome's Search Engines

But searching can get even better if you customize your search engines
in Google Chrome. The official docs are [a bit sparse][chrome-docs], so
I'll take you through it:

First, go to Chrome's settings and find the search category. Then select
"Manage search engines...".

![Chrome Settings]({{ site.baseurl }}/images/chrome-search/01-settings.png)

In this modal, start tinkering around with the boxes on the lower pane.
If you visit a site in Chrome (not in incognito mode, of course), it may
declare information about how to search it; Chrome automatically
registers this information and dumps the website here. So, if you
haven't already, give [devdocs.io][] a visit, and it should show up in
this list.

![Manage Search Engines]({{ site.baseurl }}/images/chrome-search/02-search-engines.png)

Next, edit the value in the middle column; this is the shortcut you can
use to search quickly by simply typing this string in the omnibox
(address bar) and pressing <kbd>tab</kbd> or <kbd>space</kbd>. For
frequent searches like devdocs, I'd recommend using a one-letter
shortcut:

![Renaming Search Engine shortcuts]({{ site.baseurl }}/images/chrome-search/03-rename.png)

And you're done! Go to the omnibox, and type the shortcut
you just registered and search away!

![Using `d` for devdocs]({{ site.baseurl }}/images/chrome-search/using-d.gif)

## My search engines

`g` does an I'm feeling lucky search---it sends you directly to the
first matching search result, if that result is overwhelmingly probable.
This is most often what you want and it skips a trip to a Google page;
having to select the first search result is so *boring*! Occasionally,
no page will be significantly more probable than the rest, so it will
just dump you onto a regular old Google search page. Before I knew of
devdocs, I'd often type things like `g php mongodb` to get me straight
to the documentation that I wanted. This is still useful to work for
minor libraries, especially those hosted on GitHub.

![Using `g` for "I'm feeling lucky"]({{ site.baseurl }}/images/chrome-search/using-g.gif)

`d` searches [devdocs.io][], of course.

`en` does English Wikipedia. Similarly, `es` searches Spanish Wikipedia.
A mini-lifehack: if you're not sure what a term translates to in
a different language, (say, some exotic fruit with a colloquial name
such as what my parents call [mamón][]), simply search for it in the
source language, then go to the sidebar and pick the language you want
it translated into. It may be obvious, but I find it incredibly
useful---more useful than trying my luck with using Google Translate.

`y` does YouTube because YouTube.

# Happy searching!

[mamón]: https://es.wikipedia.org/wiki/Mammea_americana
[Underscore]: http://devdocs.io/underscore/
[chrome-docs]: https://support.google.com/chrome/answer/95426
[devdocs-offline]: http://devdocs.io/offline
[devdocs.io]: http://devdocs.io/
[jQuery]: http://devdocs.io/jquery/
[mdn]: https://developer.mozilla.org/en-US/
[w3s]: https://github.com/paulirish/w3fools/issues/50
