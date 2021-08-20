import request from '@/router/axios';

export const modelList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/model/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

/**
 * 获取流程列表
 * @param {number} current 当前页面
 * @param {number} size 条数
 * @param {Object} [params] 额外参数
 * @param {string} params.category 分类
 * @param {number} params.mode  1 通用流程 | 2 定制流程
 * @param {string} params.key {string} 流程标识
 * @returns {Promise}
 */
export const managerList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/manager/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

/**
 * 获取流程列表
 * @param {string} key 流程标识
 */
export const getProcessByKey = (key) => {
  return request({
    url: '/api/rabbit-flow/process/formAsProcess-list',
    method: 'get',
    params: {
      key,
      id:"",
    }
  })
}

/**
 * 获取流程列表
 * @param {string} id 流程标识
 */
export const getProcessById = (id) => {
  return request({
    url: '/api/rabbit-flow/process/formAsProcess-list',
    method: 'get',
    params: {
      id
    }
  })
}


/**
 * 获取表单信息
 * @param {string} processId 流程id
 * @param {string} formId 表单id
 * @returns {Promise}
 */
export const getFormInfo = (processId, formId) => {
  return request({
    url: '/api/rabbit-flow/jurisdiction/getFormInfo',
    method: 'get',
    params: {
      processId,
      formId,
    }
  })
}

/**
 * 获取表单信息
 * @param {string} processId 流程id
 * @param {string} formId 表单id
 * @param {string} processNodeId 流程节点id
 * @returns {Promise}
 */
export const getNodeData = (processId, formId, processNodeId) => {
  return request({
    url: '/api/rabbit-resource/formcustom/form-auth/node-data',
    method: 'get',
    params: {
      processId,
      formId,
      processNodeId
    }
  })
}


/**
 * 获取流程节点
 * @param {string} processDefinitionId 流程id
 * @returns {Promise}
 */
export const getAllProcessNode = (processDefinitionId) => {
  return request({
    url: '/api/rabbit-flow/jurisdiction/getAllProcessNode',
    method: 'get',
    params: {
      processDefinitionId,
    }
  })
}

export const followList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/follow/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const removeModel = (ids) => {
  return request({
    url: '/api/rabbit-flow/model/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const deployModel = (params) => {
  return request({
    url: '/api/rabbit-flow/model/deploy',
    method: 'post',
    params
  })
}

export const changeState = (params) => {
  return request({
    url: '/api/rabbit-flow/manager/change-state',
    method: 'post',
    params
  })
}

export const deployUpload = (category, tenantIds, files) => {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('tenantIds', tenantIds);
  files.forEach(file => {
    formData.append('files', file);
  });
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/rabbit-flow/manager/deploy-upload',
    method: 'post',
    data: formData
  })
}

export const deleteDeployment = (deploymentIds) => {
  return request({
    url: '/api/rabbit-flow/manager/delete-deployment',
    method: 'post',
    params: {
      deploymentIds,
    }
  })
}

export const deleteProcessInstance = (params) => {
  return request({
    url: '/api/rabbit-flow/follow/delete-process-instance',
    method: 'post',
    params
  })
}
