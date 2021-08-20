import request from '@/router/axios';

export const startList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/work/start-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const claimList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/work/claim-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const todoList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/work/todo-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const sendList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/work/send-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const readList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/changeRunTask/getProcessCC',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const doneList = (current, size, params) => {
  return request({
    url: '/api/rabbit-flow/work/done-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const claimTask = (taskId) => {
  return request({
    url: '/api/rabbit-flow/work/claim-task',
    method: 'post',
    params: {
      taskId
    }
  })
}


export const completeTask = (data) => {
  return request({
    url: '/api/rabbit-flow/work/complete-task',
    method: 'post',
    data
  })
}

/**
 *
 * @param params
 * @param {number} params.current
 * @param {number} params.size
 * @param {string} [params.realName] 用户名
 * @returns {*}
 */
export const userList = (params) => {
  return request({
    url: '/api/rabbit-user/user-list',
    method: 'get',
    params
  })
}

// 转办保存
export const turnTask = params => {
  return request({
    url: '/api/rabbit-flow/changeRunTask/turnTask',
    method: 'post',
    data: params
  })
}
// 代办保存
export const delegateTask = params => {
  return request({
    url: '/api/rabbit-flow/changeRunTask/delegateTask',
    method: 'post',
    data: params
  })
}
// 前加签保存
export const beforeAddSignTask = params => {
  return request({
    url: '/api/rabbit-flow/changeRunTask/beforeAddSignTask',
    method: 'post',
    data: params
  })
}
// 后加签保存
export const afterAddSignTask = params => {
  return request({
    url: '/api/rabbit-flow/changeRunTask/afterAddSignTask',
    method: 'post',
    data: params
  })
}

//驳回列表接口
/**
 *
 * @param params
 * @param {string} params.taskId  当前流程任务id
 * @param {string} params.taskName  任务名条件查询
 * @returns {*}
 */
 export const listAllRejectBackTaskModel = params => {
  return request({
    url: '/api/rabbit-flow/bpmnUserTask/listAllRejectBackTaskModel',
    method: 'post',
    data: params
  })
}


//驳回接口
/**
 *
 * @param params
 * @param {string} params.taskId  当前流程任务id
 * @param {string} params.targetTaskDefineKes  （驳回目标节点ID，就是驳回列表的taskDefKey（节点ID）
 * @returns {*}
 */
 export const rejectJump = params => {
  return request({
    url: '/api/rabbit-flow/bpmnUserTask/reject-jump',
    method: 'post',
    data: params
  })
}

/**
 * 查询历史起草节点
 * @param processInstanceId 流程实例ID
 * @returns {AxiosPromise}
 */
export const historyDraftingNodes = (processInstanceId) => {
  return request({
    url: '/api/rabbit-flow/work/historyDraftingNodes',
    method: 'get',
    params: {
      processInstanceId,
    }
  })
}

/**
 * 查询运行中的起草节点
 * @param processInstanceId 流程实例ID
 * @param processDefinitionId 流程定义ID
 * @returns {AxiosPromise}
 */
export const runDraftingNodes = (processInstanceId, processDefinitionId) => {
  return request({
    url: '/api/rabbit-flow/work/runDraftingNodes',
    method: 'get',
    params: {
      processInstanceId,
      processDefinitionId,
    }
  })
}
