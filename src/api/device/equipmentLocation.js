import request from '@/router/axios';
// 查询列表 
export function positionList(data) {
    return request({
        url: '/api/xye-manager/equipment/position/list',
        method: 'post',
        data
    })
}
//新增
export function positionAdd(data) {
    return request({
        url: '/api/xye-manager/equipment/position/add',
        method: 'post',
        data
    })
}
// 删除 
export function positionRemove(data) {
    return request({
        url: '/api/xye-manager/equipment/position/remove',
        method: 'post',
        data
    })
}
// 编辑 
export function positionEdit(data) {
    return request({
        url: '/api/xye-manager/equipment/position/edit',
        method: 'post',
        data
    })
}
// 详情 
export function positionDetail(data) {
    return request({
        url: '/api/xye-manager/equipment/position/detail',
        method: 'post',
        data
    })
}
// 导出
export function exportList(data) {
    return request({
        url: '/api/xye-manager/equipment/position/exportList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 详情导出
export function exportDetail(data) {
    return request({
        url: '/api/xye-manager/equipment/position/exportDetail',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 批量导入
export function positionImport(files) {
    const formData = new FormData();
    formData.append('file', files);
    return request({
        url: '/api/xye-manager/equipment/position/import',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData
    })
}
// 变更历史
export function positionHistory(data) {
    return request({
        url: '/api/xye-manager/equipment/position/history',
        method: 'post',
        data
    })
}
// 生成二维码
export function generateCode(data) {
    return request({
        url: '/api/xye-manager/equipment/position/generateCode',
        method: 'post',
        data
    })
}
// 设备位置巡检记录 
export function positionCheckHistory(data) {
    return request({
        url: '/api/xye-manager/equipment/position/check/history',
        method: 'post',
        data
    })
}
// 设备位置维修记录 
export function positionMaintainHistory(data) {
    return request({
        url: '/api/xye-manager/equipment/position/maintain/history',
        method: 'post',
        data
    })
}