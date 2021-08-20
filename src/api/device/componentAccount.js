import request from '@/router/axios';


/**
 * 查询组件台账列表
 * @param {*} data 
*/
export function queryComponentList(data) {
    return request({
        url: '/api/xye-manager/component/account/queryList',
        // url: '/api/component/account/queryList',
        method: 'post',
        data
    })
}

//导出
export function exportComponentAccountList(data) {
    return request({
        url: '/api/xye-manager/component/account/export',
        // url: '/api/component/account/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}
