<template>
  <div v-loading="loading" style="min-height:240px">
    <avue-form
      v-model="form"
      :option="optionView"
      :reset="false"
      @submit="onSubmitClick"
      ref="form"
    >
      <template #menuForm="{size,disabled}">
        <el-button
          :size="size"
          :disabled="disabled"
          :loading="disabled"
          v-if="option.emptyBtn && !readonly && !isForbidden"
          icon="el-icon-delete"
          @click="onResetForm"
        >{{option.emptyText}}</el-button>
        <el-button
          :size="size"
          :loading="disabled"
          :disabled="disabled"
          type="warning"
          plain
          v-if="option.flowBtn && !readonly && !isForbidden && addForm"
          icon="el-icon-position"
          @click="onStartProcess"
        >{{submitBtn?'发起流程':'提交'}}</el-button>
        <el-button
          v-for="(item, index) in customBtns"
          :size="size"
          :loading="disabled"
          :disabled="disabled"
          :type="item.type || 'info'"
          :key="item.text"
          :icon="item.icon"
          :plain="item.plain"
          @click="onCustomBtnClick(item,index)"
        >{{item.text}}</el-button>
      </template>
      <template slot-scope="scope" :slot="item.prop" v-for="item in templateViews">
        <form-table
          v-model="form[item.prop]"
          :key="item.prop"
          :ref="item.prop"
          :size="scope.size"
          :form-id="formId"
          :emited="emited"
          :watch-key="scope.column.watchKey"
          :vlabel="scope.column.vlabel"
          :table-id="scope.column.tableId"
          :event="scope.column.event"
          :readonly="readonly || scope.readonly"
          :disabled="scope.disabled"
          :required="scope.column.required"
          :option="scope.column.option"
          v-if="item.type"
        ></form-table>
        <row-expression
          v-model="form[item.prop]"
          :key="item.prop"
          :row="form"
          :size="scope.size"
          :action-data="scope.column.actionData"
          :controls="scope.column.controls"
          :prepend="scope.column.prepend"
          :append="scope.column.append"
          :action="scope.column.action"
          :precision="scope.column.precision"
          :prop="item.prop"
          v-else
        ></row-expression>
      </template>
    </avue-form>
  </div>
</template>

<script>
import { safeString, bindUserList } from '@/util/generator'
export default {//表单提交与展示
  name: 'FormDisplay',
  model: {
    prop: 'value',
    event: 'submit'
  },
  provide() {
    return {
      parentForm: this
    };
  },
  props: {
    formId: [Number, String],//表单id
    readonly: {//只读
      type: Boolean,
      default: false
    },
    preview: {//是否预览
      type: Boolean,
      default: false
    },
    submitBtn: {//流程中不显示提交按钮
      type: Boolean,
      default: true
    },
    formOption: {//本地/预览option
      type: Object,
      default: () => {
        return {}
      }
    },
    // permissionOption: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // },
    value: {//默认值
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {
      form: {},//表单数据
      serverData: {},//服务端数据
      option: {},//解析后的option
      loading: false,
      addForm: true,//新增还是编辑
      templateViews: [],//需要自定义栏位的view
      tableLinkMap: {},//关联表信息
      popViewMap: {},//弹出框绑定信息
      popValueMap: {},//弹出框字段绑定
      viewParamMap: {},//控件与参数的绑定
      paramMap: {},//参数映射
      exclueProps: {},//不提交的字段
      popValid: {},//弹出框输入判断标记
      emited: 0,//通知子表是否已提交
      disabledKeys: [],//禁用的prop
      defaultForm: '',//默认值定义
      customBtns: []//自定义按钮
    }
  },
  computed: {
    tableViews() {//子表的prop
      return this.templateViews.filter(it => it.type == 1).map(it => it.prop) || []
    },
    optionView() {//avue Option
      let op = this.deepClone(this.option)
      op.clearExclude = this.disabledKeys
      op.submitBtn = this.submitBtn && op.submitBtn
      op.emptyBtn = false//自定义,不然会有很多问题
      if (this.readonly || this.isForbidden) {
        op.menuBtn = false
        op.detail = true
        op.submitBtn = false
        op.emptyBtn = false
      } else if (this.isEditMode) {
        let columns = op.column || []
        for (let column of columns) {
          column.disabled = column.editDisabled || column.disabled
        }
        let groups = op.group || []
        for (let group of groups) {
          let gcolumns = group.column || []
          for (let column of gcolumns) {
            column.disabled = column.editDisabled || column.disabled
          }
        }
      }
      return op
    },
    isEditMode() {//是否编辑模式
      return !this.addForm && this.option.rowKey && this.form[this.option.rowKey]
    },
    isForbidden() {//表单是否禁用
      return this.serverData && this.serverData.status == 0
    },
    fromFlag() {
      if (this.formOption && this.formOption.linkId) {//已废弃,应该用formTable全局组件
        return 1
      }
      if (this.formOption && this.formOption.group) {//预览
        return 2
      }
      return 0
    },
    // permissionMap() {
    //   let obj = {}
    //   if (this.permissionOption && this.permissionOption.length) {
    //     this.permissionOption.forEach((item) => {
    //       obj[item.key] = item;
    //     })
    //   }
    //   return obj
    // }
  },
  beforeDestroy() {
    if (this.unwatchers) {
      for (let unwatch of this.unwatchers) {
        unwatch()
      }
      delete this.unwatchers
    }
  },
  created() {
    if (!this.formId && this.formOption && this.formOption.linkId) {//FormTable的弹出表单,已废弃
      this.option = this.formOption
      this.findParentPopView()
      return
    }
    if (this.formOption && this.formOption.group) {//预览/本地的表单
      this.option = this.formOption
      this.findParentPopView()
      return
    }
    this.getServerForm() //从服务器获取option,一般都使用这个
  },
  methods: {
    onResetForm(watch) {//清空
      const callback = () => {
        this.removeTableData().then(() => {
          if (this.$refs.form) {
            this.$refs.form.clearVal()
            this.$refs.form.clearValidate()
            if (watch === 1 && this.option.rowKey) {
              this.$refs.form.form[this.option.rowKey] = undefined
              this.getDefaultFormValue()
            }
          }
          this.ensureTableData(this.form)
          this.loading = false
        }).catch((err) => {
          console.log("err", err)
          this.loading = false
        })
      }
      this.loading = !this.addForm
      if (this.$refs.form) {
        callback()
      } else if (!this.defaultForm || !this.addForm) {//加个保险
        setTimeout(() => {
          callback()
        }, 600);
      }
    },
    checkTableData() {//验证子表数据
      if (!this.tableViews.length) {
        return Promise.resolve()
      }
      let promises = []
      for (let prop of this.tableViews) {
        if (this.$refs[prop]) {
          promises.push(this.$refs[prop][0].checkLastData(true))
        }
      }
      if (!promises.length) {
        return Promise.resolve()
      }
      return Promise.all(promises)
    },
    notifyTableDataChange() {//子表刷新
      for (let prop of this.tableViews) {
        if (this.$refs[prop]) {
          this.$refs[prop][0].onPageChange(1, 1)
        }
      }
    },
    ensureTableData(form) {//获取子表的数据
      for (let prop of this.tableViews) {
        if (!this.$refs[prop]) {
          let tdata = form[prop] || []
          if (tdata.length && !tdata[0]) {
            form[prop] = []
            this.form[prop] = form[prop]
          }
          continue
        }
        //新增时将关联字段置空
        let table = this.$refs[prop][0]
        let tableData = table.getTableData()
        if (table.sumData) {
          for (let key in table.sumData) {
            if (table.sumData[key]) {
              form[`s#${key}`] = table.sumData[key]
            }
          }
        }
        form[prop] = tableData
        this.form[prop] = tableData
      }
    },
    removeTableData() {//清空子表数据
      if (!this.tableViews.length) {
        return Promise.resolve()
      }
      let promises = []
      let flag = this.addForm ? 1 : 2
      for (let prop of this.tableViews) {
        if (this.$refs[prop]) {
          promises.push(this.$refs[prop][0].clearData(flag))
        }
      }
      return Promise.all(promises)
    },
    onCustomBtnClick(item, index) {//自定义按钮点击
      const btnRequest = (obj, done) => {
        this.loading = true
        this.$axios.post("/api/rabbit-resource/formcustom/form-script", {
          formId: this.formId,
          type: index + 30,
          url: item.url,
          text: item.text,
          param: obj
        }).then(res => {
          let data = res.data.data
          if (!data || (Array.isArray(data) && !data.length)) {
            this.$emit('cancel')
            this.emited = 1
          } else {
            if (Array.isArray(data)) {
              data = data[0]
            }
            for (let key in data) {
              if (this.form[key] !== undefined) {
                this.form[key] = data[key]
              }
            }
          }
          this.loading = false
          done && done()
        }).catch(() => {
          this.loading = false
          done && done()
        })
      }
      if (item.body) {
        this.$refs.form.validate((success, done) => {
          if (success) {
            let obj = this.prepareFormBody(this.form)
            if (obj) {
              btnRequest(obj, done)
            } else {
              done()
            }
          } else {
            done()
          }
        })
      } else {
        btnRequest({})
      }
    },
    onStartProcess() {//发起流程
      this.$refs.form.validate((success, done) => {
        if (success) {
          this.onSubmitClick(this.form, done, 'selfDevForm/startProcess')
        } else {
          done()
        }
      })
    },
    submit() {//外部调用保存
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((success, done) => {
          if (success) {
            this.onSubmitClick(this.form, (err) => {
              done()
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          } else {
            done()
            reject()
          }
        })
      })
    },
    onSubmitClick(form, done, path) {//提交
      this.checkTableData().then(() => {//子表提交前验证下
        if (this.option.rowKey) {
          form['$row-key'] = this.option.rowKey
          // console.log("rowKey", this.form[this.option.rowKey], form[this.option.rowKey])
          if (this.addForm) {
            delete form[this.option.rowKey]
            delete this.form[this.option.rowKey]
          }
        }
        if (this.fromFlag) {//formTable的数据,已用不到,formTable都是行编辑,不弹窗了
          this.ensureTableData(form)
          this.$emit("submit", this.deepClone(form))
          this.emited = 1
          done && done()
        } else {
          //提交服务器
          this.loading = true
          this.ensureTableData(form)
          let obj = this.prepareFormBody(form, path)
          // console.log("准备提交服务器", obj)
          this.$axios.post(`/api/rabbit-resource/${path || 'formcustom/form'}/${this.formId}`, obj)
            .then(res => {
              let data = res.data.data
              if (!data) {
                done && done()
                this.loading = false
                this.$emit('cancel', path)
                this.emited = 1
                return
              }
              if (this.exclueProps) {
                for (let key in this.exclueProps) {
                  if (form[key] !== undefined) {
                    data[key] = form[key]
                  }
                }
              }
              this.addForm = false
              done && done()
              this.form = data
              this.loading = false
              this.$message.success('数据已提交')
              this.$emit("submit", this.deepClone(data), path)
              this.emited = 1
            }).catch((err) => {
              done && done(err || 'error')
              this.loading = false
            })
        }
      }).catch((err) => done && done(err || 'error'))
    },
    prepareFormBody(form, hasStatus) {//封装提交的数据
      let obj = {}
      if (hasStatus && this.option.rowKey) {
        let index = this.option.rowKey.lastIndexOf("#")
        let statusKey = "STATUS"
        if (index > 0) {
          statusKey = this.option.rowKey.substring(0, index + 1) + statusKey
        }
        obj[statusKey] = '1'
      }
      for (let key in form) {
        if (!this.exclueProps || !this.exclueProps[key]) {
          let value = safeString(form[key])
          obj[key] = value
          this.checkArrayData(obj, key, value)
        }
      }
      return obj
    },
    checkArrayData(obj, key, value) {//检查子表数据或其他集合数据
      if (this.dateFormats && this.dateFormats[key]) {
        obj[`$${key}`] = this.dateFormats[key]
      }
      if (!Array.isArray(value)) {
        if (typeof value === 'object') {
          obj[key] = JSON.stringify(value)
        }
        return
      }
      if (key.startsWith("g#")) {
        for (let item of value) {
          for (let itemKey in item) {
            let itemValue = item[itemKey]
            if (this.exclueProps && this.exclueProps[itemKey]) {
              item[itemKey] = undefined
            } else {
              this.checkArrayData(item, itemKey, itemValue)
            }
          }
        }
      } else {
        obj[key] = JSON.stringify(value)
      }
    },
    getDefaultFormValue() {//获取默认值
      if (!this.addForm) {
        return
      }
      let hide = false
      if (!this.loading) {
        hide = true
        this.loading = true
      }
      this.$axios.post('/api/rabbit-resource/formcustom/form-def/' + this.formId, this.defaultForm || {})
        .then(res => {
          let data = res.data.data
          if (data && Object.keys(data).length) {
            this.form = data
          }
          if (hide) {
            this.loading = false
          }
        }).catch(() => {
          if (hide) {
            this.loading = false
          }
        })
    },
    bindPopFromValue(value, prop, valueCol) {//绑定弹出框值
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
      this.$set(this.form, prop, value)
      // console.log("bindPopFromValue", prop, this.form)
    },
    checkPopValueBind(value, popId) {//绑定弹出框字段映射
      if (!this.popValueMap) {
        return
      }
      let colList = this.popValueMap[popId] || []
      for (let item of colList) {//值的绑定
        this.bindPopFromValue(value, item.to, item.from)
      }
    },
    getPopValue(popId, rowKey) {//获取弹出框的表单
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
    findParentPopView() {//查询父级的弹出框信息,用于formTable的display
      let parent = this.$parent
      let data = null
      while (parent) {
        // console.log("parent", parent)
        if (typeof parent.getDataInfo == 'function') {
          data = parent.getDataInfo()
          break
        }
        parent = parent.$parent
      }
      if (data) {
        this.serverData = data
        this.buildPopViewMap()
        if (this.fromFlag == 1) {
          this.option.column && this.doBindColumn(this.option.column, this.option.linkId)
          this.formReInit()
        } else {
          this.bindColumns(this.option)
        }
      }
    },
    formReInit() {//表单初始化
      if (!this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.init()
        })
      } else {
        this.$refs.form.init()
      }
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
          return this.form[prop]
        }, () => {
          if (this.initing) {
            return
          }
          let column = this.findOptionColumn(pkey, popId)
          if (column) {
            column.watchKey = column.watchKey ? 0 : 1
            // console.log("watchParamKey", column.label, prop)
            this.$set(this.form, column.prop, '')
            if (pkey == 'popId' && this.popValueMap) {
              let colList = this.popValueMap[popId] || []
              for (let col of colList) {
                // console.log("update pop value", col.to)
                if (this.form[col.to]) {
                  this.$set(this.form, col.to, '')
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
      this.getDefaultFormValue()
    },
    buildPopViewMap() {//需先解析绑定关系,在bindColumns
      let arr = (this.serverData && this.serverData.popProps) || []
      if (typeof arr == 'string') {
        arr = JSON.parse(arr)
      }
      // console.log("popProps", arr)
      this.paramMap = {}//解析后参数列表 paramKey=formKey

      let viewMap = {}
      let valueMap = {}
      let viewParamMap = {}
      let tableLinkMap = {}
      for (let pop of arr) {
        for (let col of pop.data) {
          if (col.colMode == 2) {//参数绑定
            if (col.colReplace && col.colName) {//加个弹出框id前缀
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
      let tableProps = (this.serverData && this.serverData.tableProps) || []
      if (typeof tableProps == 'string') {
        tableProps = JSON.parse(tableProps)
      }
      for (let item of tableProps) {//列表的参数
        let colList = item.colList || []
        let colMap = {}
        for (let col of colList) {
          if (col.bindParam && col.formView) {
            let params = viewParamMap[col.formView]
            if (!params) {
              params = []
              viewParamMap[col.formView] = params
            }//加列表id前缀
            params.push(`g#${item.linkId}#${col.param}`)
          } else if (!col.bindParam) {//字段映射
            colMap[col.colName] = col.linkCol
          }
        }
        tableLinkMap[item.linkId] = colMap
      }
      this.tableLinkMap = tableLinkMap//列表的字段映射
      this.popViewMap = viewMap//弹出框控件绑定
      this.popValueMap = valueMap//弹出框字段绑定
      this.viewParamMap = viewParamMap//弹出框参数绑定
      this.exclueProps = {}//弹出框的字段, popProp=popId
      this.templateViews = []//需要重新template的组件
      this.dateFormats = {}//将日期的valueFormat缓存起来,传给服务器
      this.popValid = {}//弹出框的模糊输入验证判断
      this.defaultForm = ''//设置了默认值的字段-默认值设置
      this.disabledKeys = []//禁止编辑的字段集合
    },
    bindColumns(option) {//赋值option
      if (!option) {
        return
      }
      this.doBindColumn(option.column, '2')
      let groups = option.group || []
      for (let group of groups) {
        if (group.column && group.column.length) {
          this.doBindColumn(group.column, group.linkId)
        }
      }
      this.option = option
      // console.log("option", option)
      this.formReInit()
    },
    findBindData(prefix) {//组装好参数绑定关系
      if (this.paramMap && this.form) {
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
          let value = this.form[prop]
          if (value !== undefined) {
            param[key] = value
            hasVal = true
          }
        }
        if (hasParam && !hasVal) {
          return false
        }
        // console.log("findBindData", prefix, param, this.paramMap, this.form)
        return param
      }
    },
    findTablelinkQuery(linkId) {//获取子表关联数据
      let table = this.tableLinkMap && this.tableLinkMap[linkId] || {}
      // console.log("findTablelinkQuery", this.form)
      let query = {}
      for (let key in table) {
        let value = this.form[table[key]]
        if (value) {
          query[key] = value
        }
      }
      return query
    },
    getBindMap() {//参数绑定映射
      return this.paramMap
    },
    findColumnsByGroup(groupId) {//获取卡片views
      if (groupId == '2' || this.fromFlag == 1) {
        return this.option.column
      }
      let groups = this.option.group || []
      let group = groups.find(it => it.linkId == groupId)
      return group && group.column
    },
    bindColumnParam(column) {//绑定控件的一些信息
      if (!column.prop) {
        column.prop = 'p#' + column._id
      }
      if (this.popViewMap && this.popViewMap[column._id]) {
        let viewPop = this.popViewMap[column._id]
        if (viewPop.colName == column.prop) {
          if (!/^[ntgp]#.+/.test(column.prop)) {
            column.prop = `p#${viewPop.popId}#${column.prop}`
          }
          this.exclueProps[column.prop] = viewPop.popId
        }
        // } else if (groupId && !/^[ntgp]#.+/.test(column.prop)) {
        //   column.prop = `r#${groupId}#${column.prop}`
      }
      if (column.newFlag === 2 && !this.exclueProps[column.prop] && column.prop.startsWith("{")) {//选人附属信息
        this.exclueProps[column.prop] = '2'
      }
      if (column.valueFormat && column.prop) {//缓存dateFormat
        this.dateFormats[column.prop] = column.valueFormat
      }
      if (this.viewParamMap && this.viewParamMap[column._id]) {
        let params = this.viewParamMap[column._id]
        for (let param of params) {
          this.paramMap[param] = column.prop
        }
      }
    },
    doBindColumn(columns, groupId) {//遍历组件设置,缓存辅助信息,提取需要的数据
      if (!columns || !columns.length) {
        return
      }
      for (let column of columns) {
        if (!column.event) {
          column.event = {}
        }
        if (!column.label) {
          column.labelWidth = 4
        }
        if ('rowExpression' == column.component) {
          if (!column.prop) {
            column.prop = 'p#' + column._id
          }
          this.templateViews.push({ prop: column.prop })
          this.bindColumnParam(column, groupId)
          continue
        } else if ('formTable' == column.component) {//列表组件
          column.prop = `g#${groupId}#list`
          column.watchKey = 0
          this.templateViews.push({ prop: column.prop, type: 1 })
          //在fromTable里绑定事件
          // this.doBindColumn(column.option.column, groupId)
          let tcols = column.option.column || []
          for (let tcol of tcols) {//exclue统一
            this.bindColumnParam(tcol, groupId)
          }
          continue
        }
        this.bindColumnParam(column)
        if ('popData' == column.component) {
          let $colPop = this.popViewMap && this.popViewMap[column._id];
          column.inputKey = $colPop ? $colPop.colName : column.prop
          column.watchKey = 0
          let pattern = new RegExp("^p#" + column.popId)
          column.interruptSelect = () => {//判断所需参数是否赋值
            for (let param in this.paramMap) {
              if (pattern.test(param) && !this.form[this.paramMap[param]]) {
                let rl = this.findRelateLabel(this.paramMap[param])
                this.$message.warning(`弹出框缺少参数，${rl}`)
                return true
              }
            }
          }
          if (!column.rules) {
            column.rules = []
          }
          column.rules.push({//输入验证
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
            // console.log("pop change", value, column)
            let old = this.popValid[column.prop]
            this.popValid[column.prop] = 0
            old && this.$nextTick(() => {
              this.$refs.form.clearValidate(column.prop)
            })
            this.bindPopFromValue(value, column.prop, column.inputKey)
            if (this.popViewMap && column.popId) {
              for (let vid in this.popViewMap) {
                let popView = this.popViewMap[vid]
                if (popView && popView.popId == column.popId) {
                  let colView = this.findOptionColumn('_id', vid)
                  // console.log('findColumnByViewId', vid, colView)
                  if (colView) {
                    this.bindPopFromValue(value, colView.prop, popView.colName)
                  }
                }
              }
            }
            //保险,目前不会发生
            this.checkPopValueBind(value, column.popId)
            if (column.event.change) {
              column.event.change(this.form[column.prop])
            }
          }
        }//pop end
        if (column.changeEvent) {
          column.changeEvent = decodeURIComponent(column.changeEvent)
          column.event.change = (value) => {
            if (this.initing) {
              return
            }
            try {
              Function('self', 'value', 'column', column.changeEvent)(this, value, column)
            } catch (error) {
              console.log('chang事件异常', error)
            }
          }
        }//changeEvent end
        if (column.valueExp) {
          if (column.valueExp.disabled) {
            column.disabled = true
          }
          if (!this.defaultForm) {
            this.defaultForm = {}
          }
          let valueKey = column.valueExp.key
          if (valueKey) {
            this.defaultForm[valueKey] = column.valueExp
            if (!this.exclueProps[valueKey]) {
              this.exclueProps[valueKey] = column.popId || groupId
            }
          } else {
            this.defaultForm[column.prop] = column.valueExp
          }
        }//valueExp
        if (column.disabled) {
          this.disabledKeys.push(column.prop)
        }
        if (column.type == 'upload') {
          // if (column.fileSize) {//2.8.3以上兼容
          //   column.fileSize /= 1024
          // }
          column.uploadExceed = () => {
            this.$message.warning('最大上传数量为 ' + column.limit)
          }
        } else if ('userSelect' === column.component) {
          column.event.select = (userList, flag) => {
            bindUserList(userList, column.actionData, this, flag && !this.addForm)
          }
        }
      }
    },
    findRelateLabel(prop) {//获取弹出框参数关联的label
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
    getFormData(key) {//统一获取正在编辑的对象
      return key ? this.form[key] : this.form
    },
    getServerForm() {//获取表单定义和自定义按钮
      if (!this.formId) {
        return
      }
      this.loading = true
      this.$axios.get(`/api/rabbit-resource/formcustom/form-list/${this.formId}?flag=4`)
        .then(res => {
          if (res.data.data) {
            this.initing = true
            let data = res.data.data
            this.serverData = data
            this.buildPopViewMap()
            this.bindColumns(JSON.parse(data.pcForm))
            // console.log("rowKey", this.option.rowKey)
            setTimeout(() => {
              this.initing = false
            }, 600);
            this.loading = false
          } else {
            this.loading = false
          }
        }).catch(err => {
          console.log("err", err)
          this.loading = false
        })
      //获取自定义按钮
      this.$axios.get("/api/rabbit-resource/formcustom/form-enhance", {
        params: {
          formId: this.formId,
          type: 0
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
    getValueByLabel(label) {//根据label获取表单值
      let column = this.findOptionColumn("label", label)
      if (column) {
        return this.getFormData(column.prop)
      }
      return null
    },
    updateValueByLabel(label, value) {//根据label更新表单值
      let column = this.findOptionColumn("label", label)
      if (column) {
        let form = this.getFormData()
        form[column.prop] = value
      }
    },
    disableColumnByLabel(label, disabled = true) {//根据label禁用
      this.updateColumnValueByLabel(label, 'disabled', disabled)
    },
    updateColumnValueByLabel(label, key, value) {//根据key更新控件定义
      let column = this.findOptionColumn("label", label)
      if (column) {
        column[key] = value
      }
    },
    findOptionColumn(key, value) {//根据key获取控件定义
      const findValue = (array, fkey, fval) => {
        return array.find(it => it[fkey] === fval)
      }
      let obj = findValue(this.option.column || [], key, value)
      if (obj) {
        return obj
      }
      let groups = this.option.group || []
      for (let group of groups) {
        obj = findValue(group.column || [], key, value)
        if (obj) {
          return obj
        }
      }
      return null
    }
  },
  watch: {
    value: {//表单数据初始化
      handler(val, oldVal) {
        this.initing = true
        this.emited = 0
        this.form = val || {}
        let keys = Object.keys(this.form)
        this.addForm = !keys || !keys.length
        if (oldVal && this.addForm) {
          this.onResetForm(1)
        } else if (oldVal) {
          this.notifyTableDataChange()
          // } else {//放在初始化结束后
          //   this.getDefaultFormValue()
        }
        setTimeout(() => {
          this.initing = false
        }, 600);
      },
      deep: false,
      immediate: true
    },
    formOption: {//更新本地option
      handler(val) {
        if (this.fromFlag) {
          this.option = val
          this.findParentPopView()
        }
        // console.log("formOption change", val)
      },
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
