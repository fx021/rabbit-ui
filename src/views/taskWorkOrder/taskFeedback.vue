<template>
  <div class="substation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationids"
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
          <el-form-item label="监控分类：">
            <el-select
              v-model="form.taskCategories"
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
                v-for="item in taskClassificationList"
                :key="item.id"
                :label="item.taskClassification"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述：">
            <el-input
              style="width: 217px"
              v-model="form.contentDescribe"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务区域：">
            <el-select
              v-model="form.taskAreas"
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
                v-for="item in areaList"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发起时间：">
            <el-date-picker
              v-model="value1"
              style="width: 584px"
              type="datetimerange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="visibleChangetime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="核实时间：" v-if="open">
            <el-date-picker
              v-model="value2"
              style="width: 584px"
              type="datetimerange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="visibleChangetime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务状态：" v-if="open">
            <el-select
              v-model="form.wordOrderStates"
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
                v-for="item in orderStateOptions"
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
              >发起时间<span class="caret-wrapper"
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
              size="medium"
              icon="el-icon-refresh"
              @click="reset"
              plain
              >刷新</el-button
            >
          </div>
          <div class="right">
            <!-- <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleAdd"
              >新增
            </el-button> -->
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
          @row-click="edit"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
            :index="indexMethod"
          >
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="wordOrderNo"
            label="工单编号"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="taskCategoryName"
            label="任务分类"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="contentDescribe"
            label="任务描述"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="taskAreas"
            label="任务区域"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="launchTime"
            label="发起时间"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="verifyTime"
            label="核实时间"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="handler"
            label="当前处理人"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="wordOrderNo"
            label="工单状态"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
             
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
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import { queryTaskClassifications } from "@/api/backstage/taskClassification.js";
import { mapGetters } from "vuex";
import { queryList } from "@/api/device/matrix";
import {
  queryListFeed,
  exportList,
  remove,
} from "@/api/taskWorkOrder/taskFeedback";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { getSelected } from "@/util/util.js";
export default {
  name: "monitoringRecord",
  data() {
    return {
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
      taskClassificationList: [],
      orderStateOptions: JSON.parse(
        window.localStorage.getItem("orderStateOptions")
      ),
      areaList: [],
      open: false,
      value1: "",
      value2: "",
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      tableData: [],
      form: {
        mainStationids: [], //所属组织
        taskCategories: [], //任务分类
        contentDescribe: "", //任务描述
        taskAreas: [], //任务区域
        launchStarttime: "", //发起开始时间
        launchEndtime: "", //发起结束时间
        verifyStarttime: "", //核实开始时间
        verifyEndtime: "", //核实结束时间
        wordOrderStates: [], //任务状态
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
    };
  },
  computed: {
    ...mapGetters(["colorName"]),
  },
  mounted() {
    this.getqueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    queryTaskClassifications({}).then((res) => {
      this.taskClassificationList = res.data.data;
    });
    queryList({}).then((res) => {
      this.areaList = res.data.data.pageData;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.setUI();
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
    edit(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailTaskFeedback",
        query: { id: row.id },
      });
    },
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ ids: this.multipleSelection }).then(() => {
          this.searchData();
        });
      });
    },
    indexMethod(index) {
      return index + 1 + (this.pageNum - 1) * this.pageSize;
    },
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    visibleChangetime() {
      this.searchData();
    },
    getqueryList(data) {
      queryListFeed(data).then((res) => {
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
    // 查询
    searchData() {
      this.form.launchStarttime = this.value1 == "" ? "" : this.value1[0];
      this.form.launchEndtime = this.value1 == "" ? "" : this.value1[1];
      this.form.verifyStarttime = this.value2 == "" ? "" : this.value2[0];
      this.form.verifyEndtime = this.value2 == "" ? "" : this.value2[1];
      this.getqueryList({
        ...this.form,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form = {
        mainStationids: [], //所属组织
        taskCategories: [], //任务分类
        contentDescribe: "", //任务描述
        taskAreas: [], //任务区域
        launchStarttime: "", //发起开始时间
        launchEndtime: "", //发起结束时间
        verifyStarttime: "", //核实开始时间
        verifyEndtime: "", //核实结束时间
        wordOrderStates: [], //任务状态
      };
      this.value1 = [];
      this.value2 = [];
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      this.form.launchStarttime = this.value1 == "" ? "" : this.value1[0];
      this.form.launchEndtime = this.value1 == "" ? "" : this.value1[1];
      this.form.verifyStarttime = this.value2 == "" ? "" : this.value2[0];
      this.form.verifyEndtime = this.value2 == "" ? "" : this.value2[1];
      exportList({
        ...this.form,
        ids: this.multipleSelection,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "设备台账列表.xls"; //下载的文件名
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
        this.orderColumn = this.sort2 == "no" ? "" : "launch_time";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
  },
};
</script>


<style lang='scss' scoped>
.substation {
  .box-card {
    overflow: auto;
    height: calc(100vh - 124px);
  }
  .title-content {
    /deep/.el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 20px;
      }
    }
  }
  /deep/ .el-table thead {
    color: #333;
  }

  .title-btn {
    margin-left: 50px;
  }
  .content {
    margin-top: 10px;
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
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
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
