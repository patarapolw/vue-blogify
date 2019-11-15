Markdown-customizable (Showdown.js) static blogging platform

## How to use

- Create a new folder with `config.yaml` (and perhaps `git init`)
- `git submodule add https://github.com/patarapolw/vue-blogify.git`
- `npm i ./vue-blogify`

## Language support

This blog not only support Markdown, but also Pug via <https://github.com/patarapolw/hyperpug>. HTML is also supported.

## Custom markdown extension

You can easily create custom Showdown.js extension using <https://github.com/patarapolw/indented-filter>.

## Installation

```
npm i
npm run build
cd web
npm i
npm run dev
```

## Deploying to GitHub Pages

- Edit `config.yaml`
- `cd web && npm run deploy`