import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Result from './views/Result.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/result/:id',
      name: 'result',
      component: Result
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/voter',
      component: () => import(/* webpackChunkName: "voter" */ './views/Admin'),
      children: [
        {
          path: '',
          name: 'voter-login',
          component: () => import(/* webpackChunkName: "voter" */ './views/voter/Login.vue'),
        },
        {
          path: 'dash/:id/:tps',
          name: 'voter-dash',
          component: () => import(/* webpackChunkName: "voter" */ './views/voter/Dash.vue'),
        }
      ]
    },
    {
      path: '/admin',
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin'),
      children: [
        {
          path: '',
          name: 'admin-login',
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

router.beforeEach((to, from, next) => {
  console.log("Router Check", to.name, to.path, to.fullPath);

  if (to.fullPath.match(/^\/admin/)) {
    $api.isLogin().then(login => {
      console.log('Login state', login);
      
        if( to.name == 'admin-login' ){
          if( login ){
            console.log('In login page but is logged in');
            return next({name: 'admin-dash'})
          }
        }else{
          if(!login){
            return next({name: 'admin-login'})
          }
        }
        return next();
    })
  } else {
    return next()
  }
})

export default router;