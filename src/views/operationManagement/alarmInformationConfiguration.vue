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
          <el-form-item label="告警信息：">
            <el-input
              style="width: 217px"
              v-model="form.alarmInformation"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
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
          <el-form-item label="告警类别">
            <el-select
              v-model="form.alarmCategory"
              multiple
              filterable
              allow-create
              collapse-tags
              @visible-change="visibleChange"
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
          <el-form-item label="告警类型">
            <el-select
              v-model="form.warningType"
              multiple
              filterable
              @visible-change="visibleChange"
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
          <el-form-item label="告警级别" v-show="open">
            <el-select
              v-model="form.warningLevel"
              multiple
              filterable
              allow-create
              collapse-tags
              clearable
              @visible-change="visibleChange"
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
          <el-form-item label="告警编码：" v-show="open">
            <el-input
              style="width: 217px"
              v-model="form.alarmCode"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否有效：" v-show="open">
            <el-select
              v-model="form.isEffective"
              filterable
              allow-create
              collapse-tags
              @visible-change="visibleChange"
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
            <el-button type="primary" size="small" plain @click="sort(1)"
              >排序号<span class="caret-wrapper"
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
            <el-upload
              action="#"
              accept=".xls, .xlsx"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="bulkImport"
              style="float: left; margin-right: 10px"
            >
              <el-button
                type="warning"
                size="small"
                plain
                icon="el-icon-download"
                >导入
              </el-button>
            </el-upload>
            <el-button
              type="primary"
              size="small"
              plain
              @click="addAlarmInformation"
              >新增
            </el-button>
            <el-button type="danger" size="small" plain @click="deletes"
              >删除
            </el-button>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="edit"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center">
          </el-table-column>
          <el-table-column
            label="告警信息"
            prop="alarmInformation"
            align="center"
          >
          </el-table-column>
          <el-table-column label="设备类型" prop="equipmentType" align="center">
            <template slot-scope="scope">
              {{
                scope.row.equipmentType | filterOptions(equipmentTypeOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="alarmCategory"
            label="告警类别"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.alarmCategory | filterOptions(alarmCategoryOptions)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="warningType"
            label="告警类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.warningType | filterOptions(warningTypeOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="warningLevel"
            label="告警级别"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.warningLevel | filterOptions(warningLevelOptions) }}
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
import { getSelected } from "@/util/util.js";
import {
  queryConfigureList,
  remove,
  positionImport,
} from "@/api/operationManagement/alarmInformationConfiguration";
import { mapGetters } from "vuex";
export default {
  name: "componentAccount",
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
      sort2: "no",
      tableData: [],
      form: {
        alarmInformation: "",
        alarmCode: "",
        isEffective: "",
      },
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
  activated() {
    this.getqueryList({ pageNum: this.pageNum, pageSize: this.pageSize });
  },
  mounted() {
    this.getqueryList({
      idList: [],
      alarmInformation: this.form.alarmInformation, //告警信息
      alarmCategory: this.form.alarmCategory, //告警类别
      equipmentType: this.form.equipmentType, //设备类型
      warningType: this.form.warningType, //告警类型
      warningLevel: this.form.warningLevel, //告警级别
      alarmCode: this.form.alarmCode, //告警编码
      isEffective: this.form.isEffective, //告警信息
      orderColumn: this.orderColumn,
      orderType: this.orderType,
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
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        remove({
          idList: this.multipleSelection,
        }).then((res) => {
          if (res.data.code == "200") {
            this.$message({
              message: "删除成功!",
              type: "success",
            });
            this.searchData();
          } else {
            this.$message.error("删除失败");
            this.searchData();
          }
        });
      });
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
      queryConfigureList(data).then((res) => {
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
    // 下拉框收起-查询
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    //新建
    addAlarmInformation() {
      this.$router.push({
        path: "./addAlarmInformation",
      });
    },
    //详情
    edit(row) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailAlarmInformation",
        query: { id: row.id },
      });
    },
    // 查询
    searchData() {
      this.getqueryList({
        idList: [],
        alarmInformation: this.form.alarmInformation, //告警信息
        alarmCategory: this.form.alarmCategory, //告警类别
        equipmentType: this.form.equipmentType, //设备类型
        warningType: this.form.warningType, //告警类型
        warningLevel: this.form.warningLevel, //告警级别
        alarmCode: this.form.alarmCode, //告警编码
        isEffective: this.form.isEffective, //告警信息
        orderColumn: this.orderColumn,
        orderType: this.orderType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    //排序
    sort(num) {
      if (num == 1) {
        this.sort2 == "no"
          ? (this.sort2 = false)
          : this.sort2 == true
          ? (this.sort2 = "no")
          : (this.sort2 = true);
        this.orderColumn = this.sort2 == "no" ? "" : "sort";
        this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      }
      this.searchData();
    },
    // 重置主表数据
    reset() {
      this.idList = [];
      this.form.alarmInformation = "";
      this.form.alarmCategory = [];
      this.form.equipmentType = [];
      this.form.warningType = [];
      this.form.warningLevel = [];
      this.form.alarmCode = "";
      this.form.isEffective = "";
      this.orderColumn = "";
      this.sort2 = "no";
      this.orderType = "";
      this.pageNum = 1;
      this.current = 1;
      this.pageSize = 10;
      this.searchData();
    },
    // 导入
    bulkImport(file) {
      positionImport(file.raw).then((res) => {
        console.log(res);
        this.$message.success("导入成功");
        this.searchData();
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
