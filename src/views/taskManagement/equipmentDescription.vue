<template>
  <div class="backstage-index">
    <el-card class="box-card">
      <div class="order-state">
        <div class="time">时间：{{ nowTime }}</div>
        <div class="state" v-if="stateInfo">
          <span>待处理：</span>
          <span>{{ stateInfo.order_state_pending }}条</span>
          <span>处理中：</span>
          <span>{{ stateInfo.order_state_handle }}条</span>
        </div>
      </div>
      <el-form
        ref="form"
        :model="form"
        style="display: flex; flex-wrap: wrap"
        label-width="120px"
      >
        <el-form-item label="标题：">
          <el-input
            style="width: 217px"
            v-model="form.title"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属组织：">
          <el-select
            style="width: 217px"
            v-model="form.mainStations"
            filterable
            multiple
            collapse-tags
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in mainStationList"
              :key="item.id"
              :label="item.mainStationName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属子期：">
          <el-select
            v-model="form.subStations"
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
        <el-form-item label="工单编号：" v-show="open">
          <el-input
            style="width: 217px"
            v-model="form.wordOrderNo"
            placeholder="请输入工单编号"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="工单状态：" v-show="open">
          <el-select
            style="width: 217px"
            v-model="form.wordOrderstate"
            multiple
            collapse-tags
            @visible-change="visibleChange"
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
        <el-form-item label="发起人：" v-show="open">
          <my-select
            style="width: 217px"
            :options="initiatorList"
            ref="selectRef1"
            v-model="form.initiatorNames"
            @visible-change="visibleChange"
            @input="handleInput"
            :optionProp="{ value: 'userId', label: 'userName' }"
          />
        </el-form-item>
        <el-form-item label="告警时间：" v-show="open">
          <el-date-picker
            v-model="alarmTime"
            style="width: 575px"
            type="datetimerange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeAlarmTime"
          >
          </el-date-picker>
        </el-form-item>

        <!-- 设备名称 -->
        <Postion ref="postion" v-show="open"></Postion>

        <el-form-item label="设备编码：" v-show="open">
          <el-input
            style="width: 217px"
            v-model="form.equipmentCode"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="工单发起时间：" v-show="open">
          <el-date-picker
            v-model="orderTime"
            style="width: 575px"
            type="datetimerange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="changeOrderTime"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="规格型号：" v-show="open">
          <el-input
            style="width: 217px"
            v-model="form.equipmentModel"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="最高告警级别：" v-show="open">
          <el-select
            style="width: 217px"
            v-model="form.highAlarmLevels"
            multiple
            collapse-tags
            @visible-change="visibleChange"
            placeholder="请选择"
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
      <div class="content">
        <div class="content-title">
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
              >创建时间<span class="caret-wrapper"
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
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-refresh"
              @click="reset"
              >刷新</el-button
            >
          </div>
          <div class="right">
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="handleExport"
              >导出
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              :disabled="multipleSelection.length == 0"
              class="el-icon-delete"
              @click.stop="deletes"
              >删除</el-button
            >
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
            :index="indexMethod"
          />
          <el-table-column
            label="标题"
            prop="title"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="工单编号"
            prop="wordOrderNo"
            align="center"
            show-overflow-tooltip
          />
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
            label="设备名称"
            prop="equipmentName"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.taskState | filterOptions(taskStateOptions) }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="设备编码"
            prop="equipmentCode"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.checkResult | filterOptions(checkResultOptions) }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="设备品牌"
            prop="manufactor"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.assignState | filterOptions(assignStateOptions) }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="最高告警级别"
            prop="highAlarmLevels"
            align="center"
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.highAlarmLevels | filterOptions(warningLevelOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="影响容量(kW)"
            prop="influenceCapacity"
            align="center"
            width="120"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.taskClass | filterOptions(frequencyOptions) }}
            </template> -->
          </el-table-column>

          <el-table-column
            label="告警类型"
            prop="warningType"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.taskClass | filterOptions(frequencyOptions) }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="工单发起时间"
            prop="wordOrderStartTime"
            align="center"
            width="120"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.taskClass | filterOptions(frequencyOptions) }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="发起人"
            prop="initiatorName"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ scope.row.taskClass | filterOptions(frequencyOptions) }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="工单状态"
            prop="wordOrderState"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.wordOrderState | filterOptions(orderStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            label="处理结果"
            prop="treatmentResult"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.treatmentResult | filterOptions(handleResultOptions)
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
  </div>
</template>

<script>
import moment from "moment";
import mySelect from "@/components/select/select.vue";
import Postion from "@/components/dialog/postionDialog";
import { userList } from "@/api/organization/staging";
import {
  explainQueryList,
  remove,
  exportSituationExplainOrderList,
  querySituationExplainOrderStatus,
} from "@/api/taskManagement/equipmentDescription";
import { getSelected } from "@/util/util.js";
import { queryMainStationDropDownList } from "@/api/planManage/deviceInspection.js";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { mapGetters } from "vuex";
export default {
  name: "patrolTask",
  components: { Postion, mySelect },
  data() {
    return {
      warningLevelOptions: JSON.parse(
        window.localStorage.getItem("warningLevelOptions") //告警级别
      ),
      orderStateOptions: JSON.parse(
        window.localStorage.getItem("orderStateOptions")
      ), //工单状态
      handleResultOptions: JSON.parse(
        window.localStorage.getItem("handleResultOptions")
      ), //处理结果
      open: false,
      total: 0,
      current: 1,
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      mainStationList: [],
      subStationOptions: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date(
                moment(new Date()).add("year", 0).format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment(new Date()).add("year", 0).format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本周",
            onClick(picker) {
              const end = new Date(
                moment().weekday(7).format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment().weekday(1).format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date(
                moment().endOf("month").format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment().startOf("month").format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本季度",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let currentQuarter = moment().quarter(); // 当前是第几季度
              let currentYear = moment().year(); // 当前年
              let startDay = moment(
                moment(currentYear + "-01-01").toDate()
              ).quarter(currentQuarter);
              let endMonth = 3 * parseInt(currentQuarter); //当季度最后一个月
              /* 对月数进行格式化 */
              if (endMonth < 10) endMonth = "0" + endMonth;
              else endMonth += "";

              let endMonthDays = moment(
                currentYear + "-" + endMonth
              ).daysInMonth(); // 末尾月天数
              let endDay =
                currentYear + "-" + endMonth + "-" + endMonthDays + " 23:59:59"; //完整年月日整合
              start.setTime(moment(startDay).toDate());
              end.setTime(moment(endDay).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本年",
            onClick(picker) {
              const end = new Date(
                moment().endOf("year").format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment().startOf("year").format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上一月",
            onClick(picker) {
              const end = new Date(
                moment()
                  .subtract(1, "months")
                  .endOf("month")
                  .format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment()
                  .subtract(1, "months")
                  .startOf("month")
                  .format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上一年",
            onClick(picker) {
              const end = new Date(
                moment()
                  .subtract(1, "years")
                  .endOf("year")
                  .format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment()
                  .subtract(1, "years")
                  .startOf("year")
                  .format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dialogformx: {
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: "",
        subStationId: "",
        equipmentTypeList: "",
      },
      form: {
        title: "", //标题
        mainStations: [], //所属组织
        subStations: [], //所属子期
        wordOrderNo: "", //工单
        wordOrderstate: [], //工单状态(字典)
        alarmStartTime: "", //告警开始时间
        alarmEndTime: "", //告警结束时间
        orderStartTime: "", //工单发起时间
        orderEndTime: "", //工单结束时间
        initiatorNames: [], //发起人
        equipmentNames: [], //设备名称
        equipmentCode: "", //设别编码
        equipmentModel: "", //规格型号
        highAlarmLevels: [], //最高告警级别(字典)
      },
      multipleSelection: [],
      initiatorList: [], // 发起人下拉
      alarmTime: [],
      orderTime: [],
      sort1: "no",
      sort2: "no",
      pageNum: 1,
      pageSize: 10,
      nowTime: "",
    };
  },
  created() {},
  mounted() {
    this.getQueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    this.handleInterval();
    this.getQuerySumByOrderStatus({});
    userList({ userName: "", inMyMainStation: 1 }).then((res) => {
      this.initiatorList = res.data.data;
    });
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationList = res.data.data;
    });
    this.setUI();
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
    this.handleInterval();
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
  computed: {
    ...mapGetters(["colorName"]),
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
    // 工单发起时间下拉 - change
    changeOrderTime(val) {
      console.log(val);
      this.form.orderStartTime = val ? val[0] : "";
      this.form.orderEndTime = val ? val[1] : "";
      this.searchData();
    },
    getTime() {
      this.nowTime = moment(new Date()).format("yyyy年MM月DD日 HH:mm:ss");
    },
    handleInterval() {
      if (!this.nowTimer) {
        this.nowTimer = setInterval(() => {
          this.getTime();
        }, 1000);
      }
      if (!this.stateTimer) {
        this.stateTimer = setInterval(() => {
          querySituationExplainOrderStatus({}).then((res) => {
            this.stateInfo = res.data.data;
          });
        }, 60000);
      }
    },
    getQuerySumByOrderStatus() {
      querySituationExplainOrderStatus({}).then((res) => {
        this.stateInfo = res.data.data;
      });
    },
    // 告警时间下拉 - change
    changeAlarmTime(val) {
      this.form.alarmStartTime = val ? val[0] : "";
      this.form.alarmEndTime = val ? val[1] : "";
      this.searchData();
    },
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getQueryList(data) {
      explainQueryList(data).then((res) => {
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
    },
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 查询
    searchData() {
      this.getQueryList({
        title: this.form.title, //标题
        mainStations: this.form.mainStations, //所属组织
        subStations: this.form.subStations, //所属子期
        wordOrderNo: this.form.wordOrderNo, //工单
        // wordOrderstate: this.form.wordOrderstate, //工单状态(字典)
        wordOrderstate: "", //工单状态(字典)
        alarmStartTime: this.form.alarmStartTime, //告警开始时间
        alarmEndTime: this.form.alarmEndTime, //告警结束时间
        orderStartTime: this.form.orderStartTime, //工单发起时间
        orderEndTime: this.form.orderEndTime, //工单结束时间
        initiatorNames: this.form.initiatorNames, //发起人
        equipmentNames: this.$refs.postion.positionNames, //设备名称
        equipmentCode: this.form.equipmentCode, //设别编码
        equipmentModel: this.form.equipmentModel, //规格型号
        highAlarmLevels: this.form.highAlarmLevels, //最高告警级别(字典)
        // highAlarmLevels: "", //最高告警级别(字典)
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.title = ""; //标题
      this.form.mainStations = []; //所属组织
      this.form.subStations = []; //所属子期
      this.form.wordOrderNo = ""; //工单
      this.form.wordOrderstate = []; //工单状态(字典)
      this.form.alarmStartTime = ""; //告警开始时间
      this.form.alarmEndTime = ""; //告警结束时间
      this.form.orderStartTime = ""; //工单发起时间
      this.form.orderEndTime = ""; //工单结束时间
      this.form.initiatorNames = []; //发起人
      this.form.equipmentNames = []; //设备名称
      this.form.equipmentCode = ""; //设别编码
      this.form.equipmentModel = ""; //规格型号
      this.form.highAlarmLevels = []; //最高告警级别(字典)
      this.alarmTime = [];
      this.orderTime = [];
      this.$refs.selectRef1.value = [];
      this.$refs.selectRef1.searchText = "";
      this.handleInput();
      this.$refs.postion.clear();
      this.searchData();
    },
    // 发起人下拉
    getInitiatorList(data) {
      userList(data).then((res) => {
        this.initiatorList = res.data.data ? res.data.data : [];
      });
    },
    // 发起人 - input
    handleInput(val) {
      if (val) {
        this.getInitiatorList({
          userName: val,
          mainStationIdList: this.form.stationIds,
          inMyMainStation: 0,
        });
      } else {
        this.getInitiatorList({
          mainStationIdList: this.form.stationIds,
          inMyMainStation: 1,
        });
      }
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ ids: this.multipleSelection }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./add" });
    },
    // 导出
    handleExport() {
      exportSituationExplainOrderList({
        ids: this.multipleSelection, 
        title: this.form.title, //标题
        mainStations: this.form.mainStations, //所属组织
        subStations: this.form.subStations, //所属子期
        wordOrderNo: this.form.wordOrderNo, //工单
        // wordOrderstate: this.form.wordOrderstate, //工单状态(字典)
        wordOrderstate: "", //工单状态(字典)
        alarmStartTime: this.form.alarmStartTime, //告警开始时间
        alarmEndTime: this.form.alarmEndTime, //告警结束时间
        orderStartTime: this.form.orderStartTime, //工单发起时间
        orderEndTime: this.form.orderEndTime, //工单结束时间
        initiatorNames: this.form.initiatorNames, //发起人
        equipmentNames: this.$refs.postion.positionNames, //设备名称
        equipmentCode: this.form.equipmentCode, //设别编码
        equipmentModel: this.form.equipmentModel, //规格型号
        highhighAlarmLevelss: this.form.highhighAlarmLevelss, //最高告警级别(字典)
        // highAlarmLevels: "", //最高告警级别(字典)
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
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
          link.download = "设备情况说明单列表.xls"; //下载的文件名
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
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
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
        this.sort2 == "no"
          ? (this.sort2 = false)
          : this.sort2 == true
          ? (this.sort2 = "no")
          : (this.sort2 = true);
        this.orderColumn = this.sort2 == "no" ? "" : "create_time";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 详情
    details(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./operationEquipmentDescription",
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
    indexMethod(index) {
      return index + 1 + (this.pageNum - 1) * this.pageSize;
    },
  },
};
</script>

<style lang="scss" scoped>
.open {
  position: absolute;
  right: 4%;
  top: 10%;
}
.backstage-index {
  .box-card {
    height: calc(100vh - 124px);
    overflow: auto;
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
      display: flex;
      justify-content: space-between;
      /* 定义变量 */
      --color: "";
      .left {
        /deep/.el-button--primary.is-plain:focus,
        .el-button--primary.is-plain:hover {
          // color: var(--color);
          color: #409eff;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
    }
  }
  /deep/.el-table th {
    color: #333;
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
</style>
