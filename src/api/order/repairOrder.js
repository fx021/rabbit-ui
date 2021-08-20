import request from '@/router/axios';
/**
 * 新增维修工单
 * @param {*} data
 */
export function addMaintain(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/addMaintain',
        method: 'post',
        data
    })
}

/**
 * 编辑维修工单
 * @param {*} data
 */
export function editMaintain(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/editMaintain',
        method: 'post',
        data
    })
}

/**
 * 维修工单列表
 * @param {*} data
 */
export function queryMaintainList(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/queryMaintainList',
        method: 'post',
        data
    })
}

/**
 * 维修工单详情
 * @param {*} data
 */
export function queryMaintainDetailsList(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/queryMaintainDetailsList',
        method: 'post',
        data
    })
}

/**
 * 文件信息
 * @param {*} data
 */
export function getFiles(data) {
    return request({
        url: '/api/xye-manager/file/getFiles',
        method: 'post',
        data
    })
}

/**
 * 工单状态
 * @param {*} param
 */
export function querySumByOrderStatus(param) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/querySumByOrderStatus',
        method: 'get',
        param
    })
}

/**
 * 删除
 * @param {*} data
 */
export function delMaintainByID(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/delMaintainByID',
        method: 'post',
        data
    })
}

/**
 * 设备下拉
 * @param {*} data
 */
export function queryEquipmentList(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/queryEquipmentList',
        method: 'post',
        data
    })
}

/**
 * 导出维修工单
 * @param {*} data
 */
export function exportMaintainList(data) {
  return request({
    url: '/api/xye-manager/maintainWorkOrder/exportMaintainList',
    method: 'post',
    header: {
      headers: { 'Content-Type': 'application/x-download' }
    },
    responseType: 'blob',	//指明返回格式
    data
  })
}

/**
 * 导出维修工单详情
 * @param {*} data
 */
export function exportMaintainDetails(data) {
  return request({
    url: '/api/xye-manager/maintainWorkOrder/exportMaintainDetails',
    method: 'post',
    header: {
      headers: { 'Content-Type': 'application/x-download' }
    },
    responseType: 'blob',	//指明返回格式
    data
  })
}


/**
 * 告警详情
 * @param {*} data
 */
export function queryList(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/queryList',
        method: 'post',
        data
    })
}

/**
 * 工作流
 * @param {*} data
 */
export function MaintainFlowAble(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/MaintainFlowAble',
        method: 'post',
        data
    })
}

/**
 * 暂存
 * @param {*} data
 */
export function tsMaintain(data) {
    return request({
        url: '/api/xye-manager/maintainWorkOrder/tsMaintain',
        method: 'post',
        data
    })
}

/**
 * 查看流程信息
 * @param {*} data
 */
export function processDetail(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/processDetail',
        method: 'post',
        data
    })
}
