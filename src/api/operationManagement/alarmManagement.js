import request from '@/router/axios';
/**
 * 告警主列表
 * @param {*} data 
*/
export function queryList(data) {
    return request({
        url: '/api/xye-manager/alarm/info/queryList',
        method: 'post',
        data
    })
}
/**
 * 列表导出
 * @param {*} data
*/
export function alarmExport(data) {
    return request({
        url: '/api/xye-manager/alarm/info/export',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        method: 'post',
        data
    })
}

/**
 * 详情导出
 * @param {*} data
*/
export function detailAlarmExport(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/export',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        method: 'post',
        data
    })
}
// 删除 
export function remove(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/remove',
        method: 'post',
        data
    })
}
// 告警处理记录
export function alarmHandle(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/alarmHandle',
        method: 'post',
        data
    })
}
// 详情 
export function detailQueryList(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/queryList',
        method: 'post',
        data
    })
}
// 手动新增 
export function detailadd(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/add',
        method: 'post',
        data
    })
}
// 编辑
export function configureEdit(data) {
    return request({
        url: '/api/xye-manager/alarm/configure/edit',
        method: 'post',
        data
    })
}
// 统计
export function alarmStateStatistics(data) {
    return request({
        url: '/api/xye-manager/alarm/info/alarmStateStatistics',
        method: 'post',
        data
    })
}
/**
 * 添加设备告警确认单和告警信息详情
 * @param {*} data 
*/
export function confirmationSlip(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/add',
        method: 'post',
        data
    })
}
/**
 * 告警处理方式
 * @param {*} data 
*/
export function queryAlarmHandleList(data) {
    return request({
        url: '/api/xye-manager/alarm/info/detail/queryAlarmHandleList',
        method: 'post',
        data
    })
}

