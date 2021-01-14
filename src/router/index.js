import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: "/login"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home'),
    redirect: '/index',
    children: [
      {
      path: '/index',
      name: 'index',
      component: () => import('../views/admin/index')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('../views/admin/users')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('../views/admin/roles')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('../views/admin/goods')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('../views/admin/orders')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('../views/admin/reports')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router