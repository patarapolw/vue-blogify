import SearchParser from "./search";

const p = new SearchParser();

describe("SearchParser.doParse", () => {
  [
    "",
    "a",
    "a:b",
    "a:b c",
    "a:b c:d",
    "a:b OR c",
    "date:2018-08-12",
    "date>2018-08-12",
    " tag:分类词汇"
  ].forEach((q) => {
    it(q, () => {
      console.dir(p.parseFull(q), {depth: null});
    })
  });
})
