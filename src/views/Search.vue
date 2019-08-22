<template lang="pug">
div
  h1.tag(v-if="$route.tag") {{$route.tag}}
  div(v-if="posts && posts.length > 0")
    post(v-for="p in posts" :filename="p.filename" :is-teaser="true" :key="p.filename")
    b-pagination(v-model="page" :total-rows="count" :per-page="perPage")
  div(v-else-if="posts")
    empty
  div(v-else)
    first
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Post from "@/layouts/Post.vue";
import Empty from "@/layouts/Empty.vue";
import First from "@/layouts/First.vue";
import SearchParser from "@/plugins/search";
import { normalizeArray } from "@/util";
import { g } from "@/shared";

@Component({
  components: {
    Post, Empty, First
  }
})
export default class Search extends Vue {
  private posts?: any[] = [];

  private g = g;
  private page: number = 1;
  private count: number = 0;
  private perPage: number = 5;

  public mounted() {
    this.page = parseInt(normalizeArray(this.$route.query.page) || "1");
    this.updatePosts();
  }

  @Watch("g.q")
  @Watch("page")
  @Watch("$route.params")
  private async updatePosts() {
    const parser = new SearchParser();
    let ps = this.$route.params.tag 
    ? parser.filterPosts([this.g.q, `tag=${this.$route.params.tag}`].join(" "))
    : parser.filterPosts(this.g.q);

    const { perPage } = g.config.posts;
    this.perPage = perPage;
    this.count = ps.length;

    ps = ps.filter((p, i) => {
      const iPage = i / perPage;
      return iPage >= this.page - 1 && iPage < this.page;
    });

    this.posts = ps;
  }
}
</script>