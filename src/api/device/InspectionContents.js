import request from '@/router/axios';


/**
 * 查询组件台账列表
 * @param {*} data 
*/
export function queryEquipmentmainList(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/check/queryList',
        method: 'post',
        data
    })
}

//导出
export function exportEquipmentAccountList(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/check/exportEquipmentCheckList',
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
        url: '/api/xye-manager/equipmentmain/check/remove',
        method: 'post',
        data
    })
}


/**
 * 新增
 * @param {*} data 
 */
 export function addEquipmentTemplate(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/check/add',
        method: 'post',
        data
    })
}

/**
 * 编辑
 * @param {*} data 
 */
 export function editEquipmentTemplate(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/check/edit',
        method: 'post',
        data
    })
}
export function queryCheckDatagList(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/checkDatag/queryList',
        method: 'post',
        data
    })
}

/**
 * 详情
 * @param {*} data 
 */
 export function editEquipmentDetail(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/check/detail',
        method: 'post',
        data
    })
}/**
 * 复制
 * @param {*} data 
 */
export function copyEquipmentDetail(data) {
    return request({
        url: '/api/xye-manager/equipmentmain/check/copy',
        method: 'post',
        data
    })
}
// 批量导入
export function positionImport(files) {
    const formData = new FormData();
    formData.append('file', files);
    return request({
        url: '/api/xye-manager/equipmentmain/check/importEquipmentCheckList',
        method: 'post',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data:formData
    })
}