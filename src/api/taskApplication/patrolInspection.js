import request from '@/router/axios';


/**
 * 查询巡检任务列表
 * @param {*} data 
*/
export function queryList(data) {
    return request({
        url: '/api/xye-manager/check/apply/queryList',
        method: 'post',
        data
    })
}

export function queryDetail(data) {
    return request({
        url: '/api/xye-manager/check/apply/detail',
        method: 'post',
        data
    })
}

export function situation(data) {
    return request({
        url: '/api/xye-manager/check/apply/flowAbleComplete',
        method: 'post',
        data
    })
}




