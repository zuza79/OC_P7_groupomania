/*import Vue2Emoji from 'vuejs-emoji'??????*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import dotenv from 'dotenv'

dotenv.config()

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

