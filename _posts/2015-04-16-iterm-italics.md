---
title: Italics in iTerm2 without breaking SSH
---

[iTerm2][] is probably the reason I stick to developing in OS X [instead
of switching to a moderately saner alternative][Grey]. It's a brilliant
terminal emulator with tonnes of nifty features---none of which I'm
willing to give up!

A minor example is inline italics fonts. Compare editing in Markdown in
[vim-pandoc][] with italics:

![vim italics]({{ '/images/iterm-italics/after.png' | relative_url }})

and without:

![vim sans-italics]({{ '/images/iterm-italics/before.png' | relative_url }})

Due to fun `terminfo` settings, my `$TERM` setting of
choice---`xterm-256color`---does not claim to have codes to turn on and
off italics. [Other posts][pearce] have suggested creating a copy that
extends `xterm-256color` and setting iTerm's `$TERM` variable
appropriately. I disagree.

The problem is when SSHing into machines without your custom terminfo
entry installed---other machines don't know what to do with it. They
resort to safe defaults which means everything gets screwy. In order to
get around it, you have to make sure to add an appopriate line to your
remote `.bash_profile`, `.zshrc` or the similar file that sets your
`$TERM` to `xterm-256color` or at least something compatible, lest you
suffer losing all of your pretty visual features in Vim. To me, this is
unacceptable.

# My solution

Simply override the local entry for `xterm-256color`! Sure, it's a bit
uncouth, but you're only affecting your own machine, right? The worst
that can happen is that remote machines won't display italics.
Conversely, you _probably_ don't SSH into your Mac, so the fact that you
have a "damaged" terminfo entry is entirely irrelevant. If you're still
with me, do the following:

Write the installed terminfo entry to a temporary text file using `infocmp`:

    infocmp xterm-256color > /tmp/xterm-256color.terminfo

Then, append the magic line `sitm=\E[3m, ritm=\E[23m,` which defines the
escape codes that iTerm will interpret to render things in pretty
italics:

    printf '\tsitm=\\E[3m, ritm=\\E[23m,\n' >> /tmp/xterm-256color.terminfo

And now overwrite the existing terminfo entry for `xterm-256color`:

    tic /tmp/xterm-256color.terminfo

Now open a *new* terminal and type the following to test:

    echo `tput sitm`italics`tput ritm`

---

Here are all the steps combined in one dangerously copy-pastable
snippet:

    infocmp xterm-256color > /tmp/xterm-256color.terminfo
    printf '\tsitm=\\E[3m, ritm=\\E[23m,\n' >> /tmp/xterm-256color.terminfo
    tic /tmp/xterm-256color.terminfo

# Caveats

If you upgrade OS X (say from Mavericks to Yosemite), you **will** have
to do this all over again. Because Apple isn't too keen with you
administering your own system. ¯\\\_(ツ)\_/¯

[iTerm2]: http://iterm2.com/downloads.html
[vim-pandoc]: https://github.com/vim-pandoc/vim-pandoc
[pearce]: https://alexpearce.me/2014/05/italics-in-iterm2-vim-tmux/
[Grey]: http://www.hellointernet.fm/podcast/23
