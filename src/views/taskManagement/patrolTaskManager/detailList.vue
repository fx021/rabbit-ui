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
                巡检任务明细
                <span
                  id="down"
                  :class="{ arrowTransform: !flag, arrowTransformReturn: flag }"
                  @click="flag = !flag"
                >
                  <i class="el-icon-arrow-down"></i>
                </span>
              </div>
              <div class="basice-box">
                <el-form-item label="设备" prop="positionName" v-show="flag">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.positionName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="巡检类型"
                  prop="checkItemType"
                  v-show="flag"
                >
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.checkItemType"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="计划开始时间"
                  prop="startTime"
                  v-show="flag"
                >
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.startTime"
                  ></el-input>
                </el-form-item>
                <el-form-item label="计划结束时间" prop="endTime" v-show="flag">
                  <el-input v-model="form.endTime" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="巡检执行人员"
                  prop="checkState"
                  v-show="flag"
                >
                  <el-input v-model="form.exeUseNames" disabled></el-input>
                </el-form-item>
                <el-form-item label="巡检耗时" prop="" v-show="flag">
                  <el-input v-model="time" disabled></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
        >
          <el-table-column label="序号" type="index" width="50" align="center">
          </el-table-column>
          <el-table-column
            prop="checkContent"
            label="巡检内容"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="realStartTime"
            label="实际开始时间"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="realEndTime"
            label="实际结束时间"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="checkResult"
            label="巡检结果"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.checkResult | filterOption(checkResultOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="附件"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <el-tag
                  v-for="item in scope.row.imgList"
                  :key="item"
                  closable
                  @click="handlePictureCardPreview(item)"
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
            </template>
          </el-table-column>
          <el-table-column
            prop="updateByUserName"
            label="数值记录"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <el-tag @click="lookRecord(scope.row)">查看</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注说明"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      title="数值记录"
      :visible.sync="focusMainDialogVisiblet"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-table">
          <el-table :data="tableDatats" style="width: 100%">
            <el-table-column
              label="序号"
              type="index"
              width="50"
            ></el-table-column>
            <el-table-column label="名称" prop="daName" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.daName" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.unit" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="daValue" label="值" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.daValue" disabled></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisiblet = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  queryChecktaskDetailList,
  queryChecktaskItemList,
  queryChecktaskDatagList,
} from "@/api/taskManagement/patrolTask";
import { fileDownload } from "@/api/upload/upload";
// import { getFiles,fileDownload} from "@/api/upload/upload";
export default {
  name: "operationStaging",
  data() {
    return {
      imgDialogVisible: false,
      dialogImageUrl: "",
      focusMainDialogVisiblet: false,
      flag: true,
      checkCategoryOptions: JSON.parse(
        window.localStorage.getItem("checkCategoryOptions")
      ),
      checkResultOptions: JSON.parse(
        window.localStorage.getItem("checkResultOptions")
      ),
      listState: false,
      form: {
        isEffective: 1,
        subStationId: "",
        subStationName: "",
      },
      principaNum: "",
      tableData: [],
      tableDatats: [],
      currentRowId: "",
      pageNum: 1,
      pageSize: 10,
      time: "",
    };
  },
  filters: {
    filterOption: function (value, optionList) {
      let str = optionList.find((res) => {
        return res.dictKey == value;
      });
      if (str) {
        return str.dictValue;
      } else {
        return value;
      }
    },
  },
  mounted() {
    if (this.$route.query.id) this.getDetail();
  },
  methods: {
    // 查看附件
    // loookEnclosure(id, index) {
    //   getImage({
    //     businessId: id, //业务Id联图片  比如设备分组类别的设备状态标识表主键ID
    //     businessTypeList: ["check_task_item_img"], //图片业务类型
    //   }).then((res) => {
    //     this.tableData[index].imgList = res.data.data;
    //     console.log(res.data.data, "xx");
    //   });
    // },
    //查看数值记录
    lookRecord(row) {
      queryChecktaskDatagList({ checkTaskItemId: row.id }).then((res) => {
        console.log(res.data.data, "ss");
        this.tableDatats = res.data.data;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
      });
      this.focusMainDialogVisiblet = true;
    },
    getTime(time1, time2) {
      time1 = new Date(time1);
      time2 = new Date(time2);
      var runTime = ((time1.getTime() - time2.getTime()) / 1000 / 60).toFixed(
        3
      );
      this.time = runTime;
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
      queryChecktaskDetailList({ checkPlanMainId: this.$route.query.id }).then(
        (res) => {
          res.data.data.pageData.forEach((v) => {
            if (v.id == this.$route.query.id) {
              this.form = v;
              this.getTime(v.realEndTime, v.realStartTime);
            }
          });
          this.form.checkItemType = this.filterOptions(
            this.form.checkItemType,
            this.checkCategoryOptions
          );
        }
      );
      queryChecktaskItemList({ checkTaskDetailId: this.$route.query.id }).then(
        (res) => {
          this.tableData = res.data.data.pageData;
          this.tableData.forEach((item) => {
            if (item.imgList) {
              item.imgList.forEach((item) => {
                let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
                if (
                  regular.test(
                    item.fileName.split(".")[
                      item.fileName.split(".").length - 1
                    ]
                  )
                ) {
                  item.url = this.imgUrl + item.fileId;
                } else {
                  item.url = "./img/file1.png";
                }
              });
            }
          });
          // console.log(res.data.data.pageData[0].imgList, "99999999999");
          this.pageNum = res.data.data.pageNum;
          this.pageSize = res.data.data.pageSize;
          this.total = res.data.data.total;
        }
      );
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
        console.log(file);
        this.dialogImageUrl = file.url;
        this.imgDialogVisible = true;
      }
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
