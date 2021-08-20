import request from '@/router/axios';
// 数据字典列表
export function list() {
    return request({
        url: '/api/rabbit-system/dict/list',
        method: 'get',
    })
}

/**
 * 数据字典下拉框
 * @param {code=字典的code} data 
 */
export function dictionary(data) {
    return request({
        url: '/api/rabbit-system/dict/dictionary',
        method: 'get',
        params: data
    })
}
// 用户下拉框列表
export const userList = (data) => {
    return request({
        url: '/api/xye-manager/common/userList',
        method: 'post',
        data
    })
};
