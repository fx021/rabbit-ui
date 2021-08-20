<template>
  <div class="operation-automatic-allocation">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
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
          <!-- <el-button
            type="warning"
            size="small"
            plain
            icon="el-icon-upload2"
            v-if="$route.query.id"
            @click="handleExport"
            >导出
          </el-button> -->
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
                <el-form-item label="名称：" prop="title">
                  <el-input
                    v-model="form.title"
                    placeholder="请输入内容"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属组织：" prop="mainStationName">
                  <el-input
                    v-model="form.mainStationName"
                    placeholder="请选择"
                    @focus="focusMainStation"
                    :disabled="$route.query.id && !listState"
                    ref="mainStation"
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备：" prop="positionNameList">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="form.positionNameList"
                    placement="top"
                    :disabled="!form.positionNameList"
                  >
                    <el-input
                      v-model="form.positionNameList"
                      placeholder="请选择"
                      ref="equipmentRef"
                      :disabled="$route.query.id && !listState"
                      clearable
                      @focus="focusEquipment"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="出勤类型：" prop="attendanceTypeName">
                  <el-input
                    v-model="form.attendanceTypeName"
                    placeholder="请选择"
                    ref="attendanceRef"
                    clearable
                    :disabled="$route.query.id && !listState"
                    @focus="attendanceType"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否有效：" prop="isEffective">
                  <el-radio-group
                    v-model="form.isEffective"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    v-model="form.remark"
                    placeholder="请输入内容"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 设备 -->
    <el-dialog
      title="选择设备"
      :visible.sync="equipmentVisible"
      v-if="equipmentVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1150px"
      :top="'8vh'"
    >
      <Position
        ref="positionRef"
        :Single="false"
        :mainStationIdList="form.mainStationId ? [form.mainStationId] : []"
        :subStationIdList="[]"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEquipment">取 消</el-button>
        <el-button type="primary" @click="equipmentAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 出勤类型 -->
    <el-dialog
      title="选择出勤类型"
      :visible.sync="attendanceVisible"
      v-if="attendanceVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1150px"
      :top="'8vh'"
    >
      <Attendance ref="attendanceType" :Single="true" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAttendance">取 消</el-button>
        <el-button type="primary" @click="attendanceAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 所属组织 -->
    <el-dialog
      title="选择所属组织"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1080px"
      :top="'10vh'"
    >
      <MainStation ref="mainStationText" :Single="true" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelMainStation">取 消</el-button>
        <el-button type="primary" @click="mainStationAdd">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  distributeRemove,
  distributeExporDetail,
  distributeAdd,
  distributeExporEdit,
} from "@/api/taskApplication/automaticAllocation";
import Position from "@/components/dialog/postionDialogs.vue";
import MainStation from "@/components/dialog/mainStationDialog.vue";
import Attendance from "@/components/dialog/attendanceDialog.vue";
export default {
  name: "operationAutomaticAllocation",
  components: { Position, Attendance, MainStation },
  data() {
    return {
      listState: false,
      form: {
        title: "",
        mainStationName: "",
        positionNameList: "",
        positionIdList: [],
        attendanceTypeName: "",
        isEffective: 1,
        remark: "",
        positionList: [],
      },
      rules: {
        title: [
          {
            required: true,
            message: "请选择名称",
            trigger: "input",
          },
        ],
        mainStationName: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
        positionNameList: [
          {
            required: true,
            message: "请选择设备",
            trigger: "change",
          },
        ],
        attendanceTypeName: [
          {
            required: true,
            message: "请选择出勤类型",
            trigger: "change",
          },
        ],
      },
      attendanceVisible: false, // 出勤弹窗
      equipmentVisible: false,
      focusMainDialogVisible: false,
      frequencyOptions: JSON.parse(
        window.localStorage.getItem("frequencyOptions")
      ),
    };
  },
  mounted() {
    if (this.$route.query.id) this.getFrequencyDetail();
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
            distributeAdd({
              title: this.form.title, //派发标题
              mainStationId: this.form.mainStationId, //组织id
              attendanceTypeCode: this.form.attendanceTypeCode, //出勤类型
              isEffective: this.form.isEffective, //是否有效
              remark: this.form.remark, //备注
              positionIdList: this.form.positionIdList, //设备位置id
            }).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({
                name: "自动派发",
                params: { refresh: true },
              });
            });
          } else {
            distributeExporEdit({
              distributeId: this.$route.query.id,
              title: this.form.title, //派发标题
              mainStationId: this.form.mainStationId, //组织id
              attendanceTypeCode: this.form.attendanceTypeCode, //出勤类型
              isEffective: this.form.isEffective, //是否有效
              remark: this.form.remark, //备注
              positionIdList: this.form.positionIdList, //设备位置id
            }).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({
                name: "自动派发",
                params: { refresh: true },
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
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        distributeRemove({ distributeIdList: [this.$route.query.id] }).then(() => {
          this.$router.$avueRouter.closeTag();
          this.$router.push({ name: "自动派发", params: { refresh: true } });
        });
      });
    },
    // 详情
    getFrequencyDetail() {
      distributeExporDetail({
        distributeId: this.$route.query.id,
      }).then((res) => {
        console.log(res.data.data);
        this.form = res.data.data;
        let nameList = [];
        let idList = [];
        res.data.data.positionList.forEach((item) => {
          nameList.push(item.positionName);
          idList.push(item.positionId);
        });
        this.form.positionIdList = idList;
        this.form.positionNameList = nameList;
      });
    },
    selectChange() {},
    handleChange(value) {
      console.log(value);
    },
    // 所属组织弹窗
    focusMainStation() {
      this.focusMainDialogVisible = true;
      this.$refs.mainStation.blur();
    },
    // 所属组织弹窗 - 取消
    cancelMainStation() {
      this.focusMainDialogVisible = false;
    },
    // 所属组织弹窗 - 添加
    mainStationAdd() {
      this.focusMainDialogVisible = false;
      console.log(this.$refs["mainStationText"].chooseRedio);
      this.form.mainStationName =
        this.$refs["mainStationText"].chooseRedio.mainStationName;
      this.form.mainStationId =
        this.$refs["mainStationText"].chooseRedio.mainStationId;
    },
    // 出勤类型弹窗
    attendanceType() {
      this.attendanceVisible = true;
      this.$refs.attendanceRef.blur();
    },
    // 出勤类型弹窗 - 取消
    cancelAttendance() {
      this.attendanceVisible = false;
    },
    // 出勤类型弹窗 - 添加
    attendanceAdd() {
      this.attendanceVisible = false;
      console.log(this.$refs["attendanceType"].chooseRedio);
      this.form.attendanceTypeName =
        this.$refs["attendanceType"].chooseRedio.attendanceTypeName;
      this.form.attendanceTypeCode =
        this.$refs["attendanceType"].chooseRedio.attendanceTypeCode;
    },
    // 设备名称弹窗
    focusEquipment() {
      this.equipmentVisible = true;
      this.$refs.equipmentRef.blur();
    },
    // 设备名称弹窗 - 添加
    equipmentAdd() {
      this.equipmentVisible = false;
      console.log(this.$refs["positionRef"].choosePosition);
      let arrName = [];
      let arrId = [];
      this.$refs["positionRef"].choosePosition.forEach((item) => {
        arrName.push(item.positionName);
        arrId.push(item.id);
      });
      console.log(arrName);
      this.form.positionNameList = arrName.toString();
      this.form.positionIdList = arrId;
    },
    // 设备名称弹窗 - 取消
    cancelEquipment() {
      this.equipmentVisible = false;
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
.operation-automatic-allocation {
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
          width: 100%;
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
          width: 100%;
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