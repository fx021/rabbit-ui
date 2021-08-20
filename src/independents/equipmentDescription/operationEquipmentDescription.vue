<template>
  <div>
    <!-- 不是查看页!$route.query.id
          不是新增页!$route.query.alarmMainId
          工作流 processInstanceId
      -->
    <el-card class="box-card">
      <div class="details-title">
        <div class="left"></div>
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            v-if="($route.query.alarmMainId || !processInstanceId)&&!$route.query.id"
            >新增
          </el-button>
          <!-- 不用自己的编辑 -->
          <!-- {{
              $route.query.alarmMainId ? "新增" : listState ? "提交" : "编辑"
            }} -->
          <!-- <el-button
            type="danger"
            size="small"
            plain
            class="el-icon-delete"
            v-if="!processInstanceId&&!$route.query.id"
            @click.stop="deletes"
            >删除</el-button
          > -->
          <el-button
            type="warning"
            size="small"
            plain
            icon="el-icon-upload2"
            v-if="!$route.query.alarmMainId"
            @click.stop="exportDetail"
            >导出</el-button
          >
        </div>
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="right"
        style="margin-top: 10px"
      >
        <div class="form-box">
          <el-form-item label="标题" prop="title" style="width: 66.66%">
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input v-model="form.title" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单编号" prop="workOrderNo">
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input readonly v-model="form.workOrderNo"></el-input>
          </el-form-item>
          <!-- prop="mainStationName" -->
          <el-form-item label="所属组织">
            <!-- :disabled="$route.query.id && !listState" -->
            <!-- placeholder="请选择" -->
            <el-input
              readonly
              v-model="form.mainStationName"
              ref="mainStation"
            ></el-input>
            <!-- @focus="focusMainStation" -->
          </el-form-item>
          <!-- prop="subStationName" -->
          <el-form-item label="所属子期">
            <!-- :disabled="$route.query.id && !listState" -->
            <!-- placeholder="请输入" -->
            <el-input
              readonly
              v-model="form.subStationName"
              ref="subStation"
            ></el-input>
            <!-- @focus="focusSubStation" -->
          </el-form-item>
          <el-form-item label="工单状态" prop="workOrderStatus">
            <el-select
              v-model="form.workOrderStatus"
              disabled
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in orderStateOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- prop="alarmStartTime" -->
          <el-form-item label="告警开始时间">
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input v-model="form.alarmStartTime" readonly></el-input>
            <!-- <el-date-picker
              :disabled="$route.query.id && !listState"
              v-model="form.alarmStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
              @change="changeStartTime"
            >
            </el-date-picker> -->
          </el-form-item>
          <el-form-item label="工单发起时间" prop="workOrderTime">
            <el-input v-model="form.workOrderTime" readonly></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <!-- prop="alarmType" -->
          <el-form-item label="告警类别">
            <el-select
              disabled
              v-model="form.alarmType"
              clearable
              default-first-option
              placeholder="请选择"
              @change="form.situationExplainOrderDetailResponseList = []"
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
          <el-form-item label="发起人" prop="initiatorName">
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input v-model="form.initiatorName" readonly></el-input>
          </el-form-item>
          <el-form-item
            label="任务负责人"
            :prop="
              form.workOrderStatus !== 'order_state_draft'
                ? ''
                : 'taskLeaderName'
            "
          >
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input
              v-model="form.taskLeaderName"
              :placeholder="
                form.workOrderStatus !== 'order_state_draft' ? '' : '请输入'
              "
              ref="treeRef0"
              :readonly="form.workOrderStatus !== 'order_state_draft'"
              @focus="
                form.workOrderStatus !== 'order_state_draft' ? '' : focusTree(0)
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="任务协助人" prop="taskHelperName">
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input
              v-model="form.taskHelperName"
              :placeholder="
                form.workOrderStatus !== 'order_state_draft' ? '' : '请输入'
              "
              :readonly="form.workOrderStatus !== 'order_state_draft'"
              ref="treeRef1"
              @focus="
                form.workOrderStatus !== 'order_state_draft' ? '' : focusTree(1)
              "
            ></el-input>
          </el-form-item>
          <!-- prop="equipmentName" -->
          <el-form-item label="设备名称">
            <!-- :disabled="$route.query.id && !listState" -->
            <el-input
              v-model="form.equipmentName"
              readonly
              ref="equipmentRef"
            ></el-input>
            <!-- :placeholder="draftOutShow ? '' : '请选择'"
              :readonly="draftOutShow"
              @focus="draftOutShow ? '' : focusEquipment" -->
          </el-form-item>
          <el-form-item label="设备位置编码" prop="equipmentCode">
            <el-input v-model="form.equipmentCode" readonly></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <el-form-item label="规格型号" prop="equipmentModel">
            <el-input v-model="form.equipmentModel" readonly></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <el-form-item label="设备位置名称" prop="positionName">
            <el-input v-model="form.positionName" readonly></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <el-form-item label="支路" prop="pgb">
            <el-select
              disabled
              v-model="form.pgb"
              clearable
              multiple
              collapse-tags
              default-first-option
              placeholder="请选择"
              v-if="
                form.equipmentType === 'equipment_type_lpi' ||
                form.equipmentType === 'equipment_type_jb_dc'
              "
              @change="changePgb"
            >
              <el-option
                v-for="item in pgbList"
                :key="item.equipmentCode"
                :label="item.equipmentName"
                :value="item.equipmentCode"
              >
              </el-option>
            </el-select>
            <el-input v-model="form.pgb" readonly v-else></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <el-form-item label="支路编码" prop="pgbNo">
            <el-input v-model="form.pgbNo" readonly></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <el-form-item label="最高告警级别" prop="highAlarmLevel">
            <el-select
              v-model="form.highAlarmLevel"
              disabled
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
          <el-form-item label="影响容量(kW)" prop="influenceCapacity">
            <el-input v-model="form.influenceCapacity" readonly></el-input>
            <!-- :disabled="$route.query.id && !listState" -->
          </el-form-item>
          <div class="title-text">告警信息详情</div>
        </div>
        <div class="table" :class="!$route.query.id ? 'formTable' : ''">
          <el-table
            ref="multipleTable"
            :data="form.situationExplainOrderDetailResponseList"
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
              prop="alarmType"
              label="告警类型"
              show-overflow-tooltip
              align="center"
              key="day1"
            >
              <template slot-scope="scope">
                <!-- 不用自己的编辑 -->
                <!-- <div v-if="!listState">
                  {{ getAlarmType(scope.row.alarmType) }}
                </div>
                <div v-else> -->
                <el-form-item
                  :prop="
                    'situationExplainOrderDetailResponseList.' +
                    scope.$index +
                    '.alarmType'
                  "
                  :rules="rules.alarmType"
                >
                  <el-select
                    v-model="scope.row.alarmType"
                    filterable
                    default-first-option
                    placeholder="请选择"
                    @change="changeAlarmType(scope.row)"
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
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmInfo"
              label="告警信息"
              show-overflow-tooltip
              align="center"
              key="day2"
            >
              <template slot-scope="scope">
                <!-- 不用自己的编辑 -->
                <!-- <div v-if="!listState">
                  {{ scope.row.alarmInfo }}
                </div>
                <div v-else> -->
                <el-form-item
                  :prop="
                    'situationExplainOrderDetailResponseList.' +
                    scope.$index +
                    '.alarmInfo'
                  "
                  :rules="rules.alarmInfos"
                >
                  <el-input
                    v-model="scope.row.alarmInfo"
                    @focus="focusAlarmInfo(scope.row, scope.$index)"
                    readonly
                    placeholder="请选择"
                  ></el-input>
                </el-form-item>
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmLevel"
              label="告警级别"
              show-overflow-tooltip
              align="center"
              key="day3"
              :formatter="alarmLevelFormat"
            >
            </el-table-column>
            <el-table-column
              prop="alarmTime"
              label="最新告警时间"
              min-width="120px"
              align="center"
              key="day4"
            >
              <template slot-scope="scope">
                <!-- 不用自己的编辑 -->
                <!-- <div v-if="!listState">
                  {{ scope.row.alarmTime }}
                </div>
                <div v-else> -->
                <el-form-item
                  :prop="
                    'situationExplainOrderDetailResponseList.' +
                    scope.$index +
                    '.alarmTime'
                  "
                  :rules="rules.alarmTime"
                >
                  <el-date-picker
                    v-model="scope.row.alarmTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择"
                  >
                  </el-date-picker>
                </el-form-item>
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmNum"
              label="累计发生次数"
              show-overflow-tooltip
              align="center"
              key="day5"
              min-width="120px"
            >
              <template slot-scope="scope">
                <!-- 不用自己的编辑 -->
                <!-- <div v-if="!listState">
                  {{ scope.row.alarmNum }}
                </div>
                <div v-else> -->
                <el-form-item
                  :prop="
                    'situationExplainOrderDetailResponseList.' +
                    scope.$index +
                    '.alarmNum'
                  "
                  :rules="rules.alarmNum"
                >
                  <el-input
                    v-model="scope.row.alarmNum"
                    placeholder="请输入"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="informationNote"
              label="情况说明"
              min-width="120px"
              align="center"
              key="day4"
            >
              <template slot-scope="scope">
                <div
                  v-if="
                    !processInstanceId ||
                    (processInstanceId &&
                      $route.query.taskDefinitionKey ==
                        'xye_seo_centralized_control_confirm')
                  "
                >
                  {{ scope.row.informationNote }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'situationExplainOrderDetailResponseList.' +
                      scope.$index +
                      '.informationNote'
                    "
                    :rules="rules.informationNote"
                  >
                    <el-input
                      v-model="scope.row.informationNote"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="treatmentResult"
              label="处理结果"
              min-width="120px"
              align="center"
              key="day4"
            >
              <template slot-scope="scope">
                <div
                  v-if="
                    !processInstanceId ||
                    (processInstanceId &&
                      $route.query.taskDefinitionKey ==
                        'xye_seo_centralized_control_confirm')
                  "
                >
                  {{
                    scope.row.treatmentResult
                      | filterOptions(handleResultOptions)
                  }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'situationExplainOrderDetailResponseList.' +
                      scope.$index +
                      '.treatmentResult'
                    "
                    :rules="rules.treatmentResult"
                  >
                    <el-select
                      v-model="scope.row.treatmentResult"
                      filterable
                      default-first-option
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in handleResultOptions"
                        :key="item.dictKey"
                        :label="item.dictValue"
                        :value="item.dictKey"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="centralizedControlOpinion"
              label="集控意见"
              min-width="120px"
              align="center"
              key="day4"
            >
              <template slot-scope="scope">
                <div
                  v-if="
                    !processInstanceId ||
                    (processInstanceId &&
                      ($route.query.taskDefinitionKey ==
                        'xye_seo_main_station_person_one' ||
                        $route.query.taskDefinitionKey ==
                          'xye_seo_main_station_person_tow'))
                  "
                >
                  {{ scope.row.centralizedControlOpinion }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'situationExplainOrderDetailResponseList.' +
                      scope.$index +
                      '.centralizedControlOpinion'
                    "
                    :rules="rules.centralizedControlOpinion"
                  >
                    <el-select
                      v-model="scope.row.centralizedControlOpinion"
                      filterable
                      default-first-option
                      placeholder="请选择"
                    >
                      <el-option :key="1" label="同意" :value="1"> </el-option>
                      <el-option :key="0" label="不同意" :value="0">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="centralizedControlAnalysis"
              label="集控分析"
              min-width="120px"
              align="center"
              key="day4"
            >
              <template slot-scope="scope">
                <div
                   v-if="
                    !processInstanceId ||
                    (processInstanceId &&
                      ($route.query.taskDefinitionKey ==
                        'xye_seo_main_station_person_one' ||
                        $route.query.taskDefinitionKey ==
                          'xye_seo_main_station_person_tow'))
                  "
                >
                  {{ scope.row.centralizedControlAnalysis }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'situationExplainOrderDetailResponseList.' +
                      scope.$index +
                      '.centralizedControlAnalysis'
                    "
                    :rules="rules.centralizedControlAnalysis"
                  >
                    <el-input
                      v-model="scope.row.centralizedControlAnalysis"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              key="day7"
              fixed="right"
              width="100"
              v-if="$route.query.alarmMainId || processInstanceId"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #f56c6c"
                  icon="el-icon-delete"
                  @click="handleDel(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="add-box"
            @click="addRow(1)"
            v-if="$route.query.alarmMainId || processInstanceId"
          >
            <i class="el-icon-plus"></i> 添加行
          </div>
        </div>
        <div class="form-box" style="width: 100%">
          <el-form-item
            label="告警结束时间"
            prop="alarmEndTime"
            style="width: 33.33%"
            :rules="rules.alarmEndTime"
          >
            <el-date-picker
              v-model="form.alarmEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="集控确认时间"
            prop="centralizedControlConfirmTime"
            style="width: 33.33%"
          >
            <el-input
              v-model="form.centralizedControlConfirmTime"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" style="width: 66.66%">
            <el-input
              v-model="form.remarks"
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-box" style="width: 100%">
          <el-form-item label="附件上传" prop="files" style="width: 100%">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="form.minioFileList"
              :on-change="handleChange"
            >
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
        </div>
      </el-form>
    </el-card>
    <!-- 所属组织 -->
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'10vh'"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="stationDialogForm"
            :model="stationDialogForm"
            :inline="true"
            style="display: flex"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="stationDialogForm.mainStationIdList"
                style="width: 210px"
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
            <el-form-item label="组织编码：">
              <el-input
                style="width: 210px"
                v-model="stationDialogForm.mainStationCode"
                placeholder="请输入"
                @keyup.enter.native="searchData"
              />
            </el-form-item>
            <el-form-item label="组织负责人：">
              <my-select
                :options="commonUserList"
                ref="selectRef"
                v-model="stationDialogForm.mainStationPersonUserIds"
                @visible-change="visibleChange"
                @input="handleInput"
                :optionProp="{ value: 'userId', label: 'userName' }"
              />
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
          <el-table
            :data="stationDialogForm.tableData"
            style="width: 100%"
            :max-height="530"
          >
            <el-table-column type="index" label="" width="50" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="stationDialogForm.currentRowId"
                  :label="scope.row.mainStationId"
                  @change="changeRadio($event, scope.row)"
                  >{{ "" }}</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
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
              prop="mainStationPersonName"
              label="组织负责人"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="stationDialogForm.total"
              :page-size="stationDialogForm.pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="stationAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 所属子期 -->
    <el-dialog
      title="选择所属子期"
      :visible.sync="focusSubDialogVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="subStationDialogForm"
            :model="subStationDialogForm"
            label-width="100px"
            style="display: flex"
          >
            <el-form-item label="所属子期：">
              <el-select
                v-model="subStationDialogForm.subStationIdList"
                style="width: 210px"
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
            <el-form-item label="子期编码：">
              <el-input
                v-model="subStationDialogForm.subStationCode"
                style="width: 210px"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="子期负责人：">
              <el-input
                placeholder="请输入"
                style="width: 210px"
                v-model="subStationDialogForm.subStationPersonName"
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
          <el-table :data="subStationDialogForm.tableData" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="subStationDialogForm.currentRowId"
                  :label="scope.row.id"
                  @change="changeRadio($event, scope.row)"
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
              :total="subStationDialogForm.total"
              :page-size="subStationDialogForm.pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="subStationAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 选择负责人弹窗 -->
    <el-dialog
      title="选择负责人"
      :visible.sync="treeDialogVisible"
      v-if="treeDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Tree
          :data="treeData"
          :props="defaultProps"
          :showRight="true"
          :tableList="[]"
          :choice="choice"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 设备 -->
    <el-dialog
      title="选择设备"
      :visible.sync="equipmentVisible"
      v-if="equipmentVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1150px"
      :top="'8vh'"
    >
      <Position
        ref="positionRef"
        :Single="true"
        :mainStationIdList="form.mainStationId ? [form.mainStationId] : []"
        :subStationIdList="form.subStationId ? [form.subStationId] : []"
        :positionIdList="form.positionId ? [form.positionId] : []"
        :disabled="disabled"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEquipment">取 消</el-button>
        <el-button type="primary" @click="equipmentAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 告警信息弹窗 -->
    <el-dialog
      title="选择告警信息"
      :visible.sync="focusAlarmInfoVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="alarmInfoForm"
            :model="alarmInfoForm"
            label-width="100px"
            style="display: flex"
          >
            <el-form-item label="告警信息：">
              <el-input
                v-model="alarmInfoForm.alarmInformation"
                style="width: 210px"
                placeholder="请输入告警信息"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警级别：">
              <el-select
                v-model="alarmInfoForm.warningLevel"
                style="width: 210px"
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
                  v-for="item in warningLevelOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否有效：">
              <el-select
                v-model="alarmInfoForm.isEffective"
                style="width: 210px"
                filterable
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option :label="'是'" :value="1"> </el-option>
                <el-option :label="'否'" :value="0"> </el-option>
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
          <el-table :data="alarmInfoForm.tableData" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="alarmInfoForm.currentRowId"
                  :label="scope.row.alarmCode"
                  @change="changeRadio($event, scope.row)"
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
              label="告警信息"
              prop="alarmInformation"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="设备类型"
              prop="equipmentType"
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row.equipmentType | filterOptions(equipmentTypeOptions)
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmCategory"
              label="告警类别"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.alarmCategory | filterOptions(alarmCategoryOptions)
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmType"
              label="告警类型"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.alarmType | filterOptions(warningTypeOptions) }}
              </template>
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
              prop="isEffective"
              label="是否有效"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <i
                  :class="
                    scope.row.isEffective == 1
                      ? 'el-icon-success'
                      : 'el-icon-error'
                  "
                  :style="{
                    color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C',
                  }"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="alarmInfoForm.total"
              :page-size="alarmInfoForm.pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="alarmInfoAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片弹窗 -->
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import {
  tree,
  queryMainStationList,
  queryMainStationDropDownList,
} from "@/api/organization/allStation";
import {
  situationDetailList,
  remove,
  situationAdd,
  // situationEdit,
  exportSituationExplainOrderDetail,
  flowAbleComplete,
} from "@/api/taskManagement/equipmentDescription";
import { detailQueryList } from "@/api/operationManagement/alarmManagement";
import { queryEquipmentList, getFiles } from "@/api/order/repairOrder";
import { userList } from "@/api/organization/staging";
import Tree from "@/components/organization/tree.vue";
import mySelect from "@/components/select/select.vue";
import Position from "@/components/dialog/postionDialogs.vue";
import {
  querySubStationList,
  querySubStationDropDownList,
} from "@/api/organization/substation";
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
import lrz from "lrz";
import { queryConfigureList } from "@/api/operationManagement/alarmInformationConfiguration";
export default {
  name: "newRepairOrder",
  components: { mySelect, Tree, Position },
  props: {
    id: String,
    dataId: String,
    value: Object,
    processNodeId: String,
    processInstanceId: String,
  },
  data() {
    return {
      rules: {
        mainStationName: [
          { required: true, message: "请选择所属组织", trigger: "change" },
        ],
        subStationName: [
          { required: true, message: "请选择所属子期", trigger: "change" },
        ],
        equipmentName: [
          { required: true, message: "请选择设备", trigger: "change" },
        ],
        alarmStartTime: [
          { required: true, message: "请选择告警开始时间", trigger: "change" },
        ],
        alarmType: [
          { required: true, message: "请选择告警类型", trigger: "blur" },
        ],
        taskLeaderName: [
          { required: true, message: "请选择任务负责人", trigger: "change" },
        ],
        centralizedControlOpinion: [
          { required: true, message: "请选择集控意见", trigger: "change" },
        ],
        informationNote: [
          { required: true, message: "请输入情况说明", trigger: "blur" },
        ],
        centralizedControlAnalysis: [
          { required: true, message: "请输入集控分析", trigger: "blur" },
        ],
        treatmentResult: [
          { required: true, message: "请输入处理结果", trigger: "change" },
        ],
        alarmEndTime: [
          { required: true, message: "请选择告警结束时间", trigger: "change" },
        ],
      },
      form: {
        title: "", //标题
        workOrderNo: "", //工单编号
        mainStationName: "", //所属组织
        mainStationId: "", //所属组织id
        subStationName: "", //所属子期名称
        subStationId: "", //所属子期id
        workOrderStatus: "order_state_draft", //工单状态
        alarmStartTime: "", //告警开始时间
        alarmEndTime: "", //告警结束时间
        workOrderTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"), //工单发起时间
        alarmType: "alarm_category_real", //告警类别
        initiatorName: this.$store.getters.userInfo.nick_name, //发起人姓名
        initiator: this.$store.getters.userInfo.user_id, //发起人姓名id
        taskLeader: "", // 任务负责人ID
        taskLeaderName: "", //任务负责人姓名
        taskHelper: "", //主要协助人ID
        taskHelperName: "", //主要协助人姓名
        equipmentName: "", //设备名称
        equipmentCode: "", //设备位置编码
        equipmentModel: "", //规格型号
        positionName: "", //设备位置名称
        pgb: "", //支路
        pgbNo: "", //支路编码
        highAlarmLevel: "", //最高告警级别
        influenceCapacity: "", //影响容量
        remark: "", //备注
        situationExplainOrderDetailResponseList: [],
        minioFileList: [],
      },
      listState: true,
      dialogNum: 0,
      focusMainDialogVisible: false, // 所属组织弹窗
      mainStationOptions: [],
      commonUserList: [],
      stationDialogForm: {
        //所属组织弹窗
        currentRowId: "",
        tableData: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        changedRadio: {},
        mainStationIdList: [],
        mainStationCode: "",
        mainStationPersonUserIds: [],
      },
      focusSubDialogVisible: false,
      subStationOptions: [],
      subStationDialogForm: {
        //所属子期弹窗
        currentRowId: "",
        tableData: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        changedRadio: {},
        subStationIdList: [],
        subStationPersonName: "",
        subStationCode: "",
      },
      treeDialogVisible: false, // 地址本弹窗
      treeData: [],
      choice: true,
      addData: "",
      treeNum: "",
      defaultProps: {
        children: "children",
        label: "title",
      },
      equipmentVisible: false, // 设备弹窗
      disabled: false, // 设备弹窗 - 组织，子期是否禁用
      pgbList: [], // 支路下拉
      fileList: [], // 告警图片list
      fileListDo: [], // 处理图片list
      focusAlarmInfoVisible: false, // 告警信息弹窗
      alarmInfoForm: {
        currentRowId: "",
        currentRow: {},
        currentIndex: "",
        tableData: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        changedRadio: {},
        alarmInformation: "", // 告警信息
        warningLevel: [], //告警级别
        isEffective: "", //告警是否有效
      },
      orderStateOptions: JSON.parse(localStorage.getItem("orderStateOptions")), // 工单状态下拉
      faultTypeOptions: JSON.parse(localStorage.getItem("faultTypeOptions")), // 故障类型下拉
      dataSourceOptions: JSON.parse(localStorage.getItem("dataSourceOptions")), // 数据来源字典
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions") //设备类型字典
      ),
      warningTypeOptions: JSON.parse(
        localStorage.getItem("warningTypeOptions")
      ), // 告警类型字典
      warningLevelOptions: JSON.parse(
        localStorage.getItem("warningLevelOptions")
      ), // 告警级别字典
      alarmCategoryOptions: JSON.parse(
        localStorage.getItem("alarmCategoryOptions")
      ), // 告警类别下拉
      handleResultOptions: JSON.parse(
        localStorage.getItem("handleResultOptions")
      ), // 处理结果下拉
      imgDialogVisible: false,
      draftOutShow: false,
    };
  },
  watch: {
    commonUserList(val) {
      if (val && val.length > 0) {
        val.forEach((ele) => {
          ele.title = ele.userName;
        });
      }
    },
  },
  mounted() {
    console.log("mounted执行", this.processInstanceId);
    userList({ userName: "", inMyMainStation: 1 }).then((res) => {
      this.commonUserList = res.data.data;
    });
    this.getDetail();
  },
  methods: {
    // 新建、提交
    compile() {
      this.formValidate("new");
      // 不用自己的编辑
      // if (this.$route.query.alarmMainId) {
      //   this.formValidate("new");
      // }
      // if (this.processInstanceId) {
      //   if (this.listState) {
      //     this.formValidate("edit");
      //   } else {
      //     this.listState = !this.listState;
      //   }
      // }
    },
    // 提交工作流
    beforeBtnClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('aaaa');
          this.form.taskId = this.$route.query.taskId;
          this.form.processInstanceId = this.processInstanceId;
          flowAbleComplete(this.form).then((res) => {
            if (res.data.success) {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.$router.push("/work/todo");
            }
          });
        }
      });
    },
    // 获取设备情况详情信息
    getDetail() {
      // 查看
      if (this.$route.query.id) {
        this.getSituationDetail({ id: this.$route.query.id });
      }
      // 工作流
      if (this.processInstanceId) {
        this.getSituationDetail({ processInstanceId: this.processInstanceId });
      }
      // 新增
      if (this.$route.query.alarmMainId) {
        this.getdraftOut();
      }
    },
    // 起草列表获取
    getdraftOut() {
      detailQueryList({ alarmMainId: this.$route.query.alarmMainId }).then(
        (res) => {
          console.log(res.data.data);
          let arr = [];
          res.data.data.detailResponseList.forEach((item) => {
            this.$route.query.alarmInfoDetailIds.split(",").some((data) => {
              if (item.id == data) {
                item.alarmInfoDetailId = this.$route.query.alarmMainId;
                item.alarmType = item.warningType;
                item.alarmLevel = item.warningLevel;
                item.alarmInfo = item.alarmInformation;
                item.alarmTime = item.newTime;
                item.alarmNum = item.alarmCount;
                delete item.warningType;
                delete item.warningLevel;
                delete item.alarmInformation;
                delete item.newTime;
                delete item.alarmCount;
                return arr.push(item);
              }
            });
          });
          console.log(arr);
          this.form = {
            title: "", //标题
            workOrderNo: "", //工单编号
            mainStationId: res.data.data.mainStationId, //所属组织id
            mainStationName: res.data.data.mainStationName, //所属组织
            subStationId: res.data.data.subStationId, //所属子期id
            subStationName: res.data.data.subStationName, //所属子期名称
            workOrderStatus: "order_state_draft", //工单状态 起草
            alarmStartTime: res.data.data.startTime, //告警开始时间
            alarmEndTime: res.data.data.endTime, //告警结束时间
            workOrderTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"), //工单发起时间
            alarmType: res.data.data.alarmCategory, //告警类别  "alarm_category_real"
            initiatorName: this.$store.getters.userInfo.nick_name, //发起人姓名
            initiator: this.$store.getters.userInfo.user_id, //发起人姓名id
            taskLeader: "", // 任务负责人姓名id
            taskLeaderName: "", //任务负责人姓名
            taskHelper: "", //主要协助人id
            taskHelperName: "", //主要协助人姓名
            positionId: arr[0].positionId,
            equipmentName: arr[0].equipmentName, //设备名称
            equipmentCode: arr[0].positionCode, //设备位置编码
            equipmentModel: arr[0].equipmentModel, //规格型号
            positionName: arr[0].positionName, //设备位置名称
            pgb: "", //支路
            pgbNo: "", //支路编码
            highAlarmLevel: res.data.data.maxWarningLevel, //最高告警级别
            influenceCapacity: res.data.data.influenceCapacity, //影响容量
            remark: "",
            situationExplainOrderDetailResponseList: arr,
            minioFileList: [],
          };
          this.draftOutShow = true;
        }
      );
    },
    // 获取详情列表
    getSituationDetail(data) {
      situationDetailList(data).then((item) => {
        if (item.data.data) {
          this.form = item.data.data;
          this.form.situationExplainOrderDetailResponseList =
            item.data.data.situationExplainOrderDetailResponseList;
          if (
            this.form.equipmentType === "equipment_type_lpi" ||
            this.form.equipmentType === "equipment_type_jb_dc"
          ) {
            queryEquipmentList({ parentPositionId: this.form.positionId }).then(
              (res) => {
                this.pgbList = res.data.data;
                this.form.pgb = this.form.pgbNo.split(",");
              }
            );
          }
        }
      });
      // getFiles({
      //   businessId: this.$route.query.id,
      //   businessTypeList: ["maintain_alarm_order"],
      // }).then((res) => {
      //   this.form.fileList = res.data.data ? res.data.data : [];
      //   this.fileList = res.data.data ? res.data.data : [];
      //   this.fileList.forEach((ele) => {
      //     ele.url = this.imgUrl + ele.fileId;
      //   });
      // });
      // getFiles({
      //   businessId: this.$route.query.id,
      //   businessTypeList: ["maintain_work_order"],
      // }).then((res) => {
      //   this.form.fileListDo = res.data.data ? res.data.data : [];
      //   this.fileListDo = res.data.data ? res.data.data : [];
      //   this.fileListDo.forEach((ele) => {
      //     ele.url = this.imgUrl + ele.fileId;
      //   });
      // });
    },
    formValidate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let compare1 = this.compare(
            this.form.taskLeaderName.split(","),
            this.form.taskHelperName.split(",")
          )
          if (compare1) {
            return this.$message.error(
              "任务负责人，任务协助人不能兼任!"
            );
          }
          if (this.form.pgbNo) {
            let arr = [];
            this.pgbList.forEach((ele) => {
              if (this.form.pgbNo.split(",").indexOf(ele.equipmentCode) != -1) {
                arr.push(ele.equipmentName);
              }
            });
            this.form.pgb = arr.join(",");
          }
          console.log(this.form);
          //todo if (data == "new") {
          situationAdd(this.form).then(() => {
            this.$message.success("新建成功");
            this.$router.$avueRouter.closeTag();
            this.$router.push({
              name: "设备情况说明单",
              params: { refresh: true },
            });
          });
          //todo }
          //todo  else {
          //todo   situationEdit(this.form).then(() => {
          //todo     this.$message.success("编辑成功");
          //todo     this.$router.$avueRouter.closeTag();
          //todo     this.$router.push({
          //todo       name: "设备情况说明单",
          //todo       params: { refresh: true },
          //todo     });
          //todo     this.listState = !this.listState;
          //todo   });
          //todo }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加行
    addRow() {
      let obj = {
        alarmType: "", //告警类型
        alarmInfo: "", //告警信息
        alarmLevel: "", //告警级别
        alarmTime: this.form.workOrderTime, //最新告警时间
        alarmNum: 1, //告警次数
        centralizedControlAnalysis: "",
        centralizedControlOpinion: "",
        treatmentResult: "",
        informationNote: "",
      };
      this.form.situationExplainOrderDetailResponseList.push(obj);
    },
    // 删除行
    handleDel(index) {
      this.$confirm("确定要删除吗?")
        .then(() => {
          this.form.situationExplainOrderDetailResponseList.splice(index, 1);
        })
        .catch(() => {
          return false;
        });
    },
    // 删除工单
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ ids: [this.$route.query.id] }).then((res) => {
          console.log(res);
          this.$message.success("删除成功");
          this.$router.push({
            name: "设备情况说明单",
            params: { refresh: true },
          });
        });
      });
    },

    // 详情导出
    exportDetail() {
      exportSituationExplainOrderDetail({ id: this.$route.query.id })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "情况说明详情.xls"; //下载的文件名
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
    // 附件添加图片
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
              this.form.minioFileList = fileList;
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
          this.form.minioFileList = fileList;
          this.btnshow = false;
        });
      }
    },
    // 附件图片删除
    handleRemove(file) {
      console.log(this.form.minioFileList);
      const i = this.form.minioFileList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.minioFileList.splice(i, 1);
    },
    // 附件图片预览
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
    // 组织列表
    async getQueryMainStationList(data) {
      await queryMainStationList(data).then((res) => {
        this.$set(this.stationDialogForm, "tableData", res.data.data.pageData);
        this.$set(this.stationDialogForm, "pageNum", res.data.data.pageNum);
        this.$set(this.stationDialogForm, "pageSize", res.data.data.pageSize);
        this.$set(this.stationDialogForm, "total", res.data.data.total);
      });
    },
    // 子站列表
    async getQuerySubStationList(data) {
      await querySubStationList(data).then((res) => {
        this.$set(
          this.subStationDialogForm,
          "tableData",
          res.data.data.pageData
        );
        this.$set(this.subStationDialogForm, "pageNum", res.data.data.pageNum);
        this.$set(
          this.subStationDialogForm,
          "pageSize",
          res.data.data.pageSize
        );
        this.$set(this.subStationDialogForm, "total", res.data.data.total);
      });
    },
    // 告警信息列表
    async getQueryConfigureList(data) {
      await queryConfigureList(data).then((res) => {
        this.$set(this.alarmInfoForm, "tableData", res.data.data.pageData);
        this.$set(this.alarmInfoForm, "pageNum", res.data.data.pageNum);
        this.$set(this.alarmInfoForm, "pageSize", res.data.data.pageSize);
        this.$set(this.alarmInfoForm, "total", res.data.data.total);
      });
    },
    //所属组织单选
    focusMainStation() {
      this.focusMainDialogVisible = true;
      this.dialogNum = 0;
      this.$refs.mainStation.blur();
      this.getQueryMainStationList({
        pageNum: this.stationDialogForm.pageNum,
        pageSize: this.stationDialogForm.pageSize,
      }).then(() => {
        this.$set(
          this.stationDialogForm,
          "currentRowId",
          this.form.mainStationId
        );
        this.stationDialogForm.tableData.forEach((ele) => {
          if (ele.mainStationId === this.form.mainStationId) {
            this.changeRadio(true, ele);
          }
        });
      });
      queryMainStationDropDownList({ keyWord: "" }).then((res) => {
        this.mainStationOptions = res.data.data;
      });
    },
    getUserList(data) {
      userList(data).then((res) => {
        this.commonUserList = res.data.data ? res.data.data : [];
      });
    },
    handleInput(val) {
      if (val) {
        this.getUserList({
          userName: val,
          mainStationIdList: this.stationDialogForm.mainStationIdList,
          inMyMainStation: 0,
        });
      } else {
        this.getUserList({
          mainStationIdList: this.stationDialogForm.mainStationIdList,
          inMyMainStation: 1,
        });
      }
    },
    // 表格单选
    changeRadio(event, row) {
      if (this.dialogNum === 0) {
        this.$set(this.stationDialogForm, "changedRadio", row);
      } else if (this.dialogNum === 1) {
        this.$set(this.subStationDialogForm, "changedRadio", row);
      } else {
        this.$set(this.alarmInfoForm, "changedRadio", row);
      }
    },
    // 添加组织
    stationAdd() {
      let oldId = this.form.mainStationId;
      this.$set(
        this.form,
        "mainStationId",
        this.stationDialogForm.changedRadio.mainStationId
      ); //所属组织id
      this.$set(
        this.form,
        "mainStationName",
        this.stationDialogForm.changedRadio.mainStationName
      ); //所属组织名称
      this.$set(
        this.form,
        "stationCode",
        this.stationDialogForm.changedRadio.mainStationCode
      ); //所属组织编码
      this.cancel();
      if (oldId !== this.form.mainStationId) {
        this.form.subStationId = "";
        this.form.subStationName = "";
        this.form.equipmentName = "";
        this.form.equipmentCode = "";
        this.form.equipmentModel = "";
        this.form.positionId = "";
        this.form.equipmentType = "";
        this.form.positionName = "";
      }
    },
    //所属子期单选
    focusSubStation() {
      if (!this.form.mainStationId) {
        return this.$message.error("请先选择组织");
      }
      this.focusSubDialogVisible = true;
      this.dialogNum = 1;
      this.$refs.subStation.blur();
      this.getQuerySubStationList({
        mainStationIdList: this.form.mainStationId.split(","),
        pageNum: this.subStationDialogForm.pageNum,
        pageSize: this.subStationDialogForm.pageSize,
      }).then(() => {
        this.subStationDialogForm.currentRowId = this.form.subStationId;
        this.subStationDialogForm.tableData.forEach((ele) => {
          if (ele.id === this.form.subStationId) {
            this.changeRadio(true, ele);
          }
        });
      });
      querySubStationDropDownList({
        mainStationIdList: this.form.mainStationId.split(","),
      }).then((res) => {
        this.subStationOptions = res.data.data;
      });
    },
    // 添加子期
    subStationAdd() {
      let oldId = this.form.subStationId;
      this.$set(
        this.form,
        "subStationId",
        this.subStationDialogForm.changedRadio.id
      ); //子期id
      this.$set(
        this.form,
        "subStationName",
        this.subStationDialogForm.changedRadio.subStationName
      ); //子期名称
      this.cancel();
      if (oldId !== this.form.subStationId) {
        this.form.equipmentName = "";
        this.form.equipmentCode = "";
        this.form.equipmentModel = "";
        this.form.positionId = "";
        this.form.equipmentType = "";
        this.form.positionName = "";
      }
    },
    // 查询
    searchData() {
      if (this.dialogNum == 0) {
        this.getQueryMainStationList({
          mainStationIdList: this.stationDialogForm.mainStationIdList, //主站id list
          mainStationCode: this.stationDialogForm.mainStationCode, //组织编码
          mainStationPersonUserIds:
            this.stationDialogForm.mainStationPersonUserIds, //组织负责人
          pageNum: this.stationDialogForm.pageNum,
          pageSize: this.stationDialogForm.pageSize,
        });
      }
      if (this.dialogNum == 1) {
        this.getQuerySubStationList({
          mainStationIdList: this.form.mainStationId.split(","),
          subStationPersonName: this.subStationDialogForm.subStationPersonName,
          subStationCode: this.subStationDialogForm.subStationCode,
          subStationIdList: this.subStationDialogForm.subStationIdList,
          pageNum: this.subStationDialogForm.pageNum,
          pageSize: this.subStationDialogForm.pageSize,
        });
      }
      if (this.dialogNum == 2) {
        this.getQueryConfigureList({
          alarmInformation: this.alarmInfoForm.alarmInformation, // 告警信息
          warningLevel: this.alarmInfoForm.warningLevel, //告警级别
          isEffective: this.alarmInfoForm.isEffective, //告警是否有效
          alarmCategory: [this.form.alarmType], //告警类别
          equipmentType: [this.form.equipmentType], //设备类型
          warningType: [this.alarmInfoForm.currentRow.alarmType], //告警类型
          pageNum: this.alarmInfoForm.pageNum,
          pageSize: this.alarmInfoForm.pageSize,
        });
      }
    },
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 翻页事件
    handlePageChange(pageNum) {
      if (this.dialogNum === 0) {
        this.stationDialogForm.pageNum = pageNum;
      } else if (this.dialogNum === 1) {
        this.subStationDialogForm.pageNum = pageNum;
      } else {
        this.alarmInfoForm.pageNum = pageNum;
      }
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      if (this.dialogNum === 0) {
        return (
          index +
          1 +
          (this.stationDialogForm.pageNum - 1) * this.stationDialogForm.pageSize
        );
      } else if (this.dialogNum === 1) {
        return (
          index +
          1 +
          (this.subStationDialogForm.pageNum - 1) *
            this.subStationDialogForm.pageSize
        );
      } else {
        return (
          index +
          1 +
          (this.alarmInfoForm.pageNum - 1) * this.alarmInfoForm.pageSize
        );
      }
    },
    // 每页条数
    handleSizeChange(val) {
      if (this.dialogNum === 0) {
        this.stationDialogForm.pageSize = val;
      } else if (this.dialogNum === 1) {
        this.subStationDialogForm.pageSize = val;
      } else {
        this.alarmInfoForm.pageSize = val;
      }
      this.searchData();
    },
    // 弹窗取消
    cancel() {
      if (this.dialogNum === 0) {
        this.$refs.selectRef.value = [];
        this.$refs.selectRef.searchText = "";
        this.handleInput();
        this.focusMainDialogVisible = false;
        this.stationDialogForm = {
          currentRowId: "",
          tableData: [],
          total: 1,
          pageNum: 1,
          pageSize: 10,
          changedRadio: {},
          mainStationIdList: [],
          mainStationCode: "",
          mainStationPersonUserIds: [],
        };
      } else if (this.dialogNum === 1) {
        this.focusSubDialogVisible = false;
        this.subStationDialogForm = {
          //所属子期弹窗
          currentRowId: "",
          tableData: [],
          total: 1,
          pageNum: 1,
          pageSize: 10,
          changedRadio: {},
          subStationIdList: [],
          subStationPersonName: "",
          subStationCode: "",
        };
      } else {
        this.focusAlarmInfoVisible = false;
        this.alarmInfoForm = {
          currentRowId: "",
          currentRow: {},
          currentIndex: "",
          tableData: [],
          total: 1,
          pageNum: 1,
          pageSize: 10,
          changedRadio: {},
          alarmInformation: "", // 告警信息
          warningLevel: [], //告警级别
          isEffective: "", //告警是否有效
        };
      }
    },
    // 修改告警开始时间
    changeStartTime(val) {
      if (val && new Date(val) < new Date(this.form.workOrderTime)) {
        this.form.alarmStartTime = "";
        return this.$message.error("告警开始时间不得早于工单发起时间");
      }
      if (val && new Date(val) > new Date(this.form.alarmEndTime)) {
        this.form.alarmStartTime = "";
        return this.$message.error("告警开始时间不得早于告警结束时间");
      }
    },
    // 修改告警结束时间
    changeEndTime(val) {
      if (val && new Date(val) < new Date(this.form.workOrderTime)) {
        this.form.alarmEndTime = "";
        return this.$message.error("告警结束时间不得早于工单发起时间");
      }
      if (val && new Date(val) < new Date(this.form.alarmStartTime)) {
        this.form.alarmEndTime = "";
        return this.$message.error("告警结束时间不得早于告警开始时间");
      }
    },
    // 选择负责人数据
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    //负责人弹窗
    focusTree(num) {
      this.treeDialogVisible = true;
      this.treeNum = num;
      this.treeData = [];
      if (this.treeNum == 0) {
        this.$refs.treeRef0.blur();
        this.choice = true;
      }
      if (this.treeNum == 1) {
        this.$refs.treeRef1.blur();
        this.choice = false;
      }
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    // 添加负责人
    treeAdd() {
      this.treeDialogVisible = false;
      if (this.treeNum == 0) {
        console.log(this.addData);
        this.form.taskLeaderName = this.addData.name; //任务负责人名称
        this.form.taskLeader = this.addData.id; //任务负责人ID
      }
      if (this.treeNum == 1) {
        this.form.taskHelper = this.addData
          .map((v) => {
            return v.id;
          })
          .join(","); //主要协助人ID
        this.form.taskHelperName = this.addData
          .map((v) => {
            return v.name;
          })
          .join(","); //主要协助人名称
      }
      this.addData = [];
    },
    // 判断任务负责人，主要/一般协助人是否重复
    compare(arr1, arr2) {
      let result = false;
      arr1.forEach((ele) => {
        console.log(ele , arr2);
        if (ele && arr2.indexOf(ele) != -1) {
          result = true;
        }
      });
      return result;
    },
    // 设备名称弹窗
    focusEquipment() {
      this.equipmentVisible = true;
      this.$refs.equipmentRef.blur();
      if (this.form.subStationId) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    // 设备名称弹窗 - 添加
    equipmentAdd() {
      let oldId = this.form.positionId;
      this.equipmentVisible = false;
      this.form.equipmentName =
        this.$refs["positionRef"].chooseRedio.equipmentName;
      this.form.equipmentCode =
        this.$refs["positionRef"].chooseRedio.equipmentCode;
      this.form.equipmentModel =
        this.$refs["positionRef"].chooseRedio.equipmentModel;
      this.form.positionId = this.$refs["positionRef"].chooseRedio.id;
      this.form.equipmentType =
        this.$refs["positionRef"].chooseRedio.equipmentType;
      this.form.positionName =
        this.$refs["positionRef"].chooseRedio.positionName;
      this.form.pgb = "";
      this.form.pgbNo = "";
      if (!this.form.subStationId) {
        this.form.subStationId =
          this.$refs["positionRef"].chooseRedio.subStationId;
        this.form.subStationName =
          this.$refs["positionRef"].chooseRedio.subStationName;
      }
      if (
        this.form.equipmentType === "equipment_type_lpi" ||
        this.form.equipmentType === "equipment_type_jb_dc"
      ) {
        queryEquipmentList({ parentPositionId: this.form.positionId }).then(
          (res) => {
            this.pgbList = res.data.data;
          }
        );
      }
      if (oldId !== this.form.positionId) {
        this.form.situationExplainOrderDetailResponseList = [];
      }
    },
    // 设备名称弹窗 - 取消
    cancelEquipment() {
      this.equipmentVisible = false;
    },
    // 选择支路
    changePgb(val) {
      this.form.pgbNo = val.join(",");
    },
    // 添加行 - 告警类型编辑回显
    getAlarmType(alarmType) {
      let result = alarmType;
      this.warningTypeOptions.forEach((ele) => {
        if (ele.dictKey === alarmType) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 选择添加行 - 告警类型
    changeAlarmType(row) {
      console.log(row);
    },
    // 点击告警信息列 - 弹窗
    focusAlarmInfo(row, index) {
      if (!row.alarmType) {
        return this.$message.error("请先选择告警类型");
      }
      if(!this.form.equipmentType) this.form.equipmentType=''
      this.focusAlarmInfoVisible = true;
      this.dialogNum = 2;
      this.alarmInfoForm.currentRow = row;
      this.alarmInfoForm.currentIndex = index;
      this.$set(this.alarmInfoForm, "currentRowId", row.daTag);
      this.getQueryConfigureList({
        alarmCategory: [this.form.alarmType], //告警类别
        equipmentType: [this.form.equipmentType], //设备类型
        warningType: [row.alarmType], //告警类型
        pageNum: this.alarmInfoForm.pageNum,
        pageSize: this.alarmInfoForm.pageSize,
      }).then(() => {
        this.alarmInfoForm.tableData.forEach((ele) => {
          console.log(ele.alarmCode, this.alarmInfoForm.currentRowId);
          if (ele.alarmCode === this.alarmInfoForm.currentRowId) {
            this.changeRadio(true, ele);
          }
        });
      });
    },
    // 告警级别format
    alarmLevelFormat(row) {
      let result = row.alarmLevel;
      this.warningLevelOptions.forEach((ele) => {
        if (ele.dictKey === row.alarmLevel) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 添加告警信息
    alarmInfoAdd() {
      this.$set(
        this.form.situationExplainOrderDetailResponseList[
          this.alarmInfoForm.currentIndex
        ],
        "alarmInfo",
        this.alarmInfoForm.changedRadio.alarmInformation
      ); //告警信息
      this.$set(
        this.form.situationExplainOrderDetailResponseList[
          this.alarmInfoForm.currentIndex
        ],
        "alarmLevel",
        this.alarmInfoForm.changedRadio.warningLevel
      ); //告警级别
      this.$set(
        this.form.situationExplainOrderDetailResponseList[
          this.alarmInfoForm.currentIndex
        ],
        "daTag",
        this.alarmInfoForm.changedRadio.alarmCode
      ); //datag
      console.log(
        this.form.situationExplainOrderDetailResponseList[
          this.alarmInfoForm.currentIndex
        ]
      );
      this.cancel();
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  min-height: calc(100vh - 124px);
  margin-bottom: 26px;
  // overflow: auto;
  /deep/.el-card__body {
    // height: 100%;
    .table {
      height: calc(100% - 260px);
      // border: 1px solid #d2d2d2;
      padding: 5px;
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
      .el-table th {
        color: #666;
      }
      .el-table td .el-form-item {
        margin: 16px 0;
      }
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
}
.details-title {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #b3d8ff;
  display: flex;
  justify-content: space-between;
  .right {
    display: flex;
    justify-content: flex-end;
  }
}
.form-box {
  display: flex;
  flex-wrap: wrap;
  // margin-left: 20px;
  width: 100%;
  /deep/.el-form-item {
    display: flex;
    width: 33.33%;
    .el-form-item__label {
      padding: 10px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 130px;
      display: block;
      font-weight: bold;
    }
    .el-form-item__content {
      margin: 0 !important;
      margin-left: 10px !important;
      width: calc(100% - 160px);
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
        width: 100%;
      }
    }
  }
  .title-text {
    color: rgb(96, 98, 102);
    line-height: 40px;
    width: 100%;
    text-align: left;
    padding: 10px 16px 15px;
    border-top: 1px solid #b3d8ff;
    font-size: 20px;
    font-weight: bold;
  }
}

.focus-main-dialogs {
  /deep/.el-tag.el-tag--info {
    max-width: 114px;
    overflow: hidden;
    position: relative;
    .el-select__tags-text {
      max-width: 84px;
      overflow: hidden;
      display: inline-block;
    }
    .el-tag__close {
      position: relative;
      top: -7px;
      right: 0;
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
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
