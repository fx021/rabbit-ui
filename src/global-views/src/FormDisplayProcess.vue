<template>
  <div v-loading="loading" style="min-height:240px">
    <avue-form v-model="form" :option="optionView" :reset="false" ref="form">
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
          :disabled="isDisabled || scope.disabled"
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

export default {
  name: 'FormDisplayReadonly',
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
    formId: [Number, String],
    readonly: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    },
    formOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    permissionOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {
      form: {},
      serverData: {},
      option: {},
      loading: false,
      addForm: true,
      templateViews: [],
      tableLinkMap: {},
      popViewMap: {},
      popValueMap: {},
      viewParamMap: {},
      paramMap: {},
      exclueProps: {},
      popValid: {},
      emited: 0,
      disabledKeys: [],
      defaultForm: '',
      customBtns: [],
      // 隐藏的列， 提交时用于还原回原本数据
      hideColumn: [],
    }
  },
  computed: {
    tableViews() {
      return this.templateViews.filter(it => it.type == 1).map(it => it.prop) || []
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
    isDisabled() {
      return !this.permissionOption || !this.permissionOption.length
    },
    optionView() {
      let op = this.deepClone(this.option)
      op.clearExclude = this.disabledKeys
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
    isEditMode() {
      return !this.addForm && this.option.rowKey && this.form[this.option.rowKey]
    },
    isForbidden() {
      return this.serverData && this.serverData.status == 0
    },
    fromFlag() {
      if (this.formOption && this.formOption.linkId) {
        return 1
      }
      if (this.formOption && this.formOption.group) {
        return 2
      }
      return 0
    },
    permissionMap() {
      let obj = {}
      if (this.permissionOption && this.permissionOption.length) {
        this.permissionOption.forEach((item) => {
          obj[item.key] = item;
        })
      }
      return obj
    }
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
    // if (!this.formId && this.formOption && this.formOption.linkId) {
    //   this.option = this.formOption
    //   // this.findParentPopView()
    //   return
    // }
    // if (this.formOption && this.formOption.group) {
    //   this.option = this.formOption
    //   // this.findParentPopView()
    //   return
    // }
    this.getServerForm()
  },
  methods: {
    handleView({ row, option }) {
      this.form = row;
      this.optionView = option;
    },
    onResetForm(watch) {
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
        }).catch(() => {
          this.loading = false
        })
      }
      this.loading = !this.addForm
      if (this.$refs.form) {
        callback()
      } else if (!this.defaultForm || !this.addForm) {//加个保险
        this.loading = true
        setTimeout(() => {
          callback()
          this.loading = false
        }, 600);
      }
    },
    checkTableData() {
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
    notifyTableDataChange() {
      for (let prop of this.tableViews) {
        if (this.$refs[prop]) {
          this.$refs[prop][0].onPageChange(1, 1)
        }
      }
    },
    ensureTableData(form) {
      for (let prop of this.tableViews) {
        if (!this.$refs[prop]) {
          let tdata = form[prop] || []
          if (tdata.length && !tdata[0]) {
            form[prop] = []
            this.form[prop] = form[prop]
          }
          continue
        }
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
    removeTableData() {
      let flag = this.addForm ? 1 : 2
      if (!this.tableViews.length) {
        return Promise.resolve()
      }
      let promises = []
      for (let prop of this.tableViews) {
        if (this.$refs[prop]) {
          promises.push(this.$refs[prop][0].clearData(flag))
        }
      }
      return Promise.all(promises)
    },
    onCustomBtnClick(item, index) {
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
    onStartProcess() {
      this.$refs.form.validate((success, done) => {
        if (success) {
          this.onSubmitClick(this.form, done, 'selfDevForm/startProcess')
        } else {
          done()
        }
      })
    },
    submit() {
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
    onSubmitClick(form, done, path) {
      this.checkTableData().then(() => {//子表提交前验证下
        if (form === 1) {
          form = this.form
        }
        if (this.option.rowKey) {
          form['$row-key'] = this.option.rowKey
          // console.log("rowKey", this.form[this.option.rowKey], form[this.option.rowKey])
          if (this.addForm) {
            delete form[this.option.rowKey]
            delete this.form[this.option.rowKey]
          }
        }
        //提交服务器
        this.loading = true
        this.ensureTableData(form)
        let obj = this.prepareFormBody(form, path)
        // console.log("准备提交服务器", obj)
        this.$axios.post(`/api/rabbit-resource/${path || 'formcustom/form'}/${this.formId}`, obj)
          .then(res => {
            let data = res.data.data
            if (!data) {
              done()
              this.loading = false
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
            this.loading = false
            this.form = data
            done && done()
          }).catch((err) => {
            done && done(err || 'error')
            this.loading = false
          })
      }).catch((err) => done && done(err || 'error'))
    },
    prepareFormBody(form, hasStatus) {
      // 权限控制隐藏列 Start
      this.hideColumn.forEach((column) => {
        form[column] = this.value[column]
      })
      // 权限控制隐藏列 End
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
    checkArrayData(obj, key, value) {
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
    getDefaultFormValue() {
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
    bindPopFromValue(value, prop, valueCol) {
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
    checkPopValueBind(value, popId) {
      if (!this.popValueMap) {
        return
      }
      let colList = this.popValueMap[popId] || []
      for (let item of colList) {//值的绑定
        this.bindPopFromValue(value, item.to, item.from)
      }
    },
    getPopValue(popId, rowKey) {
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
    findParentPopView() {
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
    formReInit() {
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
      if (this.addForm) {
        this.getDefaultFormValue()
      }
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
      let tableProps = (this.serverData && this.serverData.tableProps) || []
      if (typeof tableProps == 'string') {
        tableProps = JSON.parse(tableProps)
      }
      for (let item of tableProps) {//列表的参数
        let colList = item.colList || []
        let colMap = {}
        for (let col of colList) {
          if (col.bindParam && col.formView) {//
            let params = viewParamMap[col.formView]
            if (!params) {
              params = []
              viewParamMap[col.formView] = params
            }
            params.push(`g#${item.linkId}#${col.param}`)
          } else if (!col.bindParam) {//字段映射
            colMap[col.colName] = col.linkCol
          }
        }
        tableLinkMap[item.linkId] = colMap
      }
      this.tableLinkMap = tableLinkMap
      this.popViewMap = viewMap//弹出框控件绑定
      this.popValueMap = valueMap//弹出框字段绑定
      this.viewParamMap = viewParamMap//弹出框参数绑定
      this.exclueProps = {}//弹出框的字段, popProp=popId
      this.templateViews = []
      this.dateFormats = {}
      this.popValid = {}
      this.defaultForm = ''
      this.disabledKeys = []
    },
    bindColumns(option) {
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
      // this.formReInit()
    },
    findBindData(prefix) {//组装好参数绑定关系
      if (this.paramMap && this.form) {
        let param = {}
        let hasVal = false
        let hasParam = false
        for (let key in this.paramMap) {
          if (prefix && !key.startsWith(prefix)) {
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
    findTablelinkQuery(linkId) {
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
    getBindMap() {
      return this.paramMap
    },
    findColumnsByGroup(groupId) {
      if (groupId == '2' || this.fromFlag == 1) {
        return this.option.column
      }
      let groups = this.option.group || []
      let group = groups.find(it => it.linkId == groupId)
      return group && group.column
    },
    bindColumnParam(column) {
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
      if (column.newFlag === 2 && !this.exclueProps[column.prop] && column.prop.startsWith("{")) {
        this.exclueProps[column.prop] = '2'
      }
      if (column.valueFormat && column.prop) {
        this.dateFormats[column.prop] = column.valueFormat
      }
      if (this.viewParamMap && this.viewParamMap[column._id]) {
        let params = this.viewParamMap[column._id]
        for (let param of params) {
          this.paramMap[param] = column.prop
        }
      }

      if (!this.permissionOption || this.permissionOption.length === 0) {
        column.disabled = true;
        column.required = false;
        delete column.rules;
      } else if (this.permissionMap[column.prop]) {
        const option = this.permissionMap[column.prop];
        if (option.hide) {
          column.display = false
          this.hideColumn.push(column.prop)
          this.form[option.key] = option.value;
          // column.disabled = true;
          // column.type = 'input';
          // column.value = option.value;
          // delete column.component;
          // delete column.rules;
        } else if (option.disable) {
          column.disabled = true;
          column.required = false;
          delete column.rules;
        } else if (option.required) {
          column.required = true;
          column.rules = column.rules || [];
          if (!column.rules.length || !column.rules[0].required) {
            column.rules.push({
              required: true, message: `请输入${column.label}`
            })
          }
        }
      }
    },
    doBindColumn(columns, groupId) {
      if (!columns || !columns.length) {
        return
      }
      //避免prop重名,级联
      // let tablePat = /^\d+$/
      for (let column of columns) {
        if (!column.event) {
          column.event = {}
        }
        if (column.labelWidth == '0') {
          column.vlabel = column.label
          column.label = ''
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
            if ('rowExpression' == tcol.component) {
              if (!tcol.prop) {
                tcol.prop = 'p#' + tcol.label
                this.exclueProps.push(tcol.prop)
              }
            }
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
          column.interruptSelect = () => {
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
          column.event.error = (flag) => {
            this.popValid[column.prop] = flag
          }
          column.event.select = (value) => {
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
    findPopPrimaryProp(colList) {
      let idProp = null
      for (let col of colList) {
        if (col.primaryKey) {
          return col.to
        }
        if (col.from.endsWith('#ID')) {
          idProp = col.to
        }
      }
      return idProp || colList[0].to
    },
    findRelateLabel(prop) {
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
    getFormData(key) {
      return key ? this.form[key] : this.form
    },
    getServerForm() {
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
        }).catch(() => {
          this.loading = false
        })
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
    getValueByLabel(label) {
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
    disableColumnByLabel(label, disabled = true) {
      this.updateColumnValueByLabel(label, 'disabled', disabled)
    },
    updateColumnValueByLabel(label, key, value) {
      let column = this.findOptionColumn("label", label)
      if (column) {
        column[key] = value
      }
    },
    findOptionColumn(key, value) {
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
    value: {
      handler(val, oldVal) {
        this.initing = true
        this.emited = 0
        this.form = val || {}
        let keys = Object.keys(this.form)
        this.addForm = !keys || !keys.length
        if (oldVal && this.addForm) {
          // console.log("reset form")
          this.onResetForm(1)
        } else if (oldVal) {
          // console.log("update table data")
          this.notifyTableDataChange()
          // } else {
          //   this.getDefaultFormValue()
        }
        setTimeout(() => {
          this.initing = false
        }, 600);
      },
      deep: false,
      immediate: true
    },
    formOption: {
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
<style lang="scss" scoped>
/deep/ .avue-form__menu {
  display: none;
}
</style>
