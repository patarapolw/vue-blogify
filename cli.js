#!/usr/bin/env node

const loadConfig = require("./load");
const { spawnSync } = require("child_process");
const program = require("commander");
const fs = require("fs-extra");
const pkg = require("./package.json");
const path = require("path");

program
  .version(pkg.version)
  .option("-b --build");

program.parse(process.argv);

const blogify = loadConfig();

if (!fs.existsSync(path.join(blogify.themeDir, "node_modules"))) {
  console.log("Installing theme")
  spawnSync("npm", ["install"], {
    cwd: blogify.themeDir,
    stdio: "inherit"
  });
}

if (program.build) {
  spawnSync("npm", ["run", "build"], {
    cwd: blogify.themeDir,
    stdio: "inherit"
  });
} else {
  spawnSync("npm", ["run", "serve"], {
    cwd: blogify.themeDir,
    stdio: "inherit"
  });
}