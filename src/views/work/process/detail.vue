<template>
  <basic-container>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button v-print="'#printTest'">打印</el-button>
      <el-button @click="handleCancel">关闭</el-button>
    </el-row>
    <el-card style="margin: 20px 0">
      <div slot="header">
        <span>{{ formName }}</span>
      </div>
      <form-display-readonly
        v-if="formId && formType === 'CD'"
        v-model="formData"
        :form-id="formId"
        :permission-option="permissionOption"
        readonly
      ></form-display-readonly>
      <component
        v-if="formType==='SD' && formComponent"
        :is="formComponent"
        type="detail"
        :formId="formId"
        :columns="formColumn"
      ></component>
    </el-card>

    <el-form id="printTest" label-width="80px">
      <el-card shadow="hover">
        <div slot="header">
          <span>流程信息</span>
        </div>
        <el-row type="flex" class="row-bg">
          <el-timeline>
            <el-timeline-item
              :key="flow.id"
              color="#0bbd87"
              :timestamp="flow.createTime || flow.time"
              v-for="flow in flowList"
              placement="top"
            >
              <el-card class="timeline-card" shadow="hover">
                <div v-if="flow.type === 'SP'">
                  <h4>
                    <b>【{{ flow.userName }}】</b> 于
                    <i>{{ flow.time }}</i> 进行
                    <b>【{{ flow.typeName }}】</b>
                  </h4>
                  <b>【批复意见】</b>
                  ：{{ flow.message }}
                </div>
                <div v-if="['HJQ','QJQ','WP','ZB'].includes(flow.type)">
                  <h4>
                    <b>【{{ flow.userName }}】</b> 于
                    <i>{{ flow.time }}</i> 发起
                    <b>【{{ flow.typeName }}】</b>
                  </h4>
                  <b>【批复意见】</b>
                  ：{{ flow.message }}
                </div>
                <div v-if="['startEvent'].includes(flow.historyActivityType)">
                  {{ flow.assigneeName }}
                  <b>【发起流程】</b>
                </div>
                <div v-if="['endEvent'].includes(flow.historyActivityType)">
                  <b>【流程结束】</b>
                </div>
                <div v-if="['userTask'].includes(flow.historyActivityType)">
                  {{ flow.assigneeName }} 开始
                  <b>【{{ flow.historyActivityName }}】</b>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-row>
      </el-card>
    </el-form>
  </basic-container>
</template>

<script>
import { historyFlowList } from "@/api/work/process";
import { closeTagBack } from '@/util/tags'
import FormDisplayReadonly from "@/global-views/src/FormDisplayProcess";

export default {
  components: { FormDisplayReadonly },
  data() {
    return {
      businessId: '',
      processInstanceId: '',
      flowList: [],
      formName: "",
      formType: "",
      formData: {},
      formComponent: null,
      // 权限控制配置
      permissionOption: {},

      formId: "",
      viewProps: {},
      paramMap: {},
      exclueProps: {},

      avueForm: {},
      serverOption: {},
      taskDefinitionKey: "",
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        target: "#avue-view",
      });
      this.processInstanceId = this.$route.query.pid;
      this.businessId = this.$route.query.bid;
      this.taskDefinitionKey = this.$route.query.tdk;

      Promise.all([
        this.getHistoryFlow(),
        this.getFormInfo()
      ]).finally(() => {
        loading.close()
      })

    },
    async getFormInfo() {
      const formInfoRes = await this.$axios.get("/api/rabbit-flow/jurisdiction/getFormInfoByProcessIntId", {
        params: {
          processInstanceId: this.processInstanceId,
          processNodeId: this.taskDefinitionKey,
        }
      })
      const { data: formInfo } = formInfoRes.data;

      this.permissionOption = formInfo.option;
      this.dataId = formInfo.dataId;

      const formConfig = await this.$axios.get(`/api/rabbit-resource/selfDevForm/selfDevelopLinkBusiness/${formInfo.formId}`).then((res => {
        if (res.data.code === 200) {
          return res.data.data;
        }
      }))

      if (formConfig.pcForm) {
        // 自定义表单
        this.formType = 'CD';
        await this.getServerOption(formInfo.formId);

        let params = {
          current: 0,
          size: 1,
          id: formInfo.formId,
          bind: this.paramMap,//参数绑定
          viewProps: this.viewProps,//id-prop映射
        }

        await this.$axios.post(`/api/rabbit-resource/formcustom/form-table-one/${this.dataId}`, params)
          .then(res => {
            const { data } = res.data;
            if (!data) {
              throw new Error();
            }
            // 如果只为"[]" 则为upload组件，值需要使用parse处理一下
            Object.keys(data).forEach((key) => {
              if (typeof data[key] === "string" && data[key][0] === '[') {
                data[key] = JSON.parse(data[key]);
              }
            })
            this.formData = data;

          }).catch((err) => {
            console.log(err)
            this.$message.error('获取表单数据失败');
            this.loading = false
            // setTimeout(() => {
            //   this.$router.$avueRouter.closeTag()
            // }, 500);
          })
      } else {        // 自研表单
        this.formType = 'SD';

        this.$axios.get(`/api/rabbit-resource/selfDevForm/linkBusiness/${formInfo.formId}`).then(res => {
          if (res.data.code !== 200) {
            throw new Error()
          }
          const { data } = res.data;
          data.find(item => {
            return item.columnName.split('#').pop() === 'ID' && (this.rowKey = item.columnName);
          })

          this.formColumn = data;
        })


        this.$axios.get(`/api/rabbit-resource/selfDevForm/selfDevelopLinkBusiness/${formInfo.formId}`).then(res => {
          if (res.data.code !== 200) {
            throw new Error()
          }
          const { data } = res.data;
          const url = data.formUrl && data.formUrl.replace(/^\//, '');
          import(`@/independents/${url}`).then(res => {
            this.formComponent = res.default;
          })

        })
      }
      this.formId = formInfo.formId;
    },
    getServerOption(id) {
      if (!id) {
        return Promise.reject()
      }
      this.loading = true
      return this.$axios.get("/api/rabbit-resource/formcustom/form-list/" + id, {
        params: { flag: 1 }
      }).then(res => {
        if (res.data.data) {
          this._lastForm = id
          this.forbidden = res.data.data.status === 0
          if (res.data.data.listForm) {
            this.serverOption = JSON.parse(res.data.data.listForm)
          } else {
            this.serverOption = this.parseListByForm(res.data.data.pcForm)
          }
          this.buildColumns(this.buildPopViewMap(res.data.data.popProps))
        } else {
          this.loading = false
          this.$alert("数据已删除", '数据异常', {
            callback: () => {
              setTimeout(() => {
                this.$router.$avueRouter.closeTag()
              }, 500);
            }
          })
        }
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    buildPopViewMap(props) {//解析弹出框
      let arr = props || []
      if (typeof props == 'string') {
        arr = JSON.parse(arr)
      }
      this.paramMap = {}
      let viewMap = {}
      let viewParamMap = {}
      for (let pop of arr) {
        for (let col of pop.data) {//字段,控件,参数排序好了
          if (col.colMode == 2) {//参数绑定
            if (col.colReplace && col.colName) {
              this.paramMap[`p#${pop.popId}#${col.paramKey}`] = col.colName
            } else {
              let params = viewParamMap[col.formView]
              if (!params) {
                params = []
                viewParamMap[col.formView] = params
              }
              params.push(`p#${pop.popId}#${col.paramKey}`)
            }
          } else if (col.colMode == 1) {//控件
            viewMap[col.formView] = {
              colName: col.popCol,
              popId: pop.popId
            }
          }
        }
      }

      return { viewMap, viewParamMap }
    },
    buildColumns(bind) {
      let columns = this.serverOption.column || []
      this.areaProps = []
      this.searchMode = {}
      for (let column of columns) {
        if (bind) {
          this.popViewMap = bind.viewMap
          if (bind.viewMap && bind.viewMap[column._id]) {
            let viewPop = bind.viewMap[column._id]
            this.viewProps[column._id] = column.prop

            if (viewPop.colName == column.prop) {
              if (!/^[ntgp]#.+/.test(column.prop)) {
                column.prop = `p#${viewPop.popId}#${column.prop}`
              }
              this.exclueProps[column.prop] = viewPop.popId
            }
          }
          if (bind.viewParamMap && bind.viewParamMap[column._id]) {
            let innerParams = bind.viewParamMap[column._id]
            for (let paramKey of innerParams) {
              this.paramMap[paramKey] = column.prop;
            }
          }
        }
      }
    },
    parseListByForm(pcForm) {
      if (typeof pcForm == 'string') {
        pcForm = JSON.parse(pcForm)
      }
      let option = {
        refreshBtn: true, page: true, addBtn: true, editBtn: true, menuPosition: 'center', columnBtn: false,
        delBtn: true, border: true, stripe: true, searchGutter: 10, viewBtn: false, indexFixed: false, index: false,
        searchShow: true, searchIndex: 2, customBtns: []
      }
      let column = pcForm.column || []
      let groups = pcForm.group || []
      option.rowKey = pcForm.rowKey
      option.size = pcForm.size
      option.flowBtn = pcForm.flowBtn
      // console.log("column", column, groups)
      if (groups.length == 0 && column.length == 0) {
        option.column = []
        return option;
      }
      if (column.length > 0) {
        groups.push({
          linkId: '2',
          column: column
        })
      }
      let views = []
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let groupViews = group.column || [];
        if (group.listable) {//列表组件不参与
          continue
        }
        for (let j = 0; j < groupViews.length; j++) {
          let view = groupViews[j];
          view.searchMode = 0
          view.searchSpan = 8
          view.groupId = group.linkId
          view.searchLabelWidth = 80
          view.align = 'left'
          view.dpy = view.display
          view.hide = view.display === false
          views.push(view)
        }
      }
      option.column = views
      return option
    },
    getHistoryFlow() {
      return new Promise(resolve => {
        historyFlowList(this.processInstanceId).then(res => {
          if (res.data.code !== 200) {
            return Promise.reject("请求流程历史失败");
          }
          this.flowList = res.data.data;
          resolve()
        });
      })
    },
    handleCancel() {
      closeTagBack(this.$route.path)
    }
  }
}
</script>
<style lang="scss" scoped>
.timeline-card {
  h4 {
    font-weight: 400;
    margin-top: 0;
  }

  p {
    font-size: 14px;
    line-height: 1.5em;
  }
}

/deep/ .el-form-item {
  label {
    font-weight: bold;
  }
}
</style>
