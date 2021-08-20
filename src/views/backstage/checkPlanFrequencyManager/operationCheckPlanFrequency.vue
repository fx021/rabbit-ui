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
            <div class="content" style="border-bottom: 1px solid #fff">
              <div class="title">基础信息</div>
              <div class="basice-box">
                <el-form-item label="频率名称" prop="checkFrequencyName">
                  <el-input
                    v-model="form.checkFrequencyName"
                    placeholder="请输入内容"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
                <el-form-item label="频率" prop="frequencyCode">
                  <el-select
                    v-model="form.frequencyCode"
                    collapse-tags
                    clearable
                    :disabled="$route.query.id && !listState"
                    default-first-option
                    placeholder="请选择"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in frequencyOptions"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="执行次数" prop="size">
                  <el-input
                    v-model="form.size"
                    placeholder="请输入内容"
                    disabled
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
                <el-form-item label="触发时间" prop="triggerTime">
                  <el-input
                    v-model="form.triggerTime"
                    placeholder="请输入内容"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    placeholder="请输入内容"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                  <el-input
                    v-model="form.remark"
                    placeholder="请输入内容"
                    :disabled="$route.query.id && !listState"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="basice-box" style="margin-bottom: 20px; width: auto">
                <el-table
                  ref="multipleTable"
                  :data="form.planFrequencyEffectiveList"
                  tooltip-effect="dark"
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
                    label="计划开始时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == '' || !form.frequencyCode"
                  ></el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="计划开始时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_day'"
                  >
                    <template slot-scope="scope">
                      <el-time-picker
                        v-model="scope.row.startTime"
                        placeholder="任意时间点"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="$route.query.id && !listState"
                        style="width: 100%"
                      >
                      </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="计划开始时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_week'"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.startTime"
                        style="width: 100%"
                        collapse-tags
                        clearable
                        :disabled="$route.query.id && !listState"
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in weekOptions"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="计划开始时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_month'"
                  >
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.startTime"
                        :disabled="$route.query.id && !listState"
                        style="width: 100%"
                        type="month"
                        format="M"
                        value-format="M"
                        placeholder="选择月"
                      >
                      </el-date-picker
                    ></template>
                  </el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="计划开始时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_season'"
                  >
                    <template slot-scope="scope">
                      <el-cascader
                        style="width: 100%"
                        v-model="scope.row.startTime"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        :disabled="$route.query.id && !listState"
                        @change="handleChange"
                      >
                      </el-cascader>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="计划开始时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_year'"
                  >
                    <template slot-scope="scope">
                      <el-date-picker
                        style="width: 100%"
                        v-model="scope.row.startTime"
                        :disabled="$route.query.id && !listState"
                        type="date"
                        format="MM-dd"
                        value-format="MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="计划结束时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == '' || !form.frequencyCode"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="计划结束时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_day'"
                  >
                    <template slot-scope="scope">
                      <el-time-picker
                        v-model="scope.row.endTime"
                        placeholder="任意时间点"
                        format="HH:mm"
                        value-format="HH:mm"
                        :disabled="$route.query.id && !listState"
                        style="width: 100%"
                      >
                      </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="计划结束时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_week'"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.endTime"
                        style="width: 100%"
                        collapse-tags
                        clearable
                        :disabled="$route.query.id && !listState"
                        default-first-option
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in weekOptions"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="计划结束时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_month'"
                  >
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.endTime"
                        :disabled="$route.query.id && !listState"
                        style="width: 100%"
                        type="month"
                        format="M"
                        value-format="M"
                        placeholder="选择月"
                      >
                      </el-date-picker
                    ></template>
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="计划结束时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_season'"
                  >
                    <template slot-scope="scope">
                      <el-cascader
                        style="width: 100%"
                        v-model="scope.row.endTime"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        :disabled="$route.query.id && !listState"
                        @change="handleChange"
                      >
                      </el-cascader>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="计划结束时间"
                    show-overflow-tooltip
                    align="center"
                    v-if="form.frequencyCode == 'frequency_year'"
                  >
                    <template slot-scope="scope">
                      <el-date-picker
                        style="width: 100%"
                        v-model="scope.row.endTime"
                        :disabled="$route.query.id && !listState"
                        type="date"
                        format="MM-dd"
                        value-format="MM-dd"
                        placeholder="选择日期"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="remark"
                    label="备注"
                    show-overflow-tooltip
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="scope.row.remark"
                        :disabled="$route.query.id && !listState"
                        placeholder="请输入内容"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" v-if="!compileShow" width="150">
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
                <div class="add-box" @click="addRow" v-show="!compileShow">
                  <i class="el-icon-plus"></i> 添加行
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  checkPlanDetail,
  checkPlanAdd,
  checkPlanEdit,
  checkPlanRemove,
} from "@/api/backstage/checkPlanFrequency";
import { frequencyQueryList } from "@/api/backstage/baseFrequency";
export default {
  name: "operationCheckPlanFrequency",
  data() {
    return {
      listState: false,
      form: {
        isEffective: 1,
        triggerTime: "",
        frequencyCode: "",
        planFrequencyEffectiveList: [],
      },
      rules: {
        frequencyCode: [
          {
            required: true,
            message: "请选择频率",
            trigger: "change",
          },
        ],
      },
      frequencyOptions: [],
      weekOptions: [
        { dictKey: "monday", dictValue: "星期一" },
        { dictKey: "tuesday", dictValue: "星期二" },
        { dictKey: "wednesday", dictValue: "星期三" },
        { dictKey: "thursday", dictValue: "星期四" },
        { dictKey: "friday", dictValue: "星期五" },
        { dictKey: "saturday", dictValue: "星期六" },
        { dictKey: "sunday", dictValue: "星期日" },
      ],
      options: [
        {
          value: "1",
          label: "第1个月",
          children: [],
        },
        {
          value: "2",
          label: "第2个月",
          children: [],
        },
        {
          value: "3",
          label: "第3个月",
          children: [],
        },
      ],
    };
  },
  mounted() {
    console.log(this.$route.query.id);
    let arr = [];
    for (let i = 1; i <= 31; i++) {
      arr.push({ value: i + "", label: i + "" });
    }
    this.options.forEach((item) => {
      item.children = arr;
    });
    frequencyQueryList({ pageNum: 1, pageSize: 10 }).then((res) => {
      console.log(res.data.data.pageData);
      this.frequencyOptions = res.data.data.pageData;
    });
    if (this.$route.query.id) this.getCheckPlanDetail();
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
          this.form.planFrequencyEffectiveList.forEach((item) => {
            item.frequencyCode = this.form.frequencyCode;
          });
          this.form.size = this.form.planFrequencyEffectiveList.length;
          if (data == "new") {
            checkPlanAdd(this.form).then(() => {
              this.$router.push({ path: "./checkPlanFrequency" });
            });
          } else {
            checkPlanEdit(this.form).then(() => {
              this.$router.push({ path: "./checkPlanFrequency" });
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
        // let planFrequencyEffectiveIds = [];
        // this.form.planFrequencyEffectiveList.forEach((item) => {
        //   planFrequencyEffectiveIds.push(item.id);
        // });
        checkPlanRemove({
          planFrequencyIds: [this.$route.query.id],
          // planFrequencyEffectiveIds,
        }).then(() => {
          this.$router.push({ path: "./checkPlanFrequency" });
        });
      });
    },
    // 详情
    getCheckPlanDetail() {
      checkPlanDetail({
        id: this.$route.query.id,
      }).then((res) => {
        console.log(res.data.data);
        this.form = res.data.data;
        this.form.size = this.form.planFrequencyEffectiveList.length;
      });
    },
    // 删除添加行
    handleDelete(index) {
      this.form.planFrequencyEffectiveList.splice(index, 1);
    },
    selectChange(data) {
      console.log(data);
      this.form.triggerTime = "";
      this.form.planFrequencyEffectiveList = [];
      frequencyQueryList({ code: data, pageNum: 1, pageSize: 10 }).then(
        (res) => {
          this.form.triggerTime = res.data.data.pageData[0].triggerTime;
          this.form.frequencyId = res.data.data.pageData[0].id;
        }
      );
    },
    handleChange(value) {
      console.log(value);
    },
    // 点击添加行按钮
    addRow() {
      if (this.form.frequencyCode == "" || !this.form.frequencyCode)
        return this.$message.warning("请选择频率");
      if (this.form.triggerTime == "" || !this.form.triggerTime)
        return this.$message.warning("没有对应的触发时间");
      this.form.planFrequencyEffectiveList.push({
        startTime: "",
        endTime: "",
        remark: "",
      });
      this.form.size = this.form.planFrequencyEffectiveList.length;
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
          // width: 100%;
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