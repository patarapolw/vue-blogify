<template lang="pug">
div
  div(v-if="url")
    post(:is-teaser="false" :url="url")
    vue-disqus(:shortname="disqus" :identifier="$route.path")
  div(v-else="")
    empty
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Post from "../components/Post.vue";
import Empty from "../components/Empty.vue";
import moment from "moment";
import { g } from '../shared';
import dotProp from "dot-prop";

@Component({
  components: {
    Post, Empty
  }
})
export default class Search extends Vue {
  url: string = "";
  disqus: string = dotProp.get(g.config, "external.disqus") || "";

  public mounted() {
    const ps = g.posts.filter((p) => {
      const m = moment(p.date);
      if (m.format("YYYY") === this.$route.params.y && m.format("MM") === this.$route.params.mo) {
        if (p.url
        .replace(/^.*\//, "")
        .replace(/\.[^.]+$/, "") === this.$route.params.name) {
          return true;
        }
      }
      return false;
    });
    if (!ps[0]) {
      this.url = "";
    }
    this.url = ps[0].url;
  }
}
</script>