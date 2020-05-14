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
import VueResource from 'vue-resource'
import authority from '@/store/authority'
Vue.prototype.authority=authority
Vue.use(VueResource)
Vue.prototype.$axios = axios

Vue.use(ElementUI)
import { Message } from 'element-ui';

Vue.prototype.$message = Message;

Vue.config.productionTip = false
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.config = {
    headers: {
        "Content-Type": "application/json"
    }
}
Vue.http.interceptors.push((request, next) => {　 //http拦截
    next((response) => {
        if (response.status === 200) {
            return response
        } else {
            if (response.status != 500 && response.status != 403 && response.status != 404) {
                // 错误处理
            } else {
                response.status = 'error'
            }
            return Promise.reject(response.status) // 必须返回
        }
    });

});
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})