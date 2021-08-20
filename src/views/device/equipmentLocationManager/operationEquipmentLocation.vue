<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            v-if="!($route.query.id && !listState)"
            icon="el-icon-upload2"
            @click="focusMainStation(1)"
            >设备变更
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-upload2"
            @click="mapLocation"
            >位置维护
          </el-button>
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
          <div class="sublevel">
            <div class="content">
              <div class="title-text">设备位置信息</div>
              <div class="basice-box">
                <el-form-item label="所属组织" prop="mainStationName">
                  <el-input
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                    @focus="focusMainStation(3)"
                    ref="mainStation3"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备位置名称" prop="positionName">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.positionName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备位置编码" prop="positionCode">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.positionCode"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="主副设备" prop="chiefDeputy">
                  <el-radio-group
                    v-model="form.chiefDeputy"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-radio :label="1">主设备</el-radio>
                    <el-radio :label="0">副设备</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="方阵" prop="areaName">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.areaName"
                    @focus="focusMainStation(2)"
                    ref="mainStation2"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="装机容量(MW)" prop="installCapacity">
                  <el-input
                    v-model="form.installCapacity"
                    disabled
                    placeholder="请输入内容"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <el-form-item label="位置状态" prop="positionState">
                  <el-select
                    v-model="form.positionState"
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
                <el-form-item label="装机面积(m²)" prop="installArea">
                  <el-input
                    v-model="form.installArea"
                    disabled
                    placeholder="请输入内容"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <!-- //!无 -->
                <el-form-item label="标杆模板" prop="benchmarking">
                  <el-select
                    v-model="form.benchmarking"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in standardTemplateOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- //!无 -->
                <el-form-item label="对标模板" prop="compareBenchmarking">
                  <el-select
                    v-model="form.compareBenchmarking"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in standardTemplateOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="父设备位置编码" prop="parentPositionId">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.parentPositionId"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="跟踪父设备位置编码" prop="trackPositionId">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.trackPositionId"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="清洗父设备位置编码" prop="cleanPositionId">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.cleanPositionId"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                  <div class="location">
                    <el-input
                      v-model="form.longitude"
                      :disabled="$route.query.id && !listState"
                      placeholder="请输入内容"
                      oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    ></el-input>
                    <i
                      class="el-icon-location-outline"
                      @click="mapLocation"
                    ></i>
                  </div>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                  <div class="location">
                    <el-input
                      v-model="form.latitude"
                      :disabled="$route.query.id && !listState"
                      placeholder="请输入内容"
                      oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    ></el-input>
                    <i
                      class="el-icon-location-outline"
                      @click="mapLocation"
                    ></i>
                  </div>
                </el-form-item>
                <el-form-item label="有效范围（m）" prop="effectiveRange">
                  <el-input
                    v-model="form.effectiveRange"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否接入" prop="bigDataAccess">
                  <el-radio-group v-model="form.bigDataAccess" disabled>
                    <el-radio :label="1">接入</el-radio>
                    <el-radio :label="0">不接入</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="二维码"
                  prop="imgList"
                  class="generate-content"
                >
                  <template v-if="form.qrcode">
                    <div class="img-list">
                      <img
                        :src="imgUrl + form.qrcode"
                        alt=""
                        width="150"
                        height="150"
                      />
                      <div class="mask-lyer">
                        <i
                          class="el-icon-download download-sty"
                          @click="qrCodeDownload('img-list', 0)"
                        ></i>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <el-button
                      type="primary"
                      size="small"
                      plain
                      icon="el-icon-plus"
                      @click="generateQRCode"
                      >生成二维码
                    </el-button>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">其他信息</div>
              <div class="basice-box">
                <el-form-item label="安装方式" prop="installMode">
                  <el-select
                    v-model="form.installMode"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in modelInstallOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="安装角度" prop="installAngle">
                  <el-select
                    v-model="form.installAngle"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAngleDictOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="角度变化" prop="angleChange">
                  <el-select
                    v-model="form.angleChange"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAngleChangeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="修改人"
                  prop="updateByUserName"
                  :disabled="$route.query.id && !listState"
                >
                  <el-input v-model="form.updateByUserName" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="修改时间"
                  prop="updateTime"
                  :disabled="$route.query.id && !listState"
                >
                  <el-input v-model="form.updateTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    placeholder="请输入内容"
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="width: 99%">
                  <el-input
                    style="margin-left: 0px; width: 100%"
                    :disabled="$route.query.id && !listState"
                    v-model="form.remark"
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="basics">
            <div class="content">
              <div class="title">设备档案信息</div>
              <div class="basice-box">
                <el-form-item label="设备绑定">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.equipmentName"
                    placeholder="请输入内容"
                    @focus="focusMainStation(1)"
                    ref="mainStation1"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属子期" prop="subStationName">
                  <el-input
                    v-model="form.subStationName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                    @focus="focusMainStation(4)"
                    ref="mainStation4"
                  ></el-input>
                </el-form-item>
                <el-form-item label="产品编号" prop="equipmentCode">
                  <el-input
                    disabled
                    v-model="form.equipmentCode"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备简称" prop="equipmentSimple">
                  <el-select
                    v-model="form.equipmentSimple"
                    allow-create
                    disabled
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
                    disabled
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
                <el-form-item
                  label="设备类型(大数据)"
                  prop="equipmentTypeBigdata"
                >
                  <el-select
                    v-model="form.equipmentTypeBigdata"
                    disabled
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equipmentTypeBigDataOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备品牌" prop="manufactor">
                  <el-input
                    disabled
                    v-model="form.manufactor"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="规格型号" prop="equipmentModel">
                  <el-input
                    disabled
                    v-model="form.equipmentModel"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="质保日期" prop="warrantyTime">
                  <el-date-picker
                    v-model="form.warrantyTime"
                    disabled
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="售后联系人" prop="contactsName">
                  <el-input
                    disabled
                    v-model="form.contactsName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="售后电话" prop="contactsPhone">
                  <el-input
                    disabled
                    v-model="form.contactsPhone"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel" style="margin-bottom: 20px">
            <div class="content">
              <div class="title-text">组件配置</div>
              <div class="basice-box" style="margin-bottom: 20px">
                <el-table
                  ref="multipleTable"
                  :data="form.componentListData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                    :index="indexMethod"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="manufactor"
                    label="组件厂家"
                    show-overflow-tooltip
                    width="100"
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.manufactor
                          | filterOptions(panelFactoryOptions)
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="componentModel"
                    label="组件型号"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.componentModel"
                        placeholder="请输入内容"
                        :disabled="$route.query.id && !listState"
                        @focus="focusMainStation(0, scope.$index)"
                        ref="mainStation0"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="power"
                    label="功率"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="componentType"
                    label="组件分类"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.componentType
                          | filterOptions(componentTypeOptions)
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="componentMaterials"
                    label="组件材料"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.componentMaterials
                          | filterOptions(componentMaterialsOptions)
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="size"
                    label="数量"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.size"
                        placeholder="请输入内容"
                        :disabled="$route.query.id && !listState"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        @input="sizeInput"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="area"
                    label="组件面积（m²）"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.length * scope.row.width * scope.row.size
                          ? scope.row.length * scope.row.width * scope.row.size
                          : "0"
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="power"
                    label="组件容量（kW）"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.power * scope.row.size
                          ? scope.row.power * scope.row.size
                          : "0"
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" v-if="!compileShow">
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
          <div
            class="sublevel"
            style="margin-bottom: 20px"
            v-if="$route.query.id"
          >
            <div class="content">
              <div class="title-text">变更历史</div>
              <div class="basice-box" style="margin-bottom: 20px">
                <el-table
                  ref="multipleTable"
                  :data="changeHistory"
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
                    <!-- :index="indexMethod" -->
                  </el-table-column>
                  <el-table-column
                    prop="equipmentCode"
                    label="产品编号"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="equipmentState"
                    label="当前设备状态"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="启用时间"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="停用时间"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="updateByUserName"
                    label="变更人"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column>
                  <!-- <el-table-column
                    prop="size"
                    label="使用期间故障数量"
                    show-overflow-tooltip
                    align="center"
                  >
                  </el-table-column> -->
                </el-table>
                <!-- <div class="add-box" @click="addRow" v-show="!compileShow">
                  <i class="el-icon-plus"></i> 添加行
                </div> -->
              </div>
            </div>
          </div>
        </el-form>
        <div v-if="$route.query.id">
          <RoutingInspection :archivesId="$route.query.id" sign="place" />
          <MaintenanceRecord :archivesId="$route.query.id" sign="place" />
        </div>
      </div>
    </el-card>
    <el-dialog
      title="选择组件配置"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1600px"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="组件厂家：">
              <el-select
                v-model="dialogform.manufactor"
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
                  v-for="item in panelFactoryOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="功率(w)：">
              <el-input
                style="width: 217px"
                v-model="dialogform.power"
                @keyup.enter.native="searchData"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="组件分类：">
              <el-select
                v-model="dialogform.componentTypeList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                @visible-change="visibleChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in componentTypeOptions"
                  :key="item.id"
                  :label="item.dictValue"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="组件材料：">
              <el-select
                v-model="dialogform.componentMaterialsList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                @visible-change="visibleChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in componentMaterialsOptions"
                  :key="item.id"
                  :label="item.dictValue"
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
              align="center"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column label="组件厂家" prop="manufactor" align="center">
              <template slot-scope="scope">
                {{ scope.row.manufactor | filterOptions(panelFactoryOptions) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="power"
              label="功率"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="componentType"
              label="组件分类"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.componentType | filterOptions(componentTypeOptions)
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="componentMaterials"
              label="组件材料"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.componentMaterials
                    | filterOptions(componentMaterialsOptions)
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
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择设备名称"
      :visible.sync="focusMainDialogVisible1"
      append-to-body
      class="focus-main-dialog"
      width="1500px"
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
                v-model="dialogform.equipmentName"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品编号">
              <el-input
                v-model="dialogform.equipmentCode"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
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
              align="center"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentName"
              label="设备名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentCode"
              label="产品编号"
              show-overflow-tooltip
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
              prop="subStationName"
              label="所属子期"
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
        <el-button @click="focusMainDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择方阵"
      :visible.sync="focusMainDialogVisible2"
      append-to-body
      class="focus-main-dialog"
      width="1000px"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="方阵名称：">
              <el-input
                v-model="dialogform.areaName"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="方阵编码">
              <el-input
                v-model="dialogform.areaCode"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
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
              align="center"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="方阵名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="areaCode"
              label="方阵编码"
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
        <el-button @click="focusMainDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择所属子期"
      :visible.sync="focusMainDialogVisible4"
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
        <el-button @click="focusMainDialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible3"
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
        <el-button @click="focusMainDialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 选点 -->
    <el-dialog
      title="选点"
      :visible.sync="mapDialogVisible"
      v-if="mapDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Map
          id="setpoint"
          height="60vh"
          :latlng="latlng"
          :setpoint="true"
          ref="map"
        ></Map>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { archivesQueryList } from "@/api/device/equipmentArchives";
import Map from "@/components/map/map";
import { queryList } from "@/api/device/matrix";
import {
  positionAdd,
  positionRemove,
  positionEdit,
  positionDetail,
  exportDetail,
  positionHistory,
  generateCode,
} from "@/api/device/equipmentLocation";
import { queryComponentTemplateList } from "@/api/device/componentInformation";
import {
  queryMainStationList,
  queryMainStationDropDownList,
} from "@/api/organization/allStation";
import {
  querySubStationList,
  querySubStationDropDownList,
} from "@/api/organization/substation";
import { qrCodeDownload } from "@/util/util.js";
import RoutingInspection from "@/components/table/routingInspection";
import MaintenanceRecord from "@/components/table/maintenanceRecord";
// import { delete } from "vue/types/umd";
// import { querySubStationList } from "@/api/organization/substation";
// import { imgUpload } from "@/api/upload/upload";
export default {
  name: "operationEquipmentLocation",
  components: { Map, RoutingInspection, MaintenanceRecord },
  data() {
    return {
      listState: false,
      form: {
        chiefDeputy: 1,
        bigDataAccess: 0,
        subStationName: "",
        equipmentName: "",
        areaName: "",
        installArea: 0,
        installCapacity: 0,
        componentListData: [],
        componentList: [],
        archivesId: "",
        longitude: "",
        latitude: "",
        areaId: "",
      },
      rules: {
        positionName: [
          { required: true, message: "请输入设备位置名称", trigger: "blur" },
        ],
        positionCode: [
          { required: true, message: "请输入设备位置编码", trigger: "blur" },
        ],
        equipmentName: [
          {
            required: true,
            message: "请选择设备名称",
            trigger: ["blur", "change"],
          },
        ],
        areaName: [
          {
            required: true,
            message: "请选择方阵",
            trigger: ["blur", "change"],
          },
        ],
        positionState: [
          {
            required: true,
            message: "请选择位置状态",
            trigger: "change",
          },
        ],
        effectiveRange: [
          { required: true, message: "请输入有效范围", trigger: "blur" },
        ],
        installMode: [
          {
            required: true,
            message: "请选择安装方式",
            trigger: "change",
          },
        ],
      },
      treeData: [],
      focusMainDialogVisible: false,
      focusMainDialogVisible1: false,
      focusMainDialogVisible2: false,
      focusMainDialogVisible3: false,
      focusMainDialogVisible4: false,
      mapDialogVisible: false,
      principaNum: "",
      tableData: [],
      changeRediod: {},
      dialogform: {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
        areaName: "",
        mainStationId: [],
        subStationId: [],
      },
      currentRowId: "",
      dialogImageUrl: "",
      equipmentAbbreviationOptions: JSON.parse(
        window.localStorage.getItem("equipmentAbbreviationOptions")
      ),
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      statusEquipmentOptions: JSON.parse(
        window.localStorage.getItem("statusEquipmentOptions")
      ),
      equipmentTypeBigDataOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeBigDataOptions")
      ),
      modelInstallOptions: JSON.parse(
        window.localStorage.getItem("modelInstallOptions")
      ),
      installAngleChangeOptions: JSON.parse(
        window.localStorage.getItem("installAngleChangeOptions")
      ),
      installAngleDictOptions: JSON.parse(
        window.localStorage.getItem("installAngleDictOptions")
      ),
      panelFactoryOptions: JSON.parse(
        window.localStorage.getItem("panelFactoryOptions")
      ),
      componentTypeOptions: JSON.parse(
        window.localStorage.getItem("componentTypeOptions")
      ),
      componentMaterialsOptions: JSON.parse(
        window.localStorage.getItem("componentMaterialsOptions")
      ),
      standardTemplateOptions: JSON.parse(
        window.localStorage.getItem("standardTemplateOptions")
      ),
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      buildTypeOptions: JSON.parse(
        window.localStorage.getItem("buildTypeOptions")
      ),
      pageNum: 1,
      pageSize: 10,
      addRowindex: 0,
      changeHistory: [],
      latlng: {},
    };
  },
  mounted() {
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    if (this.$route.query.id) {
      this.getQueryStageDetail();
      this.getPositionHistory({
        positionId: this.$route.query.id,
        pageNum: 1,
        pageSize: 50,
      });
    }
  },

  methods: {
    // 新建、提交
    compile() {
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
          if (this.form.componentListData) {
            this.form.componentListData.forEach((item) => {
              if (item.id) {
                this.form.componentList.push(item.id + "," + item.size);
              }
            });
          }
          let form = JSON.parse(JSON.stringify(this.form));
          delete form.equipmentName;
          delete form.subStationName;
          delete form.equipmentCode;
          delete form.equipmentSimple;
          delete form.equipmentType;
          delete form.equipmentTypeBigdata;
          delete form.manufactor;
          delete form.equipmentModel;
          delete form.warrantyTime;
          delete form.contactsName;
          delete form.contactsPhone;
          delete form.componentListData;
          if (data == "new") {
            positionAdd(form)
              .then(() => {
                this.$router.$avueRouter.closeTag();
                this.$router.push({
                  name: "设备位置",
                  params: { refresh: true },
                });
              })
              .finally(() => {
                this.form.componentList = [];
              });
          } else {
            form.id = this.$route.query.id;
            positionEdit(form)
              .then(() => {
                this.$router.$avueRouter.closeTag();
                this.$router.push({
                  name: "设备位置",
                  params: { refresh: true },
                });
                this.listState = !this.listState;
              })
              .finally(() => {
                this.form.componentList = [];
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //弹窗
    focusMainStation(num, index) {
      this.principaNum = num;
      this.addRowindex = index;
      this.changeRediod = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.tableData = [];
      this.dialogform = {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
        areaName: "",
        mainStationId: [],
        subStationId: [],
      };
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = true;
        this.$refs.mainStation0.blur();
        this.getQueryComponentTemplateList({
          pageNum: 1,
          pageSize: 10,
        });
      }
      if (this.principaNum == 1) {
        this.focusMainDialogVisible1 = true;
        if (this.form.mainStationId)
          this.dialogform.mainStationId.push(this.form.mainStationId);
        if (this.form.subStationId)
          this.dialogform.subStationId.push(this.form.subStationId);
        this.$refs.mainStation1.blur();
        this.getArchivesQueryList({
          mainStationId: this.dialogform.mainStationId,
          subStationId: this.dialogform.subStationId,
          pageNum: 1,
          pageSize: 10,
        });
      }
      if (this.principaNum == 2) {
        this.focusMainDialogVisible2 = true;
        this.$refs.mainStation2.blur();
        this.getqueryList({
          pageNum: 1,
          pageSize: 10,
        });
      }
      if (this.principaNum == 3) {
        this.focusMainDialogVisible3 = true;
        this.$refs.mainStation3.blur();
        this.getQueryMainStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 4) {
        this.focusMainDialogVisible4 = true;
        this.$refs.mainStation4.blur();
        this.getQuerySubStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
    },
    getPositionHistory(data) {
      positionHistory(data).then((res) => {
        this.changeHistory = res.data.data.pageData;
      });
    },
    getQueryComponentTemplateList(data) {
      console.log(data);
      queryComponentTemplateList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
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
      querySubStationList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 设备档案
    getArchivesQueryList(data) {
      console.log(data);
      archivesQueryList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    getqueryList(data) {
      console.log(data);
      queryList(data).then((res) => {
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
        this.getQueryComponentTemplateList({
          componentMaterials: this.dialogform.componentMaterialsList,
          componentType: this.dialogform.componentTypeList,
          power: this.dialogform.power,
          manufactor: this.dialogform.manufactor,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 1) {
        this.getArchivesQueryList({
          mainStationId: this.dialogform.mainStationId,
          subStationId: this.dialogform.subStationId,
          equipmentName: this.dialogform.equipmentName,
          equipmentCode: this.dialogform.equipmentCode,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 2) {
        this.getqueryList({
          areaName: this.dialogform.areaName,
          areaCode: this.dialogform.areaCode,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 3) {
        this.getQueryMainStationList({
          constructionTypeList: this.dialogform.constructionTypeList,
          ownerGroupList: this.dialogform.ownerGroupList,
          mainStationIdList: this.dialogform.mainStationIdList,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
      if (this.principaNum == 4) {
        this.getQuerySubStationList({
          subStationPersonName: this.dialogform.subStationPersonName,
          subStationCode: this.dialogform.subStationCode,
          subStationIdList: this.dialogform.subStationIdList,
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
        positionRemove({ idList: [this.$route.query.id] }).then(() => {
          this.$router.$avueRouter.closeTag();
          this.$router.push({ name: "设备位置", params: { refresh: true } });
        });
      });
    },
    // 组件配置添加
    principalAdd() {
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = false;
        this.currentRowId = "";
        console.log(this.changeRediod);
        this.$nextTick(() => {
          this.form.componentListData.splice(
            this.addRowindex,
            1,
            this.changeRediod
          );
        });
      }
      if (this.principaNum == 1) {
        this.currentRowId = "";
        this.focusMainDialogVisible1 = false;
        this.form.archivesId = this.changeRediod.id;
        this.form.mainStationId = this.changeRediod.mainStationId;
        this.form.mainStationName = this.changeRediod.mainStationName;

        this.form.equipmentName = this.changeRediod.equipmentName;
        this.form.subStationName = this.changeRediod.subStationName;
        this.form.equipmentCode = this.changeRediod.equipmentCode;
        this.form.equipmentSimple = this.changeRediod.equipmentSimple;
        this.form.equipmentType = this.changeRediod.equipmentType;
        this.form.equipmentTypeBigdata = this.changeRediod.equipmentTypeBigdata;
        this.form.manufactor = this.changeRediod.manufactor;
        this.form.equipmentModel = this.changeRediod.equipmentModel;
        this.form.warrantyTime = this.changeRediod.warrantyTime;
        this.form.contactsName = this.changeRediod.contactsName;
        this.form.contactsPhone = this.changeRediod.contactsPhone;
      }
      if (this.principaNum == 2) {
        this.currentRowId = "";
        this.focusMainDialogVisible2 = false;
        this.form.areaName = this.changeRediod.areaName;
        this.form.areaId = this.changeRediod.id;
      }
      if (this.principaNum == 3) {
        this.focusMainDialogVisible3 = false;
        console.log(this.changeRediod);
        this.form.mainStationId = this.changeRediod.mainStationId;
        this.form.mainStationName = this.changeRediod.mainStationName;
      }
      if (this.principaNum == 4) {
        this.focusMainDialogVisible4 = false;
        this.form.desulfurizationElePrice =
          this.changeRediod.desulfurizationElePrice;
        this.form.subStationName = this.changeRediod.subStationName;
        this.form.subStationId = this.changeRediod.id;
      }
    },
    // 详情
    getQueryStageDetail() {
      positionDetail({ id: this.$route.query.id }).then((res) => {
        if (!res.data.data.componentListData)
          res.data.data.componentListData = [];
        this.form = res.data.data;
        this.form.componentListData = res.data.data.componentList;
        this.form.componentList = [];
      });
    },
    // 点击添加行按钮
    addRow() {
      this.form.componentListData.push({
        manufactor: "",
        componentModel: "",
        power: "",
        componentType: "",
        componentMaterials: "",
        size: "",
        area: "",
        capacity: "",
      });
    },
    //详情导出
    handleExport() {
      exportDetail({ id: this.$route.query.id })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "设备位置详情.xls"; //下载的文件名
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
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 删除添加行
    handleDelete(index) {
      this.form.componentListData.splice(index, 1);
    },
    //数量输入
    sizeInput() {
      this.form.installArea = 0;
      this.form.installCapacity = 0;
      let installArea = 0;
      let installCapacity = 0;
      this.form.componentListData.forEach((item) => {
        installArea +=
          item.length * item.width * item.size
            ? item.length * item.width * item.size
            : 0;
        installCapacity += item.power * item.size ? item.power * item.size : 0;
      });
      this.form.installArea = installArea;
      this.form.installCapacity = installCapacity;
    },
    // 地图坐标
    mapLocation() {
      this.mapDialogVisible = true;
      this.latlng = {
        lng: this.form.longitude ? this.form.longitude * 1 : "",
        lat: this.form.latitude ? this.form.latitude * 1 : "",
      };
    },
    // 地图坐标修改
    modifyDot() {
      this.mapDialogVisible = false;
      this.form.longitude = this.$refs.map.coordinates.lng.toFixed(6);
      this.form.latitude = this.$refs.map.coordinates.lat.toFixed(6);
    },
    // 二维码下载
    qrCodeDownload(className, index) {
      qrCodeDownload(className, index);
    },
    // 生成二维码
    generateQRCode() {
      generateCode({ ids: [this.$route.query.id] }).then(() => {
        this.getQueryStageDetail();
        this.getPositionHistory({
          positionId: this.$route.query.id,
          pageNum: 1,
          pageSize: 50,
        });
      });
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
        max-width: 100px;
        overflow: hidden;
        position: relative;
        .el-select__tags-text {
          max-width: 70px;
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
        color: #333;
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
  .generate-content {
    display: flex;
    flex-wrap: wrap;
    .img-list {
      position: relative;
      width: 150px;
      height: 150px;
      margin-left: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      &:hover {
        .mask-lyer {
          display: block;
          border-radius: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
        }
      }
      .mask-lyer {
        display: none;
        .download-sty {
          color: #fafafa;
          font-size: 25px;
          font-weight: bold;
          position: absolute;
          top: calc(50% - 15px);
          left: calc(50% - 15px);
          cursor: pointer;
        }
      }
    }
  }
}
</style>