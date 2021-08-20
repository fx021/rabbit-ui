import request from '@/router/axios';

/**
 * 班次配置列表
 * @param {*} data
 */
export function queryList(data) {
  return request({
    url: '/api/xye-manager/work/shift/queryPageList',
    method: 'post',
    data
  })
}

/**
 * 删除班次配置
 * @param {*} data
 */
export function remove(data) {
  return request({
    url: '/api/xye-manager/work/shift/remove',
    method: 'post',
    data
  })
}

/**
 * 复制班次配置
 * @param {*} data
 */
export function copyShift(data) {
  return request({
    url: '/api/xye-manager/work/shift/copy',
    method: 'post',
    data
  })
}

// 导出
export function exportShift(data) {
  return request({
    url: '/api/xye-manager/work/shift/exportList',
    method: 'post',
    header: {
      headers: {
        'Content-Type': 'application/x-download'
      }
    },
    responseType: 'blob', //指明返回格式
    data
  })
}
/**
 * 新增班次配置
 * @param {*} data
 */
export function add(data) {
  return request({
    url: '/api/xye-manager/work/shift/add',
    method: 'post',
    data
  })
}
/**
 * 班次配置详情列表
 * @param {*} data
 */
export function detail(data) {
  return request({
    url: '/api/xye-manager/work/shift/detail',
    method: 'post',
    data
  })
}

// 编辑班次配置
export function edit(data) {
  return request({
    url: '/api/xye-manager/work/shift/edit',
    method: 'post',
    data
  })
}
/**
 * 模板下载
 * @param {} data
 */
export const download = (data) => {
  return request({
    header: {
      headers: {
        'Content-Type': 'application/x-download'
      }
    },
    responseType: 'blob', //指明返回格式
    method: 'get',
    url: '/api/xye-manager/file/downloadTemplate/' + data,
  })
}

//导入Excel
export function importList(files) {
  const formData = new FormData();
  formData.append('files', files);
  return request({
    url: '/api/xye-manager/work/shift/import',
      method: 'post',
      headers: {
          "Content-Type": "multipart/form-data"
      },
      data:formData
  })
}