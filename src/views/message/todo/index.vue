<template>
  <div class="todo__container">
    <div class="left">
      <div class="header">
        <span>{{ type.name }} {{ total? `(${total})` : "" }}</span>
        <i class="el-icon-search" @click="handleSearchClick"></i>
      </div>
      <div class="search-wrapper" v-if="isShowSearch">
        <el-input
          size="mini"
          @change="handleSearchChange"
          v-model="searchString"
          placeholder="请输入搜索的模板名"
        ></el-input>
        <i class="el-icon-close" @click="handleSearchClose"></i>
      </div>
      <div class="list-container" ref="list">
        <!--未读，未办-->
        <div class="list" v-if="type.status === 0">
          <div
            v-for="(item) in templateList"
            :key="item.id"
            class="list-item"
            :class="{active:$route.params.templateId === item.id}"
            @click="handleListItemClick(item)"
          >
            <div class="message-box">
              <div class="name">{{ item.templateName }}</div>
              <div class="preview">{{ extractMessageContent(item.messageList[0]) }}</div>
            </div>
            <div class="message-right">
              <div class="unread">{{ item.unread }}</div>
              <div class="recv-time">{{ extractSendTime(item.messageList[0]) }}</div>
            </div>
          </div>
        </div>
        <!--已读，已办-->
        <div v-else class="list">
          <div
            v-for="(item) in templateList"
            :key="item.id"
            class="list-item"
            :class="{active:$route.params.templateId === item.id}"
            @click="handleListItemClick(item)"
          >
            <div class="message-box">
              <div class="name">{{ item.templateName }}</div>
            </div>
            <div class="message-right"></div>
          </div>
        </div>
        <InfiniteLoading
          @infinite="infiniteHandler"
          :identifier="$route.params.templateType"
          distance="300"
        >
          <div slot="no-results" class="info"></div>
          <div slot="no-more" class="info"></div>
        </InfiniteLoading>
      </div>
    </div>
    <div class="right">
      <keep-alive>
        <router-view :templateName="templateName"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { getMessageTemplate } from "@/api/system/message";
import InfiniteLoading from "vue-infinite-loading";

export default {
  computed: {
    total() {
      if (this.templateList.length === 0) {
        return 0;
      }
      let total = 0;


      if (this.type.status === 0) {
        this.templateList.forEach((item) => {
          total += item.unread;
        });
      } else if (this.type.status === 1) {
        this.templateList.forEach((item) => {
          total += (item.total - item.unread);
        });
      }

      return total;
    },
    type() {
      const type = this.$route.params.templateType ? this.$route.params.templateType.toString() : "";
      const typeItem = (this.$parent.types || []).find(item => {
        return item.type.toString() === type;
      })

      return typeItem ? typeItem : {};
    }
  },
  data() {
    return {
      templateList: [],

      pageNo: 1,
      pageSize: 10,

      isShowSearch: false,

      templateType: -1,
      templateName: "",

      searchString: "",
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.templateType !== from.params.templateType) {
      this.reset();
    }
    next();
  },
  methods: {
    handleSearchClick() {
      this.isShowSearch = true;
    },
    handleSearchClose() {
      this.searchString = "";
      this.isShowSearch = false;
      this.handleSearchChange();
    },
    handleSearchChange() {
      this.reset();
      this.infiniteHandler();
    },
    extractSendTime(message) {
      return message ? message.sendTime.split(" ")[1] : "";
    },
    extractMessageContent(message) {
      return message ? message.messageContent : "";
    },
    reset() {
      this.pageNo = 1;
      this.templateList = [];
    },
    infiniteHandler($state) {
      this.getMessageTemplate({
        templateType: this.type.templateType,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        templateName: this.searchString
      }).then(res => {
        if (this.type.templateType !== res.records[0].templateType) {
          return
        }
        this.templateList.push(...res.records);

        if (res.total > this.templateList.length) {
          this.pageNo += 1;
          $state.loaded()
        } else {
          $state.complete();
        }
      })
    },
    handleListItemClick(item) {
      this.$router.replace(`/message/layout/${this.$route.params.templateType}/${item.id}`);
    },
    getMessageTemplate(params) {
      return new Promise(resolve => {
        getMessageTemplate({
          status: 1,
          ...params
        }).then(res => {
          resolve(res.data.data)
        })
      })
    },
  },
  components: {
    InfiniteLoading
  }
};
</script>


<style lang="scss" scoped>
.todo__container {
  background-color: #fff;
  height: 100%;
  display: flex;
}

.left {
  .header {
    background-color: #409eff;
    font-size: 16px;
    padding: 20px 10px;
    position: relative;

    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-icon-search {
      margin-right: 10px;
    }
  }
  .search-wrapper {
    padding: 10px;

    display: flex;
    align-items: center;

    .el-icon-close {
      cursor: pointer;
    }
  }
}

.message-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  .unread {
    $height: 18px;
    text-align: center;
    min-width: 18px;
    font-size: 12px;
    background-color: #ed0608;
    color: #fff;
    padding: 0 4px;
    line-height: $height;
    border-radius: $height / 2;
  }
}
</style>
