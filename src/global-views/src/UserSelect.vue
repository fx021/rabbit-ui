<template>
  <div class="select-wrapper">
    <el-input
      placeholder="选择用户"
      v-model="inputTxt"
      :class="['input-with-select', {'no-text': !showText}]"
      readonly
      :disabled="disabled"
      v-if="!btnOption"
      :size="size"
    >
      <el-button
        slot="append"
        icon="el-icon-user"
        @click="showSelectDialog"
        :size="size"
        v-if="!readonly && !disabled"
      >{{showText?'请选择':''}}</el-button>
    </el-input>
    <el-button v-bind="btnOption" v-else @click="showSelectDialog">{{btnOption.text||'选择人员'}}</el-button>
    <el-dialog
      title="选择用户"
      :visible.sync="visible"
      width="80%"
      :close-on-click-modal="false"
      @closed="onDialogClosed"
      append-to-body
    >
      <el-form :model="search" label-position="right" label-width="72px" ref="form" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户名">
              <el-input
                v-model="search.realName"
                placeholder="请输入用户名"
                class="row-input"
                clearable
                @keyup.enter.native="handlePageChange(1,true)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号">
              <el-input
                v-model="search.code"
                placeholder="请输入工号"
                clearable
                @keyup.enter.native="handlePageChange(1,true)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="部门">
              <el-cascader
                placeholder="选择部门"
                :options="deptList"
                filterable
                v-model="deptArray"
                :props="casProps"
                collapse-tags
                clearable
                ref="dept"
                @change="onDeptChange"
                :show-all-levels="false"
                @visible-change="onVisibleChange"
                style="width:100%"
              >
                <template slot-scope="{ data }">
                  <span>
                    {{ data.deptName }}
                    <span
                      style="color:#b9cdeb;font-size:12px"
                    >{{data.deptCategoryName}}</span>
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button
              type="primary"
              style="margin-left:24px"
              size="mini"
              @click="handlePageChange(1,true)"
            >查询</el-button>
            <el-button type="text" @click="arrowDown=!arrowDown">
              {{arrowDown?'收起':'展开'}}
              <i
                :class="[arrowDown?'el-icon-arrow-down':'el-icon-arrow-up']"
              ></i>
            </el-button>
          </el-col>
        </el-row>
        <transition name="el-zoom-in-top">
          <el-row v-show="arrowDown">
            <el-col :span="6">
              <el-form-item label="岗位">
                <el-select
                  v-model="postArray"
                  filterable
                  remote
                  multiple
                  clearable
                  placeholder="岗位编号或名称"
                  :remote-method="loadPostList"
                  :loading="postLoading"
                  ref="postSelect"
                  collapse-tags
                  style="width:100%"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in postList"
                    :key="item.id"
                    :label="item.postName"
                    :value="item.id"
                  >
                    <span>
                      {{ item.postName}}
                      <span
                        style="color: #8492a6; font-size: 13px"
                        v-if="item.postCode"
                      >{{ `（${item.postCode}）` }}</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="角色">
                <el-select
                  v-model="roleArray"
                  multiple
                  filterable
                  remote
                  collapse-tags
                  clearable
                  placeholder="角色名称或别名"
                  :remote-method="loadRoleList"
                  :loading="roleLoading"
                  :popper-append-to-body="false"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                  >
                    <span>
                      {{ item.roleName }}
                      <span
                        style="color: #8492a6; font-size: 13px"
                        v-if="item.roleAlias"
                      >{{ `（${item.roleAlias}）` }}</span>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="手机号">
                <el-input
                  v-model="search.phone"
                  placeholder="请输入手机号"
                  clearable
                  @keyup.enter.native="handlePageChange(1,true)"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </transition>
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
        <el-table-column label="用户名" prop="realName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门" prop="deptName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="岗位" prop="postName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色/职务" prop="roleName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="工号" prop="code" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机号" prop="phone" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="select-footer">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="current"
          @current-change="handlePageChange"
        ></el-pagination>
        <div class="footer-btn">
          <el-button type="warning" plain @click="clearSelected">清空选择</el-button>
          <el-button @click="visible=false">取消</el-button>
          <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
      </div>
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
import selector from './selector'
export default {//选人
  name: 'UserSelect',
  mixins: [selector()],
  props: {
    btnOption: Object
  },
  data: () => {
    return {
      inputTxt: '',
      visible: false,
      total: 0,
      current: 1,
      search: {},
      listData: [],
      arrowDown: false,
      userLoading: false,
      deptArray: [],
      postArray: [],
      roleArray: [],
      infoFlag: 0,
      deptList: [],
      postList: [],
      roleList: [],
      postLoading: false,
      roleLoading: false,
      hasChange: false,
      pageSize: 10,
      lastSelection: [],
      casProps: {
        // expandTrigger: 'hover',
        label: 'deptName',
        value: 'id',
        lazy: true,
        multiple: false,//改为单选,能查询子级,减少复杂度
        emitPath: false,
        checkStrictly: true,
      }
    }
  },
  created() {
    this.casProps.lazyLoad = (node, resolve) => {
      // console.log("lazyLoad", node)
      if (!node || !node.data) return
      this._currentLevel = node.level
      this.loadDeptList(node, resolve)
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
      if (this.deptList.length == 0) {
        this.loadDeptList(0)
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
      this._updateValue = true
      let text = ''
      let result = ''
      for (let item of selection) {
        if (text != '') {
          text += ','
          result += ','
        }
        text += item.realName
        result += item.id
      }
      this.inputTxt = text
      this.lastSelection = selection.length ? this.deepClone(selection) : []
      if (this.step === 1) {
        this.$emit('select', this.lastSelection)
      }
      this.$emit('change', result ? result : null)
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
      if (Array.isArray(this.deptArray) && this.deptArray.length) {
        params.deptId = this.deptArray.join()
      } else {
        params.deptId = this.deptArray || null
      }
      if (this.postArray && this.postArray.length) {
        params.postId = this.postArray.join()
      }
      if (this.roleArray && this.roleArray.length) {
        params.roleId = this.roleArray.join()
      }
      if (this.search.realName) {
        params.realName = this.search.realName
      }
      if (this.search.phone) {
        params.phone = this.search.phone
      }
      if (this.search.code) {
        params.code = this.search.code
      }
      this.$axios.get('/api/rabbit-user/select', {
        params: params
      }).then(res => {
        if (res.data && res.data.data) {
          if (this._defSelection) {//可以少计算
            this.$refs.table.store.states.selection = this._defSelection
            this._defSelection = null
          }
          let data = res.data.data
          this.listData = data.records || []
          if (params.current === 1) {
            this.total = data.total
          }
          if (this.listData.length > 10) {
            this.pageSize = this.listData.length
          } else {
            this.pageSize = 10
          }
        }
        this.userLoading = false
      }).catch(() => {
        this.userLoading = false
      })
    },
    getDefaultSelectList(ids) {
      this.$axios.get('/api/rabbit-user/select-ids', {
        params: { ids }
      }).then(res => {
        let data = res.data.data
        if (data) {
          this._defSelection = data
          this.lastSelection = this.deepClone(data)
          if (this.listData.length > 0) {
            this.checkPageSelected()
          }
          this.inputTxt = data.map(it => it.realName).join()
          if (this.step === 1) {
            this.$emit('select', this.lastSelection, 1)
          }
          if (data.length && !/^[0-9,]+?/.test(ids)) {
            let val = data.map(it => it.id).join()
            this.$emit("change", val)
          }
        } else {
          this._defSelection = null
        }
      })
    },
    loadDeptList(node, resolve) {
      const loadChild = typeof resolve == "function"
      this.$axios.get('/api/rabbit-system/dept/select-list', {
        params: { parentId: loadChild ? node.data.id : node }
      }).then(res => {
        let data = res.data.data || []
        if (loadChild) {
          resolve(data)
        } else {
          this.deptList = data
        }
      }).catch(() => {
        if (loadChild) {
          resolve([])
        }
      })
    },
    loadPostList(query) {
      if (query) {
        this.postLoading = true
        this.$axios.get('/api/rabbit-system/post/search', {
          params: {
            name: query
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.postList = res.data.data || []
          }
          this.postLoading = false
        }).catch(() => {
          this.postLoading = false
        })
      }
    },
    loadRoleList(query) {
      if (query) {
        this.roleLoading = true
        this.$axios.get('/api/rabbit-system/role/search', {
          params: {
            name: query
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.roleList = res.data.data || []
          }
          this.roleLoading = false
        }).catch(() => {
          this.roleLoading = false
        })
      }
    },
    onDeptChange() {
      this.$refs.dept.toggleDropDownVisible(false)
      this.handlePageChange(1)
    },
    onVisibleChange(visible) {
      // console.log("onVisibleChange " + visible)
      if (visible && this._currentLevel === undefined && this.deptList.length > 0) {
        this.$nextTick(() => {//el-scrollbar__view el-cascader-menu__list
          document.querySelector(".el-cascader-menu__list .el-cascader-node").click()
        })
      }
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
