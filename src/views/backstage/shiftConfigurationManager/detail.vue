<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            v-show="!flags"
            icon="el-icon-plus"
            @click="flags = true"
            >编辑
          </el-button>
          <el-button
            type="primary"
            v-show="flags"
            size="small"
            plain
            icon="el-icon-plus"
            @click="editInformation"
            >提交
          </el-button>
          <el-button type="danger" size="small" plain @click="deletes"
            >删除
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
                <el-form-item label="班次名称" prop="workShiftName">
                  <el-input
                    :disabled="!flags"
                    v-model="form.workShiftName"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属组织" prop="mainStationName">
                  <el-input
                    :disabled="!flags"
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    @focus="focusMainStation()"
                    ref="mainStation1"
                  ></el-input>
                </el-form-item>
                <el-form-item label="出勤类型：" prop="attendanceTypeCodeList">
                  <el-select
                    v-model="form.attendanceTypeCodeList"
                    filterable
                    allow-create
                    collapse-tags
                    :disabled="!flags"
                    clearable
                    default-first-option
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in attendanceTypeCodeListoption"
                      :key="item.id"
                      :label="item.key"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="月份：" prop="monthList">
                  <el-select
                    v-model="form.monthList"
                    filterable
                    allow-create
                    collapse-tags
                    :disabled="!flags"
                    clearable
                    default-first-option
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in monthListoption"
                      :key="item.id"
                      :label="item.key"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间段数量" prop="timeCount">
                  <el-input
                    v-model="form.timeCount"
                    :disabled="true"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否有效：" prop="isEffective">
                  <el-select
                    v-model="form.isEffective"
                    filterable
                    allow-create
                    collapse-tags
                    :disabled="!flags"
                    clearable
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
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    :disabled="!flags"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <el-table
                ref="multipleTable"
                :data="form.timeParamList"
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
                  prop="startTime"
                  label="开始时间"
                  align="center"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'timeParamList.' + scope.$index + '.startTime'"
                      :rules="rules.startTime"
                    >
                      <el-time-picker
                        style="width: 150px"
                        :disabled="!flags"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="scope.row.startTime"
                        placeholder="请选择"
                      >
                      </el-time-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center">
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'timeParamList.' + scope.$index + '.endTime'"
                      :rules="rules.endTime"
                    >
                      <el-time-picker
                        style="width: 150px"
                        :disabled="!flags"
                        format="HH:mm"
                        value-format="HH:mm"
                        v-model="scope.row.endTime"
                        placeholder="请选择"
                      >
                      </el-time-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="enableStartTime1"
                  label="有效开始t1"
                  align="center"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="
                        'timeParamList.' + scope.$index + '.enableStartTime1'
                      "
                      :rules="rules.enableStartTime1"
                    >
                      <el-time-picker
                        style="width: 150px"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="!flags"
                        v-model="scope.row.enableStartTime1"
                        placeholder="请选择"
                      >
                      </el-time-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="enableEndTime1"
                  label="有效结束t1"
                  align="center"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="
                        'timeParamList.' + scope.$index + '.enableEndTime1'
                      "
                      :rules="rules.enableEndTime1"
                    >
                      <el-time-picker
                        style="width: 150px"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="!flags"
                        v-model="scope.row.enableEndTime1"
                        placeholder="请选择"
                      >
                      </el-time-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="enableStartTime2"
                  label="有效开始t2"
                  align="center"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="
                        'timeParamList.' + scope.$index + '.enableStartTime2'
                      "
                      :rules="rules.enableStartTime2"
                    >
                      <el-time-picker
                        style="width: 150px"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="!flags"
                        v-model="scope.row.enableStartTime2"
                        placeholder="请选择"
                      >
                      </el-time-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="enableEndTime2"
                  label="有效结束t2"
                  align="center"
                >
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="
                        'timeParamList.' + scope.$index + '.enableEndTime2'
                      "
                      :rules="rules.enableEndTime2"
                    >
                      <el-time-picker
                        style="width: 150px"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="!flags"
                        v-model="scope.row.enableEndTime2"
                        placeholder="请选择"
                      >
                      </el-time-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                  <template scope="scope">
                    <el-form-item
                      label-width="0"
                      :prop="'timeParamList.' + scope.$index + '.remark'"
                      :rules="rules.remark"
                    >
                      <el-input
                        v-model="scope.row.remark"
                        :disabled="!flags"
                        type="input"
                        placeholder="请输入"
                      ></el-input
                    ></el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      :disabled="!flags"
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
          <el-table
            :data="tableDatas"
            style="width: 100%"
            ref="mainTionRef"
            @selection-change="handleSelectionChange($event)"
            :row-key="getRowKey"
          >
            <el-table-column
              type="selection"
              label=""
              width="50"
              align="center"
              :reserve-selection="true"
            >
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
  </div>
</template>

<script>
import { detail, remove, edit } from "@/api/backstage/shiftConfiguration";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { queryMainStationList } from "@/api/organization/allStation";
export default {
  name: "",
  data() {
    return {
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      rules: {
        startTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["input", "change"],
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["input", "change"],
          },
        ],
        enableStartTime1: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["input", "change"],
          },
        ],
        enableEndTime1: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["input", "change"],
          },
        ],
        enableStartTime2: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["input", "change"],
          },
        ],
        enableEndTime2: [
          {
            required: true,
            message: "请选择时间",
            trigger: ["input", "change"],
          },
        ],
        workShiftName: [
          {
            required: true,
            message: "请输入班次名称",
            trigger: ["input", "change"],
          },
        ],
        mainStationName: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: ["input", "change"],
          },
        ],
        attendanceTypeCodeList: [
          {
            required: true,
            message: "请选择出勤类型",
            trigger: ["input", "change"],
          },
        ],
        monthList: [
          {
            required: true,
            message: "请选择月份",
            trigger: ["input", "change"],
          },
        ],
        isEffective: [
          {
            required: true,
            message: "请选择是否有效",
            trigger: ["input", "change"],
          },
        ],
      },
      dialogforms: {
        ownerGroupList: "",
        mainStationPersonName: "",
        mainStationCode: "",
      },
      flags: false,
      flag: true,
      mainStationOptions: [],
      form: {
        mainStationName: [],
        mainStationIdList: [],
        attendanceTypeCodeList: [],
        monthList: [],
        timeCount: 0,
        timeParamList: [
          //   {
          //     startTime: "18:00",
          //     endTime: "18:00",
          //     enableStartTime1: "7:00",
          //     enableEndTime1: "8:00",
          //     enableStartTime2: "17:00",
          //     enableEndTime2: "18:00",
          //     remark: "0725",
          //   },
        ],
        isEffective: "",
        workShiftName: "",
        sort: "",
      },
      choose: [
        { key: "是", id: 1 },
        { key: "否", id: 0 },
      ],
      monthListoption: [
        { key: "1月", id: "1" },
        { key: "2月", id: "2" },
        { key: "3月", id: "3" },
        { key: "4月", id: "4" },
        { key: "5月", id: "5" },
        { key: "6月", id: "6" },
        { key: "7月", id: "7" },
        { key: "8月", id: "8" },
        { key: "9月", id: "9" },
        { key: "10月", id: "10" },
        { key: "11月", id: "11" },
        { key: "12月", id: "12" },
      ],
      attendanceTypeCodeListoption: [
        { key: "缺勤", id: "X" },
        { key: "休息", id: "R" },
        { key: "出勤(正常)", id: "W" },
        { key: "出勤(加班)", id: "WJ" },
        { key: "出勤(值班)", id: "W1" },
      ],
      focusMainDialogVisibles: false,
      tableDatas: [],
      selectList: [],
      pageNum: 1,
      pageSize: 10,
    };
  },
  created() {
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
      console.log(this.mainStationOptions);
    });
  },
  mounted() {
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
      console.log(this.mainStationOptions);
    });
    this.flags = false;
    this.form.timeCount = this.form.timeParamList.length;
    if (this.$route.query.id) {
      detail({ workShiftId: this.$route.query.id }).then((res) => {
        // this.form = res.data.data;
        this.form.workShiftId = res.data.data.id;
        this.form.workShiftName = res.data.data.workShiftName;
        this.form.timeParamList = res.data.data.timeList;
        this.form.monthList = res.data.data.months.split(",");
        this.form.isEffective = res.data.data.isEffective;
        this.form.sort = res.data.data.sort;
        this.form.attendanceTypeCodeList =
          res.data.data.attendanceTypeCodes.split(",");
        this.form.mainStationIdList = res.data.data.mainStationIds.split(",");
        this.form.mainStationName =  res.data.data.mainStationNames;
        this.form.timeCount = this.form.timeParamList.length;
      });
    }
  },
  methods: {
    //删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ workShiftIds: [this.$route.query.id] }).then((r) => {
          if (r.data.code == "200") {
            this.$message({
              message: "删除成功!",
              type: "success",
            });
          } else {
            this.$message.error("删除失败");
          }
          this.$router.push({ path: "./shiftConfiguration" });
        });
      });
    },
    addRow() {
      this.form.timeParamList.push({
        workShiftTimeId: "",
        startTime: "",
        endTime: "",
        enableStartTime1: "",
        enableEndTime1: "",
        enableStartTime2: "",
        enableEndTime2: "",
        remark: "",
      });
      this.form.timeCount = this.form.timeParamList.length;
    },
    filterOptions(value, optionList) {
      let str = [];
      optionList.forEach((res) => {
        value.forEach((v) => {
          if (res.id == v) {
            str.push(res.mainStationName);
          }
        });
      });
      if (str) {
        return str;
      } else {
        return value;
      }
    },
    visibleChange1(val) {
      if (!val) {
        this.searchData();
      }
    },
    handleSelectionChange(val) {
      this.selectList = [];
      this.selectList = val;
    },
    cancel() {
      this.focusMainDialogVisibles = false;
      this.$refs.mainTionRef.clearSelection();
    },
    principalAdds() {
      this.form.mainStationName = [];
      this.form.mainStationIdList = [];
      this.focusMainDialogVisibles = false;
      this.selectList.forEach((v) => {
        this.form.mainStationName.push(v.mainStationName);
        this.form.mainStationIdList.push(v.mainStationId);
      });
      this.$refs.mainTionRef.clearSelection();
    },
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
        this.tableDatas.forEach((ele) => {
          this.form.mainStationIdList.forEach((item) => {
            if (ele.mainStationId == item) {
              this.$refs.mainTionRef.toggleRowSelection(ele, true);
            }
          });
        });
      });
    },
    editInformation() {
      console.log(this.form, "xxxxxxxx");
      this.$refs.form.validate((v) => {
        if (v) {
          edit(this.form).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                message: "编辑成功!",
                type: "success",
              });
              this.$router.push({ path: "./shiftConfiguration" });
            } else {
              this.$message.error("编辑失败");
            }
          });
        }
      });
    },
    handleDelete(index) {
      this.form.timeParamList.splice(index, 1);
      this.form.timeCount = this.form.timeParamList.length;
    },
    getRowKey(row) {
      return row.mainStationId;
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-upload-list__item {
  transition: none !important;
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
</style>
