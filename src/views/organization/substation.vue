<template>
  <div class="substation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
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
          <el-form-item label="子期编码：">
            <el-input
              style="width: 217px"
              v-model="form.subStationCode"
              placeholder="请输入内容"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司名称：">
            <el-select
              v-model="form.companyList"
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
                v-for="item in companyOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="子期负责人：">
            <my-select
              :options="commonUserList"
              v-model="form.subStationPersonUserIds"
              @input="handleInput"
              :optionProp="{ value: 'userId', label: 'userName' }"
            />
          </el-form-item>
          <el-form-item label="电压等级(kv)：">
            <el-select
              v-model="form.voltageLevelList"
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
                v-for="item in voltageLevelOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建设类型：">
            <el-select
              v-model="form.constructionTypeList"
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
                v-for="item in buildTypeOptions"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="隶属集团公司：">
            <el-select
              v-model="form.ownerGroupList"
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
                v-for="item in ownerGroupOptions"
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
            <!-- <el-button type="primary" size="small" plain @click="sort(0)"
              >所属地区<span class="caret-wrapper"
                ><i
                  class="sort-caret ascending"
                  :style="{
                    borderBottomColor:
                      sort1 == 'no' ? '' : sort1 ? '' : '#409eff',
                  }"
                ></i
                ><i
                  class="sort-caret descending"
                  :style="{
                    borderTopColor: sort1 == 'no' ? '' : sort1 ? '#409eff' : '',
                  }"
                ></i
              ></span>
            </el-button> -->
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
            <!-- v-if="userInfo.role_name.includes('admin')" -->
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
          style="width: 100%;"
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
            label="所属子期"
            prop="subStationName"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="subStationCode"
            label="子期编码"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="公司名称"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                companyOptions[scope.row.companyName * 1 - 1]
                  ? companyOptions[scope.row.companyName * 1 - 1].dictValue
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="filingCapacity"
            label="备案容量(MW)"
            align="center"
            show-overflow-tooltip
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="voltageLevel"
            label="电压等级(kv)"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                voltageLevelOptions[scope.row.voltageLevel * 1 - 1]
                  ? voltageLevelOptions[scope.row.voltageLevel * 1 - 1]
                      .dictValue
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="subStationPersonName"
            label="子期负责人"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="subStationPersonPhone"
            label="联系方式"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="constructionType"
            label="建设类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                buildTypeOptions[scope.row.constructionType * 1 - 1]
                  ? buildTypeOptions[scope.row.constructionType * 1 - 1]
                      .dictValue
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ownerGroup"
            label="隶属集团"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                ownerGroupOptions[scope.row.ownerGroup * 1 - 1]
                  ? ownerGroupOptions[scope.row.ownerGroup * 1 - 1].dictValue
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="isEffective"
            label="状态"
            show-overflow-tooltip
            align="center"
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
          style="font-size: 24px;padding: 6px;transform: rotate(180deg);"
        ></el-button>
      </el-backtop>
    </el-card>
  </div>
</template>

<script>
import {
  querySubStationList,
  querySubStationDropDownList,
  changeSubStationEffective,
  exportSubStationList,
  removeSubStation,
} from "@/api/organization/substation";
import { userList } from "@/api/organization/staging";
import mySelect from "@/components/select/select.vue";
import { mapGetters } from "vuex";
import { getSelected } from "@/util/util.js";
export default {
  name: "index",
  components: { mySelect },
  data() {
    return {
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      subStationOptions: [],
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      form: {
        organization: [],
        region: [],
        subStationPersonUserIds: [],
      },
      multipleSelection: [],
      sort1: "no",
      sort2: "no",
      ownerGroupOptions: JSON.parse(
        window.localStorage.getItem("ownerGroupOptions")
      ),
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      commonUserList: [],
      voltageLevelOptions: JSON.parse(
        window.localStorage.getItem("voltageLevelOptions")
      ),
      buildTypeOptions: JSON.parse(
        window.localStorage.getItem("buildTypeOptions")
      ),
      c: [],
    };
  },
  created() {},
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
  },
  mounted() {
    this.getQuerySubStationList({
      orderColumn: "", //排序列 sort,region
      orderType: "", //排序类型：desc,asc
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    userList({ userName: "", inMyMainStation: 1 }).then((res) => {
      this.commonUserList = res.data.data;
    });
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查询
    searchData() {
      this.getQuerySubStationList({
        subStationIdList: this.form.subStationIdList,
        subStationCode: this.form.subStationCode,
        companyList: this.form.companyList,
        subStationPersonName: this.form.subStationPersonName,
        voltageLevelList: this.form.voltageLevelList,
        constructionTypeList: this.form.constructionTypeList,
        ownerGroupList: this.form.ownerGroupList,
        subStationPersonUserIds: this.form.subStationPersonUserIds,
        orderColumn: this.orderColumn, //排序列 sort,region
        orderType: this.orderType, //排序类型 desc降序,asc升序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.subStationIdList = [];
      this.form.subStationCode = "";
      this.form.companyList = [];
      this.form.subStationPersonUserIds = [];
      this.form.subStationPersonName = "";
      this.form.voltageLevelList = [];
      this.form.constructionTypeList = [];
      this.form.ownerGroupList = [];
      // this.form.organization = [];
      // this.form.region = [];
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
        let subStationIdList = [];
        this.multipleSelection.forEach((item) => {
          subStationIdList.push(item.id);
        });
        removeSubStation({ subStationIdList }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newSubstation" });
    },
    // 修改状态
    changeState(isEffective) {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      let subStationIdList = [];
      this.multipleSelection.forEach((item) => {
        subStationIdList.push(item.id);
      });
      console.log(subStationIdList, isEffective);
      changeSubStationEffective({
        subStationIdList,
        isEffective,
      }).then(() => {
        this.searchData();
      });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      exportSubStationList({
        subStationIdList: this.form.subStationIdList,
        subStationCode: this.form.subStationCode,
        companyList: this.form.companyList,
        subStationPersonName: this.form.subStationPersonName,
        voltageLevelList: this.form.voltageLevelList,
        constructionTypeList: this.form.constructionTypeList,
        ownerGroupList: this.form.ownerGroupList,
        subStationPersonUserIds: this.form.subStationPersonUserIds,
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
          link.download = "子期列表.xls"; //下载的文件名
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
    getUserList(data) {
      userList(data).then((res) => {
        console.log(res.data.data);
        this.commonUserList = res.data.data ? res.data.data : [];
      });
    },
    handleInput(val) {
      if (val) {
        this.getUserList({
          userName: val,
          subStationIdList: this.form.subStationIdList,
          inMyMainStation: 0,
        });
      } else {
        this.getUserList({
          subStationIdList: this.form.subStationIdList,
          inMyMainStation: 1,
        });
      }
    },
    sort() {
      this.sort1 = "no";
      this.sort2 == "no"
        ? (this.sort2 = false)
        : this.sort2 == true
        ? (this.sort2 = "no")
        : (this.sort2 = true);
      this.orderColumn = this.sort2 == "no" ? "" : "sort";
      this.orderType = this.sort2 == "no" ? "" : this.sort2 ? "desc" : "asc";
      this.searchData();
    },
    // 详情
    details(data) {
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailsSubstation",
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
    }
    /deep/.el-table__header-wrapper {
      .cell {
        color: #333;
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
