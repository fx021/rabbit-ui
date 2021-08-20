<template>
  <div class="substation">
    <el-card class="box-card">
      <el-backtop target=".box-card" :visibility-height="100" :bottom="70">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          style="font-size: 24px; padding: 6px; transform: rotate(180deg)"
        ></el-button>
      </el-backtop>
      <div class="title-content" style="display: flex">
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
          style="padding-right: 70px"
        >
          <el-form-item label="班次名称：">
            <el-input
              style="width: 217px"
              v-model="form.workShiftName"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="出勤类型：">
            <el-select
              v-model="form.attendanceTypeCodeList"
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in attendanceTypeCodeListoption"
                :key="item.id"
                :label="item.key"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
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
            <el-button type="primary" size="small" plain @click="sort(1)"
              >排序号<span class="caret-wrapper"
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
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="updataDialogVisible = true"
              >导入
            </el-button>
            <el-button type="warning" size="small" plain @click="handleExport"
              >导出
            </el-button>
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
              @click="addAlarmInformation"
              >新增
            </el-button>
            <el-button type="danger" size="small" plain @click="deletes"
              >删除
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
            label="所属组织"
            prop="mainStationNames"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column label="班次名称" prop="workShiftName" align="center">
          </el-table-column>
          <el-table-column label="时间段数量" prop="timeCount" align="center">
          </el-table-column>
          <el-table-column label="月份" prop="months" align="center">
          </el-table-column>
          <el-table-column
            label="出勤类型"
            prop="attendanceTypeNames"
            align="center"
          >
            <template slot-scope="scope">
              {{
                scope.row.attendanceTypeCodes
                  | filterOptions(attendanceTypeCodeListoption)
              }}
            </template>
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
    <el-dialog
      title="导入"
      :visible.sync="updataDialogVisible"
      v-if="updataDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="500px"
    >
      <el-upload
        action="#"
        accept=".xls, .xlsx"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="bulkImport"
        style="margin-bottom: 20px; display: flex; justify-content: center"
        class="upload-demo"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或点击上传
          <el-button type="text" @click.stop="downloadTemplate"
            >下载模板</el-button
          >
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getSelected } from "@/util/util.js";
import { mapGetters } from "vuex";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import {
  queryList,
  exportShift,
  copyShift,
  remove,
  download,
  importList,
} from "@/api/backstage/shiftConfiguration";
export default {
  name: "componentAccount",
  data() {
    return {
      updataDialogVisible: false,
      choose: [
        { key: "是", id: "1" },
        { key: "否", id: "0" },
      ],
      attendanceTypeCodeListoption: [
        { key: "缺勤", id: "X" },
        { key: "休息", id: "R" },
        { key: "出勤(正常)", id: "W" },
        { key: "出勤(加班)", id: "WJ" },
        { key: "出勤(值班)", id: "W1" },
      ],
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      sort2: "no",
      tableData: [],
      form: {
        workShiftName: "",
        mainStationIdList: [],
        attendanceTypeCodeList: [],
        isEffective: "",
      },
      multipleSelection: [],
    };
  },
    computed: {
    ...mapGetters(["colorName"]),
  },
  created() {},
  filters: {
    filterOptions: function (value, optionList) {
      let str = optionList.find((res) => {
        return res.id == value;
      });
      if (str) {
        return str.key;
      } else {
        return value;
      }
    },
  },
  activated() {
    this.getqueryList({ pageNum: this.pageNum, pageSize: this.pageSize });
  },
  mounted() {
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.getqueryList({
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
    handleExport() {
      if (this.tableData.length < 1) return;
      exportShift({
        ...this.form,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
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
          link.download = "班次配置列表.xls"; //下载的文件名
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
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({
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
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    //新建
    addAlarmInformation() {
      this.$router.push({
        path: "./addShiftConfiguration",
      });
    },
    //详情
    edit(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailShiftConfiguration",
        query: { id: row.id },
      });
    },
    // 查询
    searchData() {
      this.getqueryList({
        ...this.form,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    //下载模板
    downloadTemplate() {
      download("import_work_shift").then((res) => {
        const link = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        console.log(res);
        // link.download = res.headers['content-disposition'] //下载后文件名
        link.download = "班次配置模板.xlsx"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 导入
    bulkImport(file) {
      importList(file.raw).then(res => {
        this.$message.success("导入成功");
        this.updataDialogVisible = false;
        this.searchData();
      });
    },
    //排序
    sort(num) {
      if (num == 1) {
        this.sort2 == "no"
          ? (this.sort2 = false)
          : this.sort2 == true
          ? (this.sort2 = "no")
          : (this.sort2 = true);
        this.orderColumn = this.sort2 == "no" ? "" : "sort";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 重置主表数据
    reset() {
      this.form = {
        workShiftName: "",
        mainStationIdList: [],
        attendanceTypeName: "",
        isEffective: "",
      };
      this.sort2 = "no";
      this.orderType = "";
      this.orderColumn="";
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
