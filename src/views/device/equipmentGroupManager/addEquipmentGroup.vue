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
                <el-form-item label="分组类别" prop="groupTypeList">
                  <el-select
                    v-model="form.groupTypeList"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in EquipmentOptions"
                      :key="item.id"
                      :label="item.groupTypeName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分组名称" prop="groupName">
                  <el-input disabled="disabled" v-model="groupName">
                    <template> {{ getGroupName() }} </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="绑定设备" prop="equipmentType">
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
              </div>
              <el-form-item label="备注" prop="remarks" style="width: 66%">
                <el-form-item style="margin-left: 31px">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.remarks"
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-form-item>
            </div>
            <div class="sublevel">
              <div class="content">
                <div class="title-text">其他信息</div>
                <div class="basice-box">
                  <el-form-item label="排序号" prop="sort">
                    <el-input
                      v-model="form.sort"
                      :disabled="$route.query.id && !listState"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="是否有效" prop="isEffective">
                    <el-radio-group v-model="form.isEffective">
                      <el-radio :label="1">有效</el-radio>
                      <el-radio :label="0">无效</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="修改人"
                    prop="updateByUserName"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-input
                      v-model="form.updateByUserName"
                      disabled
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="修改时间"
                    prop="updateTime"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-input v-model="form.updateTime" disabled></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </el-form>
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
                  @change="changeRedios($event, scope.row)"
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
            <el-table-column
              type="index"
              label=""
              width="38"
              align="center"
              reserve-selection
            >
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
              label="所属组织"
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
                @change="changes"
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
            <el-form-item label="设备名称：">
              <el-input
                style="width: 217px"
                v-model="dialogformx.equipmentName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类型：">
              <el-select
                v-model="dialogformx.equipmentTypeList"
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
              :selectable="checkboxInit"
              label=""
              width="50"
              align="center"
              reserve-selection
            >
            </el-table-column>
            <!-- <el-table-column
              type="index"
              label=""
              placeholder="请选择"
              width="38"
              align="center"
            >
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowIdx"
                  :label="scope.row.id"
                  @change="changeRediox($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column> -->
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
              @size-change="handleSizeChangex"
              :total="totalx"
              :page-size="pageSizex"
              background
              @current-change="handlePageChangex"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="principalAddx">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { positionList } from "@/api/device/equipmentLocation";
import {
  queryEquipmentDropDownList,
  addEquipmentTemplate,
} from "@/api/device/equipmentGroup";
import { queryMainStationList } from "@/api/organization/allStation";
import { querySubStationList } from "@/api/organization/substation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  name: "operationStaging",
  data() {
    return {
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      focusMainDialogVisible: false,
      focusMainDialogVisibles: false,
      focusMainDialogVisiblex: false,
      listState: false,
      groupName: "",
      form: {
        isEffective: 1,
        mainStationId: "",
        subStationId: "",
        subStationName: "",
        mainStationName: "",
        groupTypeList: "",
        equipment: "",
        remarks:''
      },
      rules: {
        equipment: [
          {
            required: true,
            message: "请选择设备",
            trigger: ["blur", "change"],
          },
        ],
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
            message: "请输入所属子期",
            trigger: ["blur", "change"],
          },
        ],
        groupTypeList: [
          {
            required: true,
            message: "请选择分组类别",
            trigger: ["blur", "change"],
          },
        ],
      },
      totalx: 0,
      pageNumx: 1,
      pageSizex: 10,
      principaNum: "",
      tableData: [],
      tableDatas: [],
      tableDatax: [],
      changeRediod: {},
      changeRediods: {},
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
        subStationId: [],
      },
      equipmentType: [],
      name: "",
      EquipmentOptions: [],
      currentRowId: "",
      currentRowIds: "",
      currentRowIdx: "",
      currentRowIdlist: [],
      subStationOptions: [],
      mainStationOptions: [],
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
    };
  },
  mounted() {
    queryEquipmentDropDownList({ keyWord: "" }).then((res) => {
      this.EquipmentOptions = res.data.data;
    });
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
    checkboxInit() {
      if (
        this.dialogformx.mainStationId.length > 0 &&
        this.dialogformx.subStationId.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    changes() {
      this.$forceUpdate();
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
    handleSizeChangex(val) {
      this.pageSizex = val;
      this.searchData(2);
    },
    handlePageChangex(pageNum) {
      this.pageNumx = pageNum;
      this.searchData(2);
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
        subStationId: '',
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
            pageNum: this.pageNumx,
            pageSize: this.pageSizex,
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
        //子期
        querySubStationList(data).then((res) => {
          this.tableData = res.data.data.pageData;
          this.pageNum = res.data.data.pageNum;
          this.pageSize = res.data.data.pageSize;
        });
      } else if (num == 1) {
        //组织
        queryMainStationList(data).then((res) => {
          this.tableDatas = res.data.data.pageData;
          this.pageNum = res.data.data.pageNum;
          this.pageSize = res.data.data.pageSize;
        });
      } else {
        positionList(data).then((res) => {
          //设备
          this.tableDatax = res.data.data.pageData;
          this.tableDatax.forEach((ele) => {
            this.positionNames.forEach((item) => {
              if (ele.positionName === item) {
                this.$refs.equipmentRef.toggleRowSelection(ele, true);
              }
            });
          });
          this.pageNumx = res.data.data.pageNum;
          this.pageSizex = res.data.data.pageSize;
          this.totalx = res.data.data.total;
        });
      }
    },
    // 拼接
    getGroupName() {
      this.EquipmentOptions.filter((item) => {
        if (item.id == this.form.groupTypeList) {
          this.name = item.groupTypeName;
        }
      });
      this.groupName = this.form.mainStationName + this.name;
    },
    // 子期查询
    searchData(num) {
      if (num == 0) {
        this.getQueryStationList(
          {
            mainStationIdList:
              this.dialogform.mainStationId == ""
                ? []
                : [this.dialogform.mainStationId],
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
            equipmentTypeList: this.dialogformx.equipmentTypeList,
            manufactor: this.dialogformx.manufactor,
            equipmentModel: this.dialogformx.equipmentModel,
            pageNum: this.pageNumx,
            pageSize: this.pageSizex,
          },
          2
        );
      }
    },
    // 表格单选
    changeRedio(event, row) {
      this.changeRediod = row;
    },
    changeRedios(event, row) {
      this.changeRediods = row;
    },
    getRowKey(row) {
      return row.id;
    },
    handleSelectionChangex(val) {
      let newarr = [...new Set(val.map((item) => JSON.stringify(item)))].map(
        (item) => JSON.parse(item)
      );
      this.msId = [];
      this.msId = newarr;
      this.currentRowIdlist = [];
      let arr = [];
      let arr2 = [];
      val.forEach((v) => {
        arr.push(v.equipmentType);
        arr2.push(v.id);
      });
      this.currentRowIdlist = arr2;
      this.equipmentType = arr;
    },

    principalAddx() {
      if (this.msId[0] != undefined) {
        this.positionNames = [];
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
      this.$refs.equipmentRef.clearSelection();
    },
    // 新建
    compile() {
      this.$refs.form.validate((v) => {
        if (v) {
          addEquipmentTemplate({
            mainStationId: this.form.mainStationId,
            subStationId: this.form.subStationId,
            groupName: this.groupName,
            groupTypeId: this.form.groupTypeList,
            equipmentType: this.form.equipmentType,
            sort: this.form.sort,
            isEffective: this.form.isEffective,
            remarks: this.form.remarks,
          }).then((res) => {
            if (res.data.msg == "Success") {
              this.$message({
                message: "新增成功!",
                type: "success",
              });
              this.$router.push({ path: "./equipmentGroup" });
            } else {
              this.$message.error({
                message: res.data.msg,
                type: "warning",
              });
            }
            this.$router.push({ path: "./equipmentGroup" });
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