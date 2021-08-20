<template>
  <div class="automaticAllocation">
    <el-card class="box-card">
      <div class="title-content" style="display: flex">
        <el-form ref="form" :model="form" label-width="130px">
          <el-form-item label="名称：">
            <el-input
              v-model="form.title"
              style="width: 217px"
              placeholder="请输入内容"
              @keyup.enter.native="searchData"
            ></el-input>
          </el-form-item>
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
          <el-form-item label="设备：">
            <el-tooltip
              class="item"
              effect="dark"
              :content="form.positionNameList"
              placement="top"
              :disabled="!form.positionNameList"
            >
              <el-input
                v-model="form.positionNameList"
                placeholder="请选择"
                ref="equipmentRef"
                clearable
                @focus="focusEquipment"
              ></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="出勤类型：">
            <el-input
              v-model="form.attendanceTypeName"
              placeholder="请选择"
              ref="equipmentRef"
              clearable
              @focus="attendanceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否有效：" prop="isEffective">
            <el-select
              v-model="form.isEffective"
              filterable
              allow-create
              collapse-tags
              clearable
              default-first-option
              placeholder="请选择"
              @visible-change="visibleChange"
            >
              <el-option
                v-for="item in isEffectiveList"
                :key="item.isEffectiveId"
                :label="item.isEffectiveName"
                :value="item.isEffectiveId"
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
          style="width: 100%; overflow-y: auto"
          @selection-change="handleSelectionChange"
          @row-click="details"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="mainStationName"
            label="所属组织"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="attendanceTypeName"
            label="出勤类型"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="isEffective"
            label="是否有效"
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
    <!-- 设备 -->
    <el-dialog
      title="选择出勤类型"
      :visible.sync="equipmentVisible"
      v-if="equipmentVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1150px"
      :top="'8vh'"
    >
      <Position
        ref="positionRef"
        :Single="false"
        :mainStationIdList="
          form.mainStationIdList ? form.mainStationIdList : []
        "
        :subStationIdList="[]"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEquipment">取 消</el-button>
        <el-button type="primary" @click="equipmentAdd">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 出勤类型 -->
    <el-dialog
      title="选择设备"
      :visible.sync="attendanceVisible"
      v-if="attendanceVisible"
      append-to-body
      class="focus-main-dialogs"
      width="1150px"
      :top="'8vh'"
    >
      <Attendance ref="attendanceType" :Single="true" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAttendance">取 消</el-button>
        <el-button type="primary" @click="attendanceAdd">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  distributeQueryPage,
  distributeRemove,
  distributeExportList,
} from "@/api/taskApplication/automaticAllocation";
import { mapGetters } from "vuex";
import mySelect from "@/components/select/select.vue";
import { getSelected } from "@/util/util.js";
import Position from "@/components/dialog/postionDialogs.vue";
import Attendance from "@/components/dialog/attendanceDialog.vue";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
export default {
  name: "automaticAllocation",
  components: { mySelect, Position, Attendance },
  data() {
    return {
      total: 0,
      current: 1,
      pageNum: 1,
      pageSize: 10,
      mainStationOptions: [],
      frequencyOptions: JSON.parse(
        window.localStorage.getItem("frequencyOptions")
      ),
      orderColumn: "",
      orderType: "",
      value: [],
      tableData: [],
      form: {
        title: "",
        positionIdList: [],
        positionNameList: "",
        isEffective: "",
        attendanceTypeCode: "",
        attendanceTypeName: "",
        mainStationIdList: [],
      },
      multipleSelection: [],
      isEffectiveList: [
        {
          isEffectiveId: 1,
          isEffectiveName: "有效",
        },
        {
          isEffectiveId: 0,
          isEffectiveName: "无效",
        },
      ],
      sort1: "no",
      equipmentVisible: false, // 设备弹窗
      attendanceVisible: false, // 出勤弹窗
    };
  },
  created() {},
  computed: {
    ...mapGetters(["colorName"]),
  },
  activated() {
    let refresh = this.$route.params.refresh;
    if (refresh) {
      this.searchData();
    }
  },
  mounted() {
    this.getdistributeQueryPage({
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    this.setUI();
  },
  methods: {
    setUI() {
      this.$refs.UI.style.setProperty("--color", this.colorName); //给变量赋值
    },
    getdistributeQueryPage(data) {
      console.log(data);
      distributeQueryPage(data).then((res) => {
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
      this.getdistributeQueryPage({
        title: this.form.title,
        positionIdList: this.form.positionIdList,
        positionNameList: this.form.positionNameList,
        attendanceTypeCode: this.form.attendanceTypeCode,
        mainStationIdList: this.form.mainStationIdList,
        isEffective: this.form.isEffective,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 重置主表数据
    reset() {
      this.form.title = "";
      this.form.positionIdList = [];
      this.form.positionNameList = "";
      this.form.attendanceTypeCode = "";
      this.form.attendanceTypeName = "";
      this.form.mainStationIdList = [];
      this.form.isEffective = "";
      this.current = 1;
      this.pageNum = 1;
      this.pageSize = 10;
      this.orderColumn = "";
      this.orderType = "";
      this.searchData();
    },
    // 批量删除
    deletes() {
      if (this.multipleSelection.length == 0)
        return this.$message.warning("请选择至少一条数据");
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        let distributeIdList = [];
        this.multipleSelection.forEach((item) => {
          distributeIdList.push(item.distributeId);
        });
        distributeRemove({ distributeIdList }).then(() => {
          this.searchData();
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.$router.push({ path: "./newOperationAutomaticAllocation" });
    },
    // 详情
    details(data) {
      console.log(data);
      const sel = getSelected();
      if (sel) {
        return;
      }
      this.$router.push({
        path: "./detailOperationAutomaticAllocation",
        query: { id: data.distributeId },
      });
    },
    // 导出
    handleExport() {
      if (this.tableData.length < 1) return;
      distributeExportList({
        title: this.form.title,
        positionIdList: this.form.positionIdList,
        positionNameList: this.form.positionNameList,
        attendanceTypeCode: this.form.attendanceTypeCode,
        mainStationIdList: this.form.mainStationIdList,
        isEffective: this.form.isEffective,
        orderColumn: this.orderColumn,
        orderType: this.orderType,
      })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          // link.download = res.headers['content-disposition'] //下载后文件名
          link.download = "自动派发列表.xls"; //下载的文件名
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
    //todo ----------------------------
    // 出勤类型弹窗
    attendanceType() {
      this.attendanceVisible = true;
    },
    // 出勤类型弹窗 - 取消
    cancelAttendance() {
      this.attendanceVisible = false;
    },
    // 出勤类型弹窗 - 添加
    attendanceAdd() {
      this.attendanceVisible = false;
      console.log(this.$refs["attendanceType"].chooseRedio);
      this.form.attendanceTypeName =
        this.$refs["attendanceType"].chooseRedio.attendanceTypeName;
      this.form.attendanceTypeCode =
        this.$refs["attendanceType"].chooseRedio.attendanceTypeCode;
    },
    // 设备名称弹窗
    focusEquipment() {
      this.equipmentVisible = true;
      this.$refs.equipmentRef.blur();
    },
    // 设备名称弹窗 - 添加
    equipmentAdd() {
      this.equipmentVisible = false;
      console.log(this.$refs["positionRef"].choosePosition);
      let arrName = [];
      let arrId = [];
      this.$refs["positionRef"].choosePosition.forEach((item) => {
        arrName.push(item.positionName);
        arrId.push(item.id);
      });
      console.log(arrName);
      this.form.positionNameList = arrName.toString();
      this.form.positionIdList = arrId;
    },
    // 设备名称弹窗 - 取消
    cancelEquipment() {
      this.equipmentVisible = false;
    },
    sort(num) {
      if (num == 0) {
        this.orderColumn = "create_time";
        this.sort1 == "no"
          ? (this.sort1 = false)
          : !this.sort1
          ? (this.sort1 = !this.sort1)
          : ((this.sort1 = "no"), (this.orderColumn = ""));
        this.orderType = this.sort1 === "no" ? "" : this.sort1 ? "desc" : "asc";
      }
      this.searchData();
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
.automaticAllocation {
  .box-card {
    overflow-y: auto;
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
