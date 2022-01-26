import Vue from 'vue'
import App from './App.vue'
import Vue2Emoji from 'vuejs-emoji'
Vue.use(Vue2Emoji)

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
