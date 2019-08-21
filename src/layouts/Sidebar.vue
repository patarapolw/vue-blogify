<template lang="pug">
div
  b-card.mb-3
    center
      img(src="../assets/logo.png")
    :markdown
      ## Welcome to my blog

      Note that both Pug.js and `:markdown` are supported.

      Sidebar can be edited at `/src/layouts/Sidebar.vue`

      You can further edit the markdown support at `/src/plugins/render.js`

      For more information, see <https://github.com/patarapolw/vue-blogify>
  b-card
    h3 Tag cloud
    span.mr-3(v-for="t in tags" :key="t.name" :class="t.class")
      b-link(:to="'/tag/' + t.name") {{t.name}}
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Sidebar extends Vue {
  get tags() {
    const tagList: Record<string, number> = {};

    POSTS.forEach((p) => {
      for (const t of p.tag || []) {
        tagList[t] = (tagList[t] || 0) + 1;
      }
    });

    return Object.keys(tagList).sort().map((t) => {
      return {
        name: t,
        class: (() => {
          const count = tagList[t];
          if (count > 30) {
            return "c30"
          } else if (count > 20) {
            return "c20"
          } else if (count > 10) {
            return "c10"
          } else if (count > 5) {
            return "c5"
          } else if (count > 3) {
            return "c3"
          } else if (count > 1) {
            return "c2"
          }
          return "c1"
        })()
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.c30 {
  font-size: 40px;
}

.c20 {
  font-size: 30px;
}

.c10 {
  font-size: 25px;
}

.c5 {
  font-size: 20px;
}

.c3 {
  font-size: 16px;
}

.c2 {
  font-size: 13px;
}

.c1 {
  font-size: 10px;
}
</style>