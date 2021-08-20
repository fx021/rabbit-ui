<template>
  <div>
    <el-input
      v-model="inputTxt"
      placeholder="表达式"
      :size="size"
      @click.native="onInputClick"
      readonly
    ></el-input>
    <el-dialog
      title="编辑表达式"
      :visible.sync="visible"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <el-input v-model="showText" placeholder="表达式" clearable ref="input">
        <el-button slot="append" @click="onConfirm">确定</el-button>
      </el-input>
      <div class="panel-wrapper">
        <div class="panel">
          <p class="panel-header">字段</p>
          <div class="panel-list">
            <span
              v-for="item in colList"
              :key="item.colName"
              class="panel-item"
              @click="onColClick(item)"
            >{{`${item.colName}（${item.colDesc}）`}}</span>
          </div>
        </div>
        <div class="panel">
          <p class="panel-header">符号</p>
          <div class="panel-list">
            <span
              v-for="item in symbolList"
              :key="item"
              class="panel-item center"
              @click="onSymbolClick(item)"
            >{{item}}</span>
          </div>
        </div>
        <el-form label-position="right" label-width="40px" size="small">
          <el-form-item label>
            <el-checkbox label="过滤非数字" v-model="notNumber"></el-checkbox>
            <el-checkbox label="虚拟字段" v-model="virtual" @change="onVirtualChange"></el-checkbox>
          </el-form-item>
          <el-form-item label="前缀">
            <el-input v-model="prepend" placeholder></el-input>
          </el-form-item>
          <el-form-item label="后缀">
            <el-input v-model="append" placeholder></el-input>
          </el-form-item>
          <el-form-item label="精度">
            <el-input-number
              :min="0"
              :max="6"
              v-model="precision"
              placeholder
              :controls="false"
              style="width:100%"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {//表达式编辑
  name: 'ExpEditor',
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
    row: Object,
    value: String,
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    colList() {//可选的字段list
      if (!this.row || !this.parentCustom) {
        return []
      }
      return this.parentCustom.selectColFun(this.row.tableId)
    }
  },
  data: () => {
    return {
      visible: false,//显示编辑对话框
      inputTxt: '',//确认的表达式
      showText: '',//编辑中的表达式
      prepend: '',//前缀
      append: '',//后缀
      precision: '2',//精度
      notNumber: true,//过滤非数字
      virtual: false,//虚拟
      symbolList: ['+', '-', '*', '/', '(', ')', '%']
    }
  },
  created() {
    this.inputTxt = this.value || ''
    this.showText = this.inputTxt
  },
  methods: {
    onInputClick() {
      document.activeElement && document.activeElement.blur()
      this.visible = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    onConfirm() {
      if (this.showText) {
        this.showText = this.showText.trim()
      }
      if (!this.showText) {
        this.$message.warning('请输入表达式')
        return
      }
      if (typeof this.precision === 'string') {
        this.precision = this.precision.trim()
      }
      const callback = (val) => {
        this.$emit('select', this.showText)
        this.row.param2 = this.prepend
        this.row.param3 = this.append
        this.row.param4 = this.notNumber
        this.row.param5 = this.precision
        if (!val && this.virtual) {
          this.row.prop = ''
        }
        this.inputTxt = this.showText
        this.visible = false
      }
      if (this.row.prop && this.virtual) {
        this.$confirm('当前组件已绑定字段，是否需要清除')
          .then(() => {
            callback()
          }).catch(() => {
            callback(1)
          })
      } else {
        callback()
      }
    },
    onVirtualChange(val) {
      if (val && this.row.prop) {
        this.$confirm('当前组件已绑定字段，勾选后将清除。虚拟字段表达式可在新增组件上设置，需要维持原字段在该组件上吗？')
          .then(() => {
            this.virtual = false
          }).catch(() => {
            //cancel
          })
      }
    },
    onColClick(col) {
      if (!!this.showText && !/[+\-*%)]\s*\(?\s*$/.test(this.showText)) {
        this.$message.warning('请选择一个符号')
        return
      }
      this.showText += `{${col.colName}}`
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    onSymbolClick(sym) {
      if (!this.showText || /[+\-*%]\s*\(?\s*$/.test(this.showText)) {
        if (sym != '(' || /\(\s*$/.test(this.showText)) {
          this.$message.warning('请选择一个字段')
          return
        }
      }
      this.showText += ` ${sym} `
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    onDialogClosed() {
      this.showText = this.inputTxt
    }
  },
  watch: {//同步列表的属性
    'row.param2': {
      handler(val) {
        this.prepend = val
      },
      immediate: true
    },
    'row.param3': {
      handler(val) {
        this.append = val
      },
      immediate: true
    },
    'row.param4': {
      handler(val) {
        this.notNumber = val
      },
      immediate: true
    },
    'row.param5': {
      handler(val) {
        this.precision = val
      },
      immediate: true
    },
    'row.prop': {
      handler(val) {
        this.virtual = !val
      },
      immediate: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel-wrapper {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
}
.panel:nth-child(2) {
  margin: 0 32px;
}
.panel {
  display: inline-block;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.panel-list {
  height: 210px;
  overflow-y: auto;
}
.panel-header {
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.panel-item {
  height: 30px;
  min-width: 46px;
  max-width: 240px;
  line-height: 30px;
  padding: 0 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
.center {
  text-align: center;
}
.panel-item:hover {
  color: #409eff;
}
</style>
