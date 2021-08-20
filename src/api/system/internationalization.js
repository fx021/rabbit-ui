import request from '@/router/axios';
// 配置类型接口
export const selectConfigType = () => {
  return request({
    url: '/api/rabbit-system/i18n/selectConfigType',
    method: 'get',
  })
}
// 国际化语言配置下拉框接口
export const selectLanguage = () => {
  return request({
    url: '/api/rabbit-system/i18n/selectLanguage',
    method: 'get',
  })
}
// 国际化表单数据
export const selectMenu = (menuLanguage, size, current) => {
  return request({
    url: '/api/rabbit-system/i18n/selectMenu',
    method: 'get',
    params: {
      'menuLanguage': menuLanguage,
      "size": size,
      "current": current,
    }
  })
}
// 修改保存
export const updateMenu = (params) => {
  return request({
    url: '/api/rabbit-system/i18n/updateMenu',
    method: 'post',
    data: params
  })
}
