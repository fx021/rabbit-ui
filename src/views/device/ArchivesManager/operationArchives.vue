<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <!-- <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-upload2"
            @click="nameplateUpload"
            >铭牌上传
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            >{{ $route.query.id ? (listState ? "提交" : "编辑") : "新增" }}
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
          <el-button
            type="warning"
            size="small"
            plain
            icon="el-icon-upload2"
            v-if="$route.query.id"
            @click="handleExport"
            >导出
          </el-button>
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
                <el-form-item label="所属组织" prop="mainStationName">
                  <el-input
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                    @focus="focusMainStation(1)"
                    ref="mainStation1"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属子期" prop="subStationName">
                  <el-input
                    v-model="form.subStationName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                    @focus="focusMainStation(0)"
                    ref="mainStation0"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备名称" prop="equipmentName">
                  <el-input
                    v-model="form.equipmentName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
                <el-form-item label="产品编号" prop="equipmentCode">
                  <el-input
                    :disabled="$route.query.id"
                    v-model="form.equipmentCode"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备简称" prop="equipmentSimple">
                  <el-select
                    v-model="form.equipmentSimple"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equipmentAbbreviationOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备类型" prop="equipmentType">
                  <el-select
                    v-model="form.equipmentType"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equipmentTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备状态" prop="equipmentState">
                  <el-select
                    v-model="form.equipmentState"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in statusEquipmentOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备品牌" prop="manufactor">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.manufactor"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="规格型号" prop="equipmentModel">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.equipmentModel"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">详细信息</div>
              <div class="basice-box">
                <el-form-item label="出厂时间" prop="manufactureTime">
                  <el-date-picker
                    v-model="form.manufactureTime"
                    :disabled="$route.query.id && !listState"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="质保日期" prop="warrantyTime">
                  <el-date-picker
                    v-model="form.warrantyTime"
                    :disabled="$route.query.id && !listState"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="保养周期" prop="maintainCycle">
                  <el-select
                    v-model="form.maintainCycle"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in maintainCycleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="投产日期">
                  <el-date-picker
                    v-model="form.productionTime"
                    :disabled="$route.query.id && !listState"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="设备联系人" prop="contactsName">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.contactsName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactsPhone">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.contactsPhone"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <div class="uniline" style="width: 100%">
                  <el-form-item label="主要技术参数" prop="parameter">
                    <el-input
                      :disabled="$route.query.id && !listState"
                      v-model="form.parameter"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="设备铭牌" prop="imgList">
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
                          style="height: 146px"
                          alt=""
                        />
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-preview"
                            @click="handlePictureCardPreview(file)"
                          >
                            <i
                              :class="
                                file.url == './img/file1.png'
                                  ? 'el-icon-download'
                                  : 'el-icon-zoom-in'
                              "
                            ></i>
                          </span>
                          <span
                            v-if="!disabled"
                            class="el-upload-list__item-delete"
                            @click="handleRemove(file)"
                          >
                            <i class="el-icon-delete"></i>
                          </span>
                        </span>
                      </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="排序号" prop="sort">
                    <el-input
                      v-model="form.sort"
                      :disabled="$route.query.id && !listState"
                      oninput="value=value.replace(/[^0-9]/g,'')"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="备注" prop="remarks">
                    <el-input
                      v-model="form.remarks"
                      :disabled="$route.query.id && !listState"
                      placeholder="请输入内容"
                    ></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="修改人" prop="updateByUserName">
                  <el-input v-model="form.updateByUserName" disabled></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="updateTime">
                  <el-date-picker
                    v-model="form.updateTime"
                    disabled
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <div v-if="$route.query.id">
          <RoutingInspection :archivesId="$route.query.id" sign="record" />
          <MaintenanceRecord :archivesId="$route.query.id" sign="record"  />
        </div>
      </div>
    </el-card>
    <el-dialog
      title="选择所属子期"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform.subStationIdList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
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
            <el-form-item label="子期编码">
              <el-input
                v-model="dialogform.subStationCode"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="子期负责人：">
              <el-input
                placeholder="请输入"
                v-model="dialogform.subStationPersonName"
              ></el-input>
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
        <div class="content-table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowId"
                  :label="scope.row.id"
                  @change="changeRedio($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationCode"
              label="子期编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationPersonName"
              label="负责人"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="total"
              :page-size="pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible1"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="dialogform.mainStationIdList"
                multiple
                filterable
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
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
            <el-form-item label="隶属集团：">
              <el-select
                v-model="dialogform.ownerGroupList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in ownerGroupOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建设类型：">
              <el-select
                v-model="dialogform.constructionTypeList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in buildTypeOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
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
        <div class="content-table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowId"
                  :label="scope.row.mainStationId"
                  @change="changeRedio($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="mainStationName"
              label="所属组织"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mainStationCode"
              label="组织编码"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="constructionTypeName"
              label="建设类型"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="ownerGroupName"
              label="隶属集团"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <!-- <el-table-column
              prop="subStationName"
              label="所属子期"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationCode"
              label="子期编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationPersonName"
              label="负责人"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column> -->
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="total"
              :page-size="pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片弹窗 -->
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  archivesQueryList,
  archivesAdd,
  archivesEdit,
  archivesRemove,
} from "@/api/device/equipmentArchives";
import lrz from "lrz";
import { queryMainStationList } from "@/api/organization/allStation";
import { querySubStationList } from "@/api/organization/substation";
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import RoutingInspection from "@/components/table/routingInspection";
import MaintenanceRecord from "@/components/table/maintenanceRecord";

export default {
  name: "operationArchives",
  data() {
    return {
      listState: false,
      form: {
        imgList: [],
        subStationName: "",
        mainStationName: "",
      },
      rules: {
        mainStationName: [
          {
            required: true,
            message: "请输入所属组织",
            trigger: ["blur", "change"],
          },
        ],
        subStationName: [
          {
            required: true,
            message: "请输入所属子期",
            trigger: ["blur", "change"],
          },
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        equipmentName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        equipmentCode: [
          { required: true, message: "请输入产品编号", trigger: "blur" },
          // { validator: validateEquipmentCode, trigger: "blur" },
        ],
        equipmentSimple: [
          { required: true, message: "请选择设备简称", trigger: "change" },
        ],
        equipmentType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        equipmentState: [
          { required: true, message: "请选择设备状态", trigger: "change" },
        ],
        manufactor: [
          { required: true, message: "请输入设备品牌", trigger: "blur" },
        ],
        equipmentModel: [
          { required: true, message: "请输入规格型号", trigger: "blur" },
        ],
        warrantyTime: [
          { required: true, message: "请选择质保日期", trigger: "change" },
        ],
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      focusMainDialogVisible: false,
      focusMainDialogVisible1: false,
      // focusMainDialogVisible2: false,
      principaNum: "",
      tableData: [],
      changeRediod: {},
      dialogform: {
        subStationIdList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      currentRowId: "",
      maintainCycleOptions: [
        { label: "一个月", value: "1" },
        { label: "两个月", value: "2" },
        { label: "三个月", value: "3" },
        { label: "四个月", value: "4" },
        { label: "五个月", value: "5" },
        { label: "六个月", value: "6" },
        { label: "六个月", value: "7" },
        { label: "七个月", value: "8" },
        { label: "八个月", value: "9" },
        { label: "九个月", value: "10" },
        { label: "十个月", value: "11" },
        { label: "十二个月", value: "12" },
      ],
      dialogImageUrl: "",
      imgDialogVisible: false,
      equipmentAbbreviationOptions: JSON.parse(
        window.localStorage.getItem("equipmentAbbreviationOptions")
      ),
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      statusEquipmentOptions: JSON.parse(
        window.localStorage.getItem("statusEquipmentOptions")
      ),
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      buildTypeOptions: JSON.parse(
        window.localStorage.getItem("buildTypeOptions")
      ),
      pageNum: 1,
      pageSize: 10,
      btnshow: false,
    };
  },
  components: { RoutingInspection, MaintenanceRecord },
  // watch: {
  //   $route() {
  //     console.log(this.$route.path);
  //     if (this.$route.path == "/device/detailsMatrix" && this.$route.query.id) {
  //       this.getQueryStageDetail();
  //     } else {
  //       this.form.imgList = [];
  //     }
  //     this.listState = false;
  //   },
  // },
  mounted() {
    if (this.$route.query.id) this.getQueryStageDetail();
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
  },
  methods: {
    // 新建、提交
    compile() {
      if (this.btnshow) return this.$message.warning("正在上传图片");
      if (this.$route.query.id) {
        if (this.listState) {
          console.log("点击提交");
          this.formValidate("add");
        } else {
          console.log("点击编辑");
          this.listState = !this.listState;
        }
      } else {
        console.log("新增");
        this.formValidate("new");
      }
    },
    formValidate(data) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (data == "new") {
            archivesAdd(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({
                name: "设备档案",
                params: { refresh: true },
              });
            });
          } else {
            this.form.stageId = this.$route.query.id;
            archivesEdit(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({
                name: "设备档案",
                params: { refresh: true },
              });
              this.listState = !this.listState;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //子期弹窗
    focusMainStation(num) {
      this.principaNum = num;
      this.pageNum = 1;
      this.pageSize = 10;
      this.currentRowId = "";
      this.tableData = [];
      this.dialogform = [];
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = true;
        this.$refs.mainStation0.blur();
        this.getQuerySubStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 1) {
        this.focusMainDialogVisible1 = true;
        this.$refs.mainStation1.blur();
        this.getQueryMainStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
    },
    // 组织列表
    getQueryMainStationList(data) {
      queryMainStationList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 子站列表
    getQuerySubStationList(data) {
      console.log(data);
      querySubStationList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 查询
    searchData() {
      if (this.principaNum == 0) {
        this.getQuerySubStationList({
          subStationIdList: this.dialogform.subStationIdList,
          subStationCode: this.dialogform.subStationCode,
          subStationPersonName: this.dialogform.subStationPersonName,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 1) {
        this.getQueryMainStationList({
          constructionTypeList: this.dialogform.constructionTypeList,
          ownerGroupList: this.dialogform.ownerGroupList,
          mainStationIdList: this.dialogform.mainStationIdList,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
    },
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    // 表格单选
    changeRedio(event, row) {
      console.log("row", row);
      this.changeRediod = row;
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        archivesRemove({ idList: [this.$route.query.id] }).then(() => {
          this.$router.$avueRouter.closeTag();
          this.$router.push({ name: "设备档案", params: { refresh: true } });
        });
      });
    },
    // 添加
    principalAdd() {
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = false;
        this.form.desulfurizationElePrice =
          this.changeRediod.desulfurizationElePrice;
        this.form.subStationName = this.changeRediod.subStationName;
        this.form.subStationId = this.changeRediod.id;
      }
      if (this.principaNum == 1) {
        this.focusMainDialogVisible1 = false;
        console.log(this.changeRediod);
        this.form.mainStationId = this.changeRediod.mainStationId;
        this.form.mainStationName = this.changeRediod.mainStationName;
      }
    },
    // 详情
    getQueryStageDetail() {
      archivesQueryList({
        idList: [this.$route.query.id],
        pageNum: 1,
        pageSize: 10,
      }).then((res) => {
        console.log(res.data.data);
        if (res.data.data.pageData[0].imgList) {
          res.data.data.pageData[0].imgList.forEach((item) => {
            let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
            if (
              regular.test(
                item.fileName.split(".")[item.fileName.split(".").length - 1]
              )
            ) {
              item.url = this.imgUrl + item.fileId;
            } else {
              item.url = "./img/file1.png";
            }
          });
        }
        this.form = res.data.data.pageData[0];
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 添加图片
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      this.btnshow = true;
      // file.name.split('.')[1]
      let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
      if (regular.test(file.name.split(".")[file.name.split(".").length - 1])) {
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
            console.log(err);
          });
      } else {
        fileUpload(file.raw).then((res) => {
          res.data.data.url = "./img/file1.png";
          res.data.data.fileName = res.data.data.name;
          // res.data.data.url = this.imgUrl + res.data.data.fileId;
          res.data.data.status = "success";
          res.data.data.uid = fileList[fileList.length - 1].uid;
          fileList[fileList.length - 1] = res.data.data;
          this.form.imgList = fileList;
          this.btnshow = false;
        });
      }
    },
    // 图片删除
    handleRemove(file) {
      console.log(this.form.imgList);
      const i = this.form.imgList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.imgList.splice(i, 1);
    },
    // 图片预览
    handlePictureCardPreview(file) {
      if (file.url == "./img/file1.png") {
        fileDownload(file.fileId)
          .then((res) => {
            const link = document.createElement("a");
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel",
            });
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            console.log(res);
            // link.download = res.headers['content-disposition'] //下载后文件名
            link.download =
              file.name.split("/")[file.name.split("/").length - 1]; //下载的文件名
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
      } else {
        this.dialogImageUrl = file.url;
        this.imgDialogVisible = true;
      }
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/.el-upload-list__item {
  transition: none !important;
}
table {
  border-collapse: collapse;
  border-spacing: 0px;
  margin-left: 20px;
  th {
    text-align: right;
  }
}

.focus-main-dialog {
  .dialog-content {
    .content-title {
      display: flex;
      /deep/.el-button--medium {
        padding: 13px 20px;
        margin-left: 30px;
      }
      /deep/.el-tag.el-tag--info {
        max-width: 120px;
        overflow: hidden;
        position: relative;
        .el-select__tags-text {
          max-width: 90px;
          display: inline-block;
          overflow: hidden;
        }
        .el-tag__close {
          position: relative;
          top: -7px;
          right: 0;
        }
      }
    }
    .content-table {
      /deep/.el-table {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th {
                color: #333;
                background-color: #fafafa;
              }
            }
          }
        }
      }
    }
  }
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.add-dialog {
  .add-content {
    .add-title {
      margin-left: 20px;
      display: flex;
      .sertch-condition {
        margin-right: 20px;
      }
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }
  }
  /deep/ .el-dialog {
    width: 58%;
    .el-dialog__title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      word-wrap: break-word;
    }
    .el-dialog__body {
      .el-table--border {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th,
              tr {
                color: #333;
                background-color: #fafafa;
              }
            }
          }
        }
      }
    }
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
                .el-range-separator {
                  width: 7%;
                }
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
              .el-date-editor {
                width: 100%;
                .el-range-separator {
                  width: 7%;
                }
              }
              .el-textarea {
                width: 344.91 * 2.5+10px;
                margin-left: -10px;
              }
            }
          }
          .uniline {
            /deep/.el-form-item {
              width: 99%;
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