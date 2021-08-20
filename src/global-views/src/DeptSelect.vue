<template>
  <div class="select-wrapper">
    <el-input
      placeholder="选择部门"
      v-model="inputTxt"
      :class="['input-with-select', {'no-text': !showText}]"
      readonly
      :size="size"
      :disabled="disabled"
    >
      <el-button
        slot="append"
        icon="el-icon-school"
        @click="showSelectDialog"
        :size="size"
        v-if="!readonly && !disabled"
      >{{showText?'请选择':''}}</el-button>
    </el-input>
    <el-dialog
      title="选择部门"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      @closed="onDialogClosed"
      append-to-body
    >
      <el-form :model="search" label-position="right" label-width="72px" ref="form" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号">
              <el-input
                v-model="search.deptName"
                placeholder="请输入部门编号"
                clearable
                @keyup.enter.native="handlePageChange(0)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="全称">
              <el-input
                v-model="search.fullName"
                placeholder="请输入部门全称"
                clearable
                @keyup.enter.native="handlePageChange(0)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              style="margin:0 24px"
              size="mini"
              @click="handlePageChange(0)"
            >查询</el-button>
            <!-- <el-select v-model="search.childMode" size="mini" v-if="limit!=1">
              <el-option label="选择：不包含下级" :value="0"></el-option>
              <el-option label="选择：包含直接下级" :value="1"></el-option>
              <el-option label="选择：包含所有下级" :value="2"></el-option>
            </el-select>-->
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="listData"
        max-height="300px"
        @select="onRowSelect"
        @select-all="onAllSelect"
        @row-dblclick="onRowDblClick"
        @selection-change="onSelectionChange"
        v-loading="loading"
        row-key="id"
        ref="table"
        size="small"
        lazy
        :load="loadChildren"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :cell-style="cellStyle"
        :select-on-indeterminate="limit==0"
        :indent="8"
        stripe
        border
      >
        <el-table-column type="selection" width="30" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="部门简称" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门编号" prop="code" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column label="部门全称" prop="fullName" show-overflow-tooltip width="220"></el-table-column>
        <el-table-column label="类型" prop="deptCategoryName" width="100" align="center"></el-table-column>
      </el-table>
      <div class="select-footer">
        <div class="footer-btn">
          <el-button type="warning" plain @click="clearSelected">清空选择</el-button>
          <el-button @click="visible=false">取消</el-button>
          <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import selector from './selector'
export default {//部门选择
  name: 'DeptSelect',
  mixins: [selector()],
  computed: {
    tableState() {
      return this.$refs.table.store.states || {}
    },
  },
  data: () => {
    return {
      inputTxt: '',
      visible: false,
      total: 0,
      search: {
        childMode: 0
      },
      listData: [],
      hasChange: false,
      lastSelection: [],
      loading: false
    }
  },
  methods: {
    showSelectDialog() {
      if (this.disabled) {
        return
      }
      if (this.listData.length == 0) {
        this.handlePageChange(0)
      }
      this.visible = true
    },
    onConfirm() {
      let selection = this.$refs.table.selection || []
      if (this.required && selection.length == 0) {
        this.$message.warning('请选择部门')
        return
      }
      let text = ''
      let result = ''
      for (let item of selection) {
        if (text != '') {
          text += ','
        }
        text += item.deptName
        if (result != '') {
          result += ','
        }
        result += item.id
      }
      this._updateValue = true
      this.inputTxt = text
      if (this.limit == 1 && selection.length == 1 && this._selectForNumber) {
        this.$emit("change", parseInt(result))
      } else {
        this.$emit("change", result)
      }
      this.lastSelection = selection.length ? this.deepClone(selection) : []
      this.hasChange = false
      this.visible = false
    },
    handlePageChange(pid, resolve) {
      const loadChild = typeof resolve == "function"
      this.loading = !loadChild
      const params = {
        parentId: pid || 0,
        isDeleted: 0
      }
      if (!loadChild) {
        params.fullName = this.search.fullName
        params.deptName = this.search.deptName
      }

      this.$axios.get('/api/rabbit-system/dept/select-list', {
        params: params
      }).then(res => {
        let data = res.data.data || []
        if (loadChild) {
          resolve(data)
          this.checkDataSelected(data)
        } else {
          this.checkDataSelected()
          this.listData = data
          if (data.length == 1) {
            this.$nextTick(() => {
              this.$refs.table.$el.querySelector(".el-table__expand-icon").click()
            })
          }
        }
        this.loading = false
      }).catch(() => {
        if (loadChild) {
          resolve([])
        }
        this.loading = false
      })
    },
    loadChildren(tree, treeNode, resolve) {
      this.handlePageChange(tree.id, resolve)
    },
    getDefaultSelectList(ids) {
      this.$axios.get("/api/rabbit-system/dept/select-ids", {
        params: { ids }
      }).then(res => {
        let data = res.data.data
        if (data) {
          this._defSelection = data
          this.lastSelection = this.deepClone(data)
          if (this.listData.length > 0) {
            this.checkSelectedWithData(this.listData)
          }
          this.inputTxt = data.map(it => it.deptName).join()
          if (data.length && !/^[0-9,]+?/.test(ids)) {
            let val = data.map(it => it.id).join()
            this.$emit("change", val)
          }
        } else {
          this._defSelection = null
        }
      })
    },
    cellStyle({ row, columnIndex }) {
      // if (columnIndex == 3) {
      if (row.deptCategory == 1) {
        return { color: '#4ccc4f', fontWeight: columnIndex == 1 ? 'bold' : 'normal' }
      }
      if (row.deptCategory == 2) {
        return { color: '#5185d3' }
      }
      return { color: '#c8c562' }
      // }
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
.company-cell {
  color: red;
}
.dept-cell {
  color: darkcyan;
}
.group-cell {
  color: darkkhaki;
}
</style>
