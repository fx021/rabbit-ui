import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-system/role/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const grantTree = () => {
  return request({
    url: '/api/rabbit-system/menu/grant-tree',
    method: 'get',
  })
}

export const grant = (roleIds, menuIds, dataScopeIds, apiScopeIds,deptScopeIds) => {
  return request({
    url: '/api/rabbit-system/role/grant',
    method: 'post',
    data: {
      roleIds,
      menuIds,
      dataScopeIds,
      apiScopeIds,
      deptScopeIds
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/rabbit-system/role/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/rabbit-system/role/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/rabbit-system/role/submit',
    method: 'post',
    data: row
  })
}


export const getRole = (roleIds) => {
  return request({
    url: '/api/rabbit-system/menu/role-tree-keys',
    method: 'get',
    params: {
      roleIds,
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request({
    url: '/api/rabbit-system/role/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}
