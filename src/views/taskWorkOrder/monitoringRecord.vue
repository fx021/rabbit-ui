<template>
  <div class="substation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationIds"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              @visible-change="visibleChange"
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
          <el-form-item label="紧急程度：">
            <el-select
              v-model="form.urgentLevels"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              @visible-change="visibleChange"
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
          <el-form-item label="记录类型：">
            <el-select
              v-model="form.recordTypes"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              @visible-change="visibleChange"
              placeholder="请选择"
            >
              <el-option
                v-for="item in recordTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单状态：">
            <el-select
              v-model="form.wordOrderStates"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
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
          <el-form-item label="发起时间：">
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @visible-change="visibleChange"
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
            <el-button type="primary" size="small" plain @click="add"
              >新增
            </el-button>
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
            prop="launchTime"
            label="发起时间"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="urgentLevel"
            label="紧急程度"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.urgentLevel | filterOptions(urgencyOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="recordType"
            label="记录类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.recordType | filterOptions(recordTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="终结时间"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="resultJudgment"
            label="结果判定"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.resultJudgment | filterOptions(resultJudgmentOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="wordOrderState"
            label="工单状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.wordOrderState | filterOptions(orderStateOptions) }}
            </template>
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
import { mapGetters } from "vuex";
import { getSelected } from "@/util/util.js";
import {
  queryList,
  exportList,
  remove,
} from "@/api/taskWorkOrder/monitoringRecord";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  name: "monitoringRecord",
  data() {
    return {
      urgencyOptions: JSON.parse(
        window.localStorage.getItem("urgencyOptions") //紧急程度
      ),
      recordTypeOptions: JSON.parse(
        window.localStorage.getItem("recordTypeOptions") //记录类型
      ),
      orderStateOptions: JSON.parse(
        window.localStorage.getItem("orderStateOptions") //工单状态
      ),
      resultJudgmentOptions: JSON.parse(
        window.localStorage.getItem("resultJudgmentOptions") //结果判定
      ),
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      tableData: [],
      value1: [],
      form: {
        mainStationIds: [], //所属组织集合
        urgentLevels: [], //紧急程度集合
        recordTypes: [], //记录类型集合
        startTime: "", //发起开始时间
        endTime: "", //发起结束时间
        wordOrderStates: [], //工单状态集合
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
    };
  },
  computed: {
    ...mapGetters(["colorName"]),
  },
  activated() {
    this.getqueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.setUI();
  },
  mounted() {
    this.getqueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
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
        path: "./detailmonitoringRecord",
        query: { id: row.id },
      });
    },
    //新建
    add() {
      this.$router.push({
        path: "./addmonitoringRecord",
      });
    },
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ ids: this.multipleSelection }).then(() => {
          this.searchData();
        });
      });
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
    },
    // 查询
    searchData() {
      this.form.startTime = this.value1 == null ? "" : this.value1[0];
      this.form.endTime = this.value1 == null ? "" : this.value1[1];
      this.getqueryList({
        ...this.form,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    // 重置主表数据
    reset() {
      this.form = {
        mainStationIds: [], //所属组织集合
        urgentLevels: [], //紧急程度集合
        recordTypes: [], //记录类型集合
        startTime: "", //发起开始时间
        endTime: "", //发起结束时间
        wordOrderStates: [], //工单状态集合
      };
      this.value1 = [];
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportList({
        ...this.form,
        ids: this.multipleSelection,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
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
          link.download = "监控记录列表.xls"; //下载的文件名
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
      console.log("handlePageChange");
      this.pageNum = pageNum;
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
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
