import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import VueDisqus from 'vue-disqus'

Vue.config.productionTip = false
Vue.use(VueDisqus)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
