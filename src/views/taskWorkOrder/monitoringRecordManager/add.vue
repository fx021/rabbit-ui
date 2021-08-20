<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            >新增
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
              <div class="title">
                基础信息
                <span
                  id="down"
                  v-show="false"
                  :class="{ arrowTransform: !flag, arrowTransformReturn: flag }"
                  @click="flag = !flag"
                >
                  <i class="el-icon-arrow-down"></i>
                </span>
              </div>
              <div class="basice-box">
                <el-form-item label="所属组织:" prop="mainStationName">
                  <el-input
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    @focus="focusMainStation()"
                    ref="mainStation1"
                  ></el-input>
                </el-form-item>
                <el-form-item label="记录人员:" prop="recordersName">
                  <el-input
                    v-model="form.recordersName"
                    placeholder="请输入"
                    ref="treeRef0"
                    @focus="focusTree()"
                  ></el-input>
                </el-form-item>
                <el-form-item label="发布时间:" prop="releaseTime">
                  <el-date-picker
                    v-model="form.releaseTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <el-table
                ref="multipleTable"
                :data="form.records"
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
                  prop="discoverTime"
                  label="发现时间"
                  align="center"
                  width="240"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.discoverTime'"
                      :rules="rules.discoverTime"
                    >
                      <el-date-picker
                        v-model="scope.row.discoverTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="taskCategory"
                  label="任务分类"
                  align="center"
                  width="160"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.taskCategory'"
                      :rules="rules.taskCategory"
                    >
                      <el-select
                        v-model="scope.row.taskCategory"
                        filterable
                        allow-create
                        collapse-tags
                        clearable
                        default-first-option
                        placeholder="请选择"
                        @change="
                          getTaskContent(scope.row.taskCategory, scope.$index)
                        "
                      >
                        <el-option
                          v-for="item in taskClassificationList"
                          :key="item.id"
                          :label="item.taskClassification"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="taskContent"
                  label="任务内容"
                  align="center"
                  width="160"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.taskContent'"
                      :rules="rules.taskContent"
                    >
                      <el-select
                        v-model="scope.row.taskContent"
                        filterable
                        allow-create
                        collapse-tags
                        clearable
                        default-first-option
                        placeholder="请选择"
                        @change="getTaskContents(scope.row, scope.$index)"
                      >
                        <el-option
                          v-for="item in scope.row.taskContentList"
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
                  prop="contentCescribe"
                  label="内容描述"
                  align="center"
                  width="270"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.contentCescribe'"
                      :rules="rules.contentCescribe"
                    >
                      <el-input
                        v-model="scope.row.contentCescribe"
                        placeholder="请输入"
                        type="textarea"
                        :autosize="{ minRows: 1.3 }"
                      ></el-input
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="minioFileList"
                  label="任务图片"
                  align="center"
                  width="200"
                >
                  <template scope="scope">
                    <el-form-item
                      v-show="
                        scope.row.isisPhotograph == 1 &&
                        scope.row.minioFileList.length == 0
                      "
                      label-width="0"
                      :prop="'records.' + scope.$index + '.minioFileList'"
                      :rules="
                        scope.row.isisPhotograph == 1
                          ? rules.minioFileList
                          : rules.minioFileLists
                      "
                    >
                      <div v-if="scope.row.minioFileList.length == 0">
                        <el-tag>暂无图片上传!</el-tag>
                      </div>
                      <div>
                        <el-tag
                          v-for="item in scope.row.minioFileList"
                          :key="item"
                          closable
                          @click="handlePictureCardPreview(item)"
                          @close="handleClose(item, scope.row)"
                          style="
                            position: relative;
                            width: 160px;
                            overflow: hidden;
                            display: flex;
                            white-space: inherit;
                            padding: 0 20px 0 10px;
                            cursor: pointer;
                          "
                          :title="item.fileName | filterFileName"
                        >
                          {{ item.fileName | filterFileName }}
                        </el-tag>
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-show="
                        scope.row.isisPhotograph == 0 &&
                        scope.row.minioFileList.length == 0
                      "
                      label-width="0"
                      :prop="'records.' + scope.$index + '.minioFileList'"
                    >
                      <div v-if="scope.row.minioFileList.length == 0">
                        <el-tag>暂无图片上传!</el-tag>
                      </div>
                      <div>
                        <el-tag
                          v-for="item in scope.row.minioFileList"
                          :key="item"
                          closable
                          @click="handlePictureCardPreview(item)"
                          @close="handleClose(item, scope.row)"
                          style="
                            position: relative;
                            width: 160px;
                            overflow: hidden;
                            display: flex;
                            white-space: inherit;
                            padding: 0 20px 0 10px;
                            cursor: pointer;
                          "
                          :title="item.fileName | filterFileName"
                        >
                          {{ item.fileName | filterFileName }}
                        </el-tag>
                      </div>
                    </el-form-item>
                    <el-form-item
                      v-if="scope.row.minioFileList.length > 0"
                      label-width="0"
                      :prop="'records.' + scope.$index + '.minioFileList'"
                    >
                      <div>
                        <el-tag
                          v-for="item in scope.row.minioFileList"
                          :key="item"
                          closable
                          @click="handlePictureCardPreview(item)"
                          @close="handleClose(item, scope.row)"
                          style="
                            position: relative;
                            width: 160px;
                            overflow: hidden;
                            display: flex;
                            white-space: inherit;
                            padding: 0 20px 0 10px;
                            cursor: pointer;
                          "
                          :title="item.fileName | filterFileName"
                        >
                          {{ item.fileName | filterFileName }}
                        </el-tag>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  label="图片上传"
                  align="center"
                  width="100"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope" class="pictur">
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="handleChange"
                      multiple
                    >
                      <el-button
                        size="small"
                        type="primary"
                        @click="getPresentMsg(scope.row, scope.$index)"
                        >图片上传</el-button
                      >
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="urgentLevel"
                  label="紧急程度"
                  align="center"
                  width="130"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.urgentLevel'"
                      :rules="rules.urgentLevel"
                    >
                      <el-select
                        v-model="scope.row.urgentLevel"
                        filterable
                        allow-create
                        collapse-tags
                        clearable
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in urgencyOptions"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        >
                        </el-option> </el-select
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="recordType"
                  label="记录类型"
                  align="center"
                  width="130"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.recordType'"
                      :rules="rules.recordType"
                    >
                      <el-select
                        v-model="scope.row.recordType"
                        filterable
                        allow-create
                        collapse-tags
                        clearable
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in recordTypeOptions"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        >
                        </el-option> </el-select
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="taskLeaderName"
                  label="任务负责人"
                  align="center"
                  width="100"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'records.' + scope.$index + '.taskLeaderName'"
                      :rules="rules.taskLeaderName"
                    >
                      <el-input
                        v-model="scope.row.taskLeaderName"
                        type="input"
                        @focus="focusTrees(scope.$index)"
                        placeholder="请输入"
                      ></el-input
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="任务反馈时间" align="center">
                </el-table-column>
                <el-table-column prop="" label="结果判定" align="center">
                </el-table-column>
                <el-table-column prop="" label="结果描述" align="center">
                </el-table-column>
                <el-table-column prop="" label="结果附件" align="center">
                </el-table-column>
                <el-table-column prop="" label="核实人员" align="center">
                </el-table-column>
                <el-table-column prop="" label="核实时间" align="center">
                </el-table-column>
                <el-table-column prop="" label="工单状态" align="center">
                </el-table-column>
                <el-table-column label="操作" width="100">
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
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisibles"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogforms"
            :model="dialogforms"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="隶属集团：">
              <el-select
                v-model="dialogforms.ownerGroupList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange1"
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
            <el-form-item label="组织编码">
              <el-input
                v-model="dialogforms.mainStationCode"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="负责人：">
              <el-input
                placeholder="请输入"
                v-model="dialogforms.mainStationPersonName"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData()"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table :data="tableDatas" style="width: 100%" ref="mainTionRef">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowIds"
                  :label="scope.row.mainStationId"
                  @change="handleSelectionChange($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="mainStationName"
              label="隶属集团"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mainStationCode"
              label="组织编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mainStationPersonName"
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
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="principalAdds">添 加</el-button>
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
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
let indexs = 0;
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
import moment from "moment";
import { queryTaskDefinitionList } from "@/api/backstage/taskContent.js";
import { add } from "@/api/taskWorkOrder/monitoringRecord";
import { queryTaskClassifications } from "@/api/backstage/taskClassification.js";
import lrz from "lrz";
import { tree } from "@/api/organization/allStation";
import Tree from "@/components/organization/tree.vue";
import { queryMainStationList } from "@/api/organization/allStation";
export default {
  name: "",
  components: { Tree },
  data() {
    return {
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      urgencyOptions: JSON.parse(window.localStorage.getItem("urgencyOptions")),
      recordTypeOptions: JSON.parse(
        window.localStorage.getItem("recordTypeOptions")
      ),
      taskClassificationList: [],
      currentRowIds: "",
      rules: {
        mainStationName: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: ["input", "change"],
          },
        ],
        recordersName: [
          {
            required: true,
            message: "请选择记录人员",
            trigger: ["input", "change"],
          },
        ],
        discoverTime: [
          {
            required: true,
            message: "请选择发现时间",
            trigger: ["input", "change"],
          },
        ],
        contentCescribe: [
          {
            required: true,
            message: "请填写内容描述",
            trigger: ["input", "change"],
          },
        ],
        taskContent: [
          {
            required: true,
            message: "请选择任务内容",
            trigger: ["input", "change"],
          },
        ],
        urgentLevel: [
          {
            required: true,
            message: "请选择紧急程度",
            trigger: ["input", "change"],
          },
        ],
        minioFileList: [
          {
            required: true,
            message: "此任务需要上传图片!",
            trigger: ["input", "change"],
          },
        ],
        minioFileLists: [
          {
            required: false,
            message: "此任务需要上传图片!",
            trigger: ["input", "change"],
          },
        ],
        recordType: [
          {
            required: true,
            message: "请选择记录类型",
            trigger: ["input", "change"],
          },
        ],
        taskCategory: [
          {
            required: true,
            message: "请选择任务分类",
            trigger: ["input", "change"],
          },
        ],
        releaseTime: [
          {
            required: true,
            message: "请选择发布时间",
            trigger: ["input", "change"],
          },
        ],
      },
      dialogforms: {
        ownerGroupList: "",
        mainStationPersonName: "",
        mainStationCode: "",
      },
      flag: true,
      choice: true,
      defaultProps: {
        children: "children",
        label: "title",
      },
      form: {
        releaseTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
        mainStationName: "",
        mainStationId: "",
        recorders: [],
        recordersName: "",
        records: [
          {
            discoverTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"), //发现时间
            taskCategory: "", //任务分类
            taskContent: "", //任务内容
            contentCescribe: "", //内容描述
            urgentLevel: "", //紧急程度
            recordType: "", //记录类型
            taskLeader: "", //任务负责人"
            taskLeaderName: "",
            taskContentList: [],
            minioFileList: [],
            isisPhotograph: 0,
          },
        ],
      },
      focusMainDialogVisibles: false,
      treeDialogVisible: false,
      tableDatas: [],
      old: [],
      treeData: [],
      changeRediods: {},
      pageNum: 1,
      pageSize: 10,
      addData: [],
      nowMsg: {},
      imgDialogVisible: false,
      dialogImageUrl: "",
      fileList: [],
      flagtree: false,
    };
  },
  mounted() {
    queryTaskClassifications({}).then((res) => {
      this.taskClassificationList = res.data.data;
    });
  },
  methods: {
    getTaskContents(val, index) {
      this.form.records[index].isisPhotograph = 0;
      console.log(val.taskContentList, val.taskContent);
      val.taskContentList.forEach((v) => {
        if (v.id == val.taskContent) {
          this.form.records[index].isisPhotograph = v.isisPhotograph;
        }
      });
    },
    getTaskContent(val, index) {
      let code = "";
      this.form.records[index].taskContent = "";
      this.form.records[index].taskContentList = [];
      this.taskClassificationList.forEach((v) => {
        if (v.id == val) {
          code = v.taskClassificationCode;
        }
      });
      queryTaskDefinitionList({ taskClassificationCode: [code] }).then(
        (res) => {
          res.data.data.pageData.forEach((res) => {
            if (res.isEffective) {
              this.form.records[index].taskContentList.push({
                id: res.id,
                key: res.taskDefinition,
                isisPhotograph: res.isPhotograph,
              });
            }
          });
        }
      );
    },
    focusTrees(index) {
      indexs = index;
      this.flagtree = true;
      this.treeDialogVisible = true;
      this.choice = true;
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    // tag删除
    handleClose(tag, data) {
      data.minioFileList.splice(data.minioFileList.indexOf(tag), 1);
    },
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
    // 上传附件
    handleChange(file, fileList) {
      console.log(file, fileList, this.nowMsg);
      let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
      if (regular.test(file.name.split(".")[file.name.split(".").length - 1])) {
        lrz(file.raw).then((file) => {
          imgUpload(file.origin)
            .then((res) => {
              res.data.data.fileName = res.data.data.name;
              if (!this.nowMsg.minioFileList) this.nowMsg.minioFileList = [];
              res.data.data.url = this.imgUrl + res.data.data.fileId;
              res.data.data.domain = this.imgUrl + res.data.data.fileId;
              this.nowMsg.minioFileList.push(res.data.data);
              this.$message.success("上传成功");
              this.form.records[indexs].minioFileList =
                this.nowMsg.minioFileList;
            })
            .catch(function (err) {
              // 处理失败会执行
              console.log(err);
            });
        });
      } else {
        fileUpload(file.raw).then((res) => {
          res.data.data.url = "./img/file1.png";
          if (!this.nowMsg.minioFileList) this.nowMsg.minioFileList = [];
          res.data.data.fileName = res.data.data.name;
          this.nowMsg.minioFileList.push(res.data.data);
          this.form.records[indexs].minioFileList = this.nowMsg.minioFileList;
        });
      }
    },
    // 获取当前列表信息
    getPresentMsg(data, index) {
      this.nowMsg = data;
      indexs = index;
    },
    // 选择负责人数据
    selectData(data) {
      this.addData = data;
    },
    focusTree() {
      this.treeDialogVisible = true;
      this.flagtree = false;
      this.$refs.treeRef0.blur();
      this.choice = false;
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    // 添加负责人
    treeAdd() {
      this.treeDialogVisible = false;
      if (!this.flagtree) {
        this.form.recorders = this.addData.map((v) => {
          return v.id;
        }); //主要协助人ID
        this.form.recordersName = this.addData
          .map((v) => {
            return v.name;
          })
          .join(","); //主要协助人姓名
      } else {
        console.log(this.addData.id, indexs, this.addData.name);
        this.form.records[indexs].taskLeader = this.addData.id;
        this.form.records[indexs].taskLeaderName = this.addData.name;
        this.treeDialogVisible = false;
      }
      this.addData = [];
    },
    addRow() {
      this.form.records.push({
        discoverTime: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"), //发现时间
        taskCategory: "", //任务分类
        taskContent: "", //任务内容
        contentCescribe: "", //内容描述
        urgentLevel: "", //紧急程度
        recordType: "", //记录类型
        taskLeader: "", //任务负责人"
        taskLeaderName: "",
        minioFileList: [],
        taskContentList: [],
        isisPhotograph: 0,
      });
    },
    filterOptions(value, optionList) {
      let str = optionList.find((res) => {
        return res.dictKey == value;
      });
      if (str) {
        return str.dictValue;
      } else {
        return value;
      }
    },
    visibleChange1(val) {
      if (!val) {
        this.searchData();
      }
    },
    handleSelectionChange(event, row) {
      this.changeRediods = row;
    },
    cancel() {
      this.focusMainDialogVisibles = false;
    },
    //组织添加
    principalAdds() {
      this.form.mainStationName = "";
      this.form.mainStationId = "";
      this.form.mainStationName = this.changeRediods.mainStationName;
      this.old = this.changeRediods;
      this.form.mainStationId = this.changeRediods.mainStationId;
      this.focusMainDialogVisibles = false;
    },
    //组织搜索
    searchData() {
      queryMainStationList({
        ownerGroupList: this.dialogforms.ownerGroupList,
        mainStationCode: this.dialogforms.mainStationCode,
        mainStationPersonName: this.dialogforms.mainStationPersonName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableDatas = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    focusMainStation() {
      this.focusMainDialogVisibles = true;
      this.$refs.mainStation1.blur();
      queryMainStationList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableDatas = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        this.changeRediods = this.old; //解决取消回显问题
        this.currentRowIds = this.form.mainStationId;
      });
    },
    compile() {
      console.log(this.form, "xxxxxxxx");
      this.$refs.form.validate((v) => {
        console.log(v);
          if (v) {
            add(this.form).then((res) => {
              if (res.data.code == "200") {
                this.$router.push({ path: "./monitoringRecord" });
                this.$message({
                  message: "新增成功!",
                  type: "success",
                });
              } else {
                this.$message.error("新增失败");
              }
            });
        }
      });
    },
    handleDelete(index) {
      this.form.records.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-upload-list__item {
  transition: none !important;
}
/deep/ .el-tooltip {
  margin-top: -20px;
}
.sublevel {
  margin-top: -1px;
  .content {
    // border-bottom: 1px solid #b3d8ff;
    /deep/ .el-form-item__error {
      margin-left: 21px;
    }
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
    }
    .content-table {
      /deep/.el-table {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th {
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
.arrowTransform {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.arrowTransformReturn {
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
#down {
  float: right;
  display: block;
  width: 20px;
  height: 20px;
  // background-color: skyblue;
  text-align: center;
  cursor: pointer;
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
  }
}
/deep/.el-tag .el-icon-close {
  top: 8px;
  right: 3px;
  position: absolute;
}
</style>
