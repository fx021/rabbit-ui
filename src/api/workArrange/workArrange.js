import request from '@/router/axios';
/**
 * 情况说明单列表
 * @param {*} data 
*/
export function arrangeQueryPage(data) {
    return request({
        url: '/api/xye-manager/work/arrange/queryPage',
        method: 'post',
        data
    })
}
/**
 * 批量删除
 * @param {*} data 
*/
export function arrangeRemove(data) {
    return request({
        url: '/api/xye-manager/work/arrange/remove',
        method: 'post',
        data
    })
}
/**
 * 详情
 * @param {*} data 
*/
export function arrangeDetail(data) {
    return request({
        url: '/api/xye-manager/work/arrange/detail',
        method: 'post',
        data
    })
}
/**
 * 导入排班
 * @param {*} data 
*/
export const arrangeAnalysis = (files) => {
    const formData = new FormData();
    formData.append('file', files);
    return request({
        headers: {
            "Content-Type": "multipart/form-data"
        },
        url: '/api/xye-manager/work/arrange/analysis',
        method: 'post',
        data: formData
    })
}
/**
 * 天气
 * @param {*} data 
*/
export function arrangeWeather(data) {
    return request({
        url: `/api/xye-manager/work/arrange/weathers`,
        method: 'post',
        data
    })
}
/**
 * 详情
 * @param {*} data 
*/
export function arrangeAdd(data) {
    return request({
        url: '/api/xye-manager/work/arrange/add',
        method: 'post',
        data
    })
}

/**
 * 更改排班有效无效状态
 * @param {*} data 
*/
export function arrangeChangeEffective(data) {
    return request({
        url: '/api/xye-manager/work/arrange/changeEffective',
        method: 'post',
        data
    })
}
/**
 * 导出
 * @param {*} data 
*/
export function arrangeExportDetail(data) {
    return request({
        url: '/api/xye-manager/work/arrange/exportDetail',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        method: 'post',
        data
    })
}
/**
 * 更改排班有效无效状态
 * @param {*} data 
*/
export function statisticsWeatherDays(data) {
    return request({
        url: '/api/xye-manager/work/arrange/statisticsWeatherDays',
        method: 'post',
        data
    })
}

/**
 * 更改排班有效无效状态
 * @param {*} data 
*/
export function arrangeWorkCountDetai(data) {
    return request({
        url: '/api/xye-manager/work/arrange/'+data.url,
        method: 'post',
        data
    })
}
// 
/**
 * 编辑排班
 * @param {*} data 
*/
export function arrangeEdit(data) {
    return request({
        url: '/api/xye-manager//work/arrange/edit',
        method: 'post',
        data
    })
}