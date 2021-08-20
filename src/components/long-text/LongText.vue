<template>
  <el-popover
    width="200"
    :trigger="trigger"
    :placement="placement"
    :content="value">
    <div class="long-text" slot="reference">
      {{ value }}
    </div>
  </el-popover>

</template>

<script>
export default {
  name: "LongText.vue",
  props: {
    value: {
      type: String,
      default: "",
    },
    trigger: {
      type: String,
      default: 'click'
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  }
}
</script>

<style lang="scss" scoped>
.long-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>
