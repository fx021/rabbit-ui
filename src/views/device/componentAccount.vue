<template>
  <div class="substation">
    <el-card class="box-card">
      <el-backtop target=".box-card" :visibility-height="100" :bottom="70">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-download"
          style="font-size: 24px; padding: 6px; transform: rotate(180deg)"
        ></el-button>
      </el-backtop>
      <div class="title-content" style="display: flex">
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
          style="padding-right: 70px"
        >
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
          <el-form-item label="组件厂家：">
            <el-select
              v-model="form.manufactorList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in panelFactoryOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件型号：">
            <el-input
              style="width: 217px"
              v-model="form.componentModel"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="功率(w)：">
            <el-input
              style="width: 217px"
              v-model="form.power"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="封装形式：" v-show="open">
            <el-select
              v-model="form.packageTypeList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in packageTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发电形式：" v-show="open">
            <el-select
              v-model="form.powerTypeList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in powerTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件分类：" v-show="open">
            <el-select
              v-model="form.componentTypeList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in componentTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件材料：" v-show="open">
            <el-select
              v-model="form.componentMaterialsList"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
            >
              <el-option
                v-for="item in componentMaterialsOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效：" v-show="open">
            <el-select
              v-model="form.chooseList"
              filterable
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
          style="position: absolute; right: 30px; top: 66px"
          type="primary"
          size="small"
          icon="el-icon-sort"
          @click="open = !open"
          >{{ open ? "收起" : "展开" }}</el-button
        >
      </div>
      <div class="content">
        <div class="content-title">
          <!-- v-if="permission.user_delete" -->
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
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
          <el-table-column label="所属组织" prop="mainStationId" align="center">
          </el-table-column>
          <el-table-column label="所属子期" prop="subStationId" align="center">
          </el-table-column>
          <el-table-column prop="manufactor" label="组件厂家" align="center">
            <template slot-scope="scope">
              {{ scope.row.manufactor | filterOptions(panelFactoryOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="componentModel"
            label="组件型号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="power"
            label="功率(w)"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="packageType"
            label="封装形式"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.packageType | filterOptions(packageTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="powerType"
            label="发电形式"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.powerType | filterOptions(powerTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="componentType"
            label="组件分类"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.componentType | filterOptions(componentTypeOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="componentMaterials"
            label="组件材料"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.componentMaterials
                  | filterOptions(componentMaterialsOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            label="数量"
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
  queryComponentList,
  exportComponentAccountList,
} from "@/api/device/componentAccount";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { mapGetters } from "vuex";
export default {
  name: "componentAccount",
  data() {
    return {
      componentMaterialsOptions: JSON.parse(
        window.localStorage.getItem("componentMaterialsOptions")
      ),
      componentTypeOptions: JSON.parse(
        window.localStorage.getItem("componentTypeOptions")
      ),
      powerTypeOptions: JSON.parse(
        window.localStorage.getItem("powerTypeOptions")
      ),
      packageTypeOptions: JSON.parse(
        window.localStorage.getItem("packageTypeOptions")
      ),
      panelFactoryOptions: JSON.parse(
        window.localStorage.getItem("panelFactoryOptions")
      ),
      choose: [
        { key: "是", id: "1" },
        { key: "否", id: "0" },
      ],
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
      form: {},
      multipleSelection: [],
      open: false,
    };
  },
  created() {},
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
  mounted() {
    this.getqueryList({
      idList: [],
      mainStationId: this.form.mainStationIdList, //所属组织
      subStationId: this.form.subStationIdList, //所属子期
      manufactor: this.form.manufactorList, //组件厂家(模糊查询)
      componentModel:
        this.form.componentModel == undefined ? null : this.form.componentModel, //组件型号
      power: this.form.power == undefined ? null : this.form.power, //功率
      packageType: this.form.packageTypeList, //封装形式
      powerType: this.form.powerTypeList, //发电形式
      componentType: this.form.componentTypeList, //组件分类
      componentMaterials: this.form.componentMaterialsList, //组件材料
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
    ...mapGetters(["colorName"])
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    opens() {
      this.open = !this.open;
      this.form.packageTypeList = [];
      this.form.powerTypeList = [];
      this.form.componentTypeList = [];
      this.form.componentMaterialsList = [];
      this.form.componentModel = null;
      this.form.power = null;
    },
    getqueryList(data) {
      queryComponentList(data).then((res) => {
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
      this.getqueryList({
        idList: [],
        mainStationId: this.form.mainStationIdList, //所属组织
        subStationId: this.form.subStationIdList, //所属子期
        manufactor: this.form.manufactorList, //组件厂家(模糊查询)
        componentModel:
          this.form.componentModel == undefined
            ? null
            : this.form.componentModel, //组件型号
        power: this.form.power == undefined ? null : this.form.power, //功率
        packageType: this.form.packageTypeList, //封装形式
        powerType: this.form.powerTypeList, //发电形式
        componentType: this.form.componentTypeList, //组件分类
        componentMaterials: this.form.componentMaterialsList, //组件材料
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.idList = [];
      this.form.mainStationIdList = [];
      this.form.subStationIdList = [];
      this.form.manufactorList = [];
      this.form.packageTypeList = [];
      this.form.powerTypeList = [];
      this.form.componentTypeList = [];
      this.form.componentMaterialsList = [];
      this.form.componentModel = null;
      this.form.power = null;
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportComponentAccountList({
        idList: this.multipleSelection,
        mainStationId: this.form.mainStationIdList, //所属组织
        subStationId: this.form.subStationIdList, //所属子期
        manufactor: this.form.manufactorList, //组件厂家(模糊查询)
        componentModel:
          this.form.componentModel == undefined
            ? null
            : this.form.componentModel, //组件型号
        power: this.form.power == undefined ? null : this.form.power, //功率
        packageType: this.form.packageTypeList, //封装形式
        powerType: this.form.powerTypeList, //发电形式
        componentType: this.form.componentTypeList, //组件分类
        componentMaterials: this.form.componentMaterialsList, //组件材料
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "组件台账列表.xls"; //下载的文件名
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
  },
};
</script>

<style lang="scss" scoped>
.substation {
  .box-card {
    overflow: auto;
    height: calc(100vh - 124px);
  }
  .open {
    position: absolute;
    right: 4%;
    top: 10%;
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
  /deep/ .el-table thead {
    color: #333;
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
