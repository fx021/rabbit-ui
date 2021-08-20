<template>
  <div class="substation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationIdList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
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
              v-model="form.subStationIdList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
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
          <el-form-item label="设备简称：">
            <el-input
              style="width: 217px"
              @keyup.enter.native="searchData"
              v-model="form.equipmentAbbreviation"
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
          <el-form-item label="设备厂家：">
            <el-input
              style="width: 217px"
              v-model="form.equipmentManufacturer"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input
              style="width: 217px"
              v-model="form.equipmentModel"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
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
            <el-button type="primary" size="small" plain @click="sort()"
              >所属组织<span class="caret-wrapper"
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
              size="medium"
              icon="el-icon-refresh"
              @click="reset"
              plain
              >刷新</el-button
            >
          </div>
          <div class="right">
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="handleExport"
              >导出
            </el-button>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column
            label="所属组织"
            prop="mainStationName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="所属子期"
            prop="subStationName"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="equipmentType" label="设备类型" align="center">
            <template slot-scope="scope">
              {{
                scope.row.equipmentType | filterOptions(equipmentTypeOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="equipmentSimple"
            label="设备简称"
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
            <!-- <template slot-scope="scope">
             
            </template> -->
          </el-table-column>
          <el-table-column
            prop="allSize"
            label="设备总数"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="useSize"
            label="在用数量"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="stopSize"
            label="备用数量"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          layout="total,prev,pager,next"
          :total="total"
          :page-size="pageSize"
          background
          :current-page.sync="current"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  queryList,
  exportEquipmentAccountList,
} from "@/api/device/equipmentAccount";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { mapGetters } from "vuex";
export default {
  name: "equipmentAccount",
  data() {
    return {
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
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
      form: {
        organization: [],
        region: [],
      },
      multipleSelection: [],
      sort2: "no",
    };
  },
  created() {},
  mounted() {
    this.getqueryList({
      mainStationIds: this.form.mainStationIdList, //所属组织
      subStationIds: this.form.subStationIdList, //所属子期
      equipmentSimple: null, //设备简称(模糊查询)
      equipmentTypes: this.form.equipmentTypeList, //设备类型
      manufactor: null, //设备厂家(模糊查询)
      equipmentModel: null, //设备型号
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
  filters: {
    filterOptions: function (value, optionList) {
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
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getqueryList(data) {
      queryList(data).then((res) => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((item) => {
        this.multipleSelection.push(item.id);
      });
    },
    // 查询
    searchData() {
      console.log(this.equipmentTypeOptions, "设备类型");
      this.getqueryList({
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        mainStationIds: this.form.mainStationIdList, //所属总站
        subStationIds: this.form.subStationIdList, //所属子站
        equipmentSimple:
          this.form.equipmentAbbreviation == undefined
            ? null
            : this.form.equipmentAbbreviation, //设备简称(模糊查询)
        equipmentTypes: this.form.equipmentTypeList, //设备类型
        manufactor:
          this.form.equipmentManufacturer == undefined
            ? null
            : this.form.equipmentManufacturer, //设备厂家(模糊查询)
        equipmentModel:
          this.form.equipmentModel == undefined
            ? null
            : this.form.equipmentModel, //设备型号
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.mainStationIdList = [];
      this.form.subStationIdList = [];
      this.form.equipmentTypeList = [];
      this.form.equipmentAbbreviation = null;
      this.form.equipmentManufacturer = null;
      this.form.equipmentModel = null;
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportEquipmentAccountList({
        ids: this.multipleSelection,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        mainStationIds: this.form.mainStationIdList, //所属总站
        subStationIds: this.form.subStationIdList, //所属子站
        equipmentSimple:
          this.form.equipmentAbbreviation == undefined
            ? null
            : this.form.equipmentAbbreviation, //设备简称(模糊查询)
        equipmentTypes: this.form.equipmentTypeList, //设备类型
        manufactor:
          this.form.equipmentManufacturer == undefined
            ? null
            : this.form.equipmentManufacturer, //设备厂家(模糊查询)
        equipmentModel:
          this.form.equipmentModel == undefined
            ? null
            : this.form.equipmentModel, //设备型号
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "设备台账列表.xls"; //下载的文件名
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
      console.log("handlePageChange");
      this.pageNum = pageNum;
      this.searchData();
    },
    sort() {
      this.sort2 == "no"
        ? (this.sort2 = false)
        : this.sort2 == true
        ? (this.sort2 = "no")
        : (this.sort2 = true);
      this.orderColumn = this.sort2 == "no" ? "" : "main_station_id";
      this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      this.searchData();
    },
  },
};
</script>


<style lang='scss' scoped>
.substation {
  .box-card {
    overflow: auto;
    height: calc(100vh - 124px);
  }
  .title-content {
    /deep/.el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 20px;
      }
    }
  }
  /deep/ .el-table thead {
    color: #333;
  }

  .title-btn {
    margin-left: 50px;
  }
  .content {
    margin-top: 10px;
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
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
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
</style>
