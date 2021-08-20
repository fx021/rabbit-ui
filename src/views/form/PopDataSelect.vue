<template>
  <div class="select-wrapper">
    <el-input
      placeholder="弹出框"
      v-model="inputTxt"
      class="input-with-select"
      readonly
      :size="size"
      @click.native="!showAppend && showSelectDialog()"
    >
      <el-button
        slot="append"
        icon="el-icon-position"
        @click="showSelectDialog"
        v-if="showAppend"
      >请选择</el-button>
    </el-input>
    <el-dialog
      title="选择弹出框"
      width="88%"
      :visible.sync="showDialog"
      @closed="onDialogClosed"
      append-to-body
      style="text-align:left"
    >
      <div class="select-wrapper" v-loading="tableLoading">
        <el-form :model="search" label-position="right" label-width="60px" ref="form" size="small">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="名称">
                <el-input v-model="search.popName" placeholder="弹出框名称" class="row-input" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <el-input v-model="search.remark" placeholder="弹出框备注" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="small" @click="handlePageChange(1)">查询</el-button>
              <el-button type="warning" size="small" plain @click="onRelativeColClick">新增映射</el-button>
              <el-switch v-model="lazy" size="small" active-text="懒加载" style="margin-left:10px"></el-switch>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="12">
            <el-table
              :data="listData"
              height="300px"
              @select="onRowSelect"
              @select-all="onAllSelect"
              @selection-change="onSelectionChange"
              row-key="id"
              ref="table"
              size="small"
              stripe
              border
              :select-on-indeterminate="!single"
              :indent="8"
            >
              <el-table-column type="selection" width="30" align="center" :reserve-selection="true"></el-table-column>
              <el-table-column label="名称" prop="popName" show-overflow-tooltip></el-table-column>
              <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column label="数据类型" width="150">
                <template slot-scope="scope">
                  <el-tooltip :content="scope.row.source" placement="top">
                    <span>{{scope.row.dataType==0?'业务表':(scope.row.dataType==1?'自定义SQL':'API接口')}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>-->
            </el-table>
          </el-col>
          <el-col :span="12">
            <el-table :data="colData" height="300px" size="small" stripe border>
              <el-table-column label="控件|字段" align="center">
                <template slot-scope="scope">
                  <!--控件选择-->
                  <el-select
                    v-model="scope.row.formView"
                    placeholder
                    size="mini"
                    align="center"
                    v-if="scope.row.colMode==1 || (scope.row.colMode==2 && !scope.row.colReplace)"
                    :disabled="scope.row.colMode==1 && scope.row.formView===viewId"
                  >
                    <el-option
                      :label="`V：${item.label}`"
                      :value="item._id"
                      v-for="item in viewDataFunc()"
                      :key="item._id"
                      :disabled="formViewSelected(item)"
                    ></el-option>
                  </el-select>
                  <!--字段选择-->
                  <el-select
                    v-model="scope.row.colName"
                    placeholder
                    size="mini"
                    align="center"
                    v-else
                  >
                    <el-option
                      :label="viewColLabel(item)"
                      :value="viewColValue(item)"
                      v-for="item in colListFunc()"
                      :key="item.colName"
                      :disabled="formColSelected(item, scope.row.colMode)"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="弹出框" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.popView"
                    placeholder
                    size="mini"
                    @change="val => onPopColChange(val, scope.$index)"
                    v-if="scope.row.colMode!=2"
                  >
                    <el-option
                      :label="popColLabel(item)"
                      :value="item._id"
                      v-for="item in popColList"
                      :key="item._id"
                    ></el-option>
                  </el-select>
                  <el-select v-model="scope.row.paramKey" placeholder size="mini" v-else disabled>
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in paramList"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="绑定" align="center" width="92">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.colMode"
                    size="mini"
                    :disabled="scope.row.formView===viewId || scope.row.colMode==2"
                    @change="val=>onColModeChange(val,scope.$index)"
                  >
                    <el-option label="字段" :value="0"></el-option>
                    <el-option label="控件" :value="1"></el-option>
                    <el-option label="参数" :value="2" disabled></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="替换" align="center" width="48">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.colReplace"
                    size="mini"
                    :disabled="scope.row.colMode==0"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="48" align="center">
                <template slot-scope="scope">
                  <i class="el-icon-delete icon-btn" @click="onRemoveColClick(scope.$index)"></i>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div class="select-footer">
          <el-pagination
            layout="total,prev,pager,next"
            :total="total"
            :page-size.sync="pageSize"
            @current-change="handlePageChange"
          ></el-pagination>
          <div class="footer-btn">
            <!-- <el-button type="warning" plain @click="clearSelected" size="small">清空选择</el-button> -->
            <el-button @click="showDialog=false" size="small">取消</el-button>
            <el-button type="primary" @click="onConfirm" size="small">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { filterSystemArgs } from '@/util/generator'
import cacheRequest from '@/views/form/cache-request'
export default {//弹出框映射设置
  name: 'PopDataSelect',
  model: {
    prop: 'value',
    event: 'select'
  },
  inject: {
    parentCustom: {
      default: () => { }
    }
  },
  props: {
    single: {//是否单选
      type: Boolean,
      default: true
    },
    showAppend: {//选择按钮
      type: Boolean,
      default: false
    },
    size: {//控件大小
      type: String,
      default: () => 'small'
    },
    required: {//是否能为空
      type: Boolean,
      default: false
    },
    visible: {//自定义页面是否已初始化
      type: Boolean,
      default: true
    },
    value: {
      type: [Number, String, Array],
      default: () => ''
    },
    viewIndex: Number,//控件位置
    viewId: String,//控件id
    prop: String,//控件字段
    tableId: {//表id,用于选择字段list
      type: [Number, String],
    },
    colDefault: Array//映射列表回显
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
      lastSelection: [],
      dataType: -1,
      hasChange: false,
      colData: [],
      popColList: [],
      paramList: [],
      lazy: false
    }
  },
  beforeDestroy() {
    if (this._defaultSelectTimer) {
      clearTimeout(this._defaultSelectTimer)
      this._defaultSelectTimer = null
    }
    if (this._checkTimer) {
      clearTimeout(this._checkTimer)
      this._checkTimer = null
    }
  },
  created() {
    if (this.value) {
      let ids = this.value
      if (typeof this.value == 'number') {
        this._selectForNumber = true
      } else if (Array.isArray(this.value)) {
        ids = this.value.join(",")
      }
      this.getDefaultSelectList(ids)
    }
    if (this.colDefault && this.colDefault.length > 0) {
      this.colData = this.colDefault
    }

    // console.log("created popselect", this._uid)
  },
  methods: {
    popColLabel(item) {
      let col = item.prop.split('#').pop()
      return `${item.label} ( ${col} )`
    },
    formViewSelected(item) {
      return !!this.colData.find(it => it.formView == item._id)
    },
    formColSelected(item, colMode) {
      if (colMode == 0) {
        if (item.colName == 'HEADER_ID' || item.colName == "ID") {//id应该是生成的,不是绑定来的
          return true
        }
      }
      let value = this.viewColValue(item)
      return !!this.colData.find(it => it.colMode == colMode && it.colName == value)
    },
    onColModeChange(val, index) {
      let item = this.colData[index]
      if (item.colReplace && val == 0) {
        item.colReplace = false
      }
      if (this._checkTimer) {
        clearTimeout(this._checkTimer)
      }
      this._checkTimer = setTimeout(() => {
        this._checkTimer = null
        this.sortColsByMode()
      }, 400);
    },
    findOldMode(index) {
      if (index == this.colData.length - 1) {
        return 0
      }
      for (let i = index; i < this.colData.length; i++) {
        let item = this.colData[index]
        if (item.colMode != 2) {
          return item.colMode
        }
      }
      for (let i = index; i >= 0; i--) {
        let item = this.colData[index]
        if (item.colMode != 2) {
          return item.colMode
        }
      }
      return 0
    },
    sortColsByMode() {
      this.colData.sort((a, b) => {
        return a.colMode > b.colMode ? 1 : (a.colMode == b.colMode ? 0 : -1)
      })
    },
    bindPopInfo(item, pop) {//绑定一些额外信息
      if (pop) {
        item.popCol = pop.prop
        item.popTable = pop.tableName
        item.popType = pop.type || pop.component
        item.primaryKey = pop.primaryKey
        item.popTableId = pop.tableId
        if (pop.viewMode) {
          item.action = pop.action
          item.accept = pop.accept
          item.viewMode = pop.viewMode
          item.prepend = pop.prepend
          item.append = pop.append
        }
      }
    },
    onPopColChange(popView, index) {//选择了弹出框的控件
      let item = this.colData[index]
      let pop = this.popColList.find(it => it._id == popView)
      this.bindPopInfo(item, pop)
      // console.log("onPopColChange", item, pop)
    },
    colListFunc() {
      if (this.parentCustom && this.parentCustom.selectColFun) {
        return this.parentCustom.selectColFun(this.tableId)
      }
      let parent = this.$parent
      while (parent) {
        if (typeof parent.selectColFun == 'function') {
          return parent.selectColFun(this.tableId)
        }
        parent = parent.$parent
      }
      return []
    },
    viewColValue(col) {
      if (col.tableName) {
        return `n#${col.tableName}#${col.colName}`
      }
      return col.colName
    },
    viewColLabel(col) {
      if (col.status == 2 && col.colDefault) {
        return col.colDefault
      }
      return col.colDesc ? `${col.colName} (${col.colDesc})` : col.colName
    },
    viewDataFunc() {
      if (this.parentCustom && this.parentCustom.viewData) {
        return this.parentCustom.viewData
      }
      let parent = this.$parent
      while (parent) {
        if (parent.viewData && parent.viewData.length) {
          // console.log("viewData", parent.viewData)
          return parent.viewData
        }
        parent = parent.$parent
      }
      return []
    },
    // 新增映射
    onRelativeColClick() {
      if (!this.checkLastColData()) {
        return
      }
      let index = this.colData.length - 1
      for (let i = index; i >= 0; i--) {
        if (this.colData[i].colMode == 1) {
          index = i
          break
        }
      }
      this.colData.splice(index + 1, 0, { colMode: 1, colReplace: true })
    },
    checkColItem(last) {
      if (last.colMode == 2 && (!last.paramKey || (last.colReplace && !last.colName)
        || (!last.colReplace && !last.formView))) {
        if (this.dataType === 0) {
          return true
        }
        this.$message.warning('请先完善映射关系')
        return false
      }
      if ((last.colMode != 2 && !last.popView) || (last.colMode == 0 && !last.colName)
        || (last.colMode == 1 && !last.formView)) {
        this.$message.warning('请先完善映射关系')
        return false
      }
      return true
    },
    checkLastColData() {
      if (this.colData.length > 0) {
        for (let last of this.colData) {//0 字段, 1 控件, 2 参数
          if (!this.checkColItem(last)) {
            return false
          }
        }
      }
      return true
    },
    clearSelected() {
      this.$refs.table.clearSelection()
      this._defSelection = null
      if (!this.required) {
        this.onConfirm()
      }
    },
    showSelectDialog() {
      this.showDialog = true
      // console.log("show colData", this.colData)
      if (this.listData.length == 0) {
        this.handlePageChange(1)
      }
    },
    onConfirm() {//选择确认
      if (this.colData.length == 0) {
        this.$message.warning('请添加映射关系')
        return
      }
      let hasCole = false
      let hasView = false
      let hasRowKey = false
      let paramSize = 0
      for (let item of this.colData) {
        if (!this.checkColItem(item)) {
          return
        }
        if (item.colMode == 0) {
          if (this.rowKey !== undefined && item.popCol == this.rowKey) {//未关联rowKey
            hasRowKey = true
          }
          hasCole = true
        } else if (item.colMode == 1) {//有展示的控件
          hasView = true
        } else if (item.colMode == 2) {
          if (item.formView || item.colName) {//未绑定组件或字段,忽略
            paramSize++
          }
        }
      }
      if (this.paramList && this.paramList.length != paramSize) {//未绑定参数
        if (this.dataType === 0) {//业务表参数不完整,直接忽略参数
          let array = []
          for (let i = 0; i < this.colData.length; i++) {
            let item = this.colData[i]
            if (item.colMode === 2) {
              break
            }
            array.push(item)
          }
          if (paramSize > 0) {
            this.$message.warning('参数不完整，即将忽略参数的设置')
          }
          this.colData = array
        } else {
          this.$message.warning('请先完善参数映射')
        }
        return
      }
      if (!hasView) {
        this.$message.warning('须绑定至少一个控件映射作为显示依据')
        return
      }
      if (!hasCole) {
        this.$message.warning('须绑定至少一个字段映射作为提交依据')
        return
      }
      const callback = () => {
        let selection = this.$refs.table.selection || []
        if (this.required && selection.length == 0) {
          this.$message.warning('请选择弹出框')
          return
        }
        let text = ''
        let result = ''
        for (let item of selection) {
          if (text != '') {
            text += ','
          }
          text += item.popName
          if (result != '') {
            result += ','
          }
          result += item.id
        }
        this.inputTxt = text
        if (this.single && selection.length == 1 && this._selectForNumber) {
          this.$emit("select", parseInt(result), this.viewIndex, this.viewId, this.colData, this.lazy)
        } else {
          this.$emit("select", result, this.viewIndex, this.viewId, this.colData, this.lazy)
        }
        this.lastSelection = this.deepClone(selection)
        this.hasChange = false
        this.showDialog = false
      }
      if (!hasRowKey) {
        this.$confirm('未绑定该弹出框的主键字段, 是否继续?', '映射异常')
          .then(() => {
            callback()
          }).catch(() => {
            //cancel
          })
      } else {
        callback()
      }
    },
    handlePageChange(page) {
      this.tableLoading = this.visible
      let params = { current: page || 1, size: this.pageSize }
      params.popName = this.search.popName
      params.remark = this.search.remark
      this.$axios.get('/api/rabbit-resource/formcustom/pop-datas', {
        params: params
      }).then(res => {
        if (res.data.data) {
          this.checkDefaultSelected()
          this.listData = res.data.data.records || []
          this.total = res.data.data.total
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })

    },
    rowSelectable(row) {
      if (this.parentCustom && this.parentCustom.popDataSelectable) {
        return this.parentCustom.popDataSelectable(row.id, this.viewId, this.tableId)
      }
      let parent = this.$parent
      while (parent) {
        if (typeof parent.popDataSelectable == 'function') {
          return parent.popDataSelectable(row.id, this.viewId)
        }
        parent = parent.$parent
      }
      return true
    },
    onSelectionChange(selection, first) {//用户选择了一个弹出框
      // console.log("onSelectionChange", selection)
      this.hasChange = true
      if (selection && selection.length > 0) {
        if (this._checkTimer) {
          clearTimeout(this._checkTimer)
        }
        this.checkTimer = setTimeout(() => {
          this._checkTimer = null
          let selects = this.$refs.table.selection
          if (selects && selects.length > 0) {
            let colInfo = selects[0].colInfo//弹出框字段配置
            this.dataType = selects[0].dataType
            this.popColList = colInfo ? JSON.parse(colInfo).column : []
            let params = selects[0].params ? JSON.parse(selects[0].params) : null
            this.paramList = filterSystemArgs(params)
            let id
            for (let col of this.popColList) {
              if (col.primaryKey) {
                id = col
                break
              } else if (/.+#ID$/i.test(col.prop)) {
                id = col
              }
            }
            this.rowKey = id && id.prop

            if (first) {//第一次回显
              return
            }
            this.colData = []
            // 插入一个弹出框id的关联
            let obj = { colMode: 0 }
            if (id) {
              obj.popView = id._id
              obj.popCol = id.prop
              obj.popTable = id.tableName
              obj.popTableId = id.tableId
              obj.primaryKey = id.primaryKey
              obj.popType = id.type || id.component
            }
            // console.log("first ", obj)
            this.colData.push(obj)
            this.colData.push({ colMode: 1, formView: this.viewId, colReplace: true })
            if (this.paramList.length) {
              for (let param of this.paramList) {
                this.colData.push({ colMode: 2, paramKey: param.value })
              }
            }
          } else {
            this.popColList = []
            this.colData = []
            this.paramList = []
          }
        }, 200);
      } else {
        this.popColList = []
        this.colData = []
        this.paramList = []
      }
    },
    onRemoveColClick(index) {
      let item = this.colData[index]
      if (item.formView === this.viewId || item.colMode == 2) {
        this.$message.warning('不能删除该映射')
        return
      }
      this.colData.splice(index, 1)
    },
    onRowSelect(selection, row) {
      // console.log("onRowSelect", selection, row)
      if (!this.rowSelectable(row)) {
        this.$refs.table.toggleRowSelection(row, false)
        this.$message.warning('一个弹出框只可在一个表单绑定一次')
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
    onDialogClosed() {
      if (this.hasChange && this.lastSelection.length) {
        this.colData = this.colDefault || []
        this._defSelection = this.deepClone(this.lastSelection)
        this.checkDefaultSelected(this.listData)
        this.hasChange = false
      }
    },
    getDefaultSelectList(ids) {
      cacheRequest({
        url: '/api/rabbit-resource/formcustom/pop-data',
        method: 'get',
        params: { ids }
      }, this.prop || this._uid, 'pop').then(data => {
        this._defSelection = data
        this.lastSelection = this.deepClone(data)
        // console.log("getDefaultSelectList")
        if (this.listData.length > 0) {
          this.checkDefaultSelected(this.listData, true)
        }
        this.hasChange = false
        this.inputTxt = data.map(it => it.popName).join()
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
        this.onSelectionChange(selection, true)
        return
      }
      for (let item of data) {
        let index = selection.findIndex(it => it.id == item.id)
        if (index >= 0) {
          selection.splice(index, 1, item)
        }
      }
      this.onSelectionChange(selection, true)
    },
  },
  watch: {
    colDefault: {
      handler(val) {
        // console.log("watch colDefault", val, this._uid)
        // this.lastSelection = []
        this.colData = val || []
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
.icon-btn {
  color: #409eff;
  font-size: 16px;
  cursor: pointer;
}
.icon-btn:hover {
  color: #69abef;
}
</style>
