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
      <el-form
        ref="form"
        :model="form"
        style="display: flex;flex-wrap: wrap;"
        label-width="85px"
      >
        <el-form-item label="标题：">
          <el-input
            style="width: 217px"
            v-model="form.planName"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
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
        <el-form-item label="是否有效：">
          <el-select
            style="width: 217px"
            v-model="form.isEffective"
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划状态：">
          <el-select
            style="width: 217px"
            v-model="form.planStateList"
            @visible-change="visibleChange"
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in planStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
              >创建时间<span class="caret-wrapper"
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
              type="warning"
              size="small"
              plain
              :disabled="multipleSelection.length !== 1"
              icon="el-icon-document-checked"
              @click="handleCopy"
              >复制
            </el-button>
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
            label="标题"
            prop="planName"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            align="center"
          />
          <el-table-column
            label="计划分类"
            prop="planType"
            align="center"
            :formatter="planTypeFormatter"
          />
          <el-table-column
            label="计划编号"
            prop="planCode"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column label="有效年度" prop="year" align="center" />
          <el-table-column
            prop="isEffective"
            label="是否有效"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <i
                :class="
                  scope.row.isEffective == 1
                    ? 'el-icon-success'
                    : 'el-icon-error'
                "
                :style="{
                  color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C'
                }"
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            label="计划状态"
            prop="planState"
            align="center"
            :formatter="planStateFormat"
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
import { getSelected } from "@/util/util.js";
import {
  queryMainStationDropDownList,
  copyPlan,
  queryCheckPlanMainList,
  removePlan,
  exportCheckPlanMainList
} from "@/api/planManage/deviceInspection.js";
import { mapGetters } from "vuex";
export default {
  name: "Grouping",
  data() {
    return {
      tableHeight: null,
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
        { value: 0, label: "否" }
      ],
      planStateList: [
        { value: "draft", label: "草稿" },
        { value: "audit", label: "审批中" },
        { value: "published", label: "已发布" },
        { value: "abandoned", label: "废弃" }
      ],
      form: {
        planName: "",
        isEffective: "",
        mainStationIdList: [],
        planTypeList: [],
        planStateList: []
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      pageNum: 1,
      pageSize: 10
    };
  },
  created() {},
  mounted() {
    this.getQueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize
    });
    this.getQueryMainStationDropDownList({});
    this.planTypeList = JSON.parse(localStorage.getItem("planTypeOptions"));
    this.setUI();
    // window.addEventListener("resize", this.getTableHeight);
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
  },
  // destroyed() {
  //   window.removeEventListener("resize", this.getTableHeight);
  // },
  // deactivated() {
  //   window.removeEventListener("resize", this.getTableHeight);
  // },
  computed: {
    ...mapGetters(["colorName"])
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
    indexMethod(index) {
      return index + 1 + (this.pageNum - 1) * this.pageSize;
    },
    getQueryList(data) {
      queryCheckPlanMainList(data).then(res => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        // this.getTableHeight();
      });
    },
    getQueryMainStationDropDownList(data) {
      queryMainStationDropDownList(data).then(res => {
        this.mainStationList = res.data.data;
      });
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
      this.getQueryList({
        planName: this.form.planName,
        planTypeList: this.form.planTypeList,
        mainStationIdList: this.form.mainStationIdList,
        isEffective: this.form.isEffective,
        planStateList: this.form.planStateList,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
    },
    // 重置主表数据
    reset() {
      this.form.planName = "";
      this.form.isEffective = "";
      this.form.mainStationIdList = [];
      this.form.planTypeList = [];
      this.form.planStateList = [];
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.searchData();
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let planIdList = [];
        this.multipleSelection.forEach(item => {
          planIdList.push(item.planId);
        });
        removePlan({ planIdList }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newDeviceInspection" });
    },
    // 复制
    handleCopy() {
      let planMainId = this.multipleSelection[0].planId;
      copyPlan({ planMainId }).then(() => {
        this.searchData();
      });
    },
    // 导出
    handleExport() {
      exportCheckPlanMainList({
        planName: this.form.planName,
        planTypeList: this.form.planTypeList,
        mainStationIdList: this.form.mainStationIdList,
        isEffective: this.form.isEffective,
        planStateList: this.form.planStateList,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType //排序类型 desc降序,asc升序
      })
        .then(res => {
          console.log(res);
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "巡检计划.xls"; //下载的文件名
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
    planTypeFormatter(row) {
      let result = row.planType;
      this.planTypeList.map(v => {
        if (v.dictKey === row.planType) {
          result = v.dictValue;
        }
      });
      return result;
    },
    planStateFormat(row) {
      let result = row.planState;
      this.planStateList.forEach(ele => {
        if (ele.value === row.planState) {
          result = ele.label;
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
      this.$router.push({
        path: "./deviceInspectionDetail",
        query: {
          id: row.planId
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
</style>
