<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            >新增
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
                <el-form-item label="名称" prop="checkName">
                  <el-input placeholder="请输入名称" v-model="form.checkName">
                  </el-input>
                </el-form-item>
                <el-form-item label="所属组织" prop="mainStationName">
                  <el-input
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    @focus="focusMainStation(1)"
                    ref="mainStation1"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属子期" prop="subStationName">
                  <el-input
                    v-model="form.subStationName"
                    placeholder="请选择"
                    @focus="focusMainStation(0)"
                    ref="mainStation0"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备类型：">
                  <el-select
                    v-model="dialogformx.equipmentTypeList"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    @change="positionNames = []"
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
                <el-form-item label="关联设备" prop="equipmentType">
                  <div style="display: flex">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="
                        positionNames.length == 0
                          ? '暂无所选设备'
                          : '所选设备:' + positionNames.toString()
                      "
                      placement="top"
                    >
                      <el-input disabled="disabled" v-model="positionNames">
                      </el-input>
                    </el-tooltip>
                    <el-button
                      type="primary"
                      size="small"
                      plain
                      @click="focusMainStation(2)"
                      >请选择
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item label="是否有效：">
                  <el-select
                    v-model="form.chooseList"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in choose"
                      :key="item.key"
                      :label="item.key"
                      :value="item.key"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <!-- 添加 -->
        <div class="sublevel">
          <div class="content">
            <el-table
              ref="multipleTable"
              :data="tableDatat"
              tooltip-effect="dark"
              style="width: 100%"
              border
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="checkItemType"
                label="巡检类别"
                show-overflow-tooltip
                align="center"
              >
                <template scope="scope">
                  <el-select
                    v-model="scope.row.checkItemType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in checkCategoryOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="checkDatagId"
                label="数值记录"
                show-overflow-tooltip
                align="center"
                width="400"
              >
                <template scope="scope">
                  <el-input
                    @click.native="cout(scope.$index)"
                    v-model="scope.row.checkDatagId"
                    readonly
                    style="width: 300px"
                    placeholder="请输入"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="isFile"
                label="是否上传附件"
                show-overflow-tooltip
                align="center"
              >
                <template scope="scope">
                  <el-select
                    v-model="scope.row.isFile"
                    filterable
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in choose"
                      :key="item.id"
                      :label="item.key"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="checkContent"
                label="巡检内容"
                show-overflow-tooltip
                align="center"
                width="400"
              >
                <template scope="scope">
                  <el-input
                    v-model="scope.row.checkContent"
                    style="width: 300px"
                    placeholder="请输入"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    style="color: #f56c6c"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="add-box" @click="addRow">
              <i class="el-icon-plus"></i> 添加行
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 组织弹窗 -->
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisibles"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogforms"
            :model="dialogforms"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="隶属集团：">
              <el-select
                v-model="dialogforms.ownerGroupList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange1"
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
            <el-form-item label="组织编码">
              <el-input
                v-model="dialogforms.mainStationCode"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="负责人：">
              <el-input
                placeholder="请输入"
                v-model="dialogforms.mainStationPersonName"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData(1)"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table :data="tableDatas" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowIds"
                  :label="scope.row.mainStationId"
                  @change="changeRedioss($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="mainStationName"
              label="隶属集团"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mainStationCode"
              label="组织编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mainStationPersonName"
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
        <el-button @click="focusMainDialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="principalAdds">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 子期弹窗 -->
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
            <el-form-item label="所属组织：">
              <el-select
                v-model="dialogform.mainStationId"
                filterable
                allow-create
                @change="changes"
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChanges"
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
              @click="searchData(0)"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table
            :data="tableData"
            style="width: 100%"
            ref="equipmentRefs"
            row-key="id"
          >
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
              prop="subStationName"
              label="公司名称"
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
    <!-- 绑定设备弹窗 -->
    <el-dialog
      title="选择绑定设备"
      :visible.sync="focusMainDialogVisiblex"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogformx"
            :model="dialogformx"
            label-width="130px"
            style="display: flex; flex-wrap: wrap"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="dialogformx.mainStationId"
                filterable
                allow-create
                collapse-tags
                @change="changes"
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
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogformx.subStationId"
                filterable
                allow-create
                collapse-tags
                @change="changes"
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
            <el-form-item label="设备位置名称：">
              <el-input
                style="width: 217px"
                v-model="dialogformx.equipmentName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类型：">
              <el-select
                v-model="dialogformx.equipmentTypeList"
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
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
            <el-form-item label="设备品牌：" v-show="false">
              <el-input
                style="width: 217px"
                v-model="dialogformx.manufactor"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备型号：" v-show="false">
              <el-input
                style="width: 217px"
                v-model="dialogformx.equipmentModel"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData(2)"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table
            :data="tableDatax"
            style="width: 100%"
            ref="equipmentRef"
            @selection-change="handleSelectionChangex($event)"
            :row-key="getRowKey"
          >
            <el-table-column
              type="selection"
              label=""
              :selectable="checkboxInit"
              width="50"
              align="center"
              reserve-selection
            >
            </el-table-column>
            <el-table-column
              label="所属组织"
              prop="mainStationName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="positionName"
              label="设备位置名称"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="positionCode"
              label="设备位置编码"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="equipmentType"
              label="设备类型"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.equipmentType | filterOptions(equipmentTypeOptions)
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="方阵名称"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="manufactor"
              label="设备品牌"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="equipmentModel"
              label="规格型号"
              align="center"
              show-overflow-tooltip
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="principalAddx">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 数值记录弹窗 -->
    <el-dialog
      title="数值记录"
      :visible.sync="focusMainDialogVisiblet"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-table">
          <el-table
            :data="tableDatats"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              label=""
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column label="名称" prop="daName" align="center">
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center">
            </el-table-column>
            <el-table-column
              prop="daValue"
              label="默认值"
              align="center"
              show-overflow-tooltip
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
        <el-button @click="focusMainDialogVisiblet = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let indexs = 0;
import { queryCheckDatagList } from "@/api/device/InspectionContents";
import { positionList } from "@/api/device/equipmentLocation";
import { addEquipmentTemplate } from "@/api/device/InspectionContents";
import { queryMainStationList } from "@/api/organization/allStation";
import { querySubStationList } from "@/api/organization/substation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  name: "operationStaging",
  data() {
    return {
      tableDatat: [
        {
          checkItemType: "",
          checkDatagId: "",
          isFile: "1",
          checkDatagIds: [],
          equipmentType: "",
          checkContent: "",
        },
      ],
      choose: [
        { key: "是", id: "1" },
        { key: "否", id: "0" },
      ],
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      focusMainDialogVisible: false,
      focusMainDialogVisibles: false,
      focusMainDialogVisiblex: false,
      focusMainDialogVisiblet: false,
      listState: false,
      getsubid: "",
      form: {
        mainStationId: "",
        equipmentTypeList: "",
        chooseList: "是",
        subStationIds: [],
        isEffective: 1,
        subStationId: "",
        subStationName: "",
        mainStationName: "",
        equipment: "",
      },
      rules: {
        mainStationName: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: ["blur", "change"],
          },
        ],
        subStationName: [
          {
            required: true,
            message: "请选择所属子期",
            trigger: ["blur", "change"],
          },
        ],
      },
      principaNum: "",
      tableData: [],
      tableDatas: [],
      tableDatats: [],
      tableDatax: [],
      changeRediods: {},
      changeRediodx: {},
      changeRediod: {},
      pageNum: 1,
      pageSize: 10,
      dialogform: {
        mainStationId: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      dialogforms: {
        ownerGroupList: "",
        mainStationPersonName: "",
        mainStationCode: "",
      },
      dialogformx: {
        ownerGroupList: "",
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: "",
        subStationId: "",
        equipmentTypeList: "",
      },
      name: "",
      currentRowId: "",
      currentRowIds: "",
      currentRowIdx: "",
      subStationOptions: [],
      mainStationOptions: [],
      currentRowIdlist: [],
      currentRowIdlists: [],
      multipleSelections: "",
      getmainStationId: "",
      getsubStationIdx: "",
      msId: "",
      positionNames: [],
      getsubStationId: "",
      clear: false,
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      checkCategoryOptions: JSON.parse(
        window.localStorage.getItem("checkCategoryOptions")
      ),
    };
  },
  mounted() {
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
  },
  filters: {
    filterOptions: function (value, optionList) {
      let str = optionList.find((res) => {
        return res.dictKey == value;
      });
      if (str) {
        return str.dictValue;
      } else {
        return value;
      }
    },
  },
  methods: {
    cancel() {
      this.focusMainDialogVisiblex = false;
      this.$refs.equipmentRef.clearSelection();
    },
    filterOption(value, optionList) {
      let str = optionList.find((res) => {
        return res.id == value;
      });
      if (str) {
        return str.mainStationName;
      } else {
        return value;
      }
    },
    //数值记录的确认
    sure() {
      this.focusMainDialogVisiblet = false;
      let arr = [];
      let arr2 = [];
      this.multipleSelections.forEach((item) => {
        arr.push(item.daName);
        arr2.push(item.id);
      });
      this.tableDatat[indexs].checkDatagId = arr.toString();
      this.tableDatat[indexs].checkDatagIds = arr2;
    },
    handleSelectionChange(val) {
      this.multipleSelections = val;
    },
    //数值记录点击行
    cout(index) {
      this.focusMainDialogVisiblet = true;
      queryCheckDatagList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableDatats = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
      indexs = index;
      console.log(index);
    },
    addRow() {
      console.log(this.dialogformx.equipmentTypeList, "xxxxx");
      this.tableDatat.push({
        checkItemType: "",
        checkDatagId: "",
        checkDatagIds: [],
        isFile: "1",
        checkContent: "",
        equipmentType: this.dialogformx.equipmentTypeList,
      });
    },
    handleDelete(index) {
      this.tableDatat.splice(index, 1);
    },
    //弹窗
    focusMainStation(num) {
      if (this.currentRowId != "") {
        this.currentRowId = this.getsubStationIdx;
      }
      this.currentRowIds = this.getmainStationId;
      this.dialogform = {
        mainStationId: "",
        subStationPersonName: "",
        subStationCode: "",
      };
      this.dialogforms = {
        ownerGroupList: "",
        mainStationPersonName: "",
        mainStationCode: "",
      };
      this.dialogformx = {
        ownerGroupList: "",
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: "",
        subStationId: "",
        equipmentTypeList: this.dialogformx.equipmentTypeList,
      };
      this.principaNum = num;
      this.tableData = [];
      if (this.getmainStationId) {
        this.dialogform.mainStationId = this.getmainStationId;
        this.dialogformx.mainStationId = this.getmainStationId; //设备组织的
      }
      if (this.getsubStationIdx) {
        this.dialogformx.subStationId = this.getsubStationIdx;
        this.currentRowId = this.getsubStationIdx;
      }
      if (this.principaNum == 0) {
        //子期
        this.focusMainDialogVisible = true;
        this.$refs.mainStation0.blur();
        this.getQueryStationList(
          {
            mainStationIdList:
              this.dialogform.mainStationId == ""
                ? []
                : [this.dialogform.mainStationId], //组织带过来的
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          0
        );
      } else if (this.principaNum == 2) {
        //设备
        this.focusMainDialogVisiblex = true;
        this.getQueryStationList(
          {
            mainStationIdList:
              this.dialogform.mainStationId == ""
                ? []
                : [this.dialogform.mainStationId],
            subStationIdList: [this.dialogformx.subStationId],
            equipmentTypeList: [this.dialogformx.equipmentTypeList],
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          2
        );
      } else {
        //组织
        this.focusMainDialogVisibles = true;
        this.$refs.mainStation1.blur();
        this.getQueryStationList(
          {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          1
        );
      }
    },
    getQueryStationList(data, num) {
      if (num == 0) {
        querySubStationList(data).then((res) => {
          this.tableData = res.data.data.pageData;
          this.pageNum = res.data.data.pageNum;
          this.pageSize = res.data.data.pageSize;
          this.total = res.data.data.total;
        });
      } else if (num == 1) {
        queryMainStationList(data).then((res) => {
          this.tableDatas = res.data.data.pageData;
          this.pageNum = res.data.data.pageNum;
          this.pageSize = res.data.data.pageSize;
          this.total = res.data.data.total;
        });
      } else {
        positionList(data).then((res) => {
          // console.log(this.currentRowIdlists, "需要回显的");
          //设备
          this.tableDatax = res.data.data.pageData;
          this.pageNumx = res.data.data.pageNum;
          this.pageSizex = res.data.data.pageSize;
          this.totalx = res.data.data.total;
          this.tableDatax.forEach((ele) => {
            this.positionNames.forEach((item) => {
              if (ele.positionName === item) {
                this.$refs.equipmentRef.toggleRowSelection(ele, true);
              }
            });
          });
        });
      }
    },
    // 子期查询
    searchData(num) {
      if (num == 0) {
        this.getQueryStationList(
          {
            mainStationIdList: [this.dialogform.mainStationId],
            subStationCode: this.dialogform.subStationCode,
            subStationPersonName: this.dialogform.subStationPersonName,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          0
        );
      } else if (num == 1) {
        this.getQueryStationList(
          {
            ownerGroupList: this.dialogforms.ownerGroupList,
            mainStationCode: this.dialogforms.mainStationCode,
            mainStationPersonName: this.dialogforms.mainStationPersonName,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          1
        );
      } else {
        this.$refs.equipmentRef.clearSelection();
        this.positionNames = [];
        this.getQueryStationList(
          {
            mainStationIdList: [this.dialogformx.mainStationId],
            subStationIdList: [this.dialogformx.subStationId],
            equipmentName: this.dialogformx.equipmentName,
            equipmentTypeList: [this.dialogformx.equipmentTypeList],
            manufactor: this.dialogformx.manufactor,
            equipmentModel: this.dialogformx.equipmentModel,
            pageNum: this.pageNumx,
            pageSize: this.pageSizex,
          },
          2
        );
      }
    },
    changes() {
      this.$forceUpdate();
    },
    checkboxInit() {
      if (
        this.dialogformx.mainStationId != "" &&
        this.dialogformx.equipmentTypeList != "" &&
        this.dialogformx.subStationIds != ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 表格单选
    changeRedio(event, row) {
      this.changeRediod = row;
    },
    changeRedioss(event, row) {
      this.changeRediods = row;
    },
    getRowKey(row) {
      return row.id;
    },
    handleSelectionChangex(val) {
      this.currentRowIdlists = [];
      let newarr = [...new Set(val.map((item) => JSON.stringify(item)))].map(
        (item) => JSON.parse(item)
      );
      this.msId = [];
      this.msId = newarr;
      this.currentRowIdlist = [];
      let arr = [];
      let arr2 = [];
      let arr3 = [];
      val.forEach((v) => {
        arr.push(v.equipmentType);
        arr2.push(v.id);
        arr3.push({
          id: "",
          mainStationId: v.mainStationId,
          subStationIds: v.subStationId,
          positionId: v.id,
        });
      });
      this.changeRediodx = arr3;
      this.currentRowIdlist = arr2;
      this.equipmentType = arr;
    },
    // 新建
    compile() {
      console.log(constructor);
      this.$refs.form.validate((v) => {
        if (v) {
          console.log(this.form.changeRediodx);
          addEquipmentTemplate({
            mainStationId: this.form.mainStationId,
            subStationIds: [this.form.subStationId],
            subStationId: this.form.subStationId.toString(),
            checkName: this.form.checkName,
            equipmentType: this.dialogformx.equipmentTypeList,
            isEffective: this.form.chooseList.toString() == "是" ? 1 : 0,
            addEquipmentCheckItemRequestList: this.tableDatat,
            addEquipmentCheckPositionRequestList: this.form.changeRediodx,
          }).then((res) => {
            console.log(res);
            if (res.data.code == "200") {
              this.$message({
                message: "新增成功!",
                type: "success",
              });
              this.$router.push({ path: "./InspectionContents" });
            } else {
              this.$message.error("新增失败");
            }
          });
        }
      });
    },
    // 添加
    principalAdd() {
      //子期
      this.focusMainDialogVisible = false;
      if (this.changeRediod.hasOwnProperty("mainStationId")) {
        this.form.subStationName = this.changeRediod.subStationName;
        this.form.subStationId = this.changeRediod.id;
        this.form.mainStationId = this.changeRediod.mainStationId;
        this.getsubStationId = this.changeRediod.mainStationId;
        this.getsubStationIdx = this.changeRediod.id; //设备那边的所属子期
        this.positionNames = [];
        if (this.getsubStationId != "") {
          this.form.mainStationName = this.filterOption(
            this.getsubStationId,
            this.mainStationOptions
          );
          this.getmainStationId = this.getsubStationId;
        }
      }
    },
    visibleChange(val) {
      if (!val) {
        this.searchData(2);
      }
    },
    visibleChanges(val) {
      if (!val) {
        this.searchData(0);
      }
    },
    visibleChange1(val) {
      if (!val) {
        this.searchData(1);
      }
    },
    principalAdds() {
      //组织
      this.focusMainDialogVisibles = false;
      if (this.changeRediods.hasOwnProperty("mainStationId")) {
        this.form.mainStationName = this.changeRediods.mainStationName;
        this.form.mainStationId = this.changeRediods.mainStationId;
        this.getmainStationId = this.changeRediods.mainStationId;
        this.form.subStationName = "";
        this.getsubStationIdx = "";
        if (this.clear) {
          this.$refs.equipmentRef.clearSelection();
        }
        this.currentRowId = "";
        this.positionNames = [];
      }
    },
    principalAddx() {
      this.positionNames = [];
      if (this.msId[0] != undefined) {
        this.msId.forEach((v) => {
          this.positionNames.push(v.positionName);
        });
        this.form.mainStationName = this.filterOption(
          this.msId[this.msId.length - 1].mainStationId,
          this.mainStationOptions
        );
        this.form.mainStationId = this.msId[this.msId.length - 1].mainStationId;
        this.form.subStationId = this.msId[this.msId.length - 1].subStationId;
        this.form.subStationName =
          this.msId[this.msId.length - 1].subStationName;
        this.getsubStationIdx = this.msId[this.msId.length - 1].subStationId;
        this.getmainStationId = this.msId[this.msId.length - 1].mainStationId;
      }
      this.focusMainDialogVisiblex = false;
      this.form.equipmentType = [...new Set(this.currentRowIdlist)].toString();
      this.form.changeRediodx = this.changeRediodx;
      this.$refs.equipmentRef.clearSelection();
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/.el-input__inner {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/deep/.el-upload-list__item {
  transition: none !important;
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
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
    }
    .content-table {
      /deep/.el-table {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th {
                background-color: #fafafa;
              }
            }
          }
        }
      }
    }
  }
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
        // border-bottom: 1px solid #b3d8ff;
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
        // border-bottom: 1px solid #b3d8ff;
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