import request from '@/router/axios';


/**
 * 查询组件台账列表
 * @param {*} data 
*/
export function queryeQuipmentList(data) {
    return request({
        url: '/api/xye-manager/equipment/group/queryList',
        // url: '/api/component/account/queryList',
        method: 'post',
        data
    })
}

//导出
export function exportEquipmentAccountList(data) {
    return request({
        url: '/api/xye-manager/equipment/group/export',
        // url: '/api/component/account/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 批量删除
export function removeEquipmentTemplate(data) {
    return request({
        url: '/api/xye-manager/equipment/group/remove',
        method: 'post',
        data
    })
}
//置为有效/无效
export function changeEquipmentTemplate(data) {
    return request({
        url: '/api/xye-manager/equipment/group/equipmentGroupEditState',
        method: 'post',
        data
    })
}

// 查询设备分组下拉框 
export function queryEquipmentGroupList(data) {
    return request({
        url: '/api/xye-manager/equipment/group/queryEquipmentGroupList',
        method: 'post',
        data
    })
}
/**
 * 分组类别下拉框列表
 * @param {*} data 
*/
export function queryEquipmentDropDownList(data) {
    return request({
        url: '/api/xye-manager/equipment/group/type/queryEquipmentGroupTypeNameList',
        method: 'post',
        data
    })
}
/**
 * 新增组件模板
 * @param {*} data 
 */
 export function addEquipmentTemplate(data) {
    return request({
        url: '/api/xye-manager/equipment/group/add',
        method: 'post',
        data
    })
}
/**
 * 新增组件模板
 * @param {*} data 
 */
 export function editEquipmentTemplate(data) {
    return request({
        url: '/api/xye-manager/equipment/group/edit',
        method: 'post',
        data
    })
}