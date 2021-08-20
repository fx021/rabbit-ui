<template>
  <basic-container>
    <avue-crud
      :data="listData"
      :option="option"
      :page.sync="page"
      :table-loading="loading"
      :search.sync="searchForm"
      @search-change="onSearchChange"
      @search-reset="onSearchReset"
      @row-del="handleRemove"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      @refresh-change="onRefreshChange"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click.stop="handleAdd"
          v-if="permission.form_add"
        >新增</el-button>
        <el-button
          type="success"
          icon="el-icon-document-add"
          size="small"
          v-if="permission.form_add_search"
          @click.stop="handleSearchList"
        >新增查询列表</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-edit"
          size="mini"
          v-if="permission.form_edit"
          @click.stop="handleEdit(scope.row,scope.index)"
        >编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-notebook-2"
          size="mini"
          v-if="permission.form_list"
          @click.stop="handleList(scope.row,scope.index)"
        >列表</el-button>
        <el-dropdown
          @command="cmd =>handelMore(scope,cmd)"
          style="margin-left:10px"
          v-if="hasMoreMenu"
        >
          <el-button type="text" size="mini">
            更多
            <i class="el-icon-arrow-down"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-delete" command="1" v-if="permission.form_delete">删除</el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-warning-outline"
              command="2"
              v-if="permission.form_status"
            >{{scope.row.status==1?'禁用':'启用'}}</el-dropdown-item>
            <el-dropdown-item
              icon="el-icon-collection-tag"
              command="4"
              v-if="permission.form_enhance"
            >表单增强</el-dropdown-item>
            <el-dropdown-item icon="el-icon-connection" command="3" v-if="permission.form_flow">关联流程</el-dropdown-item>
            <el-dropdown-item icon="el-icon-key" command="5" v-if="permission.form_menu">菜单查询</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template slot="tableNameSearch" slot-scope="scope">
        <el-select
          v-model="searchForm.tables"
          placeholder="业务表"
          filterable
          :multiple-limit="10"
          collapse-tags
          multiple
          clearable
          remote
          :size="scope.size"
          :remote-method="onSearchTable"
          :loading="tableLoading"
        >
          <el-option v-for="item in tableList" :label="item.tbName" :value="item.id" :key="item.id">
            <span style="float: left">{{ item.tbName }}</span>
            <span
              :style="{float: 'right', color: item.formPop%2!=0?'#8f91b0':'#7fa1d3', fontSize: '12px'}"
            >{{ item.tbDescription }}</span>
          </el-option>
        </el-select>
      </template>
    </avue-crud>
    <el-drawer
      direction="rtl"
      size="50%"
      ref="flowRelationDrawer"
      :visible.sync="showflowRelation"
      title="关联流程"
      class="my-pop"
      destroy-on-close
      append-to-body
    >
      <pop-flow-relation :form="this.editRow" @confirm="handlePopFlowRelationConfrim" />
    </el-drawer>
    <el-drawer
      direction="rtl"
      size="100%"
      :visible.sync="showList"
      :title="listTitle"
      class="my-pop my-list"
      destroy-on-close
      append-to-body
    >
      <div class="top-btn">
        <el-button size="small" @click="onFormPreviewClick('list')" :loading="formLoading">预览</el-button>
        <el-button
          type="success"
          size="small"
          @click="onFormSubmitClick('list')"
          :loading="submitLoading"
        >提交</el-button>
      </div>
      <list-setting
        :row="editRow"
        :visible="showList"
        :list-mode="listMode"
        @change="onOptionReceive"
        ref="list"
        :submiting.sync="submitLoading"
      ></list-setting>
    </el-drawer>
    <el-drawer
      :direction="editName?'rtl':'ltr'"
      size="100%"
      :visible.sync="showForm"
      :title="editName?`编辑 ${editName}`:'新增表单'"
      class="my-pop my-form"
      :before-close="beforeFormClose"
      destroy-on-close
      append-to-body
    >
      <div class="top-btn" v-show="!isView">
        <el-button size="small" @click="onFormPreviewClick('cusForm')" :loading="formLoading">预览</el-button>
        <el-button
          type="success"
          size="small"
          @click="onFormSubmitClick('cusForm')"
          :loading="formLoading"
        >提交</el-button>
      </div>
      <form-custom
        :submiting.sync="formLoading"
        :formId="editRow.id"
        :show-submit="false"
        :readonly="isView"
        :formData="editRow"
        :visible="showForm"
        @change="onDataChange"
        ref="cusForm"
      ></form-custom>
    </el-drawer>
    <el-drawer
      direction="rtl"
      size="100%"
      :visible.sync="showEnhance"
      :title="'增强设置：'+editRow.formName"
      class="my-pop"
      destroy-on-close
      append-to-body
    >
      <div class="top-btn" v-show="!isView">
        <el-button
          type="success"
          size="small"
          @click="onFormSubmitClick('enhance')"
          :loading="enhanceLoading"
        >提交</el-button>
      </div>
      <form-enhance
        :form-id="editRow.id"
        :table-name="editRow.tableName"
        :loading.sync="enhanceLoading"
        ref="enhance"
        @submit="showEnhance=false"
      ></form-enhance>
    </el-drawer>
  </basic-container>
</template>

<script>
import ListSetting from './ListSetting'
import FormCustom from './FormCustom'
import FormEnhance from './FormEnhance'
import { getDataSource } from "@/api/tool/businessTable"
import PopFlowRelation from "@/views/form/PopFlowRelation";
//表单管理
export default {
  components: { PopFlowRelation, ListSetting, FormCustom, FormEnhance },
  name: 'FormManage',

  data: () => {
    return {
      listData: [],
      loading: false,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      },
      showflowRelation: false,
      searchForm: {},
      showList: false,
      listMode: 0,
      editName: '',
      editRow: {},
      showForm: false,
      manualClose: false,
      isView: false,
      enhanceLoading: false,
      submitLoading: false,
      formLoading: false,
      tableLoading: false,
      tableList: [],
      showEnhance: false,
      option: {
        height: 'auto',
        calcHeight: 50,
        page: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        stripe: true,
        border: true,
        size: 'small',
        menuWidth: 180,
        searchMenuSpan: 5,
        column: [
          {
            prop: 'code',
            label: '表单编号',
            search: true
          },
          {
            prop: 'formName',
            label: '表单名称',
            search: true
          },
          {
            prop: 'tableName',
            label: '业务表',
            search: true,
            formatter(row, value) {
              if (row.tableId == 0) {
                return "【自定义查询】"
              }
              return value
            },
          },
          {
            prop: 'sourceId',
            label: '数据源',
            type: 'select',
            width: 92,
            formatter(row, value, label, column) {
              if (!value && row.tableId == 0 && row.pcForm) {
                let form = row.pcForm
                if (typeof form === 'string') {
                  form = JSON.parse(form)
                }
                value = form.sourceId
                row.sourceId = value
              }
              let dicData = column.dicData
              let dic = dicData.find(it => it.id == value)
              return dic ? dic.name : value
            },
            props: {
              label: 'name',
              value: 'id'
            },
            dicData: []
          },
          {
            prop: 'remark',
            label: '备注',
          }
        ]
      }
    }
  },
  computed: {
    listTitle() {
      return this.listMode ? '查询列表配置' : ('列表配置: ' + this.editRow.formName)
    },
    permission() {
      return this.$store.getters.permission || {}
    },
    hasMoreMenu() {
      return this.permission.form_enhance || this.permission.form_status || this.permission.form_delete || this.permission.form_menu || this.permission.form_flow
    }
  },
  created() {
    this.option.menu = this.hasMoreMenu || this.permission.form_edit || this.permission.form_list
    getDataSource().then(data => {
      let column = this.findObject(this.option.column, 'sourceId')
      column.dicData = data
    })
    this.onRefreshChange()
  },
  methods: {
    isListRow(row) {//是否查询列表
      return row.tableId == 0
    },
    onSearchTable(name) {
      if (name) {
        this.tableLoading = true;
        this.$axios.get("/api/rabbit-resource/formcustom/selectByTableName", {
          params: {
            tableName: name
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.tableList = res.data.data;
          }
          this.tableLoading = false;
        }).catch(() => {
          this.tableLoading = false;
        });
      }
    },
    onPageChange(page) {
      this.page.currentPage = page
      // console.log("onPageChange", page)
      this.onRefreshChange()
    },
    onSizeChange(size) {
      let current = this.page.pageSize * this.page.currentPage
      let newPage = Math.ceil(current / size)
      this.page.currentPage = newPage
      this.page.pageSize = size
      this.onRefreshChange(this.page)
    },
    onRefreshChange(page, done) {
      this.loading = true
      this.$axios.get("/api/rabbit-resource/formcustom/forms", {
        params: {
          current: this.page.currentPage,
          size: this.page.pageSize,
          formName: this.searchForm.formName,
          code: this.searchForm.code,
          tables: this.searchForm.tables && this.searchForm.tables.join()
        }
      }).then(res => {
        let data = res.data.data || {}
        this.listData = data.records || []
        if (data.total != undefined) {
          this.page.total = data.total
        }
        this.loading = false
        done && done()
      }).catch(() => {
        this.loading = false
        done && done()
      })
    },
    onSearchChange(params, done) {
      this.page.currentPage = 1
      this.onRefreshChange(this.page, done)
    },
    onSearchReset() {
      this.page.currentPage = 1
      // console.log("onSearchReset", this.searchForm)
      this.onRefreshChange()
    },
    handleForbit(row) {
      this.$confirm(`确定要${row.status == 1 ? '禁用' : '启用'}该表单吗`)
        .then(() => {
          this.loading = true
          this.$axios.get("/api/rabbit-resource/formcustom/form/status", {
            params: {
              id: row.id,
              status: row.status == 1 ? 0 : 1
            }
          }).then(res => {
            row.status = row.status == 1 ? 0 : 1
            this.loading = false
            this.$message.success(res.data.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          //cancel
        })
    },
    handleSearchList() {
      this._updateIndex = -1
      this.editRow = {}
      this.listMode = 1
      this.showList = true
    },
    handleAdd() {//配置页面
      this.isView = false
      this.showFormDialog({}, -1)
    },
    handleView(row, index) {
      this.isView = true
      this.showFormDialog(row, index)
    },
    handleEdit(row, index) {//去配置页面
      if (this.isListRow(row)) {
        this.handleList(row, index)
        return
      }
      this.isView = false
      this.showFormDialog(row, index)
    },
    showFormDialog(row, index) {
      this._updateIndex = index
      this.editRow = row
      this.editName = index == -1 ? '' : row.formName
      // console.log("row", row)
      this.showForm = true
    },
    handelMore(scope, command) {
      if (command == "1") {
        this.handleRemove(scope.row, scope.index)
      } else if (command == "2") {
        this.handleForbit(scope.row)
      } else if (command == "3") {
        this.handleFlowRelation(scope.row, scope.index)
      } else if (command == "4") {
        this.editRow = scope.row
        this.showEnhance = true
      } else if (command == "5") {
        this.checkFormMenu(scope.row.id)
      }
    },
    checkFormMenu(id) {
      this.loading = true
      let path = `/list/${id}`
      this.$axios.get('/api/rabbit-system/menu/path-name', {
        params: { path }
      }).then(res => {
        this.loading = false
        if (res.data.data) {
          this.$confirm(`对应菜单为 “ ${res.data.data} ”，需要跳转吗?`, '跳转确认')
            .then(() => {
              this.$router.push({ path: path, query: { name: res.data.data } })
            }).catch(() => {
              //cancel
            })
        } else {
          this.$message.success('该表单还未关联菜单')
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleList(row, index) {//列表配置页面
      this._updateIndex = index
      this.editRow = row
      this.listMode = this.isListRow(row) ? 1 : 0
      this.showList = true
    },
    handleFlowRelation(row) {
      this.editRow = row;
      this.showflowRelation = true;
    },
    handlePopFlowRelationConfrim(res) {
      if (!res.id) {
        this.$message.error("关联失败")
        return;
      }
      this.$message.success("关联成功")
      this.showflowRelation = false;
      this.$refs.flowRelationDrawer.closeDrawer();
    },
    handleRemove(row, index) {
      this.$confirm('删除表单也会删除配置该表单的菜单，确定要删除吗?', "危险操作", {
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete("/api/rabbit-resource/formcustom/form/" + row.id)
          .then(res => {
            if (res.data.data) {
              this.loading = false
              this.$message.success(res.data.msg)
              if (this.listData.length > 1) {
                this.listData.splice(index, 1)
                this.page.total--
              } else {
                this.onRefreshChange()
              }
            }
          }).catch(() => {
            this.loading = false
          })
      }).catch(() => {
        //cancel
      })
    },
    onOptionReceive(option, submit) {
      // console.log("onOptionReceive", option)
      if (option) {
        if (this._updateIndex == -1) {
          this.listData.unshift(option)
        } else {
          this.listData[this._updateIndex] = option
        }
      }

      if (submit) {
        setTimeout(() => {
          this.showList = false
          if (!option) {
            this.onRefreshChange()
          }
        }, 400);
      }
    },
    onDataChange(data, submit) {
      if (data === 'remove') {
        if (this._updateIndex >= 0 && this.listData.length > 1
          || this.page.total <= this.page.size) {
          if (this.listData[this._updateIndex].id == submit) {
            this.listData.splice(this._updateIndex, 1)
          } else {
            this.onRefreshChange()
          }
        } else {
          this.onRefreshChange()
        }
        this.manualClose = true
        setTimeout(() => {
          this.showForm = false
        }, 400);
        return
      }
      if (this._updateIndex == -1) {
        this.listData.unshift(data)
        this.page.total++
      } else {
        let old = this.listData[this._updateIndex]
        data.tableName = old.tableName
        data.sourceId = old.sourceId
        this.listData.splice(this._updateIndex, 1, data)
      }
      if (submit) {
        this.manualClose = true
        setTimeout(() => {
          this.showForm = false
        }, 400);
      }
    },
    beforeFormClose(hide) {
      if (this.manualClose) {
        this.manualClose = false
        hide()
        return
      }
      if (this.$refs.cusForm && this.$refs.cusForm.hasOperation && this.$refs.cusForm.viewData.length) {
        this.$confirm('数据还未保存，确定要离开吗?', '保存提醒')
          .then(() => {
            hide()
          }).catch(() => {
            //cancel
          })
      } else {
        hide()
      }
    },
    onFormPreviewClick(ref) {
      this.$refs[ref || 'cusForm'].onPreviewClick()
    },
    onFormSubmitClick(ref) {
      this.$refs[ref || 'cusForm'].onSubmitClick()
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-btn {
  position: absolute;
  right: 80px;
  top: 14px;
}
</style>
