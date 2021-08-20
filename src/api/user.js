import request from '@/router/axios';
import website from "@/config/website";

export const loginByUsername = (tenantId, username, password, type, key, code) => request({
  url: '/api/rabbit-auth/oauth/token',
  method: 'post',
  headers: website.captchaMode ? {
    'Tenant-Id': tenantId,
    'Captcha-Key': key,
    'Captcha-Code': code,
  } : {
    'Tenant-Id': tenantId,
  },
  params: {
    tenantId,
    username,
    password,
    grant_type: (website.captchaMode ? "captcha" : "password"),
    scope: "all",
    type
  }
});

export const loginBySocial = (tenantId, source, code, state) => request({
  url: '/api/rabbit-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    source,
    code,
    state,
    grant_type: "social",
    scope: "all",
  }
})

export const refreshToken = (refresh_token, tenantId) => request({
  url: '/api/rabbit-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    refresh_token,
    grant_type: "refresh_token",
    scope: "all",
  }
});

export const registerGuest = (form, oauthId) => request({
  url: '/api/rabbit-user/register-guest',
  method: 'post',
  params: {
    tenantId: form.tenantId,
    name: form.name,
    account: form.account,
    password: form.password,
    oauthId
  }
});
// 系统按钮
export const getButtons = () => request({
  url: '/api/rabbit-system/menu/buttons',
  method: 'get',
});
// 第一个报错
export const getCaptcha = () => request({
  url: '/api/rabbit-auth/oauth/captcha',
  method: 'get'
});

export const logout = () => request({
  url: '/api/rabbit-auth/oauth/logout',
  method: 'get'
});

export const getUserInfo = () => request({
  url: '/api/rabbit-auth/oauth/user-info',
  method: 'get'
});

export const sendLogs = (list) => {
  return new Promise(resolve => {
    const data = list.map(item => {
      return {
        stackTrace: item.stack,
        serverIp: item.url,
        createTime: item.time,
        message: item.message,
      }
    })

    request({
      url: '/api/rabbit-log/error/save-error-info',
      method: 'post',
      data
    }).then(res => {
      resolve(res)
    })
  })
};

export const clearCache = () => request({
  url: '/api/rabbit-auth/oauth/clear-cache',
  method: 'get'
});

export const getDeptList = (ids) => request({
  url: '/api/rabbit-system/dept/select-ids',
  method: 'get',
  params: { ids }
});

export function getMainStation(data) {
  return request({
      url: '/api/xye-manager/map/getCurrentMainStationMapPosition',
      method: 'post',
      data
  })
}
