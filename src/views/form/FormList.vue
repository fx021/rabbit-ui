<template>
  <basic-container>
    <avue-crud
      :data="listData"
      :option="optionView"
      :page.sync="page"
      :table-loading="loading"
      :search.sync="searchForm"
      :summary-method="getSumMethod"
      @search-change="onSearchChange"
      @search-reset="onSearchReset"
      @current-change="onPageChange"
      @size-change="onSizeChange"
      @refresh-change="onRefreshChange"
      @row-dblclick="onRowDblClick"
      ref="crud"
    >
      <template slot="menuLeft" v-if="!readonly">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :size="menuSize"
          plain
          @click.stop="handleAdd"
          v-if="serverOption.addBtn && getButtonPermission('add')"
        >新增</el-button>
        <el-button
          type="warning"
          icon="el-icon-upload2"
          :size="menuSize"
          plain
          @click.stop="handleImport"
          v-if="serverOption.importBtn && getButtonPermission('import')"
        >导入</el-button>
        <el-button
          type="success"
          icon="el-icon-download"
          :size="menuSize"
          plain
          @click.stop="handleExport"
          v-if="serverOption.excelBtn && getButtonPermission('export')"
        >导出</el-button>
        <el-button
          type="success"
          icon="el-icon-printer"
          :size="menuSize"
          plain
          v-if="serverOption.printBtn && getButtonPermission('print')"
          v-print="printObj"
        >打印</el-button>
        <el-button
          :type="item.type||'info'"
          :icon="item.icon"
          v-for="item in leftCusBtns"
          v-show="getButtonPermission(item.alias)"
          :size="menuSize"
          :plain="!!item.plain"
          :key="item.text"
          @click.stop="onCustomLeftClick(item)"
        >{{item.text}}</el-button>
      </template>
      <template slot-scope="scope" slot="menu" v-if="!readonly">
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
          v-if="serverOption.editBtn && !scope.row.$cellEdit  && getButtonPermission('edit')"
        >编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-document-copy"
          size="mini"
          @click.stop="handleCopy(scope.row, scope.index)"
          v-if="serverOption.copyBtn && !scope.row.$cellEdit && getButtonPermission('copy')"
        >复制</el-button>
        <el-button
          type="text"
          icon="el-icon-delete"
          size="mini"
          @click.stop="handleRemove(scope.row, scope.index)"
          v-if="serverOption.delBtn && !scope.row.$cellEdit && getButtonPermission('delete')"
        >删除</el-button>
        <el-button
          type="text"
          icon="el-icon-view"
          size="mini"
          @click.stop="handleView(scope.row, scope.index)"
          v-if="serverOption.viewBtn && !scope.row.$cellEdit && getButtonPermission('view')"
        >查看</el-button>
        <el-button
          :type="item.type ||'text'"
          :icon="item.icon"
          v-for="item in menuCusBtns"
          :key="item.text"
          size="mini"
          v-show="!scope.row.$cellEdit && getButtonPermission(item.alias)"
          @click="onCustomMenuClick(scope.row,item)"
        >{{item.text}}</el-button>
      </template>
      <template #menuRight>
        <el-date-picker
          v-model="dateModel"
          type="datetimerange"
          size="mini"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yy-MM-dd HH:mm:ss"
          style="width:275px !important;margin-right:10px"
          :picker-options="pickerOptions"
          v-if="serverOption.dateBtn"
        ></el-date-picker>
      </template>
      <template :slot="item.prop" slot-scope="scope" v-for="item in templateViews">
        <id-show
          :value="scope.row[item.prop]"
          :column="item"
          :row="scope.row"
          :size="scope.size"
          :form-id="formId"
          :key="item.prop"
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
          readonly
          :action-data="item.actionData"
          :controls="item.controls"
          :prepend="item.prepend"
          :append="item.append"
          :action="item.action"
          :precision="item.precision"
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
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="download-text">
        <el-link icon="el-icon-full-screen" :underline="false" @click="fullScreen=!fullScreen"></el-link>
      </div>
      <form-display
        :readonly="readonly || formMode==3"
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
  </basic-container>
</template>

<script>
import excelImporter from '@/util/excel-importer'
import { safeString, formatSearchValue, bindUserList } from '@/util/generator'
import UploadShow from './UploadShow'
export default {//表单列表
  components: { UploadShow },
  name: 'FormList',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    formId: String,
    option: Object,//预览的option
    event: Object
  },
  computed: {
    isPreview() {//是否预览
      return !!this.option
    },
    controllSize() {//控件size
      return this.serverOption.size || 'small';
    },
    menuSize() {//菜单size
      return this.serverOption.menuSize || this.serverOption.size || 'small'
    },
    leftCusBtns() {//左上角自定义按钮
      let arr = this.customBtns || []
      return arr.filter(it => it.mode === 'left')
    },
    menuCusBtns() {//菜单自定义按钮
      let arr = this.customBtns || []
      return arr.filter(it => it.mode === 'menu')
    },
    optionView() {//option赋值
      let option = !this.serverOption ? {} : this.deepClone(this.serverOption)
      if (option.calcHeight && !option.height) {
        option.height = "auto"
      }
      option.customBtns = undefined
      option.showSummary = option.sumColumnList && option.sumColumnList.length && option.showSummary
      //自定义新增和编辑
      option.dateBtn = false
      option.addBtn = false
      option.editBtn = false
      option.delBtn = false
      option.viewBtn = false
      option.copyBtn = false
      option.printBtn = false
      option.excelBtn = false
      option.menu = !this.readonly && (this.serverOption.editBtn || this.serverOption.copyBtn ||
        this.serverOption.delBtn || this.menuCusBtns.length > 0)
      if (option.flowBtn) {
        option.column.push({
          prop: this.formatProp(),
          label: '审批状态',
          type: 'select',
          display: false,
          dicData: [{ label: '未发起', value: '0' }, { label: '审批中', value: '1' },
          { label: '审批结束', value: '4' }, { label: '已通过', value: '2' },
          { label: '已驳回', value: '3' }]
        })
      }
      return option
    },
    menuSizeOver() {//是否显示更多
      if (!this.serverOption.menuMoreSize) {
        return false
      }
      let size = 0
      if (this.serverOption.editBtn) {
        size += 1
      }
      if (this.serverOption.viewBtn) {
        size += 1
      }
      if (this.serverOption.copyBtn) {
        size += 1
      }
      if (this.serverOption.delBtn) {
        size += 1
      }
      size += this.menuCusBtns.length
      return size > this.serverOption.menuMoreSize
    }
  },
  data: () => {
    return {
      listData: [],//列表数据
      fullScreen: false,//对话框全屏
      forbidden: false,//表单是否禁用
      loading: false,//loading状态
      searchForm: {},//查询表单
      formMode: 0,//新增1,编辑2,查看3
      visible: false,//显示对话框
      importVisible: false,//模板导入对话框
      serverOption: {//列表option
        menu: false,
        addBtn: false,
        column: [{ prop: 'prop', label: '' }]
      },
      formData: {},//正在编辑的数据
      file: '',//导入的文件
      fileList: [],//导入的文件列表
      templateViews: [],//需要自定义栏位的控件
      hasEditRow: 0,//是否有编辑的控件
      dateModel: [],//创建时间mode
      permissionList: [],//权限集合
      customBtns: [],//自定义按钮
      sumData: {},//统计数据
      page: {//分页对象
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      },
      printObj: {//打印对象
        id: 'mainTable',
      },
      pickerOptions: {//创建时间option
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  beforeDestroy() {
    this.bindWatchers(true)
    delete this.viewProps
    delete this.paramMap
    delete this.popValueMap
    delete this.popViewMap
    delete this.exclueProps
    delete this.dateFormats
    delete this.popValid
    delete this.searchMode
  },
  created() {
    if (this.value) {
      this.listData = this.value
    }
    //打印标题
    this.printObj.popTitle = this.$route.query.name || '表格信息'
  },
  methods: {
    formatProp(prop) {//格式化prop
      prop = prop || "STATUS"
      let index = this.serverOption.rowKey ? this.serverOption.rowKey.lastIndexOf("#") : -1
      if (index > 0) {
        return this.serverOption.rowKey.substring(0, index + 1) + prop
      }
      return prop
    },
    updateTableId() {//打印需要,更新打印的列表id
      let ele = this.$refs.crud.$el
      let table = ele.querySelectorAll('.el-table')
      if (table && table.length) {
        table[table.length > 1 ? 1 : 0].id = this.printObj.id
      }
    },
    getServerOption() {//获取列表option
      let id = this.formId
      if (!id) {
        return
      }
      this.loading = true
      this.$axios.get("/api/rabbit-resource/formcustom/form-list/" + id, {
        params: { flag: 1 }
      }).then(res => {
        if (res.data.data) {
          this._lastForm = id
          this.forbidden = res.data.data.status === 0
          if (res.data.data.listForm) {//列表option
            this.serverOption = JSON.parse(res.data.data.listForm)
          } else {//没定义直接使用表单的定义
            this.serverOption = this.parseListByForm(res.data.data.pcForm)
          }
          this.bindOptionValue(this.buildPopViewMap(res.data.data.popProps))
        } else {
          this.loading = false
          this.$alert("数据已删除", '数据异常', {
            callback: () => {
              setTimeout(() => {
                this.$router.$avueRouter.closeTag()
              }, 500);
            }
          })
        }
      }).catch(() => {
        this.loading = false
      })
      //获取权限相关设置
      this.$axios.get("/api/rabbit-resource/formcustom/form-permission/" + id)
        .then(res => {
          this.permissionList = res.data.data || []
        })
      //获取自定义按钮
      this.$axios.get("/api/rabbit-resource/formcustom/form-enhance", {
        params: {
          formId: id,
          type: 1
        }
      }).then(res => {
        let list = res.data.data || []
        if (list.length) {
          this.customBtns = JSON.parse(list[0].content)
        } else {
          this.customBtns = []
        }
      })
    },
    parseListByForm(pcForm) {//根据表单定义组装列表option
      if (typeof pcForm == 'string') {
        pcForm = JSON.parse(pcForm)
      }
      let option = {
        refreshBtn: true, page: true, addBtn: true, editBtn: true, menuPosition: 'center', columnBtn: false,
        delBtn: true, border: true, stripe: true, searchGutter: 10, viewBtn: false, indexFixed: false, index: false,
        searchShow: true, searchIndex: 2, customBtns: []
      }
      let column = pcForm.column || []
      let groups = pcForm.group || []
      option.rowKey = pcForm.rowKey
      option.size = pcForm.size
      option.flowBtn = pcForm.flowBtn
      option.menuWidth = 130
      // console.log("column", column, groups)
      if (groups.length == 0 && column.length == 0) {
        option.column = []
        return option;
      }
      if (column.length > 0) {
        groups.push({
          linkId: '2',
          column: column
        })
      }
      let views = []
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let groupViews = group.column || [];
        if (group.listable) {//列表组件不参与
          continue
        }
        for (let j = 0; j < groupViews.length; j++) {
          let view = groupViews[j];
          view.searchMode = 0
          view.searchSpan = 8
          view.groupId = group.linkId
          view.searchLabelWidth = pcForm.labelWidth || 80
          view.align = 'left'
          view.dpy = view.display
          view.hide = !view.label || view.display === false
          views.push(view)
        }
      }
      option.column = views
      return option
    },
    buildPopViewMap(props) {//解析弹出框
      let arr = props || []
      if (typeof props == 'string') {
        arr = JSON.parse(arr)
      }
      this.paramMap = {}//参数对应的表单字段
      let viewMap = {}//控件id-弹出框映射
      let viewParamMap = {}//控件id-参数映射
      let valueMap = {}//弹出框的字段映射
      for (let pop of arr) {
        for (let col of pop.data) {//字段,控件,参数排序好了
          if (col.colMode == 2) {//参数绑定
            if (col.colReplace && col.colName) {
              this.paramMap[`p#${pop.popId}#${col.paramKey}`] = col.colName
            } else {
              let params = viewParamMap[col.formView]
              if (!params) {
                params = []
                viewParamMap[col.formView] = params
              }
              params.push(`p#${pop.popId}#${col.paramKey}`)
            }
          } else if (col.colMode == 1) {//控件
            viewMap[col.formView] = {
              colName: col.popCol,
              popId: pop.popId
            }
          } else {//字段
            let colList = valueMap[pop.popId]
            if (!colList) {
              colList = []
              valueMap[pop.popId] = colList
            }
            colList.push({
              from: col.popCol,
              primaryKey: col.primaryKey,
              to: col.colName
            })
          }
        }
      }
      this.popValueMap = valueMap
      return { viewMap, viewParamMap }
    },
    bindPopFromValue(value, prop, valueCol, isValue) {//弹出框数据回显
      if (this.visible) {//由表单去处理
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

      let target = this.getFormData()
      if (value === undefined) {
        value = ''
      }
      if (target !== this.searchForm || this.searchForm[prop] !== undefined) {
        this.$set(target, prop, value)
      } else if (target === this.searchForm && isValue) {
        this.$set(target, prop, value)
      }
    },
    checkPopValueBind(value, popId) {//弹出字段绑定
      if (!this.popValueMap) {
        return
      }
      let colList = this.popValueMap[popId] || []
      for (let item of colList) {//值的绑定
        this.bindPopFromValue(value, item.to, item.from, 1)
      }
    },
    getPopValue(popId, rowKey) {//获取弹出框的表单数据
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
        // console.log("colList", colList, exclude)
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
    bindOptionValue(bind) {//解析option
      this._bindValue = true
      this.viewProps = {}
      this.exclueProps = {}
      this.dateFormats = {}
      this.popValid = {}
      this.buildColumns(bind)
      //表格重新初始化
      this.$refs.crud && this.$refs.crud.init()
      //弹出框的关联关系绑定
      this.bindWatchers()
      this._bindValue = false
      if (!this.formId || this.serverOption.lazy) {
        this.loading = false
        return
      }
      this.getListData()
    },
    bindWatchers(unbind) { //弹出框的关联关系绑定,主要是参数的关联关系
      if (this.unwatchers) {
        for (let unwatch of this.unwatchers) {
          unwatch()
        }
      }
      if (unbind) {
        delete this.unwatchers
        return
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
            let isSearch = form === this.searchForm
            // console.log("watchParamKey list", column.label, isSearch)
            if (!isSearch || this.searchForm[column.prop] !== undefined) {
              this.$set(form, column.prop, '')
            }
            if (pkey == 'popId' && this.popValueMap) {
              let colList = this.popValueMap[popId] || []
              for (let col of colList) {
                // console.log("update pop value", col.to)
                if (!isSearch || this.searchForm[col.to] !== undefined) {
                  this.$set(form, col.to, '')
                }
              }
            }
          }
        })
      }
      for (let key in this.paramMap) {
        let prop = this.paramMap[key]
        // console.log("watch param key change", key, prop)
        unwatchers.push(watchParamKey(key, prop))
      }
      this.unwatchers = unwatchers
    },
    buildColumns(bind) {//缓存组件的一些定义,按需要缓存组件信息,方便获取
      let columns = this.serverOption.column || []
      this.templateViews = []
      this.searchMode = {}
      let hasEdit = false
      let hasShow = false
      let showComponents = ['areaSelect', 'userSelect', 'deptSelect', 'postSelect', 'roleSelect']
      for (let column of columns) {
        if (column.hide === undefined) {
          column.hide = !column.display
        }
        if (!column.event) {
          column.event = {}
        }
        if (column.cell && !column.hide) {
          hasEdit = true
        } else if (!column.hide) {
          hasShow = true
        } else if (column.hide) {
          column.showColumn = false
        }
        if (column.showWordLimit) {
          column.showWordLimit = false
        }
        if (!column.label) {
          if (column.component === 'download') {
            column.label = '模板附件'
          } else {
            column.label = '[单位]'
          }
        }
        if (bind) {
          this.popViewMap = bind.viewMap
          if (bind.viewMap && bind.viewMap[column._id]) {
            let viewPop = bind.viewMap[column._id]
            this.viewProps[column._id] = column.prop

            if (viewPop.colName === column.prop) {
              if (!/^[ntgp]#.+/.test(column.prop)) {
                column.prop = `p#${viewPop.popId}#${column.prop}`
              }
              this.exclueProps[column.prop] = viewPop.popId
            }
            if ('popData' === column.component) {//这里只有搜索才会用到,其他情况暂时不用考虑
              //搜索特定
              if (column.searchMultiple) {
                column.limit = 0
              }
              column.formId = this.formId
              column.showText = false
              //搜索行为end
              column.inputKey = viewPop.colName
              column.watchKey = 0
              let pattern = new RegExp("^p#" + column.popId)
              column.interruptSelect = () => {
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
                    callback(new Error(flag === 1 ? `输入的内容不匹配` : `请选择一个匹配输入`))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              })
              column.event.error = (flag) => {
                this.popValid[column.prop] = flag
              }
              column.event.select = (value) => {
                let old = this.popValid[column.prop]
                this.popValid[column.prop] = 0
                if (old && this.$refs.crud.$refs.cellForm) {
                  this.$refs.crud.$refs.cellForm.clearValidate(`list.${this._updateIndex}.${column.prop}`)
                }
                // console.log("pop change", value, column)
                this.bindPopFromValue(value, column.prop, column.inputKey)
                if (column.popId) {
                  for (let vid in bind.viewMap) {
                    let popView = bind.viewMap[vid]
                    if (popView && popView.popId === column.popId) {
                      let colView = this.findOptionColumn('_id', vid)
                      if (colView) {
                        this.bindPopFromValue(value, colView.prop, popView.colName)
                      }
                    }
                  }
                }
                this.checkPopValueBind(value, column.popId)
              }
            }
          }
          if (bind.viewParamMap && bind.viewParamMap[column._id]) {
            let innerParams = bind.viewParamMap[column._id]
            for (let paramKey of innerParams) {
              this.paramMap[paramKey] = column.prop
            }
          }
        }//bind end
        let showIndex = showComponents.findIndex(it => it === column.component)
        if (showIndex >= 0) {
          //搜索特定
          column.required = false
          column.showText = false
          column.viewMode = showIndex
          this.templateViews.push(column)
        }
        if (column.search) {//OR
          this.searchMode[column.prop] = column.searchMode
        }
        if (column.valueFormat && column.prop) {
          this.dateFormats[column.prop] = column.valueFormat
        }
        if (column.newFlag === 2 && !this.exclueProps[column.prop] && column.prop.startsWith("{")) {
          this.exclueProps[column.prop] = '2'
        }
        if (column.type === 'upload') {
          column.listType = 'text'
          // if (column.fileSize) {//2.8.3以上兼容
          //   column.fileSize /= 1024
          // }
          column.uploadExceed = () => {
            this.$message.warning('最大上传数量为 ' + column.limit)
          }
          column.viewMode = 8
          this.templateViews.push(column)
        } else if ('rowExpression' === column.component) {
          if (!column.prop) {
            column.prop = 'p#' + column._id
            column.viewMode = 9
            this.templateViews.push(column)
          }//不给编辑
        } else if ('userSelect' === column.component) {
          column.event.select = userList => {
            bindUserList(userList, column.actionData, this)
          }
        } else if ('idShow' === column.component) {
          this.templateViews.push(column)
        }
        if (!column.prop) {
          column.prop = 'p#' + column._id
        }
      }
      this.hasEditRow = !hasEdit ? 0 : (hasShow ? 1 : 2)
    },
    findRelateLabel(prop) {//查找弹出框参数绑定的组件label
      let column = this.findOptionColumn('prop', prop)
      if (column) {
        if (column.display) {
          return `请先输入${column.label}`
        } else {//可能是弹出框赋值
          let popId = null
          for (let key in this.popValueMap) {
            let colList = this.popValueMap[key]
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
    onPageChange(page) {//分页
      this.page.currentPage = page
      // console.log("onPageChange", page)
      this.onRefreshChange()
    },
    onSizeChange(size) {//分页
      let current = this.page.pageSize * this.page.currentPage
      let newPage = Math.ceil(current / size)
      this.page.currentPage = newPage
      this.page.pageSize = size
      this.onRefreshChange()
    },
    onCustomLeftClick(btn) {//左上角自定义按钮点击
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      let index = this.customBtns.findIndex(it => it.mode == btn.mode && it.text == btn.text)
      if (index < 0) {
        this.$message.warning("设置异常")
        return
      }
      this.loading = true
      this.$axios.post("/api/rabbit-resource/formcustom/form-script", {
        formId: this.formId,
        type: index + 60,
        text: btn.text,
        url: btn.url
      }).then(res => {
        this.$message.success(res.data.msg)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onCustomMenuClick(row, btn) {//自定义菜单按钮点击
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      let index = this.customBtns.findIndex(it => it.mode == btn.mode && it.text == btn.text)
      if (index < 0) {
        this.$message.warning("设置异常")
        return
      }
      this.loading = true
      this.$axios.post("/api/rabbit-resource/formcustom/form-script", {
        formId: this.formId,
        type: index + 60,
        url: btn.url,
        text: btn.text,
        param: btn.body ? row : {}
      }).then(res => {
        this.$message.success(res.data.msg)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleAdd() {//新增
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      this.formData = {}
      this.formMode = 1
      this.visible = true
    },
    handleImport() {//导入
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      if (this.popValueMap && Object.keys(this.popValueMap).length) {
        this.$message.warning("暂不支持有弹出框的导入")
        return
      }
      this.importVisible = true
    },
    onRowDblClick(row) {//行双击
      if (this.serverOption.dblEdit && !row.$cellEdit) {
        this.handleEdit(row, row.$index, this.hasEditRow != 0)
      }
    },
    findBindData(prefix) {//获取弹出框的参数
      let formData = this.getFormData()
      if (this.paramMap && formData) {
        let param = {}
        let hasParam = false
        let hasVal = false
        for (let key in this.paramMap) {
          if (prefix && !key.startsWith(prefix)) {
            // console.log("不是该组件需要的", key, prefix)
            continue
          }
          let prop = this.paramMap[key]
          let value = formData[prop]
          hasParam = true
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
    getFormData(key) {//获取编辑的form
      let form
      if (this.visible) {
        form = this.formData
      } else {
        form = this.formMode == 0 ? this.searchForm : this.listData[this._updateIndex]
      }
      if (!form) {
        return !key && {}
      }
      return !key ? form : form[key]
    },
    handleRowEdit(row, index, copy) {//行编辑确定
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
      if (!this.$refs.crud.validateCellField(this._updateIndex)) {
        return
      }
      this.loading = true
      let obj = {}
      obj['$row-key'] = this.serverOption.rowKey
      for (let key in row) {
        if (!this.exclueProps || !this.exclueProps[key]) {
          let value = safeString(row[key])
          if (this.dateFormats && this.dateFormats[key]) {
            obj[`$${key}`] = this.dateFormats[key]
          }
          if (Array.isArray(value) || (typeof value === 'object')) {
            obj[key] = JSON.parse(value)
          } else {
            obj[key] = value
          }
        }
      }
      this.$axios.post("/api/rabbit-resource/formcustom/form/" + this.formId, obj)
        .then(res => {
          // console.log("data", res.data.data)
          let data = res.data.data
          if (this.exclueProps) {
            for (let key in this.exclueProps) {
              if (row[key] !== undefined) {
                data[key] = row[key]
              }
            }
          }
          this.$message.success(res.data.msg)
          if (copy) {
            this.listData.splice(index + 1, 0, data)
          } else {
            this.$set(this.listData, index, data)
          }
          this.formMode = 0
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    handleEdit(row, index, inner) {//行编辑
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      if (!this.serverOption.rowKey) {
        this.$message.warning('缺少主键，不可编辑')
        return
      }
      if (row[this.formatProp()] == '1') {
        this.$message.warning('审批中，不可编辑')
        return
      }
      this.formData = Object.assign({}, row)
      this._updateIndex = index
      this.formMode = 2
      if (inner && !this.forbidden) {
        this.initing = true
        this.$set(row, '$cellEdit', true)
        setTimeout(() => {
          this.initing = false
        }, 600);
      } else {
        this.visible = true
      }
    },
    handleView(row, index) {//查看
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      this.formData = row
      this._updateIndex = index
      this.formMode = 3
      this.visible = true
    },
    handleCopy(row, index) {//复制
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      if (!this.serverOption.rowKey) {
        this.$message.warning('缺少主键，不能复制')
        return
      }
      if (row[this.formatProp()] == '1') {
        this.$message.warning('审批中，不可复制')
        return
      }
      let obj = Object.assign({}, row)
      obj[this.serverOption.rowKey] = null
      this.handleRowEdit(obj, index, 1)
    },
    handleRemove(row, index) {//删除行
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      if (!this.serverOption.rowKey) {
        this.$message.warning('缺少主键，不能删除')
        return
      }
      if (row[this.formatProp()] == '1') {
        this.$message.warning('审批中，不可删除')
        return
      }
      // console.log("remove", row)
      this.$confirm('确定要删除该记录吗?', '', {
        type: 'warning'
      }).then(() => {
        this.$axios.post('/api/rabbit-resource/formcustom/form-remove', {
          id: this.formId,
          linkId: this.serverOption.rowKey,
          code: row[this.serverOption.rowKey]
        }).then(res => {
          this.$message.success(res.data.msg)
          if (this.listData.length > 1) {
            this.listData.splice(index, 1)
            if (this.serverOption.page) {
              this.page.total--
            }
          } else {
            this.getListData()
          }
        })
      }).catch(() => {
        //cancel
      })
    },
    handleExport() {//导出
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      this.$refs.crud.rowExcel()
    },
    handlePrint() {//打印
      if (this.isPreview) {
        this.$message.warning("预览状态不可操作")
        return
      }
      this.$refs.crud.rowPrint()
      //this.$print(this.$refs.crud)
    },
    onSearchChange(params, done) {//查询
      // console.log("onSearchChange")
      this.page.currentPage = 1
      this.getListData(done)
    },
    onSearchReset() {//查询清空
      this.page.currentPage = 1
      this.getListData()
    },
    onFormCancel() {//表单cancel
      this.formMode = 0
      this.visible = false
    },
    onFormSubmit(form) {//表单提交
      if (this.formMode == 1) {
        if (this.serverOption.flowBtn && this.serverOption.rowKey) {
          let status = this.formatProp()
          if (form[status] === undefined) {
            form[status] = '0'
          }
        }
        this.listData.unshift(form)
        if (this.serverOption.page) {
          this.page.total++
        }
      } else {
        this.listData.splice(this._updateIndex, 1, form)
      }
      this.formMode = 0
      this.visible = false
    },
    getListData(done) {//获取列表数据
      this.loading = !done
      const query = {}
      let first = {}
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
          if (!this.dateFormats || !this.dateFormats[key] || mode > 2) {//时间不允许模糊查询
            val = formatSearchValue(mode, val)
          }
        }

        let pop = this.exclueProps && this.exclueProps[key]
        if (pop) {//弹出框搜索数据
          // first[key] = pop //弹出框已选择了数据,绑定到指定字段上
        } else {
          query[key] = val
        }
      }
      if (this.dateModel && this.dateModel.length && this.serverOption.rowKey) {
        let createDate = this.formatProp('CREATION_DATE')
        query[createDate] = this.dateModel[0] + "&&" + this.dateModel[1]
      }
      let params = {
        current: this.serverOption.page ? this.page.currentPage : 0,
        size: this.page.pageSize,
        id: this.formId,
        query: query,
        first: first,
        bind: this.paramMap,//参数绑定
        viewProps: this.viewProps,//id-prop映射
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
          done && done()
          if (this.serverOption.printBtn) {//打印需要
            setTimeout(() => {
              this.updateTableId()
            }, 800);
          }
        }).catch(() => {
          this.loading = false
          done && done()
        })
    },
    onRefreshChange() {//刷新
      this.getListData()
    },
    onDownload() {//下载模板
      let columns = this.serverOption.column || []
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
        title: (this.$route.query.name || '表格') + '导入模板',
        columns: dowCols,
        data: []
      }).then(() => {
        this.$message.success('下载成功')
      }).catch(err => {
        this.$message.warning(err || '下载失败')
      })
    },
    onUploadCancel() {//导入对话框隐藏
      this.fileList = []
      this.file = ''
      this.importVisible = false
    },
    onDataUpload(data) {//导入数据提交,弹出框的暂不支持导入
      if (!data || !data.length) {
        this.onUploadCancel()
        return
      }
      this.importVisible = false
      this.loading = true
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        for (let key in item) {
          if (!this.exclueProps || !this.exclueProps[key]) {
            item[key] = safeString(item[key])
          } else {
            item[key] = undefined
          }
        }
        item['$row-key'] = this.serverOption.rowKey
        item['$index'] = i
      }
      this.$axios.post("/api/rabbit-resource/formcustom/form-import/" + this.formId, data)
        .then(res => {
          let list = res.data.data || []
          if (this.exclueProps) {
            for (let item of list) {
              let row = data[item['$index']]
              if (!row) continue
              for (let key in this.exclueProps) {
                if (row[key] !== undefined) {
                  item[key] = row[key]
                }
              }
            }
          }
          this.listData = this.listData.concat(list)
          this.onUploadCancel()
          this.loading = false
          this.$message.success(res.data.msg)
        }).catch(() => {
          this.loading = false
          this.importVisible = true
        })
    },
    onUploadClick() {//导入对话框显示
      if (!this.file) {
        this.$message.warning('请上传表格文件')
        return
      }
      let dowCols = []
      for (let column of this.serverOption.column) {
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
            this.$alert('上传的内容与表格不符, 应"下载模板"后提交?', '导入异常')
          } else {
            this.onDataUpload(res.data)
          }
        }).catch(err => {
          this.$message.warning(err || '上传失败')
        })
    },
    onFileChange(file) {//选择了导入文件
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
    findOptionColumn(key, value) {//根据key获取组件定义
      if (this.serverOption && this.serverOption.column) {
        return this.serverOption.column.find(it => it[key] == value)
      }
      return null
    },
    getButtonPermission(type) {//按钮权限
      if (!type || !this.permissionList || !this.permissionList.length) {
        return true
      }
      return this.permissionList.includes(type)
    },
    getSumMethod(param) {//统计合计
      let sumColumnList = this.serverOption.sumColumnList || []
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
        if (this.serverOption.page) {
          let key = `${currItem.name}_${currItem.type}`
          return this.sumData[key] || ''
        }
        let label = currItem.label || ''
        if ('count' == currItem.type) {
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
        let show = label + total.toFixed(decimals)
        return show + (currItem.suffix || '')
      }
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
    formId: {//观察formId,获取option
      handler(val) {
        if (this._bindValue) {
          return
        }
        if (this.option && !this._lastForm || this._lastForm == val) {
          return
        }
        this.getServerOption()//获取option,自定义按钮和权限设置
      },
      immediate: true
    },
    option: {//预览需要
      handler(val) {
        if (val) {
          // console.log("watch list option", val)
          this.serverOption = val
          this.bindOptionValue()
        }
      },
      immediate: true
    },
    visible(val) {//新增/编辑对话框
      this.initing = true//给个初始化标记
      if (!val) {
        this.formMode = 0
      }
      setTimeout(() => {
        this.initing = false
      }, 600);
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
