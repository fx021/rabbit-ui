<template>
  <div class="dialog__container">
    <div class="title">
      <div class="name">{{ templateName }}</div>
    </div>
    <div class="message-container" ref="messageContainer">
      <div class="message-content">
        <div class="message-list">
          <div class="msg-item" v-for="(item ,index) in messageList" :key="index" :class="{unread:true}">
            <div class="msg-content">
              <table-card v-if="item.messageSource === 1 && item.conditionXj === 2" :message="item"/>
              <msg-card v-else :message="item"/>
            </div>
          </div>
        </div>
      </div>
      <InfiniteLoading @infinite="infiniteHandler"
                       :identifier="$route.params.templateId" distance="300">
        <div slot="no-results" class="info">
          无数据。
        </div>
        <div slot="no-more" class="info">
          没有更多消息了。
        </div>
      </InfiniteLoading>
    </div>
  </div>
</template>

<script>
import MsgCard from "./components/msgCard.vue";
import {getMessageInfo} from "@/api/system/message";
import InfiniteLoading from "vue-infinite-loading";
import TableCard from "@/views/message/components/tableCard";


export default {
  beforeRouteUpdate(to, from, next) {
    this.reset();
    next();
  },
  computed: {
    templateName() {
      const templateId = this.$route.params.templateId ? this.$route.params.templateId.toString() : "";
      const templateItem = this.$parent.templateList.find(item => {
        return item.id.toString() === templateId;
      });

      return templateItem ? templateItem.templateName : "";
    },
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      messageList: [],
    }
  },
  methods: {
    reset() {
      this.pageNo = 1;
      this.messageList = [];
    },
    infiniteHandler($state) {
      this.getMessageInfo({
        templateId: this.$route.params.templateId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }).then(res => {
        if (res.total > this.messageList.length) {
          this.pageNo += 1;
          this.messageList.push(...res.records);
          $state.loaded()
        } else {
          $state.complete();
        }
      })
    },
    getMessageInfo(params) {
      return new Promise(resolve => {
        getMessageInfo({
          type: this.$parent.type.templateType,
          status: this.$parent.type.status,
          ...params,
        }).then(res => {
          resolve(res.data.data);
        });
      })
    },
  },
  components: {
    TableCard,
    MsgCard,
    InfiniteLoading,
  },
};
</script>

<style lang="scss" scoped>
.dialog__container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9eaec;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 5px;
  margin-right: 10px;
  background-color: #409eff;
  flex-shrink: 0;
}

.message-container {
  flex: 1;
  height: 0;
  background: #f4f5f7;
  overflow: auto;

  .info {
    text-align: center;
    color: #999;
    line-height: 40px;
  }

  .message-content {
    padding: 0 20px;


    .msg-item {
      display: flex;
      position: relative;

      .msg-content {
        margin: 30px 0;
        border-radius: 6px;
        // border: 1px solid #e9eaec;
        background-color: #fff;
      }
    }
  }
}
</style>
