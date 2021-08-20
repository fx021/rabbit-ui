<template>
  <div>
    <el-input
      v-model="inputTxt"
      placeholder="附属信息"
      readonly
      :size="size"
      @click.native="onInputClick"
    ></el-input>
    <el-dialog
      title="选人附属信息"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <div class="top">
        <el-checkbox v-model="allSelect" :indeterminate="isIndeterminate" @change="onAllChange">全显示</el-checkbox>
        <el-button size="mini" style="margin-left:32px" @click="onCancel" :loading="loading">取消</el-button>
        <el-button type="primary" size="mini" @click="onConfirm" :loading="loading">确定</el-button>
      </div>
      <el-table :data="listData" border>
        <el-table-column label="用户信息" align="center">
          <template slot-scope="scope">
            <span>{{getTableLable(scope.row.value)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="组件绑定" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.label"
              placeholder="组件字段"
              size="mini"
              clearable
              @change="val=>onColChange(scope,val)"
            >
              <el-option
                :label="viewColLabel(item)"
                :value="viewColValue(item)"
                v-for="item in colList"
                :disabled="viewColDisabled(item)"
                :key="item.colName"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="显示">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.display" size="mini" @change="onDisplayChange"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {//选人编辑
  name: 'UserEditor',
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
    value: Array,
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    colList() {
      if (!this.row || !this.parentCustom) {
        return []
      }
      return this.parentCustom.selectColFun(this.row.tableId)
    }
  },
  data: () => {
    return {
      visible: false,
      listData: [],
      checkValue: false,
      loading: false,
      inputTxt: '',
      valueMap: {
        company: { name: '所在公司', key: '{USER_COMPANY}' }, deptName: { name: '所在部门', key: '{USER_DEPT}' }, postName: { name: '所在岗位', key: '{USER_POST}' }, roleName: { name: '所属职务', key: '{USER_ROLE}' }, code: { name: '员工工号', key: '{USER_NUMBER}' }, phone: { name: '手机号', key: '{USER_PHONE}' }
      },
      allSelect: false,
      isIndeterminate: false,
    }
  },
  created() {
    this.bindValueToList()
  },
  methods: {
    bindValueToList() {//回显
      let list = this.listData.length ? [] : this.listData
      for (let key in this.valueMap) {
        let item = this.valueMap[key]
        let set = null
        if (this.value) {
          set = this.value.find(it => it.value == key)
        }
        list.push({ label: set ? set.label : item.key, value: key, display: set ? true : this.allSelect })
      }
      this.listData = list
      if (this.value && this.value.length) {
        this.onDisplayChange(true)
      }
    },
    viewColDisabled(col) {
      let disabled = col.colName == 'ID' || this.row.prop == this.viewColValue(col)
      if (!disabled) {
        let find = this.viewColValue(col)
        disabled = !!this.listData.find(it => it.label == find)
      }
      return disabled
    },
    viewColValue(col) {
      if (col.tableName) {
        return `n#${col.tableName}#${col.colName}`
      }
      return col.colName
    },
    viewColLabel(col) {
      let base = col.status == 2 && col.colDefault ? col.colDefault : col.colName
      if (col.colDesc) {
        return `${base}（${col.colDesc}）`
      }
      return base
    },
    getTableLable(value) {//lebel
      return this.valueMap[value].name
    },
    onAllChange(val) {//全部显示变更
      this.listData.forEach(item => item.display = val)
    },
    onColChange(scope, val) {//字段变更
      this.checkValue = true
      if (val && !val.startsWith('{')) {
        if (!scope.row.display) {
          scope.row.display = true
          this.onDisplayChange(true)
        }
      }
    },
    onDisplayChange(val) {//显示变更
      let change = false;
      this.checkValue = true
      for (let item of this.listData) {
        if (item.display != val) {
          change = true
          break
        }
      }
      if (!change) {
        this.allSelect = val
        this.isIndeterminate = false
      } else {
        this.allSelect = false
        this.isIndeterminate = true
      }
    },
    onInputClick() {
      this.visible = true
    },
    onCancel() {
      this.visible = false
    },
    onConfirm() {
      this.loading = true
      let data = []
      for (let item of this.listData) {
        if (item.display) {
          let label = item.label
          if (!label) {
            label = this.valueMap[item.value].key
          }
          data.push({ label: label, value: item.value })
        }
      }
      this.checkValue = false
      this.$emit('select', data.length ? data : null)
      setTimeout(() => {
        this.loading = false
        this.visible = false
      }, 1000);
    },
    beforeClose(done) {
      if (this.loading) {
        this.$message.warning('请稍候')
      } else {
        done()
      }
    },
    onDialogClosed() {
      if (this.checkValue && this.value) {//reset
        this.bindValueToList()
      }
      this.checkValue = false
      this.loading = false
    }
  },
  watch: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
  text-align: end;
  position: absolute;
  top: 18px;
  right: 70px;
}
</style>
