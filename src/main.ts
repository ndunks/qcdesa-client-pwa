import Vue from 'vue'
import { VApp, VContent } from 'vuetify/lib';
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(VApp, [h(VContent, [h('RouterView')])]),
  mounted: () => {
    loading.counter -= 1;
  }
}).$mount('#app')
