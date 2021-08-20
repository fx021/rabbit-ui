import request from '@/router/axios';

/**
 * 计划频率列表
 * @param {*} data
*/
export function checkPlanQueryList(data) {
    return request({
        url: '/api/xye-manager/checkPlan/frequency/queryList',
        method: 'post',
        data
    })
}
/**
 * 新增计划频率
 * @param {*} data
*/
export function checkPlanAdd(data) {
    return request({
        url: '/api/xye-manager/checkPlan/frequency/add',
        method: 'post',
        data
    })
}
/**
 * 编辑计划频率
 * @param {*} data
*/
export function checkPlanEdit(data) {
    return request({
        url: '/api/xye-manager/checkPlan/frequency/edit',
        method: 'post',
        data
    })
}
/**
 * 计划频率详情
 * @param {*} data
*/
export function checkPlanDetail(data) {
    return request({
        url: '/api/xye-manager/checkPlan/frequency/detail',
        method: 'post',
        data
    })
}
/**
 * 计划频率删除
 * @param {*} data
*/
export function checkPlanRemove(data) {
    return request({
        url: '/api/xye-manager/checkPlan/frequency/removeCheckPlanFrequency',
        method: 'post',
        data
    })
}
/**
 * 导出
 * @param {*} data
*/
export function exportPlanFrequencyList(data) {
    return request({
        url: '/api/xye-manager/checkPlan/frequency/exportPlanFrequencyList',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        method: 'post',
        data
    })
}
