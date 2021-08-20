import request from '@/router/axios';

//导入区域划分Excel
export function importAreaList(files) {
    const formData = new FormData();
    formData.append('file', files);
    return request({
        url: '/api/xye-manager/area/importAreaList',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data:formData
    })
}
// 导出 
export function exportAreaList(data) {
    return request({
        url: '/api/xye-manager/area/exportAreaList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 区域划分列表
export function queryList(data) {
    return request({
        url: '/api/xye-manager/area/queryList',
        method: 'post',
        data
    })
}
// 删除 
export function remove(data) {
    return request({
        url: '/api/xye-manager/area/remove',
        method: 'post',
        data
    })
}
// 详情
export function areaDetail(data) {
    return request({
        url: '/api/xye-manager/area/detail',
        method: 'post',
        data
    })
}
// 编辑
export function areaEdit(data) {
    return request({
        url: '/api/xye-manager/area/edit',
        method: 'post',
        data
    })
}
// 新增
export function areaAdd(data) {
    return request({
        url: '/api/xye-manager/area/add',
        method: 'post',
        data
    })
}
// 设置状态区域划分 
export function updateStatus(data) {
    return request({
        url: '/api/xye-manager/area/updateStatus',
        method: 'post',
        data
    })
}