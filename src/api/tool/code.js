import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-develop/code/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const build = (ids) => {
  return request({
    url: '/api/rabbit-develop/code/gen-code',
    method: 'post',
    params: {
      ids,
      system: 'saber'
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/rabbit-develop/code/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/rabbit-develop/code/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/rabbit-develop/code/submit',
    method: 'post',
    data: row
  })
}

export const copy = (id) => {
  return request({
    url: '/api/rabbit-develop/code/copy',
    method: 'post',
    params: {
      id,
    }
  })
}

export const getCode = (id) => {
  return request({
    url: '/api/rabbit-develop/code/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
