<template>
  <div class="Home-container">
    <!-- 头部卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          :model="searmForm"
          ref="searmForm"
          class="demo-form-inline"
        >
          <el-form-item label="客户类型" prop="partyTypeId">
            <el-select v-model="searmForm.partyTypeId" placeholder="请选择">
              <el-option
                v-for="(item, index) in userTypeList"
                :key="index"
                :label="item.description"
                :value="item.party_type_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户角色" prop="attrValueRole">
            <el-select v-model="searmForm.attrValueRole" placeholder="请选择">
              <el-option
                v-for="(item, index) in userRoleList"
                :key="index"
                :label="item.descriptionZh"
                :value="item.enumId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户状态" prop="attrValueStatus">
            <el-select v-model="searmForm.attrValueStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in userStatuList"
                :key="index"
                :label="item.descriptionZh"
                :value="item.enumId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称" prop="groupName">
            <el-input
              v-model="searmForm.groupName"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <!-- 查询客户主数据 -->
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="searchData"
            >查询</el-button
          >
          <!-- 新增 -->
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="addForm"
            >新增</el-button
          >
          <!-- 重置 -->
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-refresh"
            @click="reset"
            >重置</el-button
          >
        </el-form>
      </div>
    </el-card>
    <!-- 身体卡片 -->
    <el-card class="box-card">
      <span>订单列表</span>
      <!-- 主表格 -->
      <!-- :data里面的方法 能拿到你当前要显示的数据和总数据条数 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号"
          fixed
        ></el-table-column>
        <el-table-column label="查看" fixed>
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-view"
              @click="details(scope.$index, scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="partyId" label="CRM客户编号"></el-table-column>
        <el-table-column prop="groupName" label="客户名称"></el-table-column>
        <el-table-column
          prop="attrValueRole"
          label="客户角色"
        ></el-table-column>
        <el-table-column prop="createdDate" label="创建时间"></el-table-column>
        <el-table-column
          prop="attrValueStatus"
          label="客户状态"
        ></el-table-column>
        <el-table-column prop="partyTypeId" label="编辑状态"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="edit(scope.$index, scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          background
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          :total="total"
          pager-count="5"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>


<script>
import {
  findCustomerInfo,
  findCustomerTypeByPartyType,
  findCustomerRoleByEnumeration,
  findCustomerStatusByEnumeration,
} from "@/api/customer/customer";

import Mode from "./mode";

import {
  mapGetters
} from 'vuex'
export default {
  // 刷新
  // inject: ["reload"], //注入App里的reload方法
  name: "customer",
  data() {
    return {
      // 客户类型
      userTypeList: [],
      // 客户角色
      userRoleList: [],
      // 客户状态
      userStatuList: [],
      // 产业
      industry: [],
      // 客户信息查询主表 查询
      searmForm: {
        // 客户类型
        partyTypeId: "",
        // 客户角色
        attrValueRole: "",
        // 客户状态
        attrValueStatus: "",
        // 客户名称
        groupName: "",
      },
      // table的数据
      tableData: [],
      // 新增弹出框
      add: true,
      // 查询列表
      table: false,
      // 查询的订单
      order: [], // 查询选中列表
      page: {
        pageSize: 10,
        currentPage: 1,

      },
      // 客户基础信息参数
      customerBasicInfoParam: {
        parameter: "",
        parameterType: "",
        // crm客户编号
        party_id: "",
        otherParameter: "",
      },
      //判断是否新增
      flagAdd: true,
    };
  },
  computed:{
    ...mapGetters(['language'])
  },
  // 模板渲染成html前调用
  created() {
    // 查询客户主数据方法
    // this.findCustomerInfo();
    // 查询客户类型列表
    this.findCustomerTypeByPartyType();
    // 查询客户角色列表
    this.findCustomerRoleByEnumeration();
    // 查询客户角色列表
    this.findCustomerStatusByEnumeration();

    this.searchData();
  },

  // 在模板渲染成html后调用
  methods: {
    // 点击新增按钮
    addForm() {
      // 路由跳转
      this.$router.push({
        path: "/customer/addForm",
        query: {
          mode: Mode.ADD,
        },
      });
    },
    // 点击详情按钮
    details(id, row) {
      //  路由跳转
      this.$router.push({
        path: "/customer/addForm",
        query: {
          mode: Mode.INFO,
          partyId: row.partyId,
          industrialPartyId: "",
        },
      });
    },
    // 点击修改按钮
    edit(id, row) {
      //  路由跳转
      this.$router.push({
        path: "/customer/addForm",
        query: {
          mode: Mode.MODIFY,
          partyId: row.partyId,
          industrialPartyId: "",
        },
      });
    },
    // 点击查询按钮 查询客户主数据
    searchData() {
      this.disabled = false;
      // 客户类型
      var partyTypeId = this.searmForm.partyTypeId;
      // 客户角色
      var attrValueRole = this.searmForm.attrValueRole;
      // 客户状态
      var attrValueStatus = this.searmForm.attrValueStatus;
      // 客户名称
      var groupName = this.searmForm.groupName;
      let params = {
        // 客户类型空或者客户类型
        partyTypeId: partyTypeId == "" ? null : partyTypeId,
        attrValueOfPartyRole: attrValueRole == "" ? null : attrValueRole,
        attrValueOfPartyStatus: attrValueStatus == "" ? null : attrValueStatus,
        groupName: groupName == "" ? null : groupName,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      // 查询客户主数据
      findCustomerInfo(params).then((res) => {
        this.tableData = res.data.data;
        this.total = +res.data.msg
      });
    },
    // 查询客户类型列表
    findCustomerTypeByPartyType() {
      findCustomerTypeByPartyType().then((res) => {
        this.userTypeList = res.data.data;
      });
    },
    // 查询客户角色列表
    findCustomerRoleByEnumeration() {
      findCustomerRoleByEnumeration().then((res) => {
        this.userRoleList = res.data.data;
      });
    },
    //  查询客户状态列表
    findCustomerStatusByEnumeration() {
      findCustomerStatusByEnumeration().then((res) => {
        this.userStatuList = res.data.data;
      });
    },

    // 重置主表数据
    reset: function () {
      this.$refs.searmForm.resetFields();
    },

    //  每页多少条
    handleSizeChange(val) {
      this.page.pageSize = val;
    },

    // 当前页
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.searchData()
    },
    // 上一页
    prevClick() {
      this.page.currentPage = this.page.currentPage - 1;
      this.searchData();
    },
    // 下一页
    nextClick() {
      this.page.currentPage = this.page.currentPage + 1;
      this.searchData();
    },
  },
};
</script>

<style scope>
.block {
  margin-top: 20px;
  margin-bottom: 30px;
}
</style>
