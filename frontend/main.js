import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif


// failed
// import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)



// import { Button } from 'vant';

// Vue.use(Button);