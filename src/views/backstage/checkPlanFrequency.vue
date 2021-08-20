<template>
  <div class="checkPlanFrequency">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="巡检名称：">
            <el-input
              v-model="form.checkFrequencyName"
              placeholder="请输入内容"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="频率：">
            <el-select
              v-model="form.frequencyIds"
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
                v-for="item in frequencyOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行次数：">
            <el-input
              v-model="form.size"
              placeholder="请输入内容"
              @keyup.enter.native="searchData"
              oninput="value=value.replace(/[^0-9]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否有效：" prop="isEffective">
            <el-select
              v-model="form.isEffective"
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in isEffectiveList"
                :key="item.isEffectiveId"
                :label="item.isEffectiveName"
                :value="item.isEffectiveId"
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
      </div>
      <div class="content">
        <div class="content-title">
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort(0)"
              >排序号<span class="caret-wrapper"
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
          style="width: 100%; overflow-y: auto"
          @selection-change="handleSelectionChange"
          @row-click="details"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column
            prop="checkFrequencyName"
            label="名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="frequencyId"
            label="频率"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.frequencyId | filterOptions(frequencyOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            label="执行次数"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="triggerTime"
            label="触发时间"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
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
                  color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C',
                }"
              ></i>
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
import {
  checkPlanQueryList,
  checkPlanRemove,
  exportPlanFrequencyList,
} from "@/api/backstage/checkPlanFrequency";
import { mapGetters } from "vuex";
import mySelect from "@/components/select/select.vue";
import { getSelected } from "@/util/util.js";
export default {
  name: "checkPlanFrequency",
  components: { mySelect },
  data() {
    return {
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      frequencyOptions: JSON.parse(
        window.localStorage.getItem("frequencyOptions")
      ),
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      form: {
        frequencyIds: [],
        isEffective: "",
        checkFrequencyName: "",
        size: "",
      },
      multipleSelection: [],
      isEffectiveList: [
        {
          isEffectiveId: 1,
          isEffectiveName: "有效",
        },
        {
          isEffectiveId: 0,
          isEffectiveName: "无效",
        },
      ],
      sort1: "no",
    };
  },
  created() {},
  computed: {
    ...mapGetters(["colorName"]),
  },
  mounted() {
    this.getCheckPlanQueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    this.setUI();
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getCheckPlanQueryList(data) {
      console.log(data);
      checkPlanQueryList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查询
    searchData() {
      this.getCheckPlanQueryList({
        checkFrequencyName: this.form.checkFrequencyName,
        frequencyIds: this.form.frequencyIds,
        size: this.form.size,
        isEffective: this.form.isEffective,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.checkFrequencyName = "";
      this.form.frequencyIds = [];
      this.form.size = "";
      this.form.isEffective = "";
      this.current = 1;
      this.pageNum = 1;
      this.pageSize = 10;
      this.orderColumn = "";
      this.orderType = "";
      this.searchData();
    },
    // 批量删除
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let planFrequencyIds = [];
        // let planFrequencyEffectiveIds = [];
        this.multipleSelection.forEach((item) => {
          planFrequencyIds.push(item.id);
          if (item.checkPlanFrequencyEffectiveResponseList) {
            // item.checkPlanFrequencyEffectiveResponseList.forEach((item) => {
            //   planFrequencyEffectiveIds.push(item.id);
            // });
          }
        });
        // planFrequencyEffectiveIds
        checkPlanRemove({ planFrequencyIds,  }).then(
          () => {
            this.searchData();
          }
        );
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newCheckPlanFrequency" });
    },
    // 详情
    details(data) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailsCheckPlanFrequency",
        query: { id: data.id },
      });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportPlanFrequencyList({
        checkFrequencyName: this.form.checkFrequencyName,
        frequencyIds: this.form.frequencyIds,
        size: this.form.size,
        isEffective: this.form.isEffective,
        // orderColumn: this.orderColumn,
        // orderType: this.orderType,
        // pageNum: this.pageNum,
        // pageSize: this.pageSize,
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "巡检频率配置.xls"; //下载的文件名
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
    sort(num) {
      if (num == 0) {
        this.orderColumn = "sort";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : !this.sort1
          ? (this.sort1 = !this.sort1)
          : ((this.sort1 = "no"), (this.orderColumn = ""));
        this.orderType = this.sort1 === "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
  },
};
</script>


<style lang='scss' scoped>
.checkPlanFrequency {
  .box-card {
    overflow-y: auto;
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
    }
    /deep/.el-table__header-wrapper {
      .cell {
        color: #333;
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
</style>
