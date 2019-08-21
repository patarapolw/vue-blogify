<template lang="pug">
div
  div(v-if="filename")
    post(:is-teaser="false" :filename="filename")
    vue-disqus(:shortname="disqus" :identifier="$route.path")
  div(v-else="")
    empty
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Post from "@/layouts/Post.vue";
import Empty from "@/layouts/Empty.vue";
import moment from "moment";

@Component({
  components: {
    Post, Empty
  }
})
export default class Search extends Vue {
  private filename: string = "";

  private disqus: string = CONFIG.disqus;

  public mounted() {
    const ps = POSTS.filter((p) => {
      const m = moment(p.date);
      if (m.format("YYYY") === this.$route.params.y && m.format("MM") === this.$route.params.mo) {
        if (p.filename
        .replace(/^.*\//, "")
        .replace(/\.[^.]+$/, "") === this.$route.params.name) {
          return true;
        }
      }

      return false;
    });

    if (!ps[0]) {
      this.filename = "";
    }

    this.filename = ps[0].filename;
  }
}
</script>