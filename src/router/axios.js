/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios';
import store from '@/store'
import { env } from '@/config/env.js'
import { localGateWayRouterConfig } from '@/config/env.js'
import router from '@/router/router';
import { serialize } from '@/util/util';
import { getToken } from '@/util/auth';
import { Message } from 'element-ui';
import website from '@/config/website';
import { Base64 } from 'js-base64';
import NProgress from 'nprogress';
import {
  getStore
} from '@/util/store'
import 'nprogress/nprogress.css';
//默认超时时间
axios.defaults.timeout = 30000;
//返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress 配置
NProgress.configure({
  showSpinner: false
});
//http request(请求)拦截
axios.interceptors.request.use(config => {

  if (env.NODE_ENV === 'development') {
    config.headers['LocalGateWayRouter'] = `${Base64.encode(`${JSON.stringify(localGateWayRouterConfig)}`)}`
  }

  //开启 progress bar

  // config.from = store.state.tags.tag;

  NProgress.start();
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  //让每个请求携带token
  if (getToken() && !isToken) {
    config.headers[website.tokenHeader] = 'bearer ' + getToken()
  }
  //headers中配置text请求
  if (config.text === true) {
    config.headers["Content-Type"] = "text/plain";
  }
  const lang = getStore({
    name: 'language'
  })
  if (lang) {
    config.headers["Accept-Language"] = lang;
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//http response(响应) 拦截
axios.interceptors.response.use(res => {

  //关闭 progress bar
  NProgress.done();
  //获取状态码
  var status = res.data.code || res.status;
  if (status == 0) status = 200
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.msg || res.data.error_description || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
  // 如果请求为非200否者默认统一处理



  if (status !== 200) {
    Message({
      message: message,
      type: 'error'
    });

    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
});

/*
 *get方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/*
*post方法，对应post请求
*@param {String} url [请求的url地址]
*@param {Object} params [请求时候携带的参数]
*/
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/*
*put方法，对应put请求
*@param {String} url [请求的url地址]
*@param {Object} params [请求时候携带的参数]
*/
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/*
*delete方法，对应delete请求
*@param {String} url [请求的url地址]
*@param {Object} params [请求时候携带的参数]
*/
export function deleteItem(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default axios;
