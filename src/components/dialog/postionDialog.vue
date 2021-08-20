<template>
  <div>
    <el-form-item label="设备名称：" prop="equipmentType">
      <div style="display: flex">
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            positionNames.length == 0
              ? '暂无所选设备'
              : '所选设备:' + positionNames.toString()
          "
          placement="top"
        >
          <el-input
            disabled="disabled"
            v-model="positionNames"
            style="width: 150px"
          >
          </el-input>
        </el-tooltip>
        <el-button
          type="primary"
          size="small"
          plain
          @click="focusMainStation(2)"
          >请选择
        </el-button>
      </div>
    </el-form-item>
    <!-- 绑定设备弹窗 -->
    <el-dialog
      title="选择绑定设备"
      :visible.sync="focusMainDialogVisiblex"
      append-to-body
      class="focus-main-dialog"
      width="1147px"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogformx"
            :model="dialogformx"
            label-width="130px"
            style="display: flex; flex-wrap: wrap"
          >
            <el-form-item label="所属组织：">
              <el-select
                v-model="dialogformx.mainStationId"
                filterable
                allow-create
                collapse-tags
                @change="changes"
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChangex"
              >
                <el-option
                  v-for="item in mainStationList"
                  :key="item.id"
                  :label="item.mainStationName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属子期：">
              <el-select
                v-model="dialogformx.subStationId"
                filterable
                allow-create
                collapse-tags
                @change="changes"
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChangex"
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
                @keyup.enter.native="searchDataDialog(2)"
                v-model="dialogformx.equipmentName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备类型：">
              <el-select
                v-model="dialogformx.equipmentTypeList"
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
                @visible-change="visibleChangex"
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
            <el-form-item label="设备品牌：" v-show="false">
              <el-input
                style="width: 217px"
                v-model="dialogformx.manufactor"
                @keyup.enter.native="searchDataDialog(2)"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备型号：" v-show="false">
              <el-input
                style="width: 217px"
                v-model="dialogformx.equipmentModel"
                @keyup.enter.native="searchDataDialog(2)"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <div>
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-search"
                style="margin-left: 691px"
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
          </el-table>
          <div class="pagination">
            <el-pagination
              layout="total,sizes,prev,pager,next"
              @size-change="handleSizeChange"
              :total="totalx"
              :page-size="pageSize"
              background
              :current-page.sync="current"
              @current-change="handlePageChange"
            ></el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="principalAddx">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { positionList } from "@/api/device/equipmentLocation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
export default {
  props: {
    Single: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      positionNames: [],
      focusMainDialogVisiblex: false,
      tableDatax: [],
      currentRowId: "",
      dialogformx: {
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: "",
        subStationId: "",
        equipmentTypeList: "",
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
  mounted() {
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.subStationOptions = res.data.data;
    });
    queryMainStationDropDownList({ keyWord: "" }).then((res) => {
      this.mainStationOptions = res.data.data;
    });
  },
  methods: {
    focusMainStation(num) {
      this.dialogformx = {
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: "",
        subStationId: "",
        equipmentTypeList: this.dialogformx.equipmentTypeList,
      };
      if (num == 2) {
        //设备
        this.focusMainDialogVisiblex = true;
        this.getList(
          {
            mainStationIdList: [this.dialogformx.mainStationId],
            subStationIdList: [this.dialogformx.subStationId],
            equipmentTypeList: [this.dialogformx.equipmentTypeList],
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
        // this.$refs.equipmentRef.clearSelection();
        this.positionNames = [];
        this.getList(
          {
            mainStationIdList: [this.dialogformx.mainStationId],
            subStationIdList: [this.dialogformx.subStationId],
            equipmentName: this.dialogformx.equipmentName,
            equipmentTypeList: [this.dialogformx.equipmentTypeList],
            manufactor: this.dialogformx.manufactor,
            equipmentModel: this.dialogformx.equipmentModel,
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
        positionList(data).then((res) => {
          this.tableDatax = res.data.data.pageData;
          this.pageNumx = res.data.data.pageNum;
          this.pageSizex = res.data.data.pageSize;
          this.totalx = res.data.data.total;
          this.tableDatax.forEach((ele) => {
            this.positionNames.forEach((item) => {
              if (ele.positionName === item && !this.Single) {
                this.$refs.equipmentRef.toggleRowSelection(ele, true);
              }
            });
          });
          if (this.Single) {
            this.tableDatax.forEach((e) => {
              if (this.positionNames[0] == e.positionName) {
                this.currentRowId = e.id;
              }
            });
          }
        });
      }
    },
    getRowKey(row) {
      return row.id;
    },
    changeRedio(event, row) {
      this.chooseRedio = row;
    },
    handleSelectionChangex(val) {
      this.choosePosition = val;
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
    principalAddx() {
      this.positionNames = [];
      this.getChoosePositon = [];
      this.getChooseRedio = {};
      if (!this.Single) {
        if (this.choosePosition[0] != undefined) {
          this.choosePosition.forEach((v) => {
            this.positionNames.push(v.positionName);
            this.getChoosePositon.push(v);
          });
        }
      } else {
        if (this.chooseRedio.hasOwnProperty("positionName")) {
          this.getChooseRedio = this.chooseRedio;
          this.positionNames = [this.chooseRedio.positionName];
        }
      }
      this.focusMainDialogVisiblex = false;
      this.$refs.equipmentRef.clearSelection();
    },
    clear() {
      this.positionNames = [];
      this.chooseRedio = {};
    },
  },
};
</script>

<style>
</style>