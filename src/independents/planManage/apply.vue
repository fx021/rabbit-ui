<template>
  <div>
    <el-card class="box-card">
      <div class="details-title" v-if="!processInstanceId">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="handleProcess"
            v-if="processInfo.isCurrentNodeOperator === 'true'"
            >流程处理
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="!$route.query.id"
            icon="el-icon-plus"
            @click="compile"
            >{{ $route.query.id ? (listState ? "提交" : "编辑") : "新增" }}
          </el-button>
        </div>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        size="mini"
        style="margin-top: 10px"
      >
        <table border class="table-box" bordercolor="#d2d2d2">
          <tr>
            <td>申请标题</td>
            <td colspan="5">
              <el-form-item label="" prop="title">
                <!-- <el-input v-model="form.title"></el-input> -->
                <div class="detail-item">{{ form.title }}</div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>申请编号</td>
            <td colspan="3">
              <div class="detail-item">{{ form.excludeCode }}</div>
            </td>
            <td>计划编号</td>
            <td>
              <div class="detail-item">{{ form.planCode }}</div>
            </td>
          </tr>
          <tr>
            <td>所属组织</td>
            <td>
              <div class="detail-item">{{ form.mainStationName }}</div>
            </td>
            <td>计划分类</td>
            <td>
              <div class="detail-item">{{ planTypeFormat() }}</div>
            </td>
            <td>是否有效</td>
            <td>
              <div class="detail-item">
                {{ form.isEffective === 0 ? "无效" : "有效" }}
              </div>
            </td>
          </tr>
          <tr>
            <td>有效年度</td>
            <td>
              <div class="detail-item">{{ form.year }}</div>
            </td>
            <td>申请人</td>
            <td>
              <div class="detail-item">{{ form.createByUserName }}</div>
            </td>
            <td>申请时间</td>
            <td>
              <div class="detail-item">{{ form.createTime }}</div>
            </td>
          </tr>
          <tr>
            <td>原因</td>
            <td colspan="5">
              <el-form-item label="" prop="reason">
                <el-input
                  v-if="!$route.query.id && !processInstanceId"
                  v-model="form.reason"
                ></el-input>
                <div v-else class="detail-item">{{ form.reason }}</div>
              </el-form-item>
            </td>
          </tr>
        </table>

        <div class="table">
          <el-table
            ref="multipleTable"
            :data="form.excludeParamList"
            tooltip-effect="dark"
            style="width: 100%"
            border
            :row-class-name="rowClassName"
            @row-click="rowClick"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentType"
              label="设备类型"
              show-overflow-tooltip
              align="center"
              :formatter="getEquipmentNameType"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentCheckName"
              label="巡检内容名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="checkItemType"
              label="巡检类别"
              show-overflow-tooltip
              :formatter="getCheckItemType"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="checkItem"
              label="巡检内容"
              min-width="120px"
              align="left"
              header-align="center"
            >
              <template slot-scope="scope">
                <div
                  v-html="scope.row.checkItem"
                  style="max-height: 69px;overflow: auto;"
                ></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="positionIdList"
              label="停机设备"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <div>
                  <el-form-item
                    :prop="
                      'excludeParamList.' + scope.$index + '.positionIdList'
                    "
                    :rules="rules.positionIdList"
                  >
                    <el-select
                      v-if="!$route.query.id && !processInstanceId"
                      v-model="scope.row.positionIdList"
                      filterable
                      multiple
                      collapse-tags
                      default-first-option
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in scope.row.positionList"
                        :key="item.positionId"
                        :label="item.positionName"
                        :value="item.positionId"
                      >
                      </el-option>
                    </el-select>
                    <div v-else>
                      <el-link
                        type="primary"
                        :disabled="!scope.row.positionIdList"
                        @click.native.stop="
                          getEquipmentDetail(scope.row.positionIdList)
                        "
                        >设备详情</el-link
                      >
                    </div>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="equipmentName"
              label="停机设备"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <div>
                  <el-form-item
                    :prop="
                      'excludeParamList.' + scope.$index + '.equipmentName'
                    "
                    :rules="rules.equipmentName"
                  >
                    <el-input
                      v-model="scope.row.equipmentName"
                      placeholder="请选择"
                      readonly
                      @click.native.stop
                      @focus="getEquipmentName(scope.row, scope.$index)"
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="endTime"
              label="停机截至日期"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <div>
                  <el-form-item
                    :prop="'excludeParamList.' + scope.$index + '.endTime'"
                    :rules="rules.endTime"
                  >
                    <el-date-picker
                      v-if="!$route.query.id && !processInstanceId"
                      v-model="scope.row.endTime"
                      type="date"
                      format="MM-dd"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择"
                      @change="changeTime(scope.row)"
                      @click.native.stop
                    >
                    </el-date-picker>
                    <div v-else>
                      {{ scope.row.endTime }}
                    </div>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="100"
              v-if="!$route.query.id && !processInstanceId"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #f56c6c"
                  icon="el-icon-delete"
                  @click.native.stop="handleDel(scope.$index, scope.row, 1)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="add-box"
            @click="addRow"
            v-if="!$route.query.id && !processInstanceId"
          >
            <i class="el-icon-plus"></i> 添加行
          </div>
        </div>
      </el-form>
    </el-card>
    <el-dialog
      title="选择巡检内容"
      :visible.sync="contentVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'8vh'"
    >
      <div class="dialog-content">
        <!-- <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            :inline="true"
            style="display: flex"
          >
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform.subStationIdList"
                filterable
                multiple
                collapse-tags
                default-first-option
                placeholder="请选择"
                @change="changeSubStation"
                @visible-change="visibleEquipChange"
              >
                <el-option
                  v-for="item in subStationList"
                  :key="item.subStationId"
                  :label="item.subStationName"
                  :value="item.subStationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="方阵：">
              <el-select
                v-model="dialogform.areaIdList"
                filterable
                multiple
                collapse-tags
                default-first-option
                @visible-change="visibleEquipChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id"
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
              @click="searchEquipment"
              >查询</el-button
            >
          </div>
        </div> -->
        <div class="content-table">
          <el-table
            :data="dialogform.tableData"
            style="width: 100%"
            :max-height="530"
            ref="contentRef"
          >
            <el-table-column type="index" label="" width="50" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="dialogform.currentRowId"
                  :label="scope.row.planDetailId"
                  @change="changeRedio($event, scope.row)"
                  >{{ "" }}</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="equipmentType"
              label="设备类型"
              show-overflow-tooltip
              align="center"
              :formatter="getEquipmentNameType"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentCheckName"
              label="巡检内容名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="checkItemType"
              label="巡检类别"
              show-overflow-tooltip
              align="center"
              :formatter="getCheckItemType"
            >
            </el-table-column>
            <el-table-column
              prop="checkItem"
              label="巡检内容"
              min-width="120px"
              align="left"
              header-align="center"
            >
              <template slot-scope="scope">
                <div
                  v-html="scope.row.checkItem"
                  style="max-height: 69px;overflow: auto;"
                ></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            contentVisible = false;
            dialogform = {};
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="contentAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择巡检设备"
      :visible.sync="equipmentVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'8vh'"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform2"
            :model="dialogform2"
            :inline="true"
            style="display: flex"
          >
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform2.subStationIdList"
                filterable
                multiple
                collapse-tags
                default-first-option
                placeholder="请选择"
                @change="changeSubStation"
                @visible-change="visibleEquipChange"
              >
                <el-option
                  v-for="item in subStationList"
                  :key="item.subStationId"
                  :label="item.subStationName"
                  :value="item.subStationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="方阵：">
              <el-select
                v-model="dialogform2.areaIdList"
                filterable
                multiple
                collapse-tags
                default-first-option
                @visible-change="visibleEquipChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.areaName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备位置名称：">
              <el-input
                style="width: 210px"
                v-model="dialogform2.positionName"
                placeholder="请输入"
                @keyup.enter.native="searchEquipment"
              />
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchEquipment"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table
            :data="dialogform2.tableData"
            style="width: 100%"
            :max-height="530"
            ref="equipmentRef"
            @selection-change="handleSelectionChange"
            row-key="positionId"
          >
            <el-table-column type="selection" width="55" reserve-selection>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
              :index="EquipmentIndexMethod"
            ></el-table-column>
            <el-table-column
              prop="mainStationName"
              label="所属组织"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="方阵"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="positionName"
              label="设备位置名称"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleEquipmentSizeChange"
              :total="dialogform2.total"
              :page-size="dialogform2.pageSize"
              background
              :current-page.sync="current"
              @current-change="handleEquipmentPageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEquipment">取 消</el-button>
        <el-button type="primary" @click="checkEquipmentAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设备明细"
      :visible.sync="equipmentDetailVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'8vh'"
    >
      <div class="dialog-content">
        <div class="content-table">
          <el-table
            :data="dialogform3.tableData"
            style="width: 100%"
            :height="530"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="mainStationName"
              label="所属组织"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="方阵"
              align="center"
              show-overflow-tooltip
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
              prop="triggerType"
              label="设备状态"
              align="center"
              :formatter="statusFormat"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  planDetail,
  queryCheckEquipmentList,
  queryCheckEquipmentDetailList,
  excludePlanEquipment,
  processDetail
} from "@/api/planManage/deviceInspection";
import { querySubStationDropDownList } from "@/api/organization/substation";
import {
  planExcludeDetail,
  completePlanExclude
} from "@/api/taskApplication/shutDownApplication";
export default {
  name: "Apply",
  props: {
    processInstanceId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      listState: false,
      processInfo: {}, // 流程信息
      form: {
        title: "",
        reason: "",
        planMainId: "",
        excludeParamList: []
      },
      rules: {
        title: [{ required: true, message: "请输入停检标题", trigger: "blur" }],
        reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
        positionIdList: [
          { required: true, message: "请选择停机设备", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择停机截至日期", trigger: "blur" }
        ]
      },
      planTypeList: JSON.parse(localStorage.getItem("planTypeOptions")), // 计划分类下拉
      equipmentTypeList: JSON.parse(
        localStorage.getItem("equipmentTypeOptions")
      ), // 设备类型下拉
      checkCategoryList: JSON.parse(
        localStorage.getItem("checkCategoryOptions")
      ), // 巡检类别下拉
      contentVisible: false,
      dialogform: {
        checkName: "", // 巡检设备名称筛选项
        currentRow: {}, // 当前新增行信息
        currentIndex: "", // 当前新增行index
        currentRowId: "", // 单选-当前巡检设备id
        tableData: [], // 巡检设备列表数据
        selectRow: {} // 巡检设备选中行数据
      },
      equipmentVisible: false,
      dialogform2: {
        checkName: "", // 巡检设备名称筛选项
        currentRow: {}, // 当前新增行信息
        currentIndex: "", // 当前新增行index
        currentPropIndex: "", // 年计划当前新增行选中的几月巡检设备
        currentNum: "", // 当前计划类型 1.月计划 2.年计划 3.临时计划
        currentRowId: [], // 单选-当前巡检设备id
        tableData: [], // 巡检设备列表数据
        total: 1, // 巡检设备列表数据总数
        pageNum: 1,
        pageSize: 10,
        selectRow: [] // 巡检设备选中行数据
      },
      equipmentDetailVisible: false,
      dialogform3: {
        tableData: [] // 停机设备列表数据
      },
      statusEquipmentOptions: JSON.parse(
        window.localStorage.getItem("statusEquipmentOptions")
      ) // 设备状态字典
    };
  },
  mounted() {
    if (this.$route.query.id || this.processInstanceId) {
      this.getPlanExcludeDetail();
    } else {
      this.getPlanDetail();
    }
  },
  methods: {
    // 流程处理
    handleProcess() {
      let {
        taskId,
        taskDefinitionKey,
        processNodeName,
        processInstanceId,
        businessId,
        processDefinitionId
      } = this.processInfo;
      this.$router.push({
        path: `/work/process/handle`,
        query: {
          taskId,
          taskDefinitionKey,
          processNodeName,
          processInstanceId,
          businessId,
          processDefinitionId,
          fromView: "DEAL"
        }
      });
    },
    // 获取计划详情信息
    getPlanDetail() {
      planDetail({
        planMainId: this.$route.query.planId
      }).then(item => {
        this.form = item.data.data;
        this.$set(this.form, "title", this.form.planName + "设备停机申请");
        this.$set(this.form, "reason", "");
        this.$set(this.form, "planMainId", "");
        this.$set(this.form, "excludeParamList", [{}]);
        this.form.planDetailList.forEach(ele => {
          if (ele.checkPlanItemList && ele.checkPlanItemList.length > 0) {
            ele.checkItem = this.convertCheckContent(ele.checkPlanItemList);
          }
        });
      });
    },
    // 获取计划停机申请详情信息
    getPlanExcludeDetail() {
      planExcludeDetail({
        excludeId: this.$route.query.id,
        processInstanceId: this.processInstanceId
      }).then(item => {
        this.form = item.data.data;
        this.form.title = item.data.data.excludeTitle;
        this.form.excludeParamList = item.data.data.excludeDetailList;
        this.form.excludeDetailList.forEach(ele => {
          if (ele.checkPlanItemList && ele.checkPlanItemList.length > 0) {
            ele.checkItem = this.convertCheckContent(ele.checkPlanItemList);
          }
          if (ele.positionList && ele.positionList.length > 0) {
            ele.positionIdList = ele.positionList.map(v => v.positionId);
          }
        });
        if (this.form.processInstanceId && !this.processInstanceId) {
          processDetail({
            processInstanceId: this.form.processInstanceId
          }).then(res => {
            this.processInfo = res.data.data;
          });
        }
      });
    },
    // 新建、提交
    compile() {
      console.log(this.form);
      if (this.$route.query.id) {
        if (this.listState) {
          this.formValidate("add");
        } else {
          // this.form.planName = this.form.planName.replace(
          //   this.form.year + this.form.mainStationName,
          //   ""
          // );
          this.listState = !this.listState;
        }
      } else {
        this.formValidate("new");
      }
    },
    formValidate(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (data == "new") {
            this.$set(this.form, "planMainId", this.form.planId);
            excludePlanEquipment(this.form).then(() => {
              this.$message.success("新建成功");
              this.$router.back();
            });
          } else {
            delete this.form.planDetailList;
            editPlan(this.form).then(() => {
              this.$message.success("编辑成功");
              this.$router.push({
                name: "设备巡检计划",
                params: { refresh: true }
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
    planTypeFormat() {
      let result = this.form.planType;
      this.planTypeList.forEach(ele => {
        if (ele.dictKey === this.form.planType) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    rowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    rowClick(row) {
      if (this.$route.query.id || this.processInstanceId) {
        return;
      }
      this.contentVisible = true;
      this.dialogform.tableData = this.form.planDetailList;
      this.dialogform.currentRow = row;
      this.dialogform.currentIndex = row.index;
      this.dialogform.currentRowId = row.planDetailId;
      this.dialogform.tableData.forEach(ele => {
        if (ele.planDetailId === this.dialogform.currentRowId) {
          this.changeRedio(true, ele);
        }
      });
    },
    // 表格单选
    changeRedio(event, row) {
      this.dialogform.selectRow = row;
    },
    // 巡检内容弹窗-添加
    contentAdd() {
      this.$set(
        this.form.excludeParamList,
        this.dialogform.currentIndex,
        this.dialogform.selectRow
      ); // 巡检内容
      this.dialogform = {};
      this.contentVisible = false;
    },
    // 巡检内容拼接
    convertCheckContent(data) {
      let result = "";
      if (data) {
        data.forEach((ele, index) => {
          result += index + 1 + "." + ele.checkContent + "<br/>";
        });
      }
      return result;
    },
    // 添加行
    addRow() {
      // let obj = {};
      this.form.excludeParamList.push({});
    },
    // 删除行
    handleDel(index) {
      this.$confirm("确定要删除吗?")
        .then(() => {
          this.form.excludeParamList.splice(index, 1);
        })
        .catch(() => {
          return false;
        });
    },
    // format
    getEquipmentNameType(row) {
      let result = row.equipmentType;
      this.equipmentTypeList.forEach(ele => {
        if (row.equipmentType === ele.dictKey) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    getCheckItemType(row) {
      let result = row.checkItemType;
      this.checkCategoryList.forEach(ele => {
        if (row.checkItemType === ele.dictKey) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 巡检设备详情列表
    async getQueryCheckEquipmentDetailList(data) {
      await queryCheckEquipmentDetailList(data).then(res => {
        this.dialogform3.tableData = res.data.data;
      });
    },
    // 点击停机设备详情
    getEquipmentDetail(positionIdList) {
      this.equipmentDetailVisible = true;
      this.getQueryCheckEquipmentDetailList({ positionIdList });
    },
    statusFormat(row) {
      let result = row.positionState;
      this.statusEquipmentOptions.forEach(ele => {
        if (ele.dictKey === row.positionState) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 停机设备列表
    async getQueryCheckEquipmentList(data) {
      await queryCheckEquipmentList(data).then(res => {
        this.dialogform2.tableData = res.data.data.pageData;
        this.dialogform2.pageNum = res.data.data.pageNum;
        this.dialogform2.pageSize = res.data.data.pageSize;
        this.dialogform2.total = res.data.data.total;
      });
    },
    // 查询
    searchEquipment() {
      this.getQueryCheckEquipmentList({
        mainStationIdList: this.form.mainStationId.split(","),
        checkIdList: this.dialogform2.currentRow.equipmentCheckId.split(","),
        subStationIdList: this.dialogform2.subStationIdList,
        areaIdList: this.dialogform2.areaIdList,
        positionName: this.dialogform2.positionName,
        pageNum: this.dialogform2.pageNum,
        pageSize: this.dialogform2.pageSize
      });
    },
    // 点击新增行的停机设备列
    getEquipmentName(row, index) {
      if (!row.equipmentCheckId) {
        return this.$message.error("请先选择巡检内容");
      }
      this.equipmentVisible = true;
      this.dialogform2.currentRow = row;
      this.dialogform2.currentIndex = index;
      this.dialogform2.currentRowId = row.positionIdList
        ? row.positionIdList
        : [];
      this.getQueryCheckEquipmentList({
        mainStationIdList: this.form.mainStationId.split(","),
        checkIdList: row.equipmentCheckId.split(","),
        pageNum: this.dialogform2.pageNum,
        pageSize: this.dialogform2.pageSize
      }).then(res => {
        this.dialogform2.tableData.forEach(ele => {
          this.dialogform2.currentRowId.forEach(item => {
            if (ele.positionId === item) {
              this.$refs.equipmentRef.toggleRowSelection(ele, true);
            }
          });
        });
      });
      querySubStationDropDownList({
        mainStationIdList: this.form.mainStationId.split(",")
      }).then(res => {
        this.subStationList = res.data.data;
      });
    },
    cancelEquipment() {
      this.equipmentVisible = false;
      this.$refs.equipmentRef.clearSelection();
    },
    // 添加巡检设备
    checkEquipmentAdd() {
      this.$set(
        this.form.excludeParamList[this.dialogform2.currentIndex],
        "positionIdList",
        this.dialogform2.selectRow.map(v => v.positionId)
      );
      this.$set(
        this.form.excludeParamList[this.dialogform2.currentIndex],
        "equipmentName",
        this.dialogform2.selectRow.map(v => v.positionName).join(",")
      );

      this.equipmentVisible = false;
      this.$refs.equipmentRef.clearSelection();
      this.dialogform2 = {
        checkName: "",
        currentRow: {}, // 当前新增行信息
        currentIndex: "", // 当前新增行index
        currentRowId: [], // 多选-当前巡检设备idList
        tableData: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        selectRow: []
      };
    },
    changeTime(row) {
      let time = new Date(row.endTime);
      if (time < new Date()) {
        this.$message.error("截止时间不能小于当前时间");
        row.endTime = "";
      }
    },
    // 流程节点
    beforeBtnClick(code) {
      if (code === "agreeBtnCode") {
        let param = {
          processInstanceId: this.processInstanceId,
          taskId: this.$route.query.taskId
        };
        Object.assign(param, this.form);
        completePlanExclude(param).then(() => {
          this.$message.success("操作成功");
          this.$router.back();
        });
      }
    },
    afterBtnClick(code) {
      console.log(code);
    }
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  min-height: calc(100vh - 124px);
  margin-bottom: 26px;
  /deep/.el-card__body {
    height: 100%;
  }
}
.details-title {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #b3d8ff;
  .right {
    display: flex;
    justify-content: flex-end;
  }
}
.table-box {
  width: 100%;
  td {
    padding: 10px 0;
    .detail-item {
      min-width: 212px;
    }
  }
  td:nth-child(2n + 1) {
    width: 180px;
    background-color: #f6f6f6;
    padding-left: 10px;
    font-size: 14px;
  }
  td:nth-child(2n) {
    width: calc(33.333% - 180px);
    padding: 0 5px;
    font-size: 14px;
  }
  .el-form-item {
    margin: 12px 0;
    .el-select {
      width: 100%;
    }
  }
}
.table {
  border: 1px solid #d2d2d2;
  padding: 5px;
  .el-table td .el-form-item {
    margin: 12px 0;
  }
  .el-date-editor.el-input {
    width: 100%;
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
.focus-main-dialogs {
  .dialog-content {
    .content-title {
      display: flex;
      /deep/.el-button--medium {
        padding: 13px 20px;
        margin-left: 30px;
      }
    }
    .content-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
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
</style>
