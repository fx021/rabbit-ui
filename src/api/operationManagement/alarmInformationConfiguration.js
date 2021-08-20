import request from '@/router/axios';


/**
 * 查询告警信息配置列表
 * @param {*} data 
*/
export function queryConfigureList(data) {
    return request({
        url: '/api/xye-manager/alarm/configure/queryList',
        method: 'post',
        data
    })
}
/**
 * 新增告警信息配置
 * @param {*} data 
*/
export function add(data) {
    return request({
        url: '/api/xye-manager/alarm/configure/add',
        method: 'post',
        data
    })
}


// 批量删除
export function remove(data) {
    return request({
        url: '/api/xye-manager/alarm/configure/remove',
        method: 'post',
        data
    })
}

// 批量导入
export function positionImport(files) {
    const formData = new FormData();
    formData.append('file', files);
    return request({
        url: '/api/xye-manager/alarm/configure/import',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data:formData
    })
}
// 编辑
export function edit(data) {
    return request({
        url: '/api/xye-manager/alarm/configure/edit',
        method: 'post',
        data
    })
}