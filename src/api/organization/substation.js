import request from '@/router/axios';

/**
 * 子期分页列表
 * @param {*} data 
*/
export function querySubStationList(data) {
    return request({
        url: '/api/xye-manager/station/sub/querySubStationList',
        method: 'post',
        data
    })
}

/**
 * 子期下拉框列表
 * @param {*} data 
*/
export function querySubStationDropDownList(data) {
    return request({
        url: '/api/xye-manager/station/sub/querySubStationDropDownList',
        method: 'post',
        data
    })
}
// 更改子期有效无效状态

export function changeSubStationEffective(data) {
    return request({
        url: '/api/xye-manager/station/sub/changeSubStationEffective',
        method: 'post',
        data
    })
}

// 导出 
export function exportSubStationList(data) {
    return request({
        url: '/api/xye-manager/station/sub/exportSubStationList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 批量删除
export function removeSubStation(data) {
    return request({
        url: '/api/xye-manager/station/sub/removeSubStation',
        method: 'post',
        data
    })
}
// 子期详情
export function querySubStationDetail(data){
    return request({
        url:"/api/xye-manager/station/sub/querySubStationDetail",
        method:'post',
        data
    })
}
// 新增子期
export function addSubStation(data){
    return request({
        url:"/api/xye-manager/station/sub/addSubStation",
        method:'post',
        data
    })
}
// 编辑子期
export function editSubStation(data){
    return request({
        url:"/api/xye-manager/station/sub/editSubStation",
        method:'post',
        data
    })
}