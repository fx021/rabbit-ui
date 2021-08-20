<template>
  <el-popover placement="bottom" width="350" trigger="click" popper-class="top-notice-popover">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`待办(${notice.todoListTotal})`" name="first">
        <el-scrollbar style="height: 300px">
          <a
            class="scroll-item"
            v-for="(item,index) in notice.todoList"
            :key="index.id"
            @click="handleWork(item)"
          >
            <div class="left">
              <div class="title">{{ item.title }}</div>
              <div class="preview">{{ item.messageContent }}</div>
            </div>
            <div class="time">
              <span>{{ dateFormat(item.sendTime, 'yyyy-MM-dd') }}</span>
              <span>{{ dateFormat(item.sendTime, 'hh:mm:ss') }}</span>
            </div>
          </a>
        </el-scrollbar>
        <router-link class="link" to="/message/layout/1">查看全部</router-link>
      </el-tab-pane>
      <el-tab-pane :label="`待阅(${notice.noticeListTotal})`" name="second" lazy>
        <el-scrollbar style="height: 300px">
          <div class="scroll-item" v-for="(item,index) in notice.noticeList" :key="index">
            <div class="left">
              <div class="title">{{ item.title }}</div>
              <div class="preview">{{ item.messageContent }}</div>
            </div>
            <div class="time">
              <span>{{ dateFormat(item.sendTime, 'yyyy-MM-dd') }}</span>
              <span>{{ dateFormat(item.sendTime, 'hh:mm:ss') }}</span>
            </div>
          </div>
        </el-scrollbar>
        <router-link class="link" to="/message/layout/0">查看全部</router-link>
      </el-tab-pane>
    </el-tabs>
    <div slot="reference">
      <el-badge :is-dot="!!(notice.todoListTotal || notice.noticeListTotal)">
        <i class="el-icon-bell"></i>
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {dateFormat} from "@/util/date";
import {getStore} from "@/util/store.js";
import { bizUrlEnvConfig } from '@/config/env.js'

export default {
  name: "top-notice",
  data() {
    return {
      activeName: "first",
      closeFlag: false,
      wsConnection: null,

      heardCheckTimeout: 4 * 60 * 1000,

      // 处理后的参数
      obj:{},
    };
  },
    mounted() {
    if (this.checkTokenTime()) {
      this.updateMesssageList()
      this.initWebsocket();
    }
  },
  deactivated() {
    this.closeFlag = true;
    if (this.wsConnection.readyState !== 3) {
      this.wsConnection.close();
    }
  },
  beforeDestroy() {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer)
    }
    this.closeFlag = true;
    clearInterval(this.wsConnection.checkOnline)
    if (this.wsConnection.readyState !== 3) {
      this.wsConnection.close();
    }
  },
  methods: {
    ...mapActions({
      getNoticeList: 'notice/getNoticeList',
      getTodoList: 'notice/getTodoList'
    }),
    // 消息通知功能
    handleWork(row) {
      let url=row.formId.substring(row.formId.lastIndexOf("?")+1);
      let processInfoList = url.split("&")
      for(let i=0;i<processInfoList.length;i++){
        let processInfo = processInfoList[i].split("=")
         this.obj[processInfo[0]]=processInfo[1];
      }
      this.$router.push({
        path: `/work/process/handle`,
        query: {
          taskId: this.obj.taskId,
          taskDefinitionKey: this.obj.taskDefinitionKey,
          processNodeName: this.obj.processNodeName,
          processInstanceId: this.obj.processInstanceId,
          businessId: this.obj.businessId,
          processDefinitionId: this.obj.processDefinitionId,
          fromView: "DEAL",
        }
      });

    },
    checkReconnect() {
      if (this.wsConnection.readyState >= 2 && !this.reconnectTimer) {
        clearInterval(this.wsConnection.checkOnline)
        if (this.wsConnection.readyState !== 3) {
          this.wsConnection.close();
        }
        this.initWebsocket()
        return true
      }
    },
    checkTokenTime() {
      const expires =
        getStore({
          name: "expires",
        }) || 0;
      return expires && Date.now() + 10 * 1000 < expires
    },
    dateFormat(date, format) {
      date = new Date(Date.parse(date.replace(/-/g, "/")));
      return dateFormat(new Date(date), format)
    },
    initWebsocket() {
      this.wsConnection = new WebSocket(`ws://${bizUrlEnvConfig.rabbitWebsocket}/rabbit-websocket/websocket?device=pc&auth=${this.user.token}`)

      this.wsConnection.addEventListener('open', this.onopen)
      this.wsConnection.addEventListener('message', this.onmessage)
      this.wsConnection.addEventListener('close', this.onclose);
      this.wsConnection.addEventListener('error', this.onerror);
      this.wsConnection.checkOnline = setInterval(() => {
        // let pre = this.wsConnection.bufferedAmount
        this.wsConnection.send("check online");
      }, this.heardCheckTimeout)
    },
    onmessage(event) {
      const data = JSON.parse(event.data);

      switch (data.code) {
        case 200:
          this.$message.success("您有新的消息")
          this.updateMesssageList()
          break;
        case 102:
          //no message
          break
        case 406:// reconnect
          this.closeFlag = true;
          clearInterval(this.wsConnection.checkOnline)
          this.wsConnection.close();
          if (this.reconnectTimer) {
            clearInterval(this.reconnectTimer)
          }
          this.reconnectTimer = setInterval(() => {
            if (this.checkTokenTime()) {
              clearInterval(this.reconnectTimer)
              this.reconnectTimer = undefined
              this.initWebsocket()
            }
          }, 6000)
          break
        case 409:
        case 400:
          this.closeFlag = true;
          clearInterval(this.wsConnection.checkOnline)
          this.wsConnection.close();
          break;
        default:
          break
      }
    },
    onopen() {
      this.closeFlag = false
    },
    onerror() {
      this.$message.error("websocket连接失败");
      this.closeFlag = true;
    },
    onclose() {
      clearInterval(this.wsConnection.checkOnline)
      if (this.closeFlag) {
        return;
      }
      this.initWebsocket();
    },
    updateMesssageList() {
      if (this.notice.todoList.length === 0) {
        this.getTodoList();
      } else {
        this.getTodoList(this.notice.todoList[0].id);
      }

      if (this.notice.noticeList.length === 0) {
        this.getNoticeList();
      } else {
        this.getNoticeList(this.notice.noticeList[0].id);
      }
    },
  },
  computed: {
    ...mapState(['user', 'notice']),
  }
};
</script>

<style lang="scss" scoped>
.link {
  color: #0680ff;
}

.scroll-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 12px;
  cursor: pointer;

  .preview,
  .title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .title {
    font-size: 16px;
    color: #409eff;
  }

  .left {
    flex: 1;
    width: 0;
    flex-shrink: 0;
    padding-right: 20px;
  }

  .time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
  }
}
</style>
