<template>
  <div>
    <div class="dialog-content">
      <div class="content-title">
        <el-form
          ref="dialogformx"
          :model="dialogformx"
          :inline="true"
          style="display: flex"
        >
          <el-form-item label="所属组织：">
            <el-select
              v-model="dialogformx.mainStationIdList"
              style="width: 210px"
              multiple
              filterable
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
          <el-form-item label="组织编码：">
            <el-input
              style="width: 210px"
              v-model="dialogformx.mainStationCode"
              placeholder="请输入"
              @keyup.enter.native="searchDataDialog(2)"
            />
          </el-form-item>
          <el-form-item label="组织负责人：">
            <my-select
              :options="commonUserList"
              ref="selectRef"
              v-model="dialogformx.mainStationPersonUserIds"
              @visible-change="visibleChange"
              @input="handleInput"
              :optionProp="{ value: 'userId', label: 'userName' }"
            />
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
                :label="scope.row.mainStationId"
                @change="changeRedio($event, scope.row)"
                >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column
            prop="mainStationName"
            label="所属组织"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="mainStationCode"
            label="组织编码"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="mainStationPersonName"
            label="组织负责人"
            align="center"
            show-overflow-tooltip
          >
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
import mySelect from "@/components/select/select.vue";
import { userList } from "@/api/organization/staging";
import {
  queryMainStationList,
  queryMainStationDropDownList,
} from "@/api/organization/allStation";
export default {
  components: { mySelect },
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
        mainStationIdList: [],
        mainStationCode: "",
        mainStationPersonUserIds: [],
      },
      choosePosition: [],
      getChoosePositon: [],
      chooseRedio: {},
      getChooseRedio: {},
      totalx: 0,
      pageNumx: 1,
      pageSizex: 10,
      commonUserList: [],
    };
  },
  created() {
    this.focusMainStation(2);
  },
  watch: {
    commonUserList(val) {
      if (val && val.length > 0) {
        val.forEach((ele) => {
          ele.title = ele.userName;
        });
      }
    },
  },
  mounted() {
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
    userList({ userName: "", inMyMainStation: 1 }).then((res) => {
      this.commonUserList = res.data.data;
    });
  },
  methods: {
    focusMainStation(num) {
      if (num == 2) {
        //设备
        this.focusMainDialogVisiblex = true;
        this.getList(
          {
            mainStationIdList: this.dialogformx.mainStationIdList,
            mainStationCode: this.dialogformx.mainStationCode,
            mainStationPersonUserIds: this.dialogformx.mainStationPersonUserIds,
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
        this.getList({
            mainStationIdList: this.dialogformx.mainStationIdList,
            mainStationCode: this.dialogformx.mainStationCode,
            mainStationPersonUserIds: this.dialogformx.mainStationPersonUserIds,
            pageNum: this.pageNumx,
            pageSize: this.pageSizex,
          },2);
      }
    },
    visibleChangex(val) {
      if (!val) {
        this.searchDataDialog(2);
      }
    },
    getList(data, num) {
      if (num == 2) {
        queryMainStationList(data).then((res) => {
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
    // 序号列
    indexMethod(index) {
      return index + this.current * this.pageSizex - 9;
    },
    getUserList(data) {
      userList(data).then((res) => {
        this.commonUserList = res.data.data ? res.data.data : [];
      });
    },
    handleInput(val) {
      if (val) {
        this.getUserList({
          userName: val,
          mainStationIdList: this.dialogformx.mainStationIdList,
          inMyMainStation: 0,
        });
      } else {
        this.getUserList({
          mainStationIdList: this.dialogformx.mainStationIdList,
          inMyMainStation: 1,
        });
      }
    },
    visibleChange(val) {
      if (!val) {
        this.searchDataDialog(2);
      }
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
  max-width: 114px;
  overflow: hidden;
  position: relative;
  .el-select__tags-text {
    max-width: 84px;
    overflow: hidden;
    display: inline-block;
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
