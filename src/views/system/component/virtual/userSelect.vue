<template>
  <div class="user-select">
    <avue-crud
      :data="selectLeaderTableData"
      :option="selectLeaderTableOption"
      :page.sync="selectLeaderTablePage"
      @on-load="onSelectLeaderTableLoad"
      @current-row-change="handleSelectLeaderChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      :table-loading="loading"
      ref="crud"
    ></avue-crud>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleChooseLeader">选 择</el-button>
      <el-button @click="$emit('cancel')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getUserSelectList } from "@/api/system/virtualorganization";

export default {
  data() {
    return {
      leaderSelected: null,
      loading:false,
      selectLeaderTableData: [],
      selectLeaderTableOption: {
        height: "auto",
        addBtn: false,
        delBtn: false,
        cellBtn: false,
        menu:false,
        header:false,
        highlightCurrentRow: true,
        editBtn: false,
        calcHeight: 250,
        selectable: (row) => {
          return row.isChoice !== 0;
        },
        tip: false,
        reserveSelection: true,
        selectClearBtn: true,
        column: [
          {
            label: "登录账号",
            prop: "account",
            search: true,
            display: false,
          },
          {
            label: "用户姓名",
            prop: "realName",
            search: true,
            display: false,
          },
        ],
      },
      selectLeaderTablePage: {
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 20, 50, 100],
        total: 0,
      },
    };
  },
  methods: {
    handleSelectLeaderChange(val) {
      this.leaderSelected = val;
    },

    handleChooseLeader() {
      this.$emit("choose", this.leaderSelected);
    },

    onSelectLeaderTableLoad() {
      this.getUserSelectList(
        this.parentId,
        this.selectLeaderTablePage.currentPage,
        this.selectLeaderTablePage.pageSize
      );
    },
    // 获取用户选择列表
    getUserSelectList(masterId, current, size, query) {
      return new Promise((resolve) => {
        this.loading = true;
        getUserSelectList(masterId, current, size, query).then((res) => {
          const { records, total } = res.data;
          this.selectLeaderTablePage.total = total;
          this.selectLeaderTableData = records;
          this.loading = false;
          resolve(res);
        });
      });
    },
    searchChange(params, done) {
      this.getUserSelectList(
        this.parentId,
        this.selectLeaderTablePage.currentPage,
        this.selectLeaderTablePage.pageSize,
        params
      ).then(() => {
        done();
      });
    },
    searchReset() {
      this.onSelectLeaderTableLoad();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
