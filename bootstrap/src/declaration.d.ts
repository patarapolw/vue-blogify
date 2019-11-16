declare const POSTS: Record<string, any>[];
declare const CONFIG: Record<string, any>;
declare const FILES: string[];

declare module "@/plugins/render";
declare module 'vue-disqus';
declare module "highlightjs-vue" {
  import hljs from "highlight.js";

  export = hljsDefineVue;

  /**
   * Add Vue styling to highlight.js
   * @param hljs 
   */
  function hljsDefineVue(hljs: hljs.HLJSStatic): void;

  namespace hljsDefineVue {
    /**
     * Manually add Vue styling to highlight.js
     * 
     * ```typescript
     * import hljs from "highlight.js"
     * hljs.registerLanguage("vue", hljsDefineVue)
     * ```
     * @param hljs 
     */
    function definer(hljs: hljs.HLJSStatic): hljs.IModeBase;
  }
}