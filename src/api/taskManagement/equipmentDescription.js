import request from '@/router/axios';
/**
 * 情况说明单列表
 * @param {*} data 
*/
export function explainQueryList(data) {
    return request({
        url: '/api/xye-manager/situation/explain/queryList',
        method: 'post',
        data
    })
}
/**
 * 列表导出
 * @param {*} data
*/
export function exportSituationExplainOrderList(data) {
    return request({
        url: '/api/xye-manager/situation/explain/exportSituationExplainOrderList',
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
        url: '/api/xye-manager/situation/explain/remove',
        method: 'post',
        data
    })
}
// 详情 
export function situationDetailList(data) { 
    return request({
        url: '/api/xye-manager/situation/explain/detail',
        method: 'post',
        data
    })
}
// 新增 
export function situationAdd(data) { 
    return request({
        url: '/api/xye-manager/situation/explain/add',
        method: 'post',
        data
    })
}
// 编辑 
export function situationEdit(data) {
    return request({
        url: '/api/xye-manager/situation/explain/edit',
        method: 'post',
        data
    })
}
// 工单状态
export function querySituationExplainOrderStatus(data) {
    return request({
        url: '/api/xye-manager/situation/explain/querySituationExplainOrderStatus',
        method: 'get',
        data
    })
}
// 详情导出 
export function exportSituationExplainOrderDetail(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/exportSituationExplainOrderDetail',
        method: 'post',
        data
    })
}
//情况说明单工作流操作 
export function flowAbleComplete(data) {
    return request({
        url: '/api/xye-manager/situation/explain/flowAbleComplete',
        method: 'post',
        data
    })
}