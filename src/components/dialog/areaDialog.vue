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
          <el-form-item label="方阵名称：">
            <el-input
              style="width: 197px"
              v-model="form.areaName"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="方阵编码：">
            <el-input
              style="width: 197px"
              v-model="form.areaCode"
              @keyup.enter.native="searchData"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否有效：">
            <el-select
              v-model="form.isEffective"
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
                v-for="item in isEffectiveOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
            prop="areaName"
            label="方阵名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="areaCode"
            label="方阵编码"
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
                  color: scope.row.isEffective == 1 ? '#67C23A' : '#F56C6C'
                }"
              ></i>
            </template>
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
import { queryList } from "@/api/device/matrix";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import { querySubStationDropDownList } from "@/api/organization/substation";
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
    subStationIdList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    displayId: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      isEffectiveOptions: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        }
      ],
      equipmentTypeOptions: JSON.parse(
        window.localStorage.getItem("equipmentTypeOptions")
      ),
      displayData: this.displayId,
      tableData: [],
      currentRowId: "",
      form: {
        mainStationPersonName: "",
        mainStationCode: "",
        mainStationId: [],
        subStationId: [],
        equipmentTypeList: this.equipmentTypeList
      },
      chooseSelection: [],
      chooseRadio: {},
      total: 0,
      pageNum: 1,
      pageSize: 10
    };
  },
  created() {
    queryMainStationDropDownList({ keyWord: "" }).then(res => {
      this.mainStationOptions = res.data.data;
      this.form.mainStationId = this.mainStationIdList;
      this.getData();
    });
    querySubStationDropDownList({
      mainStationIdList: this.form.mainStationId
    }).then(res => {
      this.subStationOptions = res.data.data;
    });
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
      queryList(data).then(res => {
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
        this.tableData.forEach(ele => {
          this.displayData.forEach(item => {
            if (ele.id === item && !this.Single) {
              this.$refs.equipmentRef.toggleRowSelection(ele, true);
            }
          });
        });
        if (this.Single) {
          this.tableData.forEach(e => {
            if (this.displayData[0] == e.id) {
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
      this.chooseRadio = row;
    },
    handleSelect(val, row) {
      console.log(val, row);
    },
    handleSelectionChangex(val) {
      this.chooseSelection = val;
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
