<template lang="pug">
div
  b-navbar(toggleable="lg" type="dark" variant="success")
    b-navbar-brand(to="/") {{banner}}
    b-navbar-toggle(target="nav-collapse")
    b-collapse#nav-collapse(is-nav)
      b-navbar-nav
        b-nav-item(v-for="t in tabs" :key="t.name" :href="t.url" :to="t.to") {{t.name}}
      b-navbar-nav.ml-auto
        b-nav-form(@submit.stop.prevent)
          b-form-input.mr-sm-2(size="sm" placeholder="Type to search" style="min-width: 200px" v-model="q"
          @keydown="onSearchKeydown")
  b-container.mt-3
    b-row
      b-col(sm=12 lg=8)
        router-view
      b-col(sm=12 lg=4)
        sidebar
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Sidebar from "./components/Sidebar.vue";
import { g } from "./shared";

@Component({
  components: {Sidebar}
})
export default class App extends Vue {
  banner = g.config.banner;
  tabs = g.config.tabs || [];
  q = "";

  mounted() {
    this.onRouteChanged();
  }

  @Watch("$route", {deep: true})
  onRouteChanged() {
    this.q = this.$route.query.q as string || "";
  }

  onSearchKeydown(evt: KeyboardEvent) {
    if (evt.code === "Enter") {
      this.$router.push({query: {q: this.q}});
    }
  }
}
</script>