<template>
  <div class="backstage-index" style="position: relative">
    <el-card class="box-card">
      <el-form
        ref="form"
        :model="form"
        style="display: flex; flex-wrap: wrap; padding-right: 70px"
        label-width="120px"
      >
        <el-form-item label="所属子期" prop="subStationName">
          <el-input
            v-model="form.subStationName"
            placeholder="请选择"
            @focus="focusMainStation(0)"
          ></el-input>
        </el-form-item>
        <el-form-item label="方阵：">
          <el-input
            v-model="form.areaName"
            @focus="focusMainStation(2)"
            ref="mainStation2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备：">
          <el-input
            style="width: 217px"
            v-model="form.positionName"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="巡检类别：">
          <el-select
            style="width: 217px"
            v-model="form.checkItemType"
            multiple
            collapse-tags
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in checkCategoryOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派发状态">
          <el-select
            style="width: 217px"
            v-model="form.assignState"
            multiple
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in assignStateOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态：" v-show="open">
          <el-select
            style="width: 217px"
            v-model="form.exeState"
            multiple
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in exeStateOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检状态：" v-show="open">
          <el-select
            style="width: 217px"
            v-model="form.checkState"
            multiple
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in checkStateOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态：" v-show="open">
          <el-select
            style="width: 217px"
            v-model="form.taskState"
            multiple
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in taskStateOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间范围：" v-show="open">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际时间范围：" v-show="open">
          <el-date-picker
            v-model="value2"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <div class="title-btn">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="searchData"
            >查询</el-button
          >
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-refresh"
            @click="reset"
            >重置</el-button
          >
        </div>
      </el-form>
      <el-button
        style="position: absolute; right: 30px; top: 66px"
        type="primary"
        size="small"
        icon="el-icon-sort"
        @click="open = !open"
        >{{ open ? "收起" : "展开" }}</el-button
      >
      <!-- 表格 导出 -->
      <div class="content">
        <div class="content-title">
          <div class="left" ref="UI"></div>
          <div class="right" style="float: right">
            <el-button type="primary" size="small" plain @click="changeState(1)"
              >延期
            </el-button>
            <el-button type="primary" size="small" plain @click="changeState(2)"
              >取消
            </el-button>
            <el-button type="primary" size="small" plain @click="changeState(3)"
              >暂停
            </el-button>
            <el-button type="primary" size="small" plain @click="restart"
              >暂停重启
            </el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="multipleSelection.length == 0"
              plain
              @click="distribution"
              >手动派发
            </el-button>
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="handleExport"
              >导出
            </el-button>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :max-height="625"
          @row-click="details"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            type="index"
            width="55"
            align="center"
            label="序号"
          />
          <el-table-column label="设备" prop="positionName" align="center">
          </el-table-column>
          <el-table-column label="巡检类型" prop="" align="center">
            <template slot-scope="scope">
              {{
                scope.row.checkItemType | filterOptions(checkCategoryOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="计划开始时间"
            width="110"
            prop="startTime"
            align="center"
          />
          <el-table-column
            label="计划结束时间"
            width="110"
            prop="endTime"
            align="center"
          />
          <el-table-column
            label="实际开始时间"
            prop="realStartTime"
            width="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="实际结束时间"
            width="110"
            prop="realEndTime"
            align="center"
          >
          </el-table-column>
          <el-table-column label="巡检耗时" prop="" align="center">
            <template slot-scope="scope">
              {{ getTime(scope.row.realEndTime, scope.row.realStartTime) }}
            </template>
          </el-table-column>
          <el-table-column label="巡检结果" prop="checkResult" align="center">
            <template slot-scope="scope">
              {{ scope.row.checkResult | filterOptions(checkResultOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="任务状态" prop="taskState" align="center">
            <template slot-scope="scope">
              {{ scope.row.taskState | filterOptions(taskStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            label="派发人员"
            prop="delegateUseNames"
            align="center"
          >
            <template slot-scope="scope">
              {{
                scope.row.delegateUseNames == null
                  ? ""
                  : scope.row.delegateUseNames.toString()
              }}
            </template>
          </el-table-column>
          <el-table-column label="巡检人员" prop="exeUseNames" align="center">
            <template slot-scope="scope">
              {{
                scope.row.exeUseNames == null
                  ? ""
                  : scope.row.exeUseNames.toString()
              }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          layout="total,sizes,prev,pager,next"
          @size-change="handleSizeChange"
          :total="total"
          :page-size="pageSize"
          background
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 子期弹窗 -->
    <el-dialog
      title="选择所属子期"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title" style="display: flex">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform.companyList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChanges"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子期编码">
              <el-input
                v-model="dialogform.subStationCode"
                placeholder="请输入内容"
                @keyup.enter.native="searchDatas"
              ></el-input>
            </el-form-item>
            <el-form-item label="子期负责人：">
              <el-input
                placeholder="请输入"
                @keyup.enter.native="searchDatas"
                v-model="dialogform.subStationPersonName"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchDatas"
              style="margin-left: 15px"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table
            :data="tableDatas"
            style="width: 100%"
            @selection-change="handleSelectionChanges"
          >
            <el-table-column
              type="selection"
              label=""
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationCode"
              label="子期编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationPersonName"
              label="负责人"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChanges"
              :total="totals"
              :page-size="pageSizes"
              background
              @current-change="handlePageChanges"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 方阵弹窗 -->
    <el-dialog
      title="选择方阵"
      :visible.sync="focusMainDialogVisible2"
      append-to-body
      class="focus-main-dialog"
      width="1000px"
    >
      <div class="dialog-content">
        <div class="content-title" style="display: flex">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex; flex-wrap: wrap"
          >
            <el-form-item label="方阵名称：">
              <el-input
                v-model="dialogform.areaName"
                placeholder="请输入内容"
                @keyup.enter.native="searchDatax"
              ></el-input>
            </el-form-item>
            <el-form-item label="方阵编码">
              <el-input
                v-model="dialogform.areaCode"
                placeholder="请输入内容"
                @keyup.enter.native="searchDatax"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchDatax"
              style="margin-left: 200px"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table
            :data="tableDatax"
            style="width: 100%"
            @selection-change="handleSelectionChangex"
          >
            <el-table-column
              type="selection"
              label=""
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="方阵名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="areaCode"
              label="方阵编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChangex"
              :total="totalx"
              :page-size="pageSizex"
              background
              @current-change="handlePageChangex"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="principalAddx">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 暂停重启弹窗 -->
    <el-dialog
      title="暂停重启"
      :visible.sync="restartVisible"
      append-to-body
      class="focus-main-dialog"
      width="700px"
    >
      <el-form
        ref="forms"
        :model="forms"
        :rules="rules"
        label-width="110px"
        label-position="right"
      >
        <el-form-item label="标题:">
          <el-input v-model="title" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请编号:">
          <el-input disabled></el-input>
        </el-form-item>
        <el-form-item label="设备位置编码:">
          <el-input v-model="forms.positionId" disabled></el-input>
        </el-form-item>
        <el-form-item label="重启设备:">
          <el-input v-model="forms.name" disabled></el-input>
        </el-form-item>
        <div style="display: flex">
          <el-form-item
            label="计划开始时间:"
            label-width="110px"
            prop="starTime"
          >
            <el-date-picker
              v-model="forms.starTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="计划结束时间:"
            label-width="110px"
            prop="endTime"
          >
            <el-date-picker
              v-model="forms.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="forms.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="restartVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureRestartVisible">确定</el-button>
      </span>
    </el-dialog>
    <!-- 延期、取消、暂停 -->
    <el-dialog
      :title="titles"
      :visible.sync="changerestartVisible"
      append-to-body
      class="focus-main-dialog"
      width="640px"
    >
      <el-form
        ref="forms"
        :model="forms"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="标题:">
          <el-input v-model="title" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请编号:">
          <el-input disabled></el-input>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="所属组织" prop="mainStationId">
            <el-select
              v-model="mainStationId"
              filterable
              allow-create
              collapse-tags
              disabled
              default-first-option
              placeholder="请选择"
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
          <el-form-item label="任务状态：" prop="taskStates">
            <el-select
              style="width: 200px"
              v-model="forms.taskStates"
              @change="changeTask(forms.taskStates)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in taskStateOptions.slice(
                  0,
                  taskStateOptions.length - 1
                )"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="设备位置编码:">
          <el-input v-model="forms.positionId" disabled></el-input>
        </el-form-item>
        <el-form-item
          :label="
            titles == '延期' ? '延期时间' : titles == '取消' ? '废弃时间' : ''
          "
          v-if="!(titles == '暂停')"
          prop="delayTime"
        >
          <el-date-picker
            v-model="forms.delayTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="原因:" prop="reason">
          <el-input type="textarea" v-model="forms.reason"></el-input>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="创建人:">
            <el-input style="width: 200px" disabled></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-input style="width: 200px" disabled></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changerestartVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </span>
    </el-dialog>
    <!-- 手动派发的弹窗 -->
    <el-dialog
      title="选择负责人"
      :visible.sync="focusMainDialogVisiblePerson"
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
          :choice="false"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisiblePerson = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="principalAddson">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { tree } from "@/api/organization/allStation";
import {
  queryChecktaskDetailList,
  exportTaskDetailList,
  distribute,
  checkApply,
  restartApply,
} from "@/api/taskManagement/patrolTask";
import { getSelected } from "@/util/util.js";
import { queryList } from "@/api/device/matrix";
import { querySubStationList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import Tree from "@/components/organization/tree";
export default {
  name: "patrolTask",
  components: { Tree },
  props: {
    title: String,
    mainStationId: String,
  },
  data() {
    return {
      forms: {
        name: [],
        starTime: "",
        endTime: "",
        positionId: [],
        taskStates: "",
        delayTime: "",
        reason: "",
        desc: "",
      },
      titles: "",
      mainStationOptions: [],
      focusMainDialogVisiblePerson: false,
      changerestartVisible: false,
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      checkStateOptions: JSON.parse(
        window.localStorage.getItem("checkStateOptions")
      ),
      exeStateOptions: JSON.parse(
        window.localStorage.getItem("exeStateOptions")
      ),
      taskStateOptions: JSON.parse(
        window.localStorage.getItem("taskStateOptions")
      ),
      checkResultOptions: JSON.parse(
        window.localStorage.getItem("checkResultOptions")
      ),
      assignStateOptions: JSON.parse(
        window.localStorage.getItem("assignStateOptions")
      ),
      checkCategoryOptions: JSON.parse(
        window.localStorage.getItem("checkCategoryOptions")
      ),
      time: "",
      restartVisible: false,
      focusMainDialogVisible: false,
      focusMainDialogVisible2: false,
      principaNum: "",
      changeRediod: [],
      dialogform: {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
      open: false,
      orderColumn: "",
      orderType: "",
      value: [],
      value1: [],
      value2: [],
      tableData: [],
      tableDatas: [],
      tableDatax: [],
      planTypeList: [],
      options: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      planStateList: {
        draft: "草稿",
        audit: "审批中",
        published: "已发布",
        abandoned: "废弃",
      },
      form: {
        mainStationIdList: [],
        positionName: "",
      },
      areaName: "",
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      total: 0,
      pageNum: 1,
      pageSize: 10,
      totals: 0,
      pageNums: 1,
      pageSizes: 10,
      totalx: 0,
      pageNumx: 1,
      pageSizex: 10,
      getPerson: [],
      treeData: [],
      addData: [],
      taskList: [],
      rules: {
        taskStates: [
          {
            required: true,
            message: "请选择任务状态",
            trigger: ["blur", "change"],
          },
        ],
        delayTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["blur", "change"],
          },
        ],
        starTime: [
          {
            required: true,
            message: "请选择计划开始时间",
            trigger: ["blur", "change"],
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择计划结束时间",
            trigger: ["blur", "change"],
          },
        ],
        reason: [
          {
            required: true,
            message: "请填写原因",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.reset();
    this.planTypeList = JSON.parse(localStorage.getItem("planTypeOptions"));
  },
  activated() {
    this.reset();
  },
  filters: {
    filterOptions: function (value, optionList) {
      let str = optionList.find((res) => {
        return res.dictKey == value;
      });
      if (str) {
        return str.dictValue;
      } else {
        return value;
      }
    },
  },
  methods: {
    changeTask(value) {
      this.titles =
        value == "task_state_delay"
          ? "延期"
          : value == "task_state_cancel"
          ? "取消"
          : "暂停";
    },
    // 延期、暂停、取消
    changeState(num) {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.forms.taskStates = "";
      this.forms.reason = "";
      this.forms.delayTime = "";
      this.changerestartVisible = true;
      if (this.forms.taskStates) {
        this.titles =
          this.forms.taskStates == "task_state_delay"
            ? "延期"
            : this.forms.taskStates == "task_state_cancel"
            ? "取消"
            : "暂停";
      } else {
        if (num == 1) {
          this.titles = "延期";
          //延期
        } else if (num == 2) {
          //取消
          this.titles = "取消";
        } else {
          //暂停
          this.titles = "暂停";
        }
      }
    },
    restart() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.forms.starTime = "";
      this.forms.endTime = "";
      this.forms.desc = "";
      this.restartVisible = true;
    },
    sureRestartVisible() {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          if (
            this.taskList.indexOf("task_state_cancel") >= 0 ||
            this.taskList.indexOf("task_state_delay") >= 0 ||
            this.taskList.indexOf("task_state_normal") >= 0
          ) {
            return this.$message.error(
              "任务状态为延期、正常或取消的，不能重启!"
            );
          }
          this.restartVisible = false;
          let addCheckPlanApplyDetailRequestList = [];
          this.getPerson.forEach((item) => {
            console.log(item);
            addCheckPlanApplyDetailRequestList.push({
              positionId: item.positionId,
              checkTaskDetailId: item.id,
              mainStationId: item.mainStationId,
              subStationI: item.subStationI,
            });
          });
          let obj = {
            title: this.title, // 标题,
            checkTaskMainId: this.$route.query.id, // xye_check_plan_main 表主键
            mainStationId: this.mainStationId, // 所属总站
            applyNo: "", // 申请编号
            taskStatus: "task_state_normal", //任务状态  (字典)
            startTime: this.forms.starTime, //,
            endTime: this.forms.endTime,
            positionIds: this.forms.positionId.toString(), //设备位置id
            reason: this.forms.desc, //原因,
            addCheckPlanApplyDetailRequestList:
              addCheckPlanApplyDetailRequestList,
          };
          restartApply(obj).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                message: "成功!",
                type: "success",
              });
              this.reset();
            } else {
              this.$message.error("失败!");
              this.reset();
            }
          });
          // restartApply
        }
      });
    },
    sure() {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          if (this.forms.taskStates == "task_state_delay") {
            //延期  取消的不能选
            if (this.taskList.indexOf("task_state_cancel") >= 0) {
              return this.$message.error("任务状态为取消的，不能在延期!");
            }
          }
          if (this.forms.taskStates == "task_state_cancel") {
            //取消
            if (this.taskList.indexOf("task_state_cancel") >= 0) {
              return this.$message.error("任务状态为取消的，不能在取消!");
            }
          }
          if (this.forms.taskStates == "task_state_suspend") {
            this.forms.delayTime = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
            //暂停
            if (
              this.taskList.indexOf("task_state_cancel") >= 0 ||
              this.taskList.indexOf("task_state_suspend") >= 0
            ) {
              return this.$message.error("任务状态为暂停或取消的，不能在暂停!");
            }
          }
          this.changerestartVisible = false;
          let addCheckPlanApplyDetailRequestList = [];
          let taskStates=[];
          this.getPerson.forEach((item) => {
            console.log(item);
            taskStates.push(item.taskState)
            addCheckPlanApplyDetailRequestList.push({
              positionId: item.positionId,
              checkTaskDetailId: item.id,
              mainStationId: item.mainStationId,
              subStationI: item.subStationI,
            });
          });
          let obj = {
            title: this.title, // 标题,
            checkTaskMainId: this.$route.query.id, // xye_check_plan_main 表主键
            mainStationId: this.mainStationId, // 所属总站
            applyNo: "", // 申请编号
            taskStatus:[...new Set(taskStates)].toString(),
            updateStatus: this.forms.taskStates, //任务状态  (字典)
            delayTime: this.forms.delayTime, //延期时间,
            positionIds: this.forms.positionId.toString(), //设备位置id
            reason: this.forms.reason, //原因,
            addCheckPlanApplyDetailRequestList:
              addCheckPlanApplyDetailRequestList,
          };
          checkApply(obj).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                message: "成功!",
                type: "success",
              });
              this.reset();
            } else {
              this.$message.error("失败!");
              this.reset();
            }
          });
        }
      });
    },
    // 手动派发
    distribution() {
      let arr = [];
      this.getPerson.forEach((v) => {
        if (v.checkState == "check_state_end") arr.push(v.positionName);
      });
      if (arr.length > 0)
        return this.$message.warning(
          "勾选的设备：" + arr.toString() + "    已巡检,请重新勾选!"
        );
      this.treeData = [];
      // this.$refs.mainStation0.blur();
      this.focusMainDialogVisiblePerson = true;
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    principalAddson() {
      this.focusMainDialogVisiblePerson = false;
      let personId = [];
      this.addData.forEach((v) => {
        personId.push(v.id);
      });
      let obj = [];
      this.getPerson.forEach((v) => {
        obj.push({
          mainStationId: v.mainStationId, //所属总站
          subStationId: v.subStationId, //所属子站
          checkTaskMainId: v.checkTaskMainId,
          checkTaskDetailId: v.id,
          useIds: personId, //用户IDs
        });
      });
      distribute(obj).then((res) => {
        console.log(res, "派发结果");
        if (res.data.code == 200) {
          this.$message({
            message: "派发成功!",
            type: "success",
          });
        }
      });
      this.addData = [];
      this.reset();
    },
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    getTime(time1, time2) {
      time1 = new Date(time1);
      time2 = new Date(time2);
      var runTime = ((time1.getTime() - time2.getTime()) / 1000 / 60).toFixed(
        3
      );
      return runTime;
    },
    //弹窗
    focusMainStation(num) {
      this.principaNum = num;
      this.pageNums = 1;
      this.pageSizes = 10;
      this.pageNumx = 1;
      this.pageSizex = 10;
      this.tableDatas = [];
      this.tableDatax = [];
      this.dialogform = [];
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = true;
        // this.$refs.mainStation0.blur();
        this.getQuerySubStationList({
          pageNum: 1,
          pageSize: 10,
        });
      }
      if (this.principaNum == 2) {
        this.focusMainDialogVisible2 = true;
        this.$refs.mainStation2.blur();
        this.getqueryLists({
          pageNumx: 1,
          pageSizex: 10,
        });
      }
    },
    searchDatax() {
      this.getqueryList({
        areaName: this.dialogform.areaName,
        areaCode: this.dialogform.areaCode,
        pageNum: this.pageNumx,
        pageSize: this.pageSizex,
      });
    },
    // 查询方阵
    getqueryLists(data) {
      queryList(data).then((res) => {
        console.log(res.data.data);
        this.tableDatax = res.data.data.pageData;
        this.pageNumx = res.data.data.pageNum;
        this.pageSizex = res.data.data.pageSize;
        this.totalx = res.data.data.total;
      });
    },

    //方阵添加
    principalAddx() {
      if (this.principaNum == 2) {
        this.focusMainDialogVisible2 = false;
        this.form.areaName = this.areaName.toString();
        this.form.areaNameList = this.form.areaCode;
      }
    },
    //方阵-勾选
    handleSelectionChangex(val) {
      let arr = [];
      let codeArr = [];
      val.forEach((v) => {
        arr.push(v.areaName);
        codeArr.push(v.areaCode);
      });
      this.areaName = arr;
      this.form.areaCode = codeArr;
    },
    //子期-勾选
    handleSelectionChanges(val) {
      let arr = [];
      let codeArr = [];
      val.forEach((v) => {
        arr.push(v.subStationName);
        codeArr.push(v.subStationCode);
      });
      this.changeRediod = arr;
      this.form.subStationCode = codeArr;
    },
    // 查询-子站
    searchDatas() {
      if (this.principaNum == 0) {
        this.getQuerySubStationList({
          companyList: this.dialogform.companyList,
          subStationCode: this.dialogform.subStationCode,
          subStationPersonName: this.dialogform.subStationPersonName,
          pageNum: this.pageNums,
          pageSize: this.pageSizes,
        });
      }
    },
    // 子期-添加
    principalAdd() {
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = false;
        this.form.subStationName = this.changeRediod.toString();
        this.form.subStationIdList = this.form.subStationCode;
      }
    },
    // 子站列表
    getQuerySubStationList(data) {
      querySubStationList(data).then((res) => {
        this.tableDatas = res.data.data.pageData;
        this.pageNums = res.data.data.pageNum;
        this.pageSizes = res.data.data.pageSize;
        this.totals = res.data.data.total;
      });
    },
    // 获取任务清单列表
    getQueryList(data) {
      queryChecktaskDetailList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        let arr = [];
        res.data.data.pageData.forEach((v) => {
          arr.push(v.exeUseNames);
        });
        this.$emit("func", [...new Set(arr.toString().split(","))].toString());
      });
    },
    handleSelectionChange(val) {
      this.getPerson = val;
      console.log(this.getPerson);
      this.multipleSelection = [];
      this.forms.positionId = [];
      this.taskList = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
        this.forms.positionId.push(item.positionId);
        this.taskList.push(item.taskState);
        this.forms.name.push(item.positionName);
      });
    },
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    visibleChanges(val) {
      if (!val) {
        this.searchDatas();
      }
    },
    // 查询-任务清单
    searchData() {
      // console.log(this.$route.query.id,'///////');
      this.getQueryList({
        checkTaskMainId: this.$route.query.id, //任务主ID
        subStationIdList: this.form.subStationIdList, //所属子站
        areaNameList: this.form.areaNameList, //方阵
        positionName: this.form.positionName, //设备
        checkItemTypeList: this.form.checkItemType, //巡检类别
        assignStateList: this.form.assignState, //派发状态
        exeStateList: this.form.exeState, //执行状态
        checkStateList: this.form.checkState, //巡检状态
        taskStateList: this.form.taskState, //任务状态
        startTime: this.value1 == null ? "" : this.value1[0],
        endTime: this.value1 == null ? "" : this.value1[1],
        realStartTime: this.value2 == null ? "" : this.value2[0],
        realEndTime: this.value2 == null ? "" : this.value2[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.subStationName = "";
      this.changeRediod = [];
      this.form.areaName = "";
      this.areaName = [];
      this.form.subStationIdList = [];
      this.form.areaNameList = [];
      this.form.positionName = "";
      this.form.checkItemType = [];
      this.form.assignState = [];
      this.form.exeState = [];
      this.form.checkState = [];
      this.form.taskState = [];
      this.value1 = [];
      this.value2 = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./add" });
    },
    // 导出
    handleExport() {
      exportTaskDetailList({
        checkTaskMainId: this.id, //任务主ID
        subStationIdList: this.form.subStationIdList, //所属子站
        areaNameList: this.form.areaNameList, //方阵
        positionName: this.form.positionName, //设备
        checkItemType: this.form.checkItemType, //巡检类别
        assignState: this.form.assignState, //派发状态
        exeState: this.form.exeState, //执行状态
        checkState: this.form.checkState, //巡检状态
        taskState: this.form.taskState, //任务状态
        startTime: this.value1 == null ? "" : this.value1[0],
        endTime: this.value1 == null ? "" : this.value1[1],
        realStartTime: this.value2 == null ? "" : this.value2[0],
        realEndTime: this.value2 == null ? "" : this.value2[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          console.log(res);
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "巡检任务清单.xls"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(() => {
          this.$Notice.error({
            title: "错误",
            desc: "网络连接错误",
          });
        });
    },
    planTypeFormatter(row) {
      let result = row.planType;
      this.planTypeList.map((v) => {
        if (v.dictKey === row.planType) {
          result = v.dictValue;
        }
      });
      return result;
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    handlePageChanges(pageNum) {
      this.pageNums = pageNum;
      this.searchDatas();
    },
    handlePageChangex(pageNum) {
      this.pageNumx = pageNum;
      this.searchDatax();
    },
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : !this.sort1
          ? (this.sort1 = !this.sort1)
          : (this.sort1 = "no");
        this.orderColumn = "mainStation";
        this.orderType = this.sort1 === "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      if (num == 1) {
        this.sort1 = "no";
        this.sort2 == "no"
          ? (this.sort2 = false)
          : !this.sort2
          ? (this.sort2 = !this.sort2)
          : (this.sort2 = "no");
        this.orderColumn = "createTime";
        this.orderType = this.sort2 === "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 详情
    details(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      console.log(row, "任务清单详情");
      this.$router.push({
        path: "./detailPatrolTaskList",
        query: {
          id: row.id,
        },
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    handleSizeChanges(val) {
      this.pageSizes = val;
      this.searchDatas();
    },
    handleSizeChangex(val) {
      this.pageSizex = val;
      this.searchDatax();
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.open {
  position: absolute;
  right: 4%;
  top: 10%;
}
.backstage-index {
  .box-card {
    overflow: auto;
  }
  /deep/.el-form {
    display: flex;
    .el-form-item {
      margin-right: 20px;
    }
  }
  .title-btn {
    margin-left: 50px;
    margin-bottom: 20px;
  }
  .content {
    .content-title {
      width: 100%;
      justify-content: space-between;
      /* 定义变量 */
      --color: "";
      .left {
        /deep/.el-button--primary.is-plain:focus,
        .el-button--primary.is-plain:hover {
          color: var(--color);
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
    }
  }
  /deep/.el-table th {
    color: #333;
  }
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    // height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }
  .sort-caret.ascending {
    border-bottom-color: #c0c4cc;
    top: -12px;
  }
  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;
  }
  .descending .sort-caret.descending {
    border-top-color: #409eff;
  }
  .sort-caret.descending {
    border-top-color: #c0c4cc;
    // bottom: 7px;
  }
  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;
  }
}
</style>
