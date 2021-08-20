import request from '@/router/axios';

/**
 * 上传图片
 * @param {"imgFile"://需要上传的文件} data 
*/
export const imgUpload = (files) => {
  const formData = new FormData();
  formData.append('files', files);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/xye-manager/file/imgUpload',
    method: 'post',
    data: formData
  })
}

/**
 * 上传图片接口
 * @param {
 * "businessId":"",   //业务Id联图片  比如设备分组类别的设备状态标识表主键ID
 * "businessTypeList":["equipment_normal_img"]        //图片业务类型 
 * } data 
*/
export function getFiles(data) {
  return request({
    url: '/api/xye-manager/file/getFiles',
    method: 'post',
    data
  })
}

/**
 * 上传附件
 * @param {} data 
*/
export const fileUpload = (files) => {
  const formData = new FormData();
  formData.append('files', files);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/xye-manager/file/fileUpload',
    method: 'post',
    data: formData
  })
}
/**
 * 附件下载
 * @param {} data 
*/
export const fileDownload = (data) => {
  return request({
    header: {
      headers: { 'Content-Type': 'application/x-download' }
    },
    responseType: 'blob',	//指明返回格式
    method: 'get',
    url: '/api/xye-manager/file/download/'+data,
  })
}
/**
 * 模板下载
 * @param {} data 
*/
export const exportArea = (data) => {
  return request({
    header: {
      headers: { 'Content-Type': 'application/x-download' }
    },
    responseType: 'blob',	//指明返回格式
    method: 'get',
    url: '/api/xye-manager/file/downloadTemplate/'+data,
  })
}