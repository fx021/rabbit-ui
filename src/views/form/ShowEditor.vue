<template>
  <div>
    <el-input
      v-model="inputTxt"
      placeholder="回显设置"
      :size="size"
      @click.native="onInputClick"
      readonly
    ></el-input>
    <el-dialog
      title="回显设置"
      :visible.sync="visible"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <el-input v-model="previewText" :placeholder="hintMsg" :readonly="mode<5" ref="input">
        <template slot="prepend">
          <el-select v-model="mode" placeholder="回显类型" @change="onModeChange" style="width:100px">
            <el-option label="选人" :value="1"></el-option>
            <el-option label="选部门" :value="2"></el-option>
            <el-option label="选岗位" :value="3"></el-option>
            <el-option label="选角色" :value="4"></el-option>
            <el-option label="API接口" :value="5"></el-option>
            <el-option label="查询SQL" :value="6"></el-option>
          </el-select>
        </template>
        <template slot="append">
          <el-button @click="onValueConfirm">确定</el-button>
        </template>
      </el-input>
      <el-form inline style="margin-top:16px" label-width="80px">
        <el-form-item label="前缀">
          <el-input v-model="prepend" placeholder></el-input>
        </el-form-item>
        <el-form-item label="后缀">
          <el-input v-model="append" placeholder></el-input>
        </el-form-item>
        <el-form-item label="数据源" v-show="mode===6">
          <el-select v-model="sourceId" placeholder clearable>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in sourceList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段名" v-show="mode===5">
          <el-input v-model="colName" placeholder="返回对象的key和显示字段，默认id,name"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import cacheRequest from '@/views/form/cache-request'
export default {//id回显编辑
  name: 'ShowEditor',
  model: {
    event: 'select'
  },
  props: {
    value: Object,
    row: Object,
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    hintMsg() {
      if (this.mode === 1) {
        return '选人控件id回显'
      }
      if (this.mode === 2) {
        return '选部门控件id回显'
      }
      if (this.mode === 3) {
        return '选岗位控件id回显'
      }
      if (this.mode === 4) {
        return '选角色控件id回显'
      }
      if (this.mode === 5) {
        return 'GET请求，当前值为 {value}'
      }
      if (this.mode === 6) {
        return '数据源为空则跟随表单，当前值为 {value}，须返回id和name'
      }
      return '回显设置'
    }
  },
  data: () => {
    return {
      mode: 1,
      previewText: '',
      inputTxt: '',
      sourceId: '',
      prepend: '',
      colName: 'name',
      append: '',
      visible: false,
      hasOperation: false,
      sourceList: []
    }
  },
  mounted() {
    this.getDataSources()
  },
  methods: {
    onModeChange() {
      this.hasOperation = true
      this.previewText = ''
    },
    onInputClick() {
      this.visible = true
      this.$nextTick(() => {
        if (!this.$refs.input.readonly) {
          document.activeElement && document.activeElement.blur()
          this.$refs.input.focus()
        }
      })
    },
    onValueConfirm() {
      if (this.mode === 5 && !/^\/api\/rabbit-/.test(this.previewText)) {
        this.$message.warning('请输入 /api/rabbit- 开头的接口链接')
        return
      }
      if (this.mode === 6 && !/^select\s+/i.test(this.previewText)) {
        this.$message.warning('只能输入查询语句')
        return
      }
      if (this.row) {
        this.row.param1 = this.mode
        this.row.param2 = this.prepend
        this.row.param3 = this.append
        if (this.mode === 5) {
          this.row.action = this.previewText
          this.row.accept = this.colName
        } else if (this.mode === 6) {
          this.row.action = this.previewText
          this.row.accept = this.sourceId
        } else {
          this.row.action = undefined
          this.row.accept = undefined
        }
        this.textShow()
      }
      this.hasOperation = false
      this.visible = false
    },
    textShow() {
      if (this.mode === 1) {
        this.inputTxt = '【选人】'
      } else if (this.mode === 2) {
        this.inputTxt = '【选部门】'
      } else if (this.mode === 3) {
        this.inputTxt = '【选岗位】'
      } else if (this.mode === 4) {
        this.inputTxt = '【选角色】'
      } else {
        this.inputTxt = this.row.action
      }
    },
    getDataSources() {
      cacheRequest({
        url: '/api/rabbit-resource/formcustom/getDataSource',
        method: 'get'
      }, 'sourceList').then(data => {
        this.sourceList = data
      })
    },
    onDialogClosed() {
      if (this.row) {//取消还原
        this.mode = this.row.param1 || 1
        this.prepend = this.row.param2 || ''
        this.append = this.row.param3 || ''
        this.previewText = this.row.action || ''
        if (this.mode === 5) {
          this.sourceId = this.row.accept || ''
        } else if (this.mode === 6) {
          this.colName = this.row.accept || ''
        }
        this.textShow()
      }
    },
  },
  watch: {
    'row.param1': {
      handler(val) {
        this.mode = val || 1
        this.textShow()
      },
      immediate: true
    },
    'row.param2': {
      handler(val) {
        this.prepend = val || ''
      },
      immediate: true
    },
    'row.param3': {
      handler(val) {
        this.append = val || ''
      },
      immediate: true
    }
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
