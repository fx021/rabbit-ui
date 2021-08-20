import request from '@/router/axios';


// 获取用于添加的用户列表
export const getUserSelectList = (masterId, current, size, query = {}) => {
  return request({
    url: '/api/rabbit-user/VOUserPage',
    method: 'get',
    params: {
      masterId,
      current,
      size,
      ...query
    }
  })
}

// 删除用户
export const delVirtualOrganizationUser = (masterId, userIdList) => {
  return request({
    url: '/api/rabbit-system/virtualorganization/delVirtualOrganizationUser',
    method: 'post',
    data: {
      masterId,
      userIdList
    }
  })
}

// 添加用户
export const addVirtualOrganizationUser = (masterId, virtualUserList) => {
  return request({
    url: '/api/rabbit-system/virtualorganization/addVirtualOrganizationUser',
    method: 'post',
    data: {
      masterId,
      virtualUserList
    }
  })
}


// 更新用户
export const updateUser = (masterId, userId, newMasterId, roleId) => {
  return request({
    url: '/api/rabbit-system/virtualorganization/updateUser',
    method: 'put',
    data: {
      masterId,
      userId,
      newMasterId,
      roleId
    }
  })
}

// 获取组织下的用户
export const getVirtualUserPage = (masterId, current, size, query = {}) => {
  return request({
    url: '/api/rabbit-user/VOUserListPage',
    method: 'get',
    params: {
      masterId,
      current,
      size,
      ...query
    }
  })
}

export const getVirtualLazyTree = (parentId, filters) => {
  return request({
    url: '/api/rabbit-system/virtualorganization/lazy-tree',
    method: 'get',
    params: {
      parentId,
      ...filters
    }
  })
}

// 获取最高级层级
export const getVirtualTopLevelList = () => {
  return request({
    url: '/api/rabbit-system/virtualorganization/top-level-list',
    method: 'get'
  })
}


export const add = (row) => {
  delete row.$parentId
  delete row.$tenantId
  delete row.tenantId
  delete row.$virtualorganizationCategory
  return request({
    url: '/api/rabbit-system/virtualorganization/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/rabbit-system/virtualorganization/remove',
    method: 'get',
    params: {
      id: ids,
    }
  })
}
