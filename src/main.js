import Vue from 'vue'
import App from './App.vue'

import 'material-icons/iconfont/material-icons.css'
import '@/styles/global/reset.scss'
import '@/styles/global/app.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
