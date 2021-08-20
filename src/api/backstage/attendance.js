import request from '@/router/axios';

/**
 * 出勤类型列表
 * @param {*} data
*/
export function queryPageList(data) {
    return request({
        url: '/api/xye-manager/work/attendanceType/queryPageList',
        method: 'post',
        data
    })
}
/**
 * 新增出勤类型
 * @param {*} data
 */
export function add(data) {
    return request({
        url: '/api/xye-manager/work/attendanceType/add',
        method: 'post',
        data
    })
}
/**
 * 出勤类型详情列表
 * @param {*} data
 */
export function detail(data) {
    return request({
        url: '/api/xye-manager/work/attendanceType/detail',
        method: 'post',
        data
    })
}

/**
 * 删除出勤类型
 * @param {*} data
 */
export function remove(data) {
    return request({
        url: '/api/xye-manager/work/attendanceType/remove',
        method: 'post',
        data
    })
}

//导入Excel
export function importList(files) {
  const formData = new FormData();
  formData.append('files', files);
  return request({
      url: '/api/xye-manager/work/attendanceType/import',
      method: 'post',
      headers: {
          "Content-Type": "multipart/form-data"
      },
      data:formData
  })
}

/**
 * 模板下载
 * @param {} data
*/
export const download = (data) => {
  return request({
    header: {
      headers: { 'Content-Type': 'application/x-download' }
    },
    responseType: 'blob',	//指明返回格式
    method: 'get',
    url: '/api/xye-manager/file/downloadTemplate/import_work_attendance_type_template',
    data
  })
}

/**
 * 导出出勤类型
 * @param {*} data
 */
export function exportList(data) {
    return request({
        url: '/api/xye-manager/work/attendanceType/exportList',
        method: 'post',
        header: {
            headers: { 'Content-Type': 'application/x-download' }
        },
        responseType: 'blob',	//指明返回格式
        data
    })
}

// 编辑出勤类型
export function edit(data) {
    return request({
        url: '/api/xye-manager/work/attendanceType/edit',
        method: 'post',
        data
    })
}
