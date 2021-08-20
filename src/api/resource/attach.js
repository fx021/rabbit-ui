import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-resource/attach/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/rabbit-resource/attach/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids, deleteFile) => {
  return request({
    url: '/api/rabbit-resource/attach/remove',
    method: 'post',
    params: {
      ids,
      deleteFile
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/rabbit-resource/attach/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/rabbit-resource/attach/submit',
    method: 'post',
    data: row
  })
}

