<template>
  <div class="Home-container" ref="container">
    <el-card class="box-card" onload="decide()">
      <div class="top">
        <!-- 基本信息表单 -->
        <el-form
          :inline="true"
          :disabled="customerInformation"
          :model="editForm"
          label-width="120px"
          ref="editForm"
        >
          <el-form-item label="产业" prop="industrialPartyId">
            <el-select
              :disabled="customer"
              v-model="editForm.industrialPartyId"
              placeholder="请选择"
              @change="handleIndustrialPartyIdChange($event)"
            >
              <el-option
                v-for="(item, index) in industry"
                :key="index"
                :label="item.groupName"
                :value="item.industrialPartyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 用v-show控制组件在新增对话框里面隐藏 -->
          <el-form-item v-show="PARTY_ID" label="CRM客户编号" prop="partyId">
            <el-input v-model="editForm.partyId" disabled></el-input>
          </el-form-item>
          <br />
          <el-form-item label="客户名称" prop="customerName">
            <el-input :disabled="customer" v-model="editForm.customerName"></el-input>
          </el-form-item>
          <el-form-item label="ERP客户编号" prop="customerNumberOfErp">
            <el-input :disabled="disabled" v-model="editForm.customerNumberOfErp"></el-input>
          </el-form-item>
          <el-form-item label="客户电话" prop="customerPhone">
            <el-input :disabled="disabled" v-model="editForm.customerPhone"></el-input>
          </el-form-item>
          <el-form-item label="客户传真" prop="customerFax">
            <el-input :disabled="disabled" v-model="editForm.customerFax"></el-input>
          </el-form-item>
          <el-form-item label="客户邮箱" prop="customerMailbox">
            <el-input :disabled="disabled" v-model="editForm.customerMailbox"></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="backtrack()">返 回</el-button>
          <el-button
            v-if="mode != Mode.INFO"
            :disabled="disabled"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="saveForm('editForm')"
          >客户主数据保存</el-button>
        </div>
        <el-divider></el-divider>
      </div>

      <!--销售必填信息 -->
      <el-button type="primary" icon="el-icon-plus" v-if="mode != Mode.INFO" @click="addSaleData">新增</el-button>
      <el-scrollbar style="height: 100%">
        <el-table
          :disabled="salesInformation"
          :data="saleData"
          style="width: 100%"
          max-height="268"
          :border="true"
          :size="medium"
        >
          <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
          <el-table-column prop="custAccountNumber" label="客户账户编码" width="260">
            <template slot-scope="scope">
              <el-input :disabled="disabled" v-model="scope.row.custAccountNumber" />
            </template>
          </el-table-column>
          <el-table-column prop="salesAreaPartyId" label="区域" width="260">
            <template slot-scope="{ $index, row }">
              <el-select
                :disabled="disabled || validatenull(editForm.industrialPartyId)"
                v-model="row.salesAreaPartyId"
                :placeholder="
                  validatenull(editForm.industrialPartyId)
                    ? '请先选择产业'
                    : '请选择'
                "
                style="width: 100%"
                @change="handleAreaChange($index, $event)"
              >
                <el-option
                  v-for="(item, index) in areaList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="salesPartyId" label="销售公司" width="260">
            <template slot-scope="{ $index, row }">
              <el-select
                :disabled="
                  disabled || validatenull(saleData[$index].salesAreaPartyId)
                "
                v-model="row.salesPartyId"
                :placeholder="
                  validatenull(saleData[$index].salesAreaPartyId)
                    ? '请先选择区域'
                    : '请选择'
                "
                style="width: 100%"
                @change="handlePartyChange($index, $event)"
              >
                <el-option
                  v-for="item in salesCompany[$index]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="salesTeam" label="销售小组" width="260">
            <template slot-scope="{ $index, row }">
              <el-select
                :disabled="
                  disabled || validatenull(saleData[$index].primarySalesRepId)
                "
                v-model="row.salesTeam"
                :placeholder="
                  validatenull(saleData[$index].primarySalesRepId)
                    ? '请先选择销售代表'
                    : '请选择'
                "
                style="width: 100%"
              >
                <el-option
                  v-for="item in salesGroup[$index]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="primarySalesRepId" label="销售代表" width="260">
            <template slot-scope="{ $index, row }">
              <el-select
                @change="handleRepChange($index, $event)"
                :disabled="
                  disabled || validatenull(saleData[$index].salesPartyId)
                "
                v-model="row.primarySalesRepId"
                :placeholder="
                  validatenull(saleData[$index].salesPartyId)
                    ? '请先选择销售公司'
                    : '请选择'
                "
                style="width: 100%"
              >
                <el-option
                  v-for="item in marketingRepresentative[$index]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="territoryId" label="默认收货地址" width="300">
            <template slot-scope="scope">
              <el-select
                :disabled="disabled"
                v-model="scope.row.territoryId"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in addressList"
                  :key="index"
                  :label="item.name"
                  :value="item.territoryId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="shippingMethodType" label="运输方式" width="300">
            <template slot-scope="scope">
              <el-select
                :disabled="disabled"
                v-model="scope.row.shipmentMethodTypeId"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in typeOfShipping"
                  :key="index"
                  :label="item.description"
                  :value="item.shipmentMethodTypeId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="tradeTermId" label="贸易条款" width="300">
            <template slot-scope="scope">
              <el-select
                :disabled="disabled"
                v-model="scope.row.tradeTermId"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in tradeTerms"
                  :key="index"
                  :label="item.description"
                  :value="item.termTypeId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="facilityId" label="发货仓库组织" width="260">
            <template slot-scope="scope">
              <el-select
                :disabled="disabled"
                v-model="scope.row.facilityId"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in deliveryWarehouseOrganization"
                  :key="index"
                  :label="item.facilityName"
                  :value="item.facilityId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="customerLevel" label="客户等级" width="100">
            <template slot-scope="scope">
              <el-select
                :disabled="disabled"
                v-model="scope.row.customerLevel"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in customerRating"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column v-if="mode != Mode.INFO" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delSaleItem(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <el-divider></el-divider>

      <!-- 地址维护 -->
      <el-form :disabled="addressInformation" :model="addressForm" label-width="80px">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="addAddress"
          v-if="mode != 'info'"
        >新增</el-button>
      </el-form>
      <el-table
        :data="addressData"
        style="width: 100%; margin-bottom: 30px"
        :border="true"
        max-height="250"
      >
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column prop="addressPurpose" label="地址应用目的" width="260">
          <template slot-scope="scope">
            <el-select
              :disabled="disabled"
              v-model="scope.row.addressPurpose"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in purposeOfAddressApplication"
                :key="index"
                :label="item.description"
                :value="item.contactMechPurposeTypeId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="addressCountry" label="国家">
          <template slot-scope="scope">
            <el-select :disabled="disabled" v-model="scope.row.addressCountry" placeholder="请选择">
              <el-option
                v-for="(item, index) in country"
                :key="index"
                :label="item.geoName"
                :value="item.geoId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="salesPartyId" label="销售公司" width="260">
          <template slot-scope="scope">
            <el-select
              :disabled="disabled"
              v-model="scope.row.salesPartyId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in chooseAbleParty"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="addressDetail" label="详细地址">
          <template slot-scope="scope">
            <el-input :disabled="disabled" v-model="scope.row.addressDetail" />
          </template>
        </el-table-column>
        <el-table-column prop="addressTips" label="备注">
          <template slot-scope="scope">
            <el-input :disabled="disabled" v-model="scope.row.addressTips" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" v-if="mode != Mode.INFO">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteAddress(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  findTerritory,
  findShipmentMethodType,
  findTermType,
  findFacility,
  findCountryList,
  findAddressTypeList,
  getCustomerInfoByPartyId,
  getCustomerBasicInfo,
  findPartyGroupByPartyId,
  getSalesRepresentativeBySalesParty,
  saveCustomerInfo,
  updateCustomerByInsider,
} from "@/api/customer/customer";

import Mode from "./mode";

export default {
  name: "addForm",
  data() {
    return {
      /**
       * add || modify || info
       */
      mode: Mode.ADD,
      Mode,
      // 客户基本信息 新增
      editForm: {
        userLoginId: "crmtest",
        industrialPartyId: "",
        customerName: "",
        customerNumberOfErp: "",
        customerPhone: "",
        customerFax: "",
        customerMailbox: "",
      },
      // 销售必填信息表单
      saleData: [
        {
          // 客户账户编码
          custAccountNumber: "",
          // 地域字段
          salesAreaPartyId: "",
          // 销售公司字段
          salesPartyId: "",
          // 销售小组
          salesTeam: "",
          // 销售代表
          primarySalesRepId: "",
          // 默认收货地址
          territoryId: "",
          // 运输方式
          shipmentMethodTypeId: "",
          // 贸易条款
          tradeTermId: "",
          // 发货仓库组织
          facilityId: "",
          // 客户等级
          customerLevel: "",
        },
      ],
      // 地址维护
      addressData: [
        {
          addressPurpose: "",
          addressCountry: "",
          salesPartyId: "",
          addressDetail: "",
          addressTips: "",
        },
      ],
      // 地址新增
      addressForm: [],
      // 销售必填保存时的表单
      salesInformation: [],
      // 地址维护的保存时的表单
      addressMaintenance: [],
      // table的数据
      tableData: [],
      // 客户基础信息参数
      customerBasicInfoParam: {
        parameter: "",
        parameterType: "",
        // crm客户编号
        partyId: "",
        otherParameter: "",
      },
      //判断是否新增
      flagAdd: true,
      details: true,
      // 客户基本信息的保存按钮
      save: [],
      // 控制表单为只读
      disabled: false,
      // 默认收货地区
      addressList: [],
      // 运输方式
      typeOfShipping: [],
      // 贸易条款
      tradeTerms: [],
      // 国家
      country: [],
      // 地址应用目的
      purposeOfAddressApplication: [],
      // 发货仓库组织
      deliveryWarehouseOrganization: [],
      // 区域
      areaList: [],
      // 产业
      industry: [],
      // 销售公司
      salesCompany: [],
      // 销售小组
      salesGroup: [],
      // 销售代表
      marketingRepresentative: [],
      // 客户等级
      customerRating: [
        { name: "A", value: 1 },
        { name: "B", value: 2 },
        { name: "C", value: 3 },
        { name: "D", value: 4 },
        { name: "E", value: 5 },
      ],
    };
  },
  computed: {
    chooseAbleParty() {
      const findParty = (partyId) => {
        for (let i = 0; i < this.salesCompany.length; i++) {
          const companys = this.salesCompany[i];
          for (let j = 0; j < companys.length; j++) {
            const company = companys[j];
            if (company.id == partyId) {
              return company;
            }
          }
        }
      };
      return this.saleData.map((item) => {
        return findParty(item.salesPartyId) || {};
      });
    },
  },
  watch: {
    salesCompany: {
      handler() {
        const salesCompanys = this.saleData.map(item => {
          return item.salesPartyId;
        })
        this.addressData.forEach((item) => {
          if (!salesCompanys.includes(item.salesPartyId)) {
            item.salesPartyId = "";
          }
        })
      },
    },
  },
  // 模板渲染成html前调用
  created() {
    // 判断是新增还是修改
    const loding = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      target: "#avue-view",
    });

    this.mode = Object.keys(Mode).includes(this.$route.query.mode)
      ? this.$route.query.mode
      : this.mode;

    this.init().then(() => {
      loding.close();
    });
    // 查询默认收货地区
    // this.findTerritory();
    // 查询运输方式
    // this.findShipmentMethodType();
    // 查询贸易条款
    // this.findTermType();
    // 查询发货仓库组织
    // this.findFacility();
    // 查询国家列表数据
    // this.findCountryList();
    // 查询地址应用目的
    // this.findAddressTypeList();
  },
  methods: {
    // 初始化
    async init() {
      // 产业类型
      const partyGroupPrimise = this.findPartyGroupByPartyId();
      // 默认收获地区
      const territoryPromise = this.findTerritory();
      // 运输方式
      const shipmentMethodPromise = this.findShipmentMethodType();
      // 贸易条款
      const termTypePromise = this.findTermType();
      // 发货仓库地址
      const facilityPromise = this.findFacility();
      // 国家列表数据
      const contryPromise = this.findCountryList();
      // 地址应用目的
      const addressTypePromise = this.findAddressTypeList();
      if (this.mode == Mode.ADD) {
        //  显示CRM客户编号这个组件
        this.PARTY_ID = false;
        // // 禁止客户名称输入
        this.customer = false;
      } else if (this.mode == Mode.INFO || this.mode == Mode.MODIFY) {
        // 显示CRM客户编号这个组件
        this.PARTY_ID = true;
        // 禁止客户名称输入
        this.customer = true;
        // 表单设置成只读
        this.disabled = this.mode == Mode.INFO;

        // 获取内部注册客户的信息(详情查询)
        const customer = await this.getCustomerInfoByPartyId(
          this.$route.query.partyId
        );

        // 获取销售区域
        await this.getsalesArea(customer.industrialPartyId);
        // 获取每一个客户销售信息的地址
        const salesParamsPromiseAll = customer.salesRepresentativeBaseParamsData.map(
          async (item, index) => {
            const salesPartyPromise = this.getsalesParty(
              customer.industrialPartyId,
              item.salesAreaId,
              index
            );

            const salesRepresentativePromise = this.getSalesRepresentative(
              item.salesPartyId,
              index
            );

            const salesTeamPromise = this.getsalesTeam(
              item.primarySalesRepId,
              index
            );

            return Promise.all([
              salesPartyPromise,
              salesRepresentativePromise,
              salesTeamPromise,
            ]);
          }
        );

        await Promise.all([...salesParamsPromiseAll]);
      }
      await Promise.all([
        territoryPromise,
        shipmentMethodPromise,
        termTypePromise,
        facilityPromise,
        contryPromise,
        addressTypePromise,
        partyGroupPrimise,
      ]);
    },
    // 点击客户主数据保存
    saveForm() {
      if (this.editForm.customerName == "") {
        this.$message("您还未填写客户名称");
      } else if (this.editForm.industrialPartyId == "") {
        this.$message("您还未填写产业");
      } else if (this.editForm.customerNumberOfErp == "") {
        this.$message("您还未填写Erp客户编号");
      } else if (this.editForm.customerPhone == "") {
        this.$message("您还未填写客户电话");
      } else if (this.editForm.customerFax == "") {
        this.$message("您还未填写客户传真");
      } else if (this.editForm.customerMailbox == "") {
        this.$message("您还未填写客户邮箱");
      }

      if (!this.saveSaleData() && !this.saveAddress()) {
        return;
      }
      // 保存销售必填信息
      this.salesInformation = this.saleData;

      // 保存地址
      this.addressMaintenance = this.addressData;
      // 判断是新增保存还是修改保存
      if (this.mode == Mode.ADD) {
        this.submit();
      } else {
        this.preservation();
      }
    },
    // 销售信息的验证
    saveSaleData() {
      for (let i = 0; i < this.saleData.length; i++) {
        if (this.saleData[i].custAccountNumber == "") {
          this.$message("您还未填写客户账户编码");
        } else if (this.saleData[i].salesAreaPartyId == "") {
          this.$message("您还未填写区域");
        } else if (this.saleData[i].salesPartyId == "") {
          this.$message("您还未填写销售公司");
        } else if (this.saleData[i].territoryId == "") {
          this.$message("您还未填写默认收货地址");
        } else if (this.saleData[i].shipmentMethodTypeId == "") {
          this.$message("您还未填写运输方式");
        } else if (this.saleData[i].tradeTermId == "") {
          this.$message("您还未填写贸易条款");
        } else if (this.saleData[i].facilityId == "") {
          this.$message("您还未填写发货仓库");
        } else if (this.saleData[i].customerLevel == "") {
          this.$message("您还未填写客户等级");
        } else if (i + 1 == this.saleData.length) {
          return true;
        }
      }
    },
    // 地址维护的验证
    saveAddress() {
      let arr = [];
      // 判断长度在三个或者三个以上
      if (this.addressData.length >= 3) {
        for (let i = 0; i < this.addressData.length; i++) {
          // 判断值必须是三个不同的值
          // 获取地址应用目的的值
          let addressPurpose = this.addressData[i].addressPurpose;
          // 给arr添加addressPurpose数据
          arr.push(addressPurpose);
          if (this.addressData[i].addressCountry == "") {
            this.$message("必须有国家");
            return false;
          } else if (this.addressData[i].salesPartyId == "") {
            this.$message("必须有销售公司");
            return false;
          } else if (this.addressData[i].addressDetail == "") {
            this.$message("必须有详细地址");
            return false;
          }
        }
        // 给arr去重
        let arr1 = Array.from(new Set(arr));
        // 地址必须有三个不同的值
        if (arr1.length < 3) {
          // 提示弹窗
          this.$message("3个地址必须各不相同");
        } else {
          return true;
        }
      } else {
        this.$message("必须有三个地址应用目的地");
      }
    },
    // 新增向后台提交保存的数据
    submit() {
      this.disabled = true;
      let params = this.editForm; // 获取向后台提交的数据
      // 提交地址表单数据
      params.addressBaseParamsData = JSON.stringify(this.addressMaintenance);
      // 提交销售必填表单数据
      params.salesRepresentativeBaseParamsData = JSON.stringify(
        this.salesInformation
      );
      // 向后台提交数据
      saveCustomerInfo(params).then((res) => {
        this.$router.push("/customer/customer");
      });
    },
    // 修改保存的向后台提交的数据
    preservation() {

      let params = this.editForm; // 获取向后台提交的数据
      // 提交地址表单数据
      params.addressBaseParamsData = JSON.stringify(this.addressMaintenance);
      // 提交销售必填表单数据
      params.salesRepresentativeBaseParamsData = JSON.stringify(
        this.salesInformation
      );
      // 修改保存客户信息（编辑保存）
      updateCustomerByInsider(params).then((res) => {
        this.$router.push("/customer/customer");
      });
    },
    // 点击返回
    backtrack() {
      this.$confirm("离开表单页面的话,表单数据将清零, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push("/customer/customer");
        })
        .catch(() => {
        });
    },
    // 点击销售信息新增按钮
    addSaleData() {
      let item = {
        // 客户账户编码
        custAccountNumber: "",
        // 区域字段
        salesAreaPartyId: "",
        // 销售公司字段
        salesPartyId: "",
        // 销售小组
        salesTeam: "",
        // 销售代表
        primarySalesRepId: "",
        // 默认收货地址
        territoryId: "",
        // 运输方式
        shipmentMethodTypeId: "",
        // 贸易条款
        tradeTermId: "",
        // 发货仓库组织
        facilityId: "",
        // 客户等级
        customerLevel: "",
      };
      this.saleData.push(item);
    },
    // 获取用户信息
    getCustomerInfoByPartyId(partyId, industrialPartyId = "") {
      return new Promise((resolve) => {
        getCustomerInfoByPartyId({ partyId, industrialPartyId }).then((res) => {
          const { data } = res.data;
          // 渲染客户基本信息
          this.editForm = {
            ...data,
            userLoginId: this.editForm.userLoginId,
          };
          // 渲染销售信息
          this.saleData = res.data.data.salesRepresentativeBaseParamsData;
          // 渲染地址维护信息
          this.addressData = res.data.data.addressBaseParamsData;
          resolve(data);
        });
      });
    },
    // 点击销售信息删除按钮
    delSaleItem(index) {
      if (this.saleData.length <= 1) {
        this.$message("必须要有一条销售信息");
        return;
      }
      this.saleData.splice(index, 1);
    },
    // 点击地址信息新增按钮
    addAddress() {
      let item = {
        addressPurpose: "",
        addressCountry: "",
        salesPartyId: "",
        addressDetail: "",
        addressTips: "",
      };
      this.addressData.push(item);
    },
    // 点击地址信息删除按钮
    deleteAddress(index) {
      this.addressData.splice(index, 1);
    },
    // 查询产业方式
    findPartyGroupByPartyId() {
      return new Promise((resolve) => {
        findPartyGroupByPartyId().then((res) => {
          let industralList = res.data.data;
          for (var i = 0; i < industralList.length; i++) {
            let list = {
              industrialPartyId: industralList[i].partyId,
              groupName: industralList[i].groupName,
            };
            this.industry.push(list);
          }
          resolve(industralList);
        });
      });
    },
    // 区域
    getsalesArea(industrialPartyId) {
      return new Promise((resolve) => {
        // 根据传入参数获取区域 销售公司 销售小组
        if (typeof industrialPartyId != "undefined") {
          let params = {
            // 写死的ID
            userLoginId: this.editForm.userLoginId,
            parameter: industrialPartyId,
            // 类型不用变
            parameterType: "salesArea",
            otherParameter: "",
          };
          getCustomerBasicInfo(params).then((res) => {
            let _areaList = [];
            // 判断数据长度是否为0
            if (res.data.data != null) {
              for (var key in res.data.data) {
                let list = {
                  id: key,
                  name: res.data.data[key],
                };
                _areaList.push(list);
              }
              this.areaList = _areaList;
              resolve(_areaList);
              // 下拉框显示第一个数据
              // if (!edit) {
              //   // this.saleData[0].salesAreaPartyId = this.areaList[0].id;
              //   // this.addressData[0].salesAreaPartyId = this.areaList[0].id;
              //   this.getsalesParty(
              //     industrialPartyId,
              //     this.areaList[0].id,
              //     false,
              //     // 默认第一行
              //     0
              //   );
              // }
            }
          });
        }
      });
    },
    //查询销售公司 根据区域获取销售公司
    getsalesParty(industrialPartyId, salesAreaPartyId = "", index = 0) {
      return new Promise((resolve) => {
        if (
          typeof industrialPartyId != "undefined" &&
          typeof salesAreaPartyId != "undefined"
        ) {
          let params = {
            userLoginId: "crmtest",
            parameter: industrialPartyId, //产业id
            parameterType: "salesParty",
            otherParameter: salesAreaPartyId, //区域id
          };
          getCustomerBasicInfo(params).then((res) => {
            this.salesCompany[index] = [];
            let companys = [];
            for (var key in res.data.data) {
              let list = {
                id: key,
                name: res.data.data[key],
              };
              companys.push(list);
            }
            this.$set(this.salesCompany, index, companys);
            resolve(companys);
            // if (!edit) {
            //   var salesPartyId = this.salesCompany[0].id;
            //   this.saleData[0].salesPartyId = salesPartyId;
            //   this.getSalesRepresentative(salesPartyId, true, index);
            // }
          });
        }
      });
    },
    // 查询销售代表 根据销售公司获取销售代表
    getSalesRepresentative(salesPartyId, index) {
      return new Promise((resolve) => {
        let that = this;
        if (typeof salesPartyId != "undefined") {
          let params = {
            salesPartyId: salesPartyId, //销售公司ID
          };

          getSalesRepresentativeBySalesParty(params).then((res) => {
            let representative = [];
            that.marketingRepresentative[index] = [];
            for (var key in res.data.data.salesRepresentativeMap) {
              let list = {
                id: key,
                name: res.data.data.salesRepresentativeMap[key],
              };
              representative.push(list);
            }
            that.$set(that.marketingRepresentative, index, representative);
            resolve(representative);
            // if (!edit) {
            //   var falgNull = true;
            //   for (var primarySalesRepId in res.data.data
            //     .salesRepresentativeMap) {
            //     falgNull = false;
            //   }
            //   if (falgNull) {
            //     // 没有销售代表就清空销售代表的下拉框
            //     that.saleData[0].primarySalesRepId = "";
            //     // 没有销售小组就清空销售小组的下拉框
            //     that.saleData[0].salesTeam = "";
            //     that.$set(that.saleData, 0, that.saleData[0]);
            //   } else {
            //     that.primarySalesRepId[index] =
            //       that.marketingRepresentative[index];
            //     that.getsalesTeam(that.marketingRepresentative[0].id);
            //   }
            // }
          });
        }
      });
    },
    // 查询销售小组 根据销售代表获取销售小组
    getsalesTeam(primarySalesRepId, index) {
      return new Promise((resolve) => {
        // this.saleData[index].salesTeam = "";
        // this.salesGroup[index]=""
        if (typeof primarySalesRepId != "undefined") {
          // var that = this;
          let that = this;
          let params = {
            parameter: primarySalesRepId,
            parameterType: "salesTeam",
          };
          getCustomerBasicInfo(params).then((res) => {
            let group = [];
            that.salesGroup[index] = [];
            if (typeof res.data.data == "string") {
              group = [res.data.data];
            } else {
              for (var key in res.data.data) {
                let list = {
                  id: key,
                  name: res.data.data[key],
                };
                group.push(list);
              }
            }

            that.$set(that.salesGroup, index, group);
            resolve(group);
            // if (!edit) {
            //   var falgNull = true;
            //   for (var resultMap in res.data.data) {
            //     falgNull = false;
            //   }
            //   if (falgNull) {
            //     // 没有销售小组就清空销售小组的下拉框
            //     that.saleData[0].salesTeam = "";
            //   } else {
            //     that.saleData[0].salesTeam = that.salesGroup[0].id;
            //   }
            //   that.$set(that.saleData, 0, that.saleData[0]);
            // }
          });
        }
      });
    },
    // 查询默认收货地区
    findTerritory() {
      return new Promise((resolve) => {
        findTerritory().then((res) => {
          this.addressList = res.data.data;
          resolve(res.data.data);
        });
      });
    },
    // 查询运输方式
    findShipmentMethodType() {
      return new Promise((resolve) => {
        findShipmentMethodType().then((res) => {
          this.typeOfShipping = res.data.data;
          resolve(res.data.data);
        });
      });
    },
    // 查询贸易条款
    findTermType() {
      return new Promise((resolve) => {
        findTermType().then((res) => {
          this.tradeTerms = res.data.data;
          resolve(res.data.data);
        });
      });
    },
    // 查询发货仓库组织
    findFacility() {
      return new Promise((resolve) => {
        findFacility().then((res) => {
          this.deliveryWarehouseOrganization = res.data.data;
          resolve(res.data.data);
        });
      });
    },
    // 查询国家列表数据
    findCountryList() {
      return new Promise((resolve) => {
        findCountryList().then((res) => {
          this.country = res.data.data;
          resolve(res.data.data);
        });
      });
    },
    // 查询地址应用目的
    findAddressTypeList() {
      return new Promise((resolve) => {
        findAddressTypeList().then((res) => {
          this.purposeOfAddressApplication = res.data.data;
          resolve(res.data.data);
        });
      });
    },
    handleIndustrialPartyIdChange(IndustrialPartyId) {
      this.getsalesArea(IndustrialPartyId);
    },
    // 区域发生变化
    handleAreaChange(index, salesAreaPartyId) {
      this.saleData[index].salesPartyId = "";
      this.saleData[index].primarySalesRepId = "";
      this.saleData[index].salesTeam = "";
      this.getsalesParty(
        this.editForm.industrialPartyId,
        salesAreaPartyId,
        index
      );
    },
    // 销售公司发生变化
    handlePartyChange(index, partyId) {
      this.saleData[index].primarySalesRepId = "";
      this.saleData[index].salesTeam = "";
      this.getSalesRepresentative(partyId, index);
    },
    // 销售代表发生变化
    handleRepChange(index, repId) {
      this.saleData[index].salesTeam = "";
      this.getsalesTeam(repId, index);
    },
  },
};
</script>

<style lang='scss' scoped>
//滚动条的宽度
/deep/ ::-webkit-scrollbar {
  width: 10px;
  height: 20px;
}

//滚动条的滑块
/deep/ ::-webkit-scrollbar-thumb {
  width: 8px;
  height: 18px;
  background-color: #e4e7ea;
  border-radius: 3px;
}

.flexLAuto {
  // 两个display生效就可以了
  display: -webkit-flex;
  display: inline-flex;

  & > div {
    flex: 1;
  }

  & > label {
    color: #606266;
    white-space: nowrap;
    text-align: justify;
    padding: 0 10px;
    text-align-last: justify;
    position: absolute;
  }
}
</style>
