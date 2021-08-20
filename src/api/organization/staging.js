import request from '@/router/axios';

/**
 * 子期分页列表
 * @param {*} data 
*/
export function queryStageList(data) {
    return request({
        url: '/api/xye-manager/station/stage/queryStageList',
        method: 'post',
        data
    })
}
// 导出 
export function exportStageList(data) {
    return request({
        url: '/api/xye-manager/station/stage/exportStageList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 批量删除
export function removeStage(data) {
    return request({
        url: '/api/xye-manager/station/stage/removeStage',
        method: 'post',
        data
    })
}
// 新建
export function addStage(data) {
    return request({
        url: '/api/xye-manager/station/stage/addStage',
        method: 'post',
        data
    })
}
// 编辑
export function editStage(data) {
    return request({
        url: '/api/xye-manager/station/stage/editStage',
        method: 'post',
        data
    })
}
// 次分期详情
export function queryStageDetail(data) {
    return request({
        url: '/api/xye-manager/station/stage/queryStageDetail',
        method: 'post',
        data
    })
}
// 用户下拉框列表
export function userList(data) {
    return request({
        url: '/api/xye-manager/common/userList',
        method: 'post',
        data
    })
}