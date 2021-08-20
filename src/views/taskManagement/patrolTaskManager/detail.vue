<template>
  <div class="operation-staging">
    <el-card class="box-card">
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
              <div class="title">
                基础信息
                <span
                  id="down"
                  :class="{ arrowTransform: !flag, arrowTransformReturn: flag }"
                  @click="flag = !flag"
                >
                  <i class="el-icon-arrow-down"></i>
                </span>
              </div>
              <div class="basice-box">
                <el-form-item label="标题" prop="taskName" v-show="flag">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.taskName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="所属组织"
                  prop="mainStationId"
                  v-show="flag"
                >
                  <el-select
                    v-model="form.mainStationId"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    :disabled="$route.query.id && !listState"
                    default-first-option
                    placeholder="请选择"
                    @change="handleChangeMainStation"
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
                <el-form-item label="所属计划" prop="planCode" v-show="flag">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.planCode"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="巡检任务编号"
                  prop="taskCode"
                  v-show="flag"
                >
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.taskCode"
                  ></el-input>
                </el-form-item>
                <el-form-item label="计划分类" prop="planType" v-show="flag">
                  <el-input v-model="form.planType" disabled></el-input>
                </el-form-item>
                <el-form-item label="巡检状态" prop="checkState" v-show="flag">
                  <el-input v-model="form.checkState" disabled></el-input>
                </el-form-item>
                <el-form-item label="执行状态" prop="exeState" v-show="flag">
                  <el-input v-model="form.exeState" disabled></el-input>
                </el-form-item>
                <el-form-item label="任务状态" prop="taskState" v-show="flag">
                  <el-input v-model="form.taskState" disabled></el-input>
                </el-form-item>
                <el-form-item label="巡检结果" prop="checkResult" v-show="flag">
                  <el-input v-model="form.checkResult" disabled></el-input>
                </el-form-item>
                <el-form-item label="派发状态" prop="assignState" v-show="flag">
                  <el-input v-model="form.assignState" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="巡检人员"
                  v-show="flag"
                >
                  <el-input v-model="updateByUserName" disabled></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="content">
              <div class="title">任务清单</div>
              <Task ref="task" @func="getMsgFormSon" :title="form.taskName" :mainStationId="form.mainStationId"></Task>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryChecktaskList } from "@/api/taskManagement/patrolTask";
import Task from "@/views/taskManagement/patrolTaskManager/taskComponent";
import { querySubStationList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  name: "operationStaging",
  components: { Task },
  data() {
    return {
      updateByUserName:'',
      flag: true,
      planTypeOptions: JSON.parse(
        window.localStorage.getItem("planTypeOptions")
      ),
      checkStateOptions: JSON.parse(
        window.localStorage.getItem("checkStateOptions")
      ),
      exeStateOptions: JSON.parse(
        window.localStorage.getItem("exeStateOptions")
      ),
      taskStateOptions: JSON.parse(
        window.localStorage.getItem("taskStateOptions")
      ),
      checkResultOptions: JSON.parse(
        window.localStorage.getItem("checkResultOptions")
      ),
      assignStateOptions: JSON.parse(
        window.localStorage.getItem("assignStateOptions")
      ),
      frequencyOptions: JSON.parse(
        window.localStorage.getItem("frequencyOptions")
      ),
      listState: false,
      form: {
        isEffective: 1,
        subStationId: "",
        subStationName: "",
      },
      rules: {
        mainStationId: [
          { required: true, message: "请输入所属组织", trigger: "change" },
        ],
        areaName: [
          { required: true, message: "请输入方阵名称", trigger: "blur" },
        ],
        areaCode: [
          { required: true, message: "请输入方阵编码", trigger: "blur" },
        ],
        subStationName: [
          {
            required: true,
            message: "请输入所属子期",
            trigger: ["change"],
          },
        ],
      },
      focusMainDialogVisible: false,
      principaNum: "",
      tableData: [],
      changeRediod: {},
      dialogform: {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      currentRowId: "",
      mainStationOptions: [],
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      pageNum: 1,
      pageSize: 10,
    };
  },
  mounted() {
    if (this.$route.query.id) this.getDetail();
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
  },
  methods: {
    getMsgFormSon(val){
      this.updateByUserName=val;
    },
    // 修改组织-清空子期
    handleChangeMainStation() {
      this.form.subStationName = "";
    },
    //子期弹窗
    focusMainStation(num) {
      this.principaNum = num;
      this.$refs.mainStation0.blur();
      if (!this.form.mainStationId)
        return this.$message.warning("请先选择所属组织");
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = true;
        this.getQuerySubStationList({
          mainStationIdList: [this.form.mainStationId],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
    },
    getQuerySubStationList(data) {
      console.log(data);
      querySubStationList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 查询
    searchData() {
      this.getQuerySubStationList({
        mainStationIdList: [this.form.mainStationId],
        companyList: this.dialogform.companyList,
        subStationCode: this.dialogform.subStationCode,
        subStationPersonName: this.dialogform.subStationPersonName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 表格单选
    changeRedio(event, row) {
      console.log("row", row);
      this.changeRediod = row;
    },
    // 添加
    principalAdd() {
      this.focusMainDialogVisible = false;
      this.form.subStationName = this.changeRediod.subStationName;
      this.form.subStationId = this.changeRediod.id;
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
    // 详情
    getDetail() {
      queryChecktaskList({ id: this.$route.query.id }).then((res) => {
        this.form = res.data.data.pageData[0];
        this.form.planType = this.filterOptions(
          this.form.planType,
          this.planTypeOptions
        );
        this.form.checkState = this.filterOptions(
          this.form.checkState,
          this.checkStateOptions
        );
        this.form.exeState = this.filterOptions(
          this.form.exeState,
          this.exeStateOptions
        );
        this.form.taskState = this.filterOptions(
          this.form.taskState,
          this.taskStateOptions
        );
        this.form.checkResult = this.filterOptions(
          this.form.checkResult,
          this.checkResultOptions
        );
        this.form.assignState = this.filterOptions(
          this.form.assignState,
          this.assignStateOptions
        );
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
  },
};
</script>

<style lang="scss" scoped>
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
