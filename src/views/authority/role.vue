<template>
  <basic-container>
    <avue-crud
      :page.sync="page"
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @tree-load="treeLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="permission.role_delete"
          plain
          @click="handleDelete"
        >删 除</el-button>
        <el-button
          size="small"
          icon="el-icon-setting"
          @click="handleRole"
          v-if="userInfo.role_name.includes('admin')"
          plain
        >权限设置</el-button>
      </template>
    </avue-crud>
    <el-dialog title="角色权限配置" append-to-body :visible.sync="box" width="460px">
      <el-tabs type="border-card">
        <el-tab-pane label="菜单权限">
          <!-- 树形控件 -->
          <el-tree
            :data="menuGrantList"
            show-checkbox
            node-key="id"
            ref="treeMenu"
            :check-strictly="checkIng"
            :default-checked-keys="menuTreeObj"
            :props="props"
          ></el-tree>
        </el-tab-pane>
        <el-tab-pane label="数据权限">
          <el-tree
            :data="dataScopeGrantList"
            show-checkbox
            node-key="id"
            ref="treeDataScope"
            :check-strictly="checkIng"
            :default-checked-keys="dataScopeTreeObj"
            :props="props"
          ></el-tree>
        </el-tab-pane>
        <el-tab-pane label="接口权限">
          <el-tree
            :data="apiScopeGrantList"
            show-checkbox
            node-key="id"
            ref="treeApiScope"
            :check-strictly="checkIng"
            :default-checked-keys="apiScopeTreeObj"
            :props="props"
          ></el-tree>
        </el-tab-pane>
        <el-tab-pane label="所有分管公司">
          <el-tree
            :data="deptScopeGrantList"
            show-checkbox
            node-key="id"
            ref="deptScopeData"
            :check-strictly="checkIng"
            :default-checked-keys="deptScopeTreeObj"
            :props="props"
          ></el-tree>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  add,
  getList,
  getRole,
  getRoleTree,
  grant,
  grantTree,
  remove,
  update,
} from "@/api/system/role";
import { mapGetters } from "vuex";
import website from "@/config/website";

export default {
  data() {
    return {
      // 方法
      form: {},
      // 显示的数据
      data: [],
      // 关闭权限对话框
      box: false,
      checkIng: false,
      // 关联的数据
      props: {
        label: "title",
        value: "key",
      },
      // 菜单权限的数据
      menuGrantList: [],
      // 数据权限的数据
      dataScopeGrantList: [],
      // 接口权限的数据
      apiScopeGrantList: [],
      // 所有分管公司
      deptScopeTreeObj: [],
      // 所有分管公司
      deptScopeGrantList: [],
      // 菜单权限的勾选数组
      menuTreeObj: [],
      // 数据权限
      dataScopeTreeObj: [],
      // 接口权限
      apiScopeTreeObj: [],
      //  菜单权限	行可勾选
      selectionList: [],
      query: {},
      // 表格等待框的控制
      loading: true,
      apiGrantList: [],
      // 分页的变量
      page: {
        // 每页显示多少条
        pageSize: 10,
        // 当前页
        currentPage: 1,
        // 总条数,如果为0的话不显示分页
        total: 0,
      },
      // 组件配置属性
      option: {
        lazy: true,
        // 取消表格上方显示的tag
        tip: false,
        simplePage: true,
        // 首次加载是否显示搜索
        searchShow: true,
        // 可以控制搜索按钮的长度使其可以单独成行
        searchMenuSpan: 6,
        tree: true,
        // 显示表格边框并可以控制表格边框
        border: true,
        // 显示表格序号
        index: true,
        /*设selection属性为true 就成多选；
        勾选的同时会回调selectionChange方法返回当前选中的数据,
        setCurrent方法设置选中的行,selectable函数决定该行是否可以勾选,
        设置reserveSelection为true保留之前的勾选；
        设置tip为false可以取消表格上方显示的tag */
        selection: true,
        // 显示查看按钮
        viewBtn: true,
        // 表格列居中
        align: "center",
        // 表格按钮居中
        menuAlign: "center",
        dialogWidth: 900,
        height: 'auto',
        calcHeight: 40,
        // 点击空白处不关闭对话框
        dialogClickModal: false,
        column: [
          {
            label: "角色名称",
            prop: "roleName",
            align: "left",
            // 相应的搜索框 , 只要有一个, 就有搜索按钮
            search: true,
            // 搜索框的宽度
            // searchSpan: 1,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入角色名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "所属租户",
            prop: "tenantId",
            type: "tree",
            dicUrl: "/api/rabbit-system/tenant/select",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: website.tenantMode,
            span: 24,
            props: {
              label: "tenantName",
              value: "tenantId",
            },
            hide: !website.tenantMode,
            search: website.tenantMode,
            rules: [
              {
                required: true,
                message: "请输入所属租户",
                trigger: "click",
              },
            ],
          },
          {
            // 新增只读
            // addDisabled: true,
            // 编辑的时候只读
            editDetail: true,
            label: "角色别名",
            prop: "roleAlias",
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入角色别名",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上级角色",
            prop: "parentId",
            dicData: [],
            type: "tree",
            // 隐藏
            hide: true,
            span: 24,
            props: {
              label: "title",
            },
            rules: [
              {
                required: false,
                message: "请选择上级角色",
                trigger: "click",
              },
            ],
          },
          {
            label: "角色排序",
            prop: "sort",
            type: "number",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入角色排序",
                trigger: "blur",
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.role_add, false),
        viewBtn: this.vaildData(this.permission.role_view, false),
        delBtn: this.vaildData(this.permission.role_delete, false),
        editBtn: this.vaildData(this.permission.role_edit, false),
      };
    },
    // 勾选的数据接口
    ids() {
      let ids = [];
      // forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
    // 对话框里面的勾选的数据
    idsArray() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids;
    },
  },
  methods: {
    // 初始化数据
    initData() {
      getRoleTree().then((res) => {
        // 获取上级角色
        const column = this.findObject(this.option.column, "parentId");
        column.dicData = res.data.data;
      });
    },
    // 权限设置确定按钮
    submit() {
      // 获取菜单权限的数据
      const menuList = this.$refs.treeMenu.getCheckedNodes(false, true).map(data => data.id);
      // 获取数据权限的数据
      const dataScopeList = this.$refs.treeDataScope.getCheckedKeys();
      // 获取接口权限的数据
      const apiScopeList = this.$refs.treeApiScope.getCheckedKeys();
      // 所有公司树
      const deptScopeList = this.$refs.deptScopeData.getCheckedKeys();
      // 数据保存接口
      grant(
        this.idsArray,
        menuList,
        dataScopeList,
        apiScopeList,
        deptScopeList
      ).then(() => {
        this.box = false;
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        // 重新加载网页
        this.onLoad(this.page);
      });
    },

    // 点击保存按钮 表单保存调用
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          // 刷新页面
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 关闭对话框
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    // 编辑数据后确定触发该事件
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    // 点击行删除按钮
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 根据id删除
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    // 搜索重置
    searchReset() {
      this.query = {};
      // 重新刷新页面
      this.onLoad(this.page);
    },
    // 点击搜索 点击搜索后触发该事件
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      // 刷新页面显示要搜索的数据
      this.onLoad(this.page, params);
      // 结束事件
      done();
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(list) {
      this.selectionList = list;
    },
    // 清除选择
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    // 权限设置
    handleRole() {
      if (this.selectionList.length !== 1) {
        this.$message.warning("只能选择一条数据");
        return;
      }
      this.menuTreeObj = [];
      this.dataScopeTreeObj = [];
      this.apiScopeTreeObj = [];
      this.deptScopeTreeObj = [];
      // 请求权限数据
      grantTree().then((res) => {
        // 菜单权限数据
        this.menuGrantList = res.data.data.menu;
        // 数据权限
        this.dataScopeGrantList = res.data.data.dataScope;
        // 接口权限
        this.apiScopeGrantList = res.data.data.apiScope;
        // 所有分管公司
        this.deptScopeGrantList = res.data.data.deptScope;
        // 被勾选的权限数据
        getRole(this.ids).then((res) => {
          this.checkIng = true
          // 菜单权限数据勾选数据ID
          this.menuTreeObj = res.data.data.menu;
          // 数据权限被勾选的数据ID
          this.dataScopeTreeObj = res.data.data.dataScope;
          // 接口权限被勾选的数据ID
          this.apiScopeTreeObj = res.data.data.apiScope;
          // 分管公司被勾选的数据ID
          this.deptScopeTreeObj = res.data.data.deptScope;
          // 打开权限设置对话框
          this.box = true;
          this.$nextTick(() => {
            this.checkIng = false
          })
        });
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
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    // 现在的变化
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    // 尺寸变化
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    // 刷新更改
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    treeLoad(tree, treeNode, resolve) {
      resolve(tree._children);
    },
    // 首次加载调用on-load方法加载数据
    onLoad(page, params = {}) {
      this.loading = true;

      this.initData();
      /**
       * 排序
       * @param {Array} tree
       * @returns {Array}
       */
      const soft = function (tree) {
        tree.forEach(item => {
          if (item.children) {
            item.children = soft(item.children)
          }
        })
        return tree.sort((a, b) => a.sort - b.sort)
      }

      const formatTree = function (tree) {
        tree.forEach(item => {
          if (item.children) {
            item.children = formatTree(item.children)
          }
        })
        return tree.map(item => {
          const _children = item.children;
          return {
            ...item,
            children: [],
            _children,
            hasChildren: Boolean(_children && _children.length > 0)
          }
        });
      }
      getList(
        // 当前页数
        page.currentPage,
        // 	每页显示条目个数
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        let { data } = res.data;
        this.data = [];
        this.$nextTick(() => {
          this.data = formatTree(soft(data));
        })
        this.loading = false;
        this.selectionClear();
      }).catch(() => {
        this.loading = false
      })
    },
  },
};
</script>
