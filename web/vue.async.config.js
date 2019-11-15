require = require("esm")(module)
const glob = require("fast-glob");
const { pugFilters } = require("./src/plugins/render");
const matter = require("gray-matter");
const { ROOT, CONFIG } = require("../config");
const fs = require("fs-extra");
const del = require("del");
const dotProp = require("dot-prop");

process.env.VUE_APP_TITLE = dotProp.get(CONFIG, "title");

async function initAndGetPosts() {
  await del([
    "public/**",
    "!public",
    "!public/index.html"
  ]);

  if (fs.existsSync(`${ROOT}/${CONFIG.root}`)) {
    fs.copySync(`${ROOT}/${CONFIG.root}`, "public", {recursive: true});
  }

  if (fs.existsSync("public/blog")) {
    return (await glob("public/blog/**/*.{md,markdown,pug,html}")).map((f) => {
      const { data, content } = matter(fs.readFileSync(f, "utf8"));
      return {
        ...data,
        teaser: content.split("===")[0],
        url: "/blog/" + f.split("/blog/")[1]
      }
    });
  }

  return [];
}

function configureWebpack(webpackConfig) {
  for (const rule of webpackConfig.module.rules) {
    if (rule.use) {
      for (const use of rule.use) {
        if (/pug/.test(use.loader)) {
          use.options = {filters: pugFilters};
        }
      }
    } else if (rule.oneOf) {
      for (const oneOf of rule.oneOf) {
        if (oneOf.use) {
          for (const use of oneOf.use) {
            if (/pug/.test(use.loader)) {
              use.options = {filters: pugFilters};
            }
          }
        }
      }
    }
  }

  (webpackConfig.devServer || {}).port = 8000;
}

function defineWebpack(webpackConfig, def) {
  webpackConfig.plugin("define").tap((args) => {
    args[0] = {
      ...args[0],
      ...def
    }
    return args;
  });
}

async function generateDefinitions() {
  return {
    POSTS: JSON.stringify(await initAndGetPosts()),
    CONFIG: JSON.stringify(CONFIG)
  };
}

module.exports = (api) => {
  api.registerCommand('build:async', async (args) => {
    const def = await generateDefinitions();

    api.configureWebpack(configureWebpack);
    api.chainWebpack((webpackConfig) => {
      defineWebpack(webpackConfig, def);
    });
    
    await api.service.run('build', args)
  }),
  api.registerCommand('serve:async', async (args) => {
    const def = await generateDefinitions();

    api.configureWebpack(configureWebpack);
    api.chainWebpack((webpackConfig) => {
      defineWebpack(webpackConfig, def);
    });

    await api.service.run('serve', args)
  })
}

module.exports.defaultModes = {
  'build:async': 'production',
  'serve:async': 'development'
}