import { getMessageInfo } from "@/api/system/message";


const _getMessageInfo = (params) => {
  return new Promise(resolve => {
    getMessageInfo({
      status: 0,
      pageNo: 1,
      pageSize: 10,
      ...params
    }).then(res => {
      resolve(res.data.data || {})
    })
  });
}


const state = {
  noticeList: [],
  noticeListTotal: 0,

  todoList: [],
  todoListTotal: 0,
}

const mutations = {
  SET_NOTICE_LIST_TOTAL: (state, total) => {
    state.noticeListTotal = total;
  },
  SET_TODO_LIST_TOTAL: (state, total) => {
    state.todoListTotal = total;
  },
  ADD_NOTICE: (state, arr) => {
    state.noticeList.unshift(...arr);
  },
  ADD_TODO: (state, arr) => {
    state.todoList.unshift(...arr);
  },
}


const actions = {
  // 获取通知
  getNoticeList({ commit, state }, messageId) {
    const params = {
      type: 0,
      messageId
    };
    _getMessageInfo(params).then(res => {
      if (!res.records || !res.records.length) {
        return
      }
      commit('ADD_NOTICE', res.records);
      if (messageId) {
        commit('SET_NOTICE_LIST_TOTAL', state.noticeListTotal + res.total);
      } else {
        commit('SET_NOTICE_LIST_TOTAL', res.total);
      }
    });
  },
  // 获取代办
  getTodoList({ commit, state }, messageId) {
    // console.log("getTodoList")

    const params = {
      type: 1,
      messageId
    };
    _getMessageInfo(params).then(res => {
      if (!res.records || !res.records.length) {
        return
      }
      commit('ADD_TODO', res.records);
      if (messageId) {
        commit('SET_TODO_LIST_TOTAL', state.todoListTotal + res.total);
      } else {
        commit('SET_TODO_LIST_TOTAL', res.total);
      }
    });
  },
}

const notice = {
  namespaced: true,
  state,
  actions,
  mutations
};

export default notice;
