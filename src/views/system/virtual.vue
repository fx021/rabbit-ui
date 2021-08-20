<template>
  <div class="container-wrapper">
    <split-horizontal>
      <template #left>
        <!-- Sidebar Start -->
        <el-button
          type="primary"
          size="small"
          style="margin-bottom: 10px"
          @click="handleAddNewVoClick"
        >添加
        </el-button>
        <el-dialog
          :title="currVoEdit.id ? '编辑' : '添加'"
          :visible.sync="voFormVisible"
          width="60%"
          append-to-body
          close-on-click-modal
          destroy-on-close
        >
          <add-vo-form :vo="currVoEdit" ref="addVoForm"/>
          <span slot="footer">
            <el-button type="primary" size="small" @click="handleSubmitVo">{{ $t("submitText") }}</el-button>
            <el-button @click="handleDeleteVo" v-show="currVoEdit.id" type="danger" size="small">删除</el-button>
            <el-button @click="handleVoEditCancel" size="small">{{ $t("cancelText") }}</el-button>
          </span>
        </el-dialog>
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          size="small"
          style="margin-bottom: 10px"
          clearablex
        ></el-input>
        <el-tree
          ref="tree"
          :data="filterVoDeptData"
          node-key="id"
          :props="deptTreeProps"
          empty-text="暂无虚拟组织架构"
          :highlight-current="true"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                v-show="data.id === currVo.id"
                size="mini"
                @click="handleEditVoClick(node, data)"
              >编辑</el-button>
            </span>
          </span>
        </el-tree>
        <!-- Sidebar End -->
      </template>
      <template #right>
        <!-- Main Start -->
        <!-- 编辑/查看组织 Start -->
        <el-form
          size="small"
          ref="form"
          label-width="90px"
          v-model="voDetailForm"
          :inline="false"
          disabled
        >
          <el-row>
            <el-col :span="8" :offset="0">
              <el-form-item label="组织名称">
                <el-input readonly v-model="voDetailForm.virtualorganizationName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="组织全称">
                <el-input v-model="voDetailForm.fullName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="领导" label-width="80px">
                <el-input v-model="voDetailForm.leaderName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 编辑/查看组织 End -->
        <el-divider direction="horizontal" content-position="left"></el-divider>
        <!-- 主表 Start -->
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="data"
          ref="crud"
          v-model="form"
          :permission="permissionList"
          :before-open="beforeOpen"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @tree-load="treeLoad"
        >
          <template #parentIdForm>
            <div>
              <el-popover placement="bottom" width="400" trigger="click">
                <avue-tree
                  :option="parentIdSelectTreeOption"
                  :data="parentIdSelectTreeData"
                  @node-click="handleSelectParentId"
                />
                <el-input readonly slot="reference" :value="form.parentName"></el-input>
              </el-popover>
            </div>
          </template>
          <template #leaderNameForm="{row,disabled}">
            <el-select
              v-model="row.leaderUserId"
              filterable
              remote
              :disabled="disabled"
              placeholder="请选择 领导"
              :remote-method="searchLeaderByLeaderId"
              :loading="leaderIdLoading">
              <el-option
                v-for="item in leaderUserSelectOptions"
                :key="item.account"
                :label="item.realName"
                :value="item.id">
                <span style="float: left">{{ item.realName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
              </el-option>
            </el-select>
          </template>

          <template slot="menuLeft">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              v-if="permission.dept_delete"
              @click="handleDelete"
            >删 除
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click.stop="handleAddClick(scope.row, scope.index)"
              v-if="userInfo.role_name.includes('admin')"
            >新增子项
            </el-button>
          </template>
          <template slot-scope="{ row }" slot="deptCategory">
            <el-tag>{{ row.deptCategoryName }}</el-tag>
          </template>
        </avue-crud>
        <!-- 主表 End -->
        <!-- Main End -->
      </template>
    </split-horizontal>
  </div>
</template>

<script>
import {
  getVirtualLazyTree,
  add,
  remove,
  getVirtualTopLevelList,
  getUserSelectList,
} from "@/api/system/virtualorganization";

import UserSelect from "./component/virtual/userSelect";
import AddVoForm from "./component/virtual/addVoForm";

import {mapGetters} from "vuex";
import {deepClone} from "@/util/util";
import {getList} from "@/api/system/user";
import SplitHorizontal from "@/components/SplitHorizontal/SplitHorizontal";

export default {
  data() {
    return {
      form: {},

      filterText: "",
      voDeptData: [],
      deptTreeProps: {
        label: "virtualorganizationName",
      },

      leaderIdLoading: false,
      leaderUserSelectOptions: [],

      voDetailForm: {
        virtualorganizationName: "",
        fullName: "",
        leaderName: "",
      },

      voFormVisible: false,
      // 正在编辑的虚拟组织架构
      currVoEdit: {},
      // 当前的虚拟组织架构
      currVo: {},

      selectionList: [],

      query: {},
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        lazy: true,
        tip: false,
        simplePage: true,
        searchShow: true,
        height: "auto",
        calcHeight: 95,
        searchMenuSpan: 6,
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        dialogClickModal: false,
        column: [
          {
            label: "组织名称",
            prop: "virtualorganizationName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入组织名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "组织全称",
            prop: "fullName",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入组织全称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上级角色",
            prop: "parentId",
            hide: true,
            formslot: true,
            rules: [
              {
                required: true,
                message: "请选择上级角色",
                trigger: "click",
              },
            ],
          },
          {
            label: "领导",
            prop: "leaderName",
            formslot: true,
            rules: [
              {
                required: true,
                message: "请选择领导",
                trigger: "blur",
              },
            ],
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
            align: "right",
            width: 80,
            rules: [
              {
                required: true,
                message: "请输入排序",
                trigger: "blur",
              },
            ],
          },
          {
            label: "备注",
            prop: "remark",
            rules: [
              {
                required: false,
                message: "请输入备注",
                trigger: "blur",
              },
            ],
            hide: true,
          },
        ],
      },
      data: [],

      // 选择父级 start
      parentIdSelectTreeOption: {
        nodeKey: "id",
        lazy: true,
        treeLoad: (node, resolve) => {
          if (node.level === 0) {
            resolve([this.currVo]);
            return;
          }

          getVirtualLazyTree(node.data.id).then((res) => {
            resolve(
              res.data.data.map((item) => {
                return {
                  ...item,
                  leaf: !item.hasChildren,
                };
              })
            );
          });
        },
        addBtn: false,
        menu: false,
        size: "small",
        props: {
          labelText: "标题",
          label: "virtualorganizationName",
          value: "value",
          children: "children",
        },
      },
      parentIdSelectTreeData: [],
      // 选择父级 end

    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.dept_add, false),
        viewBtn: this.vaildData(this.permission.dept_view, false),
        delBtn: this.vaildData(this.permission.dept_delete, false),
        editBtn: this.vaildData(this.permission.dept_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
    filterVoDeptData() {
      return this.voDeptData.filter((item) => {
        if (!item.fullName) {
          return false;
        }
        return item.fullName.includes(this.filterText);
      });
    },
  },
  created() {
    this.initTopLevelList();
  },
  methods: {
    searchLeaderByLeaderId(query) {
      this.leaderIdLoading = true;
      const queryRegExp = /[a-zA-Z0-9]+/
      clearTimeout(this.searchLeaderIdTimer);
      this.searchLeaderIdTimer = setTimeout(() => {
        query = query.trim();
        if (!queryRegExp.test(query)) {
          this.leaderUserSelectOptions = [];
          this.leaderIdLoading = false;
          return;
        }
        getList(1, 10, {
          account: query
        }).then(res => {
          this.leaderIdLoading = false;
          if (res.data.code !== 200) {
            this.$message.error("请求用户列表失败")
            this.leaderUserSelectOptions = [];
            return;
          }
          this.leaderUserSelectOptions = res.data.data.records;
        })
      }, 300)
    },
    initTopLevelList() {
      this.getVirtualTopLevelList().then((res) => {
        // 获取虚拟组织列表
        this.voDeptData = res.data.data;
      });
    },
    // 获取组织架构树
    loadVirtualTree(parentId, params = {}) {
      this.loading = true;
      getVirtualLazyTree(parentId, Object.assign(params, this.query)).then(
        (res) => {
          this.data = res.data.data;
          this.loading = false;
          this.selectionClear();
        }
      );
    },
    beforeOpen(done, type) {
      this.leaderUserSelectOptions = [{
        id: this.form.leaderUserId,
        realName: this.form.leaderName
      }]

      if (type === "add") {
        if (this.currVo.id) {
          this.$set(
            this.form,
            "parentName",
            this.currVo.virtualorganizationName
          );
          this.$set(this.form, "parentId", this.currVo.id);
          done();
          return;
        } else {
          this.$message.warning("请选择一个虚拟组织后进行添加");
          return;
        }
      }
      done();
    },

    handleAddClick(row) {
      this.$refs.crud.rowAdd();
      this.form.parentId = row.id;
      this.form.parentName = row.virtualorganizationName;
    },
    handleNodeClick(data) {
      this.currVo = data;
      this.query = {};
      this.voDetailForm = data;
      this.loadVirtualTree(this.currVo.id);
    },
    // 新增角色保存
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          // 获取新增数据的相关字段
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.data = [];
          this.loadVirtualTree(this.currVo.id);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      add(row).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.data = [];
          this.$refs.crud.refreshTable();
          this.loadVirtualTree(this.currVo.id);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    // 删除
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });

          // 刷新数据表并重载
          this.data = [];
          this.$refs.crud.refreshTable();
          this.loadVirtualTree(this.currVo.id);
          // 数据回调进行刷新
          done(row);
        });
    },
    // 多选删除
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          // 刷新表格数据并重载
          this.data = [];
          this.$refs.crud.refreshTable();
          this.loadVirtualTree(this.currVo.id);

          // 表格数据重载
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },

    handleSelectParentId(data) {
      this.form.parentId = data.id;
      this.form.parentName = data.virtualorganizationName;
    },
    searchReset() {
      this.query = {};
      this.loadVirtualTree(this.parentId);
    },
    searchChange(params, done) {
      this.query = params;
      if (!this.currVo.id) {
        this.$message.warning("请先选择一个组织");
        done();
        return;
      }
      this.loadVirtualTree(this.currVo.id, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.loadVirtualTree(this.currVo.id, this.query);
    },
    treeLoad(tree, treeNode, resolve) {
      const parentId = tree.id;
      getVirtualLazyTree(parentId).then((res) => {
        treeNode.children = [];
        resolve(res.data.data);
      });
    },
    // 获取虚拟组织架构
    getVirtualTopLevelList() {
      return new Promise((resolve) => {
        getVirtualTopLevelList().then((res) => {
          resolve(res);
        });
      });
    },

    // 获取用户选择列表
    getUserSelectList(masterId, current, size) {
      return new Promise((resolve) => {
        getUserSelectList(masterId, current, size).then((res) => {
          const {records, total} = res.data;
          this.selectLeaderTablePage.total = total;
          this.selectLeaderTableData = records;
          resolve(res);
        });
      });
    },

    // 打开添加虚拟组织架构的表单
    handleAddNewVoClick() {
      this.currVoEdit = {};
      this.voFormVisible = true;
    },

    // 点击编辑虚拟组织架构
    handleEditVoClick(node, data) {
      this.currVoEdit = deepClone(data);
      this.voFormVisible = true;
    },

    handleDeleteVo() {
      this.$confirm("此操作将永久删除该架构，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove(this.currVo.id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.voFormVisible = false;
            this.currVoEdit = {};
            this.initTopLevelList();
          });
        })
    },

    handleVoEditCancel() {
      this.voFormVisible = false;
      this.currVoEdit = {};
    },

    handleSubmitVo() {
      this.$refs.addVoForm.validate((vaild, done) => {
        if (vaild) {
          add(this.$refs.addVoForm.vo).then(() => {
            this.initTopLevelList();
            if (!this.currVoEdit.id) {
              this.$message.success("添加成功");
            } else {
              this.$message.success("修改成功");
            }
            this.voFormVisible = false;
            this.currVoEdit = {};
            done();
          });
        }
      })
    },
  },

  components: {
    UserSelect,
    AddVoForm,
    SplitHorizontal
  },
};
</script>

<style lang="scss" scoped>
.container-wrapper {
  font-size: 14px;
  height: calc(100% - 40px);

  .split-horizontal {
    height: 100%;

    .scroll-wrapper {
      height: 100%;
      overflow: auto;
    }
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.avue-tree {
  /deep/ .el-tree {
    max-height: 400px;
    overflow: auto;
  }
}

/deep/ .el-table {
  min-height: 160px;
}
</style>
