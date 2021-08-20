<template>
  <div class="container-wrapper">
    <div class="container">
      <el-form ref="form" size="small" label-width="80px">
        <el-row :gutter="10" type="flex" justify="space-between">
          <el-col :span="16">
            <el-form-item label="表单名称">
              <el-input readonly :value="formName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="small" type="primary" @click="onSave">保存</el-button>
            <el-button size="small" type="info" @click="resetTable">重置</el-button>
          </el-col>
          <el-col :span="1">
            <i class="el-icon-close" @click="onClose"></i>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item required label="选择流程">
              <el-select v-model="initialProcessInfoId"
                         @change="selectProcess"
                         placeholder="请选择一个选择流程"
                         style="width: 100%">
                <el-option
                  v-for="item in processInfo"
                  :key="item.id"
                  :label="(item.name || item.id)"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item required label="流程节点">
              <el-select v-model="initialProcessId"
                         @change="selectProcessNode"
                         placeholder="请选择一个流程节点"
                         style="width: 100%">
                <el-option
                  v-for="item in processNodeList"
                  :key="item.id"
                  :label="(item.name || item.id)"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--按钮权限-->
      <div class="Btn-permission" @click="downBoxClick">按钮权限 <i
        :class="['downi',this.downBoxBoolean?'downi180':'downi0']"></i></div>
      <div v-show="this.downBoxBoolean" :class="['downBox',this.downBoxBoolean?'downbox100':'downbox0']">
        <div class="downBox-box">
          <!--处理流程中的批复意见框开关-->
          <el-row :gutter="24" style=" float: left;width: 8rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 4rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">批复意见</label>
              <avue-switch style="float: left;" v-model="comment" @click="commentClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的保存按钮开关-->
          <el-row :gutter="24" style="float: left;width: 6rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 2rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">保存</label>
              <avue-switch style="float: left;" v-model="save" @click="saveClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的提交按钮开关-->
          <el-row :gutter="24" style="float: left;width: 6rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 2rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">提交</label>
              <avue-switch style="float: left;" v-model="submit" @click="submitClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的同意按钮开关-->
          <el-row :gutter="24" style=" float: left;width: 8rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 4rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">同意</label>
              <avue-switch style="float: left;" v-model="agree" @click="agreeClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的不同意按钮开关-->
          <el-row :gutter="24" style=" float: left;width: 8rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 4rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">不同意</label>
              <avue-switch style="float: left;" v-model="disagree" @click="disagreeClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的驳回按钮开关-->
          <el-row :gutter="24" style="float: left;width: 6rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 2rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">驳回</label>
              <avue-switch style="float: left;" v-model="reject" @click="rejectClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
        </div>
        <div class="downBox-box">
          <!--处理流程中的前加签按钮开关-->
          <el-row :gutter="24" style=" float: left;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width:3rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">前加签</label>
              <avue-switch style="float: left;" v-model="signBefore" @click="signBeforeClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的后加签按钮开关-->
          <el-row :gutter="24" style="float: left;width: 7rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 3rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">后加签</label>
              <avue-switch style="float: left;" v-model="signAfter" @click="signAfterClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的抄送按钮开关-->
          <el-row :gutter="24" style=" float: left;width: 6rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 2rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">抄送</label>
              <avue-switch style="float: left;" v-model="copySend" @click="copySendClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--处理流程中的转办按钮开关-->
          <el-row :gutter="24" style=" float: left;width: 6rem;margin: 0px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 2rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">转办</label>
              <avue-switch style="float: left;" v-model="transfer" @click="transferClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
        </div>
      </div>
      <!--流程权限-->
      <div class="Btn-permission" @click="processClick">流程权限 <i
        :class="['downi',this.processBoxBoolean?'downi180':'downi0']"></i></div>
      <div v-show="this.processBoxBoolean"
           :class="['processAuthority',this.processBoxBoolean?'processdownbox100':'processdownbox0']">
        <div class="processBox">
          <!--普通驳回或超级驳回开关-->
          <avue-switch v-model="isRejectBtn" :dic="vic" style="margin-left:50px; float: left"
                       @click="isRejectClick"></avue-switch>
        </div>
        <div class="processBox">
          <!--上一节点撤销开关-->
          <el-row :gutter="24" style=" float: left; margin-left: 8px;">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 6rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">上一节点撤销</label>
              <avue-switch style="float: left;" v-model="isRevokeBtn" @click="isRevokeClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
          <!--起草节点撤销开关-->
          <el-row :gutter="24" style=" float: left; margin-left: 8px">
            <el-col :span="16" style="width: 100%;padding: 0;margin: 0px;">
              <label
                style="color:#606266; width: 6rem; text-align:right;font-size: 14px;margin-right: 14px; float: left">起草节点撤销</label>
              <avue-switch style="float: left;" v-model="isRevokeDraftBtn" @click="isRevokeDraftClick"></avue-switch>
            </el-col>
            <el-col :span="24"></el-col>
          </el-row>
        </div>
      </div>
      <!--字段权限-->
      <div class="Btn-permission" v-show="formType === 'CD'">字段权限</div>
      <el-row class="table-wrapper" v-show="formType === 'CD'">
        <el-col :span="16">
          <el-table
            :data="tableData"
            border
            v-loading="isTableLoading"
            height="100%"
            style="width: 100%">
            <!-- 控件 -->
            <el-table-column
              prop="columnName"
              label="控件"
              align="center"
            >
              <template slot-scope="{row, index}">
                <long-text :value="row.columnDesc"/>
              </template>
            </el-table-column>
            <!-- 必填 -->
            <el-table-column
              prop="required"
              align="center"
              width="100px"
              label="隐藏">
              <template #header>
                <div>必填</div>
                <el-checkbox
                  v-model="allRequired"
                  :indeterminate="allRequiredIndeterminate"
                  size="mini"
                  @change="handleAllRequirdChange">
                </el-checkbox>
              </template>
              <template slot-scope="{row}">
                <el-checkbox v-model="requiredColumn[row.columnName]" size="mini"></el-checkbox>
              </template>
            </el-table-column>
            <!-- 隐藏 -->
            <el-table-column
              prop="hide"
              align="center"
              width="100px"
              label="隐藏">
              <template #header>
                <div>隐藏</div>
                <el-checkbox
                  v-model="allHide"
                  :indeterminate="allHideIndeterminate"
                  size="mini"
                  @change="handleAllHideChange">
                </el-checkbox>
              </template>
              <template slot-scope="{row}">
                <el-checkbox v-model="hideColumn[row.columnName]" size="mini"></el-checkbox>
              </template>
            </el-table-column>
            <!-- 禁用 -->
            <el-table-column
              prop="disable"
              align="center"
              width="100px"
              label="禁用">
              <template #header>
                <div>禁用</div>
                <el-checkbox
                  v-model="allDisabled"
                  :indeterminate="allDisabledIndeterminate"
                  size="mini"
                  @change="handleAllDisabledChange">
                </el-checkbox>
              </template>
              <template slot-scope="{row}">
                <el-checkbox v-model="disabledColumn[row.columnName]" size="mini"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>

import LongText from '@/components/long-text/LongText';
import {getAllProcessNode} from "@/api/flow/flow";
import {closeTagTo} from "@/util/tags";
//按钮权限控制配置
import {DraftBtnPrmission, DealPrmission} from "@/config/flowableBtnPrmission";

export default {
  name: "permission",
  components: {LongText},
  data() {
    return {
      tableData: [],
      oriTableData: [],
      processInfos: [],
      processInfo: [],

      // 通过getAllProcessNode()查询得到的数据
      processInfoList: [],
      // 选择分区后展示的节点数据
      processNodeList: [],
      // 流程节点
      parentProcessList: [],
      subProcessList: [],
      // 初始选择流程
      initialProcessInfo: {},
      initialProcessInfoId: null,
      // 初始流程节点
      initialProcess: {},
      initialProcessId: null,
      // 是否是子流程
      isSubProcess: false,

      isTableLoading: true,
      processDefinitionId: "",
      formId: "",
      formName: "",
      saveId: null,

      staticField: ['ID', 'HEADER_ID'],
      staticColumnList: {},

      hideColumn: {},
      disabledColumn: {},
      requiredColumn: {},

      // 按钮权限隐藏的按钮，默认
      hideButton: ['save', 'submit', 'reject'],

      allHide: false,
      allHideIndeterminate: false,

      allDisabled: false,
      allDisabledIndeterminate: false,

      allRequired: false,
      allRequiredIndeterminate: false,

      // 按钮权限控制开关
      transfer: true,/*转办*/
      signBefore: true,/*前加签*/
      signAfter: true,/*后加签*/
      agree: true,/*同意*/
      disagree: true,/*不同意*/
      save: false,/*保存*/
      submit: false,/*提交*/
      copySend: true,/*抄送*/
      reject: false,/*驳回*/
      // revoke: false,/*撤回*/
      // empty: false,/*清空*/
      // disuse: false,/*废弃*/
      // close: false,/*关闭*/
      comment: true,/*批复意见*/
      // 表单类型
      formType: "",

      // 流程权限普通驳回超级驳回按钮,上一节点撤销，起草节点撤销
      isRejectBtn: false,
      isRevokeBtn: false,
      isRevokeDraftBtn: true,

      // 要传参的流程权限的三个字段驳回，上一节点，起草节点
      isReject: 0,
      isRevoke: 1,
      isRevokeDraft: 0,

      // 按钮权限下拉框显示隐藏
      downBoxBoolean: true,
      // 流程权限下拉框显示隐藏
      processBoxBoolean: true,

      vic: [{
        label: '普通驳回',
      }, {
        label: '超级驳回',
      }],
    }
  },
  created() {
    const id = this.$route.params.id.toString();
    this.processDefinitionId = id.split("::")[0] || "";
    this.formId = id.split("::")[1] || "";

    this.init()
  },
  watch: {
    requiredColumn: {
      deep: true,
      handler(val) {
        const keys = Object.keys(val);
        const requiredArr = keys.filter(key => {
          return val[key];
        })
        if (requiredArr.length === keys.length) {
          this.allRequiredIndeterminate = false;
          this.allRequired = true;
          return
        }
        if (requiredArr.length > 0) {
          this.allRequiredIndeterminate = true;
          return false;
        }
        this.allRequired = false;
        this.allRequiredIndeterminate = false;
      }
    },
    hideColumn: {
      deep: true,
      handler(val) {
        const keys = Object.keys(val);
        const hideArr = keys.filter(key => {
          return val[key];
        })
        if (hideArr.length === keys.length) {
          this.allHideIndeterminate = false;
          this.allHide = true;
          return
        }
        if (hideArr.length > 0) {
          this.allHideIndeterminate = true;
          return false;
        }
        this.allHide = false;
        this.allHideIndeterminate = false;
      }
    },
    disabledColumn: {
      deep: true,
      handler(val) {
        const keys = Object.keys(val);
        const disabledArr = keys.filter(key => {
          return val[key];
        })
        if (disabledArr.length === keys.length) {
          this.allDisabledIndeterminate = false;
          this.allDisabled = true;
          return
        }
        if (disabledArr.length > 0) {
          this.allDisabledIndeterminate = true;
          return false;
        }
        this.allDisabledIndeterminate = false;
        this.allDisabled = false;
      }
    },
  },
  methods: {
    // 点击按钮权限下拉
    downBoxClick() {
      this.downBoxBoolean = !this.downBoxBoolean
    },
    // 点击流程权限下拉
    processClick() {
      this.processBoxBoolean = !this.processBoxBoolean
    },
    // 批复意见按钮开关
    commentClick() {
      // 批复按钮开关打开的时候，就让他删除comment 否则就添加
      if (!this.comment) {
        let isComment = this.hideButton.indexOf('comment');
        if (isComment == -1) {
          this.hideButton.push('comment')
        }
      } else {
        let isComment = this.hideButton.indexOf('comment')
        if (isComment > -1) {
          this.hideButton.splice(isComment, 1)
        }
      }
    },
    // 保存按钮开关
    saveClick() {
      // 不同意开关打开的时候，就让他删除disagree 否则就添加
      if (!this.save) {
        let isSave = this.hideButton.indexOf('save');
        if (isSave == -1) {
          this.hideButton.push('save')
        }
      } else {
        let isSave = this.hideButton.indexOf('save');
        if (isSave > -1) {
          this.hideButton.splice(isSave, 1)
        }
      }
    },
    // 提交按钮开关
    submitClick() {
      // 不同意开关打开的时候，就让他删除disagree 否则就添加
      if (!this.submit) {
        let isSubmit = this.hideButton.indexOf('submit');
        if (isSubmit == -1) {
          this.hideButton.push('submit')
        }
      } else {
        let isSubmit = this.hideButton.indexOf('submit');
        if (isSubmit > -1) {
          this.hideButton.splice(isSubmit, 1)
        }
      }
    },
    // 同意按钮开关
    agreeClick() {
      // 同意按钮开关打开的时候，就让他删除agree 否则就添加
      if (!this.agree) {
        let isAgree = this.hideButton.indexOf('agree');
        if (isAgree == -1) {
          this.hideButton.push('agree')
        }
      } else {
        let isAgree = !this.hideButton ? [] : this.hideButton.indexOf('agree');
        if (isAgree > -1) {
          this.hideButton.splice(isAgree, 1)
        }
      }
    },
    // 不同意按钮开关
    disagreeClick() {
      // 不同意开关打开的时候，就让他删除disagree 否则就添加
      if (!this.disagree) {
        let isDisagree = this.hideButton.indexOf('disagree');
        if (isDisagree == -1) {
          this.hideButton.push('disagree')
        }
      } else {
        let isDisagree = this.hideButton.indexOf('disagree');
        if (isDisagree > -1) {
          this.hideButton.splice(isDisagree, 1)
        }
      }
    },
    // 驳回按钮开关
    rejectClick() {
      // 驳回按钮开关打开的时候，就让他删除reject 否则就添加
      if (!this.reject) {
        let isReject = this.hideButton.indexOf('reject');
        if (isReject == -1) {
          this.hideButton.push('reject')
        }
      } else {
        let isReject = this.hideButton.indexOf('reject')
        if (isReject > -1) {
          this.hideButton.splice(isReject, 1)
        }
      }
    },
    // 前加签按钮开关
    signBeforeClick() {
      // 前加签按钮开关打开的时候，就让他删除signBefore 否则就添加
      if (!this.signBefore) {
        let isSignBefore = this.hideButton.indexOf('signBefore');
        if (isSignBefore == -1) {
          this.hideButton.push('signBefore')
        }
      } else {
        let isSignBefore = this.hideButton.indexOf('signBefore')
        if (isSignBefore > -1) {
          this.hideButton.splice(isSignBefore, 1)
        }
      }
    },
    // 后加签按钮开关
    signAfterClick() {
      // 前加签按钮开关打开的时候，就让他删除signAfter 否则就添加
      if (!this.signAfter) {
        let isSignAfter = this.hideButton.indexOf('signAfter');
        if (isSignAfter == -1) {
          this.hideButton.push('signAfter')
        }
      } else {
        let isSignAfter = this.hideButton.indexOf('signAfter')
        if (isSignAfter > -1) {
          this.hideButton.splice(isSignAfter, 1)
        }
      }
    },
    // 抄送按钮开关
    copySendClick() {
      // 抄送按钮开关打开的时候，就让他删除copySend 否则就添加
      if (!this.copySend) {
        let isCopySend = this.hideButton.indexOf('copySend');
        if (isCopySend == -1) {
          this.hideButton.push('copySend')
        }
      } else {
        let isCopySend = this.hideButton.indexOf('copySend')
        if (isCopySend > -1) {
          this.hideButton.splice(isCopySend, 1)
        }
      }
    },
    // 转办按钮
    transferClick() {
      // 前加签按钮开关打开的时候，就让他删除transfer 否则就添加
      if (!this.transfer) {
        let isTransfer = this.hideButton.indexOf('transfer');
        if (isTransfer == -1) {
          this.hideButton.push('transfer')
        }
      } else {
        let isTransfer = this.hideButton.indexOf('transfer')
        if (isTransfer > -1) {
          this.hideButton.splice(isTransfer, 1)
        }
      }
    },
    // 普通驳回超级驳回按钮开关
    isRejectClick() {
      //  普通驳回超级驳回按钮打开的时候，字段is_reject为1 否则为0
      if (this.isRejectBtn) {
        this.isReject = 1
      } else {
        this.isReject = 0
      }
    },
    // 上一节点撤销按钮开关
    isRevokeClick() {
      // 上一节点撤销按钮开关打开的时候，字段is_revoke为0 否则为1
      if (this.isRevokeBtn) {
        this.isRevoke = 0
      } else {
        this.isRevoke = 1
      }
    },
    // 起草节点撤销按钮开关
    isRevokeDraftClick() {
      // 起草节点撤销按钮开关打开的时候，字段is_revoke_draft为0否则为1
      if (this.isRevokeDraftBtn) {
        this.isRevokeDraft = 0
      } else {
        this.isRevokeDraft = 1
      }
    },
    // 页面初始化
    async init() {
      await Promise.all([
        this.getFormInfo(),
        this.getAllProcessNode()
      ]);
      await this.getNodeData(this.initialProcessId);
    },
    handleAllRequirdChange(val) {
      Object.keys(this.requiredColumn).forEach(key => {
        this.requiredColumn[key] = val
      })
    },
    handleAllHideChange(val) {
      Object.keys(this.hideColumn).forEach(key => {
        this.hideColumn[key] = val
      })
    },
    handleAllDisabledChange(val) {
      Object.keys(this.disabledColumn).forEach(key => {
        this.disabledColumn[key] = val
      })
    },
    // 关闭页面
    onClose() {
      closeTagTo(this.$route.fullPath, '/flow/manager')
    },
    // 重置
    resetTable() {
      this.tableData.forEach(item => {
        this.hideColumn[item.columnId] = item.hide;
        this.disabledColumn[item.columnId] = item.disable;
        this.requiredColumn[item.columnId] = item.required;
      })
    },
    // 选择流程下拉框选择
    selectProcess(nodeId) {
      this.initialProcessInfo = this.processInfo.find(item => item.id === nodeId)
      this.initialProcessInfoId = nodeId;
      let parentProcessList = [];
      let parentProcessS = [];
      let subProcessList = [];
      let subProcessS = [];
      for (const processInfos of this.processInfoList) {
        for (const processInfo of processInfos) {
          if (processInfo.parentProcessList) {
            parentProcessList.push(processInfo.parentProcessList)
          }
          if (processInfo.subProcessList && processInfo.id === nodeId) {
            // 根据id判断是哪一个子流程
            subProcessList.push(processInfo.subProcessList)
          }
        }
      }
      if (parentProcessList.length > 0) {
        // 父流程
        for (const parentProcess of parentProcessList[0]) {
          parentProcessS.push(parentProcess);
        }
        this.processNodeList = parentProcessS;
        this.initialProcessId = this.processNodeList[0].id;
        this.initialProcess = this.processNodeList[0];
        this.isSubProcess = false;
      }
      if (subProcessList.length > 0) {
        // 子流程
        for (const subProcess of subProcessList[0]) {
          subProcessS.push(subProcess);
        }
        this.processNodeList = subProcessS;
        this.initialProcessId = this.processNodeList[0].id;
        this.initialProcess = this.processNodeList[0];
        this.isSubProcess = true;
      }
      this.getNodeData(this.initialProcessId);
    },
    // 流程节点下拉框选择
    selectProcessNode(nodeId) {
      this.initialProcess = this.processNodeList.find(item => item.id === nodeId)
      this.initialProcessId = nodeId;
      this.getNodeData(nodeId);
    },
    // 获取所有字段
    async getLinkBusiness() {
      const res = await this.$axios.get(`/api/rabbit-resource/selfDevForm/linkBusiness/${this.formId}`);
      if (res.data.code !== 200) {
        throw new Error()
      }
      return res.data.data;
    },
    // 获取关联字段
    async getLinkProcess() {
      const res = await this.$axios.get(`/api/rabbit-resource/selfDevForm/linkProcess/${this.formId}`);

      if (res.data.code !== 200) {
        throw new Error()
      }
      this.formType = res.data.data[0].formType;
      return res.data.data[0];
    },
    // 回显已经关联的字段
    async getFormInfo() {
      this.isTableLoading = true;

      const _map = new Map();

      const [linkBusiness, linkProcess] = await Promise.all([
        this.getLinkBusiness(),
        this.getLinkProcess()
      ])

      this.formName = linkProcess.formName;

      // 已经关联的字段
      linkProcess.enableColumns.split(',').forEach(item => {
        if (!item) {
          return;
        }
        _map.set(item, true)
      })

      // 所有字段
      const allColumn = linkBusiness.filter(item => {
        return _map.has(item.columnName)
      }).filter((item) => {
        const isStatic = this.staticField.includes(item.columnName.split('#').pop())
        if (isStatic) {
          this.staticColumnList[item.columnName] = item;
        }
        return !isStatic;
      });

      allColumn.forEach(item => {
        this.$set(this.hideColumn, item.columnName, false)
        this.$set(this.disabledColumn, item.columnName, false)
        this.$set(this.requiredColumn, item.columnName, false)
      })

      this.tableData = allColumn;
      this.isTableLoading = false;
    },
    // 获取节点权限配置并初始化
    getNodeData(nodeId) {
      this.isTableLoading = true;
      return new Promise(resolve => {
        this.$axios.get('/api/rabbit-resource/selfDevForm/setRole', {
          params: {
            formId: this.formId,
            processNodeId: nodeId,
            processDefId: this.processDefinitionId,
          }
        }).then(res => {
          if (res.data.code !== 200) {
            this.$message.error('获取节点信息失败');
            return;
          }
          let {data} = res.data;
          // 判断获取到的数据如果为空就让按钮权限与流程权限里的按钮默认
          if (!data || data.length === 0) {
            const keys = Object.keys(this.hideColumn);
            keys.map(key => {
              this.hideColumn[key] = false;
              this.requiredColumn[key] = false;
              this.disabledColumn[key] = true;
            })
            this.isTableLoading = false;
            this.saveId = null;
            resolve()
            this.isRejectBtn = false;
            this.isRevokeBtn = false;
            this.isRevokeDraftBtn = true;
            // 判断是否是起草节点
            this.$axios.get("/api/rabbit-flow/process/queryDraftAnswers", {
              params: {
                processDefinitionId: this.processDefinitionId,
              }
            }).then(res => {
              if (res.data.id === nodeId) {
                //起草节点
                this.comment = DraftBtnPrmission.showCommentBtn;
                this.save = DraftBtnPrmission.showSaveBtn;
                this.submit = DraftBtnPrmission.showSubmitBtn;
                this.agree = DraftBtnPrmission.showAgreeBtn;
                this.disagree = DraftBtnPrmission.showDisagreeBtn;
                this.reject = DraftBtnPrmission.showRejectBtn;
                this.signBefore = DraftBtnPrmission.showSignBeforeBtn;
                this.signAfter = DraftBtnPrmission.showSignAfterBtn;
                this.copySend = DraftBtnPrmission.showCopySendBtn;
                this.transfer = DraftBtnPrmission.showTransferBtn;
              }
              if (res.data.id !== nodeId || this.isSubProcess) {
                //非起草节点，子流程的节点也属于非起草节点
                this.comment = DealPrmission.showCommentBtn;
                this.save = DealPrmission.showSaveBtn;
                this.submit = DealPrmission.showSubmitBtn;
                this.agree = DealPrmission.showAgreeBtn;
                this.disagree = DealPrmission.showDisagreeBtn;
                this.reject = DealPrmission.showRejectBtn;
                this.signBefore = DealPrmission.showSignBeforeBtn;
                this.signAfter = DealPrmission.showSignAfterBtn;
                this.copySend = DealPrmission.showCopySendBtn;
                this.transfer = DealPrmission.showTransferBtn;
              }
            })
            return;
          }
          data = data.pop();
          const map = {};
          // 初始化数据
          this.hideButton = !data.hideButton ? [] : data.hideButton.split(',')
          // 流程权限与按钮权限里的按钮双向数据绑定
          if (data.hideButton && data.hideButton.match('comment')) {
            this.comment = false;
          } else {
            this.comment = true;
          }
          if (data.hideButton && data.hideButton.match('save')) {
            this.save = false;
          } else {
            this.save = true;
          }
          if (data.hideButton && data.hideButton.match('submit')) {
            this.submit = false;
          } else {
            this.submit = true;
          }
          if (data.hideButton && data.hideButton.match('agree')) {
            this.agree = false;
          } else {
            this.agree = true;
          }
          if (data.hideButton && data.hideButton.match('disagree')) {
            this.disagree = false;
          } else {
            this.disagree = true;
          }
          if (data.hideButton && data.hideButton.match('reject')) {
            this.reject = false;
          } else {
            this.reject = true;
          }
          if (data.hideButton && data.hideButton.match('signBefore')) {
            this.signBefore = false;
          } else {
            this.signBefore = true;
          }
          if (data.hideButton && data.hideButton.match('signAfter')) {
            this.signAfter = false;
          } else {
            this.signAfter = true;
          }
          if (data.hideButton && data.hideButton.match('copySend')) {
            this.copySend = false;
          } else {
            this.copySend = true;
          }
          if (data.hideButton && data.hideButton.match('transfer')) {
            this.transfer = false;
          } else {
            this.transfer = true;
          }
          // 流程权限
          this.isReject = data.isReject;
          this.isRevoke = data.isRevoke;
          this.isRevokeDraft = data.isRevokeDraft;
          if (data.isReject === 0) {
            this.isRejectBtn = false;
          } else {
            this.isRejectBtn = true;
          }
          if (data.isRevoke === 0) {
            this.isRevokeBtn = true;
          } else {
            this.isRevokeBtn = false;
          }
          if (data.isRevokeDraft === 0) {
            this.isRevokeDraftBtn = true;
          } else {
            this.isRevokeDraftBtn = false;
          }

          if (data.hideColumns) {
            data.hideColumns.split(',').forEach((item) => {
              map[item] = map[item] | 1;
            })
          }
          if (data.requiredColumns) {
            data.requiredColumns.split(',').forEach((item) => {
              map[item] = map[item] | 2;
            })
          }
          if (data.disableColumns) {
            data.disableColumns.split(',').forEach((item) => {
              map[item] = map[item] | 4;
            })
          }

          const hideColumn = {}
          const disabledColumn = {}
          const requiredColumn = {}
          this.tableData.forEach(item => {
            const key = item.columnName;
            hideColumn[key] = Boolean(map[key] && map[key] & 1);
            requiredColumn[key] = Boolean(map[key] && map[key] & 2);
            disabledColumn[key] = Boolean(map[key] && map[key] & 4);
          })
          this.hideColumn = hideColumn;
          this.requiredColumn = requiredColumn;
          this.disabledColumn = disabledColumn;

          this.initialProcessId = data.processNodeId;
          this.saveId = data.id;
          this.$nextTick(() => {
            this.isTableLoading = false;
            resolve()
          })
        })
      })
    },
    // 获取所有流程节点
    getAllProcessNode() {
      return new Promise(resolve => {
        getAllProcessNode(this.processDefinitionId).then(res => {
          this.processInfoList = res.data.data;
          if (this.processInfoList.length > 0) {
            let parentProcessList = [];
            for (const processInfos of this.processInfoList) {
              for (const processInfo of processInfos) {
                this.processInfo.push(processInfo);
                if (processInfo.parentProcessList) {
                  parentProcessList.push(processInfo.parentProcessList)
                }
              }
            }
            // 父流程,只会有一个list
            for (const parentProcess of parentProcessList[0]) {
              this.parentProcessList.push(parentProcess);
            }
            // 初始选择流程
            this.initialProcessInfoId = this.processInfo[0].id;
            this.initialProcessInfo = this.processInfo[0];
            // 初始流程节点
            this.processNodeList = this.parentProcessList;
            this.initialProcessId = this.processNodeList[0].id;
            this.initialProcess = this.processNodeList[0];
          } else {
            this.$message.error('查询节点数据失败')
          }
          resolve()
        })
      })
    },
    // 保存权限配置
    onSave() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        target: "#avue-view",
      });
      if (!this.initialProcessId) {
        return;
      }

      const hideColumns = Object.keys(this.hideColumn).filter(key => {
        return this.hideColumn[key];
      })
      const requiredColumns = Object.keys(this.requiredColumn).filter(key => {
        return this.requiredColumn[key];
      })
      const disabledColumns = Object.keys(this.disabledColumn).filter(key => {
        return this.disabledColumn[key];
      });

      const params = {
        id: this.saveId,
        formId: this.formId,
        formName: this.formName,
        processDefId: this.processDefinitionId,
        processNodeId: this.initialProcessId,
        processNodeName: this.initialProcess.name,
        requiredColumns: requiredColumns.join(','),
        hideColumns: hideColumns.join(','),
        disableColumns: disabledColumns.join(','),
        hideButton: this.hideButton.join(','),
        isReject: this.isRejectBtn ? 1 : 0,
        isRevoke: this.isRevokeBtn ? 0 : 1,
        isRevokeDraft: this.isRevokeDraftBtn ? 0 : 1,
        otherColums: Object.keys(this.staticColumnList).join(',')
      }
      // 保存按钮接口
      this.$axios.post('/api/rabbit-resource/selfDevForm/setRole', params).then(res => {
        if (res.status === 200) {
          this.$message.success("保存成功");
          this.saveId = res.data.data.id;
        }

      }).finally(() => {
        loading.close()
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.container-wrapper {
  font-size: 14px;
  height: calc(100% - 40px);

  .container {
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;

    .el-icon-close {
      font-size: 25px;
      cursor: pointer;
    }
  }
}

.table-wrapper {
  flex: 1;
  height: 0;

  .el-col {
    height: 100%;
  }
}

//按钮权限
.Btn-permission {
  display: inline-block;
  cursor: pointer;
  width: 7rem;
  font-size: 16px;
  font-weight: 600;
  padding: 5px 10px;
  margin-bottom: 5px;
  position: relative;
}

.downBox {
  padding: 10px 0px;
  border: 1px solid #DCDFE6;
  animation-fill-mode: forwards;
  overflow: hidden;
  width: 66.5%;
  margin-bottom: 1rem;
  height: 6.8rem;
}

.downBox-box {
  justify-items: center;
  padding: 10px 5px;
  display: flex;

}

//流程权限
.processAuthority {
  border: 1px solid #DCDFE6;
  animation-fill-mode: forwards;
  overflow: hidden;
  width: 66.5%;
  padding-top: 8px;
  margin-bottom: 1rem;
}

.processBox {
  display: flex;
  padding: 10px 0px;
}

//下拉框动画效果
.downi180 {
  animation: downi180 .5s none 0s;
}

.downi0 {
  animation: downi0 .5s none 0s;
}

.downi {
  display: inline-block;
  animation-fill-mode: forwards;
  width: 10px;
  height: 10px;
  background-color: black;
  transform: rotate(45deg);
  position: absolute;
  margin-left: 5px;
  top: 30%;
}

.downi::after {
  display: block;
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: white;
  transform: rotate(90deg);
  top: -2px;
  left: -2px;
}

.processdownbox100 {
  animation: processdownbox100 .5s none 0s;
}

.processdownbox0 {
  animation: processdownbox0 .5s none 0s;
}

.downbox100 {
  animation: downbox100 .5s none 0s;
}

.downbox0 {
  animation: downbox0 1s none 0s;
}

@keyframes downi180 {
  0% {
    transform: rotate(45deg);
    top: 30%;
  }
  100% {
    transform: rotate(-135deg);
    top: 45%;
  }
}

@keyframes downi0 {
  0% {
    transform: rotate(-135deg);
    top: 45%;
  }
  100% {
    transform: rotate(45deg);
    top: 30%;
  }
}

@keyframes downbox100 {
  0% {
    height: 0%;
  }
  100% {
    height: 6.8rem;
  }
}

@keyframes downbox0 {
  0% {
    height: 6.8rem;
  }
  100% {
    height: 0%;
  }
}

@keyframes processdownbox100 {
  0% {
    height: 0;
  }
  100% {
    height: 5.8rem;
  }
}

@keyframes processdownbox0 {
  0% {
    height: 5.8rem;
  }
  100% {
    height: 0px;
  }

}
</style>


