<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :data="data"
      @search-reset="searchReset"
      :option="option"
      @refresh-change="getTables"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      :page.sync="page"
      @row-del="rowDel"
      @search-change="searchChange"
      :table-loading="tableLoading"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          @click="addForm()"
          size="small"
          icon="el-icon-plus"
          v-if="permission.table_add"
        >新 增</el-button>
        <el-button
          type="success"
          size="small"
          @click="addForm(1)"
          icon="el-icon-top"
          v-if="permission.table_import"
        >导入表</el-button>
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          label-width="90px"
          size="small"
          style="display:inline-block; vertical-align: middle; margin-top: 0px;margin-bottom: 2px"
        >
          <el-form-item label="主表名称" style="margin-bottom:0px">
            <el-select
              style="width: 500px"
              v-model="valueMainTable"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              clearable
              :loading="loading"
              @change="mainTable"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-sort"
          size="small"
          :disabled="scope.row.syncStatus != 0"
          v-if="permission.table_sync"
          @click.stop="handleAdd(scope.row, scope.index)"
        >同步</el-button>
        <el-button
          type="text"
          icon="el-icon-edit"
          size="small"
          @click.stop="edit(scope.row)"
          v-if="permission.table_edit"
        >修改</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  selectTables,
  createTable,
  deleteTable,
  selectByHeaderName,
} from "@/api/tool/Administration";
import { getDataSource } from "@/api/tool/businessTable";

export default {
  computed: {
    permission() {
      return this.$store.getters.permission || {}
    }
  },
  data() {
    return {
      syncButto: false,
      data: [],
      form: {},
      // 是否正在从远程获取数据
      loading: false,
      tableLoading: true,
      // 分页
      page: {
        //  每页显示条目个数
        pageSize: 10,
        // 当前页数
        currentPage: 1,
        // 总条数,如果为0的话不显示分页
        total: 0,
        // 页码按钮的数量，当总页数超过该值时会折叠
        pagerCount: 5,
        // 每页显示个数选择器的选项设置
        // pageSizes: [1, 2, 3, 4, 5],
      },
      // 定义的搜索框传值的参数
      search: {
        headerId: "",
        sourceId: "",
        tbName: "",
        tbDescription: "",
      },
      // 主表名称下拉列表的数据
      options: [],
      // 主表名称搜索款的数据
      valueMainTable: [],
      // 主表名称搜索款里面的id
      headerData: {},
      // 表格等待框的控制
      option: {
        height: 'auto',
        calcHeight: 80,
        index: true,
        indexLabel: "序号",
        // 点击空白不关闭弹窗
        dialogClickModal: false,
        // 关闭表格中的添加按钮
        addBtn: false,
        // 关闭表格中的编辑按钮
        editBtn: false,
        // 取消勾选提示
        tip: false,
        align: "center",
        menuAlign: "center",
        // 可以控制搜索按钮的长度使其可以单独成行
        searchMenuSpan: 6,
        column: [
          {
            // 相应的搜索框 , 只要有一个, 就有搜索按钮
            search: true,
            label: "表名",
            prop: "tbName",
          },
          {
            search: true,
            label: "表描述",
            prop: "tbDescription",
          },
          {
            search: true,
            label: "数据源",
            prop: "sourceId",
            type: "select",
            props: {
              label: "name",
              value: "id",
            },
            dicData: [
              {
                id: "0",
                name: "公共数据源",
              },
            ],
          },
          {
            label: "主表名称",
            prop: "headerId",
            dicData: [],
          },
          //  {
          //   label: "是否子表",
          //   prop: "subtable",
          // },
          {
            label: "状态",
            prop: "syncStatus",
            dicData: [
              {
                label: "未同步",
                value: 0,
              },
              {
                label: "同步",
                value: 1,
              },
            ],
          },

          {
            label: "备注",
            prop: "remark",
          },
        ],
      },
    };
  },
  created() {
    this.option.delBtn = this.permission.table_delete
    this.option.menu = this.permission.table_delete || this.permission.table_sync || this.permission.table_edit
    this.init();
  },
  methods: {
    init() {
      this.loadDataSource()
      this.getTables()
    },
    loadDataSource() {
      return new Promise((resolve) => {
        getDataSource().then((data) => {
          let column = this.findObject(this.option.column, "sourceId");
          column.dicData = data;
          resolve();
        });
      });
    },

    // 点击新增按钮
    addForm(dao) {
      // 路由跳转
      let rout = {
        path: "/tool/businessTable/add",
      }
      if (dao === 1) {
        rout.query = { name: '业务表导入' }
      }

      this.$router.push(rout);
    },
    getTables(page) {
      return new Promise((resolve) => {
        this.tableLoading = true;
        if (!page) {
          page = this.page;
        }
        // console.log(page)
        // 将搜索款里面的staff赋值给params Object.assign()对象的拷贝
        selectTables({
          ...this.search,
          size: page.pageSize,
          current: page.currentPage,
        }).then((res) => {
          let data = res.data.data;
          // 总条数信息 总条数,如果为0的话不显示分页
          this.page.total = res.data.data.total;
          // 渲染表单页面
          let rabbitFormTablesList = data.rabbitFormTablesList;
          let crudData = [];
          this.data = crudData;

          for (var index in rabbitFormTablesList) {
            let rabbitFormTables = rabbitFormTablesList[index].rabbitFormTables;
            rabbitFormTables.headerName =
              rabbitFormTablesList[index].headerName;
            crudData.push(rabbitFormTables);
          }
          // 渲染主表名称
          let fieldData = [];
          for (let i = 0; i < crudData.length; i++) {
            let headerData = {
              label: crudData[i].headerName,
              value: crudData[i].headerId,
            };
            fieldData.push(headerData);
          }
          this.option.column[3].dicData = fieldData;
          this.tableLoading = false;
          resolve();
        }).catch(() => {
          this.tableLoading = false
        })
      });
    },

    // 点击同步按钮
    handleAdd(row) {
      // 未同步
      if (row.syncStatus == 0) {
        this.tableLoading = true
        createTable(row.id).then(() => {
          this.tableLoading = false
          this.$message({
            message: "同步成功!",
            type: "success",
          });
          row.syncStatus = 1
        }).catch(() => {
          this.tableLoading = false
        })
      }
    },

    // 点击删除
    rowDel(row, index) {
      this.$confirm("删除表会删除表定义和表数据，确认要删除吗?", "危险操作", {
        type: 'warning',
      }).then(() => {
        this.tableLoading = true
        deleteTable(row.id).then((res) => {
          this.tableLoading = false
          this.$message.success(res.data.msg)
          if (this.data.length > 1) {
            this.data.splice(index, 1)
          } else {
            this.getTables()
          }
        }).catch(() => {
          this.tableLoading = false
        })
      }).catch(() => {
        //cancel
      })
    },

    // 修改
    edit(row) {
      //  路由跳转
      this.$router.push({
        path: `/tool/businessTable/detail/${row.id}`
      });
    },

    // 搜索重置
    searchReset() {
      // 重置表名和数据源
      this.query = {};
      this.search = {};
      // 重置主表名称id
      this.headerData = "";
      // 重置主表名称文本
      this.valueMainTable = "";
      this.page.currentPage = 1
      // 重新刷新页面
      this.getTables(this.page);
    },
    onSizeChange() {
      this.getTables()
    },
    onPageChange() {
      this.getTables()
    },
    // 点击搜索 点击搜索后触发该事件
    searchChange(params, done) {
      // 将搜索框里面的值赋值给search
      this.page.currentPage = 1
      this.search = params;
      if (Object.keys(this.headerData).length != 0) {
        this.search.headerId = this.headerData;
      }
      // // 刷新页面显示要搜索的数据, done解除搜索等待状态
      this.getTables(this.page, done());
    },

    // 主表名称远程搜索方法
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let tableName = query;
        selectByHeaderName(tableName).then((res) => {
          let data = res.data.data;
          let list = [];
          for (let i = 0; i < data.length; i++) {
            let listData = {
              label: data[i].tbName,
              value: data[i].id,
            };
            list.push(listData);
          }
          this.options = list;
          this.loading = false;
        });
      } else {
        this.options = [];
      }
    },
    // 主表名称将参数传给远程方法
    mainTable(value) {
      this.headerData = value;
    },
  },
};
</script>
