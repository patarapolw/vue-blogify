<template lang="pug">
div
  b-navbar(toggleable="lg" type="dark" variant="success")
    b-navbar-brand(to="/") {{title}}
    b-navbar-toggle(target="nav-collapse")
    b-collapse#nav-collapse(is-nav)
      b-navbar-nav
        b-nav-item(v-for="t in tabs" :key="t.name" :to="t.to" :url="t.url") {{t.name}}
      b-navbar-nav.ml-auto
        b-nav-form(@submit.stop.prevent)
          b-form-input.mr-sm-2(size="sm" placeholder="Type to search" style="min-width: 200px" v-model="g.q")
        b-nav-item(to="/about") About
  b-container.mt-3
    b-row
      b-col(sm=12 lg=8)
        router-view
      b-col(sm=12 lg=4)
        sidebar
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Sidebar from "@/layouts/Sidebar.vue";
import { g } from "@/shared";

@Component({
  components: {Sidebar}
})
export default class App extends Vue {
  private title = CONFIG.title || "BLOG"
  private tabs = CONFIG.tabs || []
  private g = g;
}
</script>
