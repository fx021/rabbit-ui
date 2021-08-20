<template>
  <div class="substation">
    <el-card class="box-card">
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
          <el-form-item label="年月" prop="time">
            <el-date-picker
              v-model="form.time"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择"
              @blur="visibleChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排班类型：">
            <el-select
              v-model="form.workTypeList"
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
                v-for="item in workTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效：">
            <el-select
              v-model="form.isEffective"
              filterable
              allow-create
              collapse-tags
              @visible-change="visibleChange"
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in choose"
                :key="item.id"
                :label="item.key"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排班编号：">
            <el-input
              style="width: 217px"
              v-model="form.code"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
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
              icon="el-icon-document-copy"
              @click="copy"
              >复制
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="addWorkArrange"
              >新增
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              class="el-icon-delete"
              @click="deletes"
              >批量删除
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
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column
            label="排班标题"
            prop="title"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column label="年月" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.year }}-{{ scope.row.month }}
            </template>
          </el-table-column>
          <el-table-column
            label="排班编号"
            prop="code"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="排班类型"
            prop="workType"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{
                scope.row.attendanceTypeCodes
                  | filterOptions(attendanceTypeCodeListoption)
              }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="isEffective"
            label="是否有效"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <i
                :class="
                  scope.row.isEffective == 1
                    ? 'el-icon-success'
                    : 'el-icon-error'
                "
                :style="{
                  color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C',
                }"
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            label="修改人"
            prop="updateByUserName"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="修改时间"
            prop="updateTime"
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
      <el-backtop target=".box-card" :visibility-height="100" :bottom="70">
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
import { getSelected } from "@/util/util.js";
import { mapGetters } from "vuex";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import {
  copyShift,
  arrangeRemove,
  arrangeQueryPage,
} from "@/api/workArrange/workArrange";
export default {
  name: "componentAccount",
  data() {
    return {
      choose: [
        { key: "是", id: "1" },
        { key: "否", id: "0" },
      ],
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      sort1: "no",
      sort2: "no",
      tableData: [],
      form: {
        mainStationIdList: [],
        time: "",
        workTypeList: [],
        isEffective: "",
        code: "",
      },
      multipleSelection: [],
      workTypeOptions: JSON.parse(localStorage.getItem("workTypeOptions")),//排班类型
    };
  },
  computed: {
    ...mapGetters(["colorName"]),
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
  },
  mounted() {
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.getarrangeQueryPage({
      mainStationIdList: [],
      time: "",
      workTypeList: [],
      isEffective: "",
      code: "",
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    this.setUI();
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    copy() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      if (this.multipleSelection.length > 1)
        return this.$message.warning("每次只能复制一条!");
      let planMainId = this.multipleSelection[0];
      copyShift({ workShiftId: planMainId }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("复制成功");
        }
        this.searchData();
      });
    },

    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        arrangeRemove({
          workShiftIds: this.multipleSelection,
        }).then((res) => {
          if (res.data.code == "200") {
            this.$message({
              message: "删除成功!",
              type: "success",
            });
            this.searchData();
          } else {
            this.$message.error("删除失败");
            this.searchData();
          }
        });
      });
    },
    getarrangeQueryPage(data) {
      if (data.time) {
        data.year = data.time.split("-")[0]; //年份
        data.month = data.time.split("-")[1]; //月份
      }
      arrangeQueryPage(data).then((res) => {
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
    //新建
    addWorkArrange() {
      this.$router.push({
        path: "./newWorkArrange",
        query: { type: 'add' },
      });
    },
    //详情
    edit(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./workArrangeDetail",
        query: { id: row.id },
      });
    },
    // 查询
    searchData() {
      this.getarrangeQueryPage({
        ...this.form,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    //排序
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : this.sort1 == true
          ? (this.sort1 = "no")
          : (this.sort1 = true);
        this.orderColumn = this.sort1 == "no" ? "" : "main_station";
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
    // 重置主表数据
    reset() {
      this.form = {
        mainStationIdList: [],
        time: "",
        workTypeList: [],
        isEffective: "",
        code: "",
      };
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
  },
};
</script>

<style lang="scss" scoped>
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
  /deep/ .el-table thead {
    color: #333;
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
