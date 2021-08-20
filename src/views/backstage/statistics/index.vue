<template>
  <div class="backstage-index">
    <el-card class="box-card">
      <div style="display: flex">
        <el-form ref="form" :model="form" label-width="110px">
          <el-form-item label="数值记录名称：">
            <el-input
              v-model="form.daName"
              placeholder="请输入内容"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
        </el-form>
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
      </div>
      <div class="content">
        <div class="content-title">
          <div class="left" ref="UI">
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
            <!-- <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="handleExport"
              >导出
            </el-button> -->
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
          <el-table-column label="名称" prop="daName" align="center">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column label="默认值" prop="daValue" align="center" />
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
      width="500px"
      append-to-body
      @close="resetForm('addForm')"
    >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="70px">
        <el-form-item label="名称" prop="daName">
          <el-input v-model="addForm.daName"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="daValue">
          <el-input v-model="addForm.daValue"></el-input>
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
      width="500px"
      append-to-body
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="70px"
      >
        <el-form-item label="名称" prop="daName">
          <el-input
            :disabled="compileShow"
            v-model="editForm.daName"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input :disabled="compileShow" v-model="editForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="daValue">
          <el-input
            :disabled="compileShow"
            v-model="editForm.daValue"
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSelected } from "@/util/util.js";
import {
  queryList,
  add,
  edit,
  remove,
  exportList
} from "@/api/backstage/statistics.js";
export default {
  name: "Grouping",
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      options2: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      total: 0,
      current: 1,
      orderColumn: "",
      orderType: "",
      tableData: [],
      form: {
        daName: "",
        test: []
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      pageNum: 1,
      pageSize: 10,
      addVisible: false,
      addForm: {},
      editVisible: false,
      editForm: {},
      compileShow: false,
      rules: {
        daName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        daValue: [{ required: true, message: "请输入默认值", trigger: "blur" }]
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
      queryList(data).then(res => {
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
      this.getQueryList({
        daName: this.form.daName,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
    },
    // 重置主表数据
    reset() {
      this.form.daName = "";
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.searchData();
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let idList = [];
        this.multipleSelection.forEach(item => {
          idList.push(item.id);
        });
        remove({ idList }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.addVisible = true;
    },
    // 导出
    handleExport() {
      exportList({
        daName: this.form.daName, //类别名称
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
          link.download = "分组类别.xls"; //下载的文件名
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
          add([this.addForm]).then(() => {
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
            edit(this.editForm).then(() => {
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
