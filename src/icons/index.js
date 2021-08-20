import Vue from 'vue'
import SvgIcon from '@/components/svg-icon/SvgIcon' // svg组件

// 注册到全局
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svgs', false, /\.svg$/)

requireAll(req);
