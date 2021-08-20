<template>
  <div>
    <div class="dialog-content">
      <div class="content-title">
        <el-form
          ref="form"
          :model="form"
          label-width="110px"
          style="display: flex; flex-wrap: wrap"
        >
          <el-form-item label="所属组织：">
            <el-select
              v-model="form.mainStationId"
              filterable
              allow-create
              multiple
              collapse-tags
              @change="changeMainStation"
              :disabled="mainStationIdList.length > 0"
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
          <el-form-item label="所属子期：">
            <el-select
              v-model="form.subStationId"
              filterable
              allow-create
              multiple
              collapse-tags
              :disabled="subStationIdList.length > 0"
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
          <el-form-item label="设备位置名称：" v-show="false">
            <el-input
              style="width: 217px"
              @keyup.enter.native="searchData()"
              v-model="form.equipmentName"
              clearable
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型：">
            <el-select
              v-model="form.equipmentTypeList"
              filterable
              allow-create
              multiple
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
          <el-form-item label="设备品牌：" v-show="false">
            <el-input
              style="width: 217px"
              v-model="form.manufactor"
              @keyup.enter.native="searchData()"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备型号：" v-show="false">
            <el-input
              style="width: 217px"
              v-model="form.equipmentModel"
              @keyup.enter.native="searchData()"
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
          </div>
        </el-form>
      </div>
      <div class="content-table">
        <el-table
          :data="tableData"
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
  </div>
</template>

<script>
import { positionList } from "@/api/device/equipmentLocation";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
import { queryCheckEquipmentDetailList } from "@/api/planManage/deviceInspection";
export default {
  props: {
    Single: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    mainStationIdList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    equipmentName: {
      type: String,
      default: () => {
        return "";
      }
    },
    equipmentTypeList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    subStationIdList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    positionIdList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      positionNames: this.positionIdList,
      showData: [],
      tableData: [],
      currentRowId: "",
      form: {
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: [],
        subStationId: [],
        equipmentTypeList: this.equipmentTypeList
      },
      choosePosition: [],
      chooseRedio: {},
      total: 0,
      pageNum: 1,
      pageSize: 10
    };
  },
  created() {
    queryMainStationDropDownList({ keyWord: "" }).then(res => {
      this.mainStationOptions = res.data.data;
      this.form.mainStationId = this.mainStationIdList;
      querySubStationDropDownList({
        mainStationIdList: this.form.mainStationId
      }).then(res => {
        this.subStationOptions = res.data.data;
        this.form.subStationId = this.subStationIdList;
        this.getData();
      });
    });
    if (this.positionIdList.length > 0) {
      queryCheckEquipmentDetailList({
        positionIdList: this.positionIdList
      }).then(res => {
        this.showData = res.data.data;
        this.showData.forEach((item, index) => {
          item.id = item.positionId;
        });
      });
    }
  },
  methods: {
    getData() {
      //设备
      this.getList({
        mainStationIdList: this.form.mainStationId,
        subStationIdList: this.form.subStationId,
        equipmentTypeList: this.form.equipmentTypeList,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
    },
    searchData() {
      this.getList({
        mainStationIdList: this.form.mainStationId,
        subStationIdList: this.form.subStationId,
        equipmentName: this.form.equipmentName,
        equipmentTypeList: this.form.equipmentTypeList,
        manufactor: this.form.manufactor,
        equipmentModel: this.form.equipmentModel,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
    },
    visibleChange(val) {
      if (!val) {
        this.searchData();
      }
    },
    getList(data) {
      positionList(data).then(res => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        this.tableData.forEach(ele => {
          this.positionNames.forEach(item => {
            if (ele.id === item && !this.Single) {
              this.$refs.equipmentRef.toggleRowSelection(ele, true);
            }
          });
        });
        if (this.Single) {
          this.tableData.forEach(e => {
            if (this.positionNames[0] == e.id) {
              this.currentRowId = e.id;
              this.changeRedio(true, e);
            }
          });
        }
      });
    },
    // change 组织
    changeMainStation() {
      this.form.subStationId = [];
      querySubStationDropDownList({
        mainStationIdList: this.form.mainStationId
      }).then(res => {
        this.subStationOptions = res.data.data;
      });
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
      if (this.showData.length > 0) {
        this.choosePosition.forEach(ele => {
          this.showData.forEach((item, index) => {
            if (ele.id === item.id) {
              this.showData.splice(index, 1);
            }
          });
        });
      }
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
    }
  }
};
</script>

<style <style lang="scss" scoped>
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
  .title-btn {
    margin-left: 50px;
    margin-bottom: 20px;
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
