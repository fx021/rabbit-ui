<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="left"></div>
        <div class="right">
          <el-button type="primary" size="small" plain @click="compile"
            >记录查询
          </el-button>
          <el-button type="primary" size="small" plain @click="compile"
            >重启
          </el-button>
          <el-button type="primary" size="small" plain @click="compile"
            >暂停
          </el-button>
          <el-button type="primary" size="small" plain @click="compile"
            >转单
          </el-button>
          <el-button type="primary" size="small" plain @click="compile"
            >废弃
          </el-button>
          <el-button
            type="danger"
            size="small"
            plain
            class="el-icon-delete"
            @click.stop="deletes"
            >删除</el-button
          >
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
              <div class="basice-box">
                <el-form-item label="所属组织" prop="mainStationName">
                  <el-input disabled v-model="form.mainStationName"></el-input>
                </el-form-item>
                <el-form-item label="工单编号" prop="wordOrderNo">
                  <el-input disabled v-model="form.wordOrderNo"></el-input>
                </el-form-item>
                <el-form-item label="发起人" prop="initiatorName">
                  <el-input disabled v-model="form.initiatorName"></el-input>
                </el-form-item>
                <el-form-item label="发起时间" prop="launchTime">
                  <el-input disabled v-model="form.launchTime"></el-input>
                </el-form-item>
                <el-form-item label="任务分类" prop="taskCategoryName">
                  <el-input disabled v-model="form.taskCategoryName"></el-input>
                </el-form-item>
                <el-form-item label="紧急程度" prop="urgentLevel">
                  <el-select
                    v-model="form.urgentLevel"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    disabled
                    default-first-option
                    @visible-change="visibleChange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in urgencyOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="任务内容" prop="taskContentMaps">
                  <el-input disabled v-model="form.taskContentMaps"></el-input>
                </el-form-item>
                <el-form-item label="任务区域" prop="areaName">
                  <el-input
                    v-model="form.areaName"
                    
                    @focus="focusArea()"
                    ref="mainStation2"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="工单状态" prop="wordOrderState">
                  <el-select
                    v-model="form.wordOrderState"
                    filterable
                    allow-create
                    disabled
                    collapse-tags
                    clearable
                    default-first-option
                    @visible-change="visibleChange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in orderStateOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="任务描述" prop="contentDescribe">
                  <el-input disabled v-model="form.contentDescribe"></el-input>
                </el-form-item>
                <el-form-item label="任务负责人">
                  <el-input
                    v-model="form.taskLeaderName"
                    placeholder="请输入"
                    ref="treeRef0"
                    @focus="focusTree(0)"
                  ></el-input>
                </el-form-item>
                <el-form-item label="任务协助人" prop="taskHelpers">
                  <el-input
                    v-model="form.majorHelperName"
                    placeholder="请输入"
                    ref="treeRef1"
                    @focus="focusTree(1)"
                  ></el-input>
                </el-form-item>
                <el-form-item label="任务开始时间" prop="startTime">
                  <el-input disabled v-model="form.startTime"></el-input>
                </el-form-item>
                <el-form-item label="任务结束时间" prop="endTime">
                  <el-input disabled v-model="form.endTime"></el-input>
                </el-form-item>
                <el-form-item label="结果描述" prop="positionName">
                  <el-input disabled v-model="form.positionName"></el-input>
                </el-form-item>
                <el-form-item label="任务耗时" prop="timeConsumingTask">
                  <el-input
                    disabled
                    v-model="form.timeConsumingTask"
                  ></el-input>
                </el-form-item>
                <el-form-item label="结果判定" prop="resultJudgment">
                  <el-select
                    v-model="form.resultJudgment"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    disabled
                    default-first-option
                    @visible-change="visibleChange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in resultJudgmentOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="值班人员" prop="dutyPersonName">
                  <el-input disabled v-model="form.dutyPersonName"></el-input>
                </el-form-item>
                <el-form-item label="火情处置" prop="fireDisposal">
                  <el-input disabled v-model="form.fireDisposal"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                  <el-input disabled v-model="form.remarks"></el-input>
                </el-form-item>
                <el-form-item label="核实人员" prop="verifierName">
                  <el-input disabled v-model="form.verifierName"></el-input>
                </el-form-item>
                <el-form-item label="核实时间" prop="verifyTime">
                  <el-input disabled v-model="form.verifyTime"></el-input>
                </el-form-item>
                <el-form-item label="任务图片" prop="taskImgs"> </el-form-item>
              </div>
              <div class="form-box">
                <el-form-item
                  label="结果附件"
                  prop="imgList"
                  style="width: 100%; margin-left: 22px"
                >
                  <el-upload
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false"
                    :file-list="form.imgList"
                    :on-change="handleChange"
                  >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{ file }">
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        style="height: 146px"
                        alt=""
                      />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <i
                            :class="
                              file.url == './img/file1.png'
                                ? 'el-icon-download'
                                : 'el-icon-zoom-in'
                            "
                          ></i>
                        </span>
                        <span
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <!-- 方阵 -->
    <el-dialog
      title="选择方阵"
      :visible.sync="focusAreaflag"
      append-to-body
      class="focus-main-dialog"
      width="1000px"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="方阵名称：">
              <el-input
                v-model="dialogform.areaName"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="方阵编码">
              <el-input
                v-model="dialogform.areaCode"
                placeholder="请输入内容"
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
          <el-table
            :data="tableData"
            style="width: 100%"
            @select="handleSelect"
            @select-all="handleSelectAll"
            tooltip-effect="dark"
            ref="qureAreaRef"
          >
            <el-table-column
              type="selection"
              label=""
              width="50"
              align="center"
              :selectable="getChoose"
            >
              <!-- <template slot-scope="scope">
                <el-radio
                  v-model="currentRowId"
                  :label="scope.row.id"
                  @change="changeRedio($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template> -->
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="areaName"
              label="方阵名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="areaCode"
              label="方阵编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
          </el-table>
          <div style="margin-top: 27px; left: 38px; position: absolute">
            <el-checkbox v-model="checked" @click="getChoose"
              >厂区外</el-checkbox
            >
          </div>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="total"
              :page-size="pageSize"
              background
              :current-page.sync="pageNum"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 选择负责人弹窗 -->
    <el-dialog
      title="选择负责人"
      :visible.sync="treeDialogVisible"
      v-if="treeDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="1280px"
    >
      <div>
        <Tree
          :data="treeData"
          :props="defaultProps"
          :showRight="true"
          :tableList="[]"
          :choice="choice"
          @selectData="selectData"
        ></Tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeAdd">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { tree } from "@/api/organization/allStation";
import lrz from "lrz";
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
import Tree from "@/components/organization/tree.vue";
import {
  getDetail,
  // queryChecktaskItemList,
} from "@/api/taskWorkOrder/taskFeedback";
import { queryList } from "@/api/device/matrix"; //查询方阵
export default {
  name: "detailTaskFeedback",
  components: { Tree },
  data() {
    return {
      focusAreaflag: false,
      dialogImageUrl: "",
      imgDialogVisible: false,
      urgencyOptions: JSON.parse(
        window.localStorage.getItem("urgencyOptions") //紧急程度
      ),
      resultJudgmentOptions: JSON.parse(
        window.localStorage.getItem("resultJudgmentOptions") //紧急程度
      ),
      orderStateOptions: JSON.parse(
        window.localStorage.getItem("orderStateOptions") //紧急程度
      ),
      checked: false,
      dialogform: {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
        areaName: "",
        mainStationId: [],
        subStationId: [],
      },
      tableData: [],
      areaList: [],
      flag: true,
      form: {
        areaName: [],
        areaNameId: [],
        wordOrderState: "",
        imgList: [],
      },
      treeDialogVisible: false,
      treeData: [],
      choice: true,
      addData: "",
      treeNum: "",
      defaultProps: {
        children: "children",
        label: "title",
      },
      btnshow: false,
      pageNum: 1,
      pageSize: 10,
      total: "",
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
    // 添加图片
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      this.btnshow = true;
      // file.name.split('.')[1]
      let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
      if (regular.test(file.name.split(".")[file.name.split(".").length - 1])) {
        lrz(file.raw)
          .then((file) => {
            imgUpload(file.origin).then((res) => {
              res.data.data.url = this.imgUrl + res.data.data.fileId;
              res.data.data.status = "success";
              res.data.data.uid = fileList[fileList.length - 1].uid;
              fileList[fileList.length - 1] = res.data.data;
              this.form.imgList = fileList;
              this.btnshow = false;
            });
          })
          .catch(function (err) {
            // 处理失败会执行
            console.log(err);
          });
      } else {
        fileUpload(file.raw).then((res) => {
          res.data.data.url = "./img/file1.png";
          res.data.data.fileName = res.data.data.name;
          // res.data.data.url = this.imgUrl + res.data.data.fileId;
          res.data.data.status = "success";
          res.data.data.uid = fileList[fileList.length - 1].uid;
          fileList[fileList.length - 1] = res.data.data;
          this.form.imgList = fileList;
          this.btnshow = false;
        });
      }
    },
    // 图片删除
    handleRemove(file) {
      console.log(this.form.imgList);
      const i = this.form.imgList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.imgList.splice(i, 1);
    },
    // 图片预览
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
        this.dialogImageUrl = file.url;
        this.imgDialogVisible = true;
      }
    },
    // 选择负责人数据
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    //负责人弹窗
    focusTree(num) {
      this.treeDialogVisible = true;
      this.treeNum = num;
      this.treeData = [];
      if (this.treeNum == 0) {
        this.$refs.treeRef0.blur();
        this.choice = true;
      }
      if (this.treeNum == 1) {
        this.$refs.treeRef1.blur();
        this.choice = false;
      }
      tree().then((res) => {
        this.treeData = res.data.data;
      });
    },
    // 添加负责人
    treeAdd() {
      this.treeDialogVisible = false;
      if (this.treeNum == 0) {
        this.form.taskLeader = this.addData.id; //任务负责人ID
        this.form.taskLeaderName = this.addData.name; //任务负责人名称
      }
      if (this.treeNum == 1) {
        this.form.taskHelpers = this.addData.map((v) => {
          return v.id;
        }); //主要协助人ID
        this.form.majorHelperName = this.addData
          .map((v) => {
            return v.name;
          })
          .join(","); //主要协助人姓名
      }
      this.addData = [];
    },
    // 判断任务负责人，主要/一般协助人是否重复
    compare(arr1, arr2) {
      let result = false;
      arr1.forEach((ele) => {
        if (ele && arr2.indexOf(ele) != -1) {
          result = true;
        }
      });
      return result;
    },
    //点击厂区外
    getChoose() {
      if (this.checked) {
        this.$refs.qureAreaRef.clearSelection();
      }
      return !this.checked;
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
    principalAdd() {
      this.form.areaName = [];
      this.form.areaNameId = [];
      this.focusAreaflag = false;
      this.areaList.forEach((v) => {
        this.form.areaName.push(v.areaName);
        this.form.areaNameId.push(v.id);
      });
      if (this.checked) {
        this.form.areaName = ["厂区外"];
      }
    },
    cancel() {
      this.focusAreaflag = false;
    },
    //方阵弹框
    focusArea() {
      this.checked = false;
      this.pageNum = 1;
      this.pageSize = 10;
      this.tableData = [];
      this.dialogform = {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
        areaName: "",
        mainStationId: [],
        subStationId: [],
      };
      this.focusAreaflag = true;
      this.$refs.mainStation2.blur();
      queryList({
        pageNum: 1,
        pageSize: 10,
      }).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        if (this.form.areaName[0] == "厂区外") {
          this.checked = true;
        }
        const checkedArr = this.tableData.filter((i) => {
          return this.form.areaNameId.some((j) => {
            return j == i.id;
          });
        });
        this.$nextTick(() => {
          checkedArr.forEach((row) => {
            this.$refs.qureAreaRef.toggleRowSelection(row);
          });
        });
        //
      });
    },
    searchData() {
      //方阵
      queryList({
        areaName: this.dialogform.areaName,
        areaCode: this.dialogform.areaCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        const checkedArr = this.tableData.filter((i) => {
          return this.form.areaNameId.some((j) => {
            return j == i.id;
          });
        });
        this.$nextTick(() => {
          checkedArr.forEach((row) => {
            this.$refs.qureAreaRef.toggleRowSelection(row);
          });
        });
        //
      });
    },
    handleSelect(selection, row) {
      // 查找变化的，增加还是减少
      if (
        selection.find((i) => {
          // 新增的
          return i.id === row.id;
        })
      ) {
        this.areaList.push(row);
      } else {
        const index = this.areaList.findIndex((k) => {
          return k.id === row.id;
        });
        if (index !== undefined) this.areaList.splice(index, 1);
      }
    },
    handleSelectAll(selection) {
      if (selection.length === 0) {
        // 清空
        this.tableData.forEach((i) => {
          const index = this.areaList.findIndex((k) => {
            return k.id === i.id;
          });
          if (index !== undefined) this.areaList.splice(index, 1);
        });
      } else {
        // 添加
        this.tableData.forEach((i) => {
          if (
            !this.areaList.find((k) => {
              return k.id === i.id;
            })
          )
            this.areaList.push(i);
        });
      }
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 详情
    getDetail() {
      getDetail({ id: this.$route.query.id }).then((res) => {
        this.form = res.data.data;
        this.form.taskContentMaps = Object.values(this.form.taskContentMap);
        this.form.areaName = Object.values(res.data.data.taskAreaMap);
        this.form.areaNameId = Object.keys(res.data.data.taskAreaMap);
        this.form.imgList = [];
      });
      // queryChecktaskItemList({ checkTaskDetailId: this.$route.query.id }).then(
      //   (res) => {
      //     this.tableData = res.data.data.pageData;
      //     this.tableData.forEach((item) => {
      //       if (item.imgList) {
      //         item.imgList.forEach((item) => {
      //           let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
      //           if (
      //             regular.test(
      //               item.fileName.split(".")[
      //                 item.fileName.split(".").length - 1
      //               ]
      //             )
      //           ) {
      //             item.url = this.imgUrl + item.fileId;
      //           } else {
      //             item.url = "./img/file1.png";
      //           }
      //         });
      //       }
      //     });
      //     // console.log(res.data.data.pageData[0].imgList, "99999999999");
      //     this.pageNum = res.data.data.pageNum;
      //     this.pageSize = res.data.data.pageSize;
      //     this.total = res.data.data.total;
      //   }
      // );
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
.form-box {
  display: flex;
  flex-wrap: wrap;
  // margin-left: 20px;
  width: 100%;
  /deep/.el-form-item {
    display: flex;
    width: 33.33%;
    .el-form-item__label {
      padding: 10px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 130px;
      display: block;
      font-weight: bold;
    }
    .el-form-item__content {
      margin: 0 !important;
      margin-left: 10px !important;
      width: calc(100% - 160px);
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
        width: 100%;
      }
    }
  }
  .title-text {
    color: rgb(96, 98, 102);
    line-height: 40px;
    width: 100%;
    text-align: left;
    padding: 10px 16px 15px;
    border-top: 1px solid #b3d8ff;
    font-size: 20px;
    font-weight: bold;
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
