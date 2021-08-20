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
          v-if="permission.pop_add"
        >新增</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-edit"
          size="small"
          v-if="permission.pop_edit"
          @click.stop="handleEdit(scope.row,scope.index)"
        >编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-delete"
          size="small"
          v-if="permission.pop_delete"
          @click.stop="handleRemove(scope.row,scope.index)"
        >删除</el-button>
      </template>
    </avue-crud>
    <el-drawer
      direction="ttb"
      size="100%"
      :visible.sync="showList"
      :title="editName?`编辑 ${editName}`:'新增弹出框'"
      class="my-pop"
      append-to-body
      @closed="onDialogClosed"
    >
      <div class="top-btn">
        <el-button
          type="success"
          size="small"
          @click="onListSubmitClick"
          :loading="submitLoading"
        >提交</el-button>
      </div>
      <pop-custom
        ref="list"
        :submiting.sync="submitLoading"
        :popId="editRow.id"
        :popData="editRow"
        :visible="showList"
        @change="onDataChange"
      ></pop-custom>
    </el-drawer>
  </basic-container>
</template>

<script>
import PopCustom from './PopCustom.vue'
import { getDataSource } from "@/api/tool/businessTable"
export default {//弹出框管理
  components: { PopCustom },
  name: 'PopDataManage',

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
      searchForm: {},
      showList: false,
      editRow: {},
      editName: '',
      submitLoading: false,
      option: {
        height: 'auto',
        calcHeight: 50,
        page: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        index: true,
        indexLabel: '序号',
        stripe: true,
        border: true,
        size: 'small',
        searchMenuSpan: 4,
        searchLabelWidth: 100,
        menuWidth: 160,
        column: [
          {
            prop: 'popName',
            label: '弹出框名称',
            search: true
          },
          {
            prop: 'dataType',
            label: '数据类型',
            type: 'select',
            width: 82,
            searchMultiple: true,
            searchTags: true,
            dicData: [
              { label: '业务表', value: 0 },
              { label: '自定义SQL', value: 1 },
              { label: 'API接口', value: 2 }
            ],
            search: true
          },
          {
            prop: 'source',
            label: 'SQL/URL',
            minWidth: 180,
            showOverflowTooltip: true
          },
          {
            prop: 'sourceId',
            label: '数据源',
            width: 92,
            props: {
              label: 'name',
              value: 'id'
            },
            dicData: []
          }, {
            prop: 'remark',
            label: '备注',
          }
        ]
      }
    }
  },
  computed: {
    permission() {
      return this.$store.getters.permission || {}
    }
  },
  created() {
    this.onRefreshChange()
    if (!this.permission.pop_edit && !this.permission.pop_delete) {
      this.option.menu = false
    }
    getDataSource().then(data => {
      let column = this.findObject(this.option.column, 'sourceId')
      column.dicData = data
    })
  },
  methods: {
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
      this.onRefreshChange()
    },
    onRefreshChange(page, done) {
      this.loading = true
      this.$axios.get("/api/rabbit-resource/formcustom/pop-datas", {
        params: {
          current: this.page.currentPage,
          size: this.page.pageSize,
          popName: this.searchForm.popName,
          info: 0,
          dataType: this.searchForm.dataType && this.searchForm.dataType.join()
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
      // console.log("onSearchChange", params)
      this.page.currentPage = 1
      this.onRefreshChange(this.page, done)
    },
    onSearchReset() {
      // console.log("onSearchReset", this.searchForm)
      this.page.currentPage = 1
      this.onRefreshChange()
    },
    handleAdd() {//配置页面
      this._updateIndex = -1
      this.editRow = {}
      this.editName = ''
      this.showList = true
    },
    handleEdit(row, index) {//去配置页面
      this._updateIndex = index
      this.editRow = row
      this.editName = row.popName
      this.showList = true
      // console.log("handleEdit", row, index)
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
        setTimeout(() => {
          this.showList = false
        }, 500);
        return
      }
      if (this._updateIndex == -1) {
        this.listData.unshift(data)
        this.page.total++
      } else {
        let old = this.listData[this._updateIndex]
        // data.tableName = old.tableName
        data.sourceId = old.sourceId
        this.listData.splice(this._updateIndex, 1, data)
      }
      if (submit) {
        setTimeout(() => {
          this.showList = false
        }, 500);
      }
    },
    handleRemove(row, index) {
      this.$confirm('确定要删除该记录吗?', "危险操作", {
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete("/api/rabbit-resource/formcustom/pop-data/" + row.id)
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
    onListSubmitClick() {
      this.$refs.list.onSubmitClick()
    },
    onDialogClosed() {
    }
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