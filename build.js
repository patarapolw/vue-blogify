const yaml = require("js-yaml");
const fs = require("fs-extra");
const merge = require("lodash.merge");
const del = require("del");
const glob = require("fast-glob");
const path = require("path");
const matter = require("gray-matter");

const STATIC_ROOT = "web/public";

const CONFIG = yaml.safeLoad(fs.readFileSync(`config.yaml`, "utf8"));

if (fs.existsSync(`config.local.yaml`)) {
  merge(CONFIG,
    yaml.safeLoad(fs.readFileSync(`config.local.yaml`, "utf8")));
}

async function main() {
  const POSTS = [];
  const FILES = [];

  await del([
    "web/**/build"
  ]);

  if (fs.existsSync(CONFIG.root)) {
    (await glob(`${CONFIG.root}/**/*.*`)).map((f) => {
      const p = path.parse(f);
      const url = `/build/${path.relative(CONFIG.root, f)}`;

      fs.copySync(f, `${STATIC_ROOT}${url}`);

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

  fs.writeFileSync(`${STATIC_ROOT}/build/CONFIG.json`, JSON.stringify(CONFIG), {ensureFileSync: true});
  fs.writeFileSync(`${STATIC_ROOT}/build/POSTS.json`, JSON.stringify(POSTS), {ensureFileSync: true});
  fs.writeFileSync(`${STATIC_ROOT}/build/FILES.json`, JSON.stringify(FILES), {ensureFileSync: true});
}

main();