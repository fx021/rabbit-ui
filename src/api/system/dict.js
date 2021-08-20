import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-system/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 系统字典数据
export const getParentList = (current, size, params) => {
  return request({
    url: '/api/rabbit-system/dict/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getChildList = function (current, size, parentId, params = {}) {
  return request({
    url: '/api/rabbit-system/dict/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/rabbit-system/dict/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/rabbit-system/dict/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/rabbit-system/dict/submit',
    method: 'post',
    data: row
  })
}


export const getDict = (id) => {
  return request({
    url: '/api/rabbit-system/dict/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getDictTree = () => {
  return request({
    url: '/api/rabbit-system/dict/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request({
    url: '/api/rabbit-system/dict/dictionary',
    method: 'get',
    params,
    code: 'notice'
  })
}

// 自己写的?
export const getNotification = (params) => {
  return request({
    url: '/api/rabbit-system/dict/dictionary?code=notice',
    method: 'get',
    params,
    code: 'notice'
  })
}

export const getMaxSort = (parentId) => {
  return request({
    url: '/api/rabbit-system/dict/select-maxSort',
    method: 'get',
    params: {
      parentId
    },
    code: 'notice'
  })
}

