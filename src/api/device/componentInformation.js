import request from '@/router/axios';


/**
 * 查询组件信息列表
 * @param {*} data 
*/
export function queryComponentTemplateList(data) {
    return request({
        url: '/api/xye-manager/component/template/queryList',
        // url: '/api/component/template/queryList',
        method: 'post',
        data
    })
}

//导出
export function exportComponentTemplateList(data) {
    return request({
        url: '/api/xye-manager/component/template/export',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 批量删除
export function removeComponentTemplate(data) {
    return request({
        url: '/api/xye-manager/component/template/remove',
        method: 'post',
        data
    })
}

//置为有效/无效
export function changeComponentTemplate(data) {
    return request({
        url: '/api/xye-manager/component/template/isEffective',
        method: 'post',
        data
    })
}
/**
 * 新增组件模板
 * @param {*} data 
 */
 export function addComponentTemplate(data) {
    return request({
        url: '/api/xye-manager/component/template/add',
        // url: '/api/component/template/add',
        method: 'post',
        data
    })
}


/**
 * 查询组件模板参数
 * @param {*} data 
*/
export function queryComponentParamsList(data) {
    return request({
        url: '/api/xye-manager/component/param/queryList',
        // url: '/api/component/param/queryList',
        method: 'post',
        data
    })
}


/**
 * 编辑组件模板参数
 * @param {*} data 
*/
export function editComponentTemplate(data) {
    return request({
        url: '/api/xye-manager/component/template/edit',
        // url: '/api/component/param/queryList',
        method: 'post',
        data
    })
}
