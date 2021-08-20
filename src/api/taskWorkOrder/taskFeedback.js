import request from '@/router/axios';


/**
 * 查询监控反馈
 * @param {*} data 
 */
export function queryListFeed(data) {
  return request({
    url: '/api/xye-manager/monitor/task/feedback/list',
    method: 'post',
    data
  })
}
// 导出监控反馈
export function exportList(data) {
  return request({
    url: '/api/xye-manager/task/feedback/exports',
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
// 批量删除监控反馈
export function remove(data) {
  return request({
    url: '/api/xye-manager/monitor/task/feedback/del',
    method: 'post',
    data
  })
}

// 详情
export function getDetail(data) {
  return request({
    url: '/api/xye-manager/monitor/task/feedback/detail',
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