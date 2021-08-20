<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  provide() {
    return {
      //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
      reload: this.reload,
    };
  },
  data() {
    return {
      //控制视图是否显示的变量
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true; //再打开
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.avue-upload__icon {
  line-height: 178px !important;
}
.sort-menu {
  color: #4d8ac8;
  cursor: pointer;
  font-size: 18px;
}

.sort-menu:hover {
  color: #b0c7e0;
}
</style>

