import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/client'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common.less'
import './assets/font/iconfont.css'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return dataStr
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount("#app")