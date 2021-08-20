<template>
  <div class="container-wrapper">
    <div class="container">
      <div class="left">
        <div class="search-wrapper">
          <div class="search">
            <input type="text" placeholder="搜索"/>
          </div>
        </div>
        <div class="list-container">
          <div class="list">
            <div class="list-item" :class="{active:$route.params.templateType.toString() === item.type.toString()}" v-for="(item, index) in types" :key="index" @click="handleClick(item)">
              <svg-icon class="avatar" :icon-class="item.icon"></svg-icon>
              <div class="message-box">
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [
        {name: "待阅",icon:"notify", type: 0, templateType: 0, status: 0},
        {name: "待办",icon:"todo", type: 1, templateType: 1, status: 0},
        {name: "已阅",icon:"notify_ok", type: 2, templateType: 0, status: 1},
        {name: "已办",icon:"todo_ok",type: 3, templateType: 1, status: 1},
      ],
    }
  },
  methods: {
    handleClick(item) {
      this.$router.replace(`/message/layout/${item.type}`)
      console.log(item)
    },
  },
};
</script>

<style lang="scss" scoped>
.container-wrapper {
  font-size: 14px;
  height: calc(100% - 40px);

  .container {
    background-color: #fff;
    height: 100%;
    display: flex;
  }
}

/deep/ .left {
  width: 240px;
  height: 100%;
  border-right: 1px solid #e9eaec;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .search-wrapper {
    padding: 20px;

    .search {
      font-size: 12px;
      box-sizing: border-box;
      height: 30px;
      line-height: 30px;
      border-radius: 20px;
      border: 1px solid #e9eaec;
      padding: 0 20px;

      input {
        outline: none;
        border: none;
      }
    }
  }

  .list-container {
    flex: 1;
    overflow: auto;

    .list {
      .list-item {
        border-top: 1px solid #e9eaec;
        display: flex;
        justify-content: center;
        padding: 20px 10px;

        &.active {
          background-color: #eee;
        }

        .avatar {
          width: 35px;
          height: 35px;
          border-radius: 5px;
          margin-right: 10px;
          background-color: #409eff;
          flex-shrink: 0;
          position: relative;

          &.unread::after {
            content: "";
            position: absolute;
            box-sizing: border-box;
            $height: 14px;
            height: $height;
            width: $height;
            border-radius: 50%;
            background-color: #ee0707;
            border: 2px solid #fff;
            bottom: -($height / 2);
            right: -($height / 2);
          }
        }

        .message-box {
          flex: 1;
          width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .name {
            color: #409eff;
            font-weight: 400;
            width: 100%;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .preview {
            font-size: 12px;
            width: 100%;
            color: #999;
            margin-top: 4px;
            line-height: 14px;
            height: 14px;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .recv-time {
          font-size: 12px;
        }
      }
    }
  }
}

/deep/ .right {
  flex: 1;
}
</style>
