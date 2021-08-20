<template>
  <div class="select-wrapper">
    <el-input
      placeholder="选择岗位"
      v-model="inputTxt"
      :class="['input-with-select', {'no-text': !showText}]"
      readonly
      :size="size"
      :disabled="disabled"
    >
      <el-button
        slot="append"
        icon="el-icon-collection-tag"
        @click="showSelectDialog"
        :size="size"
        v-if="!readonly && !disabled"
      >{{showText?'请选择':''}}</el-button>
    </el-input>
    <el-dialog
      title="选择岗位"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      @closed="onDialogClosed"
      append-to-body
    >
      <el-form :model="search" label-position="right" label-width="72px" ref="form" size="small">
        <el-row>
          <el-col :span="7">
            <el-form-item label="名称">
              <el-input
                v-model="search.postName"
                placeholder="请输入岗位名称"
                class="row-input"
                clearable
                @keyup.enter.native="handlePageChange(1,true)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="编号">
              <el-input
                v-model="search.postCode"
                placeholder="请输入岗位编号"
                clearable
                @keyup.enter.native="handlePageChange(1,true)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="类型">
              <el-select v-model="search.category" placeholder="岗位类型">
                <el-option
                  :label="item.dictValue"
                  :value="item.dictKey"
                  v-for="item in categoryList"
                  :key="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button
              type="primary"
              style="margin-left:24px"
              size="mini"
              @click="handlePageChange(1,true)"
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
        row-key="id"
        ref="table"
        size="small"
        stripe
        border
        :select-on-indeterminate="limit==0"
        v-loading="userLoading"
      >
        <el-table-column type="selection" width="30" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="名称" prop="postName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="编号" prop="postCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" prop="categoryName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="select-footer">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="10"
          :current-page.sync="current"
          @current-change="handlePageChange"
        ></el-pagination>
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
export default {//岗位选择
  name: 'PostSelect',
  mixins: [selector()],
  data: () => {
    return {
      inputTxt: '',
      visible: false,
      total: 0,
      current: 1,
      search: {},
      listData: [],
      userLoading: false,
      hasChange: false,
      lastSelection: [],
      categoryList: []
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
      if (this.categoryList.length == 0) {
        this.$axios.get("/api/rabbit-system/dict/dictionary?code=post_category")
          .then(res => {
            if (res.data.data) {
              this.categoryList = res.data.data
            }
          })
      }
      this.visible = true
    },
    onConfirm() {
      // console.log("selection", this.$refs.table.selection)
      let selection = this.$refs.table.selection || []
      if (this.required && selection.length == 0) {
        this.$message.warning('请选择用户')
        return
      }
      let text = ''
      let result = ''
      for (let item of selection) {
        if (text != '') {
          text += ','
        }
        text += item.postName
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
    handlePageChange(page) {
      this.userLoading = true
      const params = {
        current: page || 1,
        size: 10
      }
      if (this.current != params.current) {
        this.current = params.current;
      }
      if (this.search.postName) {
        params.postName = this.search.postName
      }
      if (this.search.postCode) {
        params.postCode = this.search.postCode
      }
      if (this.search.category) {
        params.category = this.search.category
      }
      this.$axios.get('/api/rabbit-system/post/list', {
        params: params
      }).then(res => {
        if (res.data && res.data.data) {
          if (this._defSelection) {//可以少计算
            this.$refs.table.store.states.selection = this._defSelection
            this._defSelection = null
          }
          let data = res.data.data
          this.listData = data.records || []
          this.total = data.total
        }
        this.userLoading = false
      }).catch(() => {
        this.userLoading = false
      })
    },
    getDefaultSelectList(ids) {
      this.$axios.get("/api/rabbit-system/post/select-ids", {
        params: { ids }
      }).then(res => {
        let data = res.data.data
        if (data) {
          this._defSelection = data
          this.lastSelection = this.deepClone(data)
          if (this.listData.length > 0) {
            this.checkPageSelected()
          }
          this.inputTxt = data.map(it => it.postName).join()
          if (data.length && !/^[0-9,]+?/.test(ids)) {
            let val = data.map(it => it.id).join()
            this.$emit("change", val)
          }
        } else {
          this._defSelection = null
        }
      })
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
</style>
