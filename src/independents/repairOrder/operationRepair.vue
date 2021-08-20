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
            icon="el-icon-plus"
            @click="compile"
            v-if="!$route.query.id"
            >{{ form.id ? (listState ? "提交" : "编辑") : "新增" }}
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
            @click.stop="exportDetail"
            >导出</el-button
          >
          <!-- //!无导出 -->
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
          <el-form-item label="标题" prop="maintainTitle" style="width: 66.66%">
            <el-input
              :disabled="($route.query.id && !listState) || !!processInstanceId"
              v-model="form.maintainTitle"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="工单编号" prop="workOrderNo">
            <el-input
              :disabled="($route.query.id && !listState) || !!processInstanceId"
              readonly
              v-model="form.workOrderNo"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属组织" prop="stationName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.stationName"
              placeholder="请选择"
              @focus="focusMainStation"
              ref="mainStation"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属子期" prop="sonStationName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 0)
              "
              v-model="form.sonStationName"
              placeholder="请输入"
              @focus="focusSubStation"
              ref="subStation"
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
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.alarmStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
              @change="changeStartTime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工单发起时间" prop="workOrderTime">
            <el-input
              v-model="form.workOrderTime"
              readonly
              :disabled="($route.query.id && !listState) || !!processInstanceId"
            ></el-input>
          </el-form-item>
          <el-form-item label="告警类别" prop="alarmType">
            <el-select
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.alarmType"
              clearable
              default-first-option
              placeholder="请选择"
              @change="form.addMaintainDetailsRequestList = []"
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
          <el-form-item label="设备是否故障" prop="equipmentMalfunction">
            <el-radio-group
              v-model="form.equipmentMalfunction"
              :disabled="($route.query.id && !listState) || !!processInstanceId"
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="任务负责人" prop="eliminationManagerName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.eliminationManagerName"
              placeholder="请输入"
              ref="treeRef0"
              @focus="focusTree(0)"
            ></el-input>
          </el-form-item>
          <el-form-item label="发起人" prop="initiatorName">
            <el-input
              v-model="form.initiatorName"
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="主要协助人" prop="majorHelperName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.majorHelperName"
              placeholder="请输入"
              ref="treeRef1"
              @focus="focusTree(1)"
            ></el-input>
          </el-form-item>
          <el-form-item label="一般协助人" prop="generalHelperName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.generalHelperName"
              placeholder="请输入"
              ref="treeRef2"
              @focus="focusTree(2)"
            ></el-input>
          </el-form-item>
          <el-form-item label="总部协助" prop="hqHelp">
            <el-radio-group
              v-model="form.hqHelp"
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="总部协助人"
            :rules="form.hqHelp === 0 ? [{ required: false }] : rules.hqHelper"
            prop="hqHelper"
          >
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.hqHelperName"
              placeholder="请输入"
              ref="treeRef3"
              @focus="focusTree(3)"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              v-model="form.equipmentName"
              placeholder="请选择"
              ref="equipmentRef"
              @focus="focusEquipment"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备位置编码" prop="positionCode">
            <el-input
              v-model="form.positionCode"
              readonly
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="equipmentModel">
            <el-input
              v-model="form.equipmentModel"
              readonly
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="设备位置名称" prop="positionName">
            <el-input
              v-model="form.positionName"
              readonly
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="支路" prop="pgb">
            <el-select
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
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
                :key="item.positionCode"
                :label="item.equipmentName"
                :value="item.positionCode"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="form.pgb"
              readonly
              v-else
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="支路编码" prop="pgbNo">
            <el-input
              v-model="form.pgbNo"
              readonly
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="最高告警级别" prop="highAlarmLevel">
            <el-select
              v-model="form.highAlarmLevel"
              default-first-option
              placeholder=""
              disabled
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
          <el-form-item label="关联单号" prop="associatedNumber">
            <el-input
              disabled
              v-model="form.associatedNumber"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="告警描述" prop="alarmInfo" style="width: 100%;">
            <el-input
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              type="textarea"
              v-model="form.alarmInfo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="告警图片"
            prop="alarmPicture"
            style="width: 100%;"
          >
            <el-upload
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2)
              "
              action="#"
              list-type="picture-card"
              :file-list="form.fileList"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="处理方法"
            prop="manageMethod"
            style="width: 100%;"
            :rules="
              !processInstanceId || (!!processInstanceId && currentNode !== 5)
                ? [{ required: false }]
                : rules.manageMethod
            "
          >
            <el-input
              :disabled="
                !processInstanceId || (!!processInstanceId && currentNode !== 5)
              "
              type="textarea"
              v-model="form.manageMethod"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="处理图片"
            prop="managePicture"
            style="width: 100%;"
          >
            <el-upload
              :disabled="
                !processInstanceId || (!!processInstanceId && currentNode !== 5)
              "
              action="#"
              list-type="picture-card"
              :file-list="form.fileListDo"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveDo"
              :on-change="handleChangeDo"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="告警结束时间" prop="alarmEndTime">
            <!-- <el-date-picker
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId && currentNode !== 5)
              "
              v-model="form.alarmEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择"
              @change="changeEndTime"
            >
            </el-date-picker> -->
            <el-input v-model="form.alarmEndTime" readonly disabled></el-input>
          </el-form-item>
          <el-form-item
            label="故障类型"
            prop="malfunctionType"
            :rules="
              !processInstanceId || (!!processInstanceId && currentNode !== 5)
                ? [{ required: false }]
                : rules.malfunctionType
            "
          >
            <el-select
              :disabled="
                !processInstanceId || (!!processInstanceId && currentNode !== 5)
              "
              v-model="form.malfunctionType"
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in faultTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警持续时长(h)" prop="alarmHour">
            <el-input v-model="form.alarmHour" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="告警消缺时长(h)" prop="eliminationHour">
            <el-input
              v-model="form.eliminationHour"
              readonly
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="有无电量损失" prop="isPowerLoss">
            <el-radio-group
              v-model="form.isPowerLoss"
              :disabled="
                ($route.query.id && !listState) ||
                  (!!processInstanceId &&
                    currentNode !== 0 &&
                    currentNode !== 1 &&
                    currentNode !== 2 &&
                    currentNode !== 5)
              "
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="损失电量(kWh)" prop="powerLoss">
            <el-input
              disabled
              v-model.number="form.powerLoss"
              placeholder="请输入"
              type="number"
              oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
            ></el-input>
          </el-form-item>
          <el-form-item label="影响容量(kW)" prop="influenceCapacity">
            <el-input
              v-model="form.influenceCapacity"
              readonly
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="设备影响数量" prop="influenceEquipmentNum">
            <el-input
              :disabled="
                !processInstanceId || (!!processInstanceId && currentNode !== 5)
              "
              v-model.number="form.influenceEquipmentNum"
              placeholder="请输入"
              type="number"
              oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否完成" prop="isAccomplish">
            <el-radio-group v-model="form.isAccomplish" disabled>
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据来源" prop="dataSources">
            <el-select
              disabled
              v-model="form.dataSources"
              clearable
              default-first-option
              placeholder=""
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
          <el-form-item
            label="原因判断"
            prop="cause"
            style="width: 100%;"
            :rules="
              !processInstanceId || (!!processInstanceId && currentNode !== 8)
                ? [{ required: false }]
                : rules.cause
            "
          >
            <el-input
              :disabled="
                !processInstanceId || (!!processInstanceId && currentNode !== 8)
              "
              v-model="form.cause"
              type="textarea"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="防范措施"
            prop="precautionaryMeasure"
            style="width: 100%;"
            :rules="
              !processInstanceId || (!!processInstanceId && currentNode !== 8)
                ? [{ required: false }]
                : rules.precautionaryMeasure
            "
          >
            <el-input
              :disabled="
                !processInstanceId || (!!processInstanceId && currentNode !== 8)
              "
              v-model="form.precautionaryMeasure"
              type="textarea"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <div class="title-text">告警信息详情</div>
        </div>
        <div class="table" :class="!$route.query.id ? 'formTable' : ''">
          <el-table
            ref="multipleTable"
            :data="form.addMaintainDetailsRequestList"
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
                <div
                  v-if="
                    ($route.query.id && !listState) ||
                      (!!processInstanceId &&
                        currentNode !== 0 &&
                        currentNode !== 1 &&
                        currentNode !== 2 &&
                        currentNode !== 5)
                  "
                >
                  {{ getAlarmType(scope.row.alarmType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'addMaintainDetailsRequestList.' +
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
                </div>
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
                <div
                  v-if="
                    ($route.query.id && !listState) ||
                      (!!processInstanceId &&
                        currentNode !== 0 &&
                        currentNode !== 1 &&
                        currentNode !== 2 &&
                        currentNode !== 5)
                  "
                >
                  {{ scope.row.alarmInfo }}
                </div>
                <el-form-item
                  v-else
                  :prop="
                    'addMaintainDetailsRequestList.' +
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
                <div
                  v-if="
                    ($route.query.id && !listState) ||
                      (!!processInstanceId &&
                        currentNode !== 0 &&
                        currentNode !== 1 &&
                        currentNode !== 2 &&
                        currentNode !== 5)
                  "
                >
                  {{ scope.row.alarmTime }}
                </div>
                <el-form-item
                  v-else
                  :prop="
                    'addMaintainDetailsRequestList.' +
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
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmNum"
              label="累计告警次数"
              show-overflow-tooltip
              align="center"
              key="day5"
            >
              <template slot-scope="scope">
                <div
                  v-if="
                    ($route.query.id && !listState) ||
                      (!!processInstanceId &&
                        currentNode !== 0 &&
                        currentNode !== 1 &&
                        currentNode !== 2 &&
                        currentNode !== 5)
                  "
                >
                  {{ scope.row.alarmNum }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'addMaintainDetailsRequestList.' +
                        scope.$index +
                        '.alarmNum'
                    "
                    :rules="rules.alarmNum"
                  >
                    <el-input
                      v-model.number="scope.row.alarmNum"
                      type="number"
                      placeholder="请输入"
                      oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
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
              v-if="
                (!($route.query.id && !listState) && !processInstanceId) ||
                  (!$route.query.id &&
                    !!processInstanceId &&
                    (currentNode === 0 ||
                      currentNode === 1 ||
                      currentNode === 2 ||
                      currentNode === 5))
              "
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
            v-if="
              (((!$route.query.id || listState) && !processInstanceId) ||
                (!!processInstanceId &&
                  (currentNode === 0 ||
                    currentNode === 1 ||
                    currentNode === 2 ||
                    currentNode === 5))) &&
                form.positionId
            "
          >
            <i class="el-icon-plus"></i> 添加行
          </div>
        </div>
      </el-form>
    </el-card>
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
        :mainStationIdList="form.stationId ? [form.stationId] : []"
        :subStationIdList="form.sonStationId ? [form.sonStationId] : []"
        :positionIdList="form.positionId ? [form.positionId] : []"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEquipment">取 消</el-button>
        <el-button type="primary" @click="equipmentAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
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
              prop="warningType"
              label="告警类型"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.warningType | filterOptions(warningTypeOptions) }}
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
                    color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C'
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
  </div>
</template>
<script>
import moment from "moment";
import { closeTagTo, closeTagBack } from "@/util/tags";
import { tree } from "@/api/organization/allStation";
import {
  queryMainStationList,
  queryMainStationDropDownList
} from "@/api/organization/allStation";
import {
  addMaintain,
  queryEquipmentList,
  queryMaintainDetailsList,
  getFiles,
  exportMaintainDetails,
  delMaintainByID,
  editMaintain,
  queryList,
  MaintainFlowAble,
  tsMaintain,
  processDetail
} from "@/api/order/repairOrder";
import Tree from "@/components/organization/tree.vue";
import mySelect from "@/components/select/select.vue";
import Position from "@/components/dialog/postionDialogs.vue";
import { userList } from "@/api/organization/staging";
import {
  querySubStationList,
  querySubStationDropDownList
} from "@/api/organization/substation";
import { queryConfigureList } from "@/api/operationManagement/alarmInformationConfiguration";
import { imgUpload } from "@/api/upload/upload";
// 流程节点
const processNode = {
  // 草稿
  draft: 0,
  // 站长确认故障
  xye_mwo_main_station_person: 1,
  // 总部人员确认
  xye_mwo_hq_helper_verify: 2,
  // 任务负责人接收、任务协助人接收
  xye_mwo_elimination_manager_receive: 3,
  // 开始消缺
  xye_mwo_elimination_manager_start: 4,
  // 消缺结束
  xye_mwo_elimination_manager_end: 5,
  // 通知总部人员
  xye_mwo_hq_helper_inform: 6,
  // 发起人确认
  xye_mwo_initiator_verify: 7,
  // 站长确认
  xye_mwo_main_station_person_verify: 8,
  // 通知发起人
  xye_mwo_initiator_inform: 9
};
export default {
  name: "newRepairOrder",
  components: { mySelect, Tree, Position },
  props: {
    processInstanceId: {
      type: String,
      default: ""
    },
    processNodeId: {
      type: String,
      default: ""
    },
    comment: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      rules: {
        stationName: [
          { required: true, message: "请选择所属组织", trigger: "change" }
        ],
        sonStationName: [
          { required: true, message: "请选择所属子期", trigger: "change" }
        ],
        equipmentName: [
          { required: true, message: "请选择设备", trigger: "change" }
        ],
        alarmStartTime: [
          { required: true, message: "请选择告警开始时间", trigger: "change" }
        ],
        powerLoss: [
          { required: true, message: "请输入损失电量", trigger: "blur" }
        ],
        influenceEquipmentNum: [
          { required: true, message: "请输入设备影响数量", trigger: "blur" }
        ],
        eliminationManagerName: [
          { required: true, message: "请选择任务负责人", trigger: "change" }
        ],
        hqHelper: [
          { required: true, message: "请选择总部协助人", trigger: "change" }
        ],
        alarmInfo: [
          { required: true, message: "请输入告警描述", trigger: "blur" }
        ],
        manageMethod: [
          { required: true, message: "请输入处理方法", trigger: "blur" }
        ],
        // alarmEndTime: [
        //   { required: true, message: "请选择告警结束时间", trigger: "blur" }
        // ],
        malfunctionType: [
          { required: true, message: "请输入故障类型", trigger: "blur" }
        ],
        cause: [{ required: true, message: "请输入原因判断", trigger: "blur" }],
        precautionaryMeasure: [
          { required: true, message: "请输入防范措施", trigger: "blur" }
        ],
        alarmType: [
          { required: true, message: "请选择告警类型", trigger: "blur" }
        ],
        alarmInfos: [
          { required: true, message: "请选择告警信息", trigger: "change" }
        ],
        alarmTime: [
          { required: true, message: "请选择最新告警时间", trigger: "blur" }
        ],
        alarmNum: [
          { required: true, message: "请输入累计告警次数", trigger: "blur" }
        ]
      },
      processInfo: {}, // 流程信息
      form: {
        stationCode: this.$store.getters.userInfo.mainStationCode, //电站简称
        stationName: this.$store.getters.userInfo.mainStationName, //电站名称
        maintainTitle: "", //标题
        stationId: this.$store.getters.userInfo.mainStationId, //所属组织
        sonStationId: "", //所属子期
        sonStationName: "", //所属子期名称
        equipmentName: "", //设备名称
        workOrderNo: "", //工单编号
        workOrderStatus: "", //工单状态
        alarmStartTime: "", //告警开始时间
        alarmEndTime: "", //告警结束时间
        eliminationManager: "", //任务负责人
        eliminationManagerName: "", // 任务负责人姓名
        workOrderTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"), //工单发起时间
        alarmType: "alarm_category_real", //告警类别
        equipmentMalfunction: 1, //设备是否故障
        initiator: this.$store.getters.userInfo.user_id, //发起人
        initiatorName: this.$store.getters.userInfo.nick_name, //发起人姓名
        majorHelper: "", //主要协助人
        majorHelperName: "", //主要协助人姓名
        generalHelper: "", //一般协助人
        generalHelperName: "", //一般协助人姓名
        hqHelp: 0, //总部协助
        hqHelperName: "", //总部协助人姓名
        hqHelper: "", //总部协助人
        positionId: "", //设备位置id
        positionCode: "", //设备位置编码
        equipmentArchivesId: "", // 设备档案id
        equipmentModel: "", //规格型号
        positionName: "", //设备位置名称
        equipmentType: "", //设备类型
        pgb: "", //支路
        pgbNo: "", //支路编码
        highAlarmLevel: "", //最高告警级别
        associatedNumber: "", //关联单号
        alarmInfo: "", //告警描述
        alarmPicture: "", //告警图片
        manageMethod: "", //处理方法
        managePicture: "", //处理图片
        malfunctionType: "", //故障类型
        alarmHour: "", //告警持续时长
        eliminationHour: "", //告警消缺时长
        isPowerLoss: 1, //有无电量损失
        powerLoss: "0", //损失电量
        influenceCapacity: "", //影响容量
        influenceEquipmentNum: "1", //设备影响数量
        isAccomplish: 0, //是否完成
        dataSources: "", //数据来源
        cause: "", //原因判断
        precautionaryMeasure: "", //防范措施
        addMaintainDetailsRequestList: [],
        fileList: [], // 告警图片
        fileListDo: [] // 处理图片
      },
      listState: false,
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
        mainStationPersonUserIds: []
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
        subStationCode: ""
      },
      treeDialogVisible: false, // 地址本弹窗
      treeData: [],
      choice: true,
      addData: "",
      treeNum: "",
      defaultProps: {
        children: "children",
        label: "title"
      },
      equipmentVisible: false, // 设备弹窗
      disabled: false, // 设备弹窗 - 组织，子期是否禁用
      pgbList: [], // 支路下拉
      dialogImageUrl: "", // 图片url
      dialogVisible: false, // 查看图片弹窗
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
        isEffective: "" //告警是否有效
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
      currentNode: processNode[this.$route.query.taskDefinitionKey]
    };
  },
  watch: {
    commonUserList(val) {
      if (val && val.length > 0) {
        val.forEach(ele => {
          ele.title = ele.userName;
        });
      }
    }
  },
  filters: {
    filterOptions: function(value, optionList) {
      let str = optionList.find(res => {
        return res.dictKey == value;
      });
      if (str) {
        return str.dictValue;
      } else {
        return value;
      }
    }
  },
  mounted() {
    console.log(this.currentNode, !!this.processInstanceId);
    userList({ userName: "", inMyMainStation: 1 }).then(res => {
      this.commonUserList = res.data.data;
    });
    if (this.$route.query.id || this.processInstanceId) this.getDetail();
    if (this.$route.query.alarmMainId) this.getAlarmDetail();
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
    // 新建、提交
    compile() {
      if (this.form.id) {
        if (this.listState) {
          this.formValidate("add");
        } else {
          this.listState = !this.listState;
        }
      } else {
        this.formValidate("new");
      }
    },
    formValidate(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.addMaintainDetailsRequestList.length === 0) {
            return this.$message.error("请添加告警信息详情");
          }
          let compare1 = this.compare(
            this.form.eliminationManager.split(","),
            this.form.majorHelper.split(",")
          );
          let compare2 = this.compare(
            this.form.eliminationManager.split(","),
            this.form.generalHelper.split(",")
          );
          let compare3 = this.compare(
            this.form.generalHelper.split(","),
            this.form.majorHelper.split(",")
          );
          if (compare1 || compare2 || compare3) {
            return this.$message.error(
              "任务负责人，主要协助人，一般协助人不能兼任!"
            );
          }
          if (this.form.pgbNo) {
            let arr = [];
            this.pgbList.forEach(ele => {
              if (this.form.pgbNo.split(",").indexOf(ele.positionCode) != -1) {
                arr.push(ele.equipmentName);
              }
            });
            this.form.pgb = arr.join(",");
          } else {
            this.form.pgb = "";
          }
          if (data == "new") {
            addMaintain(this.form).then(() => {
              this.$message.success("新建成功");
              this.$router.push({
                name: "维修工单",
                params: { refresh: true }
              });
            });
          } else {
            editMaintain(this.form).then(() => {
              this.$message.success("编辑成功");
              this.$router.push({
                name: "维修工单",
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
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        delMaintainByID({ ids: [this.form.id] }).then(() => {
          closeTagTo(this.$route.path, {
            name: "维修工单",
            params: { refresh: true }
          });
        });
      });
    },
    // 导出
    exportDetail() {
      exportMaintainDetails({ id: this.form.id })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "维修工单详情.xls"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(() => {
          this.$Notice.error({
            title: "错误",
            desc: "网络连接错误"
          });
        });
    },
    // 告警页面手动创建 - 告警信息详情
    getAlarmDetail() {
      queryList({ alarmMainId: this.$route.query.alarmMainId }).then(res => {
        this.form.stationId = res.data.data.mainStationId; // 组织id
        this.form.stationName = res.data.data.mainStationName; // 组织名称
        this.form.sonStationId = res.data.data.subStationId; // 子期id
        this.form.sonStationName = res.data.data.subStationName; // 子期名称
        this.form.alarmStartTime = res.data.data.startTime; // 告警开始时间
        this.form.alarmEndTime = res.data.data.endTime; // 告警结束时间
        this.form.equipmentType = res.data.data.equipmentType; // 设备类型
        this.form.equipmentModel = res.data.data.equipmentModel; // 规格型号
        this.form.equipmentName = res.data.data.equipmentName; // 设备名称
        this.form.positionId = res.data.data.positionId; // 设备位置id
        this.form.positionCode = res.data.data.positionCode; // 设备位置编码
        // this.form.equipmentArchivesId = res.data.data.equipmentArchivesId; // 设备档案id
        this.form.positionName = res.data.data.positionName; // 设备位置名称
        this.form.dataSources = res.data.data.dataSources; // 数据来源
        this.form.powerLoss = res.data.data.powerLoss; // 损失电量
        this.form.influenceCapacity = res.data.data.influenceCapacity; //影响容量
        res.data.data.detailResponseList.forEach(ele => {
          let obj = {};
          if (
            this.$route.query.alarmInfoDetailIds.split(",").indexOf(ele.id) !==
            -1
          ) {
            obj.alarmType = ele.warningType; //告警类型
            obj.alarmLevel = ele.warningLevel; //告警级别
            obj.alarmInfo = ele.alarmInformation; //告警信息
            obj.alarmTime = ele.newTime; //最新告警时间
            obj.alarmNum = ele.alarmCount; //告警次数
            obj.daTag = ele.daTag; //告警编码
            this.form.addMaintainDetailsRequestList.push(obj);
          }
        });
      });
    },
    // 获取计划详情信息
    getDetail() {
      queryMaintainDetailsList({
        id: this.$route.query.id,
        processInstanceId: this.processInstanceId
      }).then(item => {
        if (item.data.data && item.data.data.length > 0) {
          this.form = item.data.data[0];
          this.form.addMaintainDetailsRequestList =
            item.data.data[0].maintainDetailsResponseList;
          if (
            this.form.equipmentType === "equipment_type_lpi" ||
            this.form.equipmentType === "equipment_type_jb_dc"
          ) {
            queryEquipmentList({ parentPositionId: this.form.positionId }).then(
              res => {
                this.pgbList = res.data.data;
                this.form.pgb = this.form.pgbNo && this.form.pgbNo.split(",");
              }
            );
          }
          if (this.form.processInstanceId && !this.processInstanceId) {
            processDetail({
              processInstanceId: this.form.processInstanceId
            }).then(res => {
              this.processInfo = res.data.data;
            });
          }
        }
        getFiles({
          businessId: this.form.id,
          businessTypeList: ["maintain_alarm_order"]
        }).then(res => {
          this.$set(this.form, "fileList", res.data.data ? res.data.data : []);
          this.form.fileList.forEach(ele => {
            ele.url = this.imgUrl + ele.fileId;
          });
        });
        getFiles({
          businessId: this.form.id,
          businessTypeList: ["maintain_work_order"]
        }).then(res => {
          this.$set(
            this.form,
            "fileListDo",
            res.data.data ? res.data.data : []
          );
          this.form.fileListDo.forEach(ele => {
            ele.url = this.imgUrl + ele.fileId;
          });
        });
      });
    },

    // 添加行
    addRow() {
      let obj = {
        alarmType: "", //告警类型
        alarmLevel: "", //告警级别
        alarmInfo: "", //告警信息
        alarmTime: this.form.workOrderTime, //最新告警时间
        alarmNum: 1 //告警次数
      };
      this.form.addMaintainDetailsRequestList.push(obj);
    },
    // 删除行
    handleDel(index, row, num) {
      this.$confirm("确定要删除吗?")
        .then(() => {
          this.form.addMaintainDetailsRequestList.splice(index, 1);
        })
        .catch(() => {
          return false;
        });
    },
    // 组织列表
    async getQueryMainStationList(data) {
      await queryMainStationList(data).then(res => {
        this.$set(this.stationDialogForm, "tableData", res.data.data.pageData);
        this.$set(this.stationDialogForm, "pageNum", res.data.data.pageNum);
        this.$set(this.stationDialogForm, "pageSize", res.data.data.pageSize);
        this.$set(this.stationDialogForm, "total", res.data.data.total);
      });
    },
    // 子站列表
    async getQuerySubStationList(data) {
      await querySubStationList(data).then(res => {
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
      await queryConfigureList(data).then(res => {
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
        pageSize: this.stationDialogForm.pageSize
      }).then(() => {
        this.$set(this.stationDialogForm, "currentRowId", this.form.stationId);
        this.stationDialogForm.tableData.forEach(ele => {
          if (ele.mainStationId === this.form.stationId) {
            this.changeRadio(true, ele);
          }
        });
      });
      queryMainStationDropDownList({ keyWord: "" }).then(res => {
        this.mainStationOptions = res.data.data;
      });
    },
    getUserList(data) {
      userList(data).then(res => {
        this.commonUserList = res.data.data ? res.data.data : [];
      });
    },
    handleInput(val) {
      if (val) {
        this.getUserList({
          userName: val,
          mainStationIdList: this.stationDialogForm.mainStationIdList,
          inMyMainStation: 0
        });
      } else {
        this.getUserList({
          mainStationIdList: this.stationDialogForm.mainStationIdList,
          inMyMainStation: 1
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
      let oldId = this.form.stationId;
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
      if (oldId !== this.form.stationId) {
        this.form.sonStationId = "";
        this.form.sonStationName = "";
        this.form.equipmentName = "";
        this.form.positionCode = "";
        this.form.equipmentArchivesId = "";
        this.form.equipmentModel = "";
        this.form.positionId = "";
        this.form.equipmentType = "";
        this.form.positionName = "";
      }
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
        pageSize: this.subStationDialogForm.pageSize
      }).then(() => {
        this.subStationDialogForm.currentRowId = this.form.sonStationId;
        this.subStationDialogForm.tableData.forEach(ele => {
          if (ele.id === this.form.sonStationId) {
            this.changeRadio(true, ele);
          }
        });
      });
      querySubStationDropDownList({
        mainStationIdList: this.form.stationId.split(",")
      }).then(res => {
        this.subStationOptions = res.data.data;
      });
    },
    // 添加子期
    subStationAdd() {
      let oldId = this.form.sonStationId;
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
      if (oldId !== this.form.sonStationId) {
        this.form.equipmentName = "";
        this.form.positionCode = "";
        this.form.equipmentArchivesId = "";
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
          mainStationPersonUserIds: this.stationDialogForm
            .mainStationPersonUserIds, //组织负责人
          pageNum: this.stationDialogForm.pageNum,
          pageSize: this.stationDialogForm.pageSize
        });
      }
      if (this.dialogNum == 1) {
        this.getQuerySubStationList({
          mainStationIdList: this.form.stationId.split(","),
          subStationPersonName: this.subStationDialogForm.subStationPersonName,
          subStationCode: this.subStationDialogForm.subStationCode,
          subStationIdList: this.subStationDialogForm.subStationIdList,
          pageNum: this.subStationDialogForm.pageNum,
          pageSize: this.subStationDialogForm.pageSize
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
          pageSize: this.alarmInfoForm.pageSize
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
          mainStationPersonUserIds: []
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
          subStationCode: ""
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
          isEffective: "" //告警是否有效
        };
      }
    },
    // 修改告警开始时间
    changeStartTime(val) {
      if (val && new Date(val) < new Date(this.form.workOrderTime)) {
        this.form.alarmStartTime = "";
        return this.$message.error("告警开始时间不得早于工单发起时间");
      }
      // if (val && new Date(val) > new Date(this.form.alarmEndTime)) {
      //   this.form.alarmStartTime = "";
      //   return this.$message.error("告警开始时间不得早于告警结束时间");
      // }
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
      if (this.treeNum == 2) {
        this.$refs.treeRef2.blur();
        this.choice = false;
      }
      if (this.treeNum == 3) {
        this.$refs.treeRef3.blur();
        this.choice = true;
      }
      tree().then(res => {
        this.treeData = res.data.data;
      });
    },
    // 添加负责人
    treeAdd() {
      this.treeDialogVisible = false;
      if (this.treeNum == 0) {
        this.form.eliminationManager = this.addData.id; //任务负责人ID
        this.form.eliminationManagerName = this.addData.name; //任务负责人名称
      }
      if (this.treeNum == 1) {
        this.form.majorHelper = this.addData
          .map(v => {
            return v.id;
          })
          .join(","); //主要协助人ID
        this.form.majorHelperName = this.addData
          .map(v => {
            return v.name;
          })
          .join(","); //主要协助人姓名
      }
      if (this.treeNum == 2) {
        this.form.generalHelper = this.addData
          .map(v => {
            return v.id;
          })
          .join(","); //一般协助人ID
        this.form.generalHelperName = this.addData
          .map(v => {
            return v.name;
          })
          .join(","); //一般协助人姓名
      }
      if (this.treeNum == 3) {
        this.form.hqHelper = this.addData.id; //总部协助人ID
        this.form.hqHelperName = this.addData.name; //总部协助人名称
      }
      this.addData = [];
    },
    // 判断任务负责人，主要/一般协助人是否重复
    compare(arr1, arr2) {
      let result = false;
      arr1.forEach(ele => {
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
    },
    // 设备名称弹窗 - 添加
    equipmentAdd() {
      let oldId = this.form.positionId;
      this.equipmentVisible = false;
      this.form.equipmentName = this.$refs[
        "positionRef"
      ].chooseRedio.equipmentName;
      this.form.positionCode = this.$refs[
        "positionRef"
      ].chooseRedio.positionCode;
      this.form.equipmentArchivesId = this.$refs[
        "positionRef"
      ].chooseRedio.equipmentArchivesId;
      this.form.equipmentModel = this.$refs[
        "positionRef"
      ].chooseRedio.equipmentModel;
      this.form.positionId = this.$refs["positionRef"].chooseRedio.id;
      this.form.equipmentType = this.$refs[
        "positionRef"
      ].chooseRedio.equipmentType;
      this.form.positionName = this.$refs[
        "positionRef"
      ].chooseRedio.positionName;
      this.form.pgb = "";
      this.form.pgbNo = "";
      if (!this.form.sonStationId) {
        this.form.sonStationId = this.$refs[
          "positionRef"
        ].chooseRedio.subStationId;
        this.form.sonStationName = this.$refs[
          "positionRef"
        ].chooseRedio.subStationName;
      }
      if (
        this.form.equipmentType === "equipment_type_lpi" ||
        this.form.equipmentType === "equipment_type_jb_dc"
      ) {
        queryEquipmentList({ parentPositionId: this.form.positionId }).then(
          res => {
            this.pgbList = res.data.data;
          }
        );
      }
      if (oldId !== this.form.positionId) {
        this.form.addMaintainDetailsRequestList = [];
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
    // 上传告警图片
    handleChange(file, fileList) {
      imgUpload(file.raw).then(res => {
        let param = res.data.data;
        param.url = this.imgUrl + param.fileId;
        this.form.fileList.push(param);
      });
    },
    // 上传处理图片
    handleChangeDo(file, fileList) {
      imgUpload(file.raw).then(res => {
        let param = res.data.data;
        param.url = this.imgUrl + param.fileId;
        this.form.fileListDo.push(param);
      });
    },
    // 图片删除
    handleRemove(file, fileList) {
      this.form.fileList.forEach((ele, index) => {
        if (ele.uid === file.uid) {
          this.form.fileList.splice(index, 1);
        }
      });
    },
    // 图片删除
    handleRemoveDo(file, fileList) {
      this.form.fileListDo.forEach((ele, index) => {
        if (ele.uid === file.uid) {
          this.form.fileListDo.splice(index, 1);
        }
      });
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 添加行 - 告警类型编辑回显
    getAlarmType(alarmType) {
      let result = alarmType;
      this.warningTypeOptions.forEach(ele => {
        if (ele.dictKey === alarmType) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 选择添加行 - 告警类型
    changeAlarmType(row) {},
    // 点击告警信息列 - 弹窗
    focusAlarmInfo(row, index) {
      if (!row.alarmType) {
        return this.$message.error("请先选择告警类型");
      }
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
        pageSize: this.alarmInfoForm.pageSize
      }).then(() => {
        this.alarmInfoForm.tableData.forEach(ele => {
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
      this.warningLevelOptions.forEach(ele => {
        if (ele.dictKey === row.alarmLevel) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 添加告警信息
    alarmInfoAdd() {
      this.$set(
        this.form.addMaintainDetailsRequestList[
          this.alarmInfoForm.currentIndex
        ],
        "alarmInfo",
        this.alarmInfoForm.changedRadio.alarmInformation
      ); //告警信息
      this.$set(
        this.form.addMaintainDetailsRequestList[
          this.alarmInfoForm.currentIndex
        ],
        "alarmLevel",
        this.alarmInfoForm.changedRadio.warningLevel
      ); //告警级别
      this.$set(
        this.form.addMaintainDetailsRequestList[
          this.alarmInfoForm.currentIndex
        ],
        "daTag",
        this.alarmInfoForm.changedRadio.alarmCode
      ); //datag
      console.log(
        this.form.addMaintainDetailsRequestList[this.alarmInfoForm.currentIndex]
      );
      this.cancel();
    },
    // 流程节点
    beforeBtnClick(code) {
      console.log(code);
    },
    afterBtnClick(code) {
      if (code === "agreeBtnCode") {
        let param = {
          processInstanceId: this.processInstanceId,
          taskId: this.$route.query.taskId,
          taskDefinitionKey: this.$route.query.taskDefinitionKey,
          comment: this.comment
        };
        Object.assign(param, this.form);
        MaintainFlowAble(param).then(() => {
          this.$message.success("操作成功");
          closeTagBack(this.$route.path);
        });
      }
      if (code === "saveBtnCode") {
        tsMaintain(this.form).then(() => {
          this.$message.success("暂存成功");
          closeTagBack(this.$route.path);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.is-disabled + .el-upload--picture-card {
  cursor: not-allowed;
  background: #f5f7fa;
}
/deep/.is-disabled + .el-upload--picture-card:hover {
  border-color: #c0ccda;
}
/deep/.el-upload-list__item {
  transition: none !important;
}
.box-card {
  // height: calc(100vh - 124px);
  overflow: auto;
  margin-bottom: 26px;
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
