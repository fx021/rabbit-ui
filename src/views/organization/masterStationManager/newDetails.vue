<template>
  <div class="new-details">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            >新建
          </el-button>
        </div>
      </div>
      <div class="main">
        <el-form ref="form" :model="form" :rules="rules">
          <div class="basics">
            <div class="content">
              <table>
                <tr>
                  <th colspan="6" class="title">基础信息</th>
                </tr>
                <tr>
                  <th><span style="color: red">*</span> 组织名称</th>
                  <td>
                    <el-form-item prop="mainStationName">
                      <el-input v-model="form.mainStationName"></el-input>
                    </el-form-item>
                  </td>
                  <th><span style="color: red">*</span>组织编码</th>
                  <td>
                    <el-form-item prop="mainStationCode">
                      <el-input v-model="form.mainStationCode"></el-input>
                    </el-form-item>
                  </td>
                  <th>总人数</th>
                  <td>
                    <el-form-item>
                      <el-input v-model="form.totalUserCount" 
                        disabled
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>备案总容量（MW）</th>
                  <td>
                    <el-form-item>
                      <el-input v-model="form.filingCapacity"  disabled
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th>并网总容量（MW）</th>
                  <td>
                    <el-form-item>
                      <el-input v-model="form.accessCapacity"  disabled
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th><span style="color: red">*</span>所属地区</th>
                  <td>
                    <el-form-item prop="region">
                      <el-input
                        v-model="form.region"
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
                        v-model="form.areaCovered" disabled
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
                </el-table-column>
                <el-table-column
                  prop="ownerGroup"
                  label="隶属集团"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="constructionType"
                  label="建设类型"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="outsideOwner"
                  label="外线归属"
                  show-overflow-tooltip
                  align="center"
                >
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
                </el-table-column>
                <el-table-column label="操作">
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
          <div class="rests">
            <div class="content">
              <table>
                <tr>
                  <th colspan="6" class="title">其他信息</th>
                </tr>
                <tr>
                  <th><span style="color: red">*</span>排序号</th>
                  <td>
                    <el-form-item prop="sort">
                      <el-input
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
                  <td>
                    <el-radio v-model="form.isEffective" label="1"
                      >有效</el-radio
                    >
                    <el-radio v-model="form.isEffective" label="0"
                      >无效</el-radio
                    >
                  </td>
                  <th>主副设备</th>
                  <td>
                    <el-radio v-model="form.chiefDeputy" label="1"
                      >主组织</el-radio
                    >
                    <el-radio v-model="form.chiefDeputy" label="0"
                      >副组织</el-radio
                    >
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
        <Map id='setpoint' height='60vh' :latlng='latlng' :setpoint='true' ref="map"></Map>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  // queryMainStationDropDownList,
  addMainStation,
  tree,
} from "@/api/organization/allStation";
import Map from "@/components/map/map";
import { userList } from "@/api/dictionaries/dictionaries";
import lrz from "lrz";
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
        isEffective: "1",
        chiefDeputy: "1",
        mainStationPersonName: "",
        regionPersonName: "",
        centerPersonName: "",
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
      subStationName: "",
      subStationCode: "",
      subStationPerson: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // substationOptions: [],
      dialogImageUrl: "",
      imgDialogVisible: false,
      loading: false,
      subStationPersonName: "",
      userListOptions: [],
      subStationTableList: [],
      multipleSelection: [],
      latlng: {},
    };
  },
  mounted() {
    // this.getQueryMainStationDetail();
    // // 主站下拉列表
    // queryMainStationDropDownList({ keyWord: "" }).then((res) => {
    //   this.options = res.data.data;
    // });
  },
  methods: {
    // 新建
    compile() {
      if (this.btnshow) return this.$message.warning("正在上传图片");
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("新建成功");
          //   this.form.mainStationId = this.$route.query.id;
          addMainStation(this.form).then(() => {
            this.$message.success("新建成功");
            this.$router.$avueRouter.closeTag();
            this.$router.push({ name: "组织" ,params: { refresh: true }});
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
      tree().then((res) => {
        this.treeData = res.data.data;
      });
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
    // 添加图片
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      lrz(file.raw)
        .then((file) => {
          imgUpload(file.origin).then((res) => {
            console.log(res.data.data);
            res.data.data.url = this.imgUrl + res.data.data.fileId;
            fileList[fileList.length - 1] = res.data.data;
            this.form.imgList = fileList;
            this.btnshow = false;
          });
        })
        .catch(function (err) {
          // 处理失败会执行
        });
    },
    // 图片删除
    handleRemove(file) {
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
    // 点击添加行按钮
    addRow() {
      this.dialogVisible = true;
      this.getQuerySubStationList({
        // mainStationIdList: [this.$route.query.id],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
      // querySubStationDropDownList({
      //   // mainStationId: [this.$route.query.id],
      // }).then((res) => {
      //   console.log("querySubStationDropDownList", res.data.data);
      //   this.substationOptions = res.data.data;
      // });
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
      console.log(val);
      this.multipleSelection = val;
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
    //添加弹窗查询
    seartch() {
      querySubStationList({
        // mainStationIdList: [this.$route.query.id],
        subStationName: this.subStationName,
        subStationCode: this.subStationCode,
        subStationPersonName: this.subStationPersonName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        console.log("querySubStationList", res.data.data);
        this.subStationTableList = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        console.log(this.form.subStationList);
        this.form.subStationList.forEach((row) => {
          this.$refs.subStationTable.toggleRowSelection(row);
        });
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
    // 负责人列表
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        userList({ userName: query }).then((res) => {
          this.loading = false;
          this.userListOptions = res.data.data;
        });
      } else {
        this.userListOptions = [];
      }
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
.new-details {
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
                  background-color: #ffffff;
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