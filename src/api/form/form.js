import request from "@/router/axios";

/**
 *
 * @param {string} sourceId
 * @param {string} sql
 * @returns {Promise}
 */
export const parse = (sourceId, sql = "T") => {
  return request({
    url: '/api/rabbit-resource/formcustom/parse',
    method: 'post',
    data: {
      sourceId,
      sql,
    }
  })
}

/**
 * 获取表单信息
 * @param {string} formId 表单id
 * @returns {Promise}
 */
export const getForm = (formId) => {
  return request({
    url: `/api/rabbit-resource/formcustom/form/${formId}`,
    method: 'get',
  })
}

/**
 * 获取表单列表信息
 * @param {string} formId 表单id
 * @returns {Promise}
 */
export const getFormList = (formId) => {
  return request({
    url: `/api/rabbit-resource/formcustom/form-list/${formId}`,
    method: 'get',
  })
}


/**
 * 关联流程
 * @param {Object} params
 * @param {string} params.formId 表单ID
 * @param {string} params.procDefId 流程模型ID
 * @param {string} params.procActId 流程节点ID
 * @param {string} params.formActJson 表单关联流程json
 * @param {string} params.status 状态
 * @returns {Promise}
 */
export const processRelative = (params) => {
  return request({
    url: `/api/rabbit-resource/formcustom/form-act`,
    method: 'post',
    data:params
  })
}

/**
 * 获取关联流程
 * @param {string} formId 表单id
 * @returns {Promise}
 */
export const getProcessRelation = (formId) => {
  return request({
    url: `/api/rabbit-resource/formcustom/form-act`,
    method: 'get',
    params:{
      formId
    }
  })
}
