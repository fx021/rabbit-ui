<template>
  <div class="alarm-management">
    <el-card class="box-card">
      <div class="order-state">
        <div class="time">时间：{{ nowTime }}</div>
        <div class="state">
          <span>待处理：</span>
          <span>{{ stateInfo["待处理"] }}条</span>
          <span>处理中：</span>
          <span>{{ stateInfo["处理中"] }}条</span>
        </div>
      </div>
      <div class="title-content" style="display: flex">
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
          style="padding-right: 70px"
        >
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationIdList"
              multiple
              filterable
              allow-create
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
          <el-form-item label="所属子期：">
            <el-select
              v-model="form.subStationIdList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in subStationOptions"
                :key="item.subStationId"
                :label="item.subStationName"
                :value="item.subStationId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警类别：">
            <el-select
              v-model="form.alarmCategory"
              filterable
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in alarmCategoryOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警时间范围：" prop="type">
            <el-select
              v-model="form.type"
              filterable
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in frequencyOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警时间：" v-if="form.type == '6' && !open">
            <el-date-picker
              v-model="value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
              alue-format="yyyy-MM-dd HH:mm"
              style="width: 585px"
              @change="datetimerange"
            >
            </el-date-picker>
          </el-form-item>
          <template v-if="open">
            <el-form-item label="设备名称：" prop="positionName">
              <el-input
                v-model="form.positionName"
                style="width: 217px"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备编码：" prop="positionCode">
              <el-input
                v-model="form.positionCode"
                style="width: 217px"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警时间：" v-if="form.type == '6'">
              <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm"
                alue-format="yyyy-MM-dd HH:mm"
                style="width: 585px"
                @change="datetimerange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="设备类型：" prop="equipmentTypeList">
              <el-select
                v-model="form.equipmentTypeList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in equipmentTypeOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警类型：" prop="warningTypeList">
              <el-select
                v-model="form.warningTypeList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in warningTypeOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警级别：" prop="warningLevelList">
              <el-select
                v-model="form.warningLevelList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in warningLevelOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警状态：" prop="alarmStateList">
              <el-select
                v-model="form.alarmStateList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in alarmStateOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源：" prop="dataSources">
              <el-select
                v-model="form.dataSources"
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in dataSourceOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
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
      </div>
      <div class="content">
        <div class="content-title">
          <!-- v-if="permission.user_delete" -->
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort(0)"
              >所属组织<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort1 == 'no' ? '' : sort1 ? '' : colorName,
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort1 == 'no' ? '' : sort1 ? colorName : '',
                  }"
                ></i
              ></span>
            </el-button>
            <el-button type="primary" size="small" plain @click="sort(1)"
              >开始时间<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort2 == 'no' ? '' : sort2 ? '' : colorName,
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort2 == 'no' ? '' : sort2 ? colorName : '',
                  }"
                ></i
              ></span>
            </el-button>
            <el-button type="primary" size="small" plain @click="sort(2)"
              >最新告警时间<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort3 == 'no' ? '' : sort3 ? '' : '#409eff',
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort3 == 'no' ? '' : sort3 ? '#409eff' : '',
                  }"
                ></i
              ></span>
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-refresh"
              @click="reset"
              plain
              >刷新</el-button
            >
          </div>
          <div class="right">
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-edit"
              @click="alarmHandling"
              >告警处理
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              class="el-icon-delete"
              @click.stop="deletes"
              >批量删除</el-button
            >
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
          @row-click="details"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center" :index="indexMethod">
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="所属子期"
            prop="subStationName"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="alarmCategory"
            label="告警类别"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.alarmCategory | filterOptions(alarmCategoryOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="告警开始时间"
            align="center"
            show-overflow-tooltip
            width="104"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="告警结束时间"
            align="center"
            show-overflow-tooltip
            width="104"
          >
          </el-table-column>
          <el-table-column
            prop="newTime"
            label="最新告警时间"
            align="center"
            show-overflow-tooltip
            width="104"
          >
          </el-table-column>
          <el-table-column
            prop="count"
            label="累计告警数量"
            align="center"
            show-overflow-tooltip
            width="104"
          >
          </el-table-column>
          <el-table-column
            prop="positionName"
            label="设备名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="positionCode"
            label="设备编码"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentType"
            label="设备类型"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="warningTypeList"
            label="告警类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.warningTypeList | filterOptions(warningTypeOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="maxWarningLevel"
            label="最高告警级别"
            align="center"
            show-overflow-tooltip
            width="104"
          >
            <template slot-scope="scope">
              {{
                scope.row.maxWarningLevel | filterOptions(warningLevelOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="maxAlarmInformation"
            label="最高告警信息"
            align="center"
            show-overflow-tooltip
            width="104"
          >
          </el-table-column>
          <el-table-column
            prop="alarmStateList"
            label="告警状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.alarmStateList | filterOptions(alarmStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dataSources"
            label="数据来源"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.dataSources | filterOptions(dataSourceOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="alarmOrderNo"
            label="告警单号"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.alarmOrderNo | filterOptions(dataSourceOptions) }}
            </template> -->
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="pageSize"
          background
          :current-page.sync="current"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
      <el-backtop target=".box-card" :isibility-height="100">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          style="font-size: 24px; padding: 6px; transform: rotate(180deg)"
        ></el-button>
      </el-backtop>
    </el-card>
    <el-dialog
      title="告警处理方式"
      :visible.sync="alarmHandlinDdialog"
      append-to-body
      class="focus-main-dialog"
      width="500px"
    >
      <el-table
        :data="method"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        ref="alarmHandlinTable"
      >
        <el-table-column type="index" label="" width="50" align="center">
          <template slot-scope="scope">
            <el-radio
              v-model="currentRowId"
              :label="scope.row.id"
              @change="changeRedio($event, scope.row)"
              >{{ "" }}</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
          v-if="maintainShow"
        >
          <template slot-scope="scope">
            {{ scope.$index == 0 ? 1 : 2 }}
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
          v-else
        >
        </el-table-column>
        <el-table-column
          label="处理方式"
          prop="name"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alarmHandlinDdialog = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryList,
  alarmExport,
  remove,
  queryAlarmHandleList,
  alarmStateStatistics,
  detailQueryList,
  confirmationSlip,
} from "@/api/operationManagement/alarmManagement";
import moment from "moment";
import { getSelected } from "@/util/util.js";
import { mapGetters } from "vuex";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
export default {
  name: "componentAccount",
  data() {
    return {
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      subStationOptions: [],
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      form: {
        mainStationIdList: [],
        subStationIdList: [],
        alarmCategory: "",
        type: "",
        positionName: "",
        positionCode: "",
        equipmentTypeList: [],
        warningTypeList: [],
        dataSources: "",
        alarmStateList: [
          "alarm_state_stay_confirm",
          "alarm_state_under_confirmation",
        ],
        warningLevelList: [],
        startNewTime: "",
        endNewTime: "",
      },
      multipleSelection: [],
      alarmHandlinDdialog: false,
      open: false,
      radioMethod: "",
      alarmTime: "",
      nowTime: "",
      stateTimer: "",
      nowTimer: "",
      stateInfo: "",
      sort3: "no",
      sort2: "no",
      sort1: "no",
      alarmCategoryOptions: JSON.parse(
        window.localStorage.getItem("alarmCategoryOptions")
      ),
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      warningLevelOptions: JSON.parse(
        window.localStorage.getItem("warningLevelOptions")
      ),
      warningTypeOptions: JSON.parse(
        window.localStorage.getItem("warningTypeOptions")
      ),
      alarmStateOptions: JSON.parse(
        window.localStorage.getItem("alarmStateOptions")
      ),
      dataSourceOptions: JSON.parse(
        window.localStorage.getItem("dataSourceOptions")
      ),
      dataSourcesOptions: JSON.parse(
        window.localStorage.getItem("dataSourcesOptions")
      ),
      frequencyOptions: [
        { dictKey: "1", dictValue: "天" },
        { dictKey: "2", dictValue: "周" },
        { dictKey: "3", dictValue: "月" },
        { dictKey: "4", dictValue: "季度" },
        { dictKey: "5", dictValue: "年" },
        { dictKey: "6", dictValue: "自定义" },
      ],
      currentRowId: "",
      chooseRedio: "",
      method: [
        { name: "告警确认单", id: "1" },
        { name: "维修工单", id: "2" },
        { name: "情况说明单", id: "3" },
      ],
      maintainShow: false,
      multipleSelectionList: [],
    };
  },
  watch: {
    alarmHandlinDdialog(val) {
      if (val) {
        this.currentRowId = "";
        this.chooseRedio = "";
      }
    },
  },
  created() {},
  mounted() {
    this.getqueryList({
      alarmStateList: this.form.alarmStateList,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    this.handleInterval();
    this.getQuerySumByOrderStatus({});
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.setUI();
  },
  computed: {
    ...mapGetters(["colorName"]),
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
    this.handleInterval();
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getqueryList(data) {
      queryList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
      });
      this.multipleSelectionList = val;
    },
    getTime() {
      this.nowTime = moment(new Date()).format("yyyy年MM月DD日 HH:mm:ss");
    },
    getQuerySumByOrderStatus() {
      alarmStateStatistics({}).then((res) => {
        this.stateInfo = res.data.data;
      });
    },
    handleInterval() {
      if (!this.nowTimer) {
        this.nowTimer = setInterval(() => {
          this.getTime();
        }, 1000);
      }
      if (!this.stateTimer) {
        this.stateTimer = setInterval(() => {
          alarmStateStatistics({}).then((res) => {
            this.stateInfo = res.data.data;
          });
        }, 60000);
      }
    },
    // 详情
    details(data) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailsAlarmManagement",
        query: { id: data.id },
      });
    },
    // 查询
    searchData() {
      this.getqueryList({
        mainStationId: this.form.mainStationIdList, //所属组织
        subStationId: this.form.subStationIdList, //所属子期
        alarmCategory: this.form.alarmCategory,
        type: this.form.type,
        positionName: this.form.positionName,
        positionCode: this.form.positionCode,
        equipmentTypeList: this.form.equipmentTypeList,
        warningTypeList: this.form.warningTypeList,
        dataSources: this.form.dataSources,
        alarmStateList: this.form.alarmStateList,
        warningLevelList: this.form.warningLevelList,
        startNewTime: this.form.startNewTime,
        endNewTime: this.form.endNewTime,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.mainStationIdList = [];
      this.form.subStationIdList = [];
      this.form.alarmCategory = "";
      this.form.type = "";
      this.form.positionName = "";
      this.form.positionCode = "";
      this.form.equipmentTypeList = [];
      this.form.warningTypeList = [];
      this.form.dataSources = "";
      this.form.alarmStateList = [
        "alarm_state_stay_confirm",
        "alarm_state_under_confirmation",
      ];
      this.form.warningLevelList = [];
      this.form.startNewTime = "";
      this.form.endNewTime = "";
      this.orderColumn = "";
      this.orderType = "";
      this.value = [];
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.sort1 = "no";
      this.sort2 = "no";
      this.sort3 = "no";
      this.searchData();
    },
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
        this.sort3 = "no";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : this.sort1 == true
          ? (this.sort1 = "no")
          : (this.sort1 = true);
        this.orderColumn = this.sort1 == "no" ? "" : "main_station_id";
        this.orderType = this.sort1 == "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      if (num == 1) {
        this.sort1 = "no";
        this.sort3 = "no";
        this.sort2 == "no"
          ? (this.sort2 = false)
          : this.sort2 == true
          ? (this.sort2 = "no")
          : (this.sort2 = true);
        this.orderColumn = this.sort2 == "no" ? "" : "start_time";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      if (num == 2) {
        this.sort1 = "no";
        this.sort2 = "no";
        this.sort3 == "no"
          ? (this.sort3 = false)
          : this.sort3 == true
          ? (this.sort3 = "no")
          : (this.sort3 = true);
        this.orderColumn = this.sort3 == "no" ? "" : "new_time";
        this.orderType = this.sort3 == "no" ? "" : this.sort3 ? "desc" : "asc";
      }
      this.searchData();
    },
    changeRedio(event, row) {
      console.log(row);
      this.chooseRedio = row;
    },
    principalAdd() {
      console.log(this.chooseRedio);
      console.log(this.multipleSelection[0]);
      if (!this.chooseRedio) return this.$message.warning("请选择处理方式");
      this.getQueryStageDetail(this.multipleSelection[0]);
    },
    tableRowClassName(data) {
      console.log(data.row.id == 2 && this.maintainShow);
      if (data.row.id == 2 && this.maintainShow) {
        return "hidden-row";
      }
      return "";
    },
    // 工单创建流
    getQueryStageDetail(alarmMainId) {
      detailQueryList({
        alarmMainId,
      }).then((res) => {
        let alarmInfoDetailIds = [];
        res.data.data.detailResponseList.forEach((item) => {
          console.log(item.id);
          alarmInfoDetailIds.push(item.id);
        });
        queryAlarmHandleList({ alarmDetailIdLists: alarmInfoDetailIds }).then(
          (res) => {
            console.log(res.data.data);
            if (res.data.data[Object.keys(res.data.data)[1]].length > 0) {
              this.$message.error(
                res.data.data[Object.keys(res.data.data)[1]].length +
                  "个工单已创建"
              );
              this.alarmHandlinDdialog = false;
              return;
            }
            if (this.chooseRedio.id == 1) {
              console.log(1, alarmMainId, alarmInfoDetailIds);
              confirmationSlip({
                alarmInfoId: alarmMainId,
                alarmInfoDetailIds,
              }).then((res) => {
                console.log(res.data.data);
                this.alarmHandlinDdialog = false;
              });
            }
            if (this.chooseRedio.id == 2) {
              console.log(2, alarmMainId, alarmInfoDetailIds);
              this.alarmHandlinDdialog = false;
              this.$router.push({
                path: "/taskManagement/newRepairOrder",
                query: {
                  alarmMainId: alarmMainId,
                  alarmInfoDetailIds: alarmInfoDetailIds.join(","),
                },
              });
            }
            if (this.chooseRedio.id == 3) {
              console.log(3, alarmMainId, alarmInfoDetailIds);
              this.alarmHandlinDdialog = false;
              this.$router.push({
                path: "/taskManagement/addOperationEquipmentDescription",
                query: {
                  alarmMainId: alarmMainId,
                  alarmInfoDetailIds: alarmInfoDetailIds.join(","),
                },
              });
            }
          }
        );
      });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      alarmExport({
        mainStationId: this.form.mainStationIdList, //所属组织
        subStationId: this.form.subStationIdList, //所属子期
        alarmCategory: this.form.alarmCategory,
        type: this.form.type,
        positionName: this.form.positionName,
        positionCode: this.form.positionCode,
        equipmentTypeList: this.form.equipmentTypeList,
        warningTypeList: this.form.warningTypeList,
        dataSources: this.form.dataSources,
        alarmStateList: this.form.alarmStateList,
        warningLevelList: this.form.warningLevelList,
        startNewTime: this.form.startNewTime,
        endNewTime: this.form.endNewTime,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "告警管理列表.xls"; //下载的文件名
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
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 批量删除
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ idList: this.multipleSelection }).then(() => {
          this.searchData();
        });
      });
    },
    datetimerange(data) {
      console.log("data", data);
      if (!data) {
        this.form.startNewTime = "";
        this.form.endNewTime = "";
        this.searchData();
        return;
      }
      data.forEach((date, index) => {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        var second = date.getSeconds();
        second = second < 10 ? "0" + second : second;
        this.value[index] =
          y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      });
      this.form.startNewTime = this.value[0];
      this.form.endNewTime = this.value[1];
      this.searchData();
    },
    alarmHandling() {
      this.radioMethod = "";
      if (
        this.multipleSelection.length == 0 ||
        this.multipleSelection.length > 1
      )
        return this.$message.warning("请选择一条数据");
      console.log("alarmHandling", this.multipleSelection[0]);
      if (
        this.multipleSelectionList[0].alarmCategory == "alarm_category_stage"
      ) {
        this.maintainShow = true;
      } else {
        this.maintainShow = false;
      }
      this.alarmHandlinDdialog = true;
    },
    visibleChange(val) {
      console.log(val);
      if (!val) {
        this.searchData();
      }
    },
    indexMethod(index) {
      return index + 1 + (this.pageNum - 1) * this.pageSize;
    },
  },
  destroyed() {
    // window.removeEventListener("resize", this.getTableHeight);
    window.clearInterval(this.nowTimer);
    window.clearInterval(this.stateTimer);
    this.nowTimer = null;
    this.stateTimer = null;
  },
  deactivated() {
    // window.removeEventListener("resize", this.getTableHeight);
    window.clearInterval(this.nowTimer);
    window.clearInterval(this.stateTimer);
    this.nowTimer = null;
    this.stateTimer = null;
  },
};
</script>

<style lang="scss" scoped>
/deep/.hidden-row {
  display: none;
  visibility: hidden;
}
.alarm-management {
  .box-card {
    overflow-y: auto;
    height: calc(100vh - 124px);
    .title-content {
      /deep/.el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          margin-right: 20px;
        }
        .el-tag.el-tag--info {
          max-width: 120px;
          overflow: hidden;
          position: relative;
          .el-select__tags-text {
            max-width: 90px;
            display: inline-block;
            overflow: hidden;
          }
          .el-tag__close {
            position: relative;
            top: -7px;
            right: 0;
          }
        }
      }
    }
    .order-state {
      display: flex;
      justify-content: space-between;
      padding: 0 0 16px;
      color: #606266;
      font-size: 14px;
      .state {
        margin-right: 80px;
        span:nth-child(2n) {
          margin-right: 16px;
        }
      }
    }
  }
  /deep/.el-table__header-wrapper {
    .cell {
      color: #333;
    }
  }
  .title-btn {
    margin-left: 50px;
    margin-bottom: 20px;
  }
  .content {
    .content-title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .left {
        /deep/.el-button--primary.is-plain:focus,
        .el-button--primary.is-plain:hover {
          color: #409eff;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
      .right {
        display: flex;
      }
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
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
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.focus-main-dialog {
  .dialog-content {
    .content-title {
      display: flex;
      /deep/.el-button--medium {
        padding: 13px 20px;
        margin-left: 30px;
      }
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
}
</style>
