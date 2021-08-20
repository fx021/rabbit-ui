<template>
  <div>
    <avue-crud
      :data="listData"
      :option="optionView"
      :page.sync="page"
      :table-loading="loading"
      :summary-method="getSumMethod"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      @refresh-change="onRefreshChange"
      @row-dblclick="onRowDblClick"
      ref="crud"
    >
      <template slot="menuLeft" v-if="canEdit">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          plain
          @click.stop="handleAdd"
          v-if="option.addBtn"
        >新增</el-button>
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          plain
          @click.stop="handleImport"
          v-if="option.importBtn"
        >导入</el-button>
        <el-button
          type="danger"
          icon="el-icon-folder-delete"
          size="mini"
          plain
          @click.stop="handClear"
          v-if="option.editBtn"
        >清空</el-button>
      </template>
      <template slot-scope="scope" slot="menu" v-if="canEdit">
        <el-button
          type="text"
          size="mini"
          @click.stop="handleRowEdit(scope.row, -1)"
          v-if="scope.row.$cellEdit"
        >取消</el-button>
        <el-button
          type="text"
          size="mini"
          @click.stop="handleRowEdit(scope.row, scope.index)"
          v-if="scope.row.$cellEdit"
        >确定</el-button>
        <el-button
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click.stop="handleEdit(scope.row, scope.index, hasEditRow==2)"
          v-if="option.editBtn && !scope.row.$cellEdit"
        >编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-document-copy"
          size="mini"
          @click.stop="handleCopy(scope.row, scope.index)"
          v-if="option.copyBtn && !scope.row.$cellEdit"
        >复制</el-button>
        <el-button
          type="text"
          icon="el-icon-delete"
          size="mini"
          @click.stop="handleRemove(scope.row, scope.index)"
          v-if="option.delBtn && !scope.row.$cellEdit"
        >删除</el-button>
        <el-button
          type="text"
          icon="el-icon-view"
          size="mini"
          @click.stop="handleView(scope.row, scope.index)"
          v-if="option.viewBtn && !scope.row.$cellEdit"
        >查看</el-button>
      </template>
      <template :slot="item.slotName || item.prop" slot-scope="scope" v-for="item in templateViews">
        <id-show
          :form-id="formId"
          :value="scope.row[item.prop]"
          :column="item"
          :row="scope.row"
          :size="scope.size"
          :key="item.prop"
          :readonly="!item.slotName"
          v-if="item.viewMode<8"
        ></id-show>
        <upload-show
          v-model="scope.row[item.prop]"
          :key="item.prop"
          :size="scope.size"
          :row="scope.row"
          :column="item"
          v-else-if="item.viewMode==8"
        ></upload-show>
        <row-expression
          v-model="scope.row[item.prop]"
          :key="item.prop"
          :size="scope.size"
          :row="scope.row"
          :action-data="item.actionData"
          :controls="item.controls"
          :prepend="item.prepend"
          :append="item.append"
          :action="item.action"
          :precision="item.precision"
          :readonly="!item.slotName"
          :prop="item.prop"
          v-else
        ></row-expression>
      </template>
    </avue-crud>
    <el-dialog
      :title="formMode==1?'新增记录':'编辑记录'"
      :visible.sync="visible"
      width="88%"
      :fullscreen="fullScreen"
      append-to-body
    >
      <div class="download-text">
        <el-link icon="el-icon-full-screen" :underline="false" @click="fullScreen=!fullScreen"></el-link>
      </div>
      <form-display
        :form-option="formOption"
        :form-id="formId"
        v-model="formData"
        @submit="onFormSubmit"
        @cancel="onFormCancel"
      ></form-display>
    </el-dialog>
    <el-dialog title="导入记录" :visible.sync="importVisible" width="420px" append-to-body>
      <div class="download-text">
        <el-link @click="onDownload" type="warning">下载模板</el-link>
      </div>
      <el-upload
        drag
        :file-list="fileList"
        :auto-upload="false"
        action="/api/rabbit-resource/oss/endpoint/upload"
        :on-change="onFileChange"
        :on-remove="onRemoveFile"
        accept=".xls, .xlsx"
        style="text-align:center"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过10M</div>
      </el-upload>
      <div style="text-align:center;margin:20px 0 10px">
        <el-button size="small" @click="onUploadCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="onUploadClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import excelImporter from '@/util/excel-importer'
import UploadShow from '@/views/form/UploadShow'
import { safeString, bindUserList } from '@/util/generator'
export default {//子表
  components: { UploadShow },
  name: 'FormTable',
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    parentForm: {
      default: () => { }
    }
  },
  provide() {
    return {
      isFormTable: true,
    }
  },
  props: {
    vlabel: String,//卡片标题
    tableId: String,//业务表id
    formId: String,//表单id,需要获取默认值
    readonly: {//只读
      type: Boolean,
      default: false,
    },
    disabled: {//禁用,暂无效
      type: Boolean,
      default: false,
    },
    required: {//是否不可为空
      type: Boolean,
      default: true,
    },
    rowEditable: {//行编辑 
      type: Boolean,
      default: true
    },
    emited: {//表单数据是否已提交
      type: Number,
      default: 0
    },
    value: Array,//默认值
    event: Object,//只是为了不让其显示在HTML里
    size: String,//同上
    watchKey: Number,//参数是否已变更
    option: {//列表的option
      type: Object,
      default: () => {
        return {
          addBtn: false,
          refreshBtn: false,
          columnBtn: false,
          menu: false,
          column: [{ prop: 'prop', label: '' }]
        }
      }
    }
  },
  computed: {
    isPreview() {//是否来自预览
      return !this.parentForm
    },
    isEditMode() {//是否编辑
      return this.parentForm && this.parentForm.isEditMode
    },
    formOption() {//弹出菜单的option,已废弃,可不维护
      let option = this.deepClone(this.option)
      option.printBtn = false
      option.mockBtn = false
      option.size = this.parentForm && this.parentForm.option.size || 'small'
      if (this.formMode == 3 || this.readonly) {
        option.menu = false
        option.header = false
        option.menuBtn = false
        option.detail = true
        option.submitBtn = false
        option.emptyBtn = false
      } else {
        option.submitBtn = this.formMode == 1 ? option.saveBtn : option.updateBtn
        option.emptyBtn = option.cancelBtn
      }
      if (this.isEditMode) {
        for (let column of option.column) {
          column.disabled = column.disabled || column.editDisabled
        }
      }
      // console.log("formOption", option, this.formMode)
      return option
    },
    optionView() {//列表的option
      let option = this.deepClone(this.option)
      option.maxHeight = 460
      //自定义新增和编辑
      option.addBtn = false
      option.editBtn = false
      option.delBtn = false
      option.viewBtn = false
      option.copyBtn = false
      option.menuWidth = 120
      option.menu = !this.readonly && (this.editBtn || this.copyBtn || this.delBtn)
      option.header = !this.readonly
      if (this.isEditMode) {
        for (let column of option.column) {
          column.disabled = column.disabled || column.editDisabled
        }
      }
      return option
    },
    canEdit() {//是否可新增编辑
      return this.option.rowKey && !this.readonly && !this.disabled
    }
  },
  data: () => {
    return {
      listData: [],//列表数据
      fullScreen: false,//弹出表单的dialog控制
      loading: false,//loading
      formMode: 0,//标明正在进行新增还是编辑
      visible: false,//弹出菜单显示控制,已废弃
      importVisible: false,//导入的dialog显示
      sumData: {},//统计信息
      formData: {},//正在编辑的数据
      defaultForm: '',//行的默认值设置
      file: '',//模板file
      fileList: [],//模板上传列表
      templateViews: [],//需要template的组件
      hasEditRow: 0,//是否有行编辑,现在都是行编辑,可废弃
      popValid: {},//弹出框验证判断
      enhanceTypes: [],//增强位置信息
      paramMap: {},//SQL参数映射
      page: {//分页page
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      }
    }
  },
  created() {
    if (Array.isArray(this.value)) {
      this.listData = this.value
    }
    // console.log("table created", this._uid)
    this.bindOptionValue()
  },
  beforeDestroy() {
    delete this.dateFormats
    delete this.viewProps
    delete this.popValueMap
    delete this.popViewMap
    if (this.changeTimer) {
      clearTimeout(this.changeTimer)
      this.changeTimer = null
    }
  },
  methods: {
    findParentFormDefine() {
      if (this.parentForm && this.parentForm.getDataInfo) {
        return this.parentForm.getDataInfo()
      }
      let parent = this.$parent
      while (parent) {
        if (typeof parent.getDataInfo == 'function') {
          return parent.getDataInfo()
        }
        parent = parent.$parent
      }
      return null
    },
    bindOptionValue(change) {//解析option,缓存组件信息
      this._bindValue = true
      this.buildColumns(this.buildPopViewMap())
      this.$refs.crud && this.$refs.crud.init()
      if (this.unwatchers) {
        for (let unwatch of this.unwatchers) {
          unwatch()
        }
      }
      let unwatchers = []
      const watchParamKey = (key, prop) => {
        let keys = key.split('#')
        let popId = keys[1]
        let pkey = keys[0] == 'p' ? 'popId' : 'linkId'
        return this.$watch(() => {
          return this.getFormData(prop)
        }, () => {
          if (this.initing || this.visible) {
            return
          }
          let column = this.findOptionColumn(pkey, popId)
          if (column) {
            //this.$set(column, 'watchKey', column.watchKey ? 0 : 1)
            column.watchKey = column.watchKey ? 0 : 1
            let form = this.getFormData()
            if (pkey == 'popId' && this.popValueMap) {
              let colList = this.popValueMap[popId] || []
              for (let col of colList) {
                // console.log("update pop value", col.to)
                this.$set(form, col.to, '')
              }
            }
            this.$set(form, column.prop, '')
          }
        })
      }
      for (let key in this.paramMap) {
        let prop = this.paramMap[key]
        // console.log("watch param key change", key, prop)
        unwatchers.push(watchParamKey(key, prop))
      }
      this.unwatchers = unwatchers
      this._bindValue = false
      if (change || !this.option.formCode || !this.option.linkId) {
        // this.$message.warning('缺少必要参数')
        //通过formCode和linkId去获取表格数据
        return
      }
      setTimeout(() => {
        this.getEnhanceTypes()
        this.onPageChange(1)
      }, 100);
    },
    buildPopViewMap() {//解析弹出框,FormDisplay已解析过了,直接拿来用
      if (this.isPreview) {
        return
      }
      this.popValueMap = this.parentForm && this.parentForm.popValueMap || {}
      let viewMap = this.parentForm && this.parentForm.popViewMap || {}
      let viewParamMap = this.parentForm && this.parentForm.viewParamMap || {}
      let parentParam = this.parentForm && this.parentForm.paramMap || {}
      this.paramMap = {}
      this.dateFormats = {}//同FormDisplay
      this.viewProps = {}
      this.popValid = {}
      this.defaultForm = ''
      return { viewMap, viewParamMap, parentParam }
    },
    bindPopFromValue(value, prop, valueCol) {//弹出框字段赋值
      if (this.visible) {
        //正常编辑模式
        return
      }
      if (!valueCol) {
        valueCol = ''
      }
      if (Array.isArray(value)) {
        value = value.map(it => it[valueCol]).join(",")
      } else if (typeof value == 'object') {
        value = value[valueCol]
      }
      if (value === undefined) {
        value = ''
      }
      let target = this.listData[this._updateIndex]
      this.$set(target, prop, value)
      // console.log("table bind pop", target, prop)
    },
    checkPopValueBind(value, popId) {//弹出框字段映射
      if (!this.popValueMap) {
        return
      }
      let colList = this.popValueMap[popId] || []
      for (let item of colList) {//值的绑定
        this.bindPopFromValue(value, item.to, item.from)
      }
    },
    getPopValue(popId, rowKey) {//获取弹出框表单数据
      let colList = this.popValueMap[popId] || []
      if (!colList.length) {
        return
      }
      if (colList.length == 1) {
        let value = this.getFormData(colList[0].to)
        if (!value) {
          return null
        }
        let obj = {}
        obj[colList[0].from] = value
        return obj
      }
      if (!rowKey) {
        let form = this.getFormData()
        let result = {}
        let exclude = {}
        for (let vid in this.popViewMap) {
          let viewPop = this.popViewMap[vid]
          if (viewPop.popId == popId) {
            exclude[viewPop.colName] = 1
          }
        }
        let hasVal = false
        for (let col of colList) {
          if (!exclude[col.from] && form[col.to]) {
            result[col.from] = form[col.to]
            hasVal = true
          }
        }
        return hasVal ? result : null
      }
      let col = colList.find(it => it.from == rowKey)
      if (!col) {
        col = colList[0]
      }
      let value = this.getFormData(col.to)
      if (!value) {
        return null
      }
      let obj = {}
      obj[col.from] = value
      return obj
    },
    buildColumns(bind) {//遍历,缓存组件信息
      let columns = this.option.column || []
      this.templateViews = []
      let hasEdit = false
      let hasShow = false
      let showComponents = ['areaSelect', 'userSelect', 'deptSelect', 'postSelect', 'roleSelect']
      for (let column of columns) {
        column.cell = this.rowEditable || column.cell
        if (column.hide === undefined) {
          column.hide = !column.display
        }
        if (column.cell && !column.hide) {
          hasEdit = true
        } else if (!column.hide) {
          hasShow = true
        }
        if (column.showWordLimit) {//行编辑下太占位置
          column.showWordLimit = false
        }
        if (!column.label) {
          if (column.component === 'download') {
            column.label = '模板附件'
          } else {
            column.label = '[单位]'
          }
        }
        if (!column.event) {
          column.event = {}
        }
        if (bind) {
          this.popViewMap = bind.viewMap
          if (bind.viewMap && bind.viewMap[column._id]) {
            let viewPop = bind.viewMap[column._id]
            this.viewProps[column._id] = column.prop

            if (viewPop.colName == column.prop) {
              if (!/^[ntgp]#.+/.test(column.prop)) {
                column.prop = `p#${viewPop.popId}#${column.prop}`
              }
              //exclude在父级过滤
            }
            if ('popData' == column.component) {
              // console.log("弹出框", column.label, column.prop, viewPop.colName)
              column.showText = false
              column.inputKey = viewPop.colName
              column.watchKey = 0
              column.event = {}
              let pattern = new RegExp("^p#" + column.popId)
              column.interruptSelect = () => {//参数检查
                let form = this.getFormData()
                for (let param in this.paramMap) {
                  if (pattern.test(param) && !form[this.paramMap[param]]) {
                    let rl = this.findRelateLabel(this.paramMap[param])
                    this.$message.warning(`弹出框缺少参数，${rl}`)
                    return true
                  }
                }
              }
              if (!column.rules) {
                column.rules = []
              }
              column.rules.push({
                validator: (rule, value, callback) => {
                  let flag = this.popValid[column.prop]
                  if (flag) {
                    callback(new Error(flag == 1 ? `输入的内容不匹配` : `请选择一个匹配输入`))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              })
              column.event.error = (flag) => {//输入结果回传
                this.popValid[column.prop] = flag
              }
              column.event.select = (value) => {//选择后数据赋值
                let old = this.popValid[column.prop]
                this.popValid[column.prop] = 0
                if (old && this.$refs.crud.$refs.cellForm) {
                  this.$refs.crud.$refs.cellForm.clearValidate(`list.${this._updateIndex}.${column.prop}`)
                }
                // console.log("pop change", value, column)
                this.bindPopFromValue(value, column.prop, column.inputKey)
                if (column.popId) {
                  for (let vid in bind.viewMap) {//组件映射
                    let popView = bind.viewMap[vid]
                    if (popView && popView.popId == column.popId) {
                      let colView = this.findOptionColumn('_id', vid)
                      if (colView) {
                        this.bindPopFromValue(value, colView.prop, popView.colName)
                      }
                    }
                  }
                }
                this.checkPopValueBind(value, column.popId)//字段映射
                if (column.event.change) {
                  column.event.change(value)
                }
              }
            }
            for (let key in bind.parentParam) {
              if (key.startsWith(`p#${column.popId}#`)) {
                this.paramMap[key] = bind.parentParam[key]
              }
            }
          }//popview end
          if (bind.viewParamMap && bind.viewParamMap[column._id]) {
            let innerParams = bind.viewParamMap[column._id]
            for (let paramKey of innerParams) {
              this.paramMap[paramKey] = column.prop
            }
          }
        }//bind pop end
        let showIndex = showComponents.findIndex(it => it == column.component)
        if (showIndex >= 0) {//idShow
          column.showText = false
          column.viewMode = showIndex
          this.templateViews.push(column)
        }
        if (this.dateFormats && column.valueFormat) {
          this.dateFormats[column.prop] = column.valueFormat
        }
        if (column.valueExp) {//默认值
          if (column.valueExp.disabled) {
            column.disabled = true
          }
          if (!this.defaultForm) {
            this.defaultForm = {}
          }
          let valueKey = column.valueExp.key
          if (valueKey) {
            this.defaultForm[valueKey] = column.valueExp
          } else {
            this.defaultForm[column.prop] = column.valueExp
          }
        }//value end
        if (column.changeEvent) {
          column.changeEvent = decodeURIComponent(column.changeEvent)
          column.event.change = (value) => {
            if (this.initing) {
              return
            }
            if (column.changeEvent) {
              try {
                Function('self', 'value', 'column', column.changeEvent)(this, value, column)
              } catch (error) {
                console.log('chang事件异常', error)
              }
            }
          }
        }//changeEvent end
        if (!column.prop) {
          column.prop = 'p#' + column._id
        }
        if ('rowExpression' === column.component) {
          column.viewMode = 9
          column.slotName = `${column.prop}Form`
          this.templateViews.push(column)//编辑的
          //查看的
          this.templateViews.push({ viewMode: 9, prop: column.prop, action: column.action, prepend: column.prepend, append: column.append, precision: column.precision, actionData: column.actionData, controls: column.controls })
        } else if (column.type === 'upload') {
          column.listType = 'text'
          // if (column.fileSize) {//2.8.3以上兼容
          //   column.fileSize /= 1024
          // }
          column.uploadExceed = () => {
            this.$message.warning('最大上传数量为 ' + column.limit)
          }
          column.viewMode = 8
          this.templateViews.push(column)//上传的列表回显
        } else if ('userSelect' === column.component) {
          column.event.select = (userList, flag) => {
            bindUserList(userList, column.actionData, this, flag && !this.isRowEdit())
          }
        } else if ('idShow' === column.component) {
          this.templateViews.push(column)
          let colClone = Object.assign({}, column)
          colClone.slotName = `${column.prop}Form`//编辑的
          this.templateViews.push(colClone)
        }
      }
      this.hasEditRow = !hasEdit ? 0 : (hasShow ? 1 : 2)
    },
    isRowEdit() {//行新增还是编辑
      let form = this.getFormData()
      return this.option.rowKey && !!form[this.option.rowKey]
    },
    getFormData(key) {//获取正在编辑的表单数据
      let form = this.visible ? this.formData : this.listData[this._updateIndex]
      if (!form) {
        return !key && {}
      }
      return !key ? form : form[key]
    },
    //卡片里列表的增删改应该与外部表单关联
    getTableData() {
      return this.listData || []
    },
    findRelateLabel(prop) {//查找参数关联的组件label
      let column = this.findOptionColumn('prop', prop)
      if (column) {
        if (column.display) {
          return `请先输入${column.label}`
        } else {//可能是弹出框赋值
          let popId = null
          for (let key in this.popValueMap) {
            let colList = this.popValueMap[key] || []
            let col = colList.find(it => it.to == prop)
            if (col) {
              popId = key
              break
            }
          }
          let pop = popId && this.findOptionColumn('popId', popId)
          if (pop) {
            return `请先选择${pop.label}`
          }
        }
      }
      return '请按序选择'
    },
    onPageChange(page, form) {
      if (form && this._bindValue === undefined) {//加个保险
        console.log("table 还未初始化")
        return
      }
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
    handClear() {//只有卡片列表才有
      if (!this.option.rowKey) {
        this.$message.warning('缺少主键，不能清空')
        return
      }
      this.$confirm('操作无法撤回，确定要清空该表格吗?')
        .then(() => {
          this.clearData()
        }).catch(() => {
          //cancel
        })
    },
    checkDataEmtpy(data) {//正在编辑的行是否都为空
      if (this.formMode <= 0) {
        return false
      }
      if (!data) {
        data = this.listData[this._updateIndex]
      }
      if (!data) {
        return false
      }
      // console.log("check data emtpty", data, this._updateIndex)
      let empty = true
      for (let key in data) {
        if (!key.startsWith('$') && (data[key] == 0 || safeString(data[key]))) {
          empty = false
          break
        }
      }
      if (empty) {
        this.$message.warning(`第 ${this._updateIndex + 1} 行数据都为空，请输入数据`)
        return true
      }
      return false
    },
    checkLastData(form) {//编辑一行,确认一行,检查最后编辑的一行数据
      if (form && this.required && (!this.listData || !this.listData.length)) {
        this.$message.warning('表格数据为空')
        return Promise.reject()
      }
      if (this.formMode != 0 && !this.visible && this.listData && this.listData.length) {
        if (this._updateIndex !== undefined) {
          if (this.checkDataEmtpy()) {//数据都为空,是不可以的
            return Promise.reject()
          }
          if (!this.enhanceTypes.find(it => it == 2)) {//是否有保存验证
            return this.localValid(this._updateIndex)
          }
          return Promise.all(this.localValid(this._updateIndex),
            this.remoteValid(this.listData[this._updateIndex], this.getParentFieldData()))
        }
      }
      return Promise.resolve()
    },
    getParentFieldData() {//表单数据,用于验证
      let formData = this.parentForm && this.parentForm.getFormData()
      let data = {}
      if (formData) {
        for (let key in formData) {
          if (!key.startsWith('g#') && !key.startsWith('p#')) {
            data[key] = formData[key]
          }
        }
      }
      return data
    },
    localValid(index) {//本地校验
      return new Promise((resolve, reject) => {
        let cellForm = this.$refs.crud && this.$refs.crud.$refs.cellForm
        let fields = cellForm ? cellForm.fields : []
        let valids = fields.filter(it => it.prop.split(".")[1] == index)
        if (valids.length) {
          let count = 0
          let validMsg = ''
          valids.forEach(field => {
            field.validate('', message => {
              if (message) {
                validMsg = message
              }
              if (++count === valids.length) {
                if (!validMsg) {
                  this.listData[index].$cellEdit = false
                  resolve()
                } else {
                  this.$message.warning(`第 ${index + 1} 行: ${validMsg}`)
                  reject(validMsg)
                }
              }
            })
          })
        } else {
          resolve()
        }
      })
    },
    remoteValid(row, parent, suffix) {//服务器校验
      if (!suffix) {
        suffix = 2;
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$axios.post("/api/rabbit-resource/formcustom/form-script", {
          formId: this.formId,
          type: `${this.option.linkId}_${suffix}`,
          param: row,
          parent: parent
        }).then(res => {
          let data = res.data.data
          this.loading = false
          if (!data) {
            resolve()
          } else {
            this.$message.warning(data + '')
            reject(data)
          }
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    handleAdd() {//列表新增和获取默认值
      if (this.formMode == 2) {
        this.$message.warning('请先确定上个编辑的内容')
        return
      }
      if (this.hasEditRow == 2) {
        this.checkLastData().then(() => {//上次新增/编辑的行是否合法
          let callback = (data) => {
            this.formMode = 1
            this._updateIndex = this.listData.length
            this.formData = data || {}
            // console.log("table add", this.formData)
            this.initing = true
            if (data) {
              this.listData.push(Object.assign({}, data, { '$cellEdit': true }))
            } else {
              this.listData.push({ '$cellEdit': true })
            }
            this.loading = false
            setTimeout(() => {
              this.initing = false
            }, 600);
          }
          this.loading = true
          let body = { '$linkId': { value: this.option.linkId } }
          if (this.defaultForm) {
            for (let key in this.defaultForm) {
              body[key] = this.defaultForm[key]
            }
          } else if (!this.enhanceTypes.find(it => it == 1)) {
            callback()
            return
          }
          this.$axios.post('/api/rabbit-resource/formcustom/form-def/' + this.formId, body)
            .then(res => {
              callback(res.data.data)
            }).catch(() => {
              this.loading = false
            })
        })
      } else {
        this.formMode = 1
        this._updateIndex = this.listData.length
        this.formData = {}
        this.visible = true
      }
    },
    handleImport() {
      this.checkLastData().then(() => {
        this.importVisible = true
      })
    },
    onRowDblClick(row) {
      if (this.option.dblEdit && !row.$cellEdit) {
        this.handleEdit(row, row.$index, this.hasEditRow != 0)
      }
    },
    handleRowEdit(row, index) {
      if (index == -1) {
        this.initing = true
        if (this.formMode == 1) {
          this.listData.splice(this._updateIndex, 1)
        } else {
          this.$set(this.listData, this._updateIndex, this.formData)
        }
        this.formMode = 0
        setTimeout(() => {
          this.initing = false
        }, 600);
        return
      }
      this.checkLastData().then(() => {
        this.initing = true
        row.$cellEdit = false
        this.formMode = 0
        // this.listData.splice(index, 1, row)
        this.notifyChange()
        setTimeout(() => {
          this.initing = false
        }, 600);
      })
    },
    handleEdit(row, index, inner) {
      if (typeof row == 'object') {
        if (!this.option.rowKey) {
          this.$message.warning('缺少主键，不能编辑')
          return
        }
      }
      this.checkLastData().then(() => {
        this.formMode = 2
        this._updateIndex = index
        this.formData = Object.assign({}, row)
        if (inner) {
          this.initing = true
          this.$set(row, '$cellEdit', true)
          setTimeout(() => {
            this.initing = false
          }, 600);
        } else {
          this.visible = true
        }
      })
    },
    handleView(row, index) {
      this.checkLastData().then(() => {
        this.formMode = 3
        this._updateIndex = index
        this.formData = row
        this.visible = true
      })
    },
    handleCopy(row, index) {
      if (typeof row == 'object') {
        if (!this.option.rowKey) {
          this.$message.warning('缺少主键，不能复制')
          return
        }
      }
      this.checkLastData().then(() => {
        let obj = Object.assign({}, row)
        obj[this.option.rowKey] = null
        this.listData.splice(index, 0, obj)
        this.fixUpdateIndex(index, 1)
        this.notifyChange()
      })
    },
    fixUpdateIndex(index, count) {
      if (this.formMode != 0) {
        if (this._updateIndex > index) {
          this._updateIndex += count
        }
      }
    },
    clearData(form) {//清空数据
      if (form == 1) {//表单新增时,不检查
        this.listData = []
        this.formMode = 0
        this.visible = false
        return Promise.resolve()
      }
      let list = this.listData || []
      let check = []
      for (let item of list) {
        if (this.option.rowKey && item[this.option.rowKey]) {//只有编辑的数据才需要验证
          check.push(item)
        }
      }
      if (check.length && this.enhanceTypes.find(it => it == 3)) {//有删除前的验证则提交服务器
        if (!form) {
          this.loading = true
        }
        let parent = this.getParentFieldData()
        return new Promise((resolve, reject) => {
          this.$axios.post('/api/rabbit-resource/formcustom/table-clear', {
            formId: this.formId,
            type: `${this.option.linkId}_3`,
            paramList: check,//与删除不一样的地方,可以传数组
            parent: parent
          }).then(res => {
            let newList = res.data.data || []
            // for (let item of newList) {
            //   item.$cellEdit = false
            // }
            this.listData = newList
            this.loading = false
            this.formMode = 0
            this.visible = false
            if (!form) {
              this.notifyChange()
            }
            resolve()
          }).catch(err => {
            this.loading = false
            reject(err)
          })
        })
      } else {
        this.formMode = 0
        this.visible = false
        this.listData = []
        if (!form) {
          this.notifyChange()
        }
        return Promise.resolve()
      }
    },
    handleRemove(row, index) {//删除行
      this.$confirm('确定要删除该记录吗?', '', {
        type: 'warning'
      }).then(() => {
        const removeAction = () => {
          this.listData.splice(index, 1)
          this.fixUpdateIndex(index, -1)
          this.notifyChange()
        }
        if (this.option.rowKey && row[this.option.rowKey]) {//非新增数据才需要检查
          if (this.enhanceTypes.find(it => it == 3)) {//是否有删除前验证
            let parent = this.getParentFieldData()
            this.remoteValid(row, parent, 3)
              .then(() => {
                removeAction()
                if (this.enhanceTypes.find(it => it == 4)) {//是否有删除后
                  this.remoteValid(row, parent, 4)
                }
              })
          } else {
            removeAction()
            if (this.enhanceTypes.find(it => it == 4)) {
              let parent = this.getParentFieldData()
              this.remoteValid(row, parent, 4)
            }
          }
        } else {
          removeAction()
        }
      }).catch(() => {
        //cancel
      })
    },
    notifyChange() {
      this.emitChange = true
      // console.log("table notify change")
      //会影响option,在watch里加个延迟
      if (this.changeTimer) {
        clearTimeout(this.changeTimer)
      }
      setTimeout(() => {
        this.changeTimer = null
        this.$emit('change', this.deepClone(this.listData))
      }, 400)
    },
    onFormCancel() {
      this.formMode = 0
      this.visible = false
    },
    onFormSubmit(form) {
      if (this.formMode == 1) {
        this.listData.unshift(form)
      } else {
        this.listData.splice(this._updateIndex, 1, form)
      }
      this.formMode = 0
      this.visible = false
      this.notifyChange()
    },
    findParentBindData() {//表单关联的SQL参数
      let prefix = this.option.linkId ? `g#${this.option.linkId}#` : null
      if (this.parentForm && this.parentForm.findBindData) {
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
    findBindData(prefix) {//组装好弹出框参数绑定关系
      let form = this.getFormData()
      if (this.paramMap && form) {
        let param = {}
        let hasVal = false
        let hasParam = false
        for (let key in this.paramMap) {
          if (prefix && !key.startsWith(prefix)) {
            // console.log("不是该组件需要的", key, prefix)
            continue
          }
          let prop = this.paramMap[key]
          hasParam = true
          let value = form[prop]
          if (value !== undefined) {
            param[key] = value
            hasVal = true
          }
        }
        if (hasParam && !hasVal) {
          return false
        }
        return param
      }
    },
    findParentLinkQuery() {//获取关联的字段数据
      if (this.parentForm && this.parentForm.findTablelinkQuery) {
        return this.parentForm.findTablelinkQuery(this.option.linkId)
      }
      let parent = this.$parent
      while (parent) {
        if (typeof parent.findTablelinkQuery == 'function') {
          return parent.findTablelinkQuery(this.option.linkId)
        }
        parent = parent.$parent
      }
    },
    onRefreshChange(watch) {
      if (this.isPreview) {
        return
      }
      this.loading = watch !== 1
      let bindData = this.findParentBindData()
      if (bindData === false) {
        if (this.loading) {
          this.$message.warning("SQL参数未设置数据")
          this.loading = false
        }
        return
      }
      let params = {
        current: this.option.page ? this.page.currentPage : 0,
        size: this.page.pageSize,
        param: bindData,
        query: this.findParentLinkQuery(),//字段映射
        viewProps: this.viewProps,//id-prop映射,可不传
        code: this.option.formCode,
        linkId: this.option.linkId,
        dateFormats: this.dateFormats
      }
      this.$axios.post("/api/rabbit-resource/formcustom/form-table", params)
        .then(res => {
          let data = res.data.data || {}
          if (data.total !== undefined) {
            this.page.total = data.total
          }
          if (data.sumData !== undefined) {
            this.sumData = data.sumData || {}
          }
          this.listData = data.records || []
          this.loading = false
          // console.log("getData end")
          // if (!this.option.page) {
          // }
          this.notifyChange()
        }).catch(() => {
          this.loading = false
        })
    },
    onDownload() {//下载模板
      let columns = this.option.column || []
      if (!columns || !columns.length) {
        this.$message.warning('没有需要展示的列')
        return
      }
      let dowCols = []
      for (let column of columns) {
        if (!column.display) {
          continue
        }
        if (column.valueExp && column.valueExp.type == 1) {
          let newCol = Object.assign({}, column, { label: column.label + "【自动生成,勿填】" })
          dowCols.push(newCol)
        } else {
          dowCols.push(column)
        }
      }
      this.$export.excel({
        title: (this.vlabel || '表格') + '导入模板',
        columns: dowCols,
        data: []
      }).then(() => {
        this.$message.success('下载成功')
      }).catch(err => {
        this.$message.warning(err || '下载失败')
      })
    },
    onUploadCancel() {
      this.fileList = []
      this.file = ''
      this.importVisible = false
    },
    onDataUpload(data) {
      this.listData = [...this.listData, ...data]
      this.onUploadCancel()
      this.notifyChange()
    },
    onUploadClick() {
      if (!this.file) {
        this.$message.warning('请上传表格文件')
        return
      }
      let dowCols = []
      for (let column of this.option.column) {
        if (column.valueExp && column.valueExp.type == 1) {
          let newCol = Object.assign({}, column, { label: column.label + "【自动生成,勿填】" })
          dowCols.push(newCol)
        } else {
          dowCols.push(column)
        }
      }
      excelImporter(this.file, dowCols, this.$refs.crud.DIC)
        .then(res => {
          if (res.missing) {
            this.$alert('上传的内容与表格不符, 应"下载模板"后提交, 继续导入?', '导入异常')
          } else {
            this.onDataUpload(res.data)
          }
        }).catch(err => {
          this.$message.warning(err || '上传失败')
        })
    },
    onFileChange(file) {
      // console.log('file change', file, fileList)
      const isLtM = file.size / 1024 / 1024 <= 10;
      if (!isLtM) {
        this.$message.warning('文件大小超出限制')
        this.file = ''
        this.fileList = []
        return
      }
      this.file = file.raw
    },
    onRemoveFile() {
      this.file = ''
    },
    getEnhanceTypes() {//获取表单各个位置是否有增强设置
      this.$axios.get('/api/rabbit-resource/formcustom/table-enhance', {
        params: {
          formId: this.formId,
          linkId: this.option.linkId
        }
      }).then(res => {
        this.enhanceTypes = res.data.data || []
      })
    },
    getParentValueByLabel(label) {//获取父表单的数据
      return this.parentForm && this.parentForm.getValueByLabel(label)
    },
    getValueByLabel(label) {//根据label获取表单数据
      let column = this.findOptionColumn("label", label)
      if (column) {
        return this.getFormData(column.prop)
      }
      return null
    },
    updateValueByLabel(label, value) {
      let column = this.findOptionColumn("label", label)
      if (column) {
        let form = this.getFormData()
        form[column.prop] = value
      }
    },
    disableColumnByLabel(label, disabled = true) {//根据label禁用组件
      this.updateColumnValueByLabel(label, 'disabled', disabled)
    },
    updateColumnValueByLabel(label, key, value) {//根据label更新组件定义
      let column = this.findOptionColumn("label", label)
      if (column) {
        column[key] = value
      }
    },
    findOptionColumn(key, value) {//根据key获取组件定义
      if (this.option && this.option.column) {
        return this.option.column.find(it => it[key] == value)
      }
      return null
    },
    getSumMethod(param) {//统计信息赋值
      let sumColumnList = this.option.sumColumnList || []
      const sums = []
      let { columns, data } = param
      if (!sumColumnList.length) {
        for (let i = 0; i < columns.length; i++) {
          sums[i] = ''
        }
        return sums
      }
      let propIndex = {}
      let indexSize = 0
      columns.forEach((column, index) => {
        if (column.type == 'index' || column.type == 'selection') {
          indexSize++
        } else {
          propIndex[column.property] = index
        }
      })
      for (let i = 0; i < indexSize; i++) {
        if (i == indexSize - 1) {
          sums[indexSize - 1] = '【统计合计】'
        } else {
          sums[i] = ''
        }
      }
      let leftSums = []
      const caculate = (currItem) => {
        if (this.option.page) {
          let key = `${currItem.name}_${currItem.type}`
          return this.sumData[key] || (currItem.code && this.sumData[currItem.code]) || ''
        }
        let label = currItem.label || ''
        if ('count' == currItem.type) {
          let key = currItem.code || `${currItem.name}_${currItem.type}`
          this.sumData[key] = total
          return label + data.length + (currItem.suffix || '')
        }
        let decimals = currItem.decimals === 0 ? 0 : (currItem.decimals || 2)
        let values = []
        let pow = 0
        for (let item of data) {
          let value = item[currItem.name]
          if (!isNaN(value)) {
            let decimal = ('' + value).split('.')[1];
            decimal = decimal ? decimal.length : 0
            if (pow < decimal) {
              pow = decimal
            }
            values.push(value)
          }
        }
        if (!values.length) {
          return 'N/A'
        }
        let basic = pow == 0 ? 1 : Math.pow(10, pow)
        let total = 0
        for (let value of values) {
          total += value * basic
        }
        if ('avg' == currItem.type) {
          total /= values.length * basic
        } else {
          total /= basic
        }
        let key = currItem.code || `${currItem.name}_${currItem.type}`
        this.sumData[key] = total
        let show = label + total.toFixed(decimals)
        return show + (currItem.suffix || '')
      }//caculate end
      for (let sumItem of sumColumnList) {
        let index = propIndex[sumItem.name]
        if (index !== undefined) {
          sums[index] = caculate(sumItem)
          propIndex[sumItem.name] = undefined
        } else {
          leftSums.push(sumItem)
        }
      }
      let leftIndexs = []
      let leftIndex = 0
      for (let key in propIndex) {
        let index = propIndex[key]
        if (index !== undefined) {
          sums[index] = ''
          leftIndexs.push(index)
        }
      }
      leftIndexs.length && leftIndexs.sort()
      for (let sumItem of leftSums) {
        let index = leftIndex
        if (index >= leftIndexs.length) {
          break
        }
        sums[leftIndexs[index]] = caculate(sumItem)
        leftIndex++
      }
      if (!indexSize && !sums[0]) {
        sums[0] = '【统计合计】'
      }
      return sums
    }
  },
  watch: {
    option() {//一个表单中的option一般不会变化
      if (this._bindValue) {
        return
      }
      // console.log("table option change", val)
      this.bindOptionValue(this.emitChange || this.formMode != 0 || this.visible)
    },
    visible(val) {//弹出表单显示与否,已废弃
      this.initing = true
      if (!val) {
        this.formMode = 0
      }
      setTimeout(() => {
        this.initing = false
      }, 600);
    },
    watchKey() {//参数发生变化
      this.page.currentPage = 1
      this.onRefreshChange(1)
    },
    emited() {//表单已提交
      this.formMode = 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.download-text {
  text-align: end;
  position: absolute;
  top: 15px;
  right: 51px;
  vertical-align: middle;
  line-height: 2;
}
</style>
