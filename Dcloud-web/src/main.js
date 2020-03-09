import Vue from 'vue'
// import 'normalize.css/normalize.css'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
import '@/styles/index.scss'
import App from './App'
import router from './router'
import store from './store'
import '@/icons'
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.use(ElementUI)

Vue.config.productionTip = false
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})