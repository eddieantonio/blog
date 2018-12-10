---
title:  Deploying a Parcel app with Now
---

Last week, I deployed [a single-page web application][syllabics.app] on [Now.sh][Now] built with the [Parcel][] bundler. Here's how!


## Setup

The files of my web application started off looking like this:

```
.
├── img/
├── index.html
├── main.js
├── package.json
└── styles.css
```

A single `index.html` entry point, with logic in `main.js` and styles provided by `styles.css`. There are some PNGs in `img/` used for favicons. They're all authored in a human-readable way—that is, with whitespace, and meaningful variable names.

Let's bundle this with [Parcel][]!

First, install `parcel-bundler`:

```sh
npm install parcel-bundler --save-dev
```

Then, build `index.html` with Parcel:

```sh
npx parcel build index.html
```

Next, in a new folder called `dist/` you'll see `index.html` and all the files included by it in `dist/`. But, they'll be [minified][] and [content hashed][]!

With minification, `index.html` gets a modest 9.2% size decrease from 3.8 KiB to 3.45 KiB. However, `styles.css` goes from 2.7 KiB to  995 bytes, a 63.1% decrease!


## Setting up `package.json`


I only want to commit my _source code_ to GitHub; I don't want to remember to build my package and push the resulting build products every time I change a single line of code (I know [git pre-commit hooks][git-hooks] exist, but... eww, no). Luckily, Now will run a build step for you before deploy!

I used Now's official [static builder][@now/static-builder]. `@now/static-builder` will run a script specified in `package.json`. It expects that the results of the build will be created in a folder called `dist/`. It just so happens that **Parcel places build output in `dist/` by default**!

To setup, `@now/static-builder`, I added the following line to the [`scripts` key][scripts] in `package.json`:

```json
{
   "scripts": {
      "now-build": "parcel build index.html"
   }
}
```

Notice how this is the same line as before, just minus the `npx` part.

The nice thing about this, is that we can test if our build works by running the following command locally:

```sh
npm run now-build
```

## Setting up `now.json`

To configure the `@now/static-build` builder, add a line to the `builds` key in `now.json`. Luckily, `now.json` doesn't tend to have a lot of configuration, so the following is a complete `now.json` that you can copy-paste, and it will work in your app:

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@now/static-build" }
  ]
}
```

## Deploying

From here, it's up to your Now setup. I tend to push to a new branch in GitHub, and create a pull request. With [Now's GitHub Integration][], this will automatically start the build and deploy it when it's successful. I've added an alias to my `now.json`, so the latest pull request will be deployed as soon as it's merged.

## Other things

There's an custom [Now builder on npm][now-parcel], but I decided against using this, I'm wary of adding low star-count dependencies, ever since that [event-stream incident][]. It turns out that using `@now/static-build` was fairly straightforward, so the custom package didn't seem worth adding an extra requirement.

That's all I got. I really like how relatively simple and painless it was to create a fast, minified, cache-friendly single-page web application with Now and Parcel. Getting a neat domain was pretty simple too! It's bring us back to the simpler times when we'd deploy a new version of our application by uploading our PHP file via FTP to some random server. Ah, memories!


[@now/static-builder]: https://zeit.co/docs/v2/deployments/official-builders/static-build-now-static-build#how-to-use-it
[Now's GitHub Integration]: https://zeit.co/github
[Now]: https://zeit.co/now
[Parcel]: https://parceljs.org/
[content hashed]: https://en.parceljs.org/production.html#file-naming-strategy
[event-stream incident]: https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident
[git-hooks]: https://git-scm.com/book/uz/v2/Customizing-Git-Git-Hooks
[minified]: https://en.wikipedia.org/wiki/Minification_(programming)
[now-builds]: https://zeit.co/docs/v2/deployments/builds/#sources-and-outputs
[now-parcel]: https://github.com/sergiodxa/now-parcel
[scripts]: https://docs.npmjs.com/files/package.json#scripts
[syllabics.app]: https://syllabics.app/
