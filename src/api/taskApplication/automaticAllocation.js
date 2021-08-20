import request from '@/router/axios';

/**
 * 列表
 * @param {*} data 
*/
export function distributeQueryPage(data) {
    return request({
        url: '/api/xye-manager/task/distribute/queryPage',
        method: 'post',
        data
    })
}
// 删除 
export function distributeRemove(data) {
    return request({
        url: '/api/xye-manager/task/distribute/remove',
        method: 'post',
        data
    })
}
// 导出
export function distributeExportList(data) {
    return request({
        url: '/api/xye-manager/task/distribute/exportList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 详情 
export function distributeExporDetail(data) {
    return request({
        url: '/api/xye-manager/task/distribute/detail',
        method: 'post',
        data
    })
}
// 新增  
export function distributeAdd(data) {
    return request({
        url: '/api/xye-manager/task/distribute/add',
        method: 'post',
        data
    })
}
// 编辑 
export function distributeExporEdit(data) {
    return request({
        url: '/api/xye-manager/task/distribute/edit',
        method: 'post',
        data
    })
}