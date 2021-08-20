<template>
  <basic-container>
        <form-display
          v-if="formType ==='CD'"
          v-model="formData"
          :form-id="formId"
          :submit-btn="false"
          ref="formDisplay"
          @submit="handleSubmit">
        </form-display>
        <component
          v-if="formType==='SD' && formComponent"
          :is="formComponent"
          type="start"
          ref="sd"
          :formId="formId"
          @submit="onSDSubmit"
          :actId="actId"
          :processInstanceId="processInstanceId"
        ></component>
        <div class="btns" v-show="formType === 'SD'">
          <el-button type="primary" @click="onSave">保 存</el-button>
          <el-button type="primary" @click="onSubmit">提 交</el-button>
          <el-button type="danger" @click="handleEmpty">清 空</el-button>
          <el-button @click="handleCancel">关 闭</el-button>
        </div>
  </basic-container>
</template>

<script>
import FormDisplay from "@/global-views/src/FormDisplay";
import {closeTagBack, closeTagTo} from "@/util/tags";
import {completeTask} from "@/api/work/work";

export default {

  data() {
    return {
      formData: {},
      formId: "",
      formType: '',
      processDefinitionId: '',
      processInstanceId: '',

      rowKey: "",
      formColumn: [],
      formComponent: null,

      taskId: "",
      actId: "",
    }
  },
  created() {
    this.init();
    this.getRowInfo();
  },
  methods: {
    //清空
    // handleEmpty(){
    //   this.$refs.form.resetForm();
    // },
    //保存
    onSave(){
      this.saveOnly = true
      this.$refs.sd.saveBeforeCommit();
    },
    onSDSubmit(data){
      /*保存数据到表单信息储存表 start*/
      const selfDevelopFormData = {
        processDefId: this.processInstanceId,
        processInstId: this.processInstanceId,
        bizDataId: data.bizDataId,
      };
      this.$axios.post('/api/rabbit-resource/selfDevForm/saveSelfDevelopFormData',selfDevelopFormData);
      /*保存数据到表单信息储存表 end*/
      if(!this.saveOnly){
        /*完成起草节点 start*/
        const params = {
          taskId: this.taskId,
          processInstanceId: this.processInstanceId,
          processDefinitionId: this.processDefinitionId,
          actId: this.actId,
          flag: "ok",
          comment: "起草节点",
          variables: this.$refs.sd.form,
        };
        completeTask(params).then((res) => {
          const data = res.data;
          if (data.success) {
            this.$message.success(data.msg);
            closeTagBack(this.$route.path)
          } else {
            this.$message.error(data.msg || "提交失败");
          }
        });
        /*完成起草节点 end*/
      }
      this.saveOnly = false
    },
    //提交（完成起草节点）
    onSubmit(){
      this.$refs.sd.saveBeforeCommit();
    },
    init() {
      this.formId = this.$route.query.fid
      this.processInstanceId = this.$route.query.processInsId;
      this.processDefinitionId = this.$route.query.processDefId;
      this.formType = this.$route.query.ft;

      if (this.formType === 'SD') {
        this.$axios.get(`/api/rabbit-resource/selfDevForm/linkBusiness/${this.formId}`).then(res => {
          if (res.data.code !== 200) {
            throw new Error()
          }
          const {data} = res.data;
          data.find(item => {
            return item.columnName.split('#').pop() === 'ID' && (this.rowKey = item.columnName);
          })

          this.formColumn = data;
        })


        this.$axios.get(`/api/rabbit-resource/selfDevForm/selfDevelopLinkBusiness/${this.formId}`).then(res => {
          if (res.data.code !== 200) {
            throw new Error()
          }
          const {data} = res.data;
          this.formName = data.formName;
          const url = data.formUrl && data.formUrl.replace(/^\//, '');
          import(`@/independents/${url}`).then(res => {
            this.formComponent = res.default;
          })

        })
      }
    },
    getRowInfo() {
      if(this.formType == "SD"){
        this.$axios.get("/api/rabbit-flow/work/draftingNodes", {
          params: {
            processDefinitionId: this.$route.query.processDefId,
            processInstanceId: this.$route.query.processInsId,
          }
        }).then(res => {
          let list = res.data.data;
          this.taskId = list[0].taskId;
          this.actId = list[0].taskDefinitionKey;
        })
      }
    },
    handleSubmit() {
      closeTagTo(this.$route.path, {
        path: '/work/send'
      })
    },
    handleCancel() {
      closeTagBack(this.$route.path)
    },
  },
  components: {
    FormDisplay
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-collapse-item__header {
  cursor: auto !important;
}
/deep/ .avue-crud__pagination{
  display: none;
}
.btns{
  text-align: center;
  margin-bottom: 32px;
}
</style>
