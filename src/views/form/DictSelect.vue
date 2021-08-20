<template>
  <div class="select-wrapper">
    <el-input
      placeholder="字典"
      v-model="inputTxt"
      class="input-with-select"
      readonly
      :disabled="disabled"
      :size="size"
      @click.native="!showAppend && showSelectDialog()"
      v-if="resetShow"
    >
      <el-button
        slot="append"
        icon="el-icon-position"
        @click="showSelectDialog"
        v-if="showAppend"
      >请选择</el-button>
    </el-input>

    <el-dialog
      title="选择字典"
      width="75%"
      :visible.sync="showDialog"
      append-to-body
      style="text-align:left"
    >
      <div class="select-wrapper" v-loading="tableLoading">
        <el-form :model="search" label-position="right" label-width="88px" ref="form" size="small">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="字典编码">
                <el-input v-model="search.code" placeholder="字典编码" class="row-input" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字典名称">
                <el-input v-model="search.dictValue" placeholder="字典名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="small" @click="handlePageChange(1)">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="listData"
          height="300px"
          @select="onRowSelect"
          @select-all="onAllSelect"
          @row-dblclick="onRowDblClick"
          row-key="id"
          ref="table"
          size="small"
          stripe
          border
          lazy
          :load="loadChildren"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :select-on-indeterminate="!single"
          :indent="8"
        >
          <el-table-column type="selection" width="30" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="字典编码" prop="code" show-overflow-tooltip min-width="180"></el-table-column>
          <el-table-column label="字典名称" prop="dictValue" show-overflow-tooltip></el-table-column>
          <el-table-column label="字典值" prop="dictKey" show-overflow-tooltip></el-table-column>
          <el-table-column label="联动字典" prop="casName"></el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="select-footer">
          <el-pagination
            layout="total,prev,pager,next"
            :total="total"
            :page-size.sync="pageSize"
            @current-change="handlePageChange"
          ></el-pagination>
          <div class="footer-btn">
            <el-button type="warning" plain @click="clearSelected" size="small">清空选择</el-button>
            <el-button @click="showDialog=false" size="small">取消</el-button>
            <el-button type="primary" @click="onConfirm" size="small">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cacheRequest from '@/views/form/cache-request'
export default {//字典选择设置
  name: 'DictSelect',
  model: {
    prop: 'value',
    event: 'select'
  },
  props: {
    single: {//是否单选
      type: Boolean,
      default: true
    },
    showAppend: {//显示选择按钮
      type: Boolean,
      default: false
    },
    disabled: {//禁用
      type: Boolean,
      default: false
    },
    visible: {//自定义页面是否已初始化
      type: Boolean,
      default: true
    },
    size: {//控件大小
      type: String,
      default: () => 'small'
    },
    hasChild: {//只能选择有子项的字典
      type: Boolean,
      default: true
    },
    prop: String,
    value: {
      type: [Number, String, Array],
      default: () => ''
    }
  },
  data: () => {
    return {
      inputTxt: '',
      total: 0,
      search: {},
      listData: [],
      pageSize: 10,
      showDialog: false,
      tableLoading: false,
      resetShow: true
    }
  },
  beforeDestroy() {
    if (this._defaultSelectTimer) {
      clearTimeout(this._defaultSelectTimer)
      this._defaultSelectTimer = null
    }
  },
  created() {
    // console.log("created dict")
    if (this.value) {
      let ids = this.value
      this._selectForNumber = typeof this.value == 'number'
      if (Array.isArray(this.value)) {
        ids = this.value.join(",")
      }
      // this._tempId = ids
      this.getDefaultSelectList(ids)
    }
  },
  methods: {
    clearSelected() {
      this.$refs.table.clearSelection()
      this._defSelection = null
      if (!this.required) {
        this.onConfirm()
      }
    },
    showSelectDialog() {
      if (this.disabled) {
        return
      }
      this.showDialog = true
      if (this.listData.length == 0) {
        this.handlePageChange(1)
      }
    },
    onConfirm() {
      let selection = this.$refs.table.selection || []
      if (this.required && selection.length == 0) {
        this.$message.warning('请选择字典')
        return
      }
      let text = ''
      let result = ''
      let cascadedMap = {}
      let notifyCascade = false
      const findParent = pid => {
        if (!pid || pid == '0') {
          return null
        }
        let states = this.$refs.table.store.states
        let treeData = states.treeData
        for (let key in treeData) {
          let children = treeData[key].children || []
          if (children.find(it => it == pid)) {
            return key
          }
        }
      }
      for (let item of selection) {
        if (text != '') {
          text += ','
        }
        text += item.dictValue
        if (result != '') {
          result += ','
        }
        result += item.id
        if (item.cascadedId) {
          notifyCascade = true
          cascadedMap[item.id] = item.cascadedId
        } else {
          let pid = findParent(item.parentId)
          if (pid) {
            notifyCascade = true
            cascadedMap[item.id] = pid
          }
        }
      }
      this.inputTxt = text
      if (this.single && selection.length == 1 && this._selectForNumber) {
        this.$emit("select", parseInt(result))
      } else {
        this.$emit("select", result)
      }
      if (notifyCascade) {
        for (let casKey in cascadedMap) {
          let calVal = cascadedMap[casKey]
          if (cascadedMap[calVal]) {//不允许循环关联
            delete cascadedMap[calVal]
          }
        }
        this.$emit("cascade", cascadedMap)
      }
      this.showDialog = false
    },
    handlePageChange(page) {
      this.tableLoading = this.visible
      let params = { current: page || 1, size: 10 }
      if (this.search.code || this.search.dictValue) {
        params.code = this.search.code
        params.dictValue = this.search.dictValue
      } else {
        params.parentId = 0
      }
      params.isDeleted = 0
      this.$axios.get('/api/rabbit-system/dict/select-list', {
        params: params
      }).then(res => {
        if (res.data.data) {
          // console.log("getData", res.data.data)
          this.checkDefaultSelected()
          this.listData = res.data.data.records || []
          this.total = res.data.data.total
          this.pageSize = res.data.data.size || 10
          // if (params.current == 1) {
          // }
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })

    },
    onRowDblClick(row) {
      // console.log("onRowDblClick")
      if (this.hasChild && !row.hasChildren) {
        return
      }
      if (this.single) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row)
        setTimeout(() => {
          this.onConfirm()
        }, 300);
      } else {
        this.$refs.table.toggleRowSelection(row)
      }
    },
    onRowSelect(selection, row) {
      // console.log("onRowSelect", selection, row)
      if (this.hasChild && !row.hasChildren) {
        this.$refs.table.toggleRowSelection(row, false)
        this.$message.warning('不可选择无子项的字典')
        return
      }
      if (this.single && selection.length > 1) {
        let other = selection.find(it => it != row)
        other && this.$refs.table.toggleRowSelection(other, false)
      }
    },
    onAllSelect(selection) {
      if (this.single && selection.length > 1) {
        this.$refs.table.toggleAllSelection()
      }
    },
    loadChildren(tree, treeNode, resolve) {//expanded,lazy,level,children
      if (tree.children && tree.children.length > 0) {
        resolve(tree.children)
        this.checkDefaultSelected(tree.children)
        return
      }
      this.$axios.get('/api/rabbit-system/dict/select-child', {
        params: {
          parentId: tree.id
        }
      }).then(res => {
        // console.log("loadChildren")
        let data = res.data && res.data.data || []
        resolve(data)
        this.checkDefaultSelected(data)
      }).catch(() => {
        resolve([])
      })
    },
    getDefaultSelectList(ids) {
      cacheRequest({
        url: "/api/rabbit-system/dict/select-ids",
        method: 'get',
        params: { ids }
      }, this.prop || this._uid, 'dict').then(data => {
        this._defSelection = data
        // console.log("getDefaultSelectList")
        if (this.listData.length > 0) {
          this.checkDefaultSelected(this.listData, true)
        }
        this.inputTxt = data.map(it => it.dictValue).join()
      })
    },
    checkDefaultSelected(data) {
      let selection = this.$refs.table.store.states.selection
      // console.log("checkDefaultSelected")
      if (this._defSelection) {
        if (selection.length == 0 || this.single) {
          selection = this._defSelection
          this.$refs.table.store.states.selection = selection
        } else {
          this._defSelection.forEach(item => {
            if (!selection.find(it => it.id == item.id)) {
              selection.push(item)
            }
          })
        }
        this._defSelection = null;
      }
      if (!data || data.length == 0 || selection.length == 0) {
        return
      }
      for (let item of data) {//child时才需要
        let index = selection.findIndex(it => it.id == item.id)
        if (index >= 0) {
          selection.splice(index, 1, item)
        }
      }
    }
  },
  watch: {
    value(val) {
      if (!val) {
        // this.createTimer = 
        if (this.$refs.table) {
          this.$refs.table.clearSelection()
        }
        this._defSelection = null
        this.inputTxt = ''
        // this.resetShow = false
        // this.$nextTick(() => {
        //   this.resetShow = true
        // })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.select-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  min-height: 48px;
}
.footer-btn {
  flex-grow: 1;
  text-align: end;
  margin-left: 20px;
}
</style>
