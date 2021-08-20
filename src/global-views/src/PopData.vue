<template>
  <div class="select-wrapper">
    <el-autocomplete
      v-model="inputTxt"
      placeholder="选择数据"
      :readonly="readonly || !step"
      :disabled="disabled"
      :fetch-suggestions="querySearch"
      hide-loading
      @select="onAutoSelect"
      @input="onAutoInput"
      :triggerOnFocus="false"
      :popper-append-to-body="showText"
      :value-key="inputKey"
      :class="['input-with-select', {'no-text': !showText}]"
      :size="showSize"
      ref="input"
    >
      <el-button
        slot="append"
        icon="el-icon-position"
        @click="showSelectDialog"
        v-if="!readonly && !disabled"
        :size="showSize"
      >{{showText?'请选择':''}}</el-button>
    </el-autocomplete>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      @closed="onDialogClosed"
      append-to-body
      custom-class="my-dialog"
    >
      <avue-crud
        :data="listData"
        :option="option"
        :page.sync="page"
        :table-loading="loading"
        :search.sync="searchForm"
        ref="table"
        @current-change="onPageChange"
        @size-change="onSizeChange"
        @search-change="onSearchChange"
        @search-reset="onSearchReset"
        @refresh-change="onRefreshChange"
        @select="onRowSelect"
        @select-all="onAllSelect"
        @selection-change="onSelectionChange"
      >
        <template :slot="item.prop" slot-scope="scope" v-for="item in templateViews">
          <upload-show
            v-model="scope.row[item.prop]"
            :key="item.prop"
            :size="scope.size"
            :row="scope.row"
            :column="item"
            v-if="item.viewMode==8"
          ></upload-show>
          <id-show
            :form-id="formId"
            :row="scope.row"
            :column="item"
            :value="scope.row[item.prop]"
            :key="item.prop"
            v-else
          ></id-show>
        </template>
      </avue-crud>
      <div :class="[option.page && page.total?'footer-btn1':'footer-btn']">
        <el-button @click="onCancelClick">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { safeString, formatSearchValue } from '@/util/generator'
import UploadShow from '@/views/form/UploadShow'
export default {//弹出框
  name: 'PopData',
  model: {//不根据v-model赋值,根据定义手动赋值
    prop: 'value',
    event: 'change'
  },
  components: { UploadShow },
  inject: {
    parentForm: {
      default: () => { }
    },
    isFormTable: {
      default: false
    }
  },
  props: {
    limit: {//可选数量
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showText: {//是否显示按钮文字
      type: Boolean,
      default: true
    },
    required: {//是否可为空
      type: Boolean,
      default: false
    },
    step: {//查询模式,见view-list.js
      type: Number,
      default: 1
    },
    size: String,
    popId: [Number, String],
    event: Object,//用不到
    propsHttp: Object,//用不到
    action: String,//formCode,是为了不新增属性
    inputKey: String,//显示的prop
    valueKey: String,
    prop: String,
    _id: String,
    formId: String,
    interruptSelect: Function,//检查参数是否已赋值
    watchKey: Number,//用于观察,重置数据
    value: {
      type: [Array, String],
      default: () => ''
    }
  },
  computed: {
    showSize() {
      return this.size || this.option.size || 'small'
    }
  },
  data: () => {
    return {
      inputTxt: '',
      visible: false,
      searchForm: {},//查询表单
      listData: [],
      loading: false,
      hasGet: false,//是否已获取过列表数据
      page: { currentPage: 1, pageSize: 20, total: 0, pageSizes: [20] },
      title: '选择数据',
      defSelection: '',//默认选择数据
      lastSelection: [],//上次选择的数据
      bindInput: false,//是否正在为input赋值
      hasSelect: false,//是否emite过select
      hasChange: false,//选择的数据是否已变更
      searchMode: {},//查询模式缓存
      lastFlag: 0,//缓存上次检查的标记
      dataType: -1,
      templateViews: [],
      option: {
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menu: false,
        maxHeight: 300,
        column: [{ prop: 'prop', label: '' }]
      }
    }
  },
  methods: {
    findParentBindData() {
      let prefix = this.popId ? `p#${this.popId}#` : null
      if (!this.isFormTable && this.parentForm && this.parentForm.findBindData) {
        return this.parentForm.findBindData(prefix)
      }
      let parent = this.$parent
      while (parent) {
        if (typeof parent.findBindData == 'function') {
          return parent.findBindData(prefix)
        }
        parent = parent.$parent
      }
    },
    onConfirm() {
      let table = this.$refs.table
      // console.log("table", table.$refs)
      let selection = table.tableSelect || []
      if (this.required && selection.length == 0) {
        this.$message.warning('请选择数据')
        return
      }
      this.emitChange = true
      this.$emit('select', selection, this.option.rowKey)
      let col = this.inputKey || this.findFirstDisplayKey()
      // console.log("show key", col, this.valueKey)
      if (col) {
        this.inputTxt = selection.map(it => it[col]).join()
      } else {//走到这一步不合理
        this.inputTxt = '[DATA]'
      }
      if (this.valueKey) {
        this.$emit('change', selection.map(it => it[this.valueKey]).join(), this.inputTxt)
      } else if (!this.event || !this.event.select) {
        if (!this.option.rowKey) {
          this.$emit('change', this.inputTxt)
        } else {
          this.$emit('change', selection.map(it => it[this.option.rowKey]).join(), this.inputTxt)
        }
      }
      this.lastSelection = this.deepClone(selection)
      this.hasChange = false
      this.lastFlag = 0
      this.hasSelect = true
      this.visible = false
    },
    onCancelClick() {
      this.visible = false
    },
    findFirstDisplayKey() {
      if (this.option.column) {
        for (let item of this.option.column) {
          if (item.display) {
            return item.prop
          }
        }
      }
      return this.option.rowKey
    },
    onAutoSelect(item) {//autocomplete选择一个数据
      this.visible = false
      this.hasSelect = true
      this.emitChange = true
      this.$emit('select', item)
      this.defSelection = [item]
      this.lastFlag = 0
      this.lastSelection = [item]
      if (this.listData.length) {
        if (this.$refs.table && this.$refs.table.$refs.table) {
          this.$refs.table.selectClear()
        }
        this.checkDefaultSelected(this.listData)
      }
      this.hasChange = false
    },
    findParentFirstQuery() {//获取表单的关联数据
      let parent = this.findParent()
      if (parent && parent.getPopValue) {
        return parent.getPopValue(this.popId)
      }
    },
    notifyInputMatch(flag) {//通知输入的文字是有有匹配项0有,1不匹配,2 未选择
      if (this.lastFlag != flag) {
        this.$emit('error', flag)
        this.lastFlag = flag
      }
    },
    onAutoInput(str) {//输入框输入
      if (!str && this.step) {
        this.notifyInputMatch(0)
      }
    },
    querySearch(str, cb) {//查询输入的数据
      if (typeof this.interruptSelect == 'function' && this.interruptSelect()) {
        cb([])
        this.notifyInputMatch(0)
        return
      }
      if (!this.popId || !this.inputKey || this.bindInput) {
        cb([])
        this.notifyInputMatch(!str ? 0 : 1)
      } else {
        str = safeString(str)
        if (!str) {
          cb([])
          this.notifyInputMatch(1)
          if (this.$refs.table) {
            if (this.$refs.table.tableSelect.length) {
              this.emitChange = !!this.value
              this.$emit('select')
              this.lastFlag = 0
              this.hasSelect = false
            }
            if (this.$refs.table.$refs.table) {
              this.$refs.table.selectClear()
            }
          } else if (this.hasSelect) {
            this.emitChange = !!this.value
            this.$emit('select')
            this.lastFlag = 0
            this.hasSelect = false
          }
          this.defSelection = ''
          return
        }
        let bindData = this.findParentBindData()
        if (bindData === false) {
          console.log('输入查询时缺少绑定参数')
          // cb([])
          // this.notifyInputMatch(1)
          // return
          bindData = null
        }
        let query = {}
        if (this.step == 3) {
          query[this.inputKey] = str
        } else if (this.step == 2) {
          query[this.inputKey] = '%' + str + '%'
        } else {
          query[this.inputKey] = str + '%'
        }
        this.$axios.post('/api/rabbit-resource/formcustom/pop-data/info', {
          id: this.popId,
          query: query,
          current: -2,
          size: 60,
          linkId: this._hasPopOption ? 1 : 0,
          code: this.action,
          param: bindData,
          dateFormats: this.dateFormats
        }).then(res => {
          let data = res.data.data
          this.parseTableOption(data)
          let list = data.records || []
          if (list.length && this.visible) {
            this.visible = false
          }
          cb(list)

          if (!list.length && this.hasSelect) {
            this.emitChange = !!this.value
            this.$emit('select')
            this.lastFlag = 0
            this.hasSelect = false
          } else {
            this.notifyInputMatch(list.length ? 2 : 1)
          }
        }).catch(() => {
          cb([])
          this.notifyInputMatch(1)
        })
      }
    },
    getPopDataById(id, done) {//获取弹出框数据
      if (!id) {
        if (typeof done === 'function') {
          done()
        }
        return
      }
      this.loading = !done
      let query
      if (done == 1) {//获取选中的列表
        query = this.findParentFirstQuery()
        if (!query) {
          return
        }
      } else {
        query = {}
        for (let key in this.searchForm) {
          if (key.startsWith('$')) {
            continue
          }
          let val = this.searchForm[key]
          if (Array.isArray(val)) {
            val = val.join()
          } else {
            val = safeString(val)
            if (!val) {
              continue
            }
            let mode = this.searchMode ? this.searchMode[key] : 0
            if (!this.dateFormats || !this.dateFormats[key] || mode > 2) {
              val = formatSearchValue(mode, val)
            }
          }
          query[key] = val
        }
      }
      let bindData = this.findParentBindData()
      if (bindData === false) {//缺少参数,允许通过
        console.log('缺少绑定参数')
        // if (typeof done === 'function') {
        //   done()
        // }
        // this.loading = false
        // return
        bindData = null
      }
      let linkId = this._hasPopOption ? 1 : 0
      this.$axios.post('/api/rabbit-resource/formcustom/pop-data/info', {
        id: id,
        query: query,
        current: done == 1 ? 0 : (this.page.currentPage || 1),
        size: this.page.pageSize,
        linkId: linkId,
        code: this.action,
        param: bindData,
        dateFormats: this.dateFormats
      }).then(res => {
        let data = res.data.data || {}
        if (data.total !== undefined) {
          this.page.total = data.total
        }
        this.parseTableOption(data)
        if (done == 1) {//获取选择的数据
          this.defSelection = data.records || []
          this.lastSelection = this.deepClone(this.defSelection)
          this.hasSelect = true
          if (this.listData.length > 0) {
            this.checkDefaultSelected(this.listData)
          }
          this.hasChange = false
        } else {
          this.hasGet = true
          if (linkId) {
            this.checkDefaultSelected()
          } else {
            setTimeout(() => {
              this.checkDefaultSelected(this.listData)
            }, 60);
          }
          this.listData = data.records || []
          if (typeof done === "function") {
            done()
          }
        }
        this.loading = false
      }).catch(err => {
        console.log("err", err)
        this.loading = false
        if (typeof done === "function") {
          done()
        }
      })
    },
    parseTableOption(data) {//为option初始化值
      if (data.option) {
        this._hasPopOption = true
        this.option = JSON.parse(data.option.colInfo)
        this.option.maxHeight = 300
        this.option.size = 'small'
        this.option.header = false
        this.option.selection = true
        // this.option.indeterminate = this.limit != 1
        this.option.indeterminate = false
        this.option.refreshBtn = false
        this.option.reserveSelection = true
        this.option.rowKey = null
        this.buildColumns()
        // console.log("option", this.option.rowKey)
      }
    },
    buildColumns() {//缓存一些配置,searchMode,dateFormates等
      let columns = this.option.column || []
      this.searchMode = {}
      this.dateFormats = {}
      this.templateViews = []
      let showComponents = { 'areaSelect': 1, 'userSelect': 2, 'deptSelect': 3, 'postSelect': 4, 'roleSelect': 5, 'upload': 9 }
      for (let column of columns) {
        if ('idShow' === column.component) {
          this.templateViews.push(column)
        } else {
          let showIndex = !column.component ? 0 : showComponents[column.component]
          if (showIndex) {
            //搜索特定
            column.required = false
            column.viewMode = showIndex - 1
            this.templateViews.push(column)
          }
        }
        if (column.primaryKey) {
          this.option.rowKey = column.prop
        }
        if (column.search) {
          this.searchMode[column.prop] = column.searchMode
        }
        if (column.valueFormat) {
          this.dateFormats[column.prop] = column.valueFormat
        }
      }
      if (!this.option.rowKey) {
        this.option.rowKey = this.findOtherRowKey(columns)
      }
      this.$emit('row-key', this.option.rowKey)
      this.$refs.table && this.$refs.table.init()
    },
    findOtherRowKey(column) {//未设置主键,则找一个合适的主键
      let id = null
      let invisible = null
      let id2 = null
      let pattern = /#id$/i
      for (let col of column) {
        if (col.prop == 'id' || col.prop == "ID") {
          id = col
        }
        if (!col.display) {
          invisible = col
        } else if (pattern.test(col.prop)) {
          id2 = col
        }
        if (id && invisible && id2) {
          break
        }
      }
      if (id || id2) {
        return id ? id.prop : id2.prop
      }
      return invisible ? invisible.prop : column[0].prop
    },
    showSelectDialog() {//显示选择列表
      if (this.disabled) {
        return
      }
      if (typeof this.interruptSelect == "function" && this.interruptSelect()) {
        return
      }
      if (this.listData.length == 0 && (!this._hasPopOption || !this.hasGet)) {
        this.getPopDataById(this.popId)
      }
      this.visible = true
    },
    onRowSelect(selection, row) {//选中一行
      // console.log("onRowSelect", selection, row)
      if (this.limit != 0 && selection.length > this.limit) {
        let index = selection.findIndex(it => it != row)
        if (index >= 0) {
          let last = selection.splice(index, 1)[0]
          this.$refs.table.toggleRowSelection(last, false)
          return
        }
      }
    },
    onAllSelect(selection) {//全选
      if (this.limit != 0 && selection.length >= this.limit) {
        let select = this.$refs.table.tableSelect
        this.$refs.table.selectClear()
        if (select && select.length) {
          this.$refs.table.toggleSelection(select)
        }
      }
    },
    onPageChange(current) {
      this.page.currentPage = current;
      // console.log("onPageChange", current)
      this.getPopDataById(this.popId)
    },
    onSizeChange(size) {
      let current = this.page.pageSize * this.page.currentPage
      let newPage = Math.ceil(current / size)
      this.page.currentPage = newPage
      this.page.pageSize = size
      this.getPopDataById(this.popId)
    },
    onSearchReset() {
      this.page.currentPage = 1
      this.getPopDataById(this.popId)
    },
    onSearchChange(params, done) {
      this.page.currentPage = 1
      this.getPopDataById(this.popId, done)
    },
    onRefreshChange() {
      this.getPopDataById(this.popId)
    },
    findParent() {//获取父组件信息
      if (!this.isFormTable && this.parentForm && this.parentForm.form) {
        return this.parentForm
      } else {
        let parent = this.$parent
        while (parent) {
          if (typeof parent.getFormData == 'function') {
            return parent
          }
          parent = parent.$parent
        }
      }
    },
    checkDefaultSelected(data, hasCheck) {//默认选中的数据
      if (!hasCheck && !this.$refs.table) {
        // console.log("checkSelected not table")
        this.$nextTick(() => {
          if (this.$refs.table) {
            this.checkDefaultSelected(data, true)
          }
        })
        return
      }
      let selection = this.$refs.table.tableSelect
      // console.log("checkDefaultSelected", selection)
      if (this.defSelection) {
        if (selection.length == 0 || this.single) {
          selection = this.defSelection
          this.$refs.table.tableSelect = selection
          let inner = this.$refs.table.$refs.table
          if (inner) {
            inner.store.states.selection = selection
          }
        } else {
          let key = this.option.rowKey || this.inputKey
          this.defSelection.forEach(item => {
            if (!selection.find(it => it[key] == item[key])) {
              selection.push(item)
            }
          })
        }
        this.defSelection = '';
        this.hasChange = false
      }
      if (!data || data.length == 0 || selection.length == 0) {
        let inner = this.$refs.table.$refs.table
        if (inner) {
          let old = inner.store.states.selection
          if (old != selection) {
            inner.store.states.selection = selection
          }
        }
        return
      }
      let key = this.option.rowKey || this.inputKey
      for (let item of data) {//child时才需要
        let index = selection.findIndex(it => it[key] == item[key])
        if (index >= 0) {
          selection.splice(index, 1, item)
        }
      }
    },
    onDialogClosed() {//取消后还原选择的数据
      if (this.hasChange && this.lastSelection.length) {
        this.defSelection = this.deepClone(this.lastSelection)
        this.checkDefaultSelected(this.listData)
        this.hasChange = false
      }
    },
    onSelectionChange() {
      this.hasChange = true
    },
    bindInputValue() {//为input从表单中赋值
      let parent = this.findParent()
      // console.log("bindInputValue", parent)
      if (parent) {
        // let current = this.inputTxt
        this.bindInput = true
        if (!this.inputKey) {
          this.inputTxt = this.value
        } else if (this.value) {
          this.inputTxt = parent.getFormData(this.inputKey)
        }
        if (this.$refs.table && this.$refs.table.$refs.table) {
          this.$refs.table.selectClear()
        }
        if (this.inputTxt === undefined) {
          this.inputTxt = this.value || ''
        }
        this.defSelection = ''
        this.hasSelect = false
        this.bindInput = false
        this.getPopDataById(this.popId, 1)
      }
    }
  },
  watch: {
    popId: {
      handler(val) {
        if (this.inputTxt) {
          if (this.$refs.table && this.$refs.table.$refs.table) {
            this.$refs.table.selectClear()
          }
          this.inputTxt = ''
          this.defSelection = ''
          this.lastSelection = []
          this.hasChange = false
        }
        if (val) {
          this._hasPopOption = false
          if (this.visible) {
            this.getPopDataById(val)
          } else {
            this.listData = []
          }
        }
      },
      immediate: true
    },
    value: {//默认的v-model生效
      handler() {
        // console.log("watch pop value", this.value, this.emitChange)
        if (this.emitChange) {
          this.emitChange = false
          return
        }
        this.bindInputValue()
      },
      immediate: true
    },
    watchKey() {
      this.emitChange = true
      this.hasGet = false
      if (this.$refs.table && this.$refs.table.$refs.table) {
        this.$refs.table.selectClear()
      }
      this.inputTxt = ''
      this.hasSelect = false
      this.defSelection = ''
      this.lastSelection = []
      this.hasChange = false
      if (this.visible) {
        this.getPopDataById(this.popId)
      } else {
        this.listData = []
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer-btn {
  margin-top: -15px;
  margin-bottom: 5px;
  text-align: end;
}
.footer-btn1 {
  right: 26px;
  bottom: 28px;
  position: absolute;
}

/deep/ .el-autocomplete-suggestion {
  width: auto !important;
}
</style>
