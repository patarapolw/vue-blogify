import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
      children: [
        { path: "" },
        { path: "tag/:tag" }
      ]
    },
    { path: "/p/:y/:mo/:name", component: () => import(/* webpackChunkName: "single" */ '../views/Single.vue') },
    { path: '/about', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },
  ]
});