import request from '@/router/axios';


/**
 * 查询巡检任务列表
 * @param {*} data 
*/
export function queryChecktaskList(data) {
    return request({
        url: '/api/xye-manager/check/task/main/queryList',
        method: 'post',
        data
    })
}
/**
 * 查询巡检任务列表
 * @param {*} data 
*/
export function queryChecktaskDetailList(data) {
    return request({
        url: '/api/xye-manager/check/task/detail/queryList',
        method: 'post',
        data
    })
}

export function queryChecktaskItemList(data) {
    return request({
        url: '/api/xye-manager/check/task/item/queryList',
        method: 'post',
        data
    })
}
// 巡检任务明细列表
export function queryChecktaskDatagList(data) {
    return request({
        url: '/api/xye-manager/check/task/datag/queryList',
        method: 'post',
        data
    })
}
//导出 巡检任务
export function exportChecktaskList(data) {
    return request({
        url: '/api/xye-manager/check/task/main/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

//导出 任务清单
export function exportTaskDetailList(data) {
    return request({
        url: '/api/xye-manager/check/task/detail/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 批量删除
export function remove(data) {
    return request({
        url: '/api/xye-manager/check/task/main/remove',
        method: 'post',
        data
    })
}

// 手动派发
export function distribute(data) {
    return request({
        url: '/api/xye-manager/check/distribute',
        method: 'post',
        data
    })
}

// 查看图片或文件
export function getImage(data) {
    return request({
        url: '/api/xye-manager/file/getFiles',
        method: 'post',
        data
    })
}
// 延期 取消 暂停
export function checkApply(data) {
    return request({
        url: '/api/xye-manager/check/apply/add',
        method: 'post',
        data
    })
}

// 延期 取消 暂停
export function restartApply(data) {
    return request({
        url: '/api/xye-manager/check/apply/restart',
        method: 'post',
        data
    })
}
