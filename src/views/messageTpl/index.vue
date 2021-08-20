<template>
  <avue-crud
    :data="templateList"
    :option="option"
    v-model="form"
    :page.sync="page"
    @on-load="onLoad"
    @refresh-change="infiniteHandler"
    @row-update="rowUpdate"
    @row-save="rowSave"
    @row-del="rowDel"
    :before-open="beforeOpen"
    @search-change="searchChange"
  >
    <template slot-scope="{type,size,row}" slot="menu">
      <el-button
        icon="el-icon-s-cooperation"
        :size="size"
        :type="type"
        @click="executeTime(row)"
      >下次执行时间</el-button>
    </template>
    <template slot-scope="scope" slot="refreshForm">
      <cron-input v-model="form.refresh" :size="scope.size" @change="change" @reset="reset" />
    </template>
  </avue-crud>
</template>
  <script>
import { getMessageTemplate } from "@/api/system/message";
import { saveMessageTemplate } from "@/api/system/message";
import { delMessageTemplate } from "@/api/system/message";
import { nextTriggerTime } from "@/api/system/message";
import CronInput from 'vue-cron-generator/src/components/cron-input'
import { DEFAULT_CRON_EXPRESSION } from 'vue-cron-generator/src/constant/filed'

export default {
  components: { CronInput },
  data() {
    return {
      search: {},
      templateList: [],
      isShowSearch: false,
      form: {},
      // templateType: -1,
      templateName: null,
      templateType: null,
      messageSource: null,
      status: null,
      searchString: "",
      cron: DEFAULT_CRON_EXPRESSION,
      page: {
        currentPage: 0,
        pageSize: 10,
        total: 0,
        pagerCount: 0
      },

      option: {
        page: true,
        align: 'center',
        menuAlign: 'center',
        copyBtn: true,
        column: [
          {
            label: '模板名称',
            prop: 'templateName',
            search: true,
          },
          {
            label: '消息类型',
            prop: 'templateType',
            search: true,
            dicData: [{
              label: '通知类',
              value: 0
            }, {
              label: '处理类',
              value: 1
            }],
            type: 'select',
          },
          {
            label: '跳转地址',
            prop: 'formId',
            type: "textarea"
          }, {
            label: '模板内容',
            prop: 'templateContent',
            type: "textarea",
            placeholder: "模板内容规则: 根据【调度条件】生成消息格式,判断有值是直接根据模板内容生成消息，可通过sql的字段的key{{key}}来对模板对应的赋值(只取第一条);列表则直接将模板内容设置为sql的查询结果"
          }, {
            label: '消息来源',
            prop: 'messageSource',
            search: true,
            dicData: [
              {
                label: '工作流消息',
                value: 0
              }, {
                label: 'xxl-job定时调度',
                value: 1
              }, {
                label: '外部业务接口',
                value: 2
              }],
            value: 1,
            type: 'select',
          }, {
            label: '定时调度',
            prop: 'refresh',
            value: '0 0 12 * * ?'
          }, {
            label: '调度条件',
            prop: 'conditionXj',
            dicData: [
              {
                label: '不使用',
                value: 0
              }, {
                label: '判断有值',
                value: 1
              }, {
                label: '列表',
                value: 2
              }
            ],
            type: 'select',
          }, {
            label: 'sql',
            prop: 'sqlTextXj',
            type: "textarea",
            hide: true
          }
          , {
            label: '状态',
            prop: 'status',
            type: 'select',
            search: true,
            dicData: [{
              label: '启用',
              value: 1
            }, {
              label: '禁用',
              value: 0
            }],
            value: 1
          },
          {
            label:'表单类型',
            prop:'formType',
            type: 'select',
            dicData:[{
              label:'URL表单',
              value:1
            }],
            value: 1,
            hide:true
          },
          {
            label: '接收-人',
            prop: 'receiver',
            component: 'userSelect',
            hide: true
          },
          {
            label: '推送方式',
            prop: 'pushMode',
            type: 'checkbox',
            hide: true,
            dicData: [{
              label: '系统消息',
              value: "0"
            }, {
              label: '微信',
              value: "1"
            }, {
              label: '短信',
              value: "2"
            }, {
              label: '邮件',
              value: "3"
            }],
            value: "0"
          }
        ]
      }
    }
  },
  methods: {
    handleClick(row) {
      // console.log(row);
    },
    getMessageTemplate(params) {
      return new Promise(resolve => {
        getMessageTemplate({
          ...params
        }).then(res => {
          resolve(res.data.data)
        })
      })
    },
    infiniteHandler() {
      this.getMessageTemplate({
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        templateName: this.templateName,
        templateType: this.templateType,
        messageSource: this.messageSource,
        status: this.status
      }).then(res => {
        // console.log("res",res)
        this.templateList = [];
        this.templateList.push(...res.records);
        this.page.total = res.total;
        this.page.pagerCount = res.pages;
      })
    },
    onLoad(page) {
      this.infiniteHandler(page);
    },
    rowSave(form, done, loading) {
      delete form["messageList"]
      delete form["id"]
      delete form["jobId"]
      saveMessageTemplate({
        ...form
      }).then(res => {
        this.$message.success('success');
        this.infiniteHandler();
        done(form);
      }).catch(() => {
        loading();
      });

    },
    rowUpdate(form, index, done, loading) {
      delete form["messageList"]
      saveMessageTemplate({
        ...form
      }).then(res => {
        this.$message.success('success');
        this.infiniteHandler();
        done();
      }).catch(() => {
        loading();
      })
    },
    searchChange(params, done) {
      this.templateName = params.templateName;
      this.templateType = params.templateType
      this.messageSource = params.messageSource
      this.status = params.status
      this.page.currentPage = 1;
      this.infiniteHandler();
      done();
    },
    rowDel(row, index) {
      if (row.messageSource == "0") {
        this.$notify({
          title: '警告',
          message: 'flowable不可删除',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否确定删除该模板', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {};
        params.id = row.id;
        delMessageTemplate({
          ...params
        }).then(res => {
          this.$message.success('success');
          this.infiniteHandler();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
      });
    },
    executeTime(row) {
      if (row.refresh == null) {
        this.$message({
          type: 'warning',
          message: 'cron错误或者为空!'
        });
        return;
      }
      let params = {};
      params.cron = row.refresh;
      nextTriggerTime({
        ...params
      }).then(res => {
        let time = res.data.data;
        let timedata = "";
        for (let i in time) {
          timedata += time[i] + "<br/>";
        }
        this.$notify({
          title: row.templateName + " 下次执行时间",
          dangerouslyUseHTMLString: true,
          message: timedata
        });
      })
    },
    change(cron) {
      this.form.refresh = cron
    },
    reset() {
      this.form.refresh = DEFAULT_CRON_EXPRESSION
    },
    beforeOpen(done, type) {
      if (!this.form.refresh) {
        this.form.refresh = DEFAULT_CRON_EXPRESSION
      }
      if (!this.form.formParam) {
        this.form.formParam = "";
      }
      done()
    }
  }
}
  </script>

<style>
.avue-crud__pagination {
  margin-bottom: 20px;
}
.el-popover {
  width: 600px;
}
</style>
