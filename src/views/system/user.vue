<template>
  <div class="container-wrapper">
    <split-horizontal>
      <template #left>
        <div class="scroll-wrapper">
          <el-collapse v-model="activeCollapse">
            <el-collapse-item title="行政组织架构" name="1">
              <avue-tree
                :option="treeOption"
                :data="treeData"
                @node-click="nodeClick"
                accordion
                ref="normalTree"
              />
            </el-collapse-item>
            <el-collapse-item title="虚拟组织架构" name="2">
              <avue-tree
                :option="voTreeOption"
                :data="voTreeData"
                @node-click="voNodeClick"
                accordion
                ref="voTree"
              />
            </el-collapse-item>
          </el-collapse>
        </div>
      </template>
      <!-- avue 表格 -->
      <template #right>
        <!-- 行政组织架构表格 -->
        <avue-crud
          v-if="!voMode"
          :option="normalTableOption"
          :search.sync="search"
          :table-loading="loading"
          :data="data"
          ref="normalCrud"
          v-model="form"
          :permission="permissionList"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          :before-open="beforeOpen"
          :before-close="beforeClose"
          :page.sync="page"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              v-if="permission.user_delete"
              @click="handleAdd"
            >新增
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              icon="el-icon-delete"
              v-if="permission.user_delete"
              @click="handleDelete"
            >删 除
            </el-button>
            <el-button
              type="info"
              size="small"
              plain
              v-if="permission.user_role"
              icon="el-icon-user"
              @click="handleGrant"
            >角色配置
            </el-button>
            <el-button
              size="small"
              plain
              v-if="permission.user_reset && !voMode"
              icon="el-icon-refresh"
              @click="handleReset"
            >密码重置
            </el-button>
            <el-button
              type="success"
              size="small"
              plain
              v-if="userInfo.role_name.includes('admin')"
              icon="el-icon-upload2"
              @click="handleImport"
            >导入
            </el-button>
            <el-button
              type="warning"
              size="small"
              plain
              v-if="userInfo.role_name.includes('admin')"
              icon="el-icon-upload2"
              @click="handleExport"
            >导出
            </el-button>
          </template>
          <template slot-scope="{ row }" slot="tenantName">
            <el-tag>{{ row.tenantName }}</el-tag>
          </template>
          <template slot-scope="{ row }" slot="roleName">
            <el-tag>{{ row.roleName }}</el-tag>
          </template>
          <template #roleIdForm="{row}">
            <input-tree
              placeholder="请选择角色"
              style="width: 100%"
              :data="roleTreeDic"
              multiple
              filter
              check-strictly
              v-model="row.roleId"
              :props="roleSelectTreeProps"
            ></input-tree>
          </template>
          <template #deptIdForm="{row}">
            <input-tree
              placeholder="请选择 部门"
              style="width: 100%"
              :data="normalDeptTreeDic"
              filter
              v-model="row.deptId"
              :props="normalDeptSelectTreeProps"
            ></input-tree>
          </template>
          <template slot-scope="{ row }" slot="deptName">
            <el-tag>{{ row.deptName }}</el-tag>
          </template>
          <template slot-scope="{ row }" slot="masterName">
            <el-tag>{{ row.masterName }}</el-tag>
          </template>
          <template slot="masterIdForm">
            <div>
              <el-popover placement="bottom" width="400" trigger="click">
                <avue-tree :option="masterIdSelectTreeOption" @node-click="handleSelectMasterId"/>
                <el-input readonly slot="reference" :value="form.masterName"></el-input>
              </el-popover>
            </div>
          </template>
          <template #staffIdForm="{disabled}">
            <el-select
              v-model="form.staffId"
              filterable
              remote
              :disabled="disabled"
              reserve-keyword
              placeholder="请输入 员工工号"
              @change="handleStaffCodeChange"
              :remote-method="searchStaffByCode"
              :loading="staffCodeLoading"
            >
              <el-option
                v-for="item in staffCodeOptions"
                :key="item.staffId"
                :label="item.staffId"
                :value="item.staffId"
              >
                <span style="float: left">{{ item.staffId }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </template>
        </avue-crud>
        <!-- 虚拟组织架构表格 -->
        <avue-crud
          v-else
          :option="voTableOption"
          :search.sync="search"
          :table-loading="loading"
          :data="data"
          ref="voCrud"
          v-model="form"
          :permission="permissionList"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          :before-open="beforeOpen"
          :before-close="beforeClose"
          :page.sync="page"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <!--菜单-->
          <template slot="menuLeft">
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              v-if="permission.user_delete"
              @click="handleAdd"
            >新增
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              icon="el-icon-delete"
              v-if="permission.user_delete"
              @click="handleDelete"
            >删 除
            </el-button>
          </template>
          <template slot-scope="{ row }" slot="tenantName">
            <el-tag>{{ row.tenantName }}</el-tag>
          </template>
          <template slot-scope="{ row }" slot="roleId">
            <el-tag>{{ row.roleName }}</el-tag>
          </template>
          <template slot-scope="{ row }" slot="deptId">
            <el-tag>{{ row.deptName }}</el-tag>
          </template>
          <template slot-scope="{ row }" slot="masterId">
            <el-tag>{{ row.masterName }}</el-tag>
          </template>
          <template slot="masterIdForm" slot-scope="{ row }">
            <div>
              <el-popover placement="bottom" width="400" trigger="click">
                <avue-tree :option="masterIdSelectTreeOption" @node-click="handleSelectMasterId"/>
                <el-input readonly slot="reference" :value="form.masterName"></el-input>
              </el-popover>
            </div>
          </template>
          <template #roleIdForm="{ row }">
            <avue-input-tree
              :check-strictly="true"
              multiple
              v-model="row.roleId"
              :expandOnClickNode="false"
              :auto-expand-parent="false"
              placeholder="请选择角色"
              type="tree"
              :dic="roleTreeDic"
              :props="roleSelectTreeProps"
            ></avue-input-tree>
          </template>
        </avue-crud>
        <!-- 虚拟组织架构 添加用户 -->
        <el-dialog
          title="添加用户"
          append-to-body
          :visible.sync="addUserDialogVisible"
          width="60%"
          :before-close="handleUserDialogClose"
        >
          <avue-crud
            :data="addUserTableData"
            :option="addUserTableOption"
            :page.sync="addUserTablePage"
            @on-load="onAddUserTableLoad"
            @selection-change="handleAddUserSelectionChange"
            @search-change="userSearchChange"
            @search-reset="userSearchReset"
            @refresh-change="handleAddUserRefreshChange"
            ref="userSelectCrud"
            :table-loading="addUserTableLoading"
          >
            <template #role="{ row }">
              <avue-input-tree
                :check-strictly="true"
                multiple
                v-model="roleCache[row.id]"
                placeholder="请选择添加时指定的角色"
                type="tree"
                :dic="roleTreeDic"
                :disabled="row.isChoice === 1"
                :props="roleSelectTreeProps"
              ></avue-input-tree>
            </template>
          </avue-crud>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleAddUser">添 加</el-button>
            <el-button @click="handleAddUserCancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 用户角色配置 -->
        <el-dialog title="用户角色配置" append-to-body :visible.sync="roleBox" width="345px">
          <el-tree
            :data="roleGrantList"
            show-checkbox
            check-strictly
            default-expand-all
            node-key="id"
            ref="treeRole"
            :default-checked-keys="roleTreeObj"
            :props="props"
          ></el-tree>

          <span slot="footer" class="dialog-footer">
            <el-button @click="roleBox = false">取 消</el-button>
            <el-button type="primary" @click="submitRole">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 用户导入 -->
        <el-dialog title="用户数据导入" append-to-body :visible.sync="excelBox" width="555px">
          <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
            <template slot="excelTemplate">
              <el-button type="primary" @click="handleTemplate">
                点击下载
                <i class="el-icon-download el-icon--right"></i>
              </el-button>
            </template>
          </avue-form>
        </el-dialog>
      </template>
    </split-horizontal>
  </div>
</template>

<script>
import InputTree from "@/components/InputTree/InputTree";
import {
  getList,
  getUser,
  remove,
  update,
  add,
  grant,
  resetPassword,
} from "@/api/system/user";

import {getDeptTree, getDeptLazyTree} from "@/api/system/dept";
import {
  getVirtualLazyTree,
  getVirtualUserPage,
  getUserSelectList,
  delVirtualOrganizationUser,
  addVirtualOrganizationUser,
  updateUser,
} from "@/api/system/virtualorganization";

import {getRoleTree} from "@/api/system/role";
import {getPostList} from "@/api/system/post";
import {getList as getStaffList} from "@/api/system/staff";
import {mapGetters} from "vuex";
import website from "@/config/website";
import {getToken} from "@/util/auth";
import SplitHorizontal from "@/components/SplitHorizontal/SplitHorizontal";


const option = {
  height: "auto",
  addBtn: false,
  calcHeight: 120,
  tip: false,
  searchShow: true,
  searchMenuSpan: 6,
  border: true,
  index: true,
  selection: true,
  viewBtn: true,
  //dialogType: 'drawer',
  // 点击空白不关闭弹窗
  dialogClickModal: false
}

export default {
  components: {
    InputTree, SplitHorizontal
  },
  data() {
    const validatePass = (_rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validatePass2 = (_rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        deptId: ""
      },
      search: {},

      // 是否在操作虚拟组织架构
      voMode: false,

      activeCollapse: ["1"],

      addUserDialogVisible: false,

      // 是否手动输入过 realName，手动输入后员工工号修改不影响 realName
      realNameLock: false,

      roleBox: false,
      excelBox: false,
      roleTreeDic: [],
      initFlag: true,
      selectionList: [],
      query: {},
      loading: true,
      page: {
        // 每页显示条目个数
        pageSize: 10,
        // 当前页数
        currentPage: 1,
        // 总条数,如果为0的话不显示分页
        total: 0,
      },

      addUserTablePage: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20, 50, 100],
        total: 0,
      },
      // 准备添加的用户列表
      userSelectedList: [],
      // 添加用户列表缓存的角色选择
      roleCache: {},

      init: {
        roleTree: [],
        deptTree: [],
      },
      props: {
        label: "title",
        value: "key",
      },
      roleGrantList: [],
      roleTreeObj: [],
      // 侧边栏 Start
      // 行政组织架构
      treeDeptId: "",

      // -------------- 行政组织架构 -------------
      currNormalNode: {},
      // 行政组织架构表格 配置
      normalTableOption: {
        ...option,
        column: [
          {
            label: "登录账号",
            prop: "account",
            search: true,
            display: false,
          },
          {
            label: "用户姓名",
            prop: "realName",
            search: true,
            display: false,
          },
          {
            label: "所属角色",
            prop: "roleName",
            slot: true,
            display: false,
          },
          {
            label: "所属部门",
            prop: "deptName",
            slot: true,
            display: false,
          },
        ],
        group: [
          {
            arrow: false,
            label: "基础信息",
            prop: "baseInfo",
            icon: "el-icon-user-solid",
            column: [
              {
                label: "登录账号",
                prop: "account",
                rules: [
                  {
                    required: true,
                    message: "请输入登录账号",
                    trigger: "blur",
                  },
                ],
                span: website.tenantMode ? 12 : 24,
              },
              {
                label: "所属租户",
                prop: "tenantId",
                type: "tree",
                dicUrl: "/api/rabbit-system/tenant/select",
                props: {
                  label: "tenantName",
                  value: "tenantId",
                },
                hide: !website.tenantMode,
                addDisplay: website.tenantMode,
                editDisplay: website.tenantMode,
                viewDisplay: website.tenantMode,
                rules: [
                  {
                    required: true,
                    message: "请输入所属租户",
                    trigger: "click",
                  },
                ],
              },
              {
                label: "密码",
                prop: "password",
                hide: true,
                editDisplay: false,
                viewDisplay: false,
                rules: [
                  {required: true, validator: validatePass, trigger: "blur"},
                ],
              },
              {
                label: "确认密码",
                prop: "password2",
                hide: true,
                editDisplay: false,
                viewDisplay: false,
                rules: [
                  {required: true, validator: validatePass2, trigger: "blur"},
                ],
              },
            ],
          },
          {
            arrow: false,
            label: "详细信息",
            prop: "detailInfo",
            icon: "el-icon-s-order",
            column: [
              {
                label: "用户昵称",
                prop: "name",
                hide: true,
                rules: [
                  {
                    required: true,
                    message: "请输入用户昵称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "用户姓名",
                prop: "realName",
                rules: [
                  {
                    required: true,
                    message: "请输入用户姓名",
                    trigger: "blur",
                  },
                  {
                    min: 2,
                    max: 5,
                    message: "姓名长度在2到5个字符",
                  },
                ],
              },
              {
                label: "手机号码",
                prop: "phone",
                overHidden: true,
              },
              {
                label: "电子邮箱",
                prop: "email",
                hide: true,
                overHidden: true,
              },
              {
                label: "用户性别",
                prop: "sex",
                type: "select",
                dicData: [
                  {
                    label: "男",
                    value: 1,
                  },
                  {
                    label: "女",
                    value: 2,
                  },
                  {
                    label: "未知",
                    value: 3,
                  },
                ],
                hide: true,
              },
              {
                label: "用户生日",
                type: "date",
                prop: "birthday",
                format: "yyyy-MM-dd hh:mm:ss",
                valueFormat: "yyyy-MM-dd hh:mm:ss",
                hide: true,
              },
              {
                label: "账号状态",
                prop: "statusName",
                hide: true,
                display: false,
              },
            ],
          },
          {
            arrow: false,
            label: "职责信息",
            prop: "dutyInfo",
            icon: "el-icon-s-custom",
            column: [
              {
                label: "员工工号",
                formslolt: true,
                prop: "staffId",
                rules: [
                  {
                    required: true,
                    message: "请输入员工工号"
                  }
                ]
              },
              {
                label: "所属角色",
                prop: "roleId",
                multiple: true,
                type: "tree",
                dicData: [],
                props: {
                  label: "title",
                  expandOnClickNode: false,
                },
                checkStrictly: true,
                slot: true,
                rules: [
                  {
                    required: true,
                    message: "请选择所属角色",
                    trigger: "click",
                  },
                ],
              },
              {
                label: "所属部门",
                prop: "deptId",
                slot: true,
                formslot: true,
                rules: [
                  {
                    required: true,
                    message: "请选择所属部门",
                    trigger: "click",
                  },
                ],
              },
              {
                label: "所属岗位",
                prop: "postId",
                type: "tree",
                multiple: true,
                dicData: [],
                props: {
                  label: "postName",
                  value: "id",
                },
                rules: [
                  {
                    required: true,
                    message: "请选择所属岗位",
                    trigger: "click",
                  },
                ],
              },
            ],
          },
        ],
      },
      staffCodeOptions: [],
      staffCodeLoading: false,
      normalDeptTreeDic: [],
      normalDeptSelectTreeProps: {
        label: "title"
      },
      // -------------- 虚拟组织架构 -------------
      // 当前虚拟组织的id
      voId: "-1",
      // 虚拟组织架构表格 配置
      voTableOption: {
        ...option,
        column: [
          {
            label: "登录账号",
            prop: "account",
            search: true,
            disabled: true,
          },
          {
            label: "用户姓名",
            prop: "realName",
            search: true,
            display: false,
          },
          {
            label: "所属组织",
            prop: "masterId",
            slot: true,
            formslot: true,
            rules: [
              {
                required: true,
                message: "请选择所属组织",
                trigger: "click",
              },
            ],
          },
          {
            label: "所属角色",
            prop: "roleId",
            formslot: true,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择所属角色",
                trigger: "click",
              },
            ],
          },
        ],
      },
      currVoNode: {},
      treeData: [],
      treeOption: {
        nodeKey: "id",
        lazy: true,
        treeLoad: function (node, resolve) {
          const parentId = node.level === 0 ? 0 : node.data.id;
          getDeptLazyTree(parentId).then((res) => {
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
          label: "title",
          value: "value",
          children: "children",
        },
      },

      roleSelectTreeProps: {
        label: "title",
      },

      voTreeOption: {
        nodeKey: "id",
        lazy: true,
        height: "auto",
        treeLoad: function (node, resolve) {
          const parentId = node.level === 0 ? 0 : node.data.id;
          getVirtualLazyTree(parentId).then((res) => {
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
      voTreeData: [],

      masterIdSelectTreeOption: {
        nodeKey: "id",
        lazy: true,
        treeLoad: (node, resolve) => {
          const parentId = node.level === 0 ? this.voId : node.data.id;
          getVirtualLazyTree(parentId).then((res) => {
            const result = res.data.data.map((item) => {
              return {
                ...item,
                leaf: !item.hasChildren,
              };
            });
            resolve(result);
          });
        },
        addBtn: false,
        menu: false,
        size: "small",
        props: {
          label: "virtualorganizationName",
          value: "value",
          children: "children",
        },
      },
      // 侧边栏 End


      data: [],
      excelForm: {},
      excelOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: "模板上传",
            prop: "excelFile",
            type: "upload",
            drag: true,
            loadText: "模板上传中，请稍等",
            span: 24,
            propsHttp: {
              res: "data",
            },
            tip: "请上传 .xls,.xlsx 标准格式文件",
            action: "/api/rabbit-user/import-user",
          },
          {
            label: "数据覆盖",
            prop: "isCovered",
            type: "switch",
            align: "center",
            width: 80,
            dicData: [
              {
                label: "否",
                value: 0,
              },
              {
                label: "是",
                value: 1,
              },
            ],
            value: 0,
            slot: true,
            rules: [
              {
                required: true,
                message: "请选择是否覆盖",
                trigger: "blur",
              },
            ],
          },
          {
            label: "模板下载",
            prop: "excelTemplate",
            formslot: true,
            span: 24,
          },
        ],
      },

      // 添加用户时的查找用户表
      addUserTableData: [],
      addUserTableLoading: true,
      addUserTableOption: {
        height: "auto",
        menu: false,
        calcHeight: 250,
        selection: true,
        searchMenuSpan: 6,

        addBtn: false,
        selectable: (row) => {
          return row.isChoice === 0;
        },
        tip: false,
        reserveSelection: true,
        selectClearBtn: true,
        column: [
          {
            label: "账号",
            prop: "account",
            search: true,
            display: false,
          },
          {
            label: "用户名称",
            prop: "realName",
            search: true,
            display: false,
          },
          {
            label: "添加时指定角色",
            prop: "role",
            display: false,
            slot: true,
          },
        ],
      },
    };
  },
  watch: {
    "form.realName"(newVal) {
      const autoChange = this.autoChange;
      this.autoChange = false;
      if (newVal === '') {
        this.realNameLock = false;
        return
      }

      if (!autoChange) {
        this.realNameLock = true;
      }
    },
    "form.tenantId"() {
      if (this.form.tenantId !== "" && this.initFlag) {
        this.initData(this.form.tenantId);
      }
    },
    "excelForm.isCovered"() {
      if (this.excelForm.isCovered !== "") {
        const column = this.findObject(this.excelOption.column, "excelFile");
        column.action = `/api/rabbit-user/import-user?isCovered=${this.excelForm.isCovered}`;
      }
    },
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.user_add, false),
        viewBtn: this.vaildData(this.permission.user_view, false),
        delBtn: this.vaildData(this.permission.user_delete, false),
        editBtn: this.vaildData(this.permission.user_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  mounted() {
    // 非租户模式默认加载管理组数据
    if (!website.tenantMode) {
      this.initData(website.tenantId);
    }
  },
  methods: {
    handleStaffCodeChange(staffId) {
      if (this.realNameLock) return;

      const employee = this.staffCodeOptions.find(option => {
        return option.staffId === staffId
      });

      if (employee) {
        // 如果为 autoChange 则不设置 realNameLock
        this.autoChange = true;
        this.form.realName = employee.name;
      }
    },

    handleResizeDrag(e) {
      const oriPosX = e.clientX;
      const oriWidth = parseInt(window.getComputedStyle(this.$refs.aside.$el).width);
      const mainElm = this.$refs.main.$el;
      const asideElm = this.$refs.aside.$el;
      document.body.style.cursor = 'e-resize';

      function handleMouseMove(e) {
        const delta = e.clientX - oriPosX;
        const width = Math.min(Math.max(oriWidth + delta, 200), 900);
        asideElm.style.width = width + 'px';
        mainElm.style.width = `calc(100% - ${width}px)`;
        e.preventDefault();
      }

      function handleMouseUp() {
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    searchStaffByCode(query) {
      this.staffCodeLoading = true;

      clearTimeout(this.searchstaffCodeTimer);
      this.searchstaffCodeTimer = setTimeout(() => {
        query = query.trim();
        getStaffList({
          staffId: query
        }).then(res => {
          this.staffCodeLoading = false;
          if (res.data.code !== 200) {
            this.$message.error("请求员工工号失败");
            this.staffCodeOptions = [];
            return;
          }
          this.staffCodeOptions = res.data.data.records;
        })
      }, 300)

    },
    nodeClick(data) {
      this.treeDeptId = data.id;
      this.currNormalNode = data;
      this.page.currentPage = 1;
      this.setNormalMode();
      this.onLoad(this.page);
    },
    voNodeClick(data, tree) {
      this.loading = true;

      const getTopLevelId = function (tree) {
        while (tree.parent && tree.parent.parent) {
          tree = tree.parent;
        }
        return tree.data.id;
      }

      this.voId = getTopLevelId(tree);

      this.currVoNode = data;
      this.treeDeptId = data.id;
      this.page.currentPage = 1;
      this.setVoMode();
      this.onLoad();
    },

    handleSelectMasterId(data) {
      this.form.newMasterId = data.id;
      this.form.masterName = data.virtualorganizationName;
    },
    setVoMode() {
      this.$refs.normalTree.setCurrentKey(null);
      this.voMode = true;
    },
    setNormalMode() {
      this.$refs.voTree.setCurrentKey(null);
      this.voMode = false;
    },

    initData(tenantId) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        target: "#avue-view",
      });
      const getRoleTreePromise = getRoleTree(tenantId).then((res) => {
        this.roleTreeDic = res.data.data;
        return Promise.resolve()
      });
      const getDeptTreePromise = getDeptTree(tenantId).then((res) => {
        this.normalDeptTreeDic = res.data.data;
        return Promise.resolve()
      });
      const getPostListPromise = getPostList(tenantId).then((res) => {
        const column = this.findObject(this.normalTableOption.group, "postId");
        column.dicData = res.data.data;
        return Promise.resolve()
      });

      Promise.all([
        getRoleTreePromise,
        getDeptTreePromise,
        getPostListPromise
      ]).then(() => {
        loading.close();
      }).catch(() => {
        loading.close()
      })
    },
    submitRole() {
      const roleList = this.$refs.treeRole.getCheckedKeys().join(",");
      grant(this.ids, roleList).then(() => {
        this.roleBox = false;
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.onLoad(this.page);
      });
    },
    rowSave(row, done, loading) {
      if (Array.isArray(row.roleId)) {
        row.roleId = row.roleId.join(",");
      }
      if (Array.isArray(row.postId)) {
        row.postId = row.postId.join(",");
      }
      add(row).then(
        () => {
          this.initFlag = false;
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
    rowUpdate(row, _index, done, loading) {
      if (this.voMode) {
        const roleId = Array.isArray(row.roleId)
          ? row.roleId.join(",")
          : row.roleId;
        if (Array.isArray(row.postId)) {
          row.postId = row.postId.join(",");
        }
        this.updateUser(row.masterId, row.id, this.form.newMasterId, roleId).then(
          (res) => {
            if (res.data.code === 200) {
              this.$message.success(res.data.data);
              this.onLoad();
              done();
            }
          }
        );
      } else {
        if (Array.isArray(row.roleId)) {
          row.roleId = row.roleId.join(",");
        }
        if (Array.isArray(row.postId)) {
          row.postId = row.postId.join(",");
        }
        if (Array.isArray(row.deptId)) {
          row.deptId = row.deptId[0];
        }
        update(row).then(
          () => {
            this.initFlag = false;
            setTimeout(() => {
              this.onLoad(this.page);
            }, 0);
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
      }
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.voMode) {
            return delVirtualOrganizationUser(this.treeDeptId, [row.id]);
          } else {
            return remove(row.id);
          }
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    // 清空搜索回调方法
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    // 点击搜索按钮
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      // 用于多选表格，切换所有行的选中状态。
      this.toggleSelection()
    },

    userSearchChange(params, done) {
      this.getUserSelectList(
        this.currVoNode.id,
        this.addUserTablePage.currentPage,
        this.addUserTablePage.pageSize,
        params
      ).then(() => {
        done();
      });
    },

    handleAddUserRefreshChange() {
      this.addUserTableData = [];
      this.addUserTableLoading = true;
      this.getUserSelectList(
        this.currVoNode.id,
        this.addUserTablePage.currentPage,
        this.addUserTablePage.pageSize
      );
    },
    userSearchReset() {
      this.onAddUserTableLoad();
    },

    // 点击新增用户按钮
    handleAdd() {
      if (this.voMode) {
        // 虚拟组织添加用户
        if (this.currVoNode.parentId === "0") {
          this.$message.warning("不能直接在架构上添加用户");
          return;
        }
        this.addUserTableData = [];
        this.onAddUserTableLoad();
        this.addUserDialogVisible = true;
      } else {
        // 行政组织添加用户
        this.form.masterId = this.currVoNode.id;
        this.$refs.normalCrud.rowAdd();
      }
    },

    handleAddUserCancel() {
      this.roleCache = {};
      this.addUserDialogVisible = false;
      this.resetUserSelectTable();
    },

    handleUserDialogClose(done) {
      this.roleCache = {};
      this.resetUserSelectTable();
      done();
    },

    resetUserSelectTable() {
      this.$refs.userSelectCrud.toggleSelection();
      this.$refs.userSelectCrud.searchReset();
    },

    // 点击删除按钮
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
          if (this.voMode) {
            const delMap = {};
            this.selectionList.forEach((item) => {
              delMap[item.masterId] = delMap[item.masterId] || [];
              delMap[item.masterId].push(item.id);
            });

            const _k = Object.keys(delMap);
            _k.forEach((key) => {
              return delVirtualOrganizationUser(key, delMap[key]);
            });
          } else {
            return remove(this.ids);
          }
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.toggleSelection()
        });
    },
    toggleSelection() {
      if (this.voMode) {
        this.$refs.voCrud.toggleSelection();
      } else {
        this.$refs.normalCrud.toggleSelection();
      }
    },
    handleReset() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择账号密码重置为123456?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return resetPassword(this.ids);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.toggleSelection()
        });
    },
    handleGrant() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.roleTreeObj = [];
      if (this.selectionList.length === 1) {
        this.roleTreeObj = this.selectionList[0].roleId.split(",");
      }
      getRoleTree().then((res) => {
        this.roleGrantList = res.data.data;
        this.roleBox = true;
      });
    },
    handleImport() {
      this.excelBox = true;
    },
    uploadAfter(_res, done) {
      this.excelBox = false;
      this.refreshChange();
      done();
    },
    // 导出
    handleExport() {
      this.$confirm("是否导出用户数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(
          `/api/rabbit-user/export-user?${this.website.tokenHeader
          }=${getToken()}&account=${this.search.account}&realName=${this.search.realName
          }`
        );
      });
    },
    // 模板下载
    handleTemplate() {
      window.open(
        `/api/rabbit-user/export-template?${this.website.tokenHeader
        }=${getToken()}`
      );
    },
    // 查看与编辑
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        if (this.voMode) {
          done();
          return;
        }

        this.$router.push({
          query: {id: this.form.id},
        });

        getUser(this.form.id).then((res) => {
          this.form = res.data.data;
          this.form.staffId = this.form.staffId || this.form.code

          if (this.form.hasOwnProperty("roleId")) {
            this.form.roleId = this.form.roleId.split(",");
          }
          if (this.form.hasOwnProperty("postId")) {
            this.form.postId = this.form.postId.split(",");
          }
        });
      }

      if (['add'].includes(type)) {
        if (this.voMode) {
          return;
        }
        this.form.deptId = this.treeDeptId;
      }

      this.initFlag = true;

      this.$nextTick(() => {
        done();
      })
    },
    beforeClose(done) {
      this.$router.push({
        query: {},
      });
      this.staffCodeOptions = [];
      this.$nextTick(() => {
        this.form = {};
        done();
      })
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      this.data = [];


      // if(this.voMode) 虚拟组织架构加载
      if (this.voMode) {
        this.getVirtualUserPage(
          this.treeDeptId,
          this.page.currentPage,
          this.page.pageSize,
          Object.assign(params, this.query)
        ).then(() => {
          this.loading = false;
          this.selectionClear();
        });
        return;
      }

      // else 行政组织架构加载
      if (this.$route.query.id) {
        getUser(this.$route.query.id)
          .then((res) => {
            const {data} = res.data;
            this.page.total = 1;
            this.data = [data];
            this.$refs.normalCrud.rowView(data, 1);
            this.loading = false;
          })
          .catch(() => {
            this.$message.warning("不存在的用户");
          });
        return;
      }

      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query),
        this.treeDeptId
      ).then((res) => {
        const data = res.data.data;
        // 总条数,如果为0的话不显示分页
        this.page.total = data.total;
        // 渲染表单页面
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    onAddUserTableLoad() {
      this.getUserSelectList(
        this.currVoNode.id,
        this.addUserTablePage.currentPage,
        this.addUserTablePage.pageSize
      );
    },
    handleAddUserSelectionChange(list) {
      this.userSelectedList = list;
    },
    handleAddUser() {
      const denyList = this.userSelectedList.filter((item) => {
        return this.roleCache[item.id].length === 0;
      });
      if (denyList.length !== 0) {
        const denyListUserName = denyList.map((item) => item.realName);
        this.$message.warning(`用户 ${denyListUserName.join(", ")} 未指定角色`);
        return;
      }

      this.addVirtualOrganizationUser(
        this.treeDeptId,
        this.userSelectedList.map((item) => {
          const roleId = this.roleCache[item.id]
            ? this.roleCache[item.id].join(",")
            : "";
          return {
            userId: item.id,
            roleId,
          };
        })
      ).then(() => {
        this.$message.success("添加成功");
        this.addUserDialogVisible = false;
        this.roleCache = {};
        this.resetUserSelectTable();
        this.onLoad();
      });
    },
    // 虚拟组织添加用户
    addVirtualOrganizationUser(masterId, userIdList) {
      return new Promise((resolve) => {
        addVirtualOrganizationUser(masterId, userIdList).then((res) => {
          resolve(res);
        });
      });
    },
    delVirtualOrganizationUser(masterId, userIdList) {
      return new Promise((resolve) => {
        delVirtualOrganizationUser(masterId, userIdList).then((res) => {
          resolve(res);
        });
      });
    },
    // 获取用户选择列表
    getUserSelectList(masterId, current, size, query) {
      return new Promise((resolve) => {
        getUserSelectList(masterId, current, size, query).then((res) => {
          const {records, total} = res.data;
          this.addUserTablePage.total = total;
          this.addUserTableData = records;
          this.addUserTableLoading = false;
          resolve(res);
        });
      });
    },
    // 获取用户列表
    getVirtualUserPage(masterId, current, size, query) {
      return new Promise((resolve) => {
        getVirtualUserPage(masterId, current, size, query).then((res) => {
          const {records, total} = res.data;
          this.data = records;
          this.loading = false;
          this.page.total = total;
          resolve(res);
        });
      });
    },
    updateUser(masterId, userId, newMasterId, roleId) {
      return new Promise((resolve) => {
        updateUser(masterId, userId, newMasterId, roleId).then((res) => {
          resolve(res);
        });
      });
    },
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

.avue-crud {
  height: 100%;
}
</style>
