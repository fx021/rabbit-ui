<template>
  <div class="tree-components">
    <div style="margin-left: 20px">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        style="width: 400px; margin-bottom: 10px"
      >
      </el-input>
      <el-tree
        :data="data"
        :props="props"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
    </div>
    <div style="margin-left: 20px; width: calc(100vw)" v-if="showRight">
      <div class="title">
        用户姓名：<el-input
          v-model="userName"
          placeholder="请输入"
          style="width: 300px; margin-right: 20px"
        ></el-input>
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          @click="searchData"
          >查询</el-button
        >
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            type="index"
            label=""
            width="50"
            align="center"
            v-if="choice"
          >
            <template slot-scope="scope">
              <el-radio
                v-model="currentRowId"
                :label="scope.row.id"
                @change="changeRedio($event, scope.row)"
                >{{ "" }}</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column type="selection" v-else></el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="indexMethod"
          >
          </el-table-column>
          <el-table-column
            prop="account"
            label="登录账号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="realName"
            label="用户姓名"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="所属角色"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="所属部门"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total,sizes,prev,pager,next"
          @size-change="handleSizeChange"
          :total="total"
          :page-size="size"
          background
          :current-page.sync="current"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { page } from "@/api/organization/allStation";
export default {
  name: "Tree",
  data() {
    return {
      treeData: [],
      filterText: "",
      currentRowId: "",
      userName: "",
      deptId: "",
      current: 1,
      size: 10,
      total: 0
    };
  },
  props: {
    data: {},
    props: {},
    tableList: {},
    showRight: {
      type: Boolean,
      default: true
    },
    choice: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      this.deptId = data.id;
      this.handleNodeItem = data;
      let str = {
        current: this.current,
        size: this.size,
        deptId: data.id,
        realName: this.userName
      };
      this.getPage(str);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    // 表格多选
    handleSelectionChange(val) {
      console.log("row", val);
      this.$emit("selectData", val);
    },
    // 表格单选
    changeRedio(event, row) {
      console.log("row", row);
      this.$emit("selectData", row);
    },
    // 查询
    searchData() {
      this.getPage({
        current: this.current,
        size: this.size,
        deptId: this.deptId,
        realName: this.userName
      });
    },
    // 用户列表获取
    getPage(str) {
      page(str).then(res => {
        console.log("page", res.data.data);
        if (this.showRight) {
          this.currentRowId = "";
          this.tableList = res.data.data.records;
          this.total = res.data.data.total;
        } else {
          this.$emit("selectData", {
            name: this.handleNodeItem.title,
            id: this.handleNodeItem.id,
            listLength: res.data.data.records.length
          });
        }
      });
    }
  },
  destroyed() {
    this.tableList = [];
    this.treeData = [];
    this.filterText = "";
    this.currentRowId = "";
    this.userName = "";
    this.deptId = "";
    this.current = 1;
    this.size = 10;
    this.total = 0;
  },
  // 序号列
  indexMethod(index) {
    return index + this.current * this.size - 9;
  },
  // 翻页事件
  handlePageChange(current) {
    this.current = current;
    this.searchData();
  },
  // 每页条数
  handleSizeChange(val) {
    this.size = val;
    this.searchData();
  }
};
</script>
<style lang="scss" scoped>
.tree-components {
  display: flex;
  // .el-table_2_column_14 {
  // }
  .el-input__inner {
    height: 30px;
  }
  // /deep/.el-table__body,
  // /deep/.el-table__footer,
  // /deep/.el-table__header {
  //   // width: 480px !important;
  // }
  /deep/.el-table th,
  .el-table tr {
    background-color: #fafafa;
  }
  /deep/.el-table th {
    .cell {
      color: #333;
    }
  }
  .title {
    margin-bottom: 20px;
  }
  .table {
    // width: 660px;
    .el-pagination {
      text-align: right;
      margin-top: 20px;
    }
  }
}
</style>
