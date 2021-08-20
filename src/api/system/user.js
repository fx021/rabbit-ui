import request from '@/router/axios';
// 表格里面的数据
export const getList = (current, size, params, deptId) => {
  return request({
    url: '/api/rabbit-user/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      deptId,
    }
  })
}
// 数据删除
export const remove = (ids) => {
  return request({
    url: '/api/rabbit-user/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
// 数据新增
export const add = (row) => {
  return request({
    url: '/api/rabbit-user/submit',
    method: 'post',
    data: row
  })
}
// 上传
export const update = (row) => {
  return request({
    url: '/api/rabbit-user/update',
    method: 'post',
    data: row
  })
}
// 查看数据
export const getUser = (id) => {
  return request({
    url: '/api/rabbit-user/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/api/rabbit-user/info',
    method: 'get',
  })
}

export const resetPassword = (userIds) => {
  return request({
    url: '/api/rabbit-user/reset-password',
    method: 'post',
    params: {
      userIds,
    }
  })
}

export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: '/api/rabbit-user/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  })
}

export const updateInfo = (row) => {
  return request({
    url: '/api/rabbit-user/update-info',
    method: 'post',
    data: row
  })
}

export const grant = (userIds, roleIds) => {
  return request({
    url: '/api/rabbit-user/grant',
    method: 'post',
    params: {
      userIds,
      roleIds,
    }
  })
}
