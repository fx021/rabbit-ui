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
        label-width="110px"
        style="display: flex;flex-wrap: wrap;"
      >
        <el-form-item label="出勤类型：">
          <el-input
            style="width: 217px"
            v-model="form.attendanceTypeName"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="出勤编码：">
          <el-input
            style="width: 217px"
            v-model="form.attendanceTypeCode"
            placeholder="请输入内容"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否值班：">
          <el-select
            style="width: 217px"
            v-model="form.isOnDuty"
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否填写日志：">
          <el-select
            style="width: 217px"
            v-model="form.isWorkLog"
            @visible-change="visibleChange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
              v-for="item in option"
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
        <div class="content-title">
          <div class="left" ref="UI">
            <el-button type="primary" size="small" plain @click="sort(0)"
              >排序号<span class="caret-wrapper"
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
              icon="el-icon-download"
              @click="handleExport"
              >导出
            </el-button>
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="updataDialogVisible = true"
              >导入
            </el-button>
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
            label="出勤类型"
            prop="attendanceTypeName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attendanceTypeCode"
            label="出勤编码"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="isOnDuty"
            label="是否值班"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <i
                :class="
                  scope.row.isOnDuty == 1 ? 'el-icon-success' : 'el-icon-error'
                "
                :style="{
                  color: scope.row.isOnDuty == 1 ? '#67C23A' : '#F56C6C'
                }"
              ></i>
            </template>
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
                  color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C'
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
    </el-card>
    <!-- 新增弹窗 -->
    <el-dialog
      :visible.sync="addVisible"
      title="新增"
      width="900px"
      append-to-body
      @close="resetForm('addForm')"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="110px"
        style="display: flex;flex-wrap: wrap;"
      >
        <el-form-item
          label="出勤类型"
          prop="attendanceTypeName"
          style="width: 50%"
        >
          <el-input v-model="addForm.attendanceTypeName"></el-input>
        </el-form-item>
        <el-form-item
          label="出勤编码"
          prop="attendanceTypeCode"
          style="width: 50%"
        >
          <el-input v-model="addForm.attendanceTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="是否值班" prop="isOnDuty" style="width: 50%">
          <el-select
            v-model="addForm.isOnDuty"
            style="width: 100%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否填写日志" prop="isWorkLog" style="width: 50%">
          <el-select
            v-model="addForm.isWorkLog"
            style="width: 100%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有效" prop="isEffective" style="width: 50%">
          <el-select
            v-model="addForm.isEffective"
            style="width: 100%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否出勤" prop="isAttendance" style="width: 50%">
          <el-select
            v-model="addForm.isAttendance"
            style="width: 100%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="sort" style="width: 50%">
          <el-input
            v-model.number="addForm.sort"
            type="number"
            oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark" style="width: 100%">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button type="primary" @click="submitForm('addForm')"
          >新增</el-button
        >
        <el-button @click="resetForm('addForm')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 详情/编辑弹窗 -->
    <el-dialog
      :visible.sync="editVisible"
      :title="compileShow ? '详情' : '编辑'"
      width="900px"
      append-to-body
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="110px"
        style="display: flex;flex-wrap: wrap;"
      >
        <el-form-item
          label="出勤类型"
          prop="attendanceTypeName"
          style="width: 50%"
        >
          <el-input
            :disabled="compileShow"
            v-model="editForm.attendanceTypeName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="出勤编码"
          prop="attendanceTypeCode"
          style="width: 50%"
        >
          <el-input
            :disabled="compileShow"
            v-model="editForm.attendanceTypeCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否值班" prop="isOnDuty" style="width: 50%">
          <el-select
            :disabled="compileShow"
            v-model="editForm.isOnDuty"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否填写日志" prop="isWorkLog" style="width: 50%">
          <el-select
            :disabled="compileShow"
            v-model="editForm.isWorkLog"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有效" prop="isEffective" style="width: 50%">
          <el-select
            :disabled="compileShow"
            v-model="editForm.isEffective"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否出勤" prop="isAttendance" style="width: 50%">
          <el-select
            :disabled="compileShow"
            v-model="editForm.isAttendance"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="sort" style="width: 50%">
          <el-input
            :disabled="compileShow"
            v-model.number="editForm.sort"
            type="number"
            oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark" style="width: 100%">
          <el-input
            type="textarea"
            :disabled="compileShow"
            v-model="editForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnBox">
        <el-button type="primary" @click="submitEditForm('editForm')">{{
          !compileShow ? "提交" : "编辑"
        }}</el-button>
        <el-button @click="resetEditForm('editForm')">取消</el-button>
      </div>
    </el-dialog>
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
import { mapGetters } from "vuex";
import { getSelected } from "@/util/util.js";
import {
  queryPageList,
  add,
  edit,
  remove,
  importList,
  exportList,
  download
} from "@/api/backstage/attendance.js";
export default {
  name: "Grouping",
  data() {
    return {
      option: [
        { label: "是", value: 1 },
        { label: "否", value: 0 }
      ],
      total: 0,
      current: 1,
      orderColumn: "",
      orderType: "",
      tableData: [],
      form: {
        attendanceTypeName: "",
        attendanceTypeCode: "",
        isOnDuty: "",
        isWorkLog: "",
        isEffective: ""
      },
      multipleSelection: [],
      sort1: "no",
      pageNum: 1,
      pageSize: 10,
      addVisible: false,
      addForm: {
        attendanceTypeName: "", //出勤类型名称
        attendanceTypeCode: "", //出勤类型编码
        isOnDuty: "", //是否值班
        isWorkLog: "", //是否填写日志
        isEffective: "", //是否有效
        isAttendance: "", //是否出勤
        sort: "", //排序号
        remark: "" //备注
      },
      editVisible: false,
      editForm: {},
      compileShow: false,
      updataDialogVisible: false, // 导入弹窗
      rules: {
        attendanceTypeName: [
          { required: true, message: "请输入出勤类型", trigger: "blur" }
        ],
        attendanceTypeCode: [
          { required: true, message: "请输入出勤编码", trigger: "blur" }
        ],
        isOnDuty: [
          { required: true, message: "请选择是否值班", trigger: "change" }
        ],
        isWorkLog: [
          { required: true, message: "请选择是否填写日志", trigger: "change" }
        ],
        isEffective: [
          { required: true, message: "请选择是否有效", trigger: "change" }
        ],
        isAttendance: [
          { required: true, message: "请选择是否出勤", trigger: "change" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.getQueryList({
      pageNum: this.pageNum,
      pageSize: this.pageSize
    });
    this.setUI();
  },
  computed: {
    ...mapGetters(["colorName"])
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    indexMethod(index) {
      return index + 1 + (this.pageNum - 1) * this.pageSize;
    },
    getQueryList(data) {
      queryPageList(data).then(res => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
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
        attendanceTypeName: this.form.attendanceTypeName,
        attendanceTypeCode: this.form.attendanceTypeCode,
        isOnDuty: this.form.isOnDuty,
        isWorkLog: this.form.isWorkLog,
        isEffective: this.form.isEffective,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
    },
    // 重置主表数据
    reset() {
      this.form.attendanceTypeName = "";
      this.form.attendanceTypeCode = "";
      this.form.isOnDuty = "";
      this.form.isWorkLog = "";
      this.form.isEffective = "";
      this.sort1 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.searchData();
    },
    sort() {
      this.sort1 == "no"
        ? (this.sort1 = false)
        : !this.sort1
        ? (this.sort1 = !this.sort1)
        : (this.sort1 = "no");
      this.orderColumn = "sort";
      this.orderType = this.sort1 === "no" ? "" : this.sort1 ? "desc" : "asc";
      this.searchData();
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let workAttendanceTypeIds = [];
        this.multipleSelection.forEach(item => {
          workAttendanceTypeIds.push(item.id);
        });
        remove({ workAttendanceTypeIds }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.addVisible = true;
    },
    //下载模板
    downloadTemplate() {
      download().then(res => {
        const link = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        console.log(res);
        // link.download = res.headers['content-disposition'] //下载后文件名
        link.download = "出勤类型模板.xls"; //下载的文件名
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
    // 导出
    handleExport() {
      exportList({
        attendanceTypeName: this.form.attendanceTypeName,
        attendanceTypeCode: this.form.attendanceTypeCode,
        isOnDuty: this.form.isOnDuty,
        isWorkLog: this.form.isWorkLog,
        isEffective: this.form.isEffective,
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
          link.download = "出勤类型.xls"; //下载的文件名
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
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 详情
    details(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.editVisible = true;
      this.compileShow = true;
      this.editForm = { ...row };
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          add(this.addForm).then(() => {
            this.$message.success("新建成功");
            this.resetForm("addForm");
            this.searchData();
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },
    submitEditForm(formName) {
      if (this.compileShow) {
        this.compileShow = !this.compileShow;
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let param = { ...this.editForm };
            param.workAttendanceTypeId = param.id;
            delete param.id;
            edit(param).then(() => {
              this.$message.success("编辑成功");
              this.editVisible = false;
              this.searchData();
            });
          } else {
            return false;
          }
        });
      }
    },
    resetEditForm(formName) {
      // this.$refs[formName].resetFields();
      this.editVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
// /deep/.el-input.is-disabled .el-input__inner {
//   background-color: #ffffff;
// }
.btnBox {
  display: flex;
  justify-content: center;
}
</style>
