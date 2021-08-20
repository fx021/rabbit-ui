<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <!-- <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-upload2"
            @click="nameplateUpload"
            >铭牌上传
          </el-button> -->
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
                <el-form-item label="频率" prop="code">
                  <el-select
                    v-model="form.code"
                    collapse-tags
                    clearable
                    :disabled="$route.query.id && !listState"
                    default-first-option
                    placeholder="请选择"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="item in frequencyOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="触发时间"
                  prop="triggerTime"
                  v-if="form.code == 'frequency_day'"
                >
                  <el-time-picker
                    v-model="form.triggerTime"
                    placeholder="任意时间点"
                    format="HH:mm"
                    value-format="HH:mm"
                    :disabled="$route.query.id && !listState"
                  >
                  </el-time-picker>
                </el-form-item>
                <template v-if="form.code == 'frequency_week'">
                  <el-form-item label="触发时间" prop="triggerTime">
                    <el-select
                      v-model="form.triggerTime"
                      collapse-tags
                      clearable
                      :disabled="$route.query.id && !listState"
                      default-first-option
                      placeholder="请选择"
                      @visible-change="visibleChange"
                    >
                      <el-option
                        v-for="item in weekOptions"
                        :key="item.dictKey"
                        :label="item.dictValue"
                        :value="item.dictKey"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="当天时间" prop="dayTime">
                    <el-time-picker
                      v-model="form.dayTime"
                      :disabled="$route.query.id && !listState"
                      placeholder="任意时间点"
                      format="HH:mm"
                      value-format="HH:mm"
                    >
                    </el-time-picker>
                  </el-form-item>
                </template>
                <template v-if="form.code == 'frequency_month'">
                  <el-form-item label="触发日期" prop="triggerTime">
                    <el-select
                      v-model="form.triggerTime"
                      collapse-tags
                      clearable
                      :disabled="$route.query.id && !listState"
                      default-first-option
                      placeholder="请选择"
                      @visible-change="visibleChange"
                    >
                      <el-option
                        v-for="item in 31"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="当天时间" prop="dayTime">
                    <el-time-picker
                      v-model="form.dayTime"
                      placeholder="任意时间点"
                      :disabled="$route.query.id && !listState"
                      format="HH:mm"
                      value-format="HH:mm"
                    >
                    </el-time-picker>
                  </el-form-item>
                </template>
                <template v-if="form.code == 'frequency_season'">
                  <el-form-item label="触发季度" prop="triggerTime">
                    <el-cascader
                      v-model="form.triggerTime"
                      :options="options"
                      :props="{ expandTrigger: 'hover' }"
                      :disabled="$route.query.id && !listState"
                      @change="handleChange"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item label="当天时间" prop="dayTime">
                    <el-time-picker
                      v-model="form.dayTime"
                      placeholder="任意时间点"
                      :disabled="$route.query.id && !listState"
                      format="HH:mm"
                      value-format="HH:mm"
                    >
                    </el-time-picker>
                  </el-form-item>
                </template>
                <template v-if="form.code == 'frequency_year'">
                  <el-form-item label="触发年份" prop="triggerTime">
                    <el-date-picker
                      v-model="form.triggerTime"
                      :disabled="$route.query.id && !listState"
                      type="datetime"
                      format="MM-dd HH:mm"
                      value-format="MM-dd#HH:mm"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    placeholder="请输入内容"
                    :disabled="$route.query.id && !listState"
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
                <el-form-item label="描述" prop="mark">
                  <el-input
                    v-model="form.mark"
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
  </div>
</template>

<script>
import {
  frequencyDetail,
  frequencyAdd,
  frequencyEdit,
  frequencyRemove,
} from "@/api/backstage/baseFrequency";
export default {
  name: "operationBaseFrequency",
  data() {
    return {
      listState: false,
      form: { isEffective: 1, triggerTime: "", dayTime: "" },
      rules: {
        code: [
          {
            required: true,
            message: "请选择频率",
            trigger: "change",
          },
        ],
        triggerTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        dayTime: [
          {
            required: true,
            message: "请选择当天时间",
            trigger: ["input", "change"],
          },
        ],
      },
      frequencyOptions: JSON.parse(
        window.localStorage.getItem("frequencyOptions")
      ),
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
          let triggerTime = "";
          if (data == "new") {
            if (
              this.form.code == "frequency_day" ||
              this.form.code == "frequency_year"
            ) {
              triggerTime = this.form.triggerTime;
            }
            if (
              this.form.code == "frequency_week" ||
              this.form.code == "frequency_month"
            ) {
              triggerTime = this.form.triggerTime + "#" + this.form.dayTime;
            }
            if (this.form.code == "frequency_season") {
              triggerTime =
                this.form.triggerTime[0] +
                "-" +
                this.form.triggerTime[1] +
                "#" +
                this.form.dayTime;
            }
            frequencyAdd({
              triggerTime,
              mark: this.form.mark,
              sort: this.form.sort,
              isEffective: this.form.isEffective,
              code: this.form.code,
            }).then(() => {
              this.$router.push({ path: "./baseFrequency" });
            });
          } else {
            if (
              this.form.code == "frequency_day" ||
              this.form.code == "frequency_year"
            ) {
              triggerTime = this.form.triggerTime;
            }
            if (
              this.form.code == "frequency_week" ||
              this.form.code == "frequency_month"
            ) {
              triggerTime = this.form.triggerTime + "#" + this.form.dayTime;
            }
            if (this.form.code == "frequency_season") {
              let str = "";
              str = this.form.triggerTime[0] + "-" + this.form.triggerTime[1];
              triggerTime = str + "#" + this.form.dayTime;
            }
            frequencyEdit({
              triggerTime,
              id: this.$route.query.id,
              mark: this.form.mark,
              sort: this.form.sort,
              isEffective: this.form.isEffective,
              code: this.form.code,
            }).then(() => {
              this.$router.push({ path: "./baseFrequency" });
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
        frequencyRemove({ idList: [this.$route.query.id] }).then(() => {
          this.$router.push({ path: "./baseFrequency" });
        });
      });
    },
    // 详情
    getFrequencyDetail() {
      frequencyDetail({
        id: this.$route.query.id,
      }).then((res) => {
        console.log(res.data.data);
        this.form = res.data.data;
        if (
          res.data.data.code == "frequency_day" ||
          res.data.data.code == "frequency_year"
        ) {
          this.form.triggerTime = res.data.data.triggerTime;
        }
        if (
          res.data.data.code == "frequency_week" ||
          res.data.data.code == "frequency_month"
        ) {
          this.form.dayTime = res.data.data.triggerTime.split("#")[1];
          this.form.triggerTime = res.data.data.triggerTime.split("#")[0];
        }
        if (res.data.data.code == "frequency_season") {
          this.form.dayTime = res.data.data.triggerTime.split("#")[1];
          this.form.triggerTime = res.data.data.triggerTime.split("#")[0];
          this.form.triggerTime = this.form.triggerTime.split("-");
          console.log(this.form);
        }
      });
    },
    selectChange() {
      this.form.triggerTime = "";
      this.form.dayTime = "";
    },
    handleChange(value) {
      console.log(value);
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