import request from '@/router/axios';


/**
 * 查询监控记录
 * @param {*} data 
 */
export function queryList(data) {
  return request({
    url: '/api/xye-manager/monitor/task/list',
    method: 'post',
    data
  })
}
// 导出监控
export function exportList(data) {
  return request({
    url: '/api/xye-manager/monitor/task/exports',
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
// 批量删除监控
export function remove(data) {
  return request({
    url: '/api/xye-manager/monitor/task/del',
    method: 'post',
    data
  })
}

//新增 监控
export function add(data) {
  return request({
    url: '/api/xye-manager/monitor/task/add',
    method: 'post',
    data
  })
}
// 详情
export function getDetail(data) {
  return request({
    url: '/api/xye-manager/monitor/task/detail',
    method: 'post',
    data
  })
}

// 流程接口
export function runProcess(data) {
  return request({
    url: '/api/xye-manager/monitor/task/procesDetail',
    method: 'post',
    data
  })
}