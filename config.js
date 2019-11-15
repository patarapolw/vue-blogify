const yaml = require("js-yaml");
const fs = require("fs");
const merge = require("lodash.merge");
const path = require("path");

const ROOT = path.resolve(__dirname);
const CONFIG = yaml.safeLoad(fs.readFileSync(`${ROOT}/config.yaml`, "utf8"));

if (fs.existsSync(`${ROOT}/config.local.yaml`)) {
  merge(CONFIG,
    yaml.safeLoad(fs.readFileSync(`${ROOT}/config.local.yaml`, "utf8")));
}

module.exports = {
  ROOT,
  CONFIG
};