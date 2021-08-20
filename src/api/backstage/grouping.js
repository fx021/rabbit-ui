import request from '@/router/axios';

/**
 * 分组类别列表
 * @param {*} data
*/
export function queryList(data) {
    return request({
        url: '/api/xye-manager/equipment/group/type/queryList',
        method: 'post',
        data
    })
}
/**
 * 新增分组类别
 * @param {*} data
 */
export function add(data) {
    return request({
        url: '/api/xye-manager/equipment/group/type/add',
        method: 'post',
        data
    })
}
/**
 * 分组类别详情列表
 * @param {*} data
 */
export function queryDetailList(data) {
    return request({
        url: '/api/xye-manager/equipment/state/image/queryList',
        method: 'post',
        data
    })
}

/**
 * 删除分组类别
 * @param {*} data
 */
export function remove(data) {
    return request({
        url: '/api/xye-manager/equipment/group/type/remove',
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

// 编辑分组类别
export function edit(data) {
    return request({
        url: '/api/xye-manager/equipment/group/type/edit',
        method: 'post',
        data
    })
}
