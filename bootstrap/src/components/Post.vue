<template lang="pug">
b-card.mb-3.post
  .post-meta.mb-3
    .float-right {{dateString}}
    .post-meta-author
      a(:href="author.link"): b-img.mr-3(rounded="circle" :src="author.avatar")
      a(:href="author.link") {{author.login}}
  h2
    b-link(v-if="isTeaser" :to="to") {{title}}
    span(v-else="") {{title}}
  div
    div(v-if="isTeaser" v-html="teaser")
    div(v-else="" v-html="content")
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import moment, { Moment } from "moment";
import matter from "gray-matter";
import pug from "hyperpug";
// @ts-ignore
import { pugFilters, md } from "@/plugins/render";
import { g } from '../shared';

@Component
export default class Post extends Vue {
  @Prop({default: false}) isTeaser!: boolean;
  @Prop() url!: string;

  private matter: any = {};

  get title() {
    if (this.matter.data) {
      return this.matter.data.title || ""
    }
    return ""
  }

  get moment(): Moment | null {
    if (this.matter.data && this.matter.data.date) {
      return moment(this.matter.data.date);
    }
    return null;
  }

  get dateString() {
    return this.moment ? this.moment.format("ddd D MMMM YYYY") : "";
  }

  get author() {
    const author = (this.matter.data ? this.matter.data.author : null) || g.config.author;
    if (!author) {
      return {
        link: "#",
        avatar: "#",
        login: "Anonymous"
      }
    }
    return author;
  }

  get to() {
    const m = this.moment;
    if (m) {
      return `/p/${m.format("YYYY")}/${m.format("MM")}/${
        this.url
        .replace(/^.*\//, "")
        .replace(/\.[^.]+$/, "")}`;
    }
    return "";
  }

  get teaser() {
    const { content } = this.matter;
    const m = /^([^]+)\s+===\s+([^]+)$/.exec(content || "");
    if (m) {
      return this.parseContent(m[1]);
    }
    return this.parseContent(content || "");
  }

  get content() {
    const { content } = this.matter;
    const m = /^([^]+)\s+===\s+([^]+)$/.exec(content || "");
    if (m) {
      return this.parseContent(m[1] + (m[2] || ""));
    }
    return this.parseContent(content || "");
  }

  async mounted() {
    this.matter = matter(await (await fetch(this.url)).text());
  }

  parseContent(s: string): string {
    if (/\.pug$/.test(this.url)) {
      s = pug.compile({filters: pugFilters})(s);
    } else if (/\.html?$/.test(this.url)) {
      return s;
    }
    return md.md2html(s);
  }
}
</script>