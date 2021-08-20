<template>
  <div class="operation-staging">
    <el-card class="box-card" style="margin-bottom: 26px">
      <div class="details-title">
        <div class="right">
          <!-- <el-button
            type="primary"
            size="small"
            plain
            v-show="!flags"
            icon="el-icon-plus"
            @click="flags = true"
            >编辑
          </el-button> -->
        </div>
      </div>
      <div class="main">
        <el-form
          ref="forms"
          :model="forms"
          :rules="rules"
          label-width="110px"
          label-position="right"
        >
          <div class="basics">
            <div class="content">
              <div class="title">
                巡检任务明细
                <!-- <span
                  id="down"
                  :class="{ arrowTransform: !flag, arrowTransformReturn: flag }"
                  @click="flag = !flag"
                >
                  <i class="el-icon-arrow-down"></i>
                </span> -->
              </div>
              <div class="basice-box">
                <el-form-item label="标题:" prop="title">
                  <el-input v-model="forms.title" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请编号:" prop="applyNo">
                  <el-input disabled v-model="forms.applyNo"></el-input>
                </el-form-item>
                <el-form-item label="所属组织" prop="mainStationId">
                  <el-select
                    v-model="forms.mainStationId"
                    filterable
                    allow-create
                    collapse-tags
                    disabled
                    default-first-option
                    placeholder="请选择"
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
                <el-form-item label="任务状态：" prop="taskStatus">
                  <el-select
                    v-model="forms.taskStatus"
                    disabled
                    placeholder="请选择"
                    multiple
                  >
                    <el-option
                      v-for="item in taskStateOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备位置编码:">
                  <el-input v-model="forms.positionCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="延期时间:" prop="delayTime">
                  <el-date-picker
                    v-model="forms.delayTime"
                    disabled
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="创建人:">
                  <el-input
                    v-model="forms.createByUserName"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="创建时间:">
                  <el-date-picker
                    v-model="forms.createTime"
                    disabled
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="basice-box">
                <el-form-item label="原因:" prop="reason">
                  <el-input
                    type="textarea"
                    v-model="forms.reason"
                    disabled
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="basics">
            <div class="content">
              <div class="title">任务流过程</div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryDetail, situation } from "@/api/taskApplication/patrolInspection";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  props: {
    processInstanceId: String,
  },
  name: "",
  data() {
    return {
      taskStateOptions: JSON.parse(
        window.localStorage.getItem("taskStateOptions")
      ),
      forms: {
        taskStatus:[]
      },
      mainStationOptions: [],
      rules: {},
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.getQueryDetail();
    } else {
      queryDetail({ processInstanceId: this.processInstanceId }).then((res) => {
        this.forms = res.data.data;
        this.forms.taskStatus = this.forms.taskStatus.split(",");
        console.log(this.forms.taskStatus,'xxxxxxxxx====');
      });
    }
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
  },
  methods: {
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
    getQueryDetail() {
      queryDetail({ id: this.$route.query.id }).then((res) => {
        this.forms = res.data.data;
        this.forms.taskStatus = this.forms.taskStatus.split(",");
      });
    },
    afterBtnClick(code) {
      if (code == "agreeBtnCode") {
        situation({
          taskId: this.$route.query.taskId,
          processInstanceId: this.processInstanceId,
          auditStatus: "1",
          updateStatus: this.forms.updateStatus,
          commet: "同意",
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            // this.$router.back();
            this.$router.push("/work/todo");
          }
        });
        console.log("res");
      } else if (code == "disagreeBtnCode") {
        situation({
          taskId: this.$route.query.taskId,
          processInstanceId: this.processInstanceId,
          auditStatus: "0",
          updateStatus: this.forms.updateStatus,
          commet: "不同意",
        }).then((res) => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            // this.$router.back();
            this.$router.push("/work/todo");
          }
        });
      }
    },
    //编辑
    // editInformation() {
    //   this.$refs.form.validate((v) => {
    //     if (v) {
    //       edit({
    //         id: this.$route.query.id,
    //         alarmInformation: this.form.alarmInformation, //告警信息
    //         alarmCategory: this.form.alarmCategory, //告警类别
    //         equipmentType: this.form.equipmentType, //设备类型
    //         warningType: this.form.warningType, //告警类型
    //         warningLevel: this.form.warningLevel, //告警级别
    //         alarmCode: this.form.alarmCode, //告警编码
    //         isEffective: this.form.isEffective, //告警信息
    //         sort: this.form.sort,
    //       }).then((res) => {
    //         if (res.data.code == "200") {
    //           this.$message({
    //             message: "编辑成功!",
    //             type: "success",
    //           });
    //           this.$router.push({ path: "./alarmInformationConfiguration" });
    //         } else {
    //           this.$message.error("编辑失败");
    //         }
    //       });
    //     }
    //   });
    // },
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
