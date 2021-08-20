import request from '@/router/axios';


/**
 * 设备台账列表
 * @param {*} data 
*/
export function queryList(data) {
    return request({
        url: '/api/xye-manager/equipent/account/queryList',
        method: 'post',
        data
    })
}

//导出
export function exportEquipmentAccountList(data) {
    return request({
        url: '/api/xye-manager/equipent/account/exportEquipmentAccountList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}