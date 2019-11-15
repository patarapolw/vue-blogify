const ghpages = require('gh-pages');
const { CONFIG } = require("../build");

ghpages.publish('dist', {
  branch: CONFIG.git.branch,
  repo: CONFIG.git.url 
}, () => {
  console.log("Published");
});