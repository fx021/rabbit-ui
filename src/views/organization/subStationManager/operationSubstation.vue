<template>
  <div class="operation-substation">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            @click="mapLocation"
            >位置维护
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            @click="changeState(1)"
            >置为有效
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-delete"
            @click="changeState(0)"
            >置为无效
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
          <!-- //!无导出 -->
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
                <el-form-item label="子期名称" prop="subStationName">
                  <el-input
                    v-model="form.subStationName"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="子期编码" prop="subStationCode">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.subStationCode"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="关联部门" prop="deptName">
                  <div>
                    <el-input
                      v-model="form.deptName"
                      :disabled="$route.query.id && !listState"
                      placeholder="请输入"
                      ref="mainStation0"
                      @focus="focusMainStation(0)"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="公司名称" prop="companyName">
                  <el-select
                    v-model="form.companyName"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in companyOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="社会统一信用代码" prop="uscc">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.uscc"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="法人信息" prop="artificialPersonName">
                  <div>
                    <el-input
                      v-model="form.artificialPersonName"
                      placeholder="请输入"
                      :disabled="$route.query.id && !listState"
                      @focus="focusMainStation(1)"
                      ref="mainStation1"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="子期负责人" prop="subStationPersonName">
                  <el-input
                    v-model="form.subStationPersonName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                    @focus="focusMainStation(2)"
                    ref="mainStation2"
                  ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="subStationPersonPhone">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.subStationPersonPhone"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="中控室电话" prop="centerPhone">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.centerPhone"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="隶属集团" prop="ownerGroup">
                  <el-select
                    v-model="form.ownerGroup"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
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
                <el-form-item label="电站类型" prop="subStationType">
                  <el-select
                    v-model="form.subStationType"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in stationTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="建设类型" prop="constructionType">
                  <el-select
                    v-model="form.constructionType"
                    allow-create
                    collapse-tags
                    :disabled="$route.query.id && !listState"
                    default-first-option
                    placeholder="请选择"
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
                <el-form-item label="地址" prop="locationCode">
                  <el-cascader
                    v-model="form.locationCode"
                    :disabled="$route.query.id && !listState"
                    :props="props"
                    ref="cascaderSite"
                    @visible-change="cascaderChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                  <el-input
                    v-model="form.address"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="场地面积（m2）" prop="areaCovered">
                  <el-input
                    v-model="form.areaCovered"
                    :disabled="$route.query.id && !listState"
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
                <el-form-item label="海拔" prop="altitude">
                  <el-input
                    v-model="form.altitude"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电站人数">
                  <el-input
                    v-model="form.stationPeopleCount"
                    disabled
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="ERP库存ID" prop="erpId">
                  <el-input
                    v-model="form.erpId"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属组织" prop="mainStationName">
                  <template v-if="!($route.query.id && !listState)">
                    <el-input
                      :disabled="$route.query.id && !listState"
                      v-model="form.mainStationName"
                      placeholder="请输入内容"
                      @focus="focusMainStation(3)"
                      ref="mainStation3"
                    ></el-input>
                  </template>
                  <template v-else>
                    <div @click="jump">{{ form.mainStationName }}</div>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">并网信息</div>
              <div class="basice-box">
                <el-form-item label="电压等级" prop="voltageLevel">
                  <el-select
                    v-model="form.voltageLevel"
                    allow-create
                    collapse-tags
                    :disabled="$route.query.id && !listState"
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in voltageLevelOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="调度名称" prop="scheduleName">
                  <el-input
                    v-model="form.scheduleName"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="调度关系" prop="scheduleRelation">
                  <el-select
                    v-model="form.scheduleRelation"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in schedulingRelationshipOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备案容量(MW)">
                  <el-input v-model="form.filingCapacity" disabled></el-input>
                </el-form-item>
                <el-form-item label="并网容量(MW)">
                  <el-input v-model="form.accessaCapacity" disabled></el-input>
                </el-form-item>
                <el-form-item label="运行状态" prop="runState">
                  <el-radio-group
                    v-model="form.runState"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-radio :label="1">已投运</el-radio>
                    <el-radio :label="0">未投运</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="外线归属" prop="outsideOwner">
                  <el-select
                    v-model="form.outsideOwner"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in lineAttributionOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="外线名称" prop="outsideName">
                  <el-input
                    v-model="form.outsideName"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外线长度(KM)" prop="outsideLength">
                  <el-input
                    v-model="form.outsideLength"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                  ></el-input>
                </el-form-item>
                <el-form-item label="外线性质" prop="outsideType">
                  <el-select
                    v-model="form.outsideType"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in outsideTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="外线运维单位" prop="outsideMaintain">
                  <el-input
                    v-model="form.outsideMaintain"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="outsideContact">
                  <el-input
                    v-model="form.outsideContact"
                    :disabled="$route.query.id && !listState"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="脱硫煤标杆电价（元）"
                  prop="desulfurizationElePrice"
                >
                  <el-input
                    v-model="form.desulfurizationElePrice"
                    :disabled="$route.query.id && !listState"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="结算电量计量点" prop="meteringPoint">
                  <el-select
                    v-model="form.meteringPoint"
                    allow-create
                    :disabled="$route.query.id && !listState"
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in meteringPointOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">固定安装区域信息</div>
              <div class="basice-box">
                <el-form-item
                  label="固定安装区域支路"
                  prop="installAreaFixedPgb"
                >
                  <el-select
                    v-model="form.installAreaFixedPgb"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAreaFixedPgbOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="跟踪安装区域支路"
                  prop="installAreaTrackPgb"
                >
                  <el-select
                    v-model="form.installAreaTrackPgb"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAreaTrackPgbOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="固定安装区域" prop="installAreaFixed">
                  <el-select
                    v-model="form.installAreaFixed"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAreaFixedOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="跟踪安装区域" prop="installAreaTrack">
                  <el-select
                    v-model="form.installAreaTrack"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAreaTrackOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="混合安装区域" prop="installAreaBlend">
                  <el-select
                    v-model="form.installAreaBlend"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installAreaBlendOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="电站发电量计算类型" prop="electricType">
                  <el-select
                    v-model="form.electricType"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in electricTypeDictOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="等效利用时数计算类型"
                  prop="equivalentType"
                >
                  <el-select
                    v-model="form.equivalentType"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equivalentCalculationTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="节能减排计算类型" prop="economyType">
                  <el-select
                    v-model="form.economyType"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equivalentCalculationTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="限电量计算类型" prop="limitType">
                  <el-select
                    v-model="form.limitType"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equivalentCalculationTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="升压站" prop="bsrm">
                  <el-select
                    v-model="form.bsrm"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in installBsrmOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">其他信息</div>
              <div class="basice-box">
                <el-form-item label="站端名称" prop="bigDataSubName">
                  <el-input
                    v-model="form.bigDataSubName"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
                <el-form-item label="站端编码" prop="bigDataSubCode">
                  <el-input
                    v-model="form.bigDataSubCode"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否接入" prop="bigDataAccess">
                  <el-radio-group
                    v-model="form.bigDataAccess"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-radio :label="1">接入</el-radio>
                    <el-radio :label="0">不接入</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="isEffective">
                  <el-radio-group
                    v-model="form.isEffective"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                  </el-radio-group>
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
                <el-form-item label="备注" prop="remark">
                  <el-form-item>
                    <el-input
                      :disabled="$route.query.id && !listState"
                      v-model="form.remark"
                      type="textarea"
                      :autosize="{ minRows: 2 }"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="选择部门"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="500px"
    >
      <div>
        <Tree
          :data="treeData"
          :tableList="[]"
          :props="defaultProps"
          :showRight="false"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择法人"
      :visible.sync="focusMainDialogVisible1"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Tree
          :data="treeData"
          :props="defaultProps"
          :tableList="[]"
          :showRight="true"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择负责人"
      :visible.sync="focusMainDialogVisible2"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Tree
          :data="treeData"
          :props="defaultProps"
          :tableList="[]"
          :showRight="true"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible3"
      append-to-body
      class="focus-main-dialogs"
      width="1280px"
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
                v-model="form.ownerGroupList"
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
              prop="mainStationPersonName"
              label="组织负责人"
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
        <Map height='60vh' :latlng='latlng' :setpoint='setpoint' :plantArea="plantArea" :fencePointList='fencePointList' ref="map" @fenceSubmit='fenceSubmit'></Map>
      </div>
      <span slot="footer" class="dialog-footer" v-if="setpoint">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  tree,
  queryMainStationList,
  queryMainStationDropDownList,
} from "@/api/organization/allStation";
import Map from "@/components/map/map";
import Tree from "@/components/organization/tree";
import { getLazyTree } from "@/api/base/region";
import {
  querySubStationDetail,
  addSubStation,
  editSubStation,
  changeSubStationEffective,
  removeSubStation,
} from "@/api/organization/substation";
export default {
  name: "operationSubstation",
  data() {
    return {
      listState: false,
      form: {
        runState: 1,
        bigDataAccess: 1,
        isEffective: 1,
        deptName: "",
        outsideType: "",
        meteringPoint: "",
        longitude: "",
        latitude: "",
      },
      rules: {
        subStationName: [
          { required: true, message: "请输入子期名称", trigger: "blur" },
        ],
        subStationCode: [
          { required: true, message: "请输入子期编码", trigger: "blur" },
        ],
        deptName: [
          {
            required: true,
            message: "请选择关联部门",
            trigger: ["change"],
          },
        ],
        artificialPersonName: [
          {
            required: true,
            message: "请选择法人信息",
            trigger: ["change"],
          },
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "change" },
        ],
        ownerGroup: [
          { required: true, message: "请输入隶属集团", trigger: "change" },
        ],
        subStationType: [
          { required: true, message: "请输入电站类型", trigger: "change" },
        ],
        constructionType: [
          { required: true, message: "请输入建设类型", trigger: "change" },
        ],
        locationCode: [
          {
            required: true,
            message: "请输入地址",
            trigger: ["blur", "change"],
          },
        ],
        longitude: [{ required: true, message: "请输入经度", trigger: "blur" }],
        latitude: [{ required: true, message: "请输入纬度", trigger: "blur" }],
        altitude: [{ required: true, message: "请输入海拔", trigger: "blur" }],
        erpId: [
          { required: true, message: "请输入ERP库存ID", trigger: "blur" },
        ],
        voltageLevel: [
          { required: true, message: "请输入电压等级", trigger: "change" },
        ],
        scheduleName: [
          { required: true, message: "请输入调度名称", trigger: "blur" },
        ],
        scheduleRelation: [
          { required: true, message: "请输入调度关系", trigger: "change" },
        ],
        // filingCapacity: [
        //   { required: true, message: "请输入备案容量(MW)", trigger: "blur" },
        // ],
        // accessaCapacity: [
        //   { required: true, message: "请输入并网容量(MW)", trigger: "blur" },
        // ],
        outsideOwner: [
          { required: true, message: "请输入外线归属", trigger: "change" },
        ],
        outsideName: [
          { required: true, message: "请输入外线名称", trigger: "blur" },
        ],
        outsideLength: [
          { required: true, message: "请输入外线长度(KM)", trigger: "blur" },
        ],
        outsideType: [
          { required: true, message: "请输入外线性质", trigger: "change" },
        ],
        desulfurizationElePrice: [
          {
            required: true,
            message: "请输入脱硫煤标杆电价（元）",
            trigger: "blur",
          },
        ],
        meteringPoint: [
          {
            required: true,
            message: "请输入结算电量计量点",
            trigger: "change",
          },
        ],
        installAreaFixedPgb: [
          {
            required: true,
            message: "请输入固定安装区域支路",
            trigger: "change",
          },
        ],
        installAreaTrackPgb: [
          {
            required: true,
            message: "请输入跟踪安装区域支路",
            trigger: "change",
          },
        ],
        installAreaFixed: [
          { required: true, message: "请输入固定安装区域", trigger: "change" },
        ],
        installAreaTrack: [
          { required: true, message: "请输入跟踪安装区域", trigger: "change" },
        ],
        installAreaBlend: [
          { required: true, message: "请输入混合安装区域", trigger: "change" },
        ],
        electricType: [
          {
            required: true,
            message: "请输入电站发电量计算类型",
            trigger: "change",
          },
        ],
        equivalentType: [
          {
            required: true,
            message: "请输入等效利用时数计算类型",
            trigger: "change",
          },
        ],
        economyType: [
          {
            required: true,
            message: "请输入节能减排计算类型",
            trigger: "change",
          },
        ],
        limitType: [
          {
            required: true,
            message: "请输入限电量计算类型",
            trigger: "change",
          },
        ],
        bsrm: [{ required: true, message: "请输入升压站", trigger: "change" }],
        bigDataSubName: [
          { required: true, message: "请输入站端名称", trigger: "blur" },
        ],
        bigDataSubCode: [
          { required: true, message: "请输入站端编码", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
      },
      currentRowId: "",
      dialogform: {
        mainStationIdList: [],
        ownerGroupList: [],
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      focusMainDialogVisible: false,
      focusMainDialogVisible1: false,
      focusMainDialogVisible2: false,
      focusMainDialogVisible3: false,
      principaNum: "",
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          getLazyTree(node.level == 0 ? "00" : node.value).then((res) => {
            const nodes = res.data.data.map((item) => ({
              value: item.id,
              label: item.title,
              leaf: !item.hasChildren,
            }));
            resolve(nodes);
          });
        },
      },
      total: 1,
      pageNum: 1,
      pageSize: 10,
      changeRediod: {},
      mainStationOptions: [],
      latlng: {},
      mapDialogVisible: false,
      btnshow: false,
      setpoint: false,
      plantArea: false,
      fencePointList: {},
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      voltageLevelOptions: JSON.parse(
        window.localStorage.getItem("voltageLevelOptions")
      ),
      buildTypeOptions: JSON.parse(
        window.localStorage.getItem("buildTypeOptions")
      ),
      lineAttributionOptions: JSON.parse(
        window.localStorage.getItem("lineAttributionOptions")
      ),
      outsideTypeOptions: JSON.parse(
        window.localStorage.getItem("outsideTypeOptions")
      ),
      stationTypeOptions: JSON.parse(
        window.localStorage.getItem("stationTypeOptions")
      ),
      schedulingRelationshipOptions: JSON.parse(
        window.localStorage.getItem("schedulingRelationshipOptions")
      ),
      meteringPointOptions: JSON.parse(
        window.localStorage.getItem("meteringPointOptions")
      ),
      electricTypeDictOptions: JSON.parse(
        window.localStorage.getItem("electricTypeDictOptions")
      ),
      equivalentCalculationTypeOptions: JSON.parse(
        window.localStorage.getItem("equivalentCalculationTypeOptions")
      ),
      installAreaFixedPgbOptions: JSON.parse(
        window.localStorage.getItem("installAreaFixedPgbOptions")
      ),
      installAreaTrackPgbOptions: JSON.parse(
        window.localStorage.getItem("installAreaTrackPgbOptions")
      ),
      installAreaFixedOptions: JSON.parse(
        window.localStorage.getItem("installAreaFixedOptions")
      ),
      installAreaTrackOptions: JSON.parse(
        window.localStorage.getItem("installAreaTrackOptions")
      ),
      installAreaBlendOptions: JSON.parse(
        window.localStorage.getItem("installAreaBlendOptions")
      ),
      installBsrmOptions: JSON.parse(
        window.localStorage.getItem("installBsrmOptions")
      ),
    };
  },
  components: { Tree, Map },
  // watch: {
  //   $route() {
  //     if (this.$route.query.id) {
  //       this.getQuerySubStationDetail();
  //     } else {
  //       this.form = {
  //         runState: 1,
  //         bigDataAccess: 1,
  //         isEffective: 1,
  //       };
  //     }
  //     this.listState = false;
  //   },
  // },
  mounted() {
    if (this.$route.query.id) this.getQuerySubStationDetail();
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
          if (data == "new") {
            addSubStation(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({ name: "子期" ,params: { refresh: true }});
            });
          } else {
            this.form.locationCode = this.form.locationCode.toString();
            this.form.subStationId = this.$route.query.id;
            editSubStation(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.listState = !this.listState;
              this.$router.push({ name: "子期" ,params: { refresh: true }});
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //地址本选择
    focusMainStation(num) {
      this.principaNum = num;
      console.log(num);
      this.tableData = [];
      if (this.principaNum == 0) {
        this.form.deptName = "";
        this.focusMainDialogVisible = true;
        this.$refs.mainStation0.blur();
        tree().then((res) => {
          this.treeData = res.data.data;
        });
      }
      if (this.principaNum == 1) {
        this.focusMainDialogVisible1 = true;
        this.$refs.mainStation1.blur();
        tree().then((res) => {
          this.treeData = res.data.data;
        });
      }
      if (this.principaNum == 2) {
        this.focusMainDialogVisible2 = true;
        this.$refs.mainStation2.blur();
        tree().then((res) => {
          this.treeData = res.data.data;
        });
      }
      if (this.principaNum == 3) {
        this.focusMainDialogVisible3 = true;
        this.$refs.mainStation3.blur();
        this.getQueryMainStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
        queryMainStationDropDownList({ keyWord: "" }).then((res) => {
          this.mainStationOptions = res.data.data;
        });
      }
    },
    getQueryMainStationList(data) {
      queryMainStationList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 获取组织详情信息
    getQuerySubStationDetail() {
      querySubStationDetail({ subStationId: this.$route.query.id }).then(
        (item) => {
          this.form = item.data.data;
          if (
            item.data.data.locationCode &&
            item.data.data.locationCode.length > 0
          ) {
            this.form.locationCode = item.data.data.locationCode.split(",");
          }
          console.log(this.form);
        }
      );
    },
    cascaderChange() {
      setTimeout(() => {
        if (this.$refs["cascaderSite"]) {
          console.log(this.form.locationCode);
          console.log(this.$refs["cascaderSite"].inputValue);
          let locationCode = this.$refs["cascaderSite"].inputValue.split(
            this.$refs["cascaderSite"].separator
          );
          this.form.province = locationCode[0];
          this.form.city = locationCode[1];
          this.form.county = locationCode[2];
          this.form.locationCode = this.form.locationCode.toString();
        }
      }, 400);
    },
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    // 修改状态
    changeState(isEffective) {
      changeSubStationEffective({
        subStationIdList: [this.$route.query.id],
        isEffective,
      }).then(() => {
        this.getQuerySubStationDetail();
      });
    },
    // 删除子期
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        removeSubStation({ subStationIdList: [this.$route.query.id] }).then(
          () => {
            this.$router.$avueRouter.closeTag();
            this.$router.push({ name: "子期" ,params: { refresh: true }});
          }
        );
      });
    },
    // 添加负责人
    principalAdd() {
      this.dialogform = {};
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = false;
        this.form.deptId = this.addData.id; //关联部门ID
        this.form.deptName = this.addData.name; //关联部门名
        this.form.stationPeopleCount = this.addData.listLength;
      }
      if (this.principaNum == 1) {
        this.focusMainDialogVisible1 = false;
        console.log(this.addData);
        this.form.artificialPerson = this.addData.id; //法人信息ID
        this.form.artificialPersonName = this.addData.name; //法人信息姓名
        this.form.artificialPersonPhone = this.addData.phone; //法人信息电话
      }
      if (this.principaNum == 2) {
        this.focusMainDialogVisible2 = false;
        this.form.subStationPerson = this.addData.id; //子期负责人id
        this.form.subStationPersonName = this.addData.name; //子期负责人姓名
        this.form.subStationPersonPhone = this.addData.phone; //子期负责人电话
      }
      if (this.principaNum == 3) {
        this.focusMainDialogVisible3 = false;
        this.form.mainStationId = this.changeRediod.mainStationId; //所属组织id
        this.form.mainStationName = this.changeRediod.mainStationName; //所属组织名称
      }
      this.addData = [];
      this.changeRediod = {};
    },
    // 表格单选
    changeRedio(event, row) {
      console.log("row", row);
      this.changeRediod = row;
    },
    jump() {
      this.$router.$avueRouter.closeTag();
      this.$router.push({
        path: "./allDetails",
        query: { id: this.form.mainStationId },
      });
    },
    // 查询
    searchData() {
      this.getQueryMainStationList({
        mainStationIdList: this.form.mainStationIdList, //主站id list
        ownerGroupList: this.form.ownerGroupList, //隶属集团
        pageNum: this.pageNum,
        pageSize: this.pageSize,
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
    // 地图坐标
    mapLocation() {
      this.setpoint = true;
      this.plantArea = false;
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
  /deep/ .el-dialog {
    .el-dialog__header {
      .el-dialog__title {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        word-wrap: break-word !important;
      }
    }
    .el-tree {
      width: 400px;
      height: 600px;
      overflow-y: auto;
      background-color: #fafafa;
    }
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
.focus-main-dialogs {
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
                color: #333;
              }
            }
          }
        }
      }
    }
  }
}
.operation-substation {
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