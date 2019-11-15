require = require("esm")(module)
const { pugFilters } = require("./src/plugins/render");
const CONFIG = require("./public/build/CONFIG.json");
const blogify = require("./blogify.json");

process.env.VUE_APP_TITLE = CONFIG.title;

module.exports = {
  publicPath: "",
  outputDir: blogify.outputDir,
  configureWebpack: (config) => {
    for (const rule of config.module.rules) {
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
  
    // (config.devServer || {}).port = 8000;
  },
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      args[0] = {
        ...args[0],
        POSTS: JSON.stringify(require("./public/build/POSTS.json")),
        FILES: JSON.stringify(require("./public/build/FILES.json")),
        CONFIG: JSON.stringify(CONFIG)
      }
      return args;
    });
  }
}