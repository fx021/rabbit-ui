<template>
  <div class="equipmentArchives">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationId"
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
                v-for="item in mainStationOptions"
                :key="item.id"
                :label="item.mainStationName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属子期：">
            <el-select
              v-model="form.subStationId"
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
          <el-form-item label="设备名称：">
            <el-input
              style="width: 217px"
              v-model="form.equipmentName"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型：">
            <el-select
              v-model="form.equipmentType"
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
                v-for="item in equipmentTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备品牌：">
            <el-input
              style="width: 217px"
              v-model="form.manufactor"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备型号：">
            <el-input
              style="width: 217px"
              v-model="form.equipmentModel"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备状态：">
            <el-select
              v-model="form.equipmentState"
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
                v-for="item in statusEquipmentOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div class="title-btn">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData"
              >查询</el-button
            >
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-refresh"
              @click="reset"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="content">
        <div class="content-title">
          <!-- v-if="permission.user_delete" -->
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort(0)"
              >创建时间<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort1 == 'no' ? '' : sort1 ? '' : colorName,
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort1 == 'no' ? '' : sort1 ? colorName : '',
                  }"
                ></i
              ></span>
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-refresh"
              @click="reset"
              plain
              >刷新</el-button
            >
          </div>
          <div class="right">
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleAdd"
              >新增
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="nameplateUpload"
              >铭牌上传
            </el-button>
            <el-button
              type="warning"
              size="small"
              plain
              style="margin-left: 10px"
              icon="el-icon-document-delete"
              @click="changeState"
              >设备报废
            </el-button>
            <el-button
              type="danger"
              size="small"
              plain
              class="el-icon-delete"
              @click.stop="deletes"
              >批量删除</el-button
            >
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="handleExport"
              >导出
            </el-button>
            <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="bulkImport"
              style="margin-left: 10px"
            >
              <el-button
                type="warning"
                size="small"
                plain
                icon="el-icon-download"
                >批量导入
              </el-button>
            </el-upload>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="details"
        >
          <!--  overflow-y: auto -->
          <!-- max-height="calc(100vh - 400px)" -->
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="subStationName"
            label="所属子期"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentName"
            label="设备名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentType"
            label="设备类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.equipmentType | filterOptions(equipmentTypeOptions)
              }}
            </template>
          </el-table-column>
          <!-- //!不需要 <el-table-column
            prop=""
            label="设备分类"
            align="center"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            prop="manufactor"
            label="设备品牌"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <!--  设备编码-->
          <el-table-column
            prop="equipmentCode"
            label="产品编号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentModel"
            label="规格型号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentState"
            label="设备状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.equipmentState | filterOptions(statusEquipmentOptions)
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="details(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
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
      <el-backtop target=".box-card" :isibility-height="100">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          style="font-size: 24px; padding: 6px; transform: rotate(180deg)"
        ></el-button>
      </el-backtop>
    </el-card>
    <el-dialog
      title="铭牌上传"
      :visible.sync="nameplateDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div>
        <el-table
          ref="multipleTable"
          :data="multipleSelection"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="50">
          </el-table-column>
          <el-table-column
            prop="equipmentName"
            label="设备名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="manufactor"
            label="设备品牌"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentModel"
            label="规格型号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentCode"
            label="产品编号"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.equipmentCode"
                placeholder="请输入内容"
                @keyup.enter.native="equipmentCodeBlur(scope.row, scope.$index)"
                @blur="equipmentCodeBlur(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="铭牌" align="center" width='160'>
            <template slot-scope="scope">
              <div>
                <el-tag
                  v-for="item in scope.row.imgList"
                  :key="item"
                  closable
                  @click="handlePictureCardPreview(item)"
                  @close="handleClose(item, scope.row)"
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
            label="设备铭牌"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope"
              ><el-upload
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange"
                multiple
              >
                <el-button
                  size="small"
                  type="primary"
                  @click="getPresentMsg(scope.row)"
                  >附件上传</el-button
                >
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="nameplateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible" append-to-body width="40%">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  archivesQueryList,
  archivesExport,
  archivesRemove,
  archivesEditState,
  archivesEdit,
  archivesImport,
} from "@/api/device/equipmentArchives";
import { imgUpload, fileUpload, fileDownload } from "@/api/upload/upload";
import lrz from "lrz";
import { getSelected } from "@/util/util.js";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { mapGetters } from "vuex";
export default {
  name: "equipmentArchives",
  data() {
    return {
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      subStationOptions: [],
      mainStationOptions: [],
      orderColumn: "",
      orderType: "",
      tableData: [],
      form: {
        organization: [],
        region: [],
        subStationId: "",
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      fileList: [],
      nameplateDialogVisible: false,
      statusEquipmentOptions: JSON.parse(
        window.localStorage.getItem("statusEquipmentOptions")
      ),
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      nowMsg: {},
      imgDialogVisible: false,
      dialogImageUrl: "",
    };
  },
  created() {},
  filters: {
    filterFileName: function (value) {
      if (value) {
        return value.split("/")[value.split("/").length - 1];
      }
    },
  },
  mounted() {
    this.getarchivesQueryList({
      orderColumn: "", //排序列
      orderType: "", //排序类型：desc,asc
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.setUI()
  },
  computed: {
    ...mapGetters(["colorName"])
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getarchivesQueryList(data) {
      archivesQueryList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查询
    searchData() {
      this.getarchivesQueryList({
        mainStationId: this.form.mainStationId,
        subStationId: this.form.subStationId,
        equipmentName: this.form.equipmentName,
        equipmentType: this.form.equipmentType,
        manufactor: this.form.manufactor,
        equipmentModel: this.form.equipmentModel,
        equipmentState: this.form.equipmentState,
        orderColumn: this.orderColumn, //排序列
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.mainStationId = [];
      this.form.subStationId = [];
      this.form.equipmentName = "";
      this.form.equipmentType = [];
      this.form.manufactor = "";
      this.form.equipmentModel = "";
      this.form.equipmentState = [];
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.current = 1;
      this.pageNum = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 批量删除
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let idList = [];
        this.multipleSelection.forEach((item) => {
          idList.push(item.id);
        });
        archivesRemove({ idList }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newArchives" });
    },
    // 铭牌弹窗
    nameplateUpload() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.nameplateDialogVisible = true;
      this.multipleSelection.forEach((item) => {
        if (item.imgList) {
          item.imgList.forEach((item) => {
            let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
            if (
              regular.test(
                item.fileName.split(".")[item.fileName.split(".").length - 1]
              )
            ) {
              item.url = this.imgUrl + item.fileId;
            } else {
              item.url = "./img/file1.png";
            }
          });
        }
      });
    },

    // 修改状态 报废
    changeState() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      let idList = [];
      this.multipleSelection.forEach((item) => {
        idList.push(item.id);
      });
      archivesEditState({
        idList,
      }).then(() => {
        this.searchData();
        this.$message.success("处理成功");
      });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      archivesExport({
        mainStationId: this.form.mainStationId,
        subStationId: this.form.subStationId,
        equipmentName: this.form.equipmentName,
        equipmentType: this.form.equipmentType,
        manufactor: this.form.manufactor,
        equipmentModel: this.form.equipmentModel,
        equipmentState: this.form.equipmentState,
        orderColumn: this.orderColumn, //排序列
        orderType: this.orderType, //排序类型 desc降序,asc升序
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "设备档案列表.xls"; //下载的文件名
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
    },
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : this.sort1 == true
          ? (this.sort1 = "no")
          : (this.sort1 = true);
        this.orderColumn = this.sort1 == "no" ? "" : "create_time";
        this.orderType = this.sort1 == "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 详情
    details(data) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailsArchives",
        query: { id: data.id },
      });
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
    // 上传附件
    handleChange(file, fileList) {
      console.log(file, fileList, this.nowMsg);
      let regular = /^jpg|bmp|jpeg|png|gif|JPG|BMP|JPEG|PNG|GIF$/;
      if (regular.test(file.name.split(".")[file.name.split(".").length - 1])) {
        lrz(file.raw).then((file) => {
          imgUpload(file.origin)
            .then((res) => {
              console.log(res.data.data);
              res.data.data.fileName = res.data.data.name;
              if (!this.nowMsg.imgList) this.nowMsg.imgList = [];
              res.data.data.url = this.imgUrl + res.data.data.fileId;
              this.nowMsg.imgList.push(res.data.data);
              this.$message.success("上传成功");
              archivesEdit(this.nowMsg);
            })
            .catch(function (err) {
              // 处理失败会执行
              console.log(err);
            });
        });
      } else {
        fileUpload(file.raw).then((res) => {
          res.data.data.url = "./img/file1.png";
          if (!this.nowMsg.imgList) this.nowMsg.imgList = [];
          res.data.data.fileName = res.data.data.name;
          // res.data.data.status = "success";
          // res.data.data.uid = fileList[fileList.length - 1].uid;
          // fileList[fileList.length - 1] = res.data.data;
          this.nowMsg.imgList.push(res.data.data);
        });
      }
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    // 弹窗列表失去焦点
    equipmentCodeBlur(data, index) {
      archivesQueryList({
        equipmentCode: data.equipmentCode,
        pageNum: 1,
        pageSize: 10,
      }).then((res) => {
        if (res.data.data.pageData == 0)
          return this.$message.error("设备编码错误");
        this.multipleSelection.splice(index, 1, res.data.data.pageData[0]);
      });
    },
    // 获取当前列表信息
    getPresentMsg(data) {
      this.nowMsg = data;
    },
    // tag删除
    handleClose(tag, data) {
      data.imgList.splice(data.imgList.indexOf(tag), 1);
      archivesEdit(data);
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
            link.download = file.name.split("/")[
              file.name.split("/").length - 1
            ]; //下载的文件名
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
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    // 批量导入
    bulkImport(file) {
      console.log(file);
      archivesImport(file.raw).then((res) => {
        console.log(res);
        this.$message.success("导入成功");
        this.searchData();
      });
    },
  },
};
</script>


<style lang='scss' scoped>
.equipmentArchives {
  .box-card {
    overflow: auto;
    height: calc(100vh - 124px);
    .title-content {
      /deep/.el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          margin-right: 20px;
        }
        .el-tag.el-tag--info {
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
    }
  }
  .title-btn {
    margin-left: 50px;
  }
  /deep/.el-table__header-wrapper {
    .cell {
      color: #333;
    }
  }

  .content {
    .content-title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .left {
        /deep/.el-button--primary.is-plain:focus,
        .el-button--primary.is-plain:hover {
          color: #409eff;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
      }
      .right {
        display: flex;
      }
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    // height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;
  }
  .sort-caret.ascending {
    border-bottom-color: #c0c4cc;
    top: -12px;
  }
  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;
  }
  .descending .sort-caret.descending {
    border-top-color: #409eff;
  }
  .sort-caret.descending {
    border-top-color: #c0c4cc;
    // bottom: 7px;
  }
  .sort-caret {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    left: 7px;
  }
  .upload-demo {
    /deep/.el-upload-list {
      display: none;
    }
  }
}
/deep/.el-tag .el-icon-close {
  top: 8px;
  right: 3px;
  position: absolute;
}
</style>
