import request from '@/router/axios';

/**
 * 统计读数类型列表
 * @param {*} data
*/
export function queryList(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/checkDatag/queryList',
        method: 'post',
        data
    })
}
/**
 * 新增统计读数类型
 * @param {*} data
 */
export function add(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/checkDatag/add',
        method: 'post',
        data
    })
}
/**
 * 统计读数类型详情列表
 * @param {*} data
 */
export function detail(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/checkDatag/detail',
        method: 'post',
        data
    })
}

/**
 * 删除统计读数类型
 * @param {*} data
 */
export function remove(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/checkDatag/remove',
        method: 'post',
        data
    })
}

/**
 * 导出分组类别
 * @param {*} data
 */
export function exportList(data) {
    return request({
        url: '/api/xye-manager/equipment/group/type/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 编辑统计读数类型
export function edit(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/checkDatag/edit',
        method: 'post',
        data
    })
}
