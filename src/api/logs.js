import request from '@/router/axios';

export const getUsualList = (current, size, query) => {
  return request({
    url: '/api/rabbit-log/usual/list',
    method: 'get',
    params: {
      current,
      size,
      ...query
    }
  })
}

export const getApiList = (current, size, query) => {
  return request({
    url: '/api/rabbit-log/api/list',
    method: 'get',
    params: {
      current,
      size,
      ...query
    }
  })
}

export const getErrorList = (current, size, query) => {
  return request({
    url: '/api/rabbit-log/error/list',
    method: 'get',
    params: {
      current,
      size,
      ...query
    }
  })
}


export const getUsualLogs = (id) => {
  return request({
    url: '/api/rabbit-log/usual/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getApiLogs = (id) => {
  return request({
    url: '/api/rabbit-log/api/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getErrorLogs = (id) => {
  return request({
    url: '/api/rabbit-log/error/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

