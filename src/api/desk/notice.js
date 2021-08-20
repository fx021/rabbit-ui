import request from '@/router/axios';
// 获取列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-desk/notice/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 删除
export const remove = (ids) => {
  return request({
    url: '/api/rabbit-desk/notice/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
// 新增
export const add = (row) => {
  return request({
    url: '/api/rabbit-desk/notice/submit',
    method: 'post',
    data: row
  })
}
// 更新
export const update = (row) => {
  return request({
    url: '/api/rabbit-desk/notice/submit',
    method: 'post',
    data: row
  })
}
// 获取通知
export const getNotice = (id) => {
  return request({
    url: '/api/rabbit-desk/notice/detail',
    method: 'get',
    params: {
      id
    }
  })
}

