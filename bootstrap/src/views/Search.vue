<template lang="pug">
div
  h1.tag(v-if="$route.tag") {{$route.tag}}
  div(v-if="posts && posts.length > 0")
    post(v-for="p in posts" :url="p.url" :is-teaser="true" :key="p.url")
    b-pagination(v-model="page" :total-rows="count" :per-page="perPage")
  div(v-else-if="posts")
    empty
  div(v-else)
    first
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Post from "../components/Post.vue";
import Empty from "../components/Empty.vue";
import First from "../components/First.vue";
import QParser from "q2filter";
import { normalizeArray } from "../util";
import { g } from "../shared";

@Component({
  components: {
    Post, Empty, First
  }
})
export default class Search extends Vue {
  posts?: any[] = [];
  page: number = 1;
  count: number = 0;
  perPage: number = 5;

  mounted() {
    this.page = parseInt(normalizeArray(this.$route.query.page) || "1");
    this.updatePosts();
  }

  @Watch("$route", {deep: true})
  @Watch("page")
  private async updatePosts() {
    const q: string [] = this.$route.query.q ? [normalizeArray(this.$route.query.q)] : [];
    if (this.$route.params.tag) {
      q.push(`tag=${this.$route.params.tag}`);
    }

    const parser = new QParser(q.join(" ") ,{
      isString: ["title", "author", "tag"],
      isDate: ["date"],
      filters: {
        "is:reversed": (items: any) => {
          return items.reverse();
        }
      },
      sortBy: {
        key: "date",
        desc: true
      }
    });

    // @ts-ignore
    let ps = parser.parse(POSTS);
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