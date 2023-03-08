import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/rem'; // rem

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.scss'; // global css

import moment from 'moment';// 导入文件

Vue.prototype.$moment = moment;// 赋值使用

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
// Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
