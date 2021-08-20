<template>
  <el-timeline :reverse="reverse">
    <el-timeline-item
      v-for="(item, index) in itemList"
      :key="index"
      :timestamp="item.timestamp"
      :hide-timestamp="item.hideTimestamp"
      :placement="item.placement"
      :type="item.type"
      :size="item.size"
      :icon="item.icon"
    >
      {{ item.content }}
    </el-timeline-item>
  </el-timeline>
</template>
<script>
export default {
  name: "custom-timeline",
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    itemList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style>
</style>