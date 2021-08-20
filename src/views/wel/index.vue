<template>
  <div>
    <el-container>
      <el-main>
        <div class="banner-wrapper">
          <img src="@/assets/image/banner.png" alt="宣传图" />
        </div>
        <div class="process-wrapper">
          <div class="tabs">
            <div
              class="tab-pane"
              @click="handleProcessTabClick(item)"
              :class="{active:currentTab === item.name}"
              v-for="(item,index) in processTabs"
              :key="index"
            >{{ item.label }}</div>
          </div>
          <div class="table">
            <flow-todo-table v-if="currentTab === processTabs[0].name" height="300" :search="false"></flow-todo-table>
            <flow-send-table v-if="currentTab === processTabs[1].name" height="300" :search="false"></flow-send-table>
            <flow-start-table
              v-if="currentTab === processTabs[2].name"
              height="300"
              :search="false"
            ></flow-start-table>
            <flow-done-table v-if="currentTab === processTabs[3].name" height="300" :search="false"></flow-done-table>
          </div>
        </div>
      </el-main>
      <div class="aside">
        <div class="tabs">
          <div class="tab-pane active">
            <el-badge :value="notice.noticeListTotal">消息</el-badge>
          </div>
        </div>
        <div class="message-list">
          <div class="msg-item" v-for="(item) in notice.noticeList" :key="item.id">
            <svg-icon class="msg-item__avatar" icon-class="avatar_boy"></svg-icon>
            <div class="msg-item__info">
              <h4>{{ item.title }}</h4>
              <span>{{ item.messageContent }}</span>
            </div>
            <div class="msg-item__time">
              <div>{{ dateFormat(item.sendTime, 'yyyy-MM-dd') }}</div>
              <div class="time">{{ dateFormat(item.sendTime, 'hh:mm:ss') }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateFormat } from "@/util/date";
import FlowTodoTable from "@/components/FlowTodoTable/FlowTodoTable";
import FlowSendTable from "@/components/FlowSendTable/FlowSendTable";
import FlowDoneTable from "@/components/FlowDoneTable/FlowDoneTable";
import FlowStartTable from "@/components/FlowStartTable/FlowStartTable";
import dictionaries from '@/lib/dictionaries.js'

export default {
  name: "index",
  components: { FlowStartTable, FlowDoneTable, FlowSendTable, FlowTodoTable },
  theme: "",

  data() {
    return {
      processTabs: [
        { name: "backlog", label: "待办事务" },
        { name: "emitted", label: "已发事务" },
        { name: "start", label: "发起事务" },
        { name: "finished", label: "经办事务" },
      ],
      currentTab: "backlog",
    }
  },
  computed: {
    ...mapState(['notice'])
  },
  created() {
    dictionaries.install()
  },
  methods: {
    handleProcessTabClick(tab) {
      this.currentTab = tab.name;
    },
    dateFormat(date, format) {
      date = new Date(Date.parse(date.replace(/-/g, "/")));
      return dateFormat(new Date(date), format)
    },
  },
};
</script>


<style lang='scss' scoped>
.el-container {
  align-items: flex-start;

  .el-main {
    min-height: 100px;

    .banner-wrapper {
      width: 100%;
      height: 300px;

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    .process-wrapper {
      margin-top: 10px;
      min-height: 300px;
      background-color: #fff;

      .tabs {
        display: flex;
        line-height: 50px;

        .tab-pane {
          width: 100px;
          text-align: center;
          cursor: pointer;

          &.active {
            font-size: 1.1em;
            color: #409eff;
          }
        }
      }
    }

    .table {
      margin-bottom: 50px;

      /deep/ .avue-crud__menu {
        display: none;
      }

      /deep/ .el-pagination {
        margin-right: 30px;
      }
    }
  }

  .aside {
    background-color: #fff;
    min-height: 100px;
    margin-left: 10px;
    flex-shrink: 0;
    width: 450px;
    border-radius: 5px;
    padding: 10px 0;
    overflow: hidden;

    .tabs {
      display: flex;
      line-height: 60px;
      border-bottom: 2px solid #ebeef5;

      .tab-pane {
        text-align: center;
        padding: 0 10px;
        margin: 0 20px;

        &.active {
          color: #409eff;
          border-bottom: 3px solid #409eff;
        }

        /deep/ .el-badge__content {
          top: 12px !important;
        }
      }
    }

    .message-list {
      padding: 0 16px;
      max-height: 500px;
      overflow: auto;
      font-size: 14px;

      .msg-item {
        display: flex;
        height: 84px;
        padding: 16px 0;
        color: #808080;

        .msg-item__avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #666;
        }

        .msg-item__info {
          flex: 1;
          width: 0;
          margin: 0 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          white-space: nowrap;

          h4 {
            margin: 0;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
          }

          span {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .msg-item__time {
          text-align: right;

          .time {
            margin-top: 17px;
          }
        }
      }
    }
  }
}
</style>
