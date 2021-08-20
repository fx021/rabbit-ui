import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/rabbit-system/menu/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 菜单管理页面数据
export const getLazyList = (parentId, params) => {
  return request({
    url: '/api/rabbit-system/menu/lazy-list',
    method: 'get',
    params: {
      parentId,
      ...params
    }
  })
}
// 数据权限表格数据
export const getLazyMenuList = (parentId, params) => {
  return request({
    url: '/api/rabbit-system/menu/lazy-menu-list',
    method: 'get',
    params: {
      parentId,
      ...params,
    }
  })
}

export const getMenuList = (current, size, params) => {
  return request({
    url: '/api/rabbit-system/menu/menu-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 上级菜单下拉框中的数据
export const getMenuTree = (tenantId,
) => {
  return request({
    url: '/api/rabbit-system/menu/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const remove = (ids, language) => {
  return request({
    url: '/api/rabbit-system/menu/remove',
    method: 'post',
    params: {
      ids, language
    }
  })
}
// 新增保存
export const add = (row) => {
  return request({
    url: '/api/rabbit-system/menu/submit',
    method: 'post',
    data: row
  })
}
// 修改保存
export const update = (row) => {
  return request({
    url: '/api/rabbit-system/menu/submit',
    method: 'post',
    data: row
  })
}
// 查询多语言表格数据
export const getMenu = (id) => {
  return request({
    url: '/api/rabbit-system/menu/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getTopMenu = () => request({
  url: '/api/rabbit-system/menu/top-menu',
  method: 'get'
});
// 获取系统菜单
export const getRoutes = (topMenuId) => request({
  url: '/api/rabbit-system/menu/routes',
  method: 'get',
  params: {
    topMenuId,
  }
});

// 多语言下拉框接口
export const getLanguage = () => request({
  url: '/api/rabbit-system/dict/select-language',
  method: 'get',
});

// 删除多语言接口
export const getDeleteLanguage = ids => request({
  url: '/api/rabbit-system/menu/delete-language',
  method: 'get',
  params: {
    'ids': ids
  }
});

export const searchFormList = name => request({
  url: '/api/rabbit-resource/formcustom/form-search',
  method: 'get',
  params: {
    'name': name
  }
});

export const getFormListByIds = ids => request({
  url: '/api/rabbit-resource/formcustom/form-ids',
  method: 'get',
  params: {
    'ids': ids
  }
});

export const getMaxSort = pid => request({
  url: '/api/rabbit-system/menu/max-sort',
  method: 'get',
  params: {
    'parentId': pid
  }
});
