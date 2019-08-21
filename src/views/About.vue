<template lang="pug">
  b-card.p-3(v-html="content")
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { md } from "@/plugins/render";

@Component
export default class About extends Vue {
  private content: string = "";

  public mounted() {
    this.content = md.md2html(README);
  }
}
</script>