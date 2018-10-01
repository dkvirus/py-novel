import Vue from 'vue'
import { Input, Row, Col, Button, Divider } from 'iview';
import App from './App.vue'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false

Vue.component('Input', Input)
Vue.component('Row', Row)
Vue.component('Col', Col)
Vue.component('Button', Button)
Vue.component('Divider', Divider)

new Vue({
  render: h => h(App)
}).$mount('#app')
