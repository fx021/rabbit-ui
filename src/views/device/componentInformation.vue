<template>
  <div class="substation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form
          ref="form"
          :model="form"
          label-width="130px"
          style="padding-right: 70px"
        >
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
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="功率(w)：">
            <el-input
              style="width: 217px"
              v-model="form.power"
              placeholder="请输入"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="封装形式：">
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
          @click="opens"
          >{{ open ? "收起" : "展开" }}</el-button
        >
      </div>
      <div class="content">
        <div class="content-title">
          <div class="left" ref="UI">
            <span style="font-size: 14px">排序：</span>
            <el-button type="primary" size="small" plain @click="sort(1)"
              >创建时间<span class="caret-wrapper">
                <i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort2 == 'no' ? '' : sort2 ? '' : colorName,
                  }"
                ></i>
                <i
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
          <!-- 右边的一些操作 -->
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
              icon="el-icon-document-checked"
              @click="changeState(1)"
              >置为有效
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-document-delete"
              @click="changeState(0)"
              >置为无效
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
              icon="el-icon-download"
              @click="handleExport"
              >导出
            </el-button>
          </div>
        </div>
        <!-- 表格数据的渲染 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="details"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column label="组件厂家" prop="manufactor" align="center">
            <template slot-scope="scope">
              {{ scope.row.manufactor | filterOptions(panelFactoryOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="componentModel"
            label="组件型号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="power"
            label="功率"
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
            prop="isEffective"
            label="是否有效"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <i
                :class="
                  scope.row.isEffective == 1
                    ? 'el-icon-success'
                    : 'el-icon-error'
                "
                :style="{
                  color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C',
                }"
              ></i>
            </template>
          </el-table-column>
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
  </div>
</template>

<script>
import {
  queryComponentTemplateList,
  exportComponentTemplateList,
  removeComponentTemplate,
  changeComponentTemplate,
} from "@/api/device/componentInformation";
import { getSelected } from "@/util/util.js";
import { mapGetters } from "vuex";
export default {
  name: "componentInformation",
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
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      form: {},
      multipleSelection: [],
      sort2: "no",
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
    filterFileName: function (value) {
      if (value) {
        return value.split("/")[value.split("/").length - 1];
      }
    },
  },
  activated() {
    this.getQueryComponentTemplateList({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
  },
  mounted() {
    this.getQueryComponentTemplateList({
      orderColumn: "", //排序列 sort,region
      orderType: "", //排序类型：desc,asc
      idList: [],
      manufactor: this.form.manufactorList, //组件厂家
      componentModel:
        this.form.componentModel == undefined ? null : this.form.componentModel, // 组件型号
      power: this.form.power == undefined ? null : this.form.power, //功率
      packageType: this.form.packageTypeList, //封装形式：单玻、双玻
      powerType: this.form.powerTypeList, //发电形式：单面、双面
      componentType: this.form.componentTypeList, //组件分类N/P型
      componentMaterials: this.form.componentMaterialsList, //组件材料：单晶、多晶、薄膜
      isEffective:
        this.form.chooseList == undefined ? null : this.form.chooseList, //是否有效
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    this.setUI()
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
      this.form.chooseList = null;
    },
    getQueryComponentTemplateList(data) {
      console.log(data);
      queryComponentTemplateList(data).then((res) => {
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
      this.getQueryComponentTemplateList({
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType,
        idList: this.multipleSelection,
        manufactor: this.form.manufactorList, //组件厂家
        componentModel:
          this.form.componentModel == undefined
            ? null
            : this.form.componentModel, // 组件型号
        power: this.form.power == undefined ? null : this.form.power, //功率
        packageType: this.form.packageTypeList, //封装形式：单玻、双玻
        powerType: this.form.powerTypeList, //发电形式：单面、双面
        componentType: this.form.componentTypeList, //组件分类N/P型
        componentMaterials: this.form.componentMaterialsList, //组件材料：单晶、多晶、薄膜
        isEffective:
          this.form.chooseList == undefined ? null : this.form.chooseList, //是否有效
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.manufactorList = [];
      this.form.componentModel = "";
      this.form.power = "";
      this.form.packageTypeList = [];
      this.form.powerTypeList = [];
      this.form.componentTypeList = [];
      this.form.componentMaterialsList = [];
      this.form.chooseList = null;
      this.sort2 = "no";
      this.orderColumn = "";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 批量删除
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        removeComponentTemplate({ idList: this.multipleSelection }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./addcomponentInformation" });
    },
    // 修改状态
    changeState(isEffective) {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      let idList = this.multipleSelection;
      changeComponentTemplate({
        idList,
        isEffective,
      }).then(() => {
        this.searchData();
      });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportComponentTemplateList({
        idList: this.multipleSelection,
        manufactor: this.form.manufactorList, //组件厂家
        componentModel:
          this.form.componentModel == undefined
            ? null
            : this.form.componentModel, // 组件型号
        power: this.form.power == undefined ? null : this.form.power, //功率
        packageType: this.form.packageTypeList, //封装形式：单玻、双玻
        powerType: this.form.powerTypeList, //发电形式：单面、双面
        componentType: this.form.componentTypeList, //组件分类N/P型
        componentMaterials: this.form.componentMaterialsList, //组件材料：单晶、多晶、薄膜
        isEffective:
          this.form.chooseList == undefined ? null : this.form.chooseList, //是否有效
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType,
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          console.log(res);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "组件模板列表.xls"; //下载的文件名
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
    // 详情
    details(data) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailcomponentInformation",
        query: { id: data.id },
      });
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    sort() {
      this.sort2 == "no"
        ? (this.sort2 = false)
        : this.sort2 == true
        ? (this.sort2 = "no")
        : (this.sort2 = true);
      this.orderColumn = this.sort2 == "no" ? "" : "create_time";
      this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      this.searchData();
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
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
  .open {
    position: absolute;
    right: 4%;
    top: 10%;
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
</style>
