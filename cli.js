const loadConfig = require("./load");
const { spawnSync } = require("child_process");
const program = require("commander");
const pkg = require("./package.json");

program
  .version(pkg.version)
  .option("-b --build");

program.parse(process.argv);

if (program.build) {
  const blogify = loadConfig();
  spawnSync("npm run build", {
    cwd: blogify.themeDir,
    stdio: "inherit"
  });
} else {
  const blogify = loadConfig();
  spawnSync("npm run serve", {
    cwd: blogify.themeDir,
    stdio: "inherit"
  });
}