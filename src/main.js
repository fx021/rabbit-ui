import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import router from "./router/router";
import "./permission"; // 权限
import "./error"; // 日志
import "./cache"; //页面缓存
import store from "./store";
import { loadStyle } from "./util/util";
import vueFilter from './util/filters'
import * as urls from "@/config/env";
import Element from "element-ui";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import i18n from "./lang"; // Internationalization
import "./styles/common.scss";
import GlobalViews from './global-views/index.js';
import basicBlock from "./components/basic-block/main";
import basicContainer from "./components/basic-container/main";
import thirdRegister from "./components/third-register/main";
import avueUeditor from "avue-plugin-ueditor";
import website from "@/config/website";
// 阿里巴巴字体
import "./assets/icon/iconfont.css";

import '@/icons'

// echarts 图表
import echarts from "echarts";
// 表单设计组件
// import AvueFormDesign from '@sscfaith/avue-form-design'

import AvueFormDesign from '../packages/';
for (let key in vueFilter) {
  Vue.filter(key, vueFilter[key])
}
// Avue
// import Avue from '@smallwei/avue';
// import '@smallwei/avue/lib/index.css';

//打印
import Print from 'vue-print-nb';
Vue.use(Print)
Vue.use(GlobalViews)
// 过滤空格
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
  }
}

// 时间轴组件
// import CustomTimeline from './components/custom-timeline/custom-timeline.vue'
// Vue.component(CustomTimeline.name, CustomTimeline)

// Vue.use(Avue);
// 表单设计组件
Vue.use(AvueFormDesign)
// echarts 图表
Vue.prototype.$echarts = echarts;

Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(window.AVUE, {
  size: "small",
  tableSize: "small",
  i18n: (key, value) => i18n.t(key, value)
});
//注册全局容器
Vue.component("basicContainer", basicContainer);
Vue.component("basicBlock", basicBlock);
Vue.component("thirdRegister", thirdRegister);
// Vue.component('avueUeditor', avueUeditor);
Vue.use(avueUeditor);
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});
// 加载website
Vue.prototype.website = website;
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace("$key", ele));
});
Vue.prototype.imgUrl="/api/xye-manager/file/showImg/"
Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
