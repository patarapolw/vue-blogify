const yaml = require("js-yaml");
const fs = require("fs-extra");
const del = require("del");
const glob = require("fast-glob");
const path = require("path");
const matter = require("gray-matter");

function loadConfig() {
  const CONFIG = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), "config.yaml"), "utf8"));
  CONFIG.theme = CONFIG.theme || "bootstrap";

  const blogify = {
    themeDir: `${__dirname}/${CONFIG.theme}`,
    outputDir: path.join(process.cwd(), CONFIG.outputDir || "dist")
  };

  const POSTS = [];
  const FILES = [];

  del.sync([
    `${blogify.themeDir}/public/**/build`,
    `${blogify.themeDir}/blogify.json`
  ]);

  if (fs.existsSync(CONFIG.root)) {
    glob.sync(`${CONFIG.root}/**/*.*`).map((f) => {
      const p = path.parse(f);
      const relativeUrl = `build/${path.relative(CONFIG.root, f)}`;
      const url = `${CONFIG.baseUrl || ""}/${relativeUrl}`;

      fs.copySync(f, `${blogify.themeDir}/public/${relativeUrl}`);

      if ([".md", ".markdown", ".pug", ".html"].includes(p.ext)) {
        const { data, content } = matter(fs.readFileSync(f, "utf8"));
        POSTS.push({
          ...data,
          teaser: content.split("===")[0],
          url
        });
      }

      FILES.push(url);
    });
  }

  fs.writeFileSync(`${blogify.themeDir}/public/build/CONFIG.json`, JSON.stringify(CONFIG), {ensureFileSync: true});
  fs.writeFileSync(`${blogify.themeDir}/public/build/POSTS.json`, JSON.stringify(POSTS), {ensureFileSync: true});
  fs.writeFileSync(`${blogify.themeDir}/public/build/FILES.json`, JSON.stringify(FILES), {ensureFileSync: true});
  fs.writeFileSync(`${blogify.themeDir}/blogify.json`, JSON.stringify(blogify), {ensureFileSync: true});

  return blogify;
}

module.exports = loadConfig;

if (require.main === module) {
  loadConfig();
}