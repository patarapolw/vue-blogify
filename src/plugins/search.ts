/**
 * Adapted from https://github.com/patarapolw/rep2recall-web/blob/master/src/node/engine/search.ts
 */
import uuid from "uuid/v4";
import moment from "moment";

export interface ISearchParserResult {
  is: Set<string>;
  sortBy: string | null;
  desc: boolean | null;
  cond: Record<string, any>;
}

export default class SearchParser {
  public is: Set<string> = new Set();
  public sortBy: string | null = null;
  public desc: boolean | null = null;

  private readonly anyOf: Set<string> | null = null;
  private readonly isString = new Set(["title", "author", "tag"]);
  private readonly isDate = new Set(["date"]);

  public filterPosts(q: string): Record<string, any>[] {
    const cond = this.parse(q);

    let ps = POSTS;
    if (this.sortBy) {
      ps = ps.sort(sorter(this.sortBy, this.desc || false));
    } else {
      ps = ps.sort(sorter("date", true));
    }

    ps = ps.filter(mongoFilter(cond));

    return ps;
  }

  public parse(q: string): Record<string, any> {
    this.is = new Set();
    this.sortBy = null
    this.desc = null;

    try {
      return this._parse(q);
    } catch (e) { }

    return {};
  }

  public parseFull(q: string): ISearchParserResult {
    return {
      cond: this.parse(q),
      is: this.is,
      sortBy: this.sortBy,
      desc: this.desc
    }
  }

  private _parse(q: string): Record<string, any> {
    q = q.trim();

    for (const method of [
      this.removeBrackets,
      this.parseSep(" OR "),
      this.parseSep(" "),
      this.parseNeg,
      this.parseFullExpr,
      this.parsePartialExpr
    ]) {
      try {
        return method.bind(this)(q);
      } catch (e) { }
    }

    throw new Error();
  }

  private removeBrackets(q: string) {
    if (q[0] === "(" && q[q.length - 1] === ")") {
      return this.parse(q.substr(1, q.length - 2));
    }

    throw new Error("Not bracketed");
  }

  private parseSep(sep: string) {
    return (q: string) => {
      const brackets: any = {};

      q = q.replace(/\([^)]+\)/g, (p0) => {
        const id = uuid();
        brackets[id] = p0;
        return id;
      });
      const tokens = q.split(sep);
      tokens.forEach((t, i) => {
        for (const k of Object.keys(brackets)) {
          tokens[i] = tokens[i].replace(k, brackets[k]);
        }
      });

      if (tokens.length >= 2) {
        const parsedTokens = tokens.map((t) => this._parse(t)).map((t) => t);
        if (parsedTokens.length > 1) {
          return { [sep === " OR " ? "$or" : "$and"]: parsedTokens };
        } else {
          return parsedTokens[0];
        }
      }

      throw new Error(`Not separated by '${sep}'`);
    }
  }

  private parseNeg(q: string) {
    if (q[0] === "-") {
      const sb = "-sortBy:";
      if (q.startsWith(sb) && q !== sb) {
        this.sortBy = q.substr(sb.length);
        return {};
      }

      return { $not: this.parse(q.substr(1)) };
    }

    throw new Error("Not negative");
  }

  private parseFullExpr(q: string) {
    const m = /^([\w-]+)(:|~|[><]=?|=)([\S-]+|"[^"]+")$/.exec(q);
    if (m) {
      let [_, k, op, v]: any[] = m;

      if (v.length > 2 && v[0] === '"' && v[v.length - 1] === '"') {
        v = v.substr(1, v.length - 2);
      } else {
        const m1 = /^\d+(?:\.\d+)?$/.exec(v);
        if (m1) {
          v = parseFloat(v);
        }
      }

      if (k === "is") {
        if (v === "due") {
          k = "nextReview";
          op = "<=";
          v = new Date();
        } else if (v === "leech") {
          k = "srsLevel";
          op = "=";
          v = 0;
        } else if (v === "new") {
          k = "nextReview";
          op = "=";;
          v = "NULL";
        } else {
          this.is.add(v);
          return {};
        }
      } else if (k === "sortBy") {
        this.sortBy = v;
        return {};
      }

      if (op === ":") {
        if (k === "due" || k === "nextReview") {
          k = "nextReview";
          v = "<="
        } else if (k === "created" || k === "modified") {
          v = "<=";
        }
      }

      if (v === "NULL") {
        v = null;
      }

      if (this.isDate.has(k)) {
        if (v === "NOW") {
          v = new Date();
        } else if (typeof v === "string") {
          const m1 = /^([-+]?\\d+)(\\S*)$/.exec(v);
          let isMomentParsed = false;
          if (m1) {
            try {
              v = moment().add(parseInt(m1[1]), m1[2] as any).toDate();
              isMomentParsed = true;
            } catch (e) { }
          }

          if (!isMomentParsed) {
            try {
              v = moment(v).toDate()
            } catch (e) { }
          }
        }
      }

      // if (moment.isDate(v) && op === ":") {
      //   op = ">";
      // }

      if (v) {
        if (op === ":") {
          if (typeof v === "string" || this.isString.has(k)) {
            v = { $substr: v };
          }
        } else if (op === "~") {
          v = { $regex: v.toString() };
        } else if (op === ">=") {
          v = { $gte: v };
        } else if (op === ">") {
          v = { $gt: v }
        } else if (op === "<=") {
          v = { $lte: v };
        } else if (op === "<") {
          v = { $lt: v };
        }
      }

      return { [k]: v };
    }

    throw new Error("Not full expression");
  }


  private parsePartialExpr(q: string) {
    if (q && q.indexOf(":") === -1) {
      const orCond: any[] = [];

      if (this.anyOf) {
        for (const a of this.anyOf) {
          if (this.isString.has(a)) {
            orCond.push({ [a]: { $substr: q } });
          } else {
            orCond.push({ [a]: q });
          }
        }
      } else {
        return {"*": {$substr: q}}
      }

      if (orCond.length > 1) {
        return { $or: orCond };
      } else if (orCond.length === 1) {
        return orCond[0];
      }

      return {};
    }

    throw new Error("Not partial expression");
  }
}

export function mongoFilter(cond: any) {
  return (item: Record<string, any>): boolean => {
    for (const k of Object.keys(cond)) {
      if (k[0] === "$") {
        if (k === "$and") {
          return cond[k].every((x: Record<string, any>) => mongoFilter(x)(item));
        } else if (k === "$or") {
          return cond[k].some((x: Record<string, any>) => mongoFilter(x)(item));
        } else if (k === "$not") {
          return !mongoFilter(cond[k])(item);
        }
      } else {
        let itemK = dotGetter(item, k);

        if (cond[k] && cond[k].constructor === {}.constructor
          && Object.keys(cond[k]).some((k0) => k0[0] === "$")) {
          return (() => {
            for (const op of Object.keys(cond[k])) {
              try {
                if (op === "$regex") {
                  if (Array.isArray(itemK)) {
                    return itemK.some(new RegExp(cond[k][op].toString(), "i").test);
                  } else {
                    return new RegExp(cond[k][op].toString(), "i").test(itemK);
                  }
                } else if (op === "$startswith") {
                  if (Array.isArray(itemK)) {
                    return itemK.some((el) => el.startsWith(cond[k][op]));
                  } else {
                    return itemK.startsWith(cond[k][op]);
                  }
                } else if (op === "$substr") {

                  if (Array.isArray(itemK)) {
                    return itemK.some((el: string) => el.includes(cond[k][op]));
                  } else {
                    return itemK.includes(cond[k][op]);
                  }
                } else if (op === "$exists") {
                  return (itemK === null || itemK === undefined || itemK === "") === cond[k][op];
                } else {
                  let v = itemK;
                  let v0 = cond[k][op];
                  try {
                    [v, v0] = [parseInt(v), parseInt(v0)];
                  } catch (e) { }

                  if (op === "$gte") {
                    return v >= v0;
                  } else if (op === "$gt") {
                    return v > v0;
                  } else if (op === "$lte") {
                    return v <= v0;
                  } else if (op === "$lt") {
                    return v < v0;
                  }
                }
              } catch (e) { }
            }
            return false;
          })();
        } else if (Array.isArray(itemK)) {
          if (!itemK.includes(cond[k])) {
            return false;
          }
        } else if (itemK !== cond[k]) {
          return false;
        }
      }
    }

    return true;
  }
}

export function dotGetter(d: any, k: string) {
  let v = d;
  for (const kn of k.split(".")) {
    if (v && v.constructor === {}.constructor) {
      if (kn === "*") {
        v = Object.values(v);
      } else {
        v = v[kn];
        if (v === undefined) {
          v = {};
        }
      }
    } else if (Array.isArray(v)) {
      try {
        v = v[parseInt(kn)];
        if (v === undefined) {
          v = null;
          break;
        }
      } catch (e) {
        v = null;
        break;
      }
    }
  }

  if (v && v.constructor === {}.constructor && Object.keys(v).length === 0) {
    v = null;
  }

  return v;
}

export function sorter(sortBy?: string, desc?: boolean) {
  return (a: any, b: any) => {
    if (!sortBy) {
      return 0;
    }

    const m = a[sortBy];
    const n = b[sortBy];

    if (typeof m === typeof n) {
      if (typeof m === "string") {
        return desc ? n.localeCompare(m) : m.localeCompare(n);
      } else if (typeof m === "number") {
        return desc ? n - m : m - n;
      } else {
        return 0;
      }
    } else {
      const typeDict = {
        "number": 1,
        "string": 2,
        "object": 3
      } as any;

      const tM = typeDict[typeof m] || -1;
      const tN = typeDict[typeof n] || -1;

      return desc ? tN - tM : tM - tN;
    }
  }
}