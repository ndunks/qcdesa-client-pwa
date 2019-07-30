import 'babel-polyfill'
import Vue from 'vue'
import { VApp } from 'vuetify/lib';
import router from './router'
import vuetify from './plugins/vuetify';
import { Api } from './app/api';
//@ts-ignore
import ResultCandidate from "@/components/ResultCandidate.vue";
import ListSponsor from "@/components/ListSponsor.vue";
import ResultLogs from "@/components/ResultLogs.vue";

Vue.config.productionTip = false
Vue.use(Api, {
  url: process.env.VUE_APP_API_URL,
  direct_url: process.env.VUE_APP_API_DIRECT_URL
})

// Register GLobal Dialog
Vue.component('ResultCandidate', ResultCandidate)
Vue.component('ListSponsor', ListSponsor)
Vue.component('ResultLogs', ResultLogs)

new Vue({
  router,
  vuetify,
  render: h => h(VApp, [h('RouterView')]),
  mounted: () => {
    loading.counter -= 1;
  }
}).$mount('#app')
