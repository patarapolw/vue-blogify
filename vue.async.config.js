require = require("esm")(module)
const glob = require("fast-glob");
const fs = require("fs");
const { pugFilters } = require("./src/plugins/render");
const matter = require("gray-matter");
const yaml = require("js-yaml");

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
    POSTS: JSON.stringify(fs.existsSync("public/posts") 
    ? (await glob("public/posts/**/*.{md,markdown,pug,html}")).map((f) => {
      const { data, content } = matter(fs.readFileSync(f, "utf8"));
      return {
        ...data,
        teaser: content.split("===")[0],
        filename: f
      }
    }) : []),
    CONFIG: JSON.stringify(yaml.safeLoad(fs.readFileSync("config.yaml", "utf8"))),
    README: JSON.stringify(fs.readFileSync("README.md", "utf8"))
  };
}

module.exports = (api, options) => {
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