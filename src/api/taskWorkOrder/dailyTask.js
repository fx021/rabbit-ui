import request from '@/router/axios';


/**
 * 查询日常任务
 * @param {*} data
*/
export function queryEverydayTaskList(data) {
    return request({
        url: '/api/xye-manager/everydayTask/queryEverydayTaskList',
        method: 'post',
        data
    })
}

// 批量删除
export function delEverydayTask(data) {
    return request({
        url: '/api/xye-manager/everydayTask/delEverydayTask',
        method: 'post',
        data
    })
}

// 详情
export function queryEverydayTaskDetails(data) {
    return request({
        url: '/api/xye-manager/everydayTask/queryEverydayTaskDetails',
        method: 'post',
        data
    })
}

// 新增
export function addEverydayTask(data) {
    return request({
        url: '/api/xye-manager/everydayTask/addEverydayTask',
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
export function exportEverydayTaskList(data) {
    return request({
        url: '/api/xye-manager/everydayTask/exportEverydayTaskList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 记录查询
export function queryTaskOrder(data) {
    return request({
        url: '/api/xye-manager/everydayTask/queryTaskOrder',
        method: 'post',
        data
    })
}

// 工单状态
export function taskStateTypeRecord(data) {
    return request({
        url: '/api/xye-manager/everydayTask/taskStateTypeRecord',
        method: 'post',
        data
    })
}

// 流程接口
export function maintainFlowAble(data) {
    return request({
        url: '/api/xye-manager/everydayTask/maintainFlowAble',
        method: 'post',
        data
    })
}

