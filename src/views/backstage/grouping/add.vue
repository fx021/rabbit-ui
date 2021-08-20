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
                  <th><span style="color: red">*</span>类别名称</th>
                  <td>
                    <el-form-item prop="groupTypeName">
                      <el-input v-model="form.groupTypeName"></el-input>
                    </el-form-item>
                  </td>
                  <th><span style="color: red">*</span>排序号</th>
                  <td>
                    <el-form-item prop="sort">
                      <el-input
                        v-model="form.sort"
                        oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                      ></el-input>
                    </el-form-item>
                  </td>
                  <th><span style="color: red">*</span>是否有效</th>
                  <td>
                    <el-form-item prop="isEffective">
                      <el-radio v-model="form.isEffective" :label="1"
                        >有效</el-radio
                      >
                      <el-radio v-model="form.isEffective" :label="0"
                        >无效</el-radio
                      >
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">设备状态标识</div>
              <el-table
                ref="multipleTable"
                :data="form.stateImageRequestList"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column
                  label="序号"
                  type="index"
                  width="50"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="isEffective"
                  label="是否启用"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isEffective"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleEffChange(scope.row)"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="stateCode"
                  label="状态标识"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">
                    {{ tagFormat(scope.row.stateCode) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="file"
                  label="展示附件"
                  show-overflow-tooltip
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :auto-upload="false"
                      :on-change="
                        (file, fileList) =>
                          handleChange(file, fileList, scope.row)
                      "
                    >
                      <span v-if="scope.row.fileId" style="position: relative;">
                        <img :src="scope.row.link" class="avatar" />
                        <span class="btns">
                          <span
                            class="item-preview"
                            @click.stop="handlePictureCardPreview(scope.row)"
                          >
                            <i class="el-icon el-icon-zoom-in"></i>
                          </span>
                          <span
                            class="item-delete"
                            @click.stop="handleRemove(scope.row)"
                          >
                            <i class="el-icon el-icon-delete"></i>
                          </span>
                        </span>
                      </span>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      style="color: #f56c6c"
                      icon="el-icon-delete"
                      @click="handleEdit(scope.$index, scope.row)"
                      >编辑</el-button
                    >
                  </template>
                </el-table-column> -->
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 预览图片弹窗 -->
    <el-dialog :visible.sync="imgDialogVisible" width="600px" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { add } from "@/api/backstage/grouping.js";
import { imgUpload } from "@/api/upload/upload";
export default {
  name: "GroupAdd",
  data() {
    return {
      form: {
        isEffective: 1,
        groupTypeName: "",
        sort: "",
        stateImageRequestList: [
          {
            sort: 1,
            isEffective: 0,
            stateCode: "-1",
            fileId: "",
            link: ""
          },
          {
            sort: 2,
            isEffective: 0,
            stateCode: "0",
            fileId: "",
            link: ""
          },
          { sort: 3, isEffective: 0, stateCode: "1", fileId: "", link: "" },
          {
            sort: 4,
            isEffective: 0,
            stateCode: "2",
            fileId: "",
            link: ""
          },
          { sort: 5, isEffective: 0, stateCode: "3", fileId: "", link: "" },
          { sort: 6, isEffective: 0, stateCode: "4", fileId: "", link: "" },
          { sort: 7, isEffective: 0, stateCode: "5", fileId: "", link: "" }
        ]
      },
      stateList: {
        "-1": "图标",
        "0": "正常运行",
        "1": "指标异常",
        "2": "故障停机",
        "3": "设备告警",
        "4": "通讯故障",
        "5": "通讯故障或设备停机"
      },
      rules: {
        groupTypeName: [
          { required: true, message: "请输入类别名称", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }]
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogImageUrl: "",
      imgDialogVisible: false
    };
  },
  mounted() {},
  methods: {
    // 新建
    compile() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let param = {},
            isRequired = false;
          Object.assign(param, this.form);
          param.stateImageRequestList.forEach(ele => {
            if (ele.isEffective && !ele.fileId) {
              return (isRequired = true);
            }
          });
          if (isRequired) {
            return this.$message.error(
              "设备状态标识若启用则必须上传 “展示附件”"
            );
          }
          add(param).then(() => {
            this.$message.success("新建成功");
            this.$router.push({
              name: "分组类别",
              params: { refresh: true }
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 状态标识
    tagFormat(tag) {
      return this.stateList[tag];
    },
    handleEffChange(row) {
      let text = row.isEffective === 1 ? "启用" : "停用";
      this.$confirm("确认要" + text + "该状态标识?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(function() {
        row.isEffective = row.isEffective === 1 ? 0 : 1;
      });
    },
    // 添加图片
    handleChange(file, fileList, row) {
      imgUpload(file.raw).then(res => {
        row.fileId = res.data.data.fileId;
        row.link = this.imgUrl + res.data.data.fileId;
      });
    },
    // 图片删除
    handleRemove(row) {
      this.$confirm("确认要删除该附件?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          row.fileId = "";
          row.link = "";
        })
        .catch(() => {
          return false;
        });
    },
    // 图片预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.link;
      this.imgDialogVisible = true;
    }
  }
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
              }
            }
          }
        }
      }
    }
  }
}
.new-details {
  .box-card {
    height: calc(100vh - 124px);
    overflow: auto;
  }
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
                background-color: #ffffff;
              }
              /deep/.el-input.is-disabled .el-input__inner {
                background-color: #ffffff;
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
              color: #23a92a;
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
        .avatar-uploader /deep/.el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader /deep/.el-upload:hover {
          border-color: #23a92a;
          .btns {
            opacity: 1;
            .item-preview {
              margin-right: 6px;
            }
            .el-icon {
              font-size: 18px;
              color: #333;
              font-weight: bold;
            }
          }
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
        }
        .avatar {
          width: 50px;
          height: 50px;
          display: block;
        }
        .btns {
          opacity: 0;
          position: absolute;
          top: 20px;
          left: -22px;
        }
      }
      /deep/.el-table th {
        color: #333;
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
        color: #23a92a;
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
                background-color: #ffffff;
              }
              /deep/.el-input.is-disabled .el-input__inner {
                background-color: #ffffff;
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
