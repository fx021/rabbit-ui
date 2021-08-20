import request from '@/router/axios';

/**
 * 组织下拉列表
 * @param {*} data
*/
export function queryMainStationDropDownList(data) {
    return request({
        url: '/api/xye-manager/station/main/queryMainStationDropDownList',
        method: 'post',
        data
    })
}

/**
 * 设备巡检计划复制
 * @param {*} data
*/
export function copyPlan(data) {
    return request({
        url: '/api/xye-manager/check/plan/copyPlan',
        method: 'post',
        data
    })
}

/**
 * 设备巡检计划列表
 * @param {*} data
*/
export function queryCheckPlanMainList(data) {
    return request({
        url: '/api/xye-manager/check/plan/queryCheckPlanMainList',
        method: 'post',
        data
    })
}
/**
 * 新增设备巡检计划
 * @param {*} data
 */
export function addPlan(data) {
    return request({
        url: '/api/xye-manager/check/plan/addPlan',
        method: 'post',
        data
    })
}

/**
 * 设备巡检计划详情列表
 * @param {*} data
 */
export function planDetail(data) {
    return request({
        url: '/api/xye-manager/check/plan/planDetail',
        method: 'post',
        data
    })
}

/**
 * 设备巡检计划有效无效状态
 * @param {*} data
 */
export function changeEffective(data) {
    return request({
        url: '/api/xye-manager/check/plan/changeEffective',
        method: 'post',
        data
    })
}

/**
 * 删除设备巡检计划
 * @param {*} data
 */
export function removePlan(data) {
    return request({
        url: '/api/xye-manager/check/plan/removePlan',
        method: 'post',
        data
    })
}

/**
 * 导出设备巡检计划
 * @param {*} data
 */
export function exportCheckPlanMainList(data) {
    return request({
        url: '/api/xye-manager/check/plan/exportCheckPlanMainList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

/**
 * 导出设备巡检计划详情
 * @param {*} data
 */
export function exportCheckPlanDetail(data) {
    return request({
        url: '/api/xye-manager/check/plan/exportCheckPlanDetail',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 编辑设备巡检计划
export function editPlan(data) {
    return request({
        url: '/api/xye-manager/check/plan/editPlan',
        method: 'post',
        data
    })
}


/**
 * 巡检内容下拉列表
 * @param {*} data
*/
export function queryAllCheckList(data) {
  return request({
      url: '/api/xye-manager/equipmentmain/check/queryAllCheckList',
      method: 'post',
      data
  })
}

/**
 * 巡检内容项列表
 * @param {*} data
*/
export function queryCheckItemList(data) {
  return request({
      url: '/api/xye-manager/equipmentmain/check/queryCheckItemList',
      method: 'post',
      data
  })
}

/**
 * 巡检设备列表
 * @param {*} data
*/
export function queryCheckEquipmentList(data) {
  return request({
      url: '/api/xye-manager/equipmentmain/check/queryCheckEquipmentList',
      method: 'post',
      data
  })
}

/**
 * 巡检设备详情列表
 * @param {*} data
*/
export function queryCheckEquipmentDetailList(data) {
  return request({
      url: '/api/xye-manager/check/plan/queryCheckEquipmentList',
      method: 'post',
      data
  })
}

/**
 * 方阵下拉
 * @param {*} data
*/
export function queryAreaDropDownList(data) {
  return request({
      url: '/api/xye-manager/area/queryAreaDropDownList',
      method: 'post',
      data
  })
}

/**
 * 频率列表
 * @param {*} data
*/
export function queryFrequencyList(data) {
  return request({
      url: '/api/xye-manager/checkPlan/frequency/queryList',
      method: 'post',
      data
  })
}

/**
 * 频率下拉
 * @param {*} data
*/
export function queryPlanFrequencyAllList(data) {
  return request({
      url: '/api/xye-manager/check/plan/queryPlanFrequencyAllList',
      method: 'post',
      data
  })
}

/**
 * 生成任务
 * @param {*} data
*/
export function manualCreateCheckTask(data) {
  return request({
      url: '/api/xye-manager/check/plan/manualCreateCheckTask',
      method: 'post',
      data
  })
}

/**
 * 查询计划生成的任务
 * @param {*} data
*/
export function queryPlanTaskList(data) {
  return request({
      url: '/api/xye-manager/check/plan/queryPlanTaskList',
      method: 'post',
      data
  })
}

/**
 * 巡检计划工作流
 * @param {*} data
*/
export function planReviewProcess(data) {
  return request({
      url: '/api/xye-manager/check/plan/planReviewProcess',
      method: 'post',
      data
  })
}

/**
 * 停机申请
 * @param {*} data
*/
export function excludePlanEquipment(data) {
  return request({
      url: '/api/xye-manager/check/plan/excludePlanEquipment',
      method: 'post',
      data
  })
}

/**
 * 导出计划生成的任务
 * @param {*} data
 */
 export function exportPlanTaskList(data) {
  return request({
      url: '/api/xye-manager/check/plan/exportPlanTaskList',
      method: 'post',
      header: {
          headers: { 'Content-Type': 'application/x-download' }
      },
      responseType: 'blob',	//指明返回格式
      data
  })
}


/**
 * 查看流程信息
 * @param {*} data
 */
 export function processDetail(data) {
  return request({
      url: '/api/xye-manager/alerm/Confirmation/slip/processDetail',
      method: 'post',
      data
  })
}
