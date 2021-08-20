<template>
  <div>
    <div class="dialog-content">
      <div class="content-title">
        <el-form
          ref="dialogformx"
          :model="dialogformx"
          label-width="130px"
          style="display: flex; flex-wrap: wrap"
        >
          <el-form-item label="出勤类型：">
            <el-input
              style="width: 217px"
              v-model="dialogformx.attendanceTypeName"
              placeholder="请输入内容"
              @keyup.enter.native="searchDataDialog(2)"
            ></el-input>
          </el-form-item>
          <el-form-item label="出勤编码：">
            <el-input
              style="width: 217px"
              v-model="dialogformx.attendanceTypeCode"
              placeholder="请输入内容"
              @keyup.enter.native="searchDataDialog(2)"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否有效：">
            <el-select
              style="width: 217px"
              v-model="dialogformx.isEffective"
              @visible-change="visibleChange"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              style="margin-bottom: 20px"
              @click="searchDataDialog(2)"
              >查询</el-button
            >
          </div>
        </el-form>
      </div>
      <div class="content-table">
        <el-table
          :data="tableDatax"
          style="width: 100%"
          ref="equipmentRef"
          @select="handleSelect"
          @selection-change="handleSelectionChangex($event)"
          :row-key="getRowKey"
        >
          <el-table-column
            v-if="!Single"
            type="selection"
            label=""
            :selectable="checkboxInit"
            width="50"
            align="center"
            reserve-selection
          >
          </el-table-column>
          <el-table-column
            type="index"
            label=""
            width="38"
            align="center"
            v-if="Single"
          >
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
            label="出勤类型"
            prop="attendanceTypeName"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attendanceTypeCode"
            label="出勤编码"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="isOnDuty"
            label="是否值班"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <i
                :class="
                  scope.row.isOnDuty == 1 ? 'el-icon-success' : 'el-icon-error'
                "
                :style="{
                  color: scope.row.isOnDuty == 1 ? '#67C23A' : '#F56C6C',
                }"
              ></i>
            </template>
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
        <div class="pagination">
          <el-pagination
            layout="total,sizes,prev,pager,next"
            @size-change="handleSizeChange"
            :total="totalx"
            :page-size="pageSizex"
            background
            :current-page.sync="current"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryPageList } from "@/api/backstage/attendance.js";
export default {
  props: {
    Single: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // disabled: {
    //   type: Boolean,
    //   default: () => {
    //     return false;
    //   },
    // },
    // mainStationIdList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    // },
    // equipmentName: {
    //   type: String,
    //   default: () => {
    //     return "";
    //   },
    // },
    // positionIdList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    // },
  },
  data() {
    return {
      option: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      //   positionNames: this.positionIdList,
      focusMainDialogVisiblex: false,
      tableDatax: [],
      currentRowId: "",
      dialogformx: {
        isEffective: "",
        attendanceTypeCode: "",
        attendanceTypeName: "",
        isOnDuty: 1,
      },
      choosePosition: [],
      getChoosePositon: [],
      chooseRedio: {},
      getChooseRedio: {},
      totalx: 0,
      pageNumx: 1,
      pageSizex: 10,
    };
  },
  created() {
    this.focusMainStation(2);
  },
  methods: {
    focusMainStation(num) {
      if (num == 2) {
        //设备
        this.focusMainDialogVisiblex = true;
        this.getList(
          {
            isEffective: this.dialogformx.isEffective,
            attendanceTypeCode: this.dialogformx.attendanceTypeCode,
            attendanceTypeName: this.dialogformx.attendanceTypeName,
            isOnDuty: 1,
            pageNum: this.pageNumx,
            pageSize: this.pageSizex,
          },
          2
        );
      }
    },
    cancel() {
      this.focusMainDialogVisiblex = false;
      this.$refs.equipmentRef.clearSelection();
    },
    searchDataDialog(num) {
      if (num == 2) {
        this.getList(
          {
            isEffective: this.dialogformx.isEffective,
            attendanceTypeCode: this.dialogformx.attendanceTypeCode,
            attendanceTypeName: this.dialogformx.attendanceTypeName,
            isOnDuty: 1,
            pageNum: this.pageNumx,
            pageSize: this.pageSizex,
          },
          2
        );
      }
    },
    visibleChangex(val) {
      if (!val) {
        this.searchDataDialog(2);
      }
    },
    getList(data, num) {
      if (num == 2) {
        queryPageList(data).then((res) => {
          this.tableDatax = res.data.data.pageData;
          this.pageNumx = res.data.data.pageNum;
          this.pageSizex = res.data.data.pageSize;
          this.totalx = res.data.data.total;
        });
      }
    },
    getRowKey(row) {
      return row.id;
    },
    changeRedio(event, row) {
      this.chooseRedio = row;
    },
    handleSelect(val, row) {
      console.log(val, row);
    },
    handleSelectionChangex(val) {
      this.choosePosition = val;
    },
    // principalAddx() {
    //   this.positionNames = [];
    //   this.getChoosePositon = [];
    //   this.getChooseRedio = {};
    //   if (!this.Single) {
    //     if (this.choosePosition[0] != undefined) {
    //       this.choosePosition.forEach((v) => {
    //         this.positionNames.push(v.positionName);
    //         this.getChoosePositon.push(v);
    //       });
    //     }
    //   } else {
    //     if (this.chooseRedio.hasOwnProperty("positionName")) {
    //       this.getChooseRedio = this.chooseRedio;
    //       this.positionNames = [this.chooseRedio.positionName];
    //     }
    //   }
    //   this.focusMainDialogVisiblex = false;
    //   this.$refs.equipmentRef.clearSelection();
    // },
    // 重置
    clear() {
      this.positionNames = [];
      this.chooseRedio = {};
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNumx = pageNum;
      this.searchDataDialog(2);
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSizex = val;
      this.searchDataDialog(2);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
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
.dialog-content {
  .content-title {
    display: flex;
    /deep/.el-button--medium {
      padding: 13px 20px;
      margin-left: 30px;
    }
  }
  .content-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
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
</style>
