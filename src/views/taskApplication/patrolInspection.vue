<template>
  <div class="substation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="标题：">
            <el-input
              style="width: 217px"
              @keyup.enter.native="searchData"
              v-model="form.title"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationIds"
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
                v-for="item in mainStationOptions"
                :key="item.id"
                :label="item.mainStationName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态：">
            <el-select
              v-model="form.taskState"
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
          <el-form-item label="申请编号：">
            <el-input
              style="width: 217px"
              v-model="form.applyNo"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
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
      <div class="content">
        <div class="content-title">
          <!-- v-if="permission.user_delete" -->
          <div class="left">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort()"
              >创建时间<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort2 == 'no' ? '' : sort2 ? '' : '#409eff',
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort2 == 'no' ? '' : sort2 ? '#409eff' : '',
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
          <el-table-column label="标题" prop="title" align="center">
          </el-table-column>
          <el-table-column prop="taskStatus" label="任务状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.taskStatus | filterOptions(taskStateOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="applyNo"
            label="申请编号"
            align="center"
            show-overflow-tooltip
          >
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
import { getSelected } from "@/util/util.js";
import { queryList } from "@/api/taskApplication/patrolInspection";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  name: "equipmentAccount",
  data() {
    return {
      taskStateOptions: JSON.parse(
        window.localStorage.getItem("taskStateOptions")
      ),
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      form: {
        title: "", // 标题,
        mainStationIds: [], // 所属总站
        applyNo: "", // 申请编号
        taskState: "", //任务状态  (字典)
      },
      multipleSelection: [],
      sort2: "no",
    };
  },
  created() {},
  mounted() {
    this.getqueryList({
      title: "",
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
  },
  activated() {
     this.getqueryList({
      title: "",
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
  },
  computed: {},
  filters: {
    filterOptions: function (value, optionList) {
      let str=[];
       optionList.find((res) => {
        value.split(",").forEach((v) => {
          if(res.dictKey == v){
            str.push(res.dictValue)
          } 
        });
      });
      if (str.length>0) {
        return str.toString();
      } else {
        return value;
      }
    },
  },
  methods: {
    getqueryList(data) {
      queryList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    edit(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailpatrolInspection",
        query: { id: row.id },
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
      this.getqueryList({
        title: this.form.title, // 标题,
        mainStationIds: this.form.mainStationIds, // 所属总站
        applyNo: this.form.applyNo, // 申请编号
        taskState: this.form.taskState, //任务状态  (字典)
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    visibleChanges(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 重置主表数据
    reset() {
      this.form.title = "";
      this.form.mainStationIds = [];
      this.form.applyNo = "";
      this.form.taskState = [];
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
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
    sort() {
      this.sort2 == "no"
        ? (this.sort2 = false)
        : this.sort2 == true
        ? (this.sort2 = "no")
        : (this.sort2 = true);
      this.orderColumn = this.sort2 == "no" ? "" : "create_time";
      this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
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
    display: flex;
    float: right;
    margin-bottom: 10px;
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
