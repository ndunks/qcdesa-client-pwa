import Vue from 'vue'
import { VApp } from 'vuetify/lib';
import router from './router'
import vuetify from './plugins/vuetify';
import { Api } from './app/api';

Vue.config.productionTip = false
Vue.use(Api)

new Vue({
  router,
  vuetify,
  render: h => h(VApp, [h('RouterView')]),
  mounted: () => {
    loading.counter -= 1;
  }
}).$mount('#app')
