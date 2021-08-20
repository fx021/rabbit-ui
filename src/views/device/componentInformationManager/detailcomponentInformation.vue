<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-checked"
            @click="useSubperiodQuery"
            >使用子期查询
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            >编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            plain
            class="el-icon-delete"
            v-if="$route.query.id"
            @click.stop="deletes"
            >删除</el-button
          >
          <!-- //!无导出 -->
        </div>
      </div>
      <div class="main">
        <el-form
          ref="form"
          :model="form"
          :rules="!($route.query.id && !listState) ? rules : ''"
          label-width="162px"
          label-position="right"
        >
          <div class="basics">
            <div class="content">
              <div class="title">基础信息</div>
              <div class="basice-box">
                <el-form-item label="组件厂家" prop="manufactor">
                  <el-select
                    v-model="form.manufactor"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in panelFactoryOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="组件型号" prop="componentModel">
                  <el-input
                    v-model="form.componentModel"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="功率" prop="power">
                  <el-input
                    v-model="form.power"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="组件分类" prop="componentType">
                  <el-select
                    v-model="form.componentType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in componentTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="封装形式" prop="packageType">
                  <el-select
                    v-model="form.packageType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in packageTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发电形式" prop="powerType">
                  <el-select
                    v-model="form.powerType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in powerTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="长(m)" prop="length">
                  <el-input
                    v-model="form.length"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="宽(m)" prop="width">
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.width"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="组件材料" prop="componentMaterials">
                  <el-select
                    v-model="form.componentMaterials"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in componentMaterialsOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="最大电压(v)" prop="maxVoltage">
                  <el-input
                    v-model="form.maxVoltage"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="工作温度(°C)" prop="temperature">
                  <el-input
                    v-model="form.temperature"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最大风载/最大雪载(pa)" prop="maxLoad">
                  <el-input
                    v-model="form.maxLoad"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="最大保险丝额定电流(A)"
                  prop="maxElectricCurrent"
                >
                  <el-input
                    v-model="form.maxElectricCurrent"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="额定电池工作温度(℃)"
                  prop="batteryTemperature"
                >
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.batteryTemperature"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最大功率Pmp温度系数" prop="pmpCoefficient">
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.pmpCoefficient"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="开路电压Voc温度系数" prop="vocCoefficient">
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.vocCoefficient"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="短路电流Isc温度系数" prop="iscCoefficient">
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.iscCoefficient"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电池片规格" prop="batterySpecification">
                  <el-input
                    v-model="form.batterySpecification"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="组件电池片数量" prop="batterySize">
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.batterySize"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item label="附件" prop="imgList">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :file-list="form.imgList"
                  :on-change="handleChange"
                >
                  <!-- :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                      :on-preview="handlePreview" -->
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt=""
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="basice-box" style="margin-left: 0px">
                <table class="basice-table" style="margin-left: 0px">
                  <tr class="table-title">
                    <th style="width: 200px">电学参数</th>
                    <th>辐射强度（W/m²）</th>
                    <th>最大功率Pmp(W)</th>
                    <th>最大功率点工作电压Vmp(V)</th>
                    <th>最大功率点工作电流Imp(A)</th>
                    <th>开路电压Voc(V)</th>
                    <th>短路电流Isc(A)</th>
                    <th>组件效率(%)</th>
                  </tr>
                  <tr
                    class="table-content"
                    v-for="item in componentParamList"
                    :key="item.id"
                  >
                    <td>
                      <template>
                        {{ item.paramName }}
                      </template>
                    </td>
                    <td>
                      <el-input
                        v-model="item.radiation"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        v-model="item.maxPmp"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.maxVmp"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.maxImp"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.voc"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.isc"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 200px; padding: 0">
                      <el-input
                        v-model="item.efficiency"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">其他信息</div>
              <div class="basice-box">
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="isEffective">
                  <el-radio-group v-model="form.isEffective">
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="修改人" prop="updateByUserName">
                  <el-input v-model="form.updateByUserName" disabled></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="updateTime">
                  <el-input v-model="form.updateTime" disabled></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 预览图片弹窗 -->
    <el-dialog :visible.sync="imgDialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <!-- 使用子期查询的弹窗 -->
    <el-dialog
      title="使用子期查询"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div>
        <div style="display: flex; justify-content: space-between">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="dialogform.mainStationOptions"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in mainStationOptions"
                  :key="item.id"
                  :label="item.mainStationName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform.subStationOptions"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in subStationOptions"
                  :key="item.subStationId"
                  :label="item.subStationName"
                  :value="item.subStationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData"
              >查询</el-button
            >
          </div>
        </div>
        <div class="contents">
          <div class="content-titles">
            <div class="lefts" ref="UI">
              <span style="font-size: 14px">排序：</span>
              <el-button type="primary" size="small" plain @click="sort(0)"
                >所属组织<span class="caret-wrapper">
                  <i
                    class="sort-caret ascending"
                    :style="{
                      borderBottomColor:
                        sort1 == 'no' ? '' : sort1 ? '' : colorName,
                    }"
                  ></i>
                  <i
                    class="sort-caret descending"
                    :style="{
                      borderTopColor:
                        sort1 == 'no' ? '' : sort1 ? colorName : '',
                    }"
                  ></i
                ></span>
              </el-button>
              <el-button type="primary" size="small" plain @click="sort(1)"
                >排序号<span class="caret-wrapper">
                  <i
                    class="sort-caret ascending"
                    :style="{
                      borderBottomColor:
                        sort2 == 'no' ? '' : sort2 ? '' : colorName,
                    }"
                  ></i>
                  <i
                    class="sort-caret descending"
                    :style="{
                      borderTopColor:
                        sort2 == 'no' ? '' : sort2 ? colorName : '',
                    }"
                  ></i
                ></span>
              </el-button>
            </div>
            <div class="right">
              <el-button
                type="warning"
                size="small"
                plain
                icon="el-icon-download"
                @click="handleExport"
                >导出
              </el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            height="600"
          >
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="所属组织"
              prop="mainStationName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="所属子期"
              prop="subStationName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="useSize"
              label="数量"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="pagination">
          <el-pagination
            layout="total,prev,pager,next"
            :total="total"
            :page-size="pageSize"
            background
            :current-page.sync="current"
            @current-change="handlePageChange"
          ></el-pagination>
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { imgUpload } from "@/api/upload/upload";
import {
  queryComponentParamsList,
  queryComponentTemplateList,
  editComponentTemplate,
  removeComponentTemplate,
} from "@/api/device/componentInformation";
import lrz from "lrz";
import {
  queryComponentList,
  exportComponentAccountList,
} from "@/api/device/componentAccount";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { mapGetters } from "vuex";
import {} from "@/api/organization/substation";
export default {
  name: "detailcomponentInformation",
  data() {
    return {
      componentMaterialsOptions: JSON.parse(
        window.localStorage.getItem("componentMaterialsOptions")
      ),
      componentTypeOptions: JSON.parse(
        window.localStorage.getItem("componentTypeOptions")
      ),
      powerTypeOptions: JSON.parse(
        window.localStorage.getItem("powerTypeOptions")
      ),
      packageTypeOptions: JSON.parse(
        window.localStorage.getItem("packageTypeOptions")
      ),
      panelFactoryOptions: JSON.parse(
        window.localStorage.getItem("panelFactoryOptions")
      ),
      focusMainDialogVisible: false,
      dialogImageUrl: "",
      imgDialogVisible: false,
      listState: false,
      componentParamList: [
        {
          id: "0",
          paramName: "STC", //电学参数
          radiation: "", //辐射强度（W/m²）
          maxPmp: "", //最大功率Pmp(W)
          maxVmp: "", //最大功率点工作电压Vmp(V)
          maxImp: "", //最大功率点工作电流Imp(A)
          voc: "", //开路电压Voc(V)
          isc: "", //短路电流Isc(A)
          efficiency: "", //组件效率(%)
        },
        {
          id: "0",
          paramName: "NOTC", //电学参数
          radiation: "", //辐射强度（W/m²）
          maxPmp: "", //最大功率Pmp(W)
          maxVmp: "", //最大功率点工作电压Vmp(V)
          maxImp: "", //最大功率点工作电流Imp(A)
          voc: "", //开路电压Voc(V)
          isc: "", //短路电流Isc(A)
          efficiency: "", //组件效率(%)
        },
      ],
      pageNum: 1,
      pageSize: 10,
      sort1: "no",
      sort2: "no",
      form: {},
      rules: {
        manufactor: [
          {
            required: true,
            message: "请输入组件厂家",
            trigger: ["blur", "change"],
          },
        ],
        componentModel: [
          { required: true, message: "请输入组件型号", trigger: "blur" },
        ],
        power: [{ required: true, message: "请输入功率", trigger: "blur" }],
        componentType: [
          { required: true, message: "请选择组件分类", trigger: "change" },
        ],
        packageType: [
          { required: true, message: "请选择封装形式", trigger: "change" },
        ],
        powerType: [
          { required: true, message: "请选择发电形式", trigger: "change" },
        ],
        length: [{ required: true, message: "请输入长度", trigger: "blur" }],
        width: [{ required: true, message: "请输入宽度", trigger: "blur" }],
        componentMaterials: [
          { required: true, message: "请选择组件材料", trigger: "change" },
        ],
        isEffective: [
          { required: true, message: "请选择是否有效", trigger: "change" },
        ],
      },
      subStationOptions: [],
      mainStationOptions: [],
      tableData: [],
      dialogform: {},
      queryForm: {},
      orderColumn: "",
      orderType: "",
      currentRowId: "",
    };
  },
  computed: {
    ...mapGetters(["colorName"])
  },
  watch: {
    $route() {
      if (this.$route.query.id) this.getQueryStageDetail();
      this.listState = false;
    },
  },
  mounted() {
    if (this.$route.query.id) this.getQueryStageDetail();
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
  },
  methods: {
    // 编辑
    compile() {
      this.form.componentParamList = this.componentParamList;
      editComponentTemplate(this.form).then((res) => {
        if (res.data.msg == "Success") {
          this.$message({
            message: "编辑成功!",
            type: "success",
          });
          this.$router.push({ path: "./componentInformation" });
        } else {
          this.$message.error({
            message: res.data.msg,
            type: "success",
          });
        }
      });
    },

    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        removeComponentTemplate({ idList: [this.$route.query.id] }).then(() => {
          this.$router.push({ path: "./componentInformation" });
        });
      });
    },
    // 组件信息详情返回的
    getQueryStageDetail() {
      queryComponentTemplateList({}).then((res) => {
        let arr = res.data.data.pageData;
        arr.filter((item) => {
          if (item.id == this.$route.query.id) {
            this.queryForm = JSON.parse(JSON.stringify(item));
            if (item.imgList) {
              item.imgList.forEach((items) => {
                items.url = this.imgUrl + items.fileId;
              });
            }
            this.form = item;
          }
        });
        queryComponentParamsList({ componentId: this.$route.query.id }).then(
          (res) => {
            this.componentParamList = res.data.data;
          }
        );
      });
    },
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      this.btnshow = true;
      lrz(file.raw)
        .then((file) => {
          imgUpload(file.origin).then((res) => {
            res.data.data.url = this.imgUrl + res.data.data.fileId;
            res.data.data.status = "success";
            res.data.data.uid = fileList[fileList.length - 1].uid;
            fileList[fileList.length - 1] = res.data.data;
            this.form.imgList = fileList;
            this.btnshow = false;
          });
        })
        .catch(function (err) {
          // 处理失败会执行
        });
    },
    // 图片删除
    handleRemove(file) {
      const i = this.form.imgList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.imgList.splice(i, 1);
    },
    // 图片预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    //使用子期查询
    useSubperiodQuery() {
      this.focusMainDialogVisible = true;
      queryComponentList({
        manufactor: [this.queryForm.manufactor],
        componentModel: this.queryForm.componentModel,
        power: this.queryForm.power,
        packageType: [this.queryForm.packageType],
        powerType: [this.queryForm.powerType],
        componentType: [this.queryForm.componentType],
        componentMaterials: [this.queryForm.componentMaterials],
        orderColumn: this.orderColumn,
        orderType: this.orderType,
      }).then((res) => {});
    },
    //排序
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : this.sort1 == true
          ? (this.sort1 = "no")
          : (this.sort1 = true);
        this.orderColumn = this.sort1 == "no" ? "" : "main_station_id";
        this.orderType = this.sort1 == "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      if (num == 1) {
        this.sort1 = "no";
        this.sort2 == "no"
          ? (this.sort2 = false)
          : this.sort2 == true
          ? (this.sort2 = "no")
          : (this.sort2 = true);
        this.orderColumn = this.sort2 == "no" ? "" : "sort";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportComponentAccountList({
        idList: this.multipleSelection,
        mainStationId: this.form.mainStationIdList, //所属组织
        subStationId: this.form.subStationIdList, //所属子期
        manufactor: this.form.manufactorList, //组件厂家(模糊查询)
        componentModel:
          this.form.componentModel == undefined
            ? null
            : this.form.componentModel, //组件型号
        power: this.form.power == undefined ? null : this.form.power, //功率
        packageType: this.form.packageTypeList, //封装形式
        powerType: this.form.powerTypeList, //发电形式
        componentType: this.form.componentTypeList, //组件分类
        componentMaterials: this.form.componentMaterialsList, //组件材料
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "使用子期查询.xls"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(() => {
          this.$Notice.error({
            title: "错误",
            desc: "网络连接错误",
          });
        });
    },
    //子期查询  查询
    searchData() {
      queryComponentList({
        mainStationId: this.dialogform.mainStationId,
        subStationId: this.dialogform.subStationId,
        manufactor: [this.queryForm.manufactor],
        componentModel: this.queryForm.componentModel,
        power: this.queryForm.power,
        packageType: [this.queryForm.packageType],
        powerType: [this.queryForm.powerType],
        componentType: [this.queryForm.componentType],
        componentMaterials: [this.queryForm.componentMaterials],
      }).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/.el-upload-list__item {
  transition: none !important;
}
.caret-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  // height: 34px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
}
.sort-caret.ascending {
  border-bottom-color: #c0c4cc;
  top: -12px;
}
.sort-caret {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  position: absolute;
  left: 7px;
}
.descending .sort-caret.descending {
  border-top-color: #409eff;
}
.sort-caret.descending {
  border-top-color: #c0c4cc;
  // bottom: 7px;
}
.sort-caret {
  width: 0;
  height: 0;
  border: 5px solid transparent;
  position: absolute;
  left: 7px;
}
.contents {
  .content-titles {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .lefts {
      /deep/.el-button--primary.is-plain:focus,
      .el-button--primary.is-plain:hover {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
}
table {
  border-collapse: collapse;
  border-spacing: 0px;
  margin-left: 20px;
  th {
    text-align: right;
  }
}
.operation-staging {
  .details-title {
    width: 100%;
    .right {
      display: flex;
      justify-content: flex-end;
    }
  }
  .main {
    margin: 10px 0;
    color: #606266;
    .basics {
      .content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-top: 1px solid #b3d8ff;
        border-bottom: 1px solid #b3d8ff;
        padding-top: 20px;
        padding-bottom: 20px;
        // .upload-box {
        //   width: 87%;
        // }
        .title {
          width: 100%;
          text-align: left;
          padding: 10px 16px 26px;
          font-size: 20px;
          font-weight: bold;
        }
        .basice-box {
          display: flex;
          flex-wrap: wrap;
          margin-left: 20px;
          /deep/.el-form-item {
            display: flex;
            width: 33%;
            .el-form-item__label {
              padding: 10px;
              text-align: right;
              font-size: 14px;
              color: #606266;
              line-height: 40px;
              padding: 0 12px 0 0;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              width: 150px;
              display: block;
              font-weight: bold;
            }
            .el-form-item__content {
              margin: 0 !important;
              margin-left: 10px !important;
              width: calc(100% - 183.41px);
              .el-cascader {
                width: 100%;
              }
              .el-select {
                width: 100%;
              }
              .el-date-editor {
                width: 100%;
              }
              .el-textarea {
                width: 344.91 * 2.5+10px;
              }
            }
          }
          .location {
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
              color: #409eff;
              font-size: 21px;
              margin-left: 5px;
            }
            .el-form-item {
              width: 100%;
            }
          }
        }
      }
    }
    .sublevel {
      margin-top: -1px;
      .content {
        border-bottom: 1px solid #b3d8ff;
        .title-text {
          width: 100%;
          text-align: left;
          padding: 10px 16px 26px;
          font-size: 20px;
          font-weight: bold;
        }
        .basice-box {
          display: flex;
          flex-wrap: wrap;
          margin-left: 20px;
          /deep/.el-form-item {
            display: flex;
            width: 33%;
            .el-form-item__label {
              padding: 10px;
              text-align: right;
              font-size: 14px;
              color: #606266;
              line-height: 40px;
              padding: 0 12px 0 0;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              width: 150px;
              display: block;
              font-weight: bold;
            }
            .el-form-item__content {
              margin: 0 !important;
              margin-left: 10px !important;
              width: calc(100% - 183.41px);
              .el-cascader {
                width: 100%;
              }
              .el-select {
                width: 100%;
              }
              .el-textarea {
                width: 344.91 * 2.5+10px;
                margin-left: -10px;
              }
            }
          }
          .basice-table {
            width: 100%;
            margin-bottom: 30px;
            .table-title {
              background-color: #fafafa;
              th {
                text-align: center;
                border: 1px solid #ebeef5;
                border-radius: 5px;
                padding: 12px 0;
                min-width: 0;
                padding-right: 10px;
                padding-left: 10px;
                font-size: 14px;
                color: #909399;
              }
            }
            .table-content {
              td {
                text-align: center;
                border: 1px solid #ebeef5;
                padding: 12px 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                font-size: 14px;
                color: #606266;
                /deep/.el-input__inner {
                  // border: 1px solid transparent;
                }
              }
            }
          }
        }
      }
      /deep/.el-table th,
      .el-table tr {
        background-color: #fafafa;
      }
      .add-box {
        text-align: center;
        width: 100%;
        border: 1px solid #409eff;
        border-radius: 5px;
        color: #409eff;
        padding: 10px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
</style>