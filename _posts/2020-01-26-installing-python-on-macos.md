---
title:  Installing Python on macOS (without going insane)
---

If you're like me (or [Randall Munroe][xkcd]), the results of typing
`which -a python` on your macOS machine is... devastating:

[![xkcd about Python path](https://imgs.xkcd.com/comics/python_environment.png)](https://xkcd.com/1987/)

[xkcd]: https://xkcd.com/

After many years of frustration, here are my recommendations for
installing Python and Python written utilities on macOS.

So what do I use Python for?
----------------------------

I use Python for **library development**, **web development with
Django**, and **scripting**. I use Python primarily from the **command
line**. I don't really use Python for data science—at least not with
Jupyter notebooks. I have absolutely no idea how to use `conda`. If you
use Python primarily for data science, this guide is _not_ written
for you—there may be better solutions that I simply do not use.
Everybody else, read on!


Do **NOT** install Python from python.org
=================================

It seems pretty obvious that you should install Python using the
installer from Python's official website.

![Do you want to die?]({{ '/images/installing-python/do-you-want-to-die.jpg' | relative_url }})

The problem with this is that Python installs itself in a place that is
difficult to manage _without_ using administrator (`sudo`) privileges.
This is okay for beginners, or people who only touch Python every so
often. However, for _my_ use cases, where I'm testing my code in
multiple versions of Python, and have multiple [virtual environments][],
this becomes bad news.

[virtual environments]: https://docs.python.org/3/tutorial/venv.html


Homebrew
========

If you haven't used [Homebrew][] to install things on your Mac, go get it
right now! I'll wait.

[Homebrew]: https://brew.sh/

We're going to use Homebrew to install `pyenv`.

Do **not** install Python with Homebrew, though. Instead...


Manage multiple Python versions with `pyenv`
============================================

Install [pyenv][] so that you can install multiple versions of Python
and switch between them with ease:

```sh
brew install pyenv
```

[pyenv]: https://github.com/pyenv/pyenv


Putting `pyenv` in charge by adding it to the `PATH`
----------------------------------------------------

Now you need to make sure your system can see the **shims** that `pyenv`
creates. Shims are fake versions of _all_ programs associated with
a Python install. This allows `pyenv` to intercept a command and
redirect it to the current or desired version of Python.

To do this, **prepend** the shim directory to your path. Add this to the
bottom of your [shell startup file][] (either `~/.zshrc` or
`~/.bash_profile` depending on either how new your Mac is or if you've
customized your shell ¯\\_(ツ)\_/¯):

[shell startup file]: https://stackoverflow.com/questions/15101559/terminal-where-is-the-shell-start-up-file


```sh
export PATH="$HOME/.pyenv/shims:$PATH"
```

The shim directory must be the **first** thing in your path, or at
least, it has to come _before_ `/usr/bin/` and `/usr/local/bin`.

Now that you have added the line to your shell startup file,
**restart your shell** for it to take effect. You can do this by closing
your current terminal tab/window, and opening a new
one, or in the same terminal/tab, you can do the following:

```sh
exec $SHELL
```

Let's make sure our `PATH` looks right. To look at your path, use the
following line:

```sh
printenv PATH
```

This is what my `PATH` environment variable looks like on my laptop:

```
/Users/eddieantonio/.pyenv/shims:/usr/local/bin:/usr/local/sbin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin:/opt/X11/bin:/Users/eddieantonio/.local/bin
```

<small>Kind of. I removed a few entries from my PATH to save myself from
embarrassment.</small>


Installing a Python version!
----------------------------

Now let's install a modern version of Python. As of this writing, the
current stable version of [CPython][] is Python 3.8.1. Let's install it with
Pyenv!

```sh
pyenv install 3.8.1
```

If you want to see all the versions of Python that `pyenv` can install
for you, you can list them:

```sh
pyenv install --list
```

This should be a pretty long list, with all kinds of alternate Python
interpreters, including [PyPy][] and [Stackless][]. Install as many as
you need!

[PyPy]: https://pypy.org/
[Stackless]: https://github.com/stackless-dev/stackless
[CPython]: https://en.wikipedia.org/wiki/CPython


Choose your default Python
--------------------------

Now tell pyenv the default version you want to use. Do this with `pyenv
global`:

```sh
pyenv global 3.8.1
```

Now try it! Check what happens when you ask for the current Python
version:

```
$ python --version
Python 3.8.1
```

Since I'm paranoid that _something_ on my system will break because it's
expecting `python` to be Python 2.7 (yikes!) that's pre-installed by
Apple on my system, I do the following:

```sh
pyenv global system 3.8.1
```

This instructs to `pyenv` that it should check if the executable is
installed on the system path first, and _then_ try the selected Python
version—in my case, CPython 3.8.1. You might be able to get away with
`pyenv global 3.8.1` and not use the pre-installed system Python at all.

If you don't see the version you want, perhaps your installed version of
`pyenv` is too old. Upgrade `pyenv` using Homebrew:

```sh
brew upgrade pyenv
```


pipx
====

I often want to install executables that are written in Python, and
availble to install via `pip`. For example, I like installing
[black][] to format my code for me.

**Do not** do the following 🙅:

```sh
sudo pip install black
```

Instead, I'd like these globally-installed executables to be installed,
without installing themselves on my Python path.

This is exactly the problem that [pipx][] tries to solve.

Install it using Homebrew:

```sh
brew install pipx
```

Then install your favourite Python executables 👍!

```sh
pipx install black
```

Sadly, `pipx` will only install one package at a time, but we can do
some arcane shell-fu to install multiple packages in one command line.
Use `xargs -n1` to call an command with exactly one of its input
arguments:

```sh
# Install isort, mypy, snakeviz, pygments, and tqdm all on one line!
echo isort mypy snakeviz pygments tqdm | xargs -n1 pipx install
```


[black]: https://black.readthedocs.io/en/stable/
[pipx]: https://github.com/pipxproject/pipx/


Managing project environments with poetry
=========================================

For each of my projects, I want an isolated environment to install
packages. Python has historically done this... poorly. The hacky
solution for years has been [virtual environments][], but they require
a lot of manual work to remember to create a virtual environment,
activate it, place all the packages you installed in `requirements.txt`.
What a mess!

Then came [pipenv][]. I've used pipenv for about a year, and noticed
a notable improvement in my workflow. However, some of the decisions
that `pipenv`'s original creator made were questionable to say the
least. `pipenv` is under new management, but some of the decisions and
attitudes of the original creator have left its scars on the current
state of the project.

So then I switched to [Poetry][].

[pipenv]: https://github.com/pypa/pipenv
[Poetry]: https://github.com/python-poetry/poetry

Poetry is my current choice for project dependency management. You can
install it with Homebrew:

```sh
brew install poetry
```

Basic usage can be found on [Poetry's website][poetry docs], but here's
a quick tutorial:

Make a brand new project using `poetry new`:

```sh
poetry new my-awesome-app
```

`cd` into the project, and install some dependencies:

```sh
cd my-awesome-app
poetry add django
```

You can also specify dependencies you only use in development—that is,
these packages should _not_ be installed when somebody downloads your
library, or deploys your app somewhere.

```sh
poetry add --dev black isort pylint
```

To actually _run_ my application, I tend to use `poetry shell` to
activate the current environment.

```sh
poetry shell
```

For example, in my Django app:

    # this will not work -- not in virtualenv:
    $ django-admin version
    zsh: command not found: django-admin
    $ poetry shell
    Spawning shell within /Users/eddieantonio/Library/Caches/pypoetry/virtualenvs/my-awesome-app-VMVa3PrX-py3.7
    # this works now 😄
    (my-awesome-app-VMVa3PrX-py3.7) $ django-admin version
    3.0.2

This is just scratching the surface of using Poetry. [Read the
docs][poetry docs] to learn more.

[poetry docs]: https://python-poetry.org/docs/basic-usage/


Putting it all together: installing Python on macOS
===================================================

Here is a dangerously copy-pastable snippet to install all the things:

```sh
# Install Homebrew:
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install pyenv, pipx, and poetry with Homebrew:
brew install pyenv pipx poetry

# Make sure pyenv is on the path:
echo 'export PATH="$HOME/.pyenv/shims:$PATH"' > ~/.zshrc

# Restart your shell (so we have the updated path):
exec $SHELL

# Install a modern version of Python using pyenv:
# (Python 3.8.1 is the latest stable version as of this writing)
pyenv install 3.8.1

# Tell pyenv to try using the system Python 2.x before using our pyenv
# installed Python 3.8.1
pyenv global system 3.8.1

# Install Python-based utilities globally using pipx:
# May I suggest black, isort, and mypy?
echo black isort mypy | xargs -n1 pipx install
```

Happy coding! 🍎🐍
