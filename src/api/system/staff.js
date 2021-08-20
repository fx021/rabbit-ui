import request from '@/router/axios';
// 员工列表分页
export const getList = (params) => {
    return request({
      url: "/api/rabbit-system/staff/page",
      method: "get",
      params: params
    });
  };

// 刷新页面
export const update = row => {
  return request({
    url: "/api/rabbit-system/staff/update",
    method: "post",
    data: row
  });
};

export const remove = (ids, language) => {
  return request({
    url: '/api/rabbit-system/staff/remove',
    method: 'post',
    params: {
      ids, language
    }
  })
};

// 新增保存
export const add = (row) => {
  return request({
    url: '/api/rabbit-system/staff/save',
    method: 'post',
    data: row
  })
};
