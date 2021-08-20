import request from '@/router/axios';

/**
 * 任务内容列表
 * @param {*} data
*/
export function queryTaskDefinitionList(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/queryTaskDefinitionList',
        method: 'post',
        data
    })
}

/**
 * 任务内容下拉列表
 * @param {*} data
*/
export function queryTaskDefinitions(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/queryTaskDefinitions',
        method: 'post',
        data
    })
}

/**
 * 新增任务内容
 * @param {*} data
 */
export function addTaskDefinition(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/addTaskDefinition',
        method: 'post',
        data
    })
}

/**
 * 删除任务内容
 * @param {*} data
 */
export function delTaskDefinition(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/delTaskDefinition',
        method: 'post',
        data
    })
}

/**
 * 导出任务内容
 * @param {*} data
 */
export function exportTaskDefinition(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/exportTaskDefinition',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 编辑任务内容
export function editTaskDefinition(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/editTaskDefinition',
        method: 'post',
        data
    })
}

// 生成任务内容二维码
export function generateCode(data) {
    return request({
        url: '/api/xye-manager/taskDefinition/generateCode',
        method: 'post',
        data
    })
}
