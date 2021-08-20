<template>
  <div class="container-wrapper">
    <split-horizontal>
      <template #left>
        <div class="scroll-wrapper">
          <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"/>
        </div>
      </template>
      <template #right>
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="data"
          ref="crud"
          v-model="form"
          :permission="permissionList"
          :search.sync="search"
          :page.sync="page"
          :before-open="beforeOpen"
          :before-close="beforeClose"
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
        >
          <template slot="menuLeft">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              v-if="userInfo.role_name.includes('admin')"
              @click="handleDelete"
            >删 除
            </el-button>
            <el-button
              type="success"
              size="small"
              v-if="userInfo.role_name.includes('admin')"
              icon="el-icon-upload2"
              @click="handleImport"
            >导入
            </el-button>
            <el-button
              type="warning"
              size="small"
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
          <template slot-scope="{ row }" slot="deptName">
            <el-tag>{{ row.deptName }}</el-tag>
          </template>
        </avue-crud>
        <el-dialog title="员工数据导入" append-to-body :visible.sync="excelBox" width="555px">
          <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
            <!-- 模板下载 -->
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
import {
  // 表格数据
  getList,
  //更新员工
  update,
  //删除员工
  remove,
  //新增员工
  add,
} from "@/api/system/staff";
import {getDeptTree, getDeptLazyTree} from "@/api/system/dept"
import {mapGetters} from "vuex";
import website from "@/config/website";
import {getToken} from "@/util/auth";
import SplitHorizontal from "@/components/SplitHorizontal/SplitHorizontal";

export default {
  components: {SplitHorizontal},
  data() {
    return {
      form: {},
      search: {},
      roleBox: false,
      excelBox: false,
      initFlag: true,
      selectionList: [],
      query: {},
      // 表格等待框的控制
      loading: true,
      // 分页
      page: {
        // 每页显示多少条
        pageSize: 10,
        // 当前页码
        currentPage: 1,
        //  总条数,如果为0的话不显示分页
        total: 0,
      },
      // 定义的搜索框传值的参数
      staff: {
        staffId: 0,
        sex: 0,
        nationality: "",
        name: "",
      },
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
      treeDeptId: "",
      treeData: [],
      treeOption: {
        nodeKey: "id",
        lazy: true,
        treeLoad: function (node, resolve) {
          const parentId = node.level === 0 ? 0 : node.data.id;
          // 获取左侧最上层部门ID
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
      option: {
        // 弹出框的宽度
        // dialogWidth: '90%',
        // 表单的label宽度
        labelWidth: 200,
        // 隐藏新增按钮
        addBtn: true,
        // 隐藏删除按钮
        delBtn: true,
        // 隐藏编辑按钮
        editBtn: true,
        // 表格列居中
        align: "center",
        // 表格按钮居中
        menuAlign: "center",
        height: "auto",
        calcHeight: 80,
        // 设置tip为false可以取消表格上方显示的tag
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        //dialogType: 'drawer',
        // 点击空白处不关闭对话框
        dialogClickModal: false,
        column: [
          {
            label: "员工工号",
            prop: "staffId",
            search: true,
            display: false,
          },
          // 区域id 所属公司id 所属部门没有

          {
            label: "员工姓名",
            prop: "name",
            search: true,
            display: false,
          },
          {
            label: "员工性别",
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
            ],
            search: true,
            display: false,
          },
          {
            label: "民族",
            prop: "nation",
            display: false,
          },
          {
            label: "国籍",
            prop: "nationality",
            search: true,
            display: false,
          },
        ],
        group: [
          {
            label: "基础信息",
            prop: "baseInfo",
            icon: "el-icon-user-solid",
            column: [
              {
                label: "员工姓名",
                prop: "name",
                rules: [
                  {
                    required: true,
                    message: "请输入员工昵称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "员工工号",
                prop: "staffId",
              },
              {
                label: "手机号",
                prop: "phone",
                overHidden: true,
              },
              {
                label: "员工性别",
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
                ],
              },
              {
                label: "电子邮箱",
                prop: "email",
                overHidden: true,
              },
              {
                label: "出生日期",
                type: 'date',
                prop: "birthday",
                overHidden: true,
              }
            ],
          },
          {
            label: "详细信息",
            prop: "detailInfo",
            icon: "el-icon-s-order",
            column: [
              {
                label: "起始时间",
                prop: "startDate",
                overHidden: true,
              },
              {
                label: "终止日期",
                prop: "endDate",
                overHidden: true,
              },
              {
                label: "身份证件类型",
                prop: "idCardType",
              },
              {
                label: "身份证件号码",
                prop: "idCardNumber",
              },
              {
                label: "民族",
                prop: "nation",
                overHidden: true,
              },
              {
                label: "国籍",
                prop: "nationality",
                overHidden: true,
              },
              {
                label: "政治面貌",
                prop: "politicCountenance",
              },
              {
                label: "婚姻状况",
                prop: "maritalStatus",
              },
              {
                label: "最高学历",
                prop: "education",
                type: "select",
                dicData: [
                  {
                    label: "大专",
                    value: 1,
                  },
                  {
                    label: "本科",
                    value: 2,
                  },
                  {
                    label: "硕士",
                    value: 3,
                  },
                  {
                    label: "博士",
                    value: 4,
                  },
                ],
              },
              {
                label: "住址",
                prop: "address",
              },
              {
                label: "详细地址",
                prop: "addressDetails",
              },
              {
                label: "邮政编码",
                prop: "postalCode",
              },
              {
                label: "上班时间",
                prop: "workHours",
              },
              {
                label: "是否计绩效奖金",
                prop: "whetherBonus",
                type: "select",
                dicData: [
                  {
                    label: "是",
                    value: 1,
                  },
                  {
                    label: "否",
                    value: 2,
                  },
                ],
              },
              {
                label: "银行代码",
                prop: "bankCode",
              },
              {
                label: "银行账户",
                prop: "bankAccount",
              },
              {
                label: "合同类型",
                prop: "contractType",
              },
              {
                label: "合同有效期",
                prop: "contractVld",
              },
              {
                label: "员工证件类型",
                prop: "credentialsType",
              },
              {
                label: "员工证件号码",
                prop: "credentialsNumber",
              },
              {
                label: "员工证件发放者",
                prop: "credentialsCreatedBy",
              },
              {
                label: "员工证件发放地",
                prop: "credentialsCreatedAddress",
              },
              {
                label: "员工证件起始日期",
                prop: "credentialsStartDate",
              },
              {
                label: "员工证件终止日期",
                prop: "credentialsEndDate",
              },
            ],
          },
          {
            label: "职责信息",
            prop: "dutyInfo",
            icon: "el-icon-s-custom",
            column: [
              {
                label: "区域id",
                prop: "areaId",
                overHidden: true,
              },
              {
                label: "所属公司id",
                prop: "companyId",
              },
              {
                label: "所属部门id",
                prop: "deptId",
              },
              {
                label: "员工岗位id",
                prop: "positionId",
              },
            ],
          },
        ],
      },
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
            // 导入接口
            action: "/api/rabbit-system/staff/import-staff",
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
    };
  },
  // 侦听属性watch：
  watch: {
    "form.tenantId"() {
      if (this.form.tenantId !== "" && this.initFlag) {
        this.initData(this.form.tenantId);
      }
    },
    // 检测上传组件
    "excelForm.isCovered"() {
      // 检测数据是否覆盖
      if (this.excelForm.isCovered !== "") {
        // 找到模板上传然后赋值
        const column = this.findObject(this.excelOption.column, "excelFile");
        column.action = `/api/rabbit-system/staff/import-staff?isCovered=${this.excelForm.isCovered}`;
      }
    },
  },
  // 计算属性computed
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        viewBtn: this.vaildData(this.permission.user_view, false),
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
    // 树形控制器的点击事件
    nodeClick(data) {
      this.treeDeptId = data.id;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    // 初始化事件
    initData(tenantId) {
      // 获取了左侧所有部门ID
      getDeptTree(tenantId).then((res) => {
        const column = this.findObject(this.option.group, "deptId");
        column.dicData = res.data.data;
      });
    },

    rowDel(row, index, done) {
      alert('rowDel');
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
          // 数据回调进行刷新
          done(row);
        });
    },
    // 编辑数据后确定触发该事件
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          // this.initFlag = false;
          // this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          done(row);
        },
        (error) => {
          window.console.log("失败", error);
          loading();
        }
      );
    },
    rowSave(row, done, loading) {
      add(row).then(
        (res) => {
          // 获取新增数据的相关字段
          const data = res.data;
          row.id = data.id;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          done(row);
        },
        (error) => {
          window.console.log("失败", error);
          loading();
        }
      );
    },

    // 清空搜索回调方法
    searchReset() {
      this.query = {};
      this.treeDeptId = "";
      this.onLoad(this.page);
    },
    // 点击搜索按钮
    searchChange(params, done) {
      // 分页的当前页码
      this.page.currentPage = 1;
      // 将搜索框里面的值赋值给staff
      this.staff = params;
      this.onLoad(this.page, done);
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(list) {
      this.selectionList = list;
    },
    // 选择清除
    selectionClear() {
      this.selectionList = [];
      // 用于多选表格，切换所有行的选中状态。
      this.$refs.crud.toggleSelection();
    },

    // 左上角的删除
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
          this.parentId = 0;
          this.$refs.crud.refreshTable();
          this.$refs.crud.toggleSelection();
          // 表格数据重载
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    // 导入对话框
    handleImport() {
      this.excelBox = true;
    },
    // 更新页面 	图片上传后的回调,function(res,done)，done用于结束操作，loading用于中断操作
    uploadAfter(res, done, loading, column) {
      window.console.log(column);
      this.excelBox = false;
      this.refreshChange();
      done();
    },
    // 导出
    handleExport() {
      this.$confirm("是否导出员工数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 打开新窗口
        window.open(
          `/api/rabbit-system/staff/export-staff?${this.website.tokenHeader
          }=${getToken()}&account=${this.search.account}&realName=${this.search.realName
          }`
        );
      });
    },
    //  模板下载
    handleTemplate() {
      window.open(
        `/api/rabbit-system/staff/export-template?${this.website.tokenHeader
        }=${getToken()}`
      );
    },
    // 对话框打开前的回调
    beforeOpen(done) {
      done();
    },
    // 关闭弹出框
    beforeClose(done) {
      done();
    },
    // 切换页面时触发该事件
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    // 	页面每页显示的条数触发该事件
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    // 点击刷新按钮触发该事件
    refreshChange() {
      this.onLoad(this.page);
    },
    // 初始化加载网页
    /**
     * 首次加载调用on-load方法加载数据，返回page分页对象信息,赋值page的total总条数即可,
     * 如果total为0的话，或者simplePage为true只有1页的时候，分页选择器会隐藏
     */
    onLoad(page, callback) {
      let params = {};
      if (!page) {
        page = this.page;
      }
      this.loading = true;
      // 部门id
      params.deptId = 0; ///
      // 当前页码
      params.current = page.currentPage;
      // 每页显示多少条
      params.size = page.pageSize;
      // 将搜索款里面的staff赋值给params Object.assign()对象的拷贝
      Object.assign(params, this.staff);
      getList(params)
        .then((res) => {
          // 总条数,如果为0的话不显示分页
          this.page.total = res.data.data.total;
          // 渲染表单页面
          this.data = res.data.data.records;
          // 关闭对话框
          this.loading = false;
          // 调用选择清除方法
          this.selectionClear();
          // 校验
          callback && callback();
        })
        .catch(() => {
          this.loading = false;
          // 校验
          callback && callback();
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
</style>
