import request from '@/router/axios';

/**
 * 基础频率列表
 * @param {*} data
*/
export function frequencyQueryList(data) {
    return request({
        url: '/api/xye-manager/frequency/queryList',
        method: 'post',
        data
    })
}
/**
 * 新增基础频率
 * @param {*} data
*/
export function frequencyAdd(data) {
    return request({
        url: '/api/xye-manager/frequency/add',
        method: 'post',
        data
    })
}
/**
 * 编辑基础频率
 * @param {*} data
*/
export function frequencyEdit(data) {
    return request({
        url: '/api/xye-manager/frequency/edit',
        method: 'post',
        data
    })
}
/**
 * 基础频率详情
 * @param {*} data
*/
export function frequencyDetail(data) {
    return request({
        url: '/api/xye-manager/frequency/detail',
        method: 'post',
        data
    })
}
/**
 * 基础频率删除
 * @param {*} data
*/
export function frequencyRemove(data) {
    return request({
        url: '/api/xye-manager/frequency/remove',
        method: 'post',
        data
    })
}