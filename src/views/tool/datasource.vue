<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="permission.datasource_delete"
          @click="handleDelete"
        >删 除</el-button>
      </template>
      <template slot="menuForm" slot-scope="scope">
        <el-button
          type="warning"
          plain
          @click="connectTest"
          :size="scope.size"
          :loading="scope.disabled"
          style="float:left"
        >连接测试</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, add, update, remove, connect } from "@/api/tool/datasource";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 50,
        labelWidth: 100,
        dialogWidth: 900,
        menuWidth: 200,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "名称",
            prop: "name",
            width: 130,
            rules: [{
              required: true,
              message: "请输入数据源名称",
              trigger: "blur"
            }]
          },
          {
            label: "数据库类型",
            prop: "sourceType",
            type: 'select',
            dataType: 'number',
            dicData: [
              {
                label: 'MySQL',
                value: 0,
              }, {
                label: 'Oracle',
                value: 1,
              }, {
                label: 'SqlServer',
                value: 2,
              }, {
                label: 'PostgreSQL',
                value: 3,
              }
            ],
            width: 95,
            rules: [{
              required: true,
              message: "请输入数据库类型",
              trigger: "blur"
            }]
          },
          {
            label: "用户名",
            prop: "username",
            width: 95,
            rules: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            }]
          },
          {
            label: "密码",
            prop: "password",
            type: 'password',
            placeholder: '保存后加密',
            hide: true,
            rules: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            }]
          },
          {
            label: "连接地址",
            prop: "url",
            span: 24,
            rules: [{
              required: true,
              message: "请输入连接地址",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "remark",
            span: 24,
            minRows: 3,
            hide: true,
            type: "textarea"
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.datasource_add, false),
        viewBtn: this.vaildData(this.permission.datasource_view, false),
        delBtn: this.vaildData(this.permission.datasource_delete, false),
        editBtn: this.vaildData(this.permission.datasource_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    rowSave(row, done, loading) {
      if (this.testing) {
        loading()
        return
      }
      add(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      if (this.testing) {
        loading()
        return
      }
      if (row.password) {
        row.password = row.password.trim()
        if (!row.password || row.password == '1') {
          row.password = row.oldPass
        }
      }
      update(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      const delMessage = row.status === 1 ?
        "<span><i class='el-icon-warning' style='color: #e6a23c;font-size: 18px;margin-right: 10px'></i>确定将选择数据源删除</span>" :
        "<span><i class='el-icon-warning' style='color: #f56c6c;font-size: 18px;margin-right: 10px'></i>数据源已被使用，是否要删除</span>";

      this.$confirm(delMessage, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if ("edit" === type) {
        if (this.form.password !== '1') {
          this.form.oldPass = this.form.password
        }
        this.form.oldUser = this.form.username
        this.$set(this.form, 'password', '1')
      }
      let col = this.option.column.find(it => it.prop == 'password')
      col.rules[0].required = 'add' === type
      col.placeholder = 'add' === type ? '保存后加密' : '已加密,输入空白或1不修改'
      done();
    },
    searchReset() {
      this.page.currentPage = 1
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      }).catch(() => {
        this.loading = false
      })
    },
    connectTest() {
      this.testing = true
      this.$refs.crud.validate(success => {
        if (!success) {
          this.testing = false
          return
        }
        let row = this.form
        if (row.password) {
          row.password = row.password.trim()
          if (!row.password || row.password == '1') {
            row.password = row.oldPass
          }
        }
        connect(row).then(res => {
          this.$message.success(res.data.msg)
          this.testing = false
          this.$refs.crud.$refs.dialogForm.$refs.tableForm.hide()
        }).catch(() => {
          this.testing = false
          this.$refs.crud.$refs.dialogForm.$refs.tableForm.hide()
        })
      })
    }
  }
};
</script>

<style>
</style>
