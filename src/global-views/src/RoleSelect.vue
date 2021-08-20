<template>
  <div class="select-wrapper">
    <el-input
      placeholder="选择角色"
      v-model="inputTxt"
      :class="['input-with-select', {'no-text': !showText}]"
      readonly
      :size="size"
      :disabled="disabled"
    >
      <el-button
        slot="append"
        icon="el-icon-paperclip"
        @click="showSelectDialog"
        :size="size"
        v-if="!readonly && !disabled"
      >{{showText?'请选择':''}}</el-button>
    </el-input>
    <el-dialog
      title="选择角色"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      @closed="onDialogClosed"
      append-to-body
    >
      <el-form :model="search" label-position="right" label-width="72px" ref="form" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input
                v-model="search.roleName"
                placeholder="请输入角色名称"
                clearable
                @keyup.enter.native="handlePageChange(1)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="别名">
              <el-input
                v-model="search.roleAlias"
                placeholder="请输入角色别名"
                clearable
                @keyup.enter.native="handlePageChange(1)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              style="margin:0 24px"
              size="mini"
              @click="handlePageChange(1)"
            >查询</el-button>
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
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :select-on-indeterminate="limit==0"
        :indent="8"
        default-expand-all
        stripe
        border
      >
        <el-table-column type="selection" width="30" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色别名" prop="roleAlias" show-overflow-tooltip></el-table-column>
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
export default {//角色选择
  name: 'RoleSelect',
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
        this.handlePageChange(1)
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
        text += item.roleName
        if (result != '') {
          result += ','
        }
        result += item.id
      }
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
    handlePageChange() {
      this.loading = true
      const params = {
        // current: page,
        // size: 10
      }
      if (this.search.roleName) {
        params.roleName = this.search.roleName
      }
      if (this.search.roleAlias) {
        params.roleAlias = this.search.roleAlias
      }
      this.$axios.get('/api/rabbit-system/role/list', {
        params: params
      }).then(res => {
        let data = res.data.data || []
        this.checkDataSelected()
        this.listData = data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getDefaultSelectList(ids) {
      this.$axios.get("/api/rabbit-system/role/select-ids", {
        params: { ids }
      }).then(res => {
        let data = res.data.data
        if (data) {
          this._defSelection = data
          this.lastSelection = this.deepClone(data)
          if (this.listData.length > 0) {
            this.checkDataSelected(this.listData)
          }
          this.inputTxt = data.map(it => it.roleName).join()
          if (data.length && !/^[0-9,]+?/.test(ids)) {
            let val = data.map(it => it.id).join()
            this.$emit("change", val)
          }
        } else {
          this._defSelection = null
        }
      })
    },
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
