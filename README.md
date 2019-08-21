# Vue Blogify

Vue CLI-based static blogging platform

## How to use

- Edit `config.yaml`
- Edit layouts (using `*.vue`) in `src/layouts/`
- Add posts in `public/posts`, preferrably in `public/posts/<YEAR>/<MONTH>`. HTML, Pug and Markdown are supported.

## Installation

- I use NPM, and Vue CLI 3, so `npm install`
- Run using `npm run dev`

## Building and deploying

- Build using `npm run build`
- Deploy as static website, maybe using [gh-pages](https://www.npmjs.com/package/gh-pages).
- To deploy to most static websites, set `publicPath` in `vue.config.js` to `/`.
    - For non-user GitHub Pages, set `publicPath` to `/<REPO_NAME>`.
    - For Cordova, Electron, or local, set `publicPath` to `""`.
    - Note that, if `publicPath` is not `/`, [Vue router's History Mode](https://router.vuejs.org/guide/essentials/history-mode.html) might not work.
    - For instructions, see <https://cli.vuejs.org/guide/deployment.html#github-pages>

## Example

See <https://vue-blogify.patarapolw.now.sh>
