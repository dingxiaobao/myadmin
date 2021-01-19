import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import axios from "axios"


// import apis from './assets/js/api'
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
// Vue.prototype.$apis = apis

// axios.interceptors.request.use(config=>{
//   config.headers['Authorzation']=sessionStorage.getItem('token')
// })
// Vue.config.productionTip=false

import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//echarts
import echarts from "echarts"
Vue.prototype.$echarts = echarts

//在线编辑器
// import VueQuillEditor from 'vue-quill-editor'
// // require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// Vue.use(VueQuillEditor)
// 将token设置在请求头上
axios.interceptors.request.use(
  config => {
    // 设置请求拦截器给我们请求头设置token
    var arr = JSON.parse(sessionStorage.getItem("04A_token"));
    var token;
    if (arr) {
      token = arr.token
    } else {
      token = null
    }
    config.headers.Authorization = token;
    return config;
  },
)
//全局路由守卫
router.beforeEach((to, form, next) => {
  //创建一个token与home中token相比较
  let token = sessionStorage.getItem('04A_token');
  //判断
  if (to.path == '/login') {

  } else {
    if (token == null) {
      alert('请登录')
      next('/login')
    }
  }
  next()
})
Vue.prototype.$axios = axios


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')