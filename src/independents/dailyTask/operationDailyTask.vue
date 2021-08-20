<template>
  <div>
    <el-card class="box-card">
      <div class="details-title" v-if="!processInstanceId">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="handleProcess"
            v-if="processInfo.isCurrentNodeOperator === 'true'"
            >流程处理
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            v-if="!$route.query.id"
            >{{ form.id ? (listState ? "提交" : "编辑") : "新增" }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            class="el-icon-search"
            v-if="$route.query.id"
            @click.stop="record"
            >记录查询</el-button
          >
          <el-button
            type="primary"
            size="small"
            plain
            class="el-icon-video-pause"
            v-if="
              $route.query.id && form.wordOrderState !== 'order_state_suspend'
            "
            @click.stop="pause"
            >暂停</el-button
          >
          <el-button
            type="primary"
            size="small"
            plain
            class="el-icon-refresh"
            v-if="
              $route.query.id && form.wordOrderState === 'order_state_suspend'
            "
            @click.stop="restart"
            >重启</el-button
          >
          <el-button
            type="danger"
            size="small"
            plain
            class="el-icon-delete"
            v-if="$route.query.id"
            @click.stop="deletes"
            >删除</el-button
          >
          <!-- //!无导出 -->
        </div>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        style="margin-top: 10px"
      >
        <div class="form-box">
          <el-form-item label="标题" prop="title" style="width: 66.66%">
            <el-input
              :disabled="($route.query.id && !listState) || !!processInstanceId"
              v-model="form.title"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="工单编号" prop="workOrderNo">
            <el-input
              :disabled="($route.query.id && !listState) || !!processInstanceId"
              readonly
              v-model="form.workOrderNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属组织" prop="stationName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.stationName"
              placeholder="请选择"
              @focus="focusMainStation"
              ref="mainStation"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务区域" prop="taskAreaName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.taskAreaName"
              placeholder="请输入"
              @focus="focusArea"
              ref="area"
            ></el-input>
          </el-form-item>
          <el-form-item label="发起人" prop="initiatorName">
            <el-input
              v-model="form.initiatorName"
              :disabled="($route.query.id && !listState) || !!processInstanceId"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="发起时间" prop="launchTime">
            <el-input
              v-model="form.launchTime"
              readonly
              :disabled="($route.query.id && !listState) || !!processInstanceId"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务分类" prop="taskClassificationId">
            <el-select
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.taskClassificationId"
              clearable
              default-first-option
              placeholder="请选择"
              @change="changeTaskClass"
              value-key="id"
            >
              <el-option
                v-for="item in taskClassificationList"
                :key="item.id"
                :label="item.taskClassification"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务内容" prop="taskDefinitionId">
            <el-select
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.taskDefinitionId"
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in taskContentList"
                :key="item.id"
                :label="item.taskDefinition"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度" prop="urgentLevel">
            <el-select
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.urgentLevel"
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in urgencyOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务负责人" prop="taskLeaderName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.taskLeaderName"
              placeholder="请输入"
              ref="treeRef0"
              @focus="focusTree(0)"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务协助人" prop="taskHelperName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.taskHelperName"
              placeholder="请输入"
              ref="treeRef1"
              @focus="focusTree(1)"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务开始时间" prop="workStartTime">
            <!-- <el-date-picker
              disabled
              v-model="form.workStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
              @change="changeStartTime"
            >
            </el-date-picker> -->
            <el-input v-model="form.workStartTime" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="任务结束时间" prop="workEndTime">
            <el-input v-model="form.workEndTime" readonly disabled></el-input>
          </el-form-item>
          <el-form-item
            label="任务描述"
            prop="taskDescribe"
            style="width: 100%;"
          >
            <!-- :rules="
              form.taskDefinitionId !== 'other'
                ? [{ required: false }]
                : rules.taskDescribe
            " -->
            <el-input
              disabled
              type="textarea"
              v-model="form.taskDescribe"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="任务图片"
            prop="fileListByPicture"
            style="width: 100%;"
          >
            <el-upload
              disabled
              action="#"
              list-type="picture-card"
              :file-list="form.fileListByPicture"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleImgRemove"
              :on-change="handleChange"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="结果描述"
            prop="resultDescription"
            style="width: 100%;"
          >
            <!-- <el-input
              disabled
              type="textarea"
              v-model="form.resultDescription"
              placeholder="请输入"
            ></el-input> -->
            <div v-html="form.resultDescription"></div>
            <!-- style="padding: 10px;border: 1px solid #E4E7ED;border-radius: 4px;cursor:not-allowed;min-height: 60px;" -->
          </el-form-item>
          <el-form-item label="结果附件" prop="fileList" style="width: 100%;">
            <el-upload
              disabled
              action="#"
              :file-list="form.fileList"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChangeList"
            >
              <el-button size="small" disabled type="primary"
                >上传附件</el-button
              >
            </el-upload>
          </el-form-item>
          <el-form-item label="任务耗时" prop="workTime">
            <el-input v-model="form.workTime" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="任务结果" prop="taskResult">
            <el-select
              disabled
              v-model="form.taskResult"
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in taskResultsOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单状态" prop="wordOrderState">
            <el-select
              v-model="form.wordOrderState"
              disabled
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in orderStateOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <!-- 记录查询弹窗 -->
    <el-dialog
      title="记录查询"
      :visible.sync="recordVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'10vh'"
    >
      <el-table
        :data="recordForm.tableData"
        style="width: 100%"
        :max-height="530"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="taskTime" label="时间" align="center">
        </el-table-column>
        <el-table-column
          prop="operationType"
          label="类型"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="操作人"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="receptorName"
          label="接收人"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="说明"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 重启弹窗 -->
    <el-dialog
      title="重启"
      :visible.sync="restartVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'10vh'"
    >
      <el-form
        :model="restartForm"
        ref="restartForm"
        label-width="110px"
        style="display: flex;flex-wrap: wrap;"
      >
        <el-form-item label="所属组织" prop="stationName" style="width: 50%">
          <el-input v-model="restartForm.stationName" readonly></el-input>
        </el-form-item>
        <el-form-item label="工单编号" prop="workOrderNo" style="width: 50%">
          <el-input v-model="restartForm.workOrderNo" readonly></el-input>
        </el-form-item>
        <el-form-item
          label="任务分类"
          prop="taskClassificationName"
          style="width: 50%"
        >
          <el-input
            v-model="restartForm.taskClassificationName"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item
          label="任务内容"
          prop="taskDefinitionName"
          style="width: 50%"
        >
          <el-input
            v-model="restartForm.taskDefinitionName"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDescribe" style="width: 50%">
          <el-input v-model="restartForm.taskDescribe" readonly></el-input>
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgentLevel" style="width: 50%">
          <el-input v-model="restartForm.urgentLevel" readonly></el-input>
        </el-form-item>
        <el-form-item label="任务区域" prop="taskAreaName" style="width: 50%">
          <el-input v-model="restartForm.taskAreaName" readonly></el-input>
        </el-form-item>
        <el-form-item label="暂停时间" prop="updateTime" style="width: 50%">
          <el-input v-model="restartForm.updateTime" readonly></el-input>
        </el-form-item>
        <el-form-item label="重启时间" prop="restartTime" style="width: 50%">
          <el-input v-model="restartForm.restartTime" readonly></el-input>
        </el-form-item>
        <el-form-item
          label="情况说明"
          :rules="rules.remark"
          prop="remark"
          style="width: 100%"
        >
          <el-input type="textarea" v-model="restartForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button type="primary" @click="submitForm('restartForm')"
          >确认</el-button
        >
        <el-button @click="resetForm('restartForm')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 所属组织弹窗 -->
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'10vh'"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="stationDialogForm"
            :model="stationDialogForm"
            :inline="true"
            style="display: flex"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="stationDialogForm.mainStationIdList"
                style="width: 210px"
                multiple
                filterable
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in mainStationOptions"
                  :key="item.id"
                  :label="item.mainStationName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组织编码：">
              <el-input
                style="width: 210px"
                v-model="stationDialogForm.mainStationCode"
                placeholder="请输入"
                @keyup.enter.native="searchData"
              />
            </el-form-item>
            <el-form-item label="组织负责人：">
              <my-select
                :options="commonUserList"
                ref="selectRef"
                v-model="stationDialogForm.mainStationPersonUserIds"
                @visible-change="visibleChange"
                @input="handleInput"
                :optionProp="{ value: 'userId', label: 'userName' }"
              />
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table
            :data="stationDialogForm.tableData"
            style="width: 100%"
            :max-height="530"
          >
            <el-table-column type="index" label="" width="50" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="stationDialogForm.currentRowId"
                  :label="scope.row.mainStationId"
                  @change="changeRadio($event, scope.row)"
                  >{{ "" }}</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="mainStationName"
              label="所属组织"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mainStationCode"
              label="组织编码"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="mainStationPersonName"
              label="组织负责人"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="stationDialogForm.total"
              :page-size="stationDialogForm.pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="stationAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 选择负责人弹窗 -->
    <el-dialog
      title="选择负责人"
      :visible.sync="treeDialogVisible"
      v-if="treeDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Tree
          :data="treeData"
          :props="defaultProps"
          :showRight="true"
          :tableList="[]"
          :choice="choice"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择任务区域"
      :visible.sync="areaVisible"
      v-if="areaVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1050px"
      :top="'8vh'"
    >
      <Area
        ref="areaRef"
        :Single="false"
        :mainStationIdList="form.mainStationId ? [form.mainStationId] : []"
        :displayId="form.taskArea ? form.taskArea.split(',') : []"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="areaVisible = false">取 消</el-button>
        <el-button type="primary" @click="areaAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { tree } from "@/api/organization/allStation";
import { closeTagTo, closeTagBack } from "@/util/tags";
import {
  queryMainStationList,
  queryMainStationDropDownList
} from "@/api/organization/allStation";
import { queryTaskClassifications } from "@/api/backstage/taskClassification.js";
import { queryTaskDefinitions } from "@/api/backstage/taskContent.js";
import {
  addEverydayTask,
  queryEverydayTaskDetails,
  queryTaskOrder,
  delEverydayTask,
  taskStateTypeRecord,
  maintainFlowAble
} from "@/api/taskWorkOrder/dailyTask.js";
import { getFiles, editMaintain, processDetail } from "@/api/order/repairOrder";
import Tree from "@/components/organization/tree.vue";
import mySelect from "@/components/select/select.vue";
import Position from "@/components/dialog/postionDialogs.vue";
import Area from "@/components/dialog/areaDialog.vue";
import { userList } from "@/api/organization/staging";
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
// 流程节点
const processNode = {
  // 草稿
  draft: 0
};
export default {
  name: "newRepairOrder",
  components: { mySelect, Tree, Position, Area },
  props: {
    processInstanceId: {
      type: String,
      default: ""
    },
    processNodeId: {
      type: String,
      default: ""
    },
    comment: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    selectId: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      rules: {
        stationName: [
          { required: true, message: "请选择所属组织", trigger: "change" }
        ],
        taskClassificationId: [
          { required: true, message: "请选择任务分类", trigger: "change" }
        ],
        taskDefinitionId: [
          { required: true, message: "请选择任务内容", trigger: "change" }
        ],
        urgentLevel: [
          { required: true, message: "请选择紧急程度", trigger: "change" }
        ],
        taskAreaName: [
          { required: true, message: "请选择任务区域", trigger: "change" }
        ],
        // taskDescribe: [
        //   { required: true, message: "请输入任务描述", trigger: "blur" }
        // ],
        taskLeaderName: [
          { required: true, message: "请选择任务负责人", trigger: "change" }
        ],
        remark: [{ required: true, message: "请输入情况说明", trigger: "blur" }]
      },
      processInfo: {}, // 流程信息
      taskClassificationList: [],
      taskContentList: [],
      form: {
        stationCode: this.$store.getters.userInfo.mainStationCode, //电站简称
        stationName: this.$store.getters.userInfo.mainStationName, //电站名称
        title: "", //标题
        mainStationId: this.$store.getters.userInfo.mainStationId, //所属组织
        taskArea: "", // 任务区域id
        taskAreaName: "", // 任务区域名称
        workOrderNo: "", //工单编号
        taskClassificationId: "", //任务分类
        taskDefinitionId: "", //任务内容
        taskDescribe: "", //任务描述
        wordOrderState: "", //工单状态
        urgentLevel: "", //紧急程度
        workStartTime: "", //任务开始时间
        workEndTime: "", //任务结束时间
        taskLeader: "", //任务负责人
        taskLeaderName: "", // 任务负责人姓名
        launchTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"), //发起时间
        initiator: this.$store.getters.userInfo.user_id, //发起人
        initiatorName: this.$store.getters.userInfo.nick_name, //发起人姓名
        taskHelper: "", //任务协助人
        taskHelperName: "", //任务协助人姓名
        resultDescription: "", //结果描述
        taskResult: "", //任务结果
        fileList: [], // 附件
        fileListByPicture: [] // 图片
      },
      listState: false,

      recordVisible: false, // 记录查询弹窗
      recordForm: {
        tableData: []
      },
      restartVisible: false, // 重启弹窗
      restartForm: {},
      transferForm: {},
      focusMainDialogVisible: false, // 所属组织弹窗
      mainStationOptions: [],
      commonUserList: [],
      stationDialogForm: {
        //所属组织弹窗
        currentRowId: "",
        tableData: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        changedRadio: {},
        mainStationIdList: [],
        mainStationCode: "",
        mainStationPersonUserIds: []
      },
      treeDialogVisible: false, // 地址本弹窗
      treeData: [],
      choice: true,
      addData: "",
      treeNum: "",
      defaultProps: {
        children: "children",
        label: "title"
      },
      areaVisible: false, // 设备弹窗
      disabled: false, // 设备弹窗 - 组织，子期是否禁用
      dialogImageUrl: "", // 图片url
      dialogVisible: false, // 查看图片弹窗
      urgencyOptions: JSON.parse(localStorage.getItem("urgencyOptions")), // 紧急程度下拉
      orderStateOptions: JSON.parse(localStorage.getItem("orderStateOptions")), // 工单状态下拉
      taskResultsOptions: JSON.parse(
        localStorage.getItem("taskResultsOptions")
      ), // 任务结果下拉
      currentNode: processNode[this.$route.query.taskDefinitionKey]
    };
  },
  watch: {
    commonUserList(val) {
      if (val && val.length > 0) {
        val.forEach(ele => {
          ele.title = ele.userName;
        });
      }
    },
    selectId(val) {
      console.log(val);
    },
    desc(val) {
      console.log(val);
    }
  },
  filters: {
    filterOptions: function(value, optionList) {
      let str = optionList.find(res => {
        return res.dictKey == value;
      });
      if (str) {
        return str.dictValue;
      } else {
        return value;
      }
    }
  },
  mounted() {
    userList({ userName: "", inMyMainStation: 1 }).then(res => {
      this.commonUserList = res.data.data;
    });
    queryTaskClassifications({}).then(res => {
      this.taskClassificationList = res.data.data;
    });
    if (this.$route.query.id || this.processInstanceId) this.getDetail();
  },
  methods: {
    // 流程处理
    handleProcess() {
      let {
        taskId,
        taskDefinitionKey,
        processNodeName,
        processInstanceId,
        businessId,
        processDefinitionId
      } = this.processInfo;
      this.$router.push({
        path: `/work/process/handle`,
        query: {
          taskId,
          taskDefinitionKey,
          processNodeName,
          processInstanceId,
          businessId,
          processDefinitionId,
          fromView: "DEAL"
        }
      });
    },
    // 新建、提交
    compile() {
      if (this.form.id) {
        if (this.listState) {
          this.formValidate("add");
        } else {
          this.listState = !this.listState;
        }
      } else {
        this.formValidate("new");
      }
    },
    formValidate(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let compare = this.compare(
            this.form.taskLeader.split(","),
            this.form.taskHelper.split(",")
          );
          if (compare) {
            return this.$message.error("任务负责人,任务协助人不能兼任!");
          }
          if (data == "new") {
            let param = { ...this.form };
            param.taskClassificationId = param.taskClassificationId.id;
            if (param.fileList && param.fileList.length > 0) {
              param.fileList.forEach(ele => {
                ele.name = ele.fileName;
                delete ele.fileName;
              });
            }
            addEverydayTask(param).then(() => {
              this.$message.success("新建成功");
              this.$router.push({
                name: "日常任务",
                params: { refresh: true }
              });
            });
          } else {
            editMaintain(this.form).then(() => {
              this.$message.success("编辑成功");
              this.$router.push({
                name: "维修工单",
                params: { refresh: true }
              });
              this.listState = !this.listState;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 记录查询
    record() {
      this.recordVisible = true;
      queryTaskOrder({ id: this.form.id }).then(res => {
        this.$set(this.recordForm, "tableData", res.data.data);
      });
    },
    // 暂停
    pause() {
      const { id, taskLeader } = this.form;
      let param = { id, state: "task_state_pause", taskLeader };
      taskStateTypeRecord(param).then(() => {
        this.$message.success("暂停成功");
        this.getDetail();
      });
    },
    // 重启
    restart() {
      this.restartVisible = true;
      this.restartForm = { ...this.form };
      this.restartForm.restartTime = moment().format("yyyy-MM-DD HH:mm:ss");
      this.urgencyOptions.forEach(ele => {
        if (ele.dictKey === this.restartForm.urgentLevel) {
          this.restartForm.urgentLevel = ele.dictValue;
        }
      });
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        delEverydayTask({ ids: [this.form.id] }).then(() => {
          closeTagTo(this.$route.path, {
            name: "日常任务",
            params: { refresh: true }
          });
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { id, taskLeader, remark } = this.restartForm;
          let param = {
            id,
            state: "task_state_restart",
            taskLeader,
            remark
          };
          taskStateTypeRecord(param).then(() => {
            this.$message.success("重启成功");
            this.resetForm(formName);
            this.getDetail();
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.restartVisible = false;
    },
    // 获取计划详情信息
    getDetail() {
      queryEverydayTaskDetails({
        id: this.$route.query.id,
        processInstanceId: this.processInstanceId
      }).then(item => {
        if (item.data.data) {
          this.form = item.data.data;
          this.$set(this.form, "stationName", this.form.mainStationName); //所属组织名称
          this.$set(this.form, "stationCode", this.form.mainStationCode); //所属组织编码
          delete this.form.mainStationName;
          delete this.form.mainStationCode;
          this.taskClassificationList.forEach(ele => {
            if (ele.id === this.form.taskClassificationId) {
              this.form.taskClassificationId = ele;
              queryTaskDefinitions({
                taskClassificationCode: [ele.taskClassificationCode]
              }).then(res => {
                this.taskContentList = res.data.data;
                this.taskContentList.push({
                  id: "other",
                  taskDefinition: "其他"
                });
              });
            }
          });
          if (this.form.processInstanceId && !this.processInstanceId) {
            processDetail({
              processInstanceId: this.form.processInstanceId
            }).then(res => {
              this.processInfo = res.data.data;
            });
          }
        }
        getFiles({
          businessId: this.form.id,
          businessTypeList: ["everyday_task_img"]
        }).then(res => {
          this.$set(
            this.form,
            "fileListByPicture",
            res.data.data ? res.data.data : []
          );
          this.form.fileListByPicture.forEach(ele => {
            ele.url = this.imgUrl + ele.fileId;
          });
        });
        getFiles({
          businessId: this.form.id,
          businessTypeList: ["everyday_task_enclosure"]
        }).then(res => {
          this.$set(this.form, "fileList", res.data.data ? res.data.data : []);
          this.form.fileList.forEach((ele, index) => {
            ele.name =
              "日常任务附件" +
              (index + 1) +
              "." +
              ele.fileName.split(".")[ele.fileName.split(".").length - 1];
            ele.url = this.imgUrl + ele.fileId;
          });
        });
      });
    },
    // 组织列表
    async getQueryMainStationList(data) {
      await queryMainStationList(data).then(res => {
        this.$set(this.stationDialogForm, "tableData", res.data.data.pageData);
        this.$set(this.stationDialogForm, "pageNum", res.data.data.pageNum);
        this.$set(this.stationDialogForm, "pageSize", res.data.data.pageSize);
        this.$set(this.stationDialogForm, "total", res.data.data.total);
      });
    },
    //所属组织单选
    focusMainStation() {
      this.focusMainDialogVisible = true;
      this.$refs.mainStation.blur();
      this.getQueryMainStationList({
        pageNum: this.stationDialogForm.pageNum,
        pageSize: this.stationDialogForm.pageSize
      }).then(() => {
        this.$set(
          this.stationDialogForm,
          "currentRowId",
          this.form.mainStationId
        );
        this.stationDialogForm.tableData.forEach(ele => {
          if (ele.mainStationId === this.form.mainStationId) {
            this.changeRadio(true, ele);
          }
        });
      });
      queryMainStationDropDownList({ keyWord: "" }).then(res => {
        this.mainStationOptions = res.data.data;
      });
    },
    getUserList(data) {
      userList(data).then(res => {
        this.commonUserList = res.data.data ? res.data.data : [];
      });
    },
    handleInput(val) {
      if (val) {
        this.getUserList({
          userName: val,
          mainStationIdList: this.stationDialogForm.mainStationIdList,
          inMyMainStation: 0
        });
      } else {
        this.getUserList({
          mainStationIdList: this.stationDialogForm.mainStationIdList,
          inMyMainStation: 1
        });
      }
    },
    // 表格单选
    changeRadio(event, row) {
      this.$set(this.stationDialogForm, "changedRadio", row);
    },
    // 添加组织
    stationAdd() {
      let oldId = this.form.mainStationId;
      this.$set(
        this.form,
        "mainStationId",
        this.stationDialogForm.changedRadio.mainStationId
      ); //所属组织id
      this.$set(
        this.form,
        "stationName",
        this.stationDialogForm.changedRadio.mainStationName
      ); //所属组织名称
      this.$set(
        this.form,
        "stationCode",
        this.stationDialogForm.changedRadio.mainStationCode
      ); //所属组织编码
      this.cancel();
      if (oldId !== this.form.mainStationId) {
        this.form.taskArea = "";
        this.form.taskAreaName = "";
      }
    },
    //所属子期单选
    focusArea() {
      if (!this.form.mainStationId) {
        return this.$message.error("请先选择组织");
      }
      this.areaVisible = true;
      this.$refs.area.blur();
    },
    // 查询
    searchData() {
      this.getQueryMainStationList({
        mainStationIdList: this.stationDialogForm.mainStationIdList, //主站id list
        mainStationCode: this.stationDialogForm.mainStationCode, //组织编码
        mainStationPersonUserIds: this.stationDialogForm
          .mainStationPersonUserIds, //组织负责人
        pageNum: this.stationDialogForm.pageNum,
        pageSize: this.stationDialogForm.pageSize
      });
    },
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.stationDialogForm.pageNum = pageNum;

      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return (
        index +
        1 +
        (this.stationDialogForm.pageNum - 1) * this.stationDialogForm.pageSize
      );
    },
    // 每页条数
    handleSizeChange(val) {
      this.stationDialogForm.pageSize = val;

      this.searchData();
    },
    // 弹窗取消
    cancel() {
      this.$refs.selectRef.value = [];
      this.$refs.selectRef.searchText = "";
      this.handleInput();
      this.focusMainDialogVisible = false;
      this.stationDialogForm = {
        currentRowId: "",
        tableData: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        changedRadio: {},
        mainStationIdList: [],
        mainStationCode: "",
        mainStationPersonUserIds: []
      };
    },
    // 修改任务分类
    changeTaskClass(val) {
      this.form.taskDefinitionId = "";
      queryTaskDefinitions({
        taskClassificationCode: [val.taskClassificationCode]
      }).then(res => {
        this.taskContentList = res.data.data;
        this.taskContentList.push({ id: "other", taskDefinition: "其他" });
      });
    },
    // 修改任务开始时间
    changeStartTime(val) {
      if (val && new Date(val) < new Date(this.form.launchTime)) {
        this.form.workStartTime = "";
        return this.$message.error("任务开始时间不得早于工单发起时间");
      }
    },
    // 选择负责人数据
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    //负责人弹窗
    focusTree(num) {
      this.treeDialogVisible = true;
      this.treeNum = num;
      this.treeData = [];
      if (this.treeNum == 0) {
        this.$refs.treeRef0.blur();
        this.choice = true;
      }
      if (this.treeNum == 1) {
        this.$refs.treeRef1.blur();
        this.choice = false;
      }
      if (this.treeNum == 2) {
        this.$refs.treeRef2.blur();
        this.choice = true;
      }
      tree().then(res => {
        this.treeData = res.data.data;
      });
    },
    // 添加负责人
    treeAdd() {
      this.treeDialogVisible = false;
      if (this.treeNum == 0) {
        this.form.taskLeader = this.addData.id; //任务负责人ID
        this.form.taskLeaderName = this.addData.name; //任务负责人名称
      }
      if (this.treeNum == 1) {
        this.form.taskHelper = this.addData
          .map(v => {
            return v.id;
          })
          .join(","); //主要协助人ID
        this.form.taskHelperName = this.addData
          .map(v => {
            return v.name;
          })
          .join(","); //主要协助人姓名
      }
      if (this.treeNum == 2) {
        this.transferForm.taskLeader = this.addData.id; //任务负责人ID
        this.transferForm.taskLeaderName = this.addData.name; //任务负责人名称
      }
      this.addData = [];
    },
    // 判断任务负责人，主要/一般协助人是否重复
    compare(arr1, arr2) {
      let result = false;
      arr1.forEach(ele => {
        if (ele && arr2.indexOf(ele) != -1) {
          result = true;
        }
      });
      return result;
    },
    // 任务区域弹窗 - 添加
    areaAdd() {
      this.areaVisible = false;
      this.form.taskArea = this.$refs["areaRef"].chooseSelection
        .map(v => v.id)
        .join(",");
      this.form.taskAreaName = this.$refs["areaRef"].chooseSelection
        .map(v => v.areaName)
        .join(",");
    },
    // 上传任务图片
    handleChange(file, fileList) {
      imgUpload(file.raw).then(res => {
        let param = res.data.data;
        param.url = this.imgUrl + param.fileId;
        this.form.fileListByPicture.push(param);
      });
    },
    // 上传结果附件
    handleChangeList(file, fileList) {
      fileUpload(file.raw).then(res => {
        let param = res.data.data;
        param.fileName = param.name;
        param.name = param.originalName;
        this.form.fileList.push(param);
      });
    },
    // 图片删除
    handleImgRemove(file, fileList) {
      this.form.fileListByPicture.forEach((ele, index) => {
        if (ele.uid === file.uid) {
          this.form.fileListByPicture.splice(index, 1);
        }
      });
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 附件删除
    handleRemove(file, fileList) {
      this.form.fileList.forEach((ele, index) => {
        if (ele.uid === file.uid) {
          this.form.fileList.splice(index, 1);
        }
      });
    },
    // 附件
    handlePreview(file) {
      if (!this.form.processInstanceId) {
        return;
      }
      let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
      if (regular.test(file.name.split(".")[file.name.split(".").length - 1])) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      } else {
        fileDownload(file.fileId)
          .then(res => {
            const link = document.createElement("a");
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            console.log(res);
            link.download = file.name; //下载的文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(() => {
            this.$Notice.error({
              title: "错误",
              desc: "网络连接错误"
            });
          });
      }
    },
    // 流程节点
    beforeBtnClick(code) {
      console.log(code, this.selectId, this.desc);
      if (code === "agreeBtnCode") {
        let param = {
          processInstanceId: this.processInstanceId,
          taskId: this.$route.query.taskId,
          taskDefinitionKey: this.$route.query.taskDefinitionKey,
          comment: this.comment
        };
        Object.assign(param, this.form);
        maintainFlowAble(param).then(() => {
          this.$message.success("操作成功");
          closeTagBack(this.$route.path);
        });
      }
      // if (code === "transferBtnCode") {
      if (code === "copySendBtnCode") {
        console.log(this.selectId, this.desc);
        let param = {
          id: this.form.id,
          state: "task_state_transfer_of_order",
          taskLeader: this.selectId,
          remark: this.desc
        };
        taskStateTypeRecord(param).then(() => {
          this.$message.success("转单成功");
        });
      }
      if (code === "disagreeBtnCode") {
        // if (code === "disuseBtnCode") {
        let param = {
          id: this.form.id,
          state: "task_state_abandon"
        };
        taskStateTypeRecord(param).then(() => {
          this.$message.success("任务已废弃");
          closeTagBack(this.$route.path);
        });
      }
    },
    afterBtnClick(code) {
      console.log(code);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.is-disabled + .el-upload--picture-card {
  cursor: not-allowed;
  background: #f5f7fa;
}
/deep/.is-disabled + .el-upload--picture-card:hover {
  border-color: #c0ccda;
}
/deep/.el-upload-list__item {
  transition: none !important;
}
.box-card {
  // height: calc(100vh - 124px);
  overflow: auto;
  margin-bottom: 26px;
  /deep/.el-card__body {
    // height: 100%;
    .table {
      height: calc(100% - 260px);
      // border: 1px solid #d2d2d2;
      padding: 5px;
      .add-box {
        text-align: center;
        width: 100%;
        border: 1px solid #409eff;
        border-radius: 5px;
        color: #409eff;
        padding: 10px;
        font-size: 14px;
        cursor: pointer;
      }
      .el-table th {
        color: #666;
      }
      .el-table td .el-form-item {
        margin: 16px 0;
      }
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
}
.details-title {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #b3d8ff;
  .right {
    display: flex;
    justify-content: flex-end;
  }
}
.form-box {
  display: flex;
  flex-wrap: wrap;
  // margin-left: 20px;
  width: 100%;
  /deep/.el-form-item {
    display: flex;
    width: 33.33%;
    .el-form-item__label {
      padding: 10px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 130px;
      display: block;
      font-weight: bold;
    }
    .el-form-item__content {
      margin: 0 !important;
      margin-left: 10px !important;
      width: calc(100% - 160px);
      .el-cascader {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
        .el-range-separator {
          width: 7%;
        }
      }
      .el-textarea {
        width: 100%;
      }
    }
  }
  .title-text {
    color: rgb(96, 98, 102);
    line-height: 40px;
    width: 100%;
    text-align: left;
    padding: 10px 16px 15px;
    border-top: 1px solid #b3d8ff;
    font-size: 20px;
    font-weight: bold;
  }
}

.focus-main-dialogs {
  /deep/.el-tag.el-tag--info {
    max-width: 114px;
    overflow: hidden;
    position: relative;
    .el-select__tags-text {
      max-width: 84px;
      overflow: hidden;
      display: inline-block;
    }
    .el-tag__close {
      position: relative;
      top: -7px;
      right: 0;
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .dialog-content {
    .content-title {
      display: flex;
      /deep/.el-button--medium {
        padding: 13px 20px;
        margin-left: 30px;
      }
    }
    .content-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
    .content-table {
      /deep/.el-table {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th {
                color: #333;
                background-color: #fafafa;
              }
            }
          }
        }
      }
    }
  }
  .btnBox {
    display: flex;
    justify-content: center;
  }
}
</style>
