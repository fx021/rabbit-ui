<template>
  <div class="card" :class="{unread:message.status === 0}">
    <div class="card__title">{{ message.title || '' }}</div>
    <div class="card__content">
      <el-table
        :data="tableData"
        max-height="250px"
        border
        style="width: 100%">
        <el-table-column
          v-for="key in tableHeaderList"
          :key="key"
          :prop="key"
          :label="key"
          width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  computed:{
    tableData(){
      if (!this.message.messageContent) {
        return [];
      }

      const tableData = JSON.parse(this.message.messageContent)

      if (!Array.isArray(tableData))
      {
        return []
      }

      return tableData;
    },
    tableHeaderList(){
      if (!this.message.messageContent) {
        return [];
      }
      const tableData = JSON.parse(this.message.messageContent)

      if (!Array.isArray(tableData) && tableData.length > 0)
      {
        return []
      }

      return Object.keys(tableData[0])
    },
  },
  created() {
    console.log(this.message)
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 0 15px;
  min-width: 300px;
  max-width: 500px;
  position: relative;

  &.unread:before {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #fa2528;
  }

}

.card__title {
  font-size: 16px;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card__content {
  padding: 5px;

  .title {
    line-height: 30px;
    height: 30px;
    font-weight: bold;
  }

  .el-table {
  }
}
</style>>
