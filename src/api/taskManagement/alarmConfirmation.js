import request from '@/router/axios';


/**
 * 查询告警确认单列表
 * @param {*} data 
*/
export function queryAlarmConfirmdata(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/queryList',
        method: 'post',
        data
    })
}

// 批量删除
export function remove(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/del',
        method: 'post',
        data
    })
}
// 详情
export function getDetail(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/getDetail',
        method: 'post',
        data
    })
}
// 编辑
export function edit(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/edit',
        method: 'post',
        data
    })
}
// 导出
export function exportList(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 详情的查询
export function queryChecktaskDatagList(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/queryRepairOrders',
        method: 'post',
        data
    })
}
export function getProcessTaskDetail(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/getProcessTaskDetail',
        method: 'post',
        data
    })
}
// 流程接口
export function runProcess(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/process',
        method: 'post',
        data
    })
}
export function saveProcess(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/processStorage',
        method: 'post',
        data
    })
}

export function queryProcessDetail(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/processDetail',
        method: 'post',
        data
    })
}
export function alarmStateStatistics(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/queryDataStatistics',
        method: 'post',
        data
    })
}