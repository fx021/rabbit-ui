import request from '@/router/axios';


/**
 * 查询设备停机申请列表
 * @param {*} data
*/
export function planExcludePage(data) {
    return request({
        url: '/api/xye-manager/check/plan/planExcludePage',
        method: 'post',
        data
    })
}

/**
 * 设备停机申请流程
 * @param {*} data
*/
export function completePlanExclude(data) {
    return request({
        url: '/api/xye-manager/check/plan/completePlanExclude',
        method: 'post',
        data
    })
}

/**
 * 查询设备停机申请详情
 * @param {*} data
*/
export function planExcludeDetail(data) {
    return request({
        url: '/api/xye-manager/check/plan/planExcludeDetail',
        method: 'post',
        data
    })
}


