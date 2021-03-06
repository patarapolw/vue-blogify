import pug from "hyperpug";
import { pugFilters, md } from "@/plugins/render";
import hljs from "highlight.js";
import hljsDefineVue from "highlightjs-vue";

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // $& means the whole matched string
}

export function normalizeArray(it: any): any {
  if (Array.isArray(it)) {
    return it[0];
  }

  return it;
}

export async function fetchResource(url: string): Promise<string> {
  url = `${CONFIG.baseUrl}/${url}`;

  if (FILES.includes(`${url}.html`)) {
    return await (await fetch(`${url}.html`)).text();
  } else if (FILES.includes(`${url}.pug`)) {
    return pug.compile({filters: pugFilters})(await (await fetch(`${url}.html`)).text());
  } else if (FILES.includes(`${url}.md`)) {
    return md.md2html(await (await fetch(`${url}.html`)).text());
  }

  return "";
}

hljsDefineVue(hljs);

export function highlightBlock(el: Element) {
  Array.from(el.querySelectorAll("pre code:not(.hljs)")).forEach((el) => {
    hljs.highlightBlock(el);
  });
}