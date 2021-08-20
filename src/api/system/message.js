import request from '@/router/axios';

/**
 * 获取未读的消息
 * @param params
 * @param params.status 消息状态 - 0:未阅/未办 1:已阅/已办
 * @param params.type 消息类型 - 0:通知类消息 1:待办类消息
 * @param params.pageNo  当前页 ,示例值(1)
 * @param params.pageSize 每页行数 ,示例值(10)
 * @param params.templateId 消息模板ID
 * @param params.messageId 获取该消息之后的消息
 * @returns {Promise}
 */
export const getMessageInfo = (params) => {
  return request({
    url: '/api/rabbit-system/message/info',
    method: 'get',
    params
  })
}

/**
 * 获取消息模板
 * @param {Object} params
 * @param {string} params.id 模板id
 * @param {string} params.messageSource 消息来源 - 0:flowable 1:xxl-job
 * @param {string} params.pageNo 当前页 ,示例值(1)
 * @param {string} params.pageSize 每页行数 ,示例值(10)
 * @param {string} params.status 模板状态 - 0:停用 1: 启用
 * @param {string} params.templateName 模板名称
 * @param {string} params.templateType 模板类型 - 0:通知类消息 1:待办类消息
 * @returns {Promise}
 */
export const getMessageTemplate = (params) => {
  return request({
    url: '/api/rabbit-system/messageTpl/template',
    method: 'get',
    params
  })
}



/**
 * 保存消息模板
 * @param {Object} params
 * @param {string} params.id 模板id
 * @param {string} params.status 模板状态 0是禁用，1是启用
 * @param {string} params.templateName 模板名称
 * @param {string} params.templateType 模板类型
 * @param {string} params.formType 表单类型-0:自定义表单 1:URL表单
 * @param {string} params.formId 表单ID/URL地址
 * @param {string} params.formParam 表单参数
 * @param {string} params.templateContent 内容模板
 * @param {string} params.receiver 接收方
 * @param {string} params.pushMode 	推送方式-0:APP,1:微信,2:短信,3:邮件
 * @param {string} params.messageSource 消息来源【默认为1】,0:flowable;1:xxl-job
 * @param {string} params.refresh 刷新频率-定时刷新”类消息专用【cron表达式】
 * @param {string} params.conditionXj xxl-job调度中心专用字段- 触发消息条件-(0: 无需用此字段,则xxl-job不生效 1:有数据为条件则生成消息,该设置会让第一条数据作为入参赋值到内容的key值;2: 列表,到时消息内容则直接就是查询sql的json信息;)
 * @param {string} params.sqlTextXj xxl-job调度中心专用字段 - sql文本
 * @returns {Promise}
 */
export const saveMessageTemplate = (params) => {
  return request({
    url: '/api/rabbit-system/messageTpl/subimt',
    method: 'post',
    data: params
  })
}
  /**
   * 删除消息模板
   * @param {Object} params
   * @param {string} params.id 模板id
   * @returns {Promise}
   */
export const delMessageTemplate = (params) => {
    return request({
      url: '/api/rabbit-system/messageTpl/remove',
      method: 'post',
      params
    })
}
/**
 * 根据cron表达式获取下次执行时间
 * @param {Object} params
 * @param {string} params.cron cron表达式
 * @returns {Promise}
 */
export const nextTriggerTime = (params) => {
  return request({
    url: '/api/rabbit-xxljob-admin/xxl-job-admin/nextTriggerTime',
    method: 'get',
    params
  })
}




