<template>
  <div>
    <el-card class="box-card">
      <div class="details-title">
        <div class="left"></div>
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            @click="compile"
            v-if="processList.isCurrentNodeOperator == 'true' ? true : false"
            >处理流程
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
            type="primary"
            size="small"
            plain
            class="el-icon-download"
            v-if="$route.query.id"
            @click.stop="handleExport"
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
            <el-input
              v-model="form.title"
              placeholder="请输入"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="工单编号" prop="wordOrderNo">
            <el-input
              v-model="form.workOrderNo"
              disabled
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属组织" prop="mainStationName">
            <el-input
              v-model="form.mainStationName"
              placeholder="请选择"
              @focus="focusMainStation"
              disabled
              ref="mainStation"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属子期" prop="sonStationName">
            <el-input
              v-model="form.sonStationName"
              placeholder="请输入"
              @focus="focusSubStation"
              ref="subStation"
              disabled
            ></el-input>
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
          <el-form-item label="告警开始时间" prop="alarmStartTime">
            <el-date-picker
              v-model="form.alarmStartTime"
              disabled
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工单发起时间" prop="wordOrderStartTime">
            <el-input v-model="form.workOrderTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="告警类别" prop="alarmCategory">
            <el-select
              v-model="form.alarmType"
              clearable
              disabled
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
          <el-form-item label="发起人" prop="initiatorName">
            <el-input v-model="form.initiatorName" disabled></el-input>
          </el-form-item>
          <el-form-item
            label="任务负责人"
            :prop="
              $route.query.id || !$route.query.taskDefinitionKey == 'draft'
                ? ''
                : 'taskLeader'
            "
          >
            <el-input
              v-model="form.taskLeaderName"
              placeholder="请输入"
              ref="treeRef0"
              :disabled="
                $route.query.id ||
                $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                $route.query.taskDefinitionKey == 'xye_acs_site_confirm' ||
                $route.query.taskDefinitionKey ==
                  'xye_acs_station_confirm_two' ||
                $route.query.taskDefinitionKey == 'xye_acs_control_confrim'
              "
              @focus="focusTree(0)"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务协助人" prop="taskHelpers">
            <el-input
              v-model="form.majorHelperName"
              placeholder="请输入"
              ref="treeRef1"
              :disabled="
                $route.query.id ||
                $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                $route.query.taskDefinitionKey == 'xye_acs_site_confirm' ||
                $route.query.taskDefinitionKey ==
                  'xye_acs_station_confirm_two' ||
                $route.query.taskDefinitionKey == 'xye_acs_control_confrim'
              "
              @focus="focusTree(1)"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input
              v-model="form.equipmentName"
              disabled
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备位置编码" prop="positionCode">
            <el-input v-model="form.positionCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="equipmentModel">
            <el-input v-model="form.equipmentModel" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备位置名称" prop="positionCode">
            <el-input v-model="form.positionCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="支路" prop="pgb">
            <el-select
              v-model="form.pgb"
              clearable
              default-first-option
              disabled
              placeholder="请选择"
            >
              <el-option
                v-for="item in 2"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支路编码" prop="pgbNo">
            <el-input v-model="form.pgbNo" disabled></el-input>
          </el-form-item>
          <el-form-item label="最高告警级别" prop="alarmLevel">
            <el-input v-model="form.alarmLevel" disabled></el-input>
          </el-form-item>
          <el-form-item label="影响容量(kW)" prop="influenceCapacity">
            <el-input
              v-model="form.influenceCapacity"
              placeholder="请输入"
              disabled
            ></el-input>
          </el-form-item>
          <div class="title-text">告警信息详情</div>
        </div>
        <div class="table" :class="!$route.query.id ? 'formTable' : ''">
          <el-table
            ref="multipleTable"
            :data="form.alarmInfoDetails"
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
                {{ scope.row.alarmType | filterOptions(warningTypeOptions) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmInfo"
              label="告警信息"
              show-overflow-tooltip
              align="center"
              key="day2"
            >
            </el-table-column>
            <el-table-column
              prop="alarmLevel"
              label="告警级别"
              show-overflow-tooltip
              align="center"
              key="day3"
            >
              <template slot-scope="scope">
                {{ scope.row.alarmLevel | filterOptions(warningLevelOptions) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmStartTime"
              label="告警开始时间"
              min-width="120px"
              align="center"
              header-align="center"
              key="day4"
            >
            </el-table-column>
            <el-table-column
              prop="alarmNum"
              label="累计发生次数"
              show-overflow-tooltip
              align="center"
              key="day5"
            >
            </el-table-column>
            <el-table-column
              prop="informationNote"
              label="问题描述及分析"
              show-overflow-tooltip
              align="center"
              key="day5"
              width="300"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'alarmInfoDetails.' + scope.$index + '.informationNote'
                  "
                  :rules="
                    $route.query.id ||
                    $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                    $route.query.taskDefinitionKey == 'draft' ||
                    $route.query.taskDefinitionKey == 'xye_acs_task_person'
                      ? ''
                      : rules.informationNote
                  "
                >
                  <el-input
                    v-model="scope.row.informationNote"
                    placeholder="请输入"
                    :disabled="
                      $route.query.id ||
                      $route.query.taskDefinitionKey == 'draft' ||
                      $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_start_confirm' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_control_confrim'
                    "
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="treatmentResult"
              label="处理结果"
              show-overflow-tooltip
              align="center"
              key="day5"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'alarmInfoDetails.' + scope.$index + '.treatmentResult'
                  "
                  :rules="
                    $route.query.id ||
                    $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                    $route.query.taskDefinitionKey == 'draft' ||
                    $route.query.taskDefinitionKey == 'xye_acs_task_person'
                      ? ''
                      : rules.treatmentResult
                  "
                >
                  <el-select
                    v-model="scope.row.treatmentResult"
                    :disabled="
                      $route.query.id ||
                      $route.query.taskDefinitionKey == 'draft' ||
                      $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_start_confirm' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_control_confrim'
                    "
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in handleResultOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="centralizedControlAnalysis"
              label="集控意见"
              show-overflow-tooltip
              align="center"
              key="day5"
            >
              <template scope="scope">
                <el-form-item
                  :prop="
                    'alarmInfoDetails.' +
                    scope.$index +
                    '.centralizedControlAnalysis'
                  "
                  :rules="
                    $route.query.taskDefinitionKey ==
                      'xye_acs_station_confirm_one' ||
                    $route.query.taskDefinitionKey ==
                      'xye_acs_station_confirm_two' ||
                    $route.query.taskDefinitionKey == 'xye_acs_site_confirm' ||
                    $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                    $route.query.id ||
                    $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                    $route.query.taskDefinitionKey == 'draft'
                      ? ''
                      : rules.centralizedControlAnalysis
                  "
                >
                  <el-select
                    v-model="scope.row.centralizedControlAnalysis"
                    :disabled="
                      $route.query.id ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_station_confirm_one' ||
                      $route.query.taskDefinitionKey == 'draft' ||
                      $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_start_confirm' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_station_confirm_two' ||
                      !$route.query.taskDefinitionKey ==
                        'xye_acs_control_confrim' ||
                      $route.query.taskDefinitionKey == 'xye_acs_site_confirm'
                    "
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
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="集控分析"
              show-overflow-tooltip
              align="center"
              key="day5"
              width="300"
              prop="centralizedControlOpinion"
            >
              <template slot-scope="scope">
                <el-form-item
                  :key="scope.row.id"
                  :prop="
                    'alarmInfoDetails.' +
                    scope.$index +
                    '.centralizedControlOpinion'
                  "
                  v-show="scope.row.centralizedControlAnalysis == 1"
                  :rules="
                    $route.query.taskDefinitionKey ==
                      'xye_acs_station_confirm_one' ||
                    $route.query.taskDefinitionKey ==
                      'xye_acs_station_confirm_two' ||
                    $route.query.taskDefinitionKey == 'draft' ||
                    $route.query.taskDefinitionKey == 'xye_acs_site_confirm' ||
                    $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                    $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                    $route.query.id
                      ? ''
                      : {
                          required:
                            scope.row.centralizedControlAnalysis == 1
                              ? true
                              : false,
                          message: '请填写集控分析',
                          trigger: ['blur', 'change'],
                        }
                  "
                >
                  <el-input
                    v-model="scope.row.centralizedControlOpinion"
                    placeholder="请输入"
                    :disabled="
                      $route.query.id ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_station_confirm_one' ||
                      $route.query.taskDefinitionKey == 'draft' ||
                      $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_start_confirm' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_station_confirm_two' ||
                      !$route.query.taskDefinitionKey ==
                        'xye_acs_control_confrim' ||
                      $route.query.taskDefinitionKey == 'xye_acs_site_confirm'
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :key="scope.row.id"
                  v-if="
                    scope.row.centralizedControlAnalysis == 0 ||
                    scope.row.centralizedControlAnalysis == null
                  "
                  :prop="
                    'alarmInfoDetails.' +
                    scope.$index +
                    '.centralizedControlOpinion'
                  "
                >
                  <el-input
                    v-model="scope.row.centralizedControlOpinion"
                    placeholder="请输入"
                    :disabled="
                      $route.query.id ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_station_confirm_one' ||
                      $route.query.taskDefinitionKey == 'draft' ||
                      $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_start_confirm' ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_station_confirm_two' ||
                      !$route.query.taskDefinitionKey ==
                        'xye_acs_control_confrim' ||
                      $route.query.taskDefinitionKey == 'xye_acs_site_confirm'
                    "
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              key="day7"
              fixed="right"
              width="100"
            >
              <template slot-scope="scope">
                <el-tag @click="lookRecord(scope.row)">查询</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="form-box">
          <el-form-item
            label="告警结束时间"
            :prop="
              $route.query.taskDefinitionKey == 'xye_acs_site_confirm'
                ? 'alarmEndTime'
                : ''
            "
            style="width: 33.33%"
          >
            <el-date-picker
              v-model="form.alarmEndTime"
              :disabled="
                $route.query.id ||
                $route.query.taskDefinitionKey ==
                  'xye_acs_station_confirm_one' ||
                $route.query.taskDefinitionKey == 'draft' ||
                $route.query.taskDefinitionKey == 'xye_acs_start_confirm' ||
                $route.query.taskDefinitionKey ==
                  'xye_acs_station_confirm_two' ||
                $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                $route.query.taskDefinitionKey == 'xye_acs_control_confrim'
              "
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="集控确认时间"
            prop="centralizedControlConfirmationTime"
            style="width: 33.33%"
          >
            <el-date-picker
              v-model="form.centralizedControlConfirmationTime"
              disabled
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" style="width: 66.66%">
            <el-input
              v-model="form.remarks"
              type="textarea"
              :autosize="{ minRows: 2 }"
              :disabled="
                $route.query.id ||
                $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                $route.query.taskDefinitionKey == 'xye_acs_start_confirm'
              "
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-box">
          <el-form-item label="附件上传" prop="imgList" style="width: 100%">
            <el-upload
              action="#"
              list-type="picture-card"
              :disabled="
                $route.query.id ||
                $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                $route.query.taskDefinitionKey == 'xye_acs_task_person' ||
                $route.query.taskDefinitionKey == 'xye_acs_start_confirm'
              "
              :auto-upload="false"
              :file-list="form.imgList"
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
                    v-if="
                      $route.query.id ||
                      $route.query.taskDefinitionKey ==
                        'xye_acs_start_confirm' ||
                      $route.query.taskDefinitionKey == 'xye_acs_task_person'
                        ? false
                        : true
                    "
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
    <!-- 弹窗 -->
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
    <!-- 告警处理 -->
    <el-dialog
      title="告警处理记录"
      :visible.sync="focusMainDialogVisiblet"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-table">
          <el-table :data="tableDatats" style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column label="处理方式" prop="desc" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.daName" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="工单单号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit" disabled></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisiblet = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { tree } from "@/api/organization/allStation";
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
import lrz from "lrz";
import {
  getDetail,
  exportList,
  remove,
  queryChecktaskDatagList,
  getProcessTaskDetail,
  runProcess,
  saveProcess,
  queryProcessDetail,
} from "@/api/taskManagement/alarmConfirmation";
import {
  queryMainStationList,
  queryMainStationDropDownList,
} from "@/api/organization/allStation";
// import { addMaintain } from "@/api/order/repairOrder";
import Tree from "@/components/organization/tree.vue";
import mySelect from "@/components/select/select.vue";
import { userList } from "@/api/organization/staging";
import {
  querySubStationList,
  querySubStationDropDownList,
} from "@/api/organization/substation";
export default {
  name: "",
  components: { mySelect, Tree },
  props: {
    id: String,
    dataId: String,
    value: Object,
    processNodeId: String,
    processInstanceId: String,
  },
  data() {
    return {
      choose: [
        { key: "同意", id: "0" },
        { key: "不同意", id: "1" },
      ],
      dialogImageUrl: "",
      imgDialogVisible: false,
      flag: true, //控制流程的权限
      focusMainDialogVisiblet: false, //告警处理弹窗
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions") //设备类型
      ),
      alarmCategoryOptions: JSON.parse(
        window.localStorage.getItem("alarmCategoryOptions") //告警类别
      ),
      handleResultOptions: JSON.parse(
        window.localStorage.getItem("handleResultOptions")
      ), //处理结果
      warningTypeOptions: JSON.parse(
        window.localStorage.getItem("warningTypeOptions") //告警类型
      ),
      warningLevelOptions: JSON.parse(
        window.localStorage.getItem("warningLevelOptions") //告警级别
      ),
      rules: {
        taskLeader: [
          { required: true, message: "请选择任务负责人", trigger: "change" },
        ],
        informationNote: [
          { required: true, message: "请填写问题描述", trigger: "change" },
        ],
        treatmentResult: [
          { required: true, message: "请选择吃力结果", trigger: "change" },
        ],
        centralizedControlAnalysis: [
          {
            required: true,
            message: "选择集控意见",
            trigger: ["blur", "change"],
          },
        ],
        centralizedControlOpinion: [
          { required: true, message: "请填写集控分析", trigger: "change" },
        ],
        alarmEndTime: [
          { required: true, message: "请填写告警结束时间", trigger: "change" },
        ],
      },
      form: {
        imgList: [],
        stationCode: "", //电站简称
        stationName: "", //电站名称
        maintainTitle: "", //标题
        stationId: "", //所属组织
        sonStationId: "", //所属子期
        sonStationName: "", //所属子期名称
        equipmentName: "", //设备名称
        workOrderNo: "", //工单编号
        workOrderStatus: "", //工单状态
        alarmStartTime: "", //告警开始时间
        alarmEndTime: "", //告警结束时间
        taskLeader: "", //任务负责人
        taskLeaderName: "", // 任务负责人姓名
        workOrderTime: "", //工单发起时间
        alarmType: "", //告警类别
        taskHelpers: "", //任务协助人
        majorHelperName: "", //任务协助人姓名
        alarmInfoDetails: [
          {
            //告警信息详情
            id: "", //详情ID
            informationNote: "", //问题描述及分析
            treatmentResult: "", //处理结果
            centralizedControlOpinion: "", //集控分析
            centralizedControlAnalysis: "", //集控意见
          },
        ],
      },
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
      processList: {},
      treeDialogVisible: false,
      treeData: [],
      choice: true,
      addData: "",
      treeNum: "",
      defaultProps: {
        children: "children",
        label: "title",
      },
      btnshow: false,
      orderStateOptions: JSON.parse(localStorage.getItem("orderStateOptions")), // 工单状态下拉
      faultTypeOptions: JSON.parse(localStorage.getItem("faultTypeOptions")), // 故障类型下拉
      dataSourceOptions: JSON.parse(localStorage.getItem("dataSourceOptions")), // 数据来源字典
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
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  mounted() {
    if (this.$route.query.id) {
      getDetail({ id: this.$route.query.id }).then((res) => {
        this.form = res.data.data;
        queryProcessDetail({
          processInstanceId: this.form.processInstanceId,
        }).then((res) => {
          this.processList = res.data.data;
          console.log(res, "xxxxxx");
        });
        if (!(res.data.data.files == null)) {
          this.form.imgList = res.data.data.files;
          res.data.data.files.forEach((item) => {
            item.url = this.imgUrl + item.fileId;
          });
        } else {
          this.form.imgList = [];
        }
        this.form.majorHelperName = Object.values(this.form.taskHelpers).join(
          ","
        ); //协助人姓名
        this.form.taskHelpers = Object.keys(this.form.taskHelpers);
      });
    } else {
      console.log("走了流程");
      getProcessTaskDetail({ id: this.processInstanceId }).then((res) => {
        this.form = res.data.data;
        if (!(res.data.data.files == null)) {
          this.form.imgList = res.data.data.files;
          res.data.data.files.forEach((item) => {
            item.url = this.imgUrl + item.fileId;
          });
        } else {
          this.form.imgList = [];
        }
        this.form.majorHelperName = Object.values(this.form.taskHelpers).join(
          ","
        ); //协助人姓名
        this.form.taskHelpers = Object.keys(this.form.taskHelpers);
      });
    }
    userList({ userName: "", inMyMainStation: 1 }).then((res) => {
      this.commonUserList = res.data.data;
    });
  },
  methods: {
    afterBtnClick(code) {
      console.log(this.form, code);
      if (code === "saveBtnCode") {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log("xxx");
            if (this.form.taskHelpers.indexOf(this.form.taskLeader) >= 0) {
              return this.$message.error("任务负责人，任务协助人不能兼任!");
            }
            if (this.form.imgList) {
              this.form.imgList.forEach((v) => {
                v.domain = v.url;
              });
            } else {
              this.form.imgList = [];
            }
            saveProcess({
              id: this.form.id,
              taskLeader: this.form.taskLeader,
              taskHelpers: this.form.taskHelpers,
              processInstanceId: this.processInstanceId,
              alarmEndTime: this.form.alarmEndTime, //告警结束时间
              remarks: this.form.remarks, //备注
              details: this.form.alarmInfoDetails,
              minioFileList: this.form.imgList,
            }).then((res) => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
                // this.$router.back();
                this.$router.push("/work/todo");
              }
            });
          }
        });
      }
      if (code === "agreeBtnCode") {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log("xxx");
            if (this.form.taskHelpers.indexOf(this.form.taskLeader) >= 0) {
              return this.$message.error("任务负责人，任务协助人不能兼任!");
            }
            if (this.form.imgList) {
              this.form.imgList.forEach((v) => {
                v.domain = v.url;
              });
            } else {
              this.form.imgList = [];
            }
            runProcess({
              id: this.form.id,
              taskLeader: this.form.taskLeader,
              taskHelpers: this.form.taskHelpers,
              processInstanceId: this.processInstanceId,
              alarmEndTime: this.form.alarmEndTime, //告警结束时间
              remarks: this.form.remarks, //备注
              details: this.form.alarmInfoDetails,
              minioFileList: this.form.imgList,
            }).then((res) => {
              if (res.data.success) {
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
                // this.$router.back();
                this.$router.push("/work/todo");
              }
            });
          }
        });
      }
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
    // 附件图片删除
    handleRemove(file) {
      console.log(this.form.imgList);
      const i = this.form.imgList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.imgList.splice(i, 1);
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
    //导出
    handleExport() {
      exportList({
        id: this.$route.query.id,
      })
        .then((res) => {
          console.log(res);
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "告警确认单列表.xls"; //下载的文件名
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
    //删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ id: [this.$route.query.id] }).then(() => {
          this.searchData();
        });
      });
    },
    // 查询
    lookRecord(row) {
      queryChecktaskDatagList({ alarmDetailId: row.id }).then((res) => {
        this.tableDatats = res.data.data;
        // this.pageNums = res.data.data.pageNum;
        // this.pageSizes = res.data.data.pageSize;
      });
      this.focusMainDialogVisiblet = true;
    },
    //    this.$refs.form.validate((valid) => {
    //   if (valid) {
    //     if (this.form.taskHelpers.indexOf(this.form.taskLeader) >= 0) {
    //       return this.$message.error("任务负责人，任务协助人不能兼任!");
    //     }
    //     if (this.form.imgList) {
    //       this.form.imgList.forEach((v) => {
    //         v.domain = v.url;
    //       });
    //     } else {
    //       this.form.imgList = [];
    //     }
    //     edit({
    //       id: this.$route.query.id,
    //       taskLeader: this.form.taskLeader,
    //       taskHelpers: this.form.taskHelpers,
    //       minioFileList: this.form.imgList,
    //     }).then((res) => {
    //       if (res.data.code == "200") {
    //         this.$message({
    //           message: "编辑成功!",
    //           type: "success",
    //         });
    //         this.$router.push({ path: "./alarmConfirmation" });
    //       } else {
    //         this.$message.error("编辑失败");
    //       }
    //     });
    //   }
    // });
    // 新建、提交
    compile() {
      let fromView = "DEAL";
      this.processList.businessId = this.$route.query.id;
      this.processList.fromView = fromView;
      this.$router.push({
        path: `/work/process/handle`,
        query: this.processList,
      });
      console.log(this.processList, "--------------");
    },
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
    //所属组织单选
    focusMainStation() {
      this.focusMainDialogVisible = true;
      this.dialogNum = 0;
      this.$refs.mainStation.blur();
      this.getQueryMainStationList({
        pageNum: this.stationDialogForm.pageNum,
        pageSize: this.stationDialogForm.pageSize,
      }).then(() => {
        this.$set(this.stationDialogForm, "currentRowId", this.form.stationId);
        this.stationDialogForm.tableData.forEach((ele) => {
          if (ele.mainStationId === this.form.stationId) {
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
      }
    },
    // 添加组织
    stationAdd() {
      this.$set(
        this.form,
        "stationId",
        this.stationDialogForm.changedRadio.mainStationId
      ); //所属组织id
      this.$set(
        this.form,
        "stationName",
        this.stationDialogForm.changedRadio.mainStationName
      ); //所属组织名称
      this.$set(
        this.form,
        "stationCode",
        this.stationDialogForm.changedRadio.mainStationCode
      ); //所属组织编码
      this.cancel();
      this.clearRow();
    },
    //所属子期单选
    focusSubStation() {
      if (!this.form.stationId) {
        return this.$message.error("请先选择组织");
      }
      this.focusSubDialogVisible = true;
      this.dialogNum = 1;
      this.$refs.subStation.blur();
      this.getQuerySubStationList({
        mainStationIdList: this.form.stationId.split(","),
        pageNum: this.subStationDialogForm.pageNum,
        pageSize: this.subStationDialogForm.pageSize,
      }).then(() => {
        this.subStationDialogForm.currentRowId = this.form.sonStationId;
        this.subStationDialogForm.tableData.forEach((ele) => {
          if (ele.id === this.form.sonStationId) {
            this.changeRadio(true, ele);
          }
        });
      });
      querySubStationDropDownList({
        mainStationIdList: this.form.stationId.split(","),
      }).then((res) => {
        this.subStationOptions = res.data.data;
      });
    },
    // 添加子期
    subStationAdd() {
      this.$set(
        this.form,
        "sonStationId",
        this.subStationDialogForm.changedRadio.id
      ); //子期id
      this.$set(
        this.form,
        "sonStationName",
        this.subStationDialogForm.changedRadio.subStationName
      ); //子期名称
      this.cancel();
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
          mainStationIdList: this.form.stationId.split(","),
          subStationPersonName: this.subStationDialogForm.subStationPersonName,
          subStationCode: this.subStationDialogForm.subStationCode,
          subStationIdList: this.subStationDialogForm.subStationIdList,
          pageNum: this.subStationDialogForm.pageNum,
          pageSize: this.subStationDialogForm.pageSize,
        });
      }
      if (this.dialogNum == 2) {
        this.getqueryList({
          areaName: this.dialogform.areaName,
          areaCode: this.dialogform.areaCode,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
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
      }
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
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
        this.form.taskLeader = this.addData.id; //任务负责人ID
        this.form.taskLeaderName = this.addData.name; //任务负责人名称
      }
      if (this.treeNum == 1) {
        this.form.taskHelpers = this.addData.map((v) => {
          return v.id;
        }); //主要协助人ID
        this.form.majorHelperName = this.addData
          .map((v) => {
            return v.name;
          })
          .join(","); //主要协助人姓名
      }
      this.addData = [];
    },
    // 判断任务负责人，主要/一般协助人是否重复
    compare(arr1, arr2) {
      let result = false;
      arr1.forEach((ele) => {
        if (ele && arr2.indexOf(ele) != -1) {
          result = true;
        }
      });
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  min-height: calc(100vh - 124px);
  margin-bottom: 26px;
  overflow: auto;
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
        margin: 12px 0;
      }
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
}
.details-title {
  position: sticky;
  background-color: white;
  z-index: 999;
  top: 0;
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
