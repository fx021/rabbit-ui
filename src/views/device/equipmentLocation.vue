<template>
  <div class="equipmentLocation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
          style="padding-right: 70px"
        >
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
          <el-form-item label="所属子期：" v-show="show">
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
          <el-form-item label="设备位置名称：">
            <el-input
              style="width: 217px"
              v-model="form.postionName"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型：">
            <el-select
              v-model="form.equipmentTypeList"
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
          <el-form-item label="设备品牌：" v-show="show">
            <el-input
              style="width: 217px"
              v-model="form.manufactor"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备型号：" v-show="show">
            <el-input
              style="width: 217px"
              v-model="form.equipmentModel"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备状态：" v-show="show">
            <el-select
              v-model="form.equipmentStateList"
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
          <el-form-item label="是否接入：" prop="bigDataAccess" v-show="show">
            <el-select
              v-model="form.bigDataAccess"
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option label="接入" value="1"></el-option>
              <el-option label="不接入" value="0"></el-option>
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
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-sort"
          style="position: absolute; right: 30px; top: 66px"
          @click="show = !show"
          >{{ !show ? "展开" : "收起" }}</el-button
        >
      </div>
      <div class="content">
        <div class="content-title">
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort(0)"
              >所属组织<span class="caret-wrapper"
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
            <el-button type="primary" size="small" plain @click="sort(1)"
              >创建时间<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort2 == 'no' ? '' : sort2 ? '' : colorName,
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort2 == 'no' ? '' : sort2 ? colorName : '',
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
              icon="el-icon-help"
              @click="generateQRCode"
              >生成二维码
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-circle-plus-outline"
              @click="showDialog"
              >设备变更
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleAdd"
              >新建
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
              accept=".xls, .xlsx"
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
            prop="positionName"
            label="设备位置名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="positionCode"
            label="设备位置编码"
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
          <el-table-column
            prop="areaName"
            label="方阵名称"
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
            prop="bigDataAccess"
            label="是否接入"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.bigDataAccess
                  ? scope.row.bigDataAccess == 1
                    ? "接入"
                    : "不接入"
                  : ""
              }}
            </template>
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
    </el-card>
    <el-dialog
      title="选择设备名称"
      :visible.sync="focusMainDialogVisible"
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
            <el-form-item label="设备名称：">
              <el-input
                v-model="dialogform.postionName"
                placeholder="请输入内容"
                @keyup.enter.native="searchData"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品编号">
              <el-input
                v-model="dialogform.equipmentCode"
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
          <el-table :data="queryList" style="width: 100%">
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
              align="center"
              :index="indexMethod"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentName"
              label="设备名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="equipmentCode"
              label="产品编号"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="所属组织"
              prop="mainStationName"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationName"
              label="所属子期"
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
    <el-backtop target=".box-card" :isibility-height="100">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-download"
        style="font-size: 24px; padding: 6px; transform: rotate(180deg)"
      ></el-button>
    </el-backtop>
    <el-dialog
      :visible.sync="generateQRCodeDialog"
      append-to-body
      title="二维码预览"
      width="47%"
    >
      <el-button
        type="warning"
        size="small"
        plain
        icon="el-icon-upload2"
        style="position: relative; left: 87%"
        @click="qrCodeDownload('generate-content', 0)"
        >全部导出
      </el-button>
      <div class="generate-content">
        <div
          v-for="(item, index) in imgList"
          :key="item.businessId"
          class="img-list"
        >
          <img :src="item.url" alt="" width="200" height="200" />
          <div class="mask-lyer">
            <i
              class="el-icon-download download-sty"
              @click="qrCodeDownload('img-list', index)"
            ></i>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  positionList,
  positionRemove,
  positionImport,
  exportList,
  generateCode,
} from "@/api/device/equipmentLocation";
import { positionEdit } from "@/api/device/equipmentLocation";
import { archivesQueryList } from "@/api/device/equipmentArchives";
import { getSelected, qrCodeDownload } from "@/util/util.js";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { mapGetters } from "vuex";
export default {
  name: "equipmentLocation",
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
      value: [],
      tableData: [],
      dialogform: {},
      form: {
        mainStationId: [],
        bigDataAccess: "",
        postionName: "",
        manufactor: "",
        equipmentModel: "",
      },
      focusMainDialogVisible: false,
      generateQRCodeDialog: false,
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      statusEquipmentOptions: JSON.parse(
        window.localStorage.getItem("statusEquipmentOptions")
      ),
      queryList: [],
      show: false,
      changeRediod: [],
      currentRowId: "",
      imgList: [],
    };
  },
  created() {},
  mounted() {
    this.getpositionList({
      orderColumn: "", //排序列 sort,region
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
    this.setUI();
  },
  computed: {
    ...mapGetters(["colorName"]),
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
    getpositionList(data) {
      console.log(data);
      positionList(data).then((res) => {
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
      this.getpositionList({
        mainStationIdList: this.form.mainStationId,
        subStationIdList: this.form.subStationId,
        postionName: this.form.postionName,
        equipmentTypeList: this.form.equipmentTypeList,
        manufactor: this.form.manufactor,
        equipmentModel: this.form.equipmentModel,
        equipmentStateList: this.form.equipmentStateList,
        bigDataAccess: this.form.bigDataAccess,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.sort1 = "no";
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.form.mainStationId = [];
      this.form.subStationId = [];
      this.form.equipmentTypeList = [];
      this.form.manufactor = "";
      this.form.equipmentModel = "";
      this.form.equipmentStateList = [];
      this.form.bigDataAccess = "";
      this.form.postionName = "";
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
        positionRemove({ idList }).then(() => {
          this.multipleSelection = [];
          this.searchData();
        });
      });
    },
    // 显示弹窗
    showDialog() {
      if (
        this.multipleSelection.length > 1 ||
        this.multipleSelection.length == 0
      )
        return this.$message.warning("请选择一条数据");
      this.currentRowId = "";
      this.focusMainDialogVisible = true;
      this.getArchivesQueryList({
        pageNum: 1,
        pageSize: 10,
      });
    },
    // 设备档案
    getArchivesQueryList(data) {
      console.log(data);
      archivesQueryList(data).then((res) => {
        console.log(res.data.data);
        this.queryList = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newequipmentLocation" });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportList({
        mainStationIdList: this.form.mainStationId,
        subStationIdList: this.form.subStationId,
        postionName: this.form.postionName,
        equipmentTypeList: this.form.equipmentTypeList,
        manufactor: this.form.manufactor,
        equipmentModel: this.form.equipmentModel,
        equipmentStateList: this.form.equipmentStateList,
        bigDataAccess: this.form.bigDataAccess,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "设备位置列表.xls"; //下载的文件名
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
    // 批量导入
    bulkImport(file) {
      console.log(file);
      positionImport(file.raw).then((res) => {
        console.log(res);
        this.$message.success("导入成功");
        this.searchData();
      });
    },
    sort(num) {
      if (num == 0) {
        this.sort2 = "no";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : this.sort1 == true
          ? (this.sort1 = "no")
          : (this.sort1 = true);
        this.orderColumn = this.sort1 == "no" ? "" : "main_station_id";
        this.orderType = this.sort1 == "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      if (num == 1) {
        this.sort1 = "no";
        this.sort2 == "no"
          ? (this.sort2 = false)
          : this.sort2 == true
          ? (this.sort2 = "no")
          : (this.sort2 = true);
        this.orderColumn = this.sort2 == "no" ? "" : "create_time";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 设备添加
    principalAdd() {
      this.focusMainDialogVisible = false;
      positionEdit(this.changeRediod);
    },
    // 表格单选
    changeRedio(event, row) {
      console.log("row", row);
      this.changeRediod = row;
    },
    // 详情
    details(data) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailsequipmentLocation",
        query: { id: data.id },
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
    generateQRCode() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      let ids = [];
      this.multipleSelection.forEach((item) => {
        ids.push(item.id);
      });
      this.generateQRCodeDialog = true;
      generateCode({ ids: ids }).then((res) => {
        console.log(res.data.data);
        this.imgList = res.data.data
        this.imgList.forEach((item) => {
          item.url = this.imgUrl + item.fileId;
        });
        console.log(this.imgList);
      });
    },
    // 二维码下载
    qrCodeDownload(className, index) {
      qrCodeDownload(className, index);
    },
  },
};
</script>


<style lang='scss' scoped>
.equipmentLocation {
  .box-card {
    overflow-y: auto;
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
  /deep/.el-table__header-wrapper {
    .cell {
      color: #333;
    }
  }
  .title-btn {
    margin-left: 50px;
    margin-bottom: 20px;
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
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
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
.generate-content {
  display: flex;
  flex-wrap: wrap;
  .img-list {
    position: relative;
    width: 200px;
    height: 200px;
    margin-left: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    &:hover {
      .mask-lyer {
        display: block;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
      }
    }
    .mask-lyer {
      display: none;
      .download-sty {
        color: #fafafa;
        font-size: 25px;
        font-weight: bold;
        position: absolute;
        top: calc(50% - 15px);
        left: calc(50% - 15px);
        cursor: pointer;
      }
    }
  }
}
</style>
