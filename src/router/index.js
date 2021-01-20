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
      component: () => import('../views/admin/user/index')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('../views/admin/user/users')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('../views/admin/jurisdiction/roles')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('../views/admin/jurisdiction/rights')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('../views/admin/good/goods'),
      },
      {
        path: '/goodslist',
        name: 'goodslist',
        component: () => import('../views/admin/good/goodslist')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('../views/admin/good/categories')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('../views/admin/good/params')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('../views/admin/order/orders')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('../views/admin/chart/reports')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router