import request from '@/router/axios';


/** xye-manager/
 * 查询设备档案列表
 * @param {*} data 
*/
export function archivesQueryList(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/queryList',
        method: 'post',
        data
    })
}

//导出
export function archivesExport(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
// 导入
export const archivesImport = (files) => {
    const formData = new FormData();
    formData.append('file', files);
    return request({
      headers: {
        "Content-Type": "multipart/form-data"
      },
      url: '/api/xye-manager/equipment/archives/import',
      method: 'post',
      data: formData
    })
  }
// 删除 
export function archivesRemove(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/remove',
        method: 'post',
        data
    })
}
// 新增 
export function archivesAdd(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/add',
        method: 'post',
        data
    })
}
// 编辑
export function archivesEdit(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/edit',
        method: 'post',
        data
    })
}
// 设备报废
export function archivesEditState(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/editState',
        method: 'post',
        data
    })
}
// 设备档案巡检记录 
export function archivesCheckHistory(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/check/history',
        method: 'post',
        data
    })
}
// 设备档案维修记录 
export function archivesMaintainHistory(data) {
    return request({
        url: '/api/xye-manager/equipment/archives/maintain/history',
        method: 'post',
        data
    })
}