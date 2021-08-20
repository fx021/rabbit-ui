<template>
  <div class="backstage-index">
    <el-card class="box-card">
      <el-backtop target=".box-card" :visibility-height="100" :bottom="70">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          style="font-size: 24px;padding: 6px;transform: rotate(180deg)"
        ></el-button>
      </el-backtop>
      <div style="position: relative;">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-sort"
          style="position: absolute; right: 0px; top: 0px"
          @click="show = !show"
          >{{ !show ? "展开" : "收起" }}</el-button
        >

        <el-form
          ref="form"
          :model="form"
          style="display: flex;flex-wrap: wrap;padding-right: 90px;"
          label-width="110px"
        >
          <el-form-item label="所属组织：">
            <el-select
              style="width: 217px"
              v-model="form.stationIds"
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
          <el-form-item label="任务分类：">
            <el-select
              style="width: 217px"
              v-model="form.taskClassificationIds"
              multiple
              collapse-tags
              filterable
              @visible-change="visibleChange"
              placeholder="请选择"
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
          <el-form-item label="任务内容：">
            <el-select
              style="width: 217px"
              v-model="form.taskDefinitionIds"
              multiple
              collapse-tags
              filterable
              @visible-change="visibleChange"
              placeholder="请选择"
            >
              <el-option
                v-for="item in taskContentList"
                :key="item.id"
                :label="item.taskClassification"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述：" v-show="show">
            <el-input
              style="width: 217px"
              v-model="form.taskDescribe"
              placeholder="请输入内容"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务区域：" v-show="show">
            <el-select
              style="width: 217px"
              v-model="form.taskAreaIds"
              multiple
              collapse-tags
              filterable
              @visible-change="visibleChange"
              placeholder="请选择"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单状态：" v-show="show">
            <el-select
              style="width: 217px"
              v-model="form.workOrderStatus"
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
          <el-form-item label="发起时间：" v-show="show">
            <el-date-picker
              v-model="form.orderTime"
              style="width: 564px"
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
          <el-form-item label="发起人：" v-show="show">
            <my-select
              style="width: 217px"
              :options="initiatorList"
              ref="selectRef1"
              v-model="form.initiators"
              @visible-change="visibleChange"
              @input="handleInput"
              :optionProp="{ value: 'userId', label: 'userName' }"
            />
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
      </div>
      <div class="content">
        <div class="content-title" ref="contentTitle">
          <!-- v-if="permission.user_delete" -->
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort(0)"
              >所属组织<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort1 == 'no' ? '' : sort1 ? '' : colorName
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort1 == 'no' ? '' : sort1 ? colorName : ''
                  }"
                ></i
              ></span>
            </el-button>
            <el-button type="primary" size="small" plain @click="sort(1)"
              >发起时间<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort2 == 'no' ? '' : sort2 ? '' : colorName
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort2 == 'no' ? '' : sort2 ? colorName : ''
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
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleAdd"
              >新增
            </el-button>
            <!-- v-if="userInfo.role_name.includes('admin')" -->
            <el-button
              type="danger"
              size="small"
              plain
              :disabled="multipleSelection.length == 0"
              class="el-icon-delete"
              @click.stop="deletes"
              >删除</el-button
            >
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-download"
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
          <el-table-column
            type="index"
            width="55"
            align="center"
            label="序号"
            :index="indexMethod"
          />
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            align="center"
            show-overflow-tooltip
            min-width="150"
          />
          <el-table-column
            label="工单编号"
            prop="workOrderNo"
            align="center"
            show-overflow-tooltip
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            label="任务分类"
            prop="taskClassificationName"
            align="center"
            show-overflow-tooltip
            min-width="150"
          />
          <el-table-column
            label="任务内容"
            prop="taskDefinitionName"
            align="center"
            show-overflow-tooltip
            min-width="150"
            :formatter="taskDefinitionFormat"
          />
          <el-table-column
            label="任务描述"
            prop="taskDescribe"
            align="center"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="任务区域"
            prop="taskAreaName"
            align="center"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="发起时间"
            prop="launchTime"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            label="当前处理人"
            prop="currentPersonName"
            align="center"
            show-overflow-tooltip
            min-width="100"
          />
          <el-table-column
            label="工单状态"
            prop="workOrderStatus"
            align="center"
            :formatter="stateFormat"
            show-overflow-tooltip
            min-width="150"
          />
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
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import { getSelected } from "@/util/util.js";
import { userList } from "@/api/organization/staging";
import mySelect from "@/components/select/select.vue";
import { queryMainStationDropDownList } from "@/api/planManage/deviceInspection.js";
import { queryAreaDropDownList } from "@/api/planManage/deviceInspection";
import { queryTaskClassifications } from "@/api/backstage/taskClassification.js";
import { queryTaskDefinitions } from "@/api/backstage/taskContent.js";
import {
  queryEverydayTaskList,
  exportEverydayTaskList,
  delEverydayTask
} from "@/api/taskWorkOrder/dailyTask.js";
import { mapGetters } from "vuex";
export default {
  name: "DailyTask",
  components: { mySelect },
  data() {
    return {
      taskClassificationList: [],
      taskContentList: [],
      stateInfo: {},
      total: 0,
      current: 1,
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      mainStationList: [],
      areaList: [],
      show: false, // 展开/收起
      options: [
        { value: 1, label: "是" },
        { value: 0, label: "否" }
      ],
      form: {
        orderTime: [], // 工单时间
        stationIds: [], //所属组织
        taskClassificationIds: [], //任务分类
        taskDefinitionIds: [], //任务内容
        taskAreaIds: [], //任务区域
        initiators: [], //发起人
        workOrderStatus: [], //工单状态
        taskDescribe: "", //任务描述
        startTime: "", //发起开始时间
        endTime: "" //发起时间
      },
      initiatorList: [], // 发起人下拉
      eliminationManagerList: [], // 消缺负责人下拉
      equipmentVisible: false, // 选择设备弹窗
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date(
                moment(new Date())
                  .add("year", 0)
                  .format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment(new Date())
                  .add("year", 0)
                  .format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本周",
            onClick(picker) {
              const end = new Date(
                moment()
                  .weekday(7)
                  .format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment()
                  .weekday(1)
                  .format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date(
                moment()
                  .endOf("month")
                  .format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment()
                  .startOf("month")
                  .format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            }
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
            }
          },
          {
            text: "本年",
            onClick(picker) {
              const end = new Date(
                moment()
                  .endOf("year")
                  .format("YYYY-MM-DD 23:59:59")
              );
              const start = new Date(
                moment()
                  .startOf("year")
                  .format("YYYY-MM-DD 00:00:00")
              );
              start.setTime(moment(start).toDate());
              end.setTime(moment(end).toDate());
              picker.$emit("pick", [start, end]);
            }
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
            }
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
            }
          }
        ]
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      pageNum: 1,
      pageSize: 10,
      orderStateOptions: JSON.parse(localStorage.getItem("orderStateOptions")), // 工单状态字典
      faultTypeOptions: JSON.parse(localStorage.getItem("faultTypeOptions")), // 故障类型字典
      dataSourceOptions: JSON.parse(localStorage.getItem("dataSourceOptions")), // 数据来源字典
      warningLevelOptions: JSON.parse(
        localStorage.getItem("warningLevelOptions")
      ) // 告警级别字典
    };
  },
  created() {},
  mounted() {
    this.searchData();
    this.getQueryMainStationDropDownList({});
    this.setUI();
    userList({ userName: "", inMyMainStation: 1 }).then(res => {
      this.initiatorList = res.data.data;
      this.eliminationManagerList = res.data.data;
    });
    queryTaskClassifications({}).then(res => {
      this.taskClassificationList = res.data.data;
    });
    // window.addEventListener("resize", this.getTableHeight);
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
  },
  destroyed() {
    // window.removeEventListener("resize", this.getTableHeight);
  },
  deactivated() {
    // window.removeEventListener("resize", this.getTableHeight);
  },
  computed: {
    ...mapGetters(["colorName"])
  },
  watch: {
    "form.stationIds"(val) {
      this.getQueryAreaDropDownList({
        mainStationIds: val
      });
      this.form.taskAreaIds = [];
    },
    "form.taskClassificationIds"(val) {
      queryTaskDefinitions({
        taskClassificationCode: val.map(v => v.taskClassificationCode)
      }).then(res => {
        this.taskContentList = res.data.data;
      });
    }
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getTableHeight() {
      this.tableHeight =
        this.$refs.multipleTable.$el.offsetParent.offsetHeight -
        this.$refs.multipleTable.$el.offsetTop -
        88;
    },
    getQueryList(data) {
      queryEverydayTaskList(data).then(res => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        // this.getTableHeight();
      });
    },
    // 所属组织下拉
    getQueryMainStationDropDownList(data) {
      queryMainStationDropDownList(data).then(res => {
        this.mainStationList = res.data.data;
      });
    },
    // 方阵下拉列表
    async getQueryAreaDropDownList(data) {
      await queryAreaDropDownList(data).then(res => {
        this.areaList = res.data.data;
      });
    },
    // 发起人下拉
    getInitiatorList(data) {
      userList(data).then(res => {
        this.initiatorList = res.data.data ? res.data.data : [];
      });
    },
    // 发起人 - input
    handleInput(val) {
      if (val) {
        this.getInitiatorList({
          userName: val,
          mainStationIdList: this.form.stationIds,
          inMyMainStation: 0
        });
      } else {
        this.getInitiatorList({
          mainStationIdList: this.form.stationIds,
          inMyMainStation: 1
        });
      }
    },
    // 工单发起时间下拉 - change
    changeOrderTime(val) {
      console.log(val);
      this.form.startTime = val ? val[0] : "";
      this.form.endTime = val ? val[1] : "";
      this.searchData();
    },
    indexMethod(index) {
      return index + 1 + (this.pageNum - 1) * this.pageSize;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 查询
    searchData() {
      let param = {
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      Object.assign(param, this.form);
      param.taskClassificationIds = param.taskClassificationIds.map(v => v.id);
      this.getQueryList(param);
    },
    // 重置主表数据
    reset() {
      this.form = {
        orderTime: [], // 工单时间
        stationIds: [], //所属组织
        taskClassificationIds: [], //任务分类
        taskDefinitionIds: [], //任务内容
        taskAreaIds: [], //任务区域
        initiators: [], //发起人
        workOrderStatus: [], //工单状态
        taskDescribe: "", //任务描述
        startTime: "", //发起开始时间
        endTime: "" //发起时间
      };
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.$refs.selectRef1.value = [];
      this.$refs.selectRef1.searchText = "";
      this.handleInput();
      this.searchData();
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let ids = [];
        this.multipleSelection.forEach(item => {
          ids.push(item.id);
        });
        delEverydayTask({ ids }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newDailyTask" });
    },
    // 导出
    handleExport() {
      let param = {
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType //排序类型 desc降序,asc升序
      };
      Object.assign(param, this.form);
      param.taskClassificationIds = param.taskClassificationIds.map(v => v.id);
      exportEverydayTaskList(param)
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "日常任务.xls"; //下载的文件名
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
    },
    taskDefinitionFormat(row) {
      let result = row.taskDefinitionName;
      if (row.taskDefinitionId === "other") {
        result = "其他";
      }
      return result;
    },
    stateFormat(row) {
      let result = row.workOrderStatus;
      this.orderStateOptions.forEach(ele => {
        if (ele.dictKey === row.workOrderStatus) {
          result = ele.dictValue;
        }
      });
      return result;
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
          : !this.sort1
          ? (this.sort1 = !this.sort1)
          : (this.sort1 = "no");
        this.orderColumn = "main_station_id";
        this.orderType = this.sort1 === "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      if (num == 1) {
        this.sort1 = "no";
        this.sort2 == "no"
          ? (this.sort2 = false)
          : !this.sort2
          ? (this.sort2 = !this.sort2)
          : (this.sort2 = "no");
        this.orderColumn = "launch_time";
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
      this.$router.push({
        path: "./dailyTaskDetail",
        query: {
          id: row.id
        }
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    }
  }
};
</script>

<style lang="scss" scoped>
.backstage-index {
  .box-card {
    overflow: auto;
    height: calc(100vh - 124px);
  }
  /deep/.el-form {
    display: flex;
    .el-form-item {
      margin-right: 20px;
    }
    .el-tag.el-tag--info {
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
          color: var(--color);
          background: #ecf5ff;
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
    border-top-color: #23a92a;
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
.focus-main-dialogs {
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
}
</style>
