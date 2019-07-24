import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/admin',
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin'),
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import(/* webpackChunkName: "admin" */ './views/admin/Login.vue'),
        },
        {
          path: 'dash',
          name: 'admin-dash',
          component: () => import(/* webpackChunkName: "admin" */ './views/admin/Dash.vue'),
        }
      ]
    }
  ]
})
