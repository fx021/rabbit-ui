<template>
  <div class="all-details">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-checked"
            @click="mapPlantArea"
            >电站区域
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-checked"
            @click="changeState(1)"
            >置为有效
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-delete"
            @click="changeState(0)"
            >置为无效
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-delete"
            @click="compile"
            >{{ !compileShow ? "提交" : "编辑" }}
          </el-button>
          <!-- <el-button
            type="warning"
            size="small"
            plain
            icon="el-icon-download"
            icon="el-icon-upload2"
            >导出
          </el-button> -->
          <el-button
            type="danger"
            size="small"
            plain
            class="el-icon-delete"
            @click.stop="deletes"
            >删除</el-button
          >
        </div>
      </div>
      <div class="main">
        <el-form ref="form" :model="form"  :rules="rules">
          <div class="basics">
            <div class="content">
              <table>
                <tr>
                  <th colspan="6" class="title">基础信息</th>
                </tr>
                <tr>
                  <th>组织名称</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.mainStationName"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>组织编码</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.mainStationCode"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>总人数</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.totalUserCount"
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>备案总容量（MW）</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.filingCapacity"
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>并网总容量（MW）</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.accessCapacity"
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th><span style="color: red">*</span>所属地区</th>
                  <td>
                    <el-form-item prop="region">
                      <el-input
                        v-model="form.region"
                        :disabled="compileShow"
                        placeholder="请输入内容"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><span style="color: red">*</span>组织负责人</th>
                  <td>
                    <el-form-item prop="mainStationPersonName">
                      <el-input
                        :disabled="compileShow"
                        v-model="form.mainStationPersonName"
                        placeholder="请输入内容"
                        @focus="focusMainStation(0)"
                        ref="mainStation0"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>联系方式</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.mainStationPersonPhone"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>场地总面积（㎡）</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.areaCovered"
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><span style="color: red">*</span>地区负责人</th>
                  <td>
                    <el-form-item prop="regionPersonName">
                      <el-input
                        :disabled="compileShow"
                        v-model="form.regionPersonName"
                        placeholder="请输入内容"
                        @focus="focusMainStation(1)"
                        ref="mainStation1"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>联系方式</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.regionPersonPhone"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>经度</th>
                  <td>
                    <div class="location">
                      <el-form-item>
                        <el-input
                          :disabled="compileShow"
                          v-model="form.longitude"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                        ></el-input>
                      </el-form-item>
                      <i class="el-icon-location-outline" @click="mapLocation"></i>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><span style="color: red">*</span>集控负责人</th>
                  <td>
                    <el-form-item prop="centerPersonName">
                      <el-input
                        :disabled="compileShow"
                        v-model="form.centerPersonName"
                        placeholder="请输入内容"
                        @focus="focusMainStation(2)"
                        ref="mainStation2"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>联系方式</th>
                  <td>
                    <el-form-item>
                      <el-input
                        disabled
                        v-model="form.centerPersonPhone"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>纬度</th>
                  <td>
                    <div class="location">
                      <el-form-item>
                        <el-input
                          :disabled="compileShow"
                          v-model="form.latitude"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                        ></el-input>
                      </el-form-item>
                      <i class="el-icon-location-outline" @click="mapLocation"></i>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>电站简介</th>
                  <td colspan="6" style="width: 88%">
                    <el-form-item>
                      <el-input
                        v-model="form.introduction"
                        :disabled="compileShow"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="请输入"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>电站风貌</th>
                  <td colspan="6" class="upload-box">
                    <el-upload
                      action="#"
                      list-type="picture-card"
                      accept=".jpg, .jpeg, .png"
                      :auto-upload="false"
                      :file-list="form.imgList"
                      :on-change="handleChange"
                    >
                      <!-- :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                      :on-preview="handlePreview" -->
                      <i slot="default" class="el-icon-plus"></i>
                      <div slot="file" slot-scope="{ file }">
                        <img
                          class="el-upload-list__item-thumbnail"
                          :src="file.url"
                          style="height: 146px;"
                          alt=""
                        />
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-preview"
                            @click="handlePictureCardPreview(file)"
                          >
                            <i class="el-icon-zoom-in"></i>
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
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">子期信息</div>
              <el-table
                ref="multipleTable"
                :data="form.subStationList"
                tooltip-effect="dark"
                style="width: 100%"
                border
              >
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column label="序号" type="index" width="50" align="center">
                </el-table-column>
                <el-table-column
                  prop="subStationName"
                  label="所属子期"
                  show-overflow-tooltip
                  width="100"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="subStationCode"
                  label="子期编码"
                  show-overflow-tooltip
                  width="100"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="subStationPersonName"
                  label="子期负责人"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="subStationPersonPhone"
                  label="联系方式"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="companyName"
                  label="公司名称"
                  show-overflow-tooltip
                  align="center"
                >
                <template slot-scope="scope" v-if="scope.row.companyName">
                    {{ companyOptions[scope.row.companyName * 1 - 1].dictValue }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ownerGroup"
                  label="隶属集团"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope" v-if="scope.row.ownerGroup">
                    {{ ownerGroupOptions[scope.row.ownerGroup * 1 - 1].dictValue }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="constructionType"
                  label="建设类型"
                  show-overflow-tooltip
                  align="center"
                >
                <template slot-scope="scope" v-if="scope.row.constructionType">
                  {{ buildTypeOptions[scope.row.constructionType * 1 - 1].dictValue }}
                </template>
                </el-table-column>
                <el-table-column
                  prop="outsideOwner"
                  label="外线归属"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope" v-if="scope.row.outsideOwner">
                    {{ lineAttributionOptions[scope.row.outsideOwner * 1 - 1].dictValue }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="filingCapacity"
                  label="备案容量（MW）"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="accessaCapacity"
                  label="并网容量（MW）"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="runState"
                  label="运行状态"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">
                      <span>{{scope.row.runState == 1?'已投运':'未投运'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-if="!compileShow" >
                  <template slot-scope="scope" >
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
              <div class="add-box" @click="addRow" v-show="!compileShow">
                <i class="el-icon-plus"></i> 添加行
              </div>
            </div>
          </div>
          <div class="rests">
            <div
              class="content"
              :style="compileShow ? 'border-top: 1px solid #b3d8ff;' : ''"
            >
              <table>
                <tr>
                  <th colspan="6" class="title">其他信息</th>
                </tr>
                <tr>
                  <th><span style="color: red">*</span>排序号</th>
                  <td>
                    <el-form-item prop="sort">
                      <el-input
                        :disabled="compileShow"
                        v-model="form.sort"
                        placeholder="请输入"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>修改人</th>
                  <td>
                    {{ form.updateByUserName }}
                  </td>
                   <th>修改时间</th>
                  <td>
                    {{ form.updateTime }}
                  </td>
                </tr>
                <tr>
                  <th>是否有效</th>
                  <td>{{ form.isEffective == 0 ? "无效" : "有效" }}</td>
                  <th>主副设备</th>
                  <td>
                    {{ form.chiefDeputy == 1 ? "主组织" : "副组织" }}
                  </td>
                  <th><td></td></th>
                </tr>
                <tr>
                  <th>备注</th>
                  <td  style="width:88%">
                    <el-form-item>
                      <el-input
                        :disabled="compileShow"
                        v-model="form.remark"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="请输入"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 添加行弹窗 -->
    <el-dialog
      title="添 加"
      :visible.sync="dialogVisible"
      append-to-body
      class="add-dialog"
    >
      <div class="add-content">
        <div class="add-title">
          <div class="sertch-condition">
            所属子期：
            <el-input
              v-model="subStationName"
              style="width: 200px"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </div>
          <div class="sertch-condition">
            子期编码：
            <el-input
              v-model="subStationCode"
              style="width: 200px"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </div>
          <div class="sertch-condition">
            负责人：
            <el-input
              v-model="subStationPersonName"
              style="width: 200px"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </div>
          <el-button type="primary" @click="seartch" style="margin: 0 24px"
            >查 询</el-button
          >
        </div>
        <div style="margin-top: 10px">
          <el-table
            ref="subStationTable"
            :data="subStationTableList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
          >
            <el-table-column type="selection" :selectable="checkSelectable"></el-table-column>
            <el-table-column label="序号" type="index" width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="subStationCode"
              label="子期编码"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="subStationPersonName"
              label="子期负责人"
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 选择负责人弹窗 -->
    <el-dialog
      title="选择负责人"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Tree
          :data="treeData"
          :props="defaultProps"
          :showRight="true"
          :tableList=[]
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 预览图片弹窗 -->
    <el-dialog :visible.sync="imgDialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
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
  queryMainStationDetail,
  changeMainStationEffective,
  // queryMainStationDropDownList,
  tree,
  removeMainStation,
  editMainStation,
} from "@/api/organization/allStation";
import lrz from "lrz";
import { queryMainStationMapPosition,editMainStationMapFence } from "@/api/map/map";
import Map from "@/components/map/map";
import { imgUpload } from "@/api/upload/upload";
import { querySubStationList } from "@/api/organization/substation";
// querySubStationDropDownList,
import Tree from "@/components/organization/tree";
export default {
  name: "allDetails",
  components: { Tree, Map },
  data() {
    return {
      form: {
        imgList: [],
        longitude: "",
        latitude: "",
      },
      rules: {
        mainStationName: [
          { required: true, message: "请输入组织名称", trigger: "blur" },
        ],
        mainStationCode: [
          { required: true, message: "请输入组织编码", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请输入所属地区", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        mainStationPersonName: [
          {
            required: true,
            message: "请选择组织负责人",
            trigger: ["blur", "change"],
          },
        ],
        regionPersonName: [
          {
            required: true,
            message: "请选择地区负责人",
            trigger: ["blur", "change"],
          },
        ],
        centerPersonName: [
          {
            required: true,
            message: "请选择集控负责人",
            trigger: ["blur", "change"],
          },
        ],
      },
      compileShow: true,
      // options: [],
      dialogVisible: false,
      focusMainDialogVisible: false,
      mapDialogVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      addData: "",
      principaNum: "",
      // substationText: "",
      subStationName: "",
      subStationCode: "",
      subStationPerson: [],
      // regionOptions: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // substationOptions: [],
      dialogImageUrl: "",
      imgDialogVisible: false,
      disabled: false,
      loading: false,
      subStationPersonName: "",
      userListOptions: [],
      subStationTableList: [],
      multipleSelection: [],
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      buildTypeOptions: JSON.parse(
        window.localStorage.getItem("buildTypeOptions")
      ),
      lineAttributionOptions: JSON.parse(
        window.localStorage.getItem("lineAttributionOptions")
      ),
      btnshow: false,
      latlng: {},
      setpoint: false,
      plantArea: false,
      fencePointList: {},
    };
  },
  mounted() {
    this.getQueryMainStationDetail();
  },
  methods: {
    // 编辑
    compile() {
      if (this.compileShow) {
        this.compileShow = !this.compileShow;
        console.log("编辑模式");
      } else {
        if (this.btnshow) return this.$message.warning("正在上传图片");
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.compileShow = !this.compileShow;
            console.log("提交成功");
            this.form.mainStationId = this.$route.query.id;
            this.form.subStationIdList = [];
            this.form.subStationList.forEach((item) => {
              this.form.subStationIdList.push(item.id);
            });
            console.log(this.form);
            editMainStation(this.form).then(() => {
              this.$message.success("提交成功");
              this.$router.$avueRouter.closeTag();
              this.$router.push({ name: "组织", params: { refresh: true } });
            });
          }
        });
      }
    },
    // 修改状态
    changeState(isEffective) {
      changeMainStationEffective({
        mainStationIdList: [this.$route.query.id],
        isEffective,
      }).then(() => {
        this.getQueryMainStationDetail();
      });
    },
    // 获取组织详情信息
    getQueryMainStationDetail() {
      queryMainStationDetail({ mainStationId: this.$route.query.id }).then(
        (item) => {
          if (item.data.data.imgList) {
            item.data.data.imgList.forEach((item) => {
              item.url = this.imgUrl + item.fileId;
            });
          }
          this.form = item.data.data;
          console.log(this.form);
        }
      );
    },
    // 删除组织
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        removeMainStation({ mainStationIdList: [this.$route.query.id] }).then(
          () => {
            this.$router.$avueRouter.closeTag();
            this.$router.push({ name: "组织", params: { refresh: true } });
          }
        );
      });
    },
    // 点击添加行按钮
    addRow() {
      this.dialogVisible = true;
      querySubStationList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        console.log("querySubStationList", res.data.data);
        this.subStationTableList = res.data.data.pageData;
        this.$refs.multipleTable.toggleRowSelection(this.form.subStationList);
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    checkSelectable(data) {
      if (!this.form.subStationList) return true;
      let tf = this.form.subStationList.some((res) => {
        return res.id == data.id;
      });
      if (!tf) {
        return true;
      }
    },
    // 添加行确认添加
    handleDialogAdd() {
      if (!this.form.subStationList) this.form.subStationList = [];
      this.form.subStationList.push(...this.multipleSelection);
      this.dialogVisible = false;
    },
    // 选择负责人数据
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    // 添加负责人
    principalAdd() {
      this.focusMainDialogVisible = false;
      if (this.principaNum == 0) {
        this.form.mainStationPerson = this.addData.id; //组织负责人ID
        this.form.mainStationPersonName = this.addData.name; //组织负责人名称
        this.form.mainStationPersonPhone = this.addData.phone; //组织负责人电话
      }
      if (this.principaNum == 1) {
        this.form.regionPerson = this.addData.id; //地区负责人ID
        this.form.regionPersonName = this.addData.name; //地区负责人姓名
        this.form.regionPersonPhone = this.addData.phone; //地区负责人电话
      }
      if (this.principaNum == 2) {
        this.form.centerPerson = this.addData.id; //集控负责人id
        this.form.centerPersonName = this.addData.name; //集控负责人姓名
        this.form.centerPersonPhone = this.addData.phone; //集控负责人电话
      }
      this.addData = [];
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //负责人弹窗
    focusMainStation(num) {
      this.focusMainDialogVisible = true;
      this.principaNum = num;
      this.treeData = [];
      if (this.principaNum == 0) {
        this.$refs.mainStation0.blur();
      }
      if (this.principaNum == 1) {
        this.$refs.mainStation1.blur();
      }
      if (this.principaNum == 2) {
        this.$refs.mainStation2.blur();
      }
      // this.$refs.mainStation[num].blur();
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    //添加弹窗查询
    seartch() {
      this.getQuerySubStationList({
        // mainStationIdList: [this.$route.query.id],
        subStationName: this.subStationName,
        subStationCode: this.subStationCode,
        subStationPersonName: this.subStationPersonName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 子期列表查询
    getQuerySubStationList(data) {
      querySubStationList(data).then((res) => {
        console.log("querySubStationList", res.data.data);
        this.subStationTableList = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // handleAvatarSuccess(response, file, fileList) {
    //   console.log("handleAvatarSuccess", response, file, fileList);
    // },
    // 添加图片
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      this.btnshow = true;
      lrz(file.raw)
        .then((file) => {
          imgUpload(file.origin).then((res) => {
            console.log(res.data.data, this.imgUrl);
            res.data.data.url = this.imgUrl + res.data.data.fileId;
            fileList[fileList.length - 1] = res.data.data;
            this.form.imgList = fileList;
            this.btnshow = false;
          });
        })
        .catch(function () {
          // 处理失败会执行
        });
    },
    // handlePreview(file) {
    //   console.log("handlePreview", file);
    // },
    // beforeAvatarUpload(file) {
    //   console.log("beforeAvatarUpload", file);
    // },
    // 图片删除
    handleRemove(file) {
      console.log(file);
      console.log(this.form.imgList);
      const i = this.form.imgList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.imgList.splice(i, 1);
    },
    // 图片预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    // 子期删除表格
    handleDelete(index) {
      this.form.subStationList.splice(index, 1);
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.seartch();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.seartch();
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
    // 电站区域
    mapPlantArea() {
      this.plantArea = true;
      this.setpoint = false;
      this.mapDialogVisible = true;
      queryMainStationMapPosition({ mainStationId: this.$route.query.id }).then(
        (res) => {
          console.log("queryMainStationMapPosition", res.data.data.fenceList);
          this.fencePointList = res.data.data.fenceList;
        }
      );
      // if (!this.form.fenceList) {
      //   this.form.fenceList = [];
      // }
      // this.fencePointList = this.form.fenceList;
    },
    // 区域提交
    fenceSubmit(data) {
      editMainStationMapFence({ mainStationId: this.$route.query.id ,pointList:data}).then(res=>{
        console.log(res);
      })
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
/deep/.el-table th > .cell {
  color: #333;
}
.all-details {
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
        .upload-box {
          width: 87%;
        }
        table {
          width: 100%;
          tr {
            display: flex;
            align-items: center;
            th {
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
            }
            td {
              width: 23%;
              padding: 10px;
              /deep/.el-textarea.is-disabled {
                .el-textarea__inner {
                  // background-color: #ffffff;
                }
              }
              /deep/.el-form-item {
                margin-bottom: 0px;
                .el-select {
                  width: 100%;
                }
              }
              /deep/ .el-select .el-input.is-disabled .el-input__inner:hover {
                // background-color: #ffffff;
              }
              /deep/.el-input.is-disabled .el-input__inner {
                // background-color: #ffffff;
              }
            }
          }
          .title {
            width: 100%;
            text-align: left;
            padding: 10px 0px 15px;
            font-size: 20px;
            margin-left: -10px;
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
        .title-text {
          color: rgb(96, 98, 102);
          line-height: 40px;
          width: 100%;
          text-align: left;
          padding: 10px 16px 15px;
          font-size: 20px;
          font-weight: bold;
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
    .rests {
      margin-top: 20px;
      .content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-top: 20px;
        padding-bottom: 20px;
        table {
          width: 100%;
          tr {
            display: flex;
            align-items: center;
            th {
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
            }
            td {
              width: 23%;
              padding: 10px;
              /deep/.el-textarea.is-disabled {
                .el-textarea__inner {
                  // background-color: #ffffff;
                }
              }
              /deep/.el-form-item {
                margin-bottom: 0px;
                .el-select {
                  width: 100%;
                }
              }
              /deep/ .el-select .el-input.is-disabled .el-input__inner:hover {
                // background-color: #ffffff;
              }
              /deep/.el-input.is-disabled .el-input__inner {
                // background-color: #ffffff;
              }
            }
            .title {
              width: 100%;
              text-align: left;
              padding: 10px 0px 15px;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
