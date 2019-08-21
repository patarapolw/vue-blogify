import Vue from 'vue';
import Router from 'vue-router';
import Search from './views/Search.vue';
import Single from "./views/Single.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: '/', component: Search },
    { path: '/tag/:tag', component: Search },
    { path: "/p/:y/:mo/:name", component: Single },
    { path: "/about", component: About }
  ]
});
