import request from '@/router/axios';

/**
 * 任务分类列表
 * @param {*} data
*/
export function queryTaskClassificationList(data) {
    return request({
        url: '/api/xye-manager/taskClassification/queryTaskClassificationList',
        method: 'post',
        data
    })
}

/**
 * 任务分类下拉列表
 * @param {*} data
*/
export function queryTaskClassifications(data) {
    return request({
        url: '/api/xye-manager/taskClassification/queryTaskClassifications',
        method: 'post',
        data
    })
}

/**
 * 新增任务分类
 * @param {*} data
 */
export function addTaskClassification(data) {
    return request({
        url: '/api/xye-manager/taskClassification/addTaskClassification',
        method: 'post',
        data
    })
}

/**
 * 删除任务分类
 * @param {*} data
 */
export function delTaskClassification(data) {
    return request({
        url: '/api/xye-manager/taskClassification/delTaskClassification',
        method: 'post',
        data
    })
}

/**
 * 导出任务分类
 * @param {*} data
 */
export function exportTaskClassification(data) {
    return request({
        url: '/api/xye-manager/taskClassification/exportTaskClassification',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 编辑任务分类
export function editTaskClassification(data) {
    return request({
        url: '/api/xye-manager/taskClassification/editTaskClassification',
        method: 'post',
        data
    })
}
