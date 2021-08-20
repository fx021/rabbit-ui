<template>
  <div>
    <!-- 不是详情查看页!$route.query.id
          不是新增页!$route.query.type
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
            v-if="$route.query.type"
            >新增
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
            v-if="$route.query.id"
            plain
            class="none-border"
            icon="el-icon-postcard"
            @click.stop="handleState(scope.row, scope.index)"
            >变更
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="$route.query.id"
            plain
            icon="el-icon-chat-dot-round"
            class="none-border"
            @click.stop="handleState(scope.row, scope.index)"
            >变更记录
          </el-button>
          <el-button
            type="warning"
            size="small"
            plain
            icon="el-icon-upload2"
            v-if="$route.query.id"
            @click.stop="exportDetail"
            >导出
          </el-button>
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
          <div class="title-text">基础信息</div>
          <el-form-item label="排班标题" prop="title" style="width: 66.66%">
            <el-input v-model="form.title" readonly></el-input>
          </el-form-item>
          <el-form-item label="排班编号">
            <el-input readonly v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="是否有效" prop="isEffective">
            <el-select
              v-model="form.isEffective"
              placeholder="请选择"
              :disabled="processInstanceId || $route.query.id"
            >
              <el-option :label="'是'" :value="1"></el-option>
              <el-option :label="'否'" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织" prop="mainStationName">
            <el-input
              v-model="form.mainStationName"
              @focus="focusMainStation"
              :readonly="processInstanceId || $route.query.id"
              ref="mainStation"
              placeholder="请选择"
            ></el-input>
          </el-form-item>
          <el-form-item label="年月" prop="time">
            <el-date-picker
              v-model="form.time"
              :disabled="processInstanceId || $route.query.id"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排班类型" prop="workType">
            <el-select
              v-model="form.workType"
              placeholder="请选择"
              :disabled="processInstanceId || $route.query.id"
            >
              <el-option
                v-for="item in workTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sort">
            <el-input
              v-model="form.sort"
              placeholder="请输入内容"
              :readonly="processInstanceId || $route.query.id"
              oninput="value=value.replace(/[^0-9]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="修改人">
            <el-input v-model="form.updateByUserName" readonly></el-input>
          </el-form-item>
          <el-form-item label="修改时间" prop="updateTime">
            <el-input v-model="form.updateTime" readonly></el-input>
          </el-form-item>
          <div class="title-text">
            <div>数据操作</div>
            <div>
              <el-button
                type="warning"
                size="small"
                plain
                icon="el-icon-download"
                @click="updataDialog"
                v-if="$route.query.type"
                >数据导入
              </el-button>
            </div>
          </div>
          <div class="table" style="width: 100%">
            <el-table
              ref="multipleTable"
              :data="form.detailList"
              tooltip-effect="dark"
              border
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
                show-overflow-tooltip
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                prop="userName"
                label="姓名"
                fixed="left"
                show-overflow-tooltip
                align="center"
                width="115"
              >
                <template slot-scope="scope">
                  <div v-if="$route.query.type">
                    <el-form-item
                      title=""
                      :prop="'detailList.' + scope.$index + '.userName'"
                      :rules="rules.userName"
                    >
                      <el-input
                        v-model="scope.row.userName"
                        placeholder="请选择"
                        ref="treeRef0"
                        @focus="focusTree(0, scope.$index)"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div v-else>{{ scope.row.userName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="userEmpNumber"
                label="工号"
                fixed="left"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="日期"
                fixed="left"
                align="center"
                show-overflow-tooltip
              >
                <el-table-column
                  prop="province"
                  label="星期"
                  fixed="left"
                  align="center"
                  show-overflow-tooltip
                >
                  {{ "出勤类型" }}
                </el-table-column>
              </el-table-column>
              <el-table-column
                :label="item"
                v-for="(item, index) in 31"
                :key="item.id"
                align="center"
                show-overflow-tooltip
              >
                <el-table-column label="星期" align="center" width="150">
                  <template slot-scope="scope">
                    <div v-if="!$route.query.type">
                      {{
                        scope.row["attendanceTypeName_" + (index + 1)] +
                        " | " +
                        (scope.row["stayStation_" + (index + 1)] == 1
                          ? "是"
                          : scope.row["stayStation_" + (index + 1)] == 0
                          ? "否"
                          : "")
                      }}
                    </div>
                    <div v-else>
                      <el-form-item
                        title=""
                        :prop="
                          'detailList.' +
                          scope.$index +
                          ['attendanceTypeName_' + (index + 1)]
                        "
                      >
                        <el-select
                          v-model="
                            scope.row['attendanceTypeName_' + (index + 1)]
                          "
                          placeholder="请选择"
                          clearable
                        >
                          <el-option
                            v-for="item in arrangeOpstions"
                            :key="item.attendanceTypeCode"
                            :label="item.attendanceTypeName"
                            :value="item.attendanceTypeCode"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        title=""
                        :prop="
                          'detailList.' +
                          scope.$index +
                          ['stayStation_' + (index + 1)]
                        "
                      >
                        <el-select
                          v-model="scope.row['stayStation_' + (index + 1)]"
                          placeholder="请选择"
                          clearable
                          @change="attendanceCountChange(index + 1)"
                        >
                          <el-option :label="'是'" :value="1"></el-option>
                          <el-option :label="'否'" :value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="合计"
                fixed="right"
                align="center"
                show-overflow-tooltip
                prop="attendanceCount"
              ></el-table-column>
              <el-table-column
                label="操作"
                align="center"
                fixed="right"
                width="100"
                show-overflow-tooltip
                v-if="!$route.query.id && !processInstanceId"
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
              v-if="!$route.query.id && !processInstanceId"
            >
              <i class="el-icon-plus"></i>添加行
            </div>
          </div>
          <div class="title-text">明细</div>
          <table class="detail-table">
            <thead style="width: 100%">
              <tr>
                <th><div>上班人数</div></th>
                <template v-if="form.workPeopleCount">
                  <td
                    v-for="(item, index) in 31"
                    :key="index"
                    @click="peopleCount('workCountDetail', index + 1)"
                  >
                    <div>{{ form.workPeopleCount["day_" + (index + 1)] }}</div>
                  </td>
                  <td>
                    <div>{{ workPeopleCountTotal }}</div>
                  </td>
                </template>
              </tr>
              <tr>
                <th><div>住站人数</div></th>
                <template v-if="form.stayStationPeopleCount">
                  <td
                    v-for="(item, index) in 31"
                    :key="index"
                    @click="peopleCount('stayCountDetail', index + 1)"
                  >
                    <div>
                      {{ form.stayStationPeopleCount["day_" + (index + 1)] }}
                    </div>
                  </td>
                  <td>
                    <div>{{ stayStationPeopleCountTotal }}</div>
                  </td>
                </template>
              </tr>
              <tr>
                <th><div>预测天气</div></th>
                <template v-if="form.forecastWeather">
                  <td v-for="(item, index) in 31" :key="index">
                    <div>
                      {{ form.forecastWeather["day_" + (index + 1)] | weather }}
                    </div>
                  </td>
                  <td>
                    <el-button
                      size="mini"
                      type="text"
                      @click="searchWeather('forecast')"
                      >查询</el-button
                    >
                  </td>
                </template>
              </tr>
              <tr>
                <th><div>实际天气</div></th>
                <template v-if="form.actualWeather">
                  <td v-for="(item, index) in 31" :key="index">
                    <div>
                      {{ form.actualWeather["day_" + (index + 1)] | weather }}
                    </div>
                  </td>
                  <td>
                    <el-button
                      size="mini"
                      type="text"
                      @click="searchWeather('actual')"
                      >查询</el-button
                    >
                  </td>
                </template>
              </tr>
            </thead>
          </table>
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
              show-overflow-tooltip
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
    <!-- 数据导入 -->
    <el-dialog
      title="数据导入"
      :visible.sync="updataDialogVisible"
      v-if="updataDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="500px"
    >
      <el-upload
        action="#"
        accept=".xls, .xlsx"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="bulkImport"
        style="margin-bottom: 20px; display: flex; justify-content: center"
        class="upload-demo"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或点击上传
          <el-button type="text" @click.stop="downloadTemplate"
            >下载模板</el-button
          >
        </div>
      </el-upload>
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
    <!-- 天气  -->
    <el-dialog
      title="当月天气"
      :visible.sync="weatherDialogVisibl"
      v-if="weatherDialogVisibl"
      append-to-body
      class="focus-main-dialogs"
      width="280px"
    >
      <table class="detail-table" style="width: 100%">
        <thead style="width: 100%">
          <tr>
            <th><div>天气类型</div></th>
            <th><div>天数</div></th>
          </tr>
          <tr>
            <td><div>晴</div></td>
            <td>
              <div>{{ weatherTable.CLEAR }}</div>
            </td>
          </tr>
          <tr>
            <td><div>多云</div></td>
            <td>
              <div>{{ weatherTable.PARTLY_CLOUDY }}</div>
            </td>
          </tr>
          <tr>
            <td><div>小雨</div></td>
            <td>
              <div>{{ weatherTable.LIGHT_RAIN }}</div>
            </td>
          </tr>
          <tr>
            <td><div>中雨及以上</div></td>
            <td>
              <div>{{ weatherTable.MODERATE_RAIN }}</div>
            </td>
          </tr>
          <tr>
            <td><div>小雪</div></td>
            <td>
              <div>{{ weatherTable.LIGHT_SNOW }}</div>
            </td>
          </tr>
          <tr>
            <td><div>中雪及以上</div></td>
            <td>
              <div>{{ weatherTable.MODERATE_SNOW }}</div>
            </td>
          </tr>
        </thead>
      </table>
    </el-dialog>
    <!-- 人数 -->
    <el-dialog
      :title="
        arrangeWorkList.day ? form.time + '-' + arrangeWorkList.day : form.time
      "
      :visible.sync="peopleCountDialogVisible"
      v-if="peopleCountDialogVisible"
      append-to-body
      class="focus-main-dialogs"
      width="280px"
    >
      <table class="detail-table" style="width: 100%">
        <thead style="width: 100%">
          <tr>
            <th><div>住站人员</div></th>
            <th><div>工号</div></th>
          </tr>
          <template v-if="arrangeWorkList.length > 0">
            <!-- <div v-if="arrangeWorkList.length > 0"> -->
            <tr v-for="(item, index) in arrangeWorkList" :key="index">
              <td>
                <div>{{ item.userName }}</div>
              </td>
              <td>
                <div>{{ item.userEmpNumber }}</div>
              </td>
            </tr>
          </template>

          <template v-else>
            <!-- </div> -->
            <!-- <div v-else> -->
            <tr>
              <td colspan="2" style="width: 236px; padding: 16px">暂无数据</td>
            </tr>
            <!-- </div> -->
          </template>
        </thead>
      </table>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryMainStationList,
  queryMainStationDropDownList,
} from "@/api/organization/allStation";
import {
  arrangeDetail,
  arrangeAnalysis,
  arrangeWeather,
  arrangeAdd,
  arrangeChangeEffective,
  arrangeExportDetail,
  statisticsWeatherDays,
  arrangeWorkCountDetai,
  arrangeEdit,
} from "@/api/workArrange/workArrange";
import { queryPageList } from "@/api/backstage/attendance.js";
import Tree from "@/components/organization/tree.vue";
import { userList } from "@/api/organization/staging";
import mySelect from "@/components/select/select.vue";
import { exportArea } from "@/api/upload/upload";
import { tree } from "@/api/organization/allStation";
export default {
  name: "newRepairOrder",
  components: { mySelect, Tree },
  props: {
    id: String,
    dataId: String,
    value: Object,
    processNodeId: String,
    processInstanceId: String,
    comment: String,
  },
  data() {
    return {
      rules: {
        mainStationName: [
          { required: true, message: "请选择所属组织", trigger: "change" },
        ],
        time: [{ required: true, message: "请选择时间", trigger: "change" }],
        workType: [
          { required: true, message: "请选择排班类型", trigger: "change" },
        ],
        userName: [
          {
            required: true,
            message: "请选择名称",
            trigger: ["input", "change"],
          },
        ],
        stayStation: [
          {
            required: true,
            message: "请选择",
            trigger: ["change"],
          },
        ],
        attendanceTypeName: [
          {
            required: true,
            message: "请选择出勤类型",
            trigger: ["change"],
          },
        ],
      },
      form: {
        mainStationName: "",
        isEffective: 1,
        time: "",
        workType: "",
        detailList: [],
        workPeopleCount: {},
        stayStationPeopleCount: {},
        forecastWeather: {},
        actualWeather: {},
        detailParamList: [],
      },
      dialogNum: 0,
      focusMainDialogVisible: false, // 所属组织弹窗
      updataDialogVisible: false,
      weatherDialogVisibl: false, //天气弹窗
      peopleCountDialogVisible: false, //人数弹窗
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
      treeDialogVisible: false, //地址本弹窗
      choice: true,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      treeNum: "",
      tableIndex: "",
      addData: "",
      arrangeOpstions: {},
      weatherTable: {},
      workPeopleCountTotal: 0,
      stayStationPeopleCountTotal: 0,
      arrangeWorkList: [],
      workTypeOptions: JSON.parse(localStorage.getItem("workTypeOptions")), //排班类型
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
    weather(value) {
      switch (value) {
        case "CLEAR":
          return "晴";
        case "PARTLY_CLOUDY":
          return "多云";
        case "LIGHT_RAIN":
          return "小雨";
        case "MODERATE_RAIN":
          return "中雨及以上";
        case "LIGHT_SNOW":
          return "小雪";
        case "MODERATE_SNOW":
          return "中雪及以上";
        default:
          return;
      }
    },
  },
  mounted() {
    console.log("mounted执行", this.processInstanceId);
    userList({ userName: "", inMyMainStation: 1 }).then((res) => {
      this.commonUserList = res.data.data;
    });
    this.getDetail();
    queryPageList({ pageNum: 1, pageSize: 20 }).then((res) => {
      this.arrangeOpstions = res.data.data.pageData;
    });
  },
  methods: {
    // 新建
    compile() {
      for (const key in this.form.stayStationPeopleCount) {
        if (this.form.stayStationPeopleCount[key] == 1) {
          return this.$message.warning("住站人数必须大于1人");
        }
      }
      this.formValidate("new");
    },
    // 提交工作流
    beforeBtnClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.detailList.length < 2) return this.$message.warning("");
          this.form.year = this.form.time.split("-")[0];
          this.form.month = this.form.time.split("-")[1];
          this.form.detailParamList = [];
          this.form.detailList.forEach((item) => {
            this.form.detailParamList.push({
              userId: item.userId, //用户id
              userName: item.userName, //用户名
              userEmpNumber: item.userEmpNumber, //工号
              userArrangeList: [],
            });
            for (const key in item) {
              if (/stayStation_/.test(key) && item[key] !== "") {
                this.form.detailParamList[
                  this.form.detailParamList.length - 1
                ].userArrangeList.push({
                  day: key.split("_")[1], //日
                  attendanceTypeCode:
                    item["attendanceTypeName_" + key.split("_")[1]], //出勤类型
                  isStayInStation: item[key], //是否住站
                });
              }
            }
          });
          this.form.taskCode = this.$route.query.taskDefinitionKey;
          // console.log(this.$route.query.comment);
          // this.form.taskComment = this.comment;
          this.form.taskId = this.$route.query.taskId;
          this.form.workArrangeId = this.form.id;
          console.log(this.form);
          // this.form.processInstanceId = this.processInstanceId;
          arrangeEdit(this.form).then((res) => {
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
        this.getSituationDetail({ workArrangeId: this.$route.query.id });
      }
      // 工作流
      if (this.processInstanceId) {
        this.getSituationDetail({ processInstanceId: this.processInstanceId });
      }
      // 新增
      if (this.$route.query.type !== "add" && this.$route.query.type) {
        this.getSituationDetail({ workArrangeId: this.$route.query.type });
      }
    },
    // 获取详情列表
    getSituationDetail(data) {
      arrangeDetail(data).then((res) => {
        if (res.data.data) {
          this.form = res.data.data;
          this.form.time = res.data.data.year + "-" + res.data.data.month;
          for (const key in this.form.workPeopleCount) {
            if (this.form.workPeopleCount[key] > 0) {
              this.workPeopleCountTotal += this.form.workPeopleCount[key];
            }
          }
          for (const key in this.form.stayStationPeopleCount) {
            if (this.form.stayStationPeopleCount[key] > 0) {
              this.stayStationPeopleCountTotal +=
                this.form.stayStationPeopleCount[key];
            }
          }
        }
      });
    },
    // 置为有效/无效
    changeState(num) {
      arrangeChangeEffective({
        workArrangeId: this.$route.query.id,
        isEffective: num,
      }).then(() => {
        this.getDetail();
      });
    },
    // 导出
    formValidate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.detailList.length < 2) return this.$message.warning("");
          this.form.year = this.form.time.split("-")[0];
          this.form.month = this.form.time.split("-")[1];
          this.form.detailParamList = [];
          this.form.detailList.forEach((item) => {
            this.form.detailParamList.push({
              userId: item.userId, //用户id
              userName: item.userName, //用户名
              userEmpNumber: item.userEmpNumber, //工号
              userArrangeList: [],
            });
            for (const key in item) {
              if (/stayStation_/.test(key) && item[key] !== "") {
                this.form.detailParamList[
                  this.form.detailParamList.length - 1
                ].userArrangeList.push({
                  day: key.split("_")[1], //日
                  attendanceTypeCode:
                    item["attendanceTypeName_" + key.split("_")[1]], //出勤类型
                  isStayInStation: item[key], //是否住站
                });
              }
            }
          });
          arrangeAdd(this.form).then(() => {
            this.$message.success("新建成功");
            this.$router.$avueRouter.closeTag();
            this.$router.push({
              name: "排班管理",
              params: { refresh: true },
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加行
    addRow() {
      let obj = {
        attendanceCount: "",
        attendanceTypeCode_1: "",
        attendanceTypeCode_2: "",
        attendanceTypeCode_3: "",
        attendanceTypeCode_4: "",
        attendanceTypeCode_5: "",
        attendanceTypeCode_6: "",
        attendanceTypeCode_7: "",
        attendanceTypeCode_8: "",
        attendanceTypeCode_9: "",
        attendanceTypeCode_10: "",
        attendanceTypeCode_11: "",
        attendanceTypeCode_12: "",
        attendanceTypeCode_13: "",
        attendanceTypeCode_14: "",
        attendanceTypeCode_15: "",
        attendanceTypeCode_16: "",
        attendanceTypeCode_17: "",
        attendanceTypeCode_18: "",
        attendanceTypeCode_19: "",
        attendanceTypeCode_20: "",
        attendanceTypeCode_21: "",
        attendanceTypeCode_22: "",
        attendanceTypeCode_23: "",
        attendanceTypeCode_24: "",
        attendanceTypeCode_25: "",
        attendanceTypeCode_26: "",
        attendanceTypeCode_27: "",
        attendanceTypeCode_28: "",
        attendanceTypeCode_29: "",
        attendanceTypeCode_30: "",
        attendanceTypeCode_31: "",
        attendanceTypeName_1: "",
        attendanceTypeName_2: "",
        attendanceTypeName_3: "",
        attendanceTypeName_4: "",
        attendanceTypeName_5: "",
        attendanceTypeName_6: "",
        attendanceTypeName_7: "",
        attendanceTypeName_8: "",
        attendanceTypeName_9: "",
        attendanceTypeName_10: "",
        attendanceTypeName_11: "",
        attendanceTypeName_12: "",
        attendanceTypeName_13: "",
        attendanceTypeName_14: "",
        attendanceTypeName_15: "",
        attendanceTypeName_16: "",
        attendanceTypeName_17: "",
        attendanceTypeName_18: "",
        attendanceTypeName_19: "",
        attendanceTypeName_20: "",
        attendanceTypeName_21: "",
        attendanceTypeName_22: "",
        attendanceTypeName_23: "",
        attendanceTypeName_24: "",
        attendanceTypeName_25: "",
        attendanceTypeName_26: "",
        attendanceTypeName_27: "",
        attendanceTypeName_28: "",
        attendanceTypeName_29: "",
        attendanceTypeName_30: "",
        attendanceTypeName_31: "",
        stayStation_1: "",
        stayStation_2: "",
        stayStation_3: "",
        stayStation_4: "",
        stayStation_5: "",
        stayStation_6: "",
        stayStation_7: "",
        stayStation_8: "",
        stayStation_9: "",
        stayStation_10: "",
        stayStation_11: "",
        stayStation_12: "",
        stayStation_13: "",
        stayStation_14: "",
        stayStation_15: "",
        stayStation_16: "",
        stayStation_17: "",
        stayStation_18: "",
        stayStation_19: "",
        stayStation_20: "",
        stayStation_21: "",
        stayStation_22: "",
        stayStation_23: "",
        stayStation_24: "",
        stayStation_25: "",
        stayStation_26: "",
        stayStation_27: "",
        stayStation_28: "",
        stayStation_29: "",
        stayStation_30: "",
        stayStation_31: "",
        userEmpNumber: "",
        userId: "",
        userName: "",
      };
      this.form.detailList.push(obj);
    },
    // 删除行
    handleDel(index, item) {
      this.$confirm("确定要删除吗?")
        .then(() => {
          for (const key in item) {
            let str = new RegExp(`stayStation_`);
            if (str.exec(key) && item[key] == 1) {
              console.log(key.split("stayStation_")[1]);
              this.form.stayStationPeopleCount[
                "day_" + key.split("stayStation_")[1]
              ]--;
              this.form.workPeopleCount[
                "day_" + key.split("stayStation_")[1]
              ]--;
            }
          }
          this.form.detailList.splice(index, 1);
        })
        .catch(() => {
          return false;
        });
    },
    // 人数弹窗
    peopleCount(data, index) {
      if (this.form.mainStationId && !this.$route.query.type) {
        this.peopleCountDialogVisible = true;
        this.arrangeWorkList = [];
        arrangeWorkCountDetai({
          url: data,
          workArrangeId: this.form.id,
          day: index,
        }).then((res) => {
          this.arrangeWorkList = res.data.data;
          this.arrangeWorkList.day = index;
        });
      }
    },
    // 负责人弹窗
    focusTree(num, index) {
      this.treeDialogVisible = true;
      this.treeNum = num;
      this.tableIndex = index;
      this.treeData = [];
      if (this.treeNum == 0) {
        this.$refs.treeRef0.blur();
        this.choice = true;
      }
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    // 选择负责人数据
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    // 添加负责人
    treeAdd() {
      if (this.treeNum == 0) {
        console.log(this.addData);
        for (const item of this.form.detailList) {
          console.log(item);
          if (item.userEmpNumber == this.addData.code)
            return this.$message.warning("该员工已存在");
        }
        this.form.detailList[this.tableIndex].userId = this.addData.id;
        this.form.detailList[this.tableIndex].userName = this.addData.name; //任务负责人名称
        this.form.detailList[this.tableIndex].userEmpNumber = this.addData.code;
        this.treeDialogVisible = false;
      }
      this.addData = [];
    },
    // 合计
    attendanceCountChange(index) {
      this.form.stayStationPeopleCount["day_" + index] = 0;
      this.form.workPeopleCount["day_" + index] = 0;
      this.workPeopleCountTotal = 0;
      this.stayStationPeopleCountTotal = 0;
      this.form.detailList.forEach((item) => {
        item.attendanceCount = 0;
        for (const key in item) {
          if (/stayStation_/.test(key) && item[key] == 1) {
            item.attendanceCount++;
          }
          let str = new RegExp(`stayStation_${index}$`);
          if (str.test(key) && item[key] == 1) {
            this.form.stayStationPeopleCount["day_" + index]++;
            this.form.workPeopleCount["day_" + index]++;
          }
        }
      });
      for (const key in this.form.workPeopleCount) {
        if (this.form.workPeopleCount[key] > 0) {
          this.workPeopleCountTotal += this.form.workPeopleCount[key];
        }
      }
      for (const key in this.form.stayStationPeopleCount) {
        if (this.form.stayStationPeopleCount[key] > 0) {
          this.stayStationPeopleCountTotal +=
            this.form.stayStationPeopleCount[key];
        }
      }
      this.$forceUpdate();
    },
    // 详情导出
    exportDetail() {
      arrangeExportDetail({ workArrangeId: this.$route.query.id })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          link.download = "排班详情.xls"; //下载的文件名
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
    // 导入
    bulkImport(file) {
      console.log(file);
      let files = file.raw;
      arrangeAnalysis(files).then((res) => {
        console.log(res);
        this.$message.success("导入成功");
        this.arrangeDetail = false;
        this.searchData();
      });
    },
    // 数据导入
    updataDialog() {
      if (!this.form.time) return this.$message.warning("请选择年月");
      this.updataDialogVisible = true;
    },
    //下载模板
    downloadTemplate() {
      let str =
        "import_work_arrange_detail_" + this.form.time.split("-")[1] * 1;
      exportArea(str).then((res) => {
        const link = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        console.log(res);
        // link.download = res.headers['content-disposition'] //下载后文件名
        link.download = "模板.xls"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
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
    //所属组织单选
    focusMainStation() {
      if (this.processInstanceId || this.$route.query.id) return;
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
    getUserList(data) {
      userList(data).then((res) => {
        this.commonUserList = res.data.data ? res.data.data : [];
      });
    },
    // 表格单选
    changeRadio(event, row) {
      if (this.dialogNum == 0) {
        this.$set(this.stationDialogForm, "changedRadio", row);
      }
    },
    // 查询天气
    getArrangeWeather(data) {
      let month = parseInt(data.month, 10);
      let temp = new Date(data.year, month, 0);
      arrangeWeather({
        mainStationId: data.mainStationId, //组织id
        startDate: data.year + "-" + data.month + "-01", //开始日期
        endDate: data.year + "-" + data.month + "-" + temp.getDate(), //结束日期
      });
    },
    // 天气统计
    searchWeather(identification) {
      if (this.$route.query.type) return this.$message.warning("暂无信息");
      this.weatherDialogVisibl = true;
      let month = parseInt(this.form.month, 10);
      let temp = new Date(this.form.year, month, 0);
      statisticsWeatherDays({
        weatherType: identification,
        mainStationId: this.form.id, //组织id
        startDate: this.form.year + "-" + this.form.month + "-01", //开始日期
        endDate: this.form.year + "-" + this.form.month + "-" + temp.getDate(), //结束日期
      }).then((res) => {
        console.log(res.data.data);
        this.weatherTable = res.data.data;
      });
    },
    // 添加组织
    stationAdd() {
      console.log(this.stationDialogForm.changedRadio);
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
      }
    },
    // 每页条数
    handleSizeChange(val) {
      if (this.dialogNum === 0) {
        this.stationDialogForm.pageSize = val;
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
      }
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
.table {
  /deep/.el-table {
    .el-table_1_column_4_column_5 {
      background: #f5f7fa;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
      line-height: 23px;
      font-weight: bold;
    }
    .el-form-item {
      width: 100%;
      .el-form-item__content {
        width: 100%;
      }
    }
  }
}
.details-title {
  width: 100%;
  padding-bottom: 10px;
  // border-bottom: 1px solid #b3d8ff;
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
  /deep/ .el-table_6_column_161_column_162 {
    background: #f5f7fa;
  }
  .title-text {
    color: rgb(96, 98, 102);
    line-height: 40px;
    width: 100%;
    text-align: left;
    padding: 10px 0 15px 16px;
    border-top: 1px solid #b3d8ff;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }
  .detail-table {
    border: 1px solid #ebeef5;
    width: 100%;
    th {
      border: 1px solid #ebeef5;
      background: #f5f7fa;
      color: #666;
      width: 120px;
      div {
        padding: 12px 0;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle;
        font-size: 14px;
        padding-right: 10px;
        padding-left: 10px;
      }
    }

    td {
      text-align: center;
      border: 1px solid #ebeef5;
      color: #666;
      div {
        padding: 12px 0;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle;
        padding-right: 10px;
        padding-left: 10px;
      }
    }
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
  /deep/.detail-table {
    th {
      border: 1px solid #ebeef5;
      background: #f5f7fa;
      color: #666;
      width: 120px;
      div {
        padding: 12px 0;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle;
        font-size: 14px;
        padding-right: 10px;
        padding-left: 10px;
      }
    }
    td {
      text-align: center;
      border: 1px solid #ebeef5;
      color: #666;
      div {
        padding: 12px 0;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle;
        padding-right: 10px;
        padding-left: 10px;
      }
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
