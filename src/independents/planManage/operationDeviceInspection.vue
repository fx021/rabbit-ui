<template>
  <div class="operation-substation">
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
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            @click="applyList"
            >设备停机列表
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            @click="apply"
            >设备停机申请
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id && form.isEffective"
            icon="el-icon-document-checked"
            @click="createTask"
            >任务生成
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id && form.isEffective"
            icon="el-icon-document-checked"
            @click="getTaskList"
            >记录查询
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="
              $route.query.id &&
                (form.planState === 'draft' || form.planState === 'audit')
            "
            :disabled="isEffectiveDisabled"
            icon="el-icon-document-checked"
            @click="changeState(1)"
            >置为有效
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="
              $route.query.id &&
                (form.planState === 'draft' || form.planState === 'audit')
            "
            :disabled="isEffectiveDisabled"
            icon="el-icon-document-delete"
            @click="changeState(0)"
            >置为无效
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
        :rules="!($route.query.id && !listState) ? rules : ''"
        label-position="right"
        size="mini"
        style="margin-top: 10px"
      >
        <table
          border
          class="table-box"
          :class="
            ($route.query.id && !listState) || !!processInstanceId
              ? 'detail-table'
              : ''
          "
          bordercolor="#d2d2d2"
        >
          <tr>
            <td>标题</td>
            <td colspan="3">
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ form.planName }}
              </div>
              <el-form-item v-else label="" prop="planName">
                <el-input
                  v-model="form.planName"
                  :disabled="$route.query.id && !listState"
                  placeholder="请输入内容"
                ></el-input>
              </el-form-item>
            </td>
            <td>计划编号</td>
            <td>
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ form.planCode }}
              </div>
              <el-form-item v-else label="" prop="planCode">
                <el-input :disabled="true" v-model="form.planCode"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>所属组织</td>
            <td>
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ form.mainStationName }}
              </div>
              <el-form-item v-else label="" prop="mainStationName">
                <div>
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    @focus="focusMainStation"
                    ref="mainStation"
                  ></el-input>
                </div>
              </el-form-item>
            </td>
            <td>计划分类</td>
            <td>
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ planTypeFormat(form.planType) }}
              </div>
              <el-form-item v-else label="" prop="planType">
                <el-select
                  v-model="form.planType"
                  :disabled="$route.query.id"
                  collapse-tags
                  @change="clearRow"
                  default-first-option
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in planTypeList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>有效年度</td>
            <td>
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ form.year }}
              </div>
              <el-form-item v-else label="" prop="year">
                <el-select
                  v-model="form.year"
                  :disabled="$route.query.id && !listState"
                  collapse-tags
                  default-first-option
                  placeholder="请选择"
                  @change="changeYear"
                >
                  <el-option
                    v-for="item in yearList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>是否有效</td>
            <td :colspan="!$route.query.id ? '5' : ''">
              <el-form-item label="" prop="isEffective">
                <el-radio-group
                  v-model="form.isEffective"
                  :disabled="
                    ($route.query.id && !listState) ||
                      isEffectiveDisabled ||
                      !!processInstanceId
                  "
                >
                  <el-radio :label="1">有效</el-radio>
                  <el-radio :label="0">无效</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
            <td v-if="$route.query.id">创建人</td>
            <td v-if="$route.query.id">
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ form.createByUserName }}
              </div>
              <el-form-item v-else label="" prop="createByUserName">
                <div>
                  <el-input
                    v-model="form.createByUserName"
                    :disabled="true"
                  ></el-input>
                </div>
              </el-form-item>
            </td>
            <td v-if="$route.query.id">创建时间</td>
            <td v-if="$route.query.id">
              <div
                v-if="($route.query.id && !listState) || !!processInstanceId"
                class="detail-item"
              >
                {{ form.createTime }}
              </div>
              <el-form-item v-else label="" prop="createTime">
                <el-input v-model="form.createTime" :disabled="true"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

        <div
          class="table"
          :class="!$route.query.id ? 'formTable' : ''"
          v-if="form.planType === 'plan_type_day'"
        >
          <el-table
            ref="multipleTable"
            :data="form.dayParamList"
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
              prop="equipmentType"
              label="设备类型"
              show-overflow-tooltip
              align="center"
              key="day1"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getEquipmentNameType(scope.row.equipmentType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'dayParamList.' + scope.$index + '.equipmentType'"
                    :rules="rules.equipmentType"
                  >
                    <el-select
                      v-model="scope.row.equipmentType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      @change="changeEquipmentType(scope.row)"
                    >
                      <el-option
                        v-for="item in equipmentTypeList"
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
              prop="checkContent"
              label="巡检内容名称"
              show-overflow-tooltip
              align="center"
              key="day2"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ scope.row.checkContentName }}
                </div>
                <el-form-item
                  v-else
                  :prop="'dayParamList.' + scope.$index + '.checkContent'"
                  :rules="rules.checkContent"
                >
                  <el-select
                    v-model="scope.row.checkContent"
                    filterable
                    default-first-option
                    placeholder="请选择"
                    value-key="id"
                    @focus="getCheckContentList(scope.row)"
                    @change="changeContent(scope.row, 1)"
                  >
                    <el-option
                      v-for="item in checkContentList"
                      :key="item.id"
                      :label="item.checkName"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="checkItemType"
              label="巡检类别"
              show-overflow-tooltip
              align="center"
              key="day3"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getCheckItemType(scope.row.checkItemType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'dayParamList.' + scope.$index + '.checkItemType'"
                    :rules="rules.checkItemType"
                  >
                    <el-select
                      v-model="scope.row.checkItemType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      @change="changeCheckItemType(scope.row, scope.$index, 1)"
                    >
                      <el-option
                        v-for="item in checkCategoryList"
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
              prop="checkItem"
              label="巡检内容"
              min-width="120px"
              align="left"
              header-align="center"
              key="day4"
            >
              <template slot-scope="scope">
                <div
                  v-html="scope.row.checkItem"
                  style="max-height: 69px;overflow-y: auto;"
                ></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="equipmentName"
              label="巡检设备"
              show-overflow-tooltip
              align="center"
              key="day5"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  <el-link
                    type="primary"
                    :disabled="!scope.row.equipmentName"
                    @click="getEquipmentDetail(scope.row.positionIdList)"
                    >设备详情</el-link
                  >
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'dayParamList.' + scope.$index + '.equipmentName'"
                    :rules="rules.equipmentName"
                  >
                    <el-input
                      v-model="scope.row.equipmentName"
                      placeholder="请选择"
                      readonly
                      @focus="getEquipmentName(scope.row, scope.$index, 1)"
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="planFrequencyId"
              label="频率"
              show-overflow-tooltip
              align="center"
              key="day6"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getFrequency(scope.row.planFrequencyId) }}
                </div>
                <el-form-item
                  v-else
                  :prop="'dayParamList.' + scope.$index + '.planFrequencyId'"
                  :rules="rules.planFrequencyId"
                >
                  <el-select
                    v-model="scope.row.planFrequencyId"
                    filterable
                    default-first-option
                    placeholder="请选择"
                    @focus="getFrequencyList(scope.row)"
                  >
                    <el-option
                      v-for="item in planFrequencyIdList"
                      :key="item.id"
                      :label="item.checkFrequencyName"
                      :value="item.id"
                    >
                      <!-- :title="item.checkFrequencyName" -->
                      <!-- :label="
                        item.size +
                          '次/' +
                          getFrequencyValue(item.frequencyCode)
                      " -->
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              key="day7"
              fixed="right"
              width="100"
              v-if="!($route.query.id && !listState) && !processInstanceId"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #f56c6c"
                  icon="el-icon-delete"
                  @click="handleDel(scope.$index, scope.row, 1)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="add-box"
            @click="addRow(1)"
            v-if="(!$route.query.id || listState) && !processInstanceId"
          >
            <i class="el-icon-plus"></i> 添加行
          </div>
        </div>
        <div
          class="table"
          :class="!$route.query.id ? 'formTable' : ''"
          v-if="form.planType === 'plan_type_year'"
        >
          <el-table
            ref="multipleTable"
            :data="form.yearParamList"
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
              prop="equipmentType"
              label="设备类型"
              show-overflow-tooltip
              align="center"
              min-width="120"
              key="year1"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getEquipmentNameType(scope.row.equipmentType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'yearParamList.' + scope.$index + '.equipmentType'"
                    :rules="rules.equipmentType"
                  >
                    <el-select
                      v-model="scope.row.equipmentType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      @change="changeEquipmentType(scope.row)"
                    >
                      <el-option
                        v-for="item in equipmentTypeList"
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
              prop="checkContent"
              label="巡检内容名称"
              show-overflow-tooltip
              min-width="120"
              align="center"
              key="year2"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ scope.row.checkContentName }}
                </div>
                <el-form-item
                  v-else
                  :prop="'yearParamList.' + scope.$index + '.checkContent'"
                  :rules="rules.checkContent"
                >
                  <el-select
                    v-model="scope.row.checkContent"
                    filterable
                    default-first-option
                    placeholder="请选择"
                    value-key="id"
                    @focus="getCheckContentList(scope.row)"
                    @change="changeContent(scope.row, 2)"
                  >
                    <el-option
                      v-for="item in checkContentList"
                      :key="item.id"
                      :label="item.checkName"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="checkItemType"
              label="巡检类别"
              show-overflow-tooltip
              align="center"
              min-width="120"
              key="year3"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getCheckItemType(scope.row.checkItemType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'yearParamList.' + scope.$index + '.checkItemType'"
                    :rules="rules.checkItemType"
                  >
                    <el-select
                      v-model="scope.row.checkItemType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      @change="changeCheckItemType(scope.row, scope.$index, 1)"
                    >
                      <el-option
                        v-for="item in checkCategoryList"
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
              prop="checkItem"
              label="巡检内容"
              min-width="150"
              align="left"
              header-align="center"
              key="year4"
            >
              <template slot-scope="scope">
                <div
                  v-html="scope.row.checkItem"
                  style="max-height: 69px;overflow-y: auto;"
                ></div>
              </template>
            </el-table-column>
            <el-table-column
              :prop="'equipmentName' + item"
              :label="item + '月'"
              show-overflow-tooltip
              align="center"
              v-for="item in 12"
              :key="'year' + item + 4"
              min-width="120"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  <el-link
                    type="primary"
                    :disabled="!scope.row['equipmentName' + item]"
                    @click="
                      getEquipmentDetail(scope.row['positionIdList' + item])
                    "
                    >设备详情</el-link
                  >
                </div>
                <div v-else>
                  <el-form-item
                    :prop="
                      'yearParamList.' + scope.$index + '.equipmentName' + item
                    "
                    :rules="rules.equipmentName"
                  >
                    <el-input
                      v-model="scope.row['equipmentName' + item]"
                      placeholder="请选择"
                      readonly
                      @focus="
                        getEquipmentName(scope.row, scope.$index, 2, item)
                      "
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              key="year17"
              width="100"
              fixed="right"
              v-if="!($route.query.id && !listState) && !processInstanceId"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #f56c6c"
                  icon="el-icon-delete"
                  @click="handleDel(scope.$index, scope.row, 2)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="add-box"
            @click="addRow(2)"
            v-if="(!$route.query.id || listState) && !processInstanceId"
          >
            <i class="el-icon-plus"></i> 添加行
          </div>
        </div>
        <div
          class="table"
          :class="!$route.query.id ? 'formTable' : ''"
          v-if="form.planType === 'plan_type_temporary'"
        >
          <el-table
            ref="multipleTable"
            :data="form.otherParamList"
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
              prop="equipmentType"
              label="设备类型"
              show-overflow-tooltip
              align="center"
              key="temporary1"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getEquipmentNameType(scope.row.equipmentType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'otherParamList.' + scope.$index + '.equipmentType'"
                    :rules="rules.equipmentType"
                  >
                    <el-select
                      v-model="scope.row.equipmentType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      @change="changeEquipmentType(scope.row)"
                    >
                      <el-option
                        v-for="item in equipmentTypeList"
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
              prop="checkContent"
              label="巡检内容名称"
              show-overflow-tooltip
              align="center"
              key="temporary2"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ scope.row.checkContentName }}
                </div>
                <el-form-item
                  v-else
                  :prop="'otherParamList.' + scope.$index + '.checkContent'"
                  :rules="rules.checkContent"
                >
                  <el-select
                    v-model="scope.row.checkContent"
                    filterable
                    default-first-option
                    placeholder="请选择"
                    value-key="id"
                    @focus="getCheckContentList(scope.row)"
                    @change="changeContent(scope.row, 3)"
                  >
                    <el-option
                      v-for="item in checkContentList"
                      :key="item.id"
                      :label="item.checkName"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="checkItemType"
              label="巡检类别"
              show-overflow-tooltip
              align="center"
              key="temporary3"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ getCheckItemType(scope.row.checkItemType) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'otherParamList.' + scope.$index + '.checkItemType'"
                    :rules="rules.checkItemType"
                  >
                    <el-select
                      v-model="scope.row.checkItemType"
                      filterable
                      default-first-option
                      placeholder="请选择"
                      @change="changeCheckItemType(scope.row, scope.$index, 3)"
                    >
                      <el-option
                        v-for="item in checkCategoryList"
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
              prop="checkItem"
              label="巡检内容"
              min-width="120px"
              align="left"
              header-align="center"
              key="temporary4"
            >
              <template slot-scope="scope">
                <div
                  v-html="scope.row.checkItem"
                  style="max-height: 69px;overflow-y: auto;"
                ></div>
              </template>
            </el-table-column>
            <el-table-column
              prop="equipmentName"
              label="巡检设备"
              show-overflow-tooltip
              align="center"
              key="temporary5"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  <el-link
                    type="primary"
                    :disabled="!scope.row.equipmentName"
                    @click="getEquipmentDetail(scope.row.positionIdList)"
                    >设备详情</el-link
                  >
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'otherParamList.' + scope.$index + '.equipmentName'"
                    :rules="rules.equipmentName"
                  >
                    <el-input
                      v-model="scope.row.equipmentName"
                      placeholder="请选择"
                      readonly
                      @focus="getEquipmentName(scope.row, scope.$index, 3)"
                    ></el-input>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="计划开始时间"
              show-overflow-tooltip
              align="center"
              key="temporary6"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ timeFormat(scope.row.startTime) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'otherParamList.' + scope.$index + '.startTime'"
                    :rules="rules.startTime"
                  >
                    <el-date-picker
                      v-model="scope.row.startTime"
                      type="datetime"
                      format="MM-dd HH"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择"
                      @change="changeTime(scope.row, scope.$index, 1)"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="计划结束时间"
              show-overflow-tooltip
              align="center"
              key="temporary7"
            >
              <template slot-scope="scope">
                <div
                  v-if="($route.query.id && !listState) || !!processInstanceId"
                >
                  {{ timeFormat(scope.row.endTime) }}
                </div>
                <div v-else>
                  <el-form-item
                    :prop="'otherParamList.' + scope.$index + '.endTime'"
                    :rules="rules.endTime"
                  >
                    <el-date-picker
                      v-model="scope.row.endTime"
                      type="datetime"
                      format="MM-dd HH"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择"
                      @change="changeTime(scope.row, scope.$index, 2)"
                    >
                    </el-date-picker>
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              key="temporary8"
              width="100"
              fixed="right"
              v-if="!($route.query.id && !listState) && !processInstanceId"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #f56c6c"
                  icon="el-icon-delete"
                  @click="handleDel(scope.$index, scope.row, 3)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="add-box"
            @click="addRow(3)"
            v-if="(!$route.query.id || listState) && !processInstanceId"
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
            ref="dialogform"
            :model="dialogform"
            :inline="true"
            style="display: flex"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="dialogform.mainStationIdList"
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
                v-model="dialogform.mainStationCode"
                placeholder="请输入"
                @keyup.enter.native="searchData"
              />
            </el-form-item>
            <el-form-item label="组织负责人：">
              <my-select
                :options="commonUserList"
                ref="selectRef"
                v-model="dialogform.mainStationPersonUserIds"
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
          <el-table :data="tableData" style="width: 100%" :max-height="530">
            <el-table-column type="index" label="" width="50" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowId"
                  :label="scope.row.mainStationId"
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
        <el-button type="primary" @click="principalAdd">添 加</el-button>
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
      title="巡检计划记录"
      :visible.sync="taskVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'8vh'"
    >
      <div class="dialog-content">
        <div class="content-btn">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="exportPlanTask"
            >导出</el-button
          >
        </div>
        <div class="content-table">
          <el-table
            :data="dialogform3.tableData"
            style="width: 100%"
            :max-height="530"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
              :index="taskIndexMethod"
            ></el-table-column>
            <el-table-column
              prop="triggerTime"
              label="触发时间"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="taskCode"
              label="巡检任务编号"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column prop="triggerType" label="触发类型" align="center">
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleTaskSizeChange"
              :total="dialogform3.total"
              :page-size="dialogform3.pageSize"
              background
              :current-page.sync="current"
              @current-change="handleTaskPageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
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
            :data="dialogform4.tableData"
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
import moment from "moment";
import {
  queryMainStationList,
  queryMainStationDropDownList
} from "@/api/organization/allStation";
import { closeTagTo, closeTagBack } from "@/util/tags";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { userList } from "@/api/organization/staging";
import mySelect from "@/components/select/select.vue";
import {
  manualCreateCheckTask,
  queryPlanTaskList,
  exportPlanTaskList,
  removePlan,
  exportCheckPlanDetail,
  queryPlanFrequencyAllList,
  queryAllCheckList,
  queryCheckItemList,
  queryCheckEquipmentList,
  queryCheckEquipmentDetailList,
  queryAreaDropDownList,
  addPlan,
  planDetail,
  changeEffective,
  editPlan,
  planReviewProcess,
  processDetail
} from "@/api/planManage/deviceInspection";
const processNode = {
  // 所属组织站长确认
  xye_check_main_station_person: 1,
  // 集控确认
  xye_check_centralized_control_confirm: 2
};
export default {
  name: "operationSubstation",
  components: { mySelect },
  props: {
    processInstanceId: {
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
      listState: false,
      isEffectiveDisabled: false,
      processInfo: {}, // 流程信息
      form: {
        planName: "",
        planType: "",
        isEffective: 1,
        year: "",
        mainStationId: this.$store.getters.userInfo.mainStationId,
        mainStationName: this.$store.getters.userInfo.mainStationName,
        mainStationCode: this.$store.getters.userInfo.mainStationCode,
        dayParamList: [],
        yearParamList: [],
        otherParamList: []
      },
      commonUserList: [], // 组织负责人下拉
      yearList: [], // 年度下拉
      planTypeList: JSON.parse(localStorage.getItem("planTypeOptions")), // 计划分类下拉
      statusEquipmentOptions: JSON.parse(
        window.localStorage.getItem("statusEquipmentOptions")
      ), // 设备状态字典
      checkCategoryList: JSON.parse(
        localStorage.getItem("checkCategoryOptions")
      ), // 巡检类别下拉
      equipmentTypeList: JSON.parse(
        localStorage.getItem("equipmentTypeOptions")
      ), // 设备类型下拉
      frequencyList: JSON.parse(localStorage.getItem("frequencyOptions")), // 基础频率字典
      checkContentList: [], // 巡检内容下拉
      planFrequencyIdList: [], // 巡检频率下拉
      subStationList: [], // 子期下拉
      areaList: [], // 方阵下拉
      rules: {
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" }
        ],
        mainStationName: [
          { required: true, message: "请选择所属组织", trigger: "change" }
        ],
        isEffective: [
          { required: true, message: "请选择是否有效", trigger: "blur" }
        ],
        subStationCode: [
          { required: true, message: "请输入计划编码", trigger: "blur" }
        ],
        planType: [
          { required: true, message: "请选择计划类别", trigger: "change" }
        ],
        year: [{ required: true, message: "请选择年度", trigger: "change" }],
        equipmentType: [
          { required: true, message: "请选择设备类型", trigger: "blur" }
        ],
        checkContent: [
          { required: true, message: "请选择巡检内容名称", trigger: "blur" }
        ],
        checkItemType: [
          { required: true, message: "请选择巡检类别", trigger: "blur" }
        ],
        planFrequencyId: [
          { required: true, message: "请选择频率", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ]
      },
      focusMainDialogVisible: false, // 所属组织弹窗
      equipmentVisible: false, // 巡检设备弹窗
      equipmentDetailVisible: false, // 巡检设备详情弹窗
      showData: [], // 设备回显数据
      taskVisible: false, // 任务列表弹窗
      currentRowId: "",
      dialogform: {
        mainStationIdList: [],
        mainStationCode: "",
        mainStationPersonUserIds: []
      },
      total: 1,
      pageNum: 1,
      pageSize: 10,
      changeRediod: {},
      mainStationOptions: [],
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
      dialogform3: {
        tableData: [], // 巡检设备列表数据
        total: 1, // 巡检设备列表数据总数
        pageNum: 1,
        pageSize: 10
      },
      dialogform4: {
        tableData: [] // 巡检设备列表数据
      },
      currentNode: processNode[this.$route.query.taskDefinitionKey]
    };
  },
  computed: {
    planCode() {
      let { year, mainStationCode } = this.form;
      return { year, mainStationCode };
    }
  },
  watch: {
    "form.year"(val) {
      let now = new Date().getFullYear();
      if (!this.$route.query.id) {
        if (val != now) {
          this.form.isEffective = 0;
          this.isEffectiveDisabled = true;
        } else {
          this.form.isEffective = 1;
          this.isEffectiveDisabled = false;
        }
      }
    },
    planCode(val) {
      if (val.year && val.mainStationCode) {
        let plancode = this.form.planCode ? this.form.planCode.split("-") : [];
        if (plancode.length === 5) {
          plancode[1] = val.mainStationCode;
          plancode[3] = val.year;
          this.form.planCode = plancode.join("-");
        }
      }
    }
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
  mounted() {
    this.getYearList();
    userList({ userName: "", inMyMainStation: 1 }).then(res => {
      this.commonUserList = res.data.data;
    });
    if (this.$route.query.id || this.processInstanceId) this.getPlanDetail();
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
    // 获取当前年,生成年度下拉
    getYearList() {
      let now = new Date().getFullYear();
      for (let i = now - 10; i < now + 11; i++) {
        this.yearList.push(i);
      }
      if (!this.$route.query.id) {
        this.form.year = now;
      }
    },
    // 改变年度下拉
    changeYear(val) {
      let now = new Date().getFullYear();
      if (now > val) {
        this.$message.error("计划年度不能小于当前年度");
        this.form.year = now;
      }
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
          mainStationIdList: this.dialogform.mainStationIdList,
          inMyMainStation: 0
        });
      } else {
        this.getUserList({
          mainStationIdList: this.dialogform.mainStationIdList,
          inMyMainStation: 1
        });
      }
    },
    // 新建、提交
    compile() {
      if (this.$route.query.id) {
        if (this.listState) {
          this.formValidate("add");
        } else {
          this.form.planName = this.form.planName.replace(
            this.form.year + this.form.mainStationName,
            ""
          );
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
            addPlan(this.form).then(() => {
              this.$message.success("新建成功");
              this.$router.push({
                name: "设备巡检计划",
                params: { refresh: true }
              });
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
    //地址本选择
    focusMainStation() {
      this.focusMainDialogVisible = true;
      this.$refs.mainStation.blur();
      this.getQueryMainStationList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(() => {
        this.currentRowId = this.form.mainStationId;
        this.tableData.forEach(ele => {
          if (ele.mainStationId === this.form.mainStationId) {
            this.changeRedio(true, ele);
          }
        });
      });
      queryMainStationDropDownList({ keyWord: "" }).then(res => {
        this.mainStationOptions = res.data.data;
      });
    },
    async getQueryMainStationList(data) {
      await queryMainStationList(data).then(res => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 巡检内容下拉
    async getQueryAllCheckList(data) {
      await queryAllCheckList(data).then(res => {
        this.checkContentList = res.data.data;
      });
    },
    // 巡检频率下拉
    async getQueryPlanFrequencyAllList(data) {
      await queryPlanFrequencyAllList(data).then(res => {
        this.planFrequencyIdList = res.data.data;
      });
    },
    // 巡检设备列表
    async getQueryCheckEquipmentList(data) {
      await queryCheckEquipmentList(data)
        .then(res => {
          this.dialogform2.tableData = res.data.data.pageData;
          this.dialogform2.pageNum = res.data.data.pageNum;
          this.dialogform2.pageSize = res.data.data.pageSize;
          this.dialogform2.total = res.data.data.total;
        })
        .then(res => {
          if (
            this.dialogform2.currentRowId &&
            this.dialogform2.currentRowId.length > 0
          ) {
            this.dialogform2.tableData.forEach(ele => {
              this.dialogform2.currentRowId.forEach(item => {
                if (ele.positionId === item) {
                  this.$refs.equipmentRef.toggleRowSelection(ele, true);
                }
              });
            });
          }
        });
    },
    // 巡检设备详情列表
    async getQueryCheckEquipmentDetailList(data) {
      await queryCheckEquipmentDetailList(data).then(res => {
        this.dialogform4.tableData = res.data.data;
      });
    },
    // 方阵下拉列表
    async getQueryAreaDropDownList(data) {
      await queryAreaDropDownList(data).then(res => {
        this.areaList = res.data.data;
      });
    },
    // 手动生成任务
    async createManualCreateCheckTask(data) {
      await manualCreateCheckTask(data).then(res => {
        this.$message.success("任务生成成功");
      });
    },
    // 查询计划生成的任务
    async getQueryPlanTaskList(data) {
      await queryPlanTaskList(data).then(res => {
        this.dialogform3.tableData = res.data.data.pageData;
        this.dialogform3.pageNum = res.data.data.pageNum;
        this.dialogform3.pageSize = res.data.data.pageSize;
        this.dialogform3.total = res.data.data.total;
      });
    },
    // 获取计划详情信息
    getPlanDetail() {
      planDetail({
        planMainId: this.$route.query.id,
        processInstanceId: this.processInstanceId
      }).then(item => {
        this.form = item.data.data;
        this.$set(this.form, "planMainId", this.$route.query.id);
        if (this.form.planType === "plan_type_day") {
          this.form.dayParamList = this.form.planDetailList;
          this.$nextTick(() => {
            this.getQueryPlanFrequencyAllList({});
            this.converDetail(1);
          });
        } else if (this.form.planType === "plan_type_year") {
          this.form.yearParamList = this.form.planDetailList;
          this.converDetail(2);
        } else {
          this.form.otherParamList = this.form.planDetailList;
          this.converDetail(3);
        }
        if (this.form.processInstanceId && !this.processInstanceId) {
          processDetail({
            processInstanceId: this.form.processInstanceId
          }).then(res => {
            this.processInfo = res.data.data;
          });
        }
      });
    },
    // 处理详情信息
    converDetail(num) {
      this.getQueryAllCheckList({
        mainStationIdList: this.form.mainStationId.split(",")
      }).then(() => {
        if (num === 1) {
          this.form.dayParamList.forEach(ele => {
            this.checkContentList.forEach(item => {
              if (ele.equipmentCheckId === item.id) {
                this.$set(ele, "checkContent", item);
                this.$set(ele, "checkContentId", ele.checkContent.id);
                this.$set(
                  ele,
                  "checkContentSubStationId",
                  ele.checkContent.subStationId
                );
                this.$set(ele, "checkContentName", ele.checkContent.checkName);
              }
            });
            this.$set(ele, "planFrequencyId", ele.checkFrequencyId);
            this.$set(
              ele,
              "checkItem",
              this.convertCheckContent(ele.checkPlanItemList)
            );
            this.$set(
              ele,
              "checkItemIds",
              ele.checkPlanItemList
                ? ele.checkPlanItemList.map(v => v.checkItemId)
                : []
            );
            this.$set(
              ele,
              "positionIdList",
              ele.positionList ? ele.positionList.map(v => v.positionId) : []
            );
            this.$set(
              ele,
              "equipmentName",
              ele.positionList
                ? ele.positionList.map(v => v.positionName).join(",")
                : ""
            );
          });
        } else if (num === 2) {
          this.form.yearParamList.forEach(ele => {
            this.checkContentList.forEach(item => {
              if (ele.equipmentCheckId === item.id) {
                this.$set(ele, "checkContent", item);
                this.$set(ele, "checkContentId", ele.checkContent.id);
                this.$set(
                  ele,
                  "checkContentSubStationId",
                  ele.checkContent.subStationId
                );
                this.$set(ele, "checkContentName", ele.checkContent.checkName);
              }
            });
            this.$set(
              ele,
              "checkItem",
              this.convertCheckContent(ele.checkPlanItemList)
            );
            this.$set(
              ele,
              "checkItemIds",
              ele.checkPlanItemList
                ? ele.checkPlanItemList.map(v => v.checkItemId)
                : []
            );
            for (let i = 1; i < 13; i++) {
              this.$set(
                ele,
                "positionIdList" + i,
                ele.monthPositionList["positionList" + i].map(v => v.positionId)
              );
              this.$set(
                ele,
                "equipmentName" + i,
                ele.monthPositionList["positionList" + i]
                  .map(v => v.positionName)
                  .join(",")
              );
            }
          });
        } else {
          this.form.otherParamList.forEach(ele => {
            this.checkContentList.forEach(item => {
              if (ele.equipmentCheckId === item.id) {
                this.$set(ele, "checkContent", item);
                this.$set(ele, "checkContentId", ele.checkContent.id);
                this.$set(
                  ele,
                  "checkContentSubStationId",
                  ele.checkContent.subStationId
                );
                this.$set(ele, "checkContentName", ele.checkContent.checkName);
              }
            });
            this.$set(
              ele,
              "checkItem",
              this.convertCheckContent(ele.checkPlanItemList)
            );
            this.$set(
              ele,
              "checkItemIds",
              ele.checkPlanItemList
                ? ele.checkPlanItemList.map(v => v.checkItemId)
                : []
            );
            this.$set(
              ele,
              "positionIdList",
              ele.positionList ? ele.positionList.map(v => v.positionId) : []
            );
            this.$set(
              ele,
              "equipmentName",
              ele.positionList
                ? ele.positionList.map(v => v.positionName).join(",")
                : ""
            );
          });
        }
      });
    },
    // 详情-计划分类转化
    planTypeFormat(val) {
      let result = val;
      this.planTypeList.forEach(ele => {
        if (ele.dictKey === val) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 停机申请列表
    applyList() {
      // 巡检设备停机申请列表
      this.$router.push({
        name: "巡检设备停机申请列表",
        params: { planCode: this.form.planCode }
      });
    },
    // 停机申请
    apply() {
      this.$router.push({
        path: "./newApply",
        query: { planId: this.form.planId }
      });
    },
    // 任务生成
    createTask() {
      this.createManualCreateCheckTask({ planMainId: this.$route.query.id });
    },
    // 记录查询
    getTaskList() {
      this.taskVisible = true;
      this.getQueryPlanTaskList({
        planMainId: this.$route.query.id,
        pageNum: 1,
        pageSize: 10
      });
    },
    // 记录查询-导出
    exportPlanTask() {
      exportPlanTaskList({
        planMainId: this.$route.query.id
      })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "任务列表.xls"; //下载的文件名
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
    // 翻页事件
    handleTaskPageChange(pageNum) {
      this.dialogform3.pageNum = pageNum;
      this.getQueryPlanTaskList({
        planMainId: this.$route.query.id,
        pageNum: this.dialogform3.pageNum,
        pageSize: this.dialogform3.pageSize
      });
    },
    // 每页条数
    handleTaskSizeChange(val) {
      this.dialogform3.pageSize = val;
      this.getQueryPlanTaskList({
        planMainId: this.$route.query.id,
        pageNum: this.dialogform3.pageNum,
        pageSize: this.dialogform3.pageSize
      });
    },
    // 导出详情
    exportDetail() {
      exportCheckPlanDetail({
        planMainId: this.$route.query.id
      })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "计划详情.xls"; //下载的文件名
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
    // 修改状态
    changeState(isEffective) {
      changeEffective({
        planIdList: [this.$route.query.id],
        isEffective
      }).then(() => {
        this.getPlanDetail();
      });
    },
    // 删除子期
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        removePlan({ planIdList: [this.$route.query.id] }).then(() => {
          closeTagTo(this.$route.path, {
            name: "设备巡检计划",
            params: { refresh: true }
          });
        });
      });
    },
    // 添加组织
    principalAdd() {
      this.cancel();
      this.$set(this.form, "mainStationId", this.changeRediod.mainStationId); //所属组织id
      this.$set(
        this.form,
        "mainStationName",
        this.changeRediod.mainStationName
      ); //所属组织名称
      this.$set(
        this.form,
        "mainStationCode",
        this.changeRediod.mainStationCode
      ); //所属组织编码
      this.changeRediod = {};
      this.clearRow();
    },
    cancel() {
      this.focusMainDialogVisible = false;
      this.dialogform = {};
      this.$refs.selectRef.value = [];
      this.$refs.selectRef.searchText = "";
      this.handleInput();
    },
    // 清空添加行
    clearRow() {
      this.form.dayParamList = [];
      this.form.yearParamList = [];
      this.form.otherParamList = [];
    },
    // 添加行
    addRow(num) {
      let obj = {};
      if (num === 1) {
        obj = {
          equipmentType: "",
          checkItemType: "",
          checkContent: "",
          planFrequencyId: ""
        };
        this.form.dayParamList.push(obj);
      } else if (num === 2) {
        obj = {
          equipmentType: "",
          checkItemType: "",
          checkContent: ""
        };
        this.form.yearParamList.push(obj);
      } else {
        obj = {
          equipmentType: "",
          checkItemType: "",
          checkContent: "",
          startTime: "",
          endtime: ""
        };
        this.form.otherParamList.push(obj);
      }
    },
    // 删除行
    handleDel(index, row, num) {
      this.$confirm("确定要删除吗?")
        .then(() => {
          if (num === 1) {
            this.form.dayParamList.splice(index, 1);
          } else if (num === 2) {
            this.form.yearParamList.splice(index, 1);
          } else {
            this.form.otherParamList.splice(index, 1);
          }
        })
        .catch(() => {
          return false;
        });
    },
    // 设备类型下拉改变
    changeEquipmentType(row) {
      this.$set(row, "checkContent", "");
    },
    // 详情
    getEquipmentNameType(code) {
      let result = code;
      this.equipmentTypeList.forEach(ele => {
        if (code === ele.dictKey) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    getCheckItemType(code) {
      let result = code;
      this.checkCategoryList.forEach(ele => {
        if (code === ele.dictKey) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    getFrequency(id) {
      let result = id;
      this.planFrequencyIdList.forEach(ele => {
        if (id === ele.id) {
          // result = ele.size + "次/" + this.getFrequencyValue(ele.frequencyCode);
          result = ele.checkFrequencyName;
        }
      });
      return result;
    },
    timeFormat(time) {
      let result = time;
      if (time) {
        result = moment(time).format("MM-DD HH");
      }
      return result;
    },
    // 巡检内容下拉聚焦
    getCheckContentList(row) {
      if (!row.equipmentType) {
        return this.$message.error("请先选择设备类型");
      }
      if (!this.form.mainStationId) {
        return this.$message.error("请先选择所属组织");
      }
      this.getQueryAllCheckList({
        mainStationIdList: this.form.mainStationId.split(","),
        equipmentTypes: row.equipmentType.split(",")
      });
    },
    // 巡检内容下拉改变
    changeContent(row, num) {
      this.$set(row, "checkContentId", row.checkContent.id);
      this.$set(row, "checkContentSubStationId", row.checkContent.subStationId);
      this.$set(row, "checkContentName", row.checkContent.checkName);
      if (num === 2) {
        for (let i = 1; i < 13; i++) {
          this.$set(row, "positionIdList" + i, []);
          this.$set(row, "equipmentName" + i, "");
        }
      } else {
        this.$set(row, "positionIdList", []);
        this.$set(row, "equipmentName", "");
      }
      this.changeCheckItemType(row);
    },
    // 巡检类别下拉改变
    changeCheckItemType(row) {
      if (row.checkItemType && row.checkContent) {
        // 巡检内容项列表
        queryCheckItemList({
          checkIds: row.checkContentId.split(","),
          checkItemTypes: row.checkItemType.split(",")
        }).then(res => {
          this.$set(row, "checkItem", this.convertCheckContent(res.data.data));
          this.$set(
            row,
            "checkItemIds",
            res.data.data.map(v => v.id)
          );
        });
      }
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
    // 频率下拉
    getFrequencyList(row) {
      if (!this.form.mainStationId) {
        return this.$message.error("请先选择所属组织");
      }
      this.getQueryPlanFrequencyAllList({});
    },
    getFrequencyValue(code) {
      let result = code;
      this.frequencyList.forEach(ele => {
        if (code === ele.dictKey) {
          result = ele.dictValue;
        }
      });
      return result;
    },
    // 点击巡检设备详情
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
    // 点击新增行的巡检设备列
    getEquipmentName(row, index, num, propIndex) {
      if (!this.form.mainStationId) {
        return this.$message.error("请先选择所属组织");
      }
      if (!row.checkContent) {
        return this.$message.error("请先选择巡检内容");
      }
      this.equipmentVisible = true;
      this.dialogform2.currentRow = row;
      this.dialogform2.currentIndex = index;
      this.dialogform2.currentNum = num;
      this.dialogform2.currentPropIndex = propIndex;
      if (num === 1 || num === 3) {
        this.dialogform2.currentRowId = row.positionIdList
          ? row.positionIdList
          : [];
      } else {
        this.dialogform2.currentRowId = row["positionIdList" + propIndex]
          ? row["positionIdList" + propIndex]
          : [];
      }
      this.getQueryCheckEquipmentList({
        mainStationIdList: this.form.mainStationId.split(","),
        checkIdList: row.checkContentId.split(","),
        pageNum: this.dialogform2.pageNum,
        pageSize: this.dialogform2.pageSize
      });
      if (this.dialogform2.currentRowId.length > 0) {
        queryCheckEquipmentDetailList({
          positionIdList: this.dialogform2.currentRowId
        }).then(res => {
          this.showData = res.data.data;
        });
      }
      querySubStationDropDownList({
        mainStationIdList: this.form.mainStationId.split(",")
      }).then(res => {
        this.subStationList = res.data.data;
      });
    },
    // 表格单选
    changeRedio(event, row) {
      this.changeRediod = row;
    },
    jump() {
      this.$router.push({
        path: "./allDetails",
        query: { id: this.form.mainStationId }
      });
    },
    // 查询
    searchData() {
      this.getQueryMainStationList({
        mainStationIdList: this.dialogform.mainStationIdList, //主站id list
        mainStationCode: this.dialogform.mainStationCode, //组织编码
        mainStationPersonUserIds: this.dialogform.mainStationPersonUserIds, //组织负责人
        pageNum: this.pageNum,
        pageSize: this.pageSize
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
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 查询
    searchEquipment() {
      this.getQueryCheckEquipmentList({
        mainStationIdList: this.form.mainStationId.split(","),
        checkIdList: this.dialogform2.currentRow.checkContentId.split(","),
        subStationIdList: this.dialogform2.subStationIdList,
        areaIdList: this.dialogform2.areaIdList,
        positionName: this.dialogform2.positionName,
        pageNum: this.dialogform2.pageNum,
        pageSize: this.dialogform2.pageSize
      });
    },
    visibleEquipChange(val) {
      if (!val) {
        this.searchEquipment();
      }
    },
    changeSubStation(val) {
      this.dialogform2.areaIdList = [];
      this.getQueryAreaDropDownList({
        mainStationIds: this.form.mainStationId.split(","),
        subStationIds: val
      });
    },
    // 翻页事件
    handleEquipmentPageChange(pageNum) {
      this.dialogform2.pageNum = pageNum;
      this.searchEquipment();
    },
    // 每页条数
    handleEquipmentSizeChange(val) {
      this.dialogform2.pageSize = val;
      this.searchEquipment();
    },
    // 序号列
    EquipmentIndexMethod(index) {
      return (
        index + 1 + (this.dialogform2.pageNum - 1) * this.dialogform2.pageSize
      );
    },
    taskIndexMethod(index) {
      return (
        index + 1 + (this.dialogform3.pageNum - 1) * this.dialogform3.pageSize
      );
    },
    cancelEquipment() {
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
    // 添加巡检设备
    checkEquipmentAdd() {
      console.log(this.dialogform2.currentRowId);
      let data = this.dialogform2.selectRow.concat(this.showData);
      console.log(this.dialogform2.selectRow, this.showData, data);
      if (this.dialogform2.currentNum === 1) {
        this.$set(
          this.form.dayParamList[this.dialogform2.currentIndex],
          "positionIdList",
          data.map(v => v.positionId)
        );
        this.$set(
          this.form.dayParamList[this.dialogform2.currentIndex],
          "equipmentName",
          data.map(v => v.positionName).join(",")
        );
      } else if (this.dialogform2.currentNum === 2) {
        this.$set(
          this.form.yearParamList[this.dialogform2.currentIndex],
          "positionIdList" + this.dialogform2.currentPropIndex,
          data.map(v => v.positionId)
        );
        this.$set(
          this.form.yearParamList[this.dialogform2.currentIndex],
          "equipmentName" + this.dialogform2.currentPropIndex,
          data.map(v => v.positionName).join(",")
        );
      } else {
        this.$set(
          this.form.otherParamList[this.dialogform2.currentIndex],
          "positionIdList",
          data.map(v => v.positionId)
        );
        this.$set(
          this.form.otherParamList[this.dialogform2.currentIndex],
          "equipmentName",
          data.map(v => v.positionName).join(",")
        );
      }
      this.cancelEquipment();
    },
    handleSelectionChange(val) {
      this.dialogform2.selectRow = val;
      if (this.showData.length > 0) {
        this.dialogform2.selectRow.forEach(ele => {
          this.showData.forEach((item, index) => {
            if (ele.positionId === item.positionId) {
              this.showData.splice(index, 1);
            }
          });
        });
      }
    },
    changeTime(row, index, num) {
      if (num === 1) {
        let time = new Date(row.startTime);
        if (time < new Date()) {
          this.$message.error("开始时间不能小于当前时间");
          row.startTime = "";
        }
      } else {
        let starttime = new Date(row.startTime);
        let endtime = new Date(row.endTime);
        if (endtime < new Date()) {
          this.$message.error("结束时间不能小于当前时间");
          return (row.endTime = "");
        }
        if (starttime > endtime) {
          this.$message.error("结束时间不能小于开始时间");
          row.endTime = "";
        }
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
        planReviewProcess(param).then(() => {
          this.$message.success("操作成功");
          closeTagBack(this.$route.path);
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
.table-box {
  width: 100%;
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
.detail-table {
  td {
    padding: 10px 0;
  }
  .detail-item {
    min-width: 212px;
  }
}

.focus-main-dialogs {
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
.operation-substation {
  .box-card {
    min-height: calc(100vh - 124px);
    margin-bottom: 26px;
    /deep/.el-card__body {
      height: 100%;
      .table {
        height: calc(100% - 260px);
        border: 1px solid #d2d2d2;
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
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid #b3d8ff;
    .right {
      display: flex;
      justify-content: flex-end;
    }
  }
  .slide-fade-enter-active {
    transition: all 0.2s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(5px);
    opacity: 0;
  }
}
</style>
