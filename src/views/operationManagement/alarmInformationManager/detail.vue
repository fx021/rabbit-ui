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
                <el-form-item label="设备类型" prop="equipmentType">
                  <el-select
                    v-model="form.equipmentType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    :disabled="!flags"
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in equipmentTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警信息" prop="alarmInformation">
                  <el-input
                    style="width: 217px"
                    v-model="form.alarmInformation"
                    :disabled="!flags"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="告警类别" prop="alarmCategory">
                  <el-select
                    v-model="form.alarmCategory"
                    :disabled="!flags"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in alarmCategoryOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型" prop="warningType">
                  <el-select
                    v-model="form.warningType"
                    :disabled="!flags"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in warningTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警级别" prop="warningLevel">
                  <el-select
                    v-model="form.warningLevel"
                    :disabled="!flags"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in warningLevelOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="告警编码" prop="alarmCode">
                  <el-input
                    style="width: 217px"
                    v-model="form.alarmCode"
                    :disabled="!flags"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否有效：" prop="isEffective">
                  <el-select
                    v-model="form.isEffective"
                    filterable
                    :disabled="!flags"
                    allow-create
                    collapse-tags
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
                    style="width: 217px"
                    v-model="form.sort"
                    :disabled="!flags"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入"
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
  edit,
  remove,
  queryConfigureList,
} from "@/api/operationManagement/alarmInformationConfiguration";
export default {
  name: "",
  data() {
    return {
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions") //设备类型
      ),
      alarmCategoryOptions: JSON.parse(
        window.localStorage.getItem("alarmCategoryOptions") //告警类别
      ),
      warningTypeOptions: JSON.parse(
        window.localStorage.getItem("warningTypeOptions") //告警类型
      ),
      warningLevelOptions: JSON.parse(
        window.localStorage.getItem("warningLevelOptions") //告警级别
      ),
      flag: true,
      flags: false,
      form: {
        isEffective: "",
        alarmInformation: "",
        sort: "",
      },
      choose: [
        { key: "是", id: "1" },
        { key: "否", id: "0" },
      ],
      rules: {
        equipmentType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "change" }],
        alarmInformation: [
          { required: true, message: "请输入告警信息", trigger: "change" },
        ],
        alarmCategory: [
          { required: true, message: "请选择告警类别", trigger: "change" },
        ],
        warningType: [
          { required: true, message: "请选择告警类型", trigger: "change" },
        ],
        warningLevel: [
          { required: true, message: "请选择告警级别", trigger: "change" },
        ],
        alarmCode: [
          { required: true, message: "请输入告警编码", trigger: "change" },
        ],
        isEffective: [
          { required: true, message: "请选择是否有效", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.getQueryDetail();
    }
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
      queryConfigureList({ idList: [this.$route.query.id] }).then((res) => {
        console.log(res.data.data.pageData[0], "xxxx");
        this.form = res.data.data.pageData[0];
        this.form.isEffective = this.form.isEffective == 1 ? "1" : "0";
      });
    },
    //删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ idList: [this.$route.query.id] }).then(() => {
          this.$router.push({ path: "./alarmInformationConfiguration" });
        });
      });
    },
    //编辑
    editInformation() {
      this.$refs.form.validate((v) => {
        if (v) {
          edit({
            id: this.$route.query.id,
            alarmInformation: this.form.alarmInformation, //告警信息
            alarmCategory: this.form.alarmCategory, //告警类别
            equipmentType: this.form.equipmentType, //设备类型
            warningType: this.form.warningType, //告警类型
            warningLevel: this.form.warningLevel, //告警级别
            alarmCode: this.form.alarmCode, //告警编码
            isEffective: this.form.isEffective, //告警信息
            sort: this.form.sort,
          }).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                message: "编辑成功!",
                type: "success",
              });
              this.$router.push({ path: "./alarmInformationConfiguration" });
            } else {
              this.$message.error("编辑失败");
            }
          });
        }
      });
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
