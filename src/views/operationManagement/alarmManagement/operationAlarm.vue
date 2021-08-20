<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <!-- <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-delete"
            @click="compile"
            >编辑
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-edit"
            @click="alarmHandling"
            >告警处理
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
          :rules="rules"
          label-width="162px"
          label-position="right"
        >
          <div class="basics">
            <div class="content">
              <div class="title">基础信息</div>
              <div class="basice-box">
                <el-form-item label="所属组织" prop="mainStationName">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    @focus="focusMainStation(1)"
                    ref="mainStation1"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属子期" prop="subStationName">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.subStationName"
                    placeholder="请选择"
                    @focus="focusMainStation(0)"
                    ref="mainStation0"
                  ></el-input>
                </el-form-item>
                <el-form-item label="告警类别" prop="alarmCategory">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-select
                    v-model="form.alarmCategory"
                    clearable
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in alarmCategoryOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型" prop="warningType">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-select
                    v-model="form.warningType"
                    clearable
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in warningTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备编码" prop="positionCode">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.positionCode"
                    @focus="focusMainStation(2)"
                    ref="mainStation2"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备名称" prop="positionName">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.positionName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="equipmentType">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-select
                    v-model="form.equipmentType"
                    clearable
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
                <el-form-item label="数据来源" prop="dataSources">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-select
                    v-model="form.dataSources"
                    clearable
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in dataSourceOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警开始时间" prop="startTime">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    placeholder="选择日期"
                    @change="changeStartTime"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="告警结束时间" prop="endTime">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    placeholder="选择日期"
                    @change="changeEndTime"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="最新告警时间" prop="newTime">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-date-picker
                    v-model="form.newTime"
                    type="datetime"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="累计告警数量" prop="count">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.count"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最高告警级别" prop="maxWarningLevel">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-select
                    v-model="form.maxWarningLevel"
                    clearable
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in warningLevelOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警状态" prop="alarmState">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-select
                    v-model="form.alarmState"
                    clearable
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in alarmStateOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="电量损失" prop="manufactor">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.manufactor"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="影响容量" prop="manufactor">
                  <!-- :disabled="$route.query.id && !listState" -->
                  <el-input
                    v-model="form.manufactor"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <el-table
            :data="form.detailResponseList"
            style="width: 100%"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column prop="warningType" label="告警类型" align="center">
              <template slot-scope="scope">
                {{ scope.row.warningType | filterOptions(warningTypeOptions) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmInformation"
              label="告警信息"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="warningLevel"
              label="告警级别"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.warningLevel | filterOptions(warningLevelOptions)
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="告警开始时间"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="告警结束时间"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="newTime"
              label="最新告警时间"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="alarmCount"
              label="累计告警次数"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="warningDurationl"
              label="告警持续时长（h）"
              align="center"
              width="152"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="treatmentResult"
              label="处理结果"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="alarmState"
              label="告警信息状态"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.alarmState | filterOptions(alarmStateOptions) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dataSources"
              label="数据来源"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.dataSources | filterOptions(dataSourceOptions) }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="record(scope.row)"
                  >查询
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
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
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible2"
      append-to-body
      class="focus-main-dialog"
      width="70%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex; flex-wrap: wrap"
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
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform.subStationId"
                multiple
                filterable
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
            <el-form-item label="设备位置名称：">
              <el-input
                style="width: 217px"
                v-model="dialogform.postionName"
                @keyup.enter.native="searchData"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类型：">
              <el-select
                v-model="dialogform.equipmentTypeList"
                multiple
                filterable
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
              label="所属组织"
              prop="mainStationName"
              align="center"
              show-overflow-tooltip
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
        <el-button @click="focusMainDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="告警处理方式"
      :visible.sync="alarmHandlinDdialog"
      append-to-body
      class="focus-main-dialog"
      width="500px"
    >
      <el-table
        :data="method"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" label="" width="50" align="center">
          <template slot-scope="scope">
            <el-radio
              v-model="currentRowName"
              :label="scope.row.name"
              @change="changeRedio($event, scope.row)"
              >{{ "" }}</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          label="处理方式"
          prop="name"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alarmHandlinDdialog = false">取 消</el-button>
        <el-button type="primary" @click="alarmProcessing">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="告警处理记录"
      :visible.sync="processingRecordDdialog"
      append-to-body
      class="focus-main-dialog"
      width="500px"
    >
      <el-table
        v-if="methodList.length > 0"
        :data="methodList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          label="处理方式"
          prop="desc"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="工单单号"
          prop="name"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="links(scope.row)"
              >链接跳转
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>暂无对应告警工单</div>
    </el-dialog>
  </div>
</template>

<script>
import {
  detailQueryList,
  remove,
  configureEdit,
  detailAlarmExport,
  alarmHandle,
  confirmationSlip,
  queryAlarmHandleList,
} from "@/api/operationManagement/alarmManagement";
import { positionList } from "@/api/device/equipmentLocation";
import { queryMainStationList } from "@/api/organization/allStation";
import { querySubStationList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
export default {
  name: "operationArchives",
  data() {
    return {
      // listState: false,
      form: {
        subStationName: "",
        mainStationName: "",
        dataSources: "data_source_manual",
      },
      rules: {
        // mainStationName: [
        //   {
        //     required: true,
        //     message: "请输入所属组织",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // subStationName: [
        //   {
        //     required: true,
        //     message: "请输入所属子期",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // equipmentType: [
        //   {
        //     required: true,
        //     message: "请选择设备类型",
        //     trigger: ["change"],
        //   },
        // ],
      },
      treeData: [],
      focusMainDialogVisible: false,
      focusMainDialogVisible1: false,
      focusMainDialogVisible2: false,
      alarmHandlinDdialog: false,
      processingRecordDdialog: false,
      principaNum: "",
      tableData: [],
      changeRediod: {},
      dialogform: {
        subStationIdList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      currentRowId: "",
      dialogImageUrl: "",
      imgDialogVisible: false,
      pageNum: 1,
      pageSize: 10,
      btnshow: false,
      multipleSelection: [],
      methodList: [],
      currentRowName: "",
      method: [
        { name: "告警确认单", id: "1" },
        { name: "维修工单", id: "2" },
        { name: "情况说明单", id: "3" },
      ],
      alarmCategoryOptions: JSON.parse(
        window.localStorage.getItem("alarmCategoryOptions")
      ),
      warningTypeOptions: JSON.parse(
        window.localStorage.getItem("warningTypeOptions")
      ),
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      dataSourceOptions: JSON.parse(
        window.localStorage.getItem("dataSourceOptions")
      ),
      warningLevelOptions: JSON.parse(
        window.localStorage.getItem("warningLevelOptions")
      ),
      alarmStateOptions: JSON.parse(
        window.localStorage.getItem("alarmStateOptions")
      ),
    };
  },
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
    // 提交
    compile() {
      this.formValidate();
    },
    // 告警处理
    alarmHandling() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择数据");
      console.log(this.multipleSelection);
      this.alarmHandlinDdialog = true;
    },
    // 告警处理确定
    alarmProcessing() {
      console.log(this.multipleSelection, this.currentRowName);
      let alarmInfoDetailIds = [];
      this.multipleSelection.forEach((item) => {
        console.log(item.id);
        alarmInfoDetailIds.push(item.id);
      });
      queryAlarmHandleList({ alarmDetailIdLists: alarmInfoDetailIds }).then(
        (res) => {
          console.log(res.data.data);
          if (res.data.data[Object.keys(res.data.data)[1]].length > 0) {
            this.$message.error(
              res.data.data[Object.keys(res.data.data)[1]].length +
                "个工单已创建"
            );
            this.alarmHandlinDdialog = false;
            return;
          }
          if (this.changeRediod.id == 1) {
            console.log(1, this.$route.query.id, alarmInfoDetailIds);
            confirmationSlip({
              alarmInfoId: this.$route.query.id,
              alarmInfoDetailIds,
            }).then((res) => {
              console.log(res.data.data);
              this.alarmHandlinDdialog = false;
            });
          }
          if (
            this.changeRediod.id == 2 &&
            this.form.alarmCategory !== "alarm_category_stage"
          ) {
            console.log(2, this.$route.query.id, alarmInfoDetailIds);
            this.alarmHandlinDdialog = false;
            this.$router.push({
              path: "/taskManagement/newRepairOrder",
              query: {
                alarmMainId: this.$route.query.id,
                alarmInfoDetailIds: alarmInfoDetailIds.join(","),
              },
            });
          } else {  
            console.log(3, this.$route.query.id, alarmInfoDetailIds);
            this.alarmHandlinDdialog = false;
            this.$router.push({
              path: "/taskManagement/addOperationEquipmentDescription",
              query: {
                alarmMainId: this.$route.query.id,
                alarmInfoDetailIds: alarmInfoDetailIds.join(","),
              },
            });
          }
          if (this.changeRediod.id == 3) {
            console.log(3, this.$route.query.id, alarmInfoDetailIds);
            this.alarmHandlinDdialog = false;
            this.$router.push({
              path: "/taskManagement/addOperationEquipmentDescription",
              query: {
                alarmMainId: this.$route.query.id,
                alarmInfoDetailIds: alarmInfoDetailIds.join(","),
              },
            });
          }
        }
      );
    },
    // 记录查询
    record(data) {
      console.log(data);
      this.processingRecordDdialog = true;
      alarmHandle({ alarmInfoDetailId: data.id }).then((res) => {
        console.log(res.data);
        this.methodList = res.data.data;
      });
    },
    // 链接跳转
    links(data) {
      console.log("links", data);
      //   { name: "情况说明单", id: "3" },
      if (data.type == 1) {
        this.$router.push({
          path: "/taskManagement/detailAlarmConfirmation",
          query: {
            id: data.id,
          },
        });
      }
      if (data.type == 2) {
        this.$router.push({
          path: "/taskManagement/repairOrderDetail",
          query: {
            id: data.id,
          },
        });
      }
      if (data.type == 3) {
        this.$router.push({
          path: "/taskManagement/operationEquipmentDescription",
          query: {
            id: data.id,
          },
        });
      }
    },
    handleSelectionChange(val) {
      console.log("val", val);
      this.multipleSelection = val;
    },
    formValidate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form);
          configureEdit(this.form).then(() => {
            this.$router.$avueRouter.closeTag();
            this.$router.push({
              name: "设备告警",
              params: { refresh: true },
            });
            this.listState = !this.listState;
          });
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
      if (num == 0) {
        this.focusMainDialogVisible = true;
        this.$refs.mainStation0.blur();
        this.getQuerySubStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (num == 1) {
        this.focusMainDialogVisible1 = true;
        this.$refs.mainStation1.blur();
        this.getQueryMainStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (num == 2) {
        this.focusMainDialogVisible2 = true;
        this.$refs.mainStation2.blur();
        this.getpositionList({
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
    // 设备位置列表
    getpositionList(data) {
      console.log(data);
      positionList(data).then((res) => {
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
      if (this.principaNum == 2) {
        this.getpositionList({
          mainStationIdList: this.dialogform.mainStationIdList,
          subStationIdList: this.dialogform.subStationId,
          postionName: this.dialogform.postionName,
          equipmentTypeList: this.dialogform.equipmentTypeList,
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
        remove({ idList: [this.$route.query.id] }).then(() => {
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
        this.form.mainStationId = this.changeRediod.mainStationId;
        this.form.mainStationName = this.changeRediod.mainStationName;
      }
      if (this.principaNum == 2) {
        this.focusMainDialogVisible2 = false;
        console.log(this.changeRediod);
        this.form.positionCode = this.changeRediod.positionCode;
        this.form.positionName = this.changeRediod.positionName;
        this.form.equipmentType = this.changeRediod.equipmentType;
      }
    },
    // 详情
    getQueryStageDetail() {
      detailQueryList({
        alarmMainId: this.$route.query.id,
      }).then((res) => {
        this.form = res.data.data;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        if (this.form.alarmCategory == "alarm_category_stage") {
          this.method = [
            { name: "告警确认单", id: "1" },
            { name: "情况说明单", id: "2" },
          ];
        }
      });
    },
    // 修改告警开始时间
    changeStartTime(val) {
      if (val && new Date(val) > new Date(this.form.endTime)) {
        this.form.startTime = "";
        return this.$message.error("告警开始时间不得早于告警结束时间");
      }
    },
    // 修改告警结束时间
    changeEndTime(val) {
      if (val && new Date(val) < new Date(this.form.startTime)) {
        this.form.endTime = "";
        return this.$message.error("告警结束时间不得早于告警开始时间");
      }
    },
    // 导出
    handleExport() {
      detailAlarmExport({ alarmMainId: this.$route.query.id })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "告警详情.xls"; //下载的文件名
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
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
        max-width: 90px;
        overflow: hidden;
        position: relative;
        .el-select__tags-text {
          max-width: 60px;
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
/deep/.el-table th,
.el-table th.is-leaf {
  background-color: #fafafa;
  color: #333;
}
</style>
