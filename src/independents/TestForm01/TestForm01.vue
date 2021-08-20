<template>
  <div>
    <el-form label-width="80px" :model="form">
      <el-form-item v-for="column in columns" :label="column.columnDesc" :key="column.columnName">
        <el-input v-model="form[column.columnName]"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="handleStartProcess">发起流程</el-button>
  </div>
</template>

<script>
export default {
  name: "TestForm01",
  props: {
    type: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    }
  },
  data: () => ({
    form: {},
  }),
  created() {
    console.log('type', this.type)
    console.log('columns', this.columns)
  },
  methods: {
    handleStartProcess() {
      this.$emit('startProcess', this.form)
    }
  }
}
</script>

<style scoped>
</style>
