<template>
  <div class="backstage-index">
    <el-card class="box-card">
      <el-form
        ref="form"
        :model="form"
        style="display: flex; flex-wrap: wrap"
        label-width="120px"
      >
        <el-form-item label="标题：">
          <el-input
            style="width: 217px"
            v-model="form.taskName"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属组织：">
          <el-select
            style="width: 217px"
            v-model="form.mainStationIdList"
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
        <el-form-item label="计划分类：">
          <el-select
            style="width: 217px"
            v-model="form.planTypeList"
            multiple
            collapse-tags
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in planTypeList"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务分类：">
          <el-select
            style="width: 217px"
            v-model="form.taskClassList"
            multiple
            collapse-tags
            @visible-change="visibleChange"
            placeholder="请选择"
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
        <el-form-item label="所属巡检计划：">
          <el-input
            style="width: 217px"
            v-model="form.planCode"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="巡检任务编号：" v-show="open">
          <el-input
            style="width: 217px"
            v-model="form.taskCode"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
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
        <el-form-item label="巡检结果" v-show="open">
          <el-select
            style="width: 217px"
            v-model="form.checkResult"
            multiple
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in checkResultOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派发状态" v-show="open">
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
          <el-table-column label="标题" prop="taskName" align="center">
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop=""
            align="center"
            :formatter="getMainStationId"
          />
          <el-table-column label="所属计划" prop="planCode" align="center" />
          <el-table-column
            label="巡检任务编号"
            prop="taskCode"
            align="center"
          />
          <el-table-column
            label="计划分类"
            prop="planType"
            align="center"
            :formatter="planTypeFormatter"
          />
          <el-table-column label="巡检状态" prop="checkState" align="center">
            <template slot-scope="scope">
              {{ scope.row.checkState | filterOptions(checkStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="执行状态" prop="exeState" align="center">
            <template slot-scope="scope">
              {{ scope.row.exeState | filterOptions(exeStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="任务状态" prop="taskState" align="center">
            <template slot-scope="scope">
              {{ scope.row.taskState | filterOptiones(taskStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="巡检结果" prop="checkResult" align="center">
            <template slot-scope="scope">
              {{ scope.row.checkResult | filterOptions(checkResultOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="派发状态" prop="assignState" align="center">
            <template slot-scope="scope">
              {{ scope.row.assignState | filterOptions(assignStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column label="任务分类" prop="taskClass" align="center">
            <template slot-scope="scope">
              {{ scope.row.taskClass | filterOptions(frequencyOptions) }}
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
    </el-card>
  </div>
</template>

<script>
import {
  queryChecktaskList,
  exportChecktaskList,
  remove,
} from "@/api/taskManagement/patrolTask";
import { getSelected } from "@/util/util.js";
import { queryMainStationDropDownList } from "@/api/planManage/deviceInspection.js";
import { mapGetters } from "vuex";
export default {
  name: "patrolTask",
  data() {
    return {
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
      frequencyOptions: JSON.parse(
        window.localStorage.getItem("frequencyOptions")
      ),
      open: false,
      total: 0,
      current: 1,
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      mainStationList: [],
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
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      pageNum: 1,
      pageSize: 10,
    };
  },
  created() {},
  mounted() {
    this.getQueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    this.getQueryMainStationDropDownList({});
    this.planTypeList = JSON.parse(localStorage.getItem("planTypeOptions"));
    this.setUI();
  },
  activated() {
      this.searchData();
  },
  computed: {
    ...mapGetters(["colorName"]),
  },
  filters: {
    filterOptiones: function (value, optionList) {
      let str = [];
      optionList.find((res) => {
        value.split(",").forEach((v) => {
          if (res.dictKey == v) {
            str.push(res.dictValue);
          }
        });
      });
      if (str.length > 0) {
        return str.toString();
      } else {
        return value;
      }
    },
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
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getQueryList(data) {
      queryChecktaskList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    getQueryMainStationDropDownList(data) {
      queryMainStationDropDownList(data).then((res) => {
        this.mainStationList = res.data.data;
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
        id: "",
        taskClassList: this.form.taskClassList,
        taskName: this.form.taskName,
        taskCode: this.form.taskCode,
        planCode: this.form.planCode,
        planTypeList: this.form.planTypeList,
        mainStationIdList: this.form.mainStationIdList,
        checkResultList: this.form.checkResult,
        taskStateList: this.form.taskState,
        checkStateList: this.form.checkState,
        exeStateList: this.form.exeState,
        assignStateList: this.form.assignState,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      (this.form.taskClassList = []), (this.form.planCode = "");
      this.form.taskName = "";
      this.form.taskCode = "";
      this.form.checkResult = [];
      this.form.assignState = [];
      this.form.taskState = [];
      this.form.exeState = [];
      this.form.checkState = [];
      this.form.mainStationIdList = [];
      this.form.planTypeList = [];
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ idList: this.multipleSelection }).then(() => {
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
      exportChecktaskList({
        id: "",
        taskClassList: this.form.taskClassList,
        taskName: this.form.taskName,
        planTypeList: this.form.planTypeList,
        mainStationIdList: this.form.mainStationIdList,
        checkResult: this.form.checkResult,
        taskCode: this.form.taskCode,
        planCode: this.form.planCode,
        taskState: this.form.planCode,
        checkState: this.form.checkState,
        exeState: this.form.exeState,
        assignState: this.form.assignState,
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
          link.download = "巡检任务.xls"; //下载的文件名
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
    getMainStationId(row) {
      let result = row.mainStationId;
      this.mainStationList.map((v) => {
        if (v.id === result) {
          result = v.mainStationName;
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
        path: "./detailPatrolTask",
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
