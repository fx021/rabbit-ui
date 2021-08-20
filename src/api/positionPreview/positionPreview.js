import request from '@/router/axios';

/**
 * 查询当前登录用户所属主站的经纬度
 * @param {*} data
*/
export function getCurrentMainStationMapPosition(data) {
    return request({
        url: '/api/xye-manager/map/getCurrentMainStationMapPosition',
        method: 'post',
        data
    })
}
/**
 * 查询所有主站经纬度，电子围栏
 * @param {*} data
 *  "mainStationList":["1"]//组织id
*/
export function queryAllMainStationMapPosition(data) {
    return request({
        url: '/api/xye-manager/map/queryAllMainStationMapPosition',
        method: 'post',
        data
    })
}
/**
 * 查询指定主站经纬度，电子围栏
 * @param {*} data
*/
export function queryMainStationMapPosition(data) {
    return request({
        url: '/api/xye-manager/map/queryMainStationMapPosition',
        method: 'post',
        data
    })
}
/**
 * 编辑主站电子围栏
 * @param {*} data
*/
export function editMainStationMapFence(data) {
    return request({
        url: '/api/xye-manager/map/editMainStationMapFence',
        method: 'post',
        data
    })
}
/**
 * 查询方阵经电子围栏
 * @param {*} data
*/
export function queryAreaMapPosition(data) {
    return request({
        url: '/api/xye-manager/map/queryAreaMapPosition',
        method: 'post',
        data
    })
}
/**
 * 编辑方阵经电子围栏
 * @param {*} data
*/
export function editAreaMapFence(data) {
    return request({
        url: '/api/xye-manager/map/editAreaMapFence',
        method: 'post',
        data
    })
}
/**
 * 根据设备分组查询位置绑定的设备
 * @param {*} data
*/
export function queryEquipmentByGroup(data) {
    return request({
        url: '/api/xye-manager/map/queryEquipmentByGroup',
        method: 'post',
        data
    })
}
/**
 * 查询地图上设备位置详情
 * @param {*} data
*/
export function queryEquipmentDetail(data) {
    return request({
        url: '/api/xye-manager/map/queryEquipmentDetail',
        method: 'post',
        data
    })
}
