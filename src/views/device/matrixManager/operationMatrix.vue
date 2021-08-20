<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-document-checked"
            @click="mapPlantArea"
            >方阵展示
          </el-button>
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
            <div class="content">
              <div class="title">基础信息</div>
              <div class="basice-box">
                <el-form-item label="所属组织" prop="mainStationId">
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
                <el-form-item label="所属子期" prop="subStationName">
                  <el-input
                    v-model="form.subStationName"
                    placeholder="请选择"
                    :disabled="$route.query.id && !listState"
                    @focus="focusMainStation(0)"
                    ref="mainStation0"
                  ></el-input>
                </el-form-item>
                <!--//! 1）方阵名称、方阵编码入库校验唯一 -->
                <el-form-item label="方阵名称" prop="areaName">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.areaName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="方阵编码" prop="areaCode">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.areaCode"
                    placeholder="请输入内容"
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
                <div style="margin-left: -10px">
                  <el-form-item label="描述">
                    <el-form-item>
                      <el-input
                        :disabled="$route.query.id && !listState"
                        v-model="form.mark"
                        type="textarea"
                        :autosize="{ minRows: 2 }"
                        placeholder="请输入"
                      ></el-input>
                    </el-form-item>
                  </el-form-item>
                </div>
                <el-form-item label="修改人" prop="updateByUserName">
                  <el-input v-model="form.updateByUserName" disabled></el-input>
                </el-form-item>
                <el-form-item label="修改时间" prop="updateTime">
                  <el-date-picker
                    v-model="form.updateTime"
                    disabled
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 所属子期 -->
    <el-dialog
      title="选择所属子期"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogform.subStationIdList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChange"
              >
                <el-option
                  v-for="item in subStationOptions"
                  :key="item.subStationId"
                  :label="item.subStationName"
                  :value="item.subStationId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子期编码">
              <el-input
                v-model="dialogform.subStationCode"
                @keyup.enter.native="searchData"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="子期负责人：">
              <el-input
                placeholder="请输入"
                v-model="dialogform.subStationPersonName"
                @keyup.enter.native="searchData"
              ></el-input>
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
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowId"
                  :label="scope.row.id"
                  @change="changeRedio($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationCode"
              label="子期编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationPersonName"
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
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 选点 -->
    <el-dialog
      title="选点"
      :visible.sync="mapDialogVisible"
      v-if="mapDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Map
          height="60vh"
          :latlng="latlng"
          :setpoint="setpoint"
          :plantArea="plantArea"
          :fencePointList="fencePointList"
          ref="map"
          @fenceSubmit="fenceSubmit"
        ></Map>
      </div>
      <span slot="footer" class="dialog-footer" v-if="setpoint">
        <el-button @click="mapDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDot">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { areaAdd, areaEdit, areaDetail, remove } from "@/api/device/matrix";
import Map from "@/components/map/map";
import { querySubStationList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { queryAreaDropDownList } from "@/api/planManage/deviceInspection";
import { querySubStationDropDownList } from "@/api/organization/substation";
export default {
  components: { Map },
  name: "operationStaging",
  data() {
    var validateAreaCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入方阵编码"));
      } else {
        queryAreaDropDownList({
          mainStationIdList: [],
          subStationIdList: [],
        }).then((res) => {
          let tf = 0;
          for (let i = 0; i < res.data.data.length; i++) {
            if (value == res.data.data[i].areaCode) {
              tf++;
              if (!this.$route.query.id && tf >= 1)
                callback(new Error("方阵编码已存在"));
              if (this.$route.query.id && tf >= 2)
                callback(new Error("方阵编码已存在"));
            }
          }
          callback();
        });
      }
    };
    return {
      listState: false,
      form: {
        isEffective: 1,
        subStationId: "",
        subStationName: "",
        areaCode: "",
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
          { validator: validateAreaCode, trigger: "blur" },
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
        subStationIdList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      currentRowId: "",
      mainStationOptions: [],
      pageNum: 1,
      pageSize: 10,
      btnshow: false,
      latlng: {},
      setpoint: false,
      plantArea: false,
      fencePointList: {},
      mapDialogVisible: false,
    };
  },
  //   components: { Tree },
  // watch: {
  // $route() {
  // console.log(this.$route.path);
  // if (
  //   this.$route.path == "/device/detailsArchives" &&
  //   this.$route.query.id
  // ) {
  //   this.getareaDetail();
  // } else {
  //   this.form = {
  //     isEffective: 1,
  //     subStationId: "",
  //   };
  // }
  // this.listState = false;
  // },
  // },
  mounted() {
    if (this.$route.query.id) this.getareaDetail();
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
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
            areaAdd(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({ name: "方阵", params: { refresh: true } });
            });
          } else {
            this.form.stageId = this.$route.query.id;
            areaEdit(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({ name: "方阵", params: { refresh: true } });
              this.listState = !this.listState;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改组织-清空子期
    handleChangeMainStation() {
      this.form.subStationName = "";
    },
    //子期弹窗
    focusMainStation(num) {
      this.principaNum = num;
      this.$refs.mainStation0.blur();
      this.tableData = [];
      this.dialogform = [];
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
        subStationIdList: this.dialogform.subStationIdList,
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
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({ stageIdList: [this.$route.query.id] }).then(() => {
          this.$router.$avueRouter.closeTag();
          this.$router.push({ name: "方阵", params: { refresh: true } });
        });
      });
    },
    // 添加
    principalAdd() {
      this.focusMainDialogVisible = false;
      this.form.subStationName = this.changeRediod.subStationName;
      this.form.subStationId = this.changeRediod.id;
    },
    // 详情
    getareaDetail() {
      areaDetail({ id: this.$route.query.id }).then((res) => {
        this.form = res.data.data;
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
    // 电站区域
    mapPlantArea() {
      this.plantArea = true;
      this.setpoint = false;
      this.mapDialogVisible = true;
      if (!this.form.fenceList) {
        this.form.fenceList = [];
      }
      this.fencePointList = this.form.fenceList;
    },
    // 区域提交
    fenceSubmit(data) {
      this.form.fenceList = data;
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
      /deep/.el-tag.el-tag--info {
        max-width: 120px;
        overflow: hidden;
        position: relative;
        .el-select__tags-text {
          max-width: 90px;
          display: inline-block;
          overflow: hidden;
        }
        .el-tag__close {
          position: relative;
          top: -7px;
          right: 0;
        }
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
        // table {
        //   width: 100%;
        //   tr {
        //     display: flex;
        //     align-items: center;
        //     th {
        //       padding: 10px;
        //       text-align: right;
        //       font-size: 14px;
        //       color: #606266;
        //       line-height: 40px;
        //       padding: 0 12px 0 0;
        //       -webkit-box-sizing: border-box;
        //       box-sizing: border-box;
        //       width: 150px;
        //       display: block;
        //     }
        //     td {
        //       width: 23%;
        //       padding: 10px;
        //       /deep/.el-form-item {
        //         margin-bottom: 0px;
        //         .el-select {
        //           width: 100%;
        //         }
        //       }
        //       /deep/ .el-select .el-input.is-disabled .el-input__inner:hover {
        //         background-color: #ffffff;
        //       }
        //       /deep/.el-input.is-disabled .el-input__inner {
        //         background-color: #ffffff;
        //       }
        //     }
        //   }
        //   .title {
        //     width: 100%;
        //     text-align: left;
        //     padding: 10px 0px 15px;
        //     font-size: 20px;
        //     margin-left: -10px;
        //   }
        //   .location {
        //     display: flex;
        //     justify-content: space-between;
        //     align-items: center;
        //     i {
        //       color: #409eff;
        //       font-size: 21px;
        //       margin-left: 5px;
        //     }
        //     .el-form-item {
        //       width: 100%;
        //     }
        //   }
        // }
      }
    }
  }
}
</style>
