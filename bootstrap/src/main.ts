import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import VueDisqus from 'vue-disqus';
import "./plugins/gtag";
import 'highlight.js/styles/default.css';

try {
  require("../public/build/app.css");
} catch(e) {}

try {
  require("../public/build/app.js");
} catch(e) {}

Vue.config.productionTip = false
Vue.use(VueDisqus);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
