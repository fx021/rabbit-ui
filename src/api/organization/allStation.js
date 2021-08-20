import request from '@/router/axios';

// export const historyFlowList = (processInstanceId) => {
//     return request({
//         url: '/api/rabbit-flow/process/history-flow-list',
//         method: 'get',
//         params: {
//             processInstanceId
//         }
//     })
// }

/**
 * 主站列表
 * @param {*} data 
*/
export function queryMainStationList(data) {
    return request({
        url: '/api/xye-manager/station/main/queryMainStationList',
        method: 'post',
        data
    })
}
/**
 * 新增主站
 * @param {*} data 
 */
export function addMainStation(data) {
    return request({
        url: '/api/xye-manager/station/main/addMainStation',
        method: 'post',
        data
    })
}
/**
 * 主站下拉列表
 * @param {*} data 
 */
export function queryMainStationDropDownList(data) {
    return request({
        url: '/api/xye-manager/station/main/queryMainStationDropDownList',
        method: 'post',
        data
    })
}
/**
 * 更改主站有效无效状态
 * @param {*} data 
 * "mainStationIdList":["128280149698412544"], //主站id
 * "isEffective":0//0无效，1有效
 */
export function changeMainStationEffective(data) {
    return request({
        url: '/api/xye-manager/station/main/changeMainStationEffective',
        method: 'post',
        data
    })
}
/**
 * 删除主站
 * @param {*} data 
 */
export function removeMainStation(data) {
    return request({
        url: '/api/xye-manager/station/main/removeMainStation',
        method: 'post',
        data
    })
}

/**
 * 删除主站
 * @param {*} data 
 */
export function queryMainStationDetail(data) {
    return request({
        url: '/api/xye-manager/station/main/queryMainStationDetail',
        method: 'post',
        data
    })
}

/**
 * 导出主站列表
 * @param {*} data 
 */
export function exportMainStationList(data) {
    return request({
        url: '/api/xye-manager/station/main/exportMainStationList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 查询部门树
export function tree() {
    return request({
        url: '/api/rabbit-system/dept/tree',
        method: 'get',
    })
}

// 查询部门下人员列表

export function page(data) {
    return request({
        url: '/api/rabbit-user/page',
        method: 'get',
        params:data
    })
}
// 编辑主站
export function editMainStation(data) {
    return request({
        url: '/api/xye-manager/station/main/editMainStation',
        method: 'post',
        data
    })
}
