import request from '@/router/axios';


/**
 * 查询外出任务列表
 * @param {*} data
*/
export function queryList(data) {
    return request({
        url: '/api/xye-manager/out/task/queryList',
        method: 'post',
        data
    })
}

// 批量删除
export function remove(data) {
    return request({
        url: '/api/xye-manager/out/task/remove',
        method: 'post',
        data
    })
}

// 详情
export function detail(data) {
    return request({
        url: '/api/xye-manager/out/task/detail',
        method: 'post',
        data
    })
}

// 新增
export function add(data) {
    return request({
        url: '/api/xye-manager/out/task/add',
        method: 'post',
        data
    })
}

// 编辑
export function edit(data) {
    return request({
        url: '/api/xye-manager/alerm/Confirmation/slip/edit',
        method: 'post',
        data
    })
}

// 导出
export function exportOutTaskList(data) {
    return request({
        url: '/api/xye-manager/out/task/exportOutTaskList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 记录查询
export function records(data) {
    return request({
        url: '/api/xye-manager/out/task/records',
        method: 'post',
        data
    })
}

// 工单状态
export function updateStatus(data) {
    return request({
        url: '/api/xye-manager/out/task/updateStatus',
        method: 'post',
        data
    })
}

// 流程接口
export function flowAbleComplete(data) {
    return request({
        url: '/api/xye-manager/out/task/flowAbleComplete',
        method: 'post',
        data
    })
}

