<template>
  <div>
    <el-input
      v-model="inputTxt"
      placeholder="默认值"
      :size="size"
      @click.native="onInputClick"
      readonly
    ></el-input>
    <el-dialog
      title="编辑默认值"
      :visible.sync="visible"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <div class="top-btn">
        <el-link type="warning" size="medium" @click="onClearClick(1)">取消默认值</el-link>
      </div>
      <div class="input-wrapper">
        <el-input
          v-model="previewText"
          :placeholder="textHolder"
          :readonly="tagVal<10 || tagVal>11"
          clearable
          ref="input"
        >
          <el-select v-model="tagVal" slot="prepend" style="width:120px" @change="onTagChange">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in tagList"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-button slot="append" @click="onValueConfirm">确定</el-button>
        </el-input>
        <el-checkbox
          label="禁止修改"
          v-model="form.disabled"
          style="margin-left:12px"
          :disabled="tagVal==1"
        ></el-checkbox>
      </div>
      <el-form :model="form" v-show="tagVal==1" inline label-width="80px" class="val-detail">
        <el-row>
          <el-col :span="12">
            <el-form-item label="步长">
              <el-input-number v-model="form.step" placeholder="步长" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值">
              <el-input-number v-model="form.min" placeholder="最小值" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小长度">
              <el-input-number v-model="form.len" placeholder="最小长度" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期">
              <el-select v-model="form.date">
                <el-option label="不添加日期" :value="0"></el-option>
                <el-option label="添加年月日" :value="3"></el-option>
                <el-option label="添加年月" :value="2"></el-option>
                <el-option label="添加年" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="前缀">
              <el-input v-model="form.prepend" placeholder="前缀" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后缀">
              <el-input v-model="form.append" placeholder="后缀" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-select
        v-model="paramVal"
        placeholder="字典默认值"
        v-if="tagVal==12"
        class="val-detail"
        clearable
      >
        <el-option
          :label="item.dictValue"
          :value="item.dictKey"
          v-for="item in paramList"
          :key="item.id"
        ></el-option>
      </el-select>
      <pop-data
        :pop-id="param1"
        v-model="paramVal"
        v-if="tagVal==13"
        class="val-detail"
        :value-key="popValueKey"
        @row-key="onReceiveRowKey"
        :can-empty="true"
      ></pop-data>
      <area-select v-model="paramVal" v-if="tagVal==14" class="val-detail"></area-select>
    </el-dialog>
  </div>
</template>

<script>
import cacheRequest from '@/views/form/cache-request'
export default {//默认值编辑
  name: 'ValueEditor',
  model: {
    event: 'select'
  },
  props: {
    value: Object,
    editMode: Boolean,
    viewType: String,
    colDefault: Array,
    prop: String,
    param1: [String, Number, Boolean, Array],
    param2: [String, Number, Boolean],
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    popValueKey() {
      if (this.colDefault && this.colDefault.length) {
        let defCol = null
        let key = null
        let colList = []
        for (let i = 0; i < this.colDefault.length; i++) {
          let colItem = this.colDefault[i]
          if (colItem.colMode == 0) {
            if (!defCol) {
              defCol = colItem.popCol
            }
            if (colItem.primaryKey) {
              key = colItem.popCol
            }
            colList.push(colItem.popCol)
          } else if (colItem.colMode == 1) {
            let index = colList.findIndex(it => it == colItem.popCol)
            if (index >= 0) {
              colList.splice(index, 1)
            }
          }
        }
        return key ? key : (colList.length ? colList[0] : defCol)
      }
      return this.rowKey
    },
    textHolder() {
      return this.tagVal == 11 ? '接口链接 (GET)' : '普通文本'
    }
  },
  data: () => {
    return {
      tagVal: 10,
      paramVal: '',
      deptList: [],
      postList: [],
      paramList: [],
      hasOpertion: false,
      emitChange: false,
      paramChange: false,
      form: {
        step: 1,
        min: 1,
        len: 5,
        disabled: false,
        scale: 0,
        prepend: '',
        append: ''
      },
      previewText: '',
      inputTxt: '',
      rowKey: '',
      oldDisabled: false,
      visible: false,
      tagList: [],
    }
  },
  mounted() {
    this.getUserExtraInfo()
  },
  methods: {
    onReceiveRowKey(rowKey) {
      this.rowKey = rowKey
    },
    getUserExtraInfo() {
      this.$store.dispatch('GetUserDeptList').then(list => {
        this.deptList = list
      })
      cacheRequest({
        url: '/api/rabbit-system/post/select-ids',
        method: 'get',
        params: {
          ids: this.userInfo.post_id
        }
      }, "postList").then(list => this.postList = list)

    },
    onInputClick() {
      if (/#id|#header_id/i.test(this.prop)) {
        this.$message.warning("主键和外键不能有默认值")
        return
      }
      if (this.tagVal == 12 && !this.param1) {
        this.$message.warning("请先选择一个字典")
        return
      }
      if (this.tagVal == 13 && !this.param1) {
        this.$message.warning("请先选择一个弹出框")
        return
      }
      if (this.paramChange && this.tagVal == 12) {
        this.getDictList()
      }
      this.visible = true
      this.$nextTick(() => {
        if (!this.$refs.input.readonly) {
          document.activeElement && document.activeElement.blur()
          this.$refs.input.focus()
        }
      })
    },
    getDictList() {
      this.$axios.get('/api/rabbit-system/dict/select-child', {
        params: {
          parentId: this.param1
        }
      }).then(res => {
        this.paramList = res.data.data || []
        // if (this.value && this.value.value) {
        //   this.onDictSelct(this.value.value)
        // }
      })
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "y+": date.getFullYear().toString(),
        "M+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "m+": date.getMinutes().toString(),
        "s+": date.getSeconds().toString()
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
      }
      return fmt
    },
    onTagChange(val) {
      this.hasOpertion = true
      if (val == 1) {
        this.computeFormText()
        this.form.disabled = true
      } else if (val == 2) {
        this.previewText = this.dateFormat('yyyy-MM-dd', new Date())
      } else if (val == 3) {
        this.previewText = this.dateFormat('HH:mm:ss', new Date())
      } else if (val == 4) {
        this.previewText = this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date())
      } else if (val == 5) {
        this.previewText = this.userInfo.real_name || this.userInfo.nick_name
      } else if (val == 6) {
        this.previewText = this.deptList.map(it => it.deptName).join() || this.userInfo.dept_id
      } else if (val == 7) {
        this.previewText = this.postList.map(it => it.postName).join() || this.userInfo.post_id
      } else if (val == 8) {
        this.previewText = this.userInfo.role_name
      } else {
        this.previewText = ''
      }
      this.paramVal = ''
    },
    computeFormText() {
      let val = this.form
      let text = val.min + val.step + ''
      let len = val.len - text.length
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          text = '0' + text
        }
      }
      let pre = val.prepend || ''
      let pattern = ''
      if (val.date == 1) {
        pattern = 'yyyy'
      } else if (val.date == 2) {
        pattern = 'yyyyMM'
      } else if (val.date == 3) {
        pattern = 'yyyyMMdd'
      }
      if (pattern) {
        pre += this.dateFormat(pattern, new Date())
      }
      text = pre + text
      if (val.append) {
        text += val.append
      }
      this.previewText = text
    },
    onClearClick(val) {
      if (val === 1 && this.value && this.value.type == 1) {
        this.$confirm('取消后会删除相关数据, 确定要修改吗?', '修改提示')
          .then(() => {
            this.onClearClick()
          }).catch(() => {
            //cancel
          })
        return
      }
      this.previewText = ''
      this.inputTxt = ''
      if (this.value) {
        this.emitChange = true
        this.$emit('select')
      }
      this.visible = false
    },
    onValueConfirm() {
      const callback = () => {
        let obj = { type: this.tagVal, disabled: this.form.disabled }
        if (this.tagVal == 13) {
          obj.key = this.popValueKey
        }
        if (this.tagVal > 11) {
          if (!this.paramVal) {
            this.onClearClick()
            return
          }
          obj.value = this.paramVal
          this.previewText = '【已赋值】'
        } else if (this.tagVal >= 10) {
          let text = this.previewText.trim()
          if (text) {
            obj.value = text
            if (this.tagVal == 11 && !/^https?:\/\/.{6,}$/.test(text) && !/^\/api\/rabbit-.{6,}/.test(text)) {
              this.$message.warning('输入的链接不正确')
              return
            }
          } else if (this.tagVal == 11) {
            this.$message.warning('链接为空,如果不想有默认值,可切换到普通文本')
            return
          } else if (this.tagVal == 10) {
            this.onClearClick()
            return
          }
          this.previewText = text
        }
        this.inputTxt = this.previewText
        if (this.tagVal == 1) {
          obj = Object.assign(obj, this.form)
        }
        this.emitChange = true
        this.$emit('select', obj)
        this.visible = false
      }
      if (this.editMode && (this.hasOpertion || this.oldDisabled !== this.form.disabled)) {
        this.$confirm('修改默认值会重新计算, 确定要修改吗?', '修改提示')
          .then(() => {
            callback()
          }).catch(() => {
            //cancel
            this.visible = false
          })
      } else {
        callback()
      }
    },
    getDefaultVal() {
      if (['radio', 'checkbox', 'select', 'cascader'].includes(this.viewType)) {//字典
        return 12
      } else if ('popData' == this.viewType) {//弹出框
        return 13
      } else if ('areaSelect' == this.viewType) {//省市区
        return 14
      }
      return 10
    },
    applyValueData() {
      let val = this.value || {}
      this.tagVal = val.type
      this.rowKey = val.key || ''
      if (val.type == 1) {
        this.form = Object.assign({}, val)
        this.computeFormText()
      } else {
        this.form.disabled = val.disabled
      }
      if (val.type > 11) {
        this.paramVal = val.value
        if (val.value) {
          this.previewText = '【已赋值】'
        }
      } else if (val.type > 9) {
        this.previewText = val.value
      } else if (val.type > 1) {
        this.onTagChange(val.type)
      }
    },
    onDialogClosed() {
      if (this.value) {//取消还原
        this.applyValueData()
        this.hasOpertion = false
      }
    },
  },
  watch: {
    form: {
      handler() {
        if (this.tagVal == 1) {
          this.hasOpertion = true
          this.computeFormText()
        }
      },
      deep: true,
    },
    viewType: {
      handler(val) {
        let list = [{ label: '普通文本', value: 10, excludes: ['radio', 'checkbox', 'select', 'cascader', 'popData', 'areaSelect'] }, { label: '自增序列', value: 1, types: ['input', 'number'] }, { label: '当前日期', value: 2, types: ['date', 'daterange', 'input'] }, { label: '当前时间', value: 3, types: ['time', 'timerange', 'input'] }, { label: '日期时间', value: 4, types: ['datetime', 'datetimerange', 'input', 'elCalendar'] }, { label: '当前用户', value: 5, types: ['userSelect'] }, { label: '用户部门', value: 6, types: ['deptSelect'] }, { label: '用户岗位', value: 7, types: ['postSelect'] }, { label: '用户角色', value: 8, types: ['roleSelect'] }, { label: '自定义接口', value: 11, types: ['input', 'number'] }, { label: '字典值', value: 12, types: ['radio', 'checkbox', 'select', 'cascader'] }, { label: '弹出框', value: 13, types: ['popData'] }, { label: '省市区', value: 14, types: ['areaSelect'] }]
        if (!val) {
          this.tagList = list
        } else {
          this.tagList = list.filter(it => {
            if (it.excludes) {
              return !it.excludes.includes(val)
            }
            if (it.types) {
              return it.types.includes(val)
            }
            return true
          })
        }
        let findTag = this.tagVal
        if (this.value) {
          findTag = this.value.type
        }
        if (!this.tagList.find(it => it.value == findTag)) {
          this.tagVal = this.getDefaultVal()
          this.onClearClick()
        }
      },
      immediate: true
    },
    param1: {
      handler(val) {
        this.paramChange = !!val
        if (this.paramVal) {
          this.paramList = []
          this.paramVal = ''
          this.onClearClick()
        }
        // if (this.value && this.value.type == 12 && val) {
        //   this.getDictList()
        // }
      },
      immediate: true
    },
    value: {
      handler(val) {
        if (this.emitChange) {
          this.emitChange = false
          this.hasOpertion = false
          return
        }
        this.paramVal = ''
        this.previewText = ''
        if (val) {
          this.applyValueData()
        } else {
          this.tagVal = this.getDefaultVal()
          this.form = {
            step: 1, min: 1, len: 5, date: 0,
            disabled: false, scale: 0, prepend: '', append: ''
          }
        }
        this.oldDisabled = this.form.disabled
        this.inputTxt = this.previewText
        this.hasOpertion = false
      },
      immediate: true
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-btn {
  position: absolute;
  right: 64px;
  top: 18px;
}
.tag-wrapper {
  margin-left: -12px;
  margin-top: -12px;
}
.tag-wrapper /deep/ .el-tag {
  margin-left: 12px;
  margin-top: 12px;
}
.input-wrapper {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.val-detail {
  margin: 16px 0;
}
</style>
