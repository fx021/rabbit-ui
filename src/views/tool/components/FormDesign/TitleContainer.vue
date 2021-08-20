<template>
  <el-container class="title-container">
    <el-header>
      <h3>{{ title }}</h3>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.el-main {
  padding: 25px !important;
  background: #ffffff;
}
.el-header {
  background: #ffffff;
  border-bottom: 1px solid #ededed;
}
</style>