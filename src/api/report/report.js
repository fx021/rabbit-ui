import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-report/report/rest/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/rabbit-report/report/rest/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const finereportlogin = (username, password) => {
  var url = "/webroot/decision/login/cross/domain" + "?fine_username=" + username + "&fine_password=" + password + "&validity=" + -1;
  return request({
    url: url,
    method: 'get',
    timeout: 5000,//超时时间（单位：毫秒）
  })
}
// 帆软注销
export const finereportLoginOut = () => {
  var url = "webroot/decision/logout/cross/domain"
  return request({
    url:url,
    method: 'get',
    dataType:"jsonp",//跨域采用jsonp方式
    jsonp:"callback",
    timeout:5000,// 超时时间（单位：毫秒）
  })
}
