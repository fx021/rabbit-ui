<template>
  <basic-container>
    <el-row type="flex" class="row-bg" justify="end" v-show="showPrint">
      <el-button v-print="'#printTest'">打印</el-button>
    </el-row>
    <el-form ref="form" :model="form" label-width="80px">
      <el-card id="printTest" style="margin-bottom: 20px">
        <div slot="header">
          <span>{{ formName }}</span>
        </div>
        <form-display-readonly
          v-if="formId && formType === 'CD'"
          ref="formDisplay"
          :permission-option="permissionOption"
          :formId="formId"
          v-model="formData"
        ></form-display-readonly>
        <component
          v-if="formType==='SD' && formComponent && formId"
          :is="formComponent"
          ref="formComponent"
          type="handle"
          :formId="formId"
          :processNodeId="processNodeId"
          :processInstanceId="processInstanceId"
          :value="bizJsonData"
          @submit="completeSelfDevForm"
        ></component>
        <div>
          <el-form-item label="批复意见" v-show="showCommentBtn">
            <el-input type="textarea" v-model="form.comment"/>
          </el-form-item>
          <el-row type="flex" class="row-bg" justify="center">
            <el-form-item>
              <el-button type="primary" @click="transfer" v-show="showTransferBtn">转办</el-button>
              <el-button type="primary" @click="signBefore" v-show="showSignBeforeBtn">前加签</el-button>
              <el-button type="primary" @click="signAfter" v-show="showSignAfterBtn">后加签</el-button>
              <el-button type="primary" @click="copySend" v-show="showCopySendBtn">抄送</el-button>
              <el-button type="primary" @click="agree" v-show="showAgreeBtn">同意</el-button>
              <el-button type="danger" @click="disagree" v-show="showDisagreeBtn">不同意</el-button>
              <el-button type="primary" @click="onSave" v-show="showSaveBtn">保存</el-button>
              <el-button type="primary" @click="onSubmit" v-show="showSubmitBtn">提交</el-button>
              <el-button type="danger" @click="reject" v-show="showRejectBtn">驳回</el-button>
              <el-button type="primary" @click="revoke" v-show="showRevokeBtn">撤回</el-button>
              <el-button type="primary" @click="disuse" v-show="showDisuseBtn">废弃</el-button>
              <el-button type="danger" @click="empty" v-show="showEmptyBtn">清空</el-button>
              <el-button @click="handleCancel" v-show="showCloseBtn">关闭</el-button>
            </el-form-item>
          </el-row>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div slot="header">
          <span>流程信息</span>
        </div>
        <el-row type="flex" class="row-bg">
          <el-timeline :reverse="true">
            <el-timeline-item
              :key="flowList"
              color="#0bbd87"
              v-for="flowList in flowLists"
              placement="top"
            >
              <el-card class="timeline-card" shadow="hover">
                <el-card class="timeline-card" shadow="hover" v-for="flow in flowList">
                  <div v-if="['userTask'].includes(flow.historyActivityType)">
                    <div>
                      <b>【{{ flow.assigneeName }}】</b> 于
                      <i>{{ flow.createTime }}</i> 开始
                      <b>【{{ flow.historyActivityName }}】</b>
                    </div>
                    <div v-if="flow.endTime && flow.historyActivityApprovalType">
                      <b>【{{ flow.assigneeName }}】</b> 于
                      <i>{{ flow.endTime }}</i> 进行
                      <b>【{{ flow.historyActivityApprovalTypeName }}】</b>
                      <br/>
                      <b v-if="flow.comment">【批复意见】：{{ flow.comment }}</b>
                    </div>
                    <div v-if="flow.comment && !flow.historyActivityApprovalType">
                      <b>【{{ flow.assigneeName }}】</b>
                      <b>{{ flow.comment }}</b>
                    </div>
                  </div>
                  <div v-else-if="['startEvent'].includes(flow.historyActivityType)">
                    <b>【{{ flow.assigneeName }}】</b> 于
                    <i>{{ flow.createTime }}</i>
                    <b> 发起：【{{ flow.processDefinitionName }}】</b>
                  </div>
                  <div v-else-if="['endEvent'].includes(flow.historyActivityType)">
                    <i>{{ flow.endTime }}</i>
                    <b> 结束：【{{ flow.processDefinitionName }}】</b>
                  </div>
                </el-card>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-row>
      </el-card>
    </el-form>
    <!-- 选人弹出框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="40%"
      top="60px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-input
        style="width: 60%"
        v-model="handleForm.user"
        placeholder="员工姓名"
        size="medium"
        @keyup.enter.native="enterQ()"
      ></el-input>
      <el-button
        icon="el-icon-search"
        type="primary"
        size="medium"
        @click="search()"
        style="margin-left: 10px"
      ></el-button>
      <el-button type="primary" size="medium" icon="el-icon-refresh" @click="reset">重置</el-button>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 10px"
        :data="tableData"
        height="300"
        v-loading="usertableLoading"
        highlight-current-row
      >
        <el-table-column label="选择" min-width="20%">
          <template scope="scope">
            <el-radio
              :label="scope.row.id"
              v-model="radio"
              @change.native="getCurrentRow(scope.row)"
            >{{ "" }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="40%"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="40%"></el-table-column>
      </el-table>
      <el-pagination
        background
        align="center"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        layout="total,pager,prev,next"
        @current-change="handleUsertableCurrentChange"
        :total="page.total"
        :pager-count="5"
      ></el-pagination>
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        closable
        :disable-transitions="false"
        @close="tabClose(tag)"
      >{{ tag }}
      </el-tag>
      <el-input type="textarea" placeholder="审批意见" v-model="handleForm.desc" v-show="textData"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveInform">保存</el-button>
      </span>
    </el-dialog>
    <!-- 驳回弹窗 -->
    <el-dialog
      title="驳回弹窗"
      :visible.sync="rejectBackVisible"
      :append-to-body="true"
      width="60%"
      top="60px"
      :before-close="rejectBackClose"
      :close-on-click-modal="false"
    >
      <avue-crud v-if="rejectBackVisible" ref="rejectBack" class="rejectBack" :data="RejectBackData"
                 :option="rejectBackOption" @row-click="rejectBackRowClick" @search-change="rejectBackSearchChange">
      </avue-crud>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectBackClose">取 消</el-button>
        <el-button type="primary" @click="rejectBackCertain">确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
// 搜索
import {historyFlowList} from "@/api/work/process";
import {
  completeTask,
  userList,
  turnTask,
  beforeAddSignTask,
  afterAddSignTask,
  listAllRejectBackTaskModel,
  rejectJump,
  runDraftingNodes,
  historyDraftingNodes,
} from "@/api/work/work";
import {closeTagBack} from "@/util/tags";
import FormDisplayReadonly from "@/global-views/src/FormDisplayProcess";
//按钮权限控制配置
import {DraftBtnPrmission, DealPrmission} from "@/config/flowableBtnPrmission";

export default {
  components: {FormDisplayReadonly},
  data() {
    return {
      tableList: [],
      usertableLoading: true,
      taskId: "",
      businessId: "",
      processInstanceId: "",
      src: "",
      flowLists: [],
      flowList: [],
      processDefinitionId: "",
      processNodeId: "",
      processNodeName: "",

      // 表单配置
      formName: "",
      formType: "",
      formComponent: null,
      avueForm: {},
      serverOption: {},
      formId: "",
      // 处理流程表单详情数据
      formData: {},
      permissionOption: [],

      //自研表单数据
      bizJsonData: "",

      viewProps: {},
      paramMap: {},
      form: {},

      textData: true,
      // 搜索与审批意见
      handleForm: {
        user: "",
        desc: "",
      },
      // 弹出框
      dialogVisible: false,
      // 弹出框标题
      title: "",
      // 弹出框中的表格
      tableData: [],
      // 弹窗分页
      page: {
        pageSize: 5, // 每页的数据条数
        currentPage: 1, //当前页码
        total: 10, //总条数
      },
      // 页签
      dynamicTags: [],
      // 单选框
      radio: "",
      // 搜索
      query: {},
      // 判断是转办还是待办
      transaction: null,
      // 被选人id
      selectId: "",

      rejectBackVisible: false,
      RejectBackData: [],
      rejectBackOption: {
        searchMenuPosition: 'center',
        searchShowBtn: false,
        addBtn: false,
        refreshBtn: false,
        searchMenuSpan: 8,
        columnBtn: false,
        selection: true,
        align: 'center',
        maxHeight: 800,
        menuAlign: 'center',
        menu: false,
        column: [
          {
            label: '节点名称',
            prop: 'taskName',
            search: true,
            searchSpan: 14
          }
        ]
      },
      // 是否同意
      isPass: false,
      // 按钮的显隐
      fromView: "",/*页面入口*/
      showTransferBtn: false,/*转办*/
      showSignBeforeBtn: false,/*前加签*/
      showSignAfterBtn: false,/*后加签*/
      showAgreeBtn: false,/*同意*/
      showDisagreeBtn: false,/*不同意*/
      showSaveBtn: false,/*保存*/
      showSubmitBtn: false,/*提交*/
      showCopySendBtn: false,/*抄送*/
      showRejectBtn: false,/*驳回*/
      showRevokeBtn: false,/*撤回*/
      showEmptyBtn: false,/*清空*/
      showDisuseBtn: false,/*废弃*/
      showCloseBtn: false,/*关闭*/
      showCommentBtn: false,/*批复意见*/
      // 按钮编码
      transferBtnCode: "transferBtnCode",/*转办*/
      signBeforeBtnCode: "signBeforeBtnCode",/*前加签*/
      signAfterBtnCode: "signAfterBtnCode",/*后加签*/
      agreeBtnCode: "agreeBtnCode",/*同意*/
      disagreeBtnCode: "disagreeBtnCode",/*不同意*/
      saveBtnCode: "saveBtnCode",/*保存*/
      submitBtnCode: "submitBtnCode",/*提交*/
      copySendBtnCode: "copySendBtnCode",/*抄送*/
      rejectBtnCode: "rejectBtnCode",/*驳回*/
      revokeBtnCode: "revokeBtnCode",/*撤回*/
      emptyBtnCode: "emptyBtnCode",/*清空*/
      disuseBtnCode: "disuseBtnCode",/*废弃*/
      closeBtnCode: "closeBtnCode",/*关闭*/
    };
  },
  created() {
    this.init();
  },
  // 深度监听,当数据变化的时候就开始刷新，初始化
  watch: {
    '$route.query.taskId'() {
      this.init()
    },
    // 深度观察监听
    deep: true
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用
    // 可以访问组件实例 `this`
    if (to.fullPath !== from.fullPath) {
      next();
    }
  },
  methods: {
    // 页面初始化
    async init() {
      console.log(this.$store.getters.userInfo)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        target: "#avue-view",
      });
      this.fromView = this.$route.query.fromView;

      /*前一个页面的传入参数 start*/
      this.processInstanceId = this.$route.query.processInstanceId;
      this.processDefinitionId = this.$route.query.processDefinitionId;
      this.taskId = this.$route.query.taskId;
      this.processNodeId = this.$route.query.taskDefinitionKey;
      this.processNodeName = this.$route.query.processNodeName;
      if (this.fromView === "DRAFT") {
        const processTaskInfo = await runDraftingNodes(this.processInstanceId, this.processDefinitionId);
        if (processTaskInfo.data.data.length > 0) {
          let processNodeList = processTaskInfo.data.data[0];
          this.taskId = processNodeList.taskId;
          this.processNodeId = processNodeList.taskDefinitionKey;
          this.processNodeName = processNodeList.taskName;
        }
      }
      this.businessId = this.$route.query.businessId ? this.$route.query.businessId : "";
      /*前一个页面的传入参数 end*/
      this.src = `/api/rabbit-flow/process/diagram-view?processInstanceId=${this.processInstanceId}`;

      Promise.all([
        this.getuserList(),
        this.getHistoryFlow(),
        this.getFormInfo(),
      ]).finally(() => {
        loading.close()
      })
    },
    // 获取流程历史
    getHistoryFlow() {
      return new Promise(resolve => {
        historyFlowList(this.processInstanceId).then(res => {
          if (res.data.code !== 200) {
            return Promise.reject("请求流程历史失败");
          }
          this.flowLists = res.data.data;
          resolve()
        });
      })
    },
    async getFormInfo() {
      const formInfoRes = await this.$axios.get("/api/rabbit-flow/jurisdiction/getFormInfoByProcessIntId", {
        params: {
          processInstanceId: this.processInstanceId,
          processNodeId: this.processNodeId,
        }
      })
      const {data: formInfo} = formInfoRes.data;
      const formConfig = await this.$axios.get(`/api/rabbit-resource/selfDevForm/selfDevelopLinkBusiness/${formInfo.formId}`).then((res => {
        if (res.data.code === 200) {
          return res.data.data;
        }
      }))
      const formHide = await this.$axios.get(`/api/rabbit-resource/selfDevForm/setRole`, {
        params: {
          formId: formInfo.formId,
          processDefId: this.processDefinitionId,
          processNodeId: this.processNodeId,
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.$message.error('获取节点信息失败');
          return
        }
        return res.data.data[0];
      });
      if (formHide) {
        // 获取隐藏按钮信息，并判断
        // 查询hidebutton里是否包含comment,是的话就让批复框隐藏，否则就显示
        if (formHide.hideButton.indexOf('comment') !== -1) {
          this.showCommentBtn = false;
        } else {
          this.showCommentBtn = true;
        }
        // 查询hidebutton里是否包含comment,是的话就让批复框隐藏，否则就显示
        if (formHide.hideButton.indexOf('save') !== -1) {
          this.showSaveBtn = false;
        } else {
          this.showSaveBtn = true;
        }
        // 查询hidebutton里是否包含comment,是的话就让批复框隐藏，否则就显示
        if (formHide.hideButton.indexOf('submit') !== -1) {
          this.showSubmitBtn = false;
        } else {
          this.showSubmitBtn = true;
        }
        // 查询hidebutton里是否包含comment,是的话就让批复框隐藏，否则就显示
        if (formHide.hideButton.indexOf('agree') !== -1) {
          this.showAgreeBtn = false;
        } else {
          this.showAgreeBtn = true;
        }
        // 查询hidebutton里是否包含comment,是的话就让批复框隐藏，否则就显示
        if (formHide.hideButton.indexOf('disagree') !== -1) {
          this.showDisagreeBtn = false;
        } else {
          this.showDisagreeBtn = true;
        }
        // 查询hidebutton里是否包含reject,是的话就让驳回按钮隐藏，否则就隐藏
        if (formHide.hideButton.indexOf('reject') !== -1) {
          this.showRejectBtn = false;
        } else {
          this.showRejectBtn = true;
        }
        // 查询hidebutton里是否包含SignBefore,是的话就让前加签按钮隐藏，否则就隐藏
        if (formHide.hideButton.indexOf('signBefore') !== -1) {
          this.showSignBeforeBtn = false;
        } else {
          this.showSignBeforeBtn = true;
        }
        // 查询hidebutton里是否包含SignAfter,是的话就让后加签按钮隐藏，否则就隐藏
        if (formHide.hideButton.indexOf('signAfter') !== -1) {
          this.showSignAfterBtn = false;
        } else {
          this.showSignAfterBtn = true;
        }
        // 查询hidebutton里是否包含copySend,是的话就让抄送按钮隐藏，否则就隐藏
        if (formHide.hideButton.indexOf('copySend') !== -1) {
          this.showCopySendBtn = false;
        } else {
          this.showCopySendBtn = true;
        }
        // 查询hidebutton里是否包含transfer,是的话就让转办按钮隐藏，否则就隐藏
        if (formHide.hideButton.indexOf('transfer') !== -1) {
          this.showTransferBtn = false;
        } else {
          this.showTransferBtn = true;
        }
      } else {
        //根据页面入口（fromView）控制按钮显隐
        if (this.fromView === "DRAFT") {
          //起草节点
          this.showTransferBtn = DraftBtnPrmission.showTransferBtn;
          this.showSignBeforeBtn = DraftBtnPrmission.showSignBeforeBtn;
          this.showSignAfterBtn = DraftBtnPrmission.showSignAfterBtn;
          this.showAgreeBtn = DraftBtnPrmission.showAgreeBtn;
          this.showDisagreeBtn = DraftBtnPrmission.showDisagreeBtn;
          this.showSaveBtn = DraftBtnPrmission.showSaveBtn;
          this.showSubmitBtn = DraftBtnPrmission.showSubmitBtn;
          this.showCopySendBtn = DraftBtnPrmission.showCopySendBtn;
          this.showRejectBtn = DraftBtnPrmission.showRejectBtn;
          this.showRevokeBtn = DraftBtnPrmission.showRevokeBtn;
          this.showEmptyBtn = DraftBtnPrmission.showEmptyBtn;
          this.showDisuseBtn = DraftBtnPrmission.showDisuseBtn;
          this.showCloseBtn = DraftBtnPrmission.showCloseBtn;
          this.showCommentBtn = DraftBtnPrmission.showCommentBtn;
        } else if (this.fromView === "DEAL") {
          //处理流程
          this.showTransferBtn = DealPrmission.showTransferBtn;
          this.showSignBeforeBtn = DealPrmission.showSignBeforeBtn;
          this.showSignAfterBtn = DealPrmission.showSignAfterBtn;
          this.showAgreeBtn = DealPrmission.showAgreeBtn;
          this.showDisagreeBtn = DealPrmission.showDisagreeBtn;
          this.showSaveBtn = DealPrmission.showSaveBtn;
          this.showSubmitBtn = DealPrmission.showSubmitBtn;
          this.showCopySendBtn = DealPrmission.showCopySendBtn;
          this.showRejectBtn = DealPrmission.showRejectBtn;
          this.showRevokeBtn = DealPrmission.showRevokeBtn;
          this.showEmptyBtn = DealPrmission.showEmptyBtn;
          this.showDisuseBtn = DealPrmission.showDisuseBtn;
          this.showCloseBtn = DealPrmission.showCloseBtn;
          this.showCommentBtn = DealPrmission.showCommentBtn;
        }
      }
      if (this.fromView === "DETAIL") {
        //流程详情
        this.showTransferBtn = false;
        this.showSignBeforeBtn = false;
        this.showSignAfterBtn = false;
        this.showAgreeBtn = false;
        this.showDisagreeBtn = false;
        this.showSaveBtn = false;
        this.showSubmitBtn = false;
        this.showCopySendBtn = false;
        this.showRejectBtn = false;
        this.showRevokeBtn = false;
        this.showEmptyBtn = false;
        this.showDisuseBtn = false;
        this.showCloseBtn = false;
        this.showCommentBtn = false;
      } else if (this.fromView === "DONE" || this.fromView === "SEND") {
        //已处理的流程（撤回）
        this.showTransferBtn = false;
        this.showSignBeforeBtn = false;
        this.showSignAfterBtn = false;
        this.showAgreeBtn = false;
        this.showDisagreeBtn = false;
        this.showSaveBtn = false;
        this.showSubmitBtn = false;
        this.showCopySendBtn = false;
        this.showRejectBtn = false;
        this.showRevokeBtn = true;
        this.showEmptyBtn = false;
        this.showDisuseBtn = false;
        this.showCloseBtn = true;
        this.showCommentBtn = false;
      }
      // 判断批复框是否隐藏，隐藏给默认同意字样
      if (!this.showCommentBtn) {
        this.form.comment = '同意'
      }
      if (formConfig.pcForm) {
        if (!formInfo.dataId) {
          this.formId = formInfo.formId;
          return this.$message.error("获取表单失败");
        }
        this.formType = "CD";
        await this.getServerOption(formInfo.formId);
        let params = {
          current: 0,
          size: 1,
          id: formInfo.formId,
          bind: this.paramMap,//参数绑定
          viewProps: this.viewProps,//id-prop映射
        }
        await this.$axios.post(`/api/rabbit-resource/formcustom/form-table-one/${formInfo.dataId}`, params)
          .then(res => {
            const {data} = res.data;
            if (!data) {
              return
            }
            // 如果只为"[]" 则为upload组件，值需要使用parse处理一下
            Object.keys(data).forEach((key) => {
              if (typeof data[key] === "string" && data[key][0] === '[') {
                data[key] = JSON.parse(data[key]);
              }
            })
            this.formData = data;
          }).catch(() => {
            this.loading = false
          })
        this.permissionOption = formInfo.option ? formInfo.option : [];
      } else {
        this.formType = "SD";
        const url = formConfig.formUrl && formConfig.formUrl.replace(/^\//, '');
        import(`@/independents/${url}`).then(res => {
          this.formComponent = res.default;
        })
        this.bizJsonData = formInfo.bizJsonData;
      }
      this.formId = formInfo.formId;
    },
    getServerOption(id) {
      if (!id) {
        return Promise.reject()
      }
      this.loading = true
      return this.$axios.get("/api/rabbit-resource/formcustom/form-list/" + id, {
        params: {flag: 1}
      }).then(res => {
        if (res.data.data) {
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
      }).catch(() => {
        this.loading = false
      })
    },
    // 解析弹出框
    buildPopViewMap(props) {
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
      return {viewMap, viewParamMap}
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
              this.paramMap[paramKey] = column.prop
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
    // 按钮前的调用方法
    handleBeforeBtnClick(btnCode) {
      // 判断自研表单中是否存在该函数
      if (this.$refs.formComponent.beforeBtnClick) {
        this.$refs.formComponent.beforeBtnClick(btnCode);
      }
    },
    // 按钮后的调用方法
    handleAfterBtnClick(btnCode) {
      // 判断自研表单中是否存在该函数
      if (this.$refs.formComponent.afterBtnClick) {
        this.$refs.formComponent.afterBtnClick(btnCode);
      }
    },
    // 撤回
    revoke() {
      this.handleBeforeBtnClick(this.revokeBtnCode);

      let params = {
        processInstanceId: this.processInstanceId,
        processDefinitionId: this.processDefinitionId,
      };
      // 如果是从[已发事务]点击的【撤回】按钮，传入起草节点的参数
      if (this.fromView === "SEND") {
        historyDraftingNodes(this.processInstanceId).then(res => {
          if (res.data.data.length > 0) {
            let processNodeList = res.data.data[0];
            let taskId = processNodeList.taskId;
            let processNodeId = processNodeList.historyActivityId;
            let processNodeName = processNodeList.historyActivityName;
            params.taskId = taskId;
            params.taskDefineKes = processNodeId;
            params.nodeName = processNodeName;
            this.revokeApi(params);
          }
        })
      } else {
        params.taskId = this.taskId;
        params.taskDefineKes = this.processNodeId;
        params.nodeName = this.processNodeName;
        this.revokeApi(params);
      }

      this.handleAfterBtnClick(this.revokeBtnCode);
    },
    // 撤回API
    revokeApi(params) {
      this.$axios.post(`/api/rabbit-flow/bpmnUserTask/flow-revoke`, params).then((res) => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          closeTagBack(this.$route.path)
        } else {
          this.$message.error(res.data.msg || "撤回失败");
        }
      })
    },
    // 废弃
    disuse() {
      this.handleBeforeBtnClick(this.disuseBtnCode);
      this.$axios.get(`/api/rabbit-flow/changeRunTask/disuse`, {
        params: {
          taskId: this.taskId,
          processInstanceId: this.processInstanceId,
          processDefinitionId: this.processDefinitionId,
        }
      }).then((res) => {
        if (res.data.success) {
          this.$message.success(res.data.msg);
          closeTagBack(this.$route.path)
        } else {
          this.$message.error(res.data.msg || "废弃失败");
        }
      })
      this.handleAfterBtnClick(this.disuseBtnCode);
    },
    // 回车
    enterQ() {
      this.search();
    },
    handleUsertableCurrentChange(val) {
      this.page.currentPage = val;
      this.getuserList();
    },
    // 搜索
    search() {
      this.page.currentPage = 1;

      userList({
        current: this.page.currentPage,
        size: this.page.pageSize,
        realName: this.handleForm.user
      }).then(
        (res) => {
          const data = res.data.data;
          // // 总条数,如果为0的话不显示分页
          this.page.total = data.total;
          // // 渲染表单页面
          this.tableData = data.records;
        }
      );
    },
    // 重置
    reset() {
      this.handleForm.user = "";
      this.radio = "";
      this.dynamicTags = [];
      this.getuserList();
    },
    // 取消
    cancel() {
      this.handleForm.user = "";

      this.tabClose();
      this.page.currentPage = 1;
      this.handleForm.desc = "";
      this.dialogVisible = false;
      this.textData = true;
    },
    // 对话框X
    handleClose() {
      this.cancel();
    },
    // 转办
    transfer() {
      this.title = "转办";
      this.dialogVisible = true;
      this.transaction = 1;
    },
    // 前加签
    signBefore() {
      this.title = "前加签";
      // 隐藏审批意见
      this.textData = false;
      this.transaction = 2;
      this.dialogVisible = true;
    },
    // 后加签
    signAfter() {
      this.title = "后加签";
      this.transaction = 3;
      this.dialogVisible = true;
    },
    // 关闭页签
    tabClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.radio = "";
      this.selectId = "";
    },
    // 弹出框单选id
    getCurrentRow(row) {
      let dataTag = row.realName;
      this.dynamicTags.push(dataTag);
      if (this.dynamicTags.length > 1) {
        this.dynamicTags.shift();
      }
      this.selectId = row.id;
    },
    // 弹出框表格
    getuserList() {
      return new Promise(resolve => {
        this.usertableLoading = true;
        const params = {
          size: this.page.pageSize,
          current: this.page.currentPage,
        }
        userList(params).then((res) => {
          const {data} = res.data;
          this.tableData = data.records;
          this.page.total = data.total;
          this.usertableLoading = false;
          resolve()
        });
      })
    },
    // 转办、前后加签点击保存
    saveInform() {
      if (this.formType === "CD") {
        this.$refs.formDisplay.submit().then(() => {
          this.afterSave();
        }).catch(() => {
          this.$message.warning('请填写必填字段')
        });
      } else if (this.formType === "SD") {
        this.afterSave();
      }
    },
    // 转办、前、后加签保存后
    afterSave() {
      let btnCode = "";
      switch (this.transaction) {
        case 1 :
          btnCode = this.transferBtnCode;
          break;
        case 2 :
          btnCode = this.signBeforeBtnCode;
          break;
        case 3 :
          btnCode = this.signAfterBtnCode;
          break;
        case 4 :
          btnCode = this.copySendBtnCode;
          break;
      }
      this.handleBeforeBtnClick(btnCode);

      if (this.selectId === "") {
        this.$message({
          message: "委托人不能为空！",
          type: "warning",
        });
        return;
      }
      let params = {};
      // 任务id
      params.taskId = this.taskId;
      // 流程实列的id
      params.processInstanceId = this.processInstanceId;
      // 审批意见
      params.message = this.handleForm.desc;
      // 流程节点ID
      params.actId = this.processNodeId;
      // 流程节点名称
      params.processNodeName = this.processNodeName;
      if (this.transaction === 1) { // 转办
        // 被转办人id
        params.turnToUserId = this.selectId;
        turnTask(params).then(() => {
          this.$message.success('转办成功')
          closeTagBack(this.$route.path)
        });
      } else if (this.transaction === 2) { // 前加签
        let params = {};
        params.taskUser = this.$store.getters.userInfo.user_id;
        params.taskId = this.taskId;
        params.processInstanceId = this.processInstanceId;
        params.actId = this.processNodeId;
        let signPersoneds = [];
        signPersoneds.push("taskUser_" + this.selectId);
        params.signPersoneds = signPersoneds;
        beforeAddSignTask(params).then(() => {
          this.$message.success('加签成功')
          // 关闭页面
          closeTagBack(this.$route.path)
        });
      } else if (this.transaction === 3) { // 后加签
        let params = {};
        params.taskUser = this.$store.getters.userInfo.user_id;
        params.message = this.handleForm.desc;
        params.taskId = this.taskId;
        params.processInstanceId = this.processInstanceId;
        params.actId = this.processNodeId;
        let signPersoneds = [];
        signPersoneds.push("taskUser_" + this.selectId);
        params.signPersoneds = signPersoneds;
        afterAddSignTask(params).then(() => {
          this.$message.success('加签成功')
          // 关闭页面
          closeTagBack(this.$route.path)
        });
      } else if (this.transaction === 4) {  // 抄送
        this.$axios.get(`/api/rabbit-flow/changeRunTask/processCC?taskId=${this.taskId}&userId=${"taskUser_" + this.selectId}`)
          .then(() => {
            this.$message.success('抄送成功')
            //关闭页面
            closeTagBack(this.$route.path)
          })
      }

      this.handleAfterBtnClick(btnCode);
    },
    // 抄送
    copySend() {
      this.title = "抄送";
      this.dialogVisible = true;
      this.transaction = 4;
    },
    // 保存
    onSave() {
      this.saveOnly = true
      if (this.formType === 'SD') {
        this.handleBeforeBtnClick(this.saveBtnCode);

        this.handleAfterBtnClick(this.saveBtnCode);
      } else {
        this.saveCustomDevForm();
      }
    },
    // 提交
    onSubmit() {
      if (this.formType === 'SD') {
        this.handleBeforeBtnClick(this.submitBtnCode);

        this.handleAfterBtnClick(this.submitBtnCode);
      } else {
        this.saveCustomDevForm();
      }
    },
    // 同意
    agree() {
      if (!this.form.comment) {
        this.form.comment = "同意";
      }
      if (this.formType === 'SD') {
        this.handleBeforeBtnClick(this.agreeBtnCode);
        this.isPass = true;

        this.handleAfterBtnClick(this.agreeBtnCode);
      } else {
        this.saveCustomDevForm();
      }
    },
    // 不同意
    disagree() {
      this.handleBeforeBtnClick(this.disagreeBtnCode);
      this.isPass = false;

      this.handleAfterBtnClick(this.disagreeBtnCode);
    },
    // 自研表单：完成节点走流程
    completeSelfDevForm(bizJsonData) {
      if (bizJsonData === null || bizJsonData === undefined) {
        bizJsonData = null;
      }
      const params = {
        taskId: this.taskId,
        processInstanceId: this.processInstanceId,
        processDefinitionId: this.processDefinitionId,
        actId: this.processNodeId,
        flag: "ok",
        comment: this.form.comment,
        variables: bizJsonData,
        formType: this.formType,
        isPass: this.isPass,
      };
      // 提交
      completeTask(params).then((res) => {
        const data = res.data;
        if (data.success) {
          this.$message.success(data.msg);
          closeTagBack(this.$route.path)
        } else {
          this.$message.error(data.msg || "提交失败");
        }
      });
    },
    // 自定义表单：完成节点走流程
    saveCustomDevForm() {
      this.$refs.formDisplay.submit().then(() => {
        const params = {
          taskId: this.taskId,
          processInstanceId: this.processInstanceId,
          processDefinitionId: this.processDefinitionId,
          actId: this.processNodeId,
          flag: "ok",
          comment: this.form.comment,
          variables: this.$refs.formDisplay.form,
          formType: this.formType,
        };

        // 提交
        completeTask(params).then((res) => {
          const data = res.data;
          if (data.success) {
            this.$message.success(data.msg);
            closeTagBack(this.$route.path)
          } else {
            this.$message.error(data.msg || "提交失败");
          }
        });
      }).catch(() => {
        this.$message.warning('请填写必填字段')
      });
    },
    // 驳回
    reject() {
      this.handleBeforeBtnClick(this.rejectBtnCode);

      this.rejectBackVisible = true
      this.listAllRejectBackTaskModel({
        taskId: this.taskId,
        taskName: "",
      })
      setTimeout(() => {
        document.querySelector(".rejectBack .el-table__fixed-header-wrapper tr th div").addEventListener('click', (event) => {
          if (this.lastRow) {
            this.$refs.rejectBack.selectClear();
            this.lastRow = null
          }
        })
      }, 0)

      this.handleAfterBtnClick(this.rejectBtnCode);
    },


    listAllRejectBackTaskModel(parms, cb) {
      listAllRejectBackTaskModel(parms).then((res) => {
        this.RejectBackData = res.data.data;
        if (cb) {
          cb()
        }
      }).catch((res) => {
        if (cb) {
          cb()
        }
      })
    },
    // 清空
    empty() {
      this.handleBeforeBtnClick(this.emptyBtnCode);

      this.handleAfterBtnClick(this.emptyBtnCode);
    },
    // 关闭页面
    handleCancel() {
      this.handleBeforeBtnClick(this.closeBtnCode);
      closeTagBack(this.$route.path)
      this.handleAfterBtnClick(this.closeBtnCode);
    },

    rejectBackSearchChange(params, done) {
      this.listAllRejectBackTaskModel({
        taskId: this.taskId,
        taskName: params.taskName,
      }, done)
    },
    rejectBackRowClick(row) {
      if (this.lastRow === row) {
        this.lastRow = null
        this.$refs.rejectBack.selectClear();
        return
      }
      this.$refs.rejectBack.selectClear()
      this.$refs.rejectBack.toggleSelection([row])
      this.lastRow = row;
    },
    rejectBackClose() {
      this.rejectBackVisible = false;

    },
    rejectBackCertain() {
      if (!this.lastRow) {
        this.$message.warning('请选择一条节点信息进行驳回')
      } else {
        rejectJump({
          taskId: this.taskId,
          targetTaskDefineKes: [this.lastRow.taskDefKey],
          message: this.form.comment
        }).then((res) => {
          if (res.data) {
            this.$message.success(res.data.msg)
          }
          this.rejectBackVisible = false;
          closeTagBack(this.$route.path)
        })
      }
    }
  }
  ,
}
;
</script>

<style lang="scss" scoped>
.timeline-card {
  h4 {
    font-weight: 400;
    color: #1f2f3d;
    margin-top: 0;
  }

  p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.btns {
  text-align: center;
  margin-bottom: 32px;
}

.rejectBack /deep/ .el-checkbox {
  pointer-events: none;
}
</style>
