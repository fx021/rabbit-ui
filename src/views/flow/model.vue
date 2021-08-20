<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page.sync="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permission.flow_model_create"
          @click="handleCreate"
        >新 增</el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="permission.flow_model_delete"
          @click="handleDelete"
        >删 除</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          v-if="permission.flow_model_update"
          plain
          class="none-border"
          @click.stop="handleUpdate(scope.row, scope.index)"
        >维护</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.flow_model_deploy"
          plain
          class="none-border"
          @click.stop="handleDeploy(scope.row, scope.index)"
        >部署</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.flow_model_download"
          plain
          class="none-border"
          @click.stop="handleDownload(scope.row, scope.index)"
        >下载</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.flow_model_delete"
          plain
          class="none-border"
          @click.stop="handleSlotDelete(scope.row, scope.index)"
        >删除</el-button>
      </template>
      <template slot-scope="{ row }" slot="version">
        <el-tag>v{{ row.version }}</el-tag>
      </template>
    </avue-crud>
    <el-dialog
      append-to-body
      :visible.sync="flowBox"
      :fullscreen="true"
      :showClose="false"
      class="one-el-dialog"
    >
      <i class="el-icon-close" style="font-size: 30px;" @click="flowBox = false"></i>
      <iframe
        :src="flowUrl"
        width="100%"
        style="height: calc(100vh - 34px);"
        title="流程设计器"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        padding="0"
        scrolling="no"
        allowtransparency="yes"
        class="father"
        ref="iframeFlowable"
      ></iframe>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import website from "@/config/website";
import { modelList, removeModel, deployModel } from "@/api/flow/flow";

export default {
  data() {
    return {
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      deployLoading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      flowBox: false,
      flowUrl: "",
      option: {
        height: "auto",
        calcHeight: 60,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        editBtn: false,
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        dialogWidth: 900,
        menuWidth: 150,
        dialogClickModal: false,
        column: [
          {
            label: "模型主键",
            prop: "id",
          },
          {
            label: "模型标识",
            prop: "modelKey",
            search: true,
            width: 150,
          },
          {
            label: "模型名称",
            prop: "name",
            search: true,
            width: 150,
          },
          {
            label: "流程版本",
            prop: "version",
            slot: true,
            width: 80,
          },
          {
            label: "创建时间",
            prop: "created",
            width: 165,
          },
          {
            label: "更新时间",
            prop: "lastUpdated",
            width: 165,
          },
        ],
      },
      data: [],
    };
  },
  watch: {
    "form.flowMode"() {
      this.$refs.form.option.column.filter((item) => {
        if (item.prop === "tenantId") {
          item.display = this.form.flowMode === 2;
        }
      });
    },
  },
  computed: {
    ...mapGetters(["permission"]),
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return removeModel(this.ids);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
          this.onLoad(this.page);
        });
    },
    // 创建按钮
    handleCreate() {
      this.height = document.body.offsetHeight + "px";
      this.flowUrl = `${website.flowDesignUrl}/index.html`;
      this.flowBox = true;
    },
    // 点击配置按钮
    handleUpdate(row) {
      // 自适应高度
      this.height = document.body.offsetHeight + "px";
      this.flowUrl = `${website.flowDesignUrl}/index.html#/editor/${row.id}`;
      this.flowBox = true;
    },
    handleDeploy(row) {
      const loding = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        target: "#avue-view",
      });
      deployModel({
        modelId: row.id,
        category: 'flow_1',
      }).then((res) => {
        loding.close();
        const data = res.data;
        if (data.success) {
          this.$message({
            type: "success",
            message: data.msg,
          });
        } else {
          this.$message({
            type: "warn",
            message: data.msg,
          });
        }
      });
    },
    handleDoDeploy() {
      this.$refs.form.submit();
    },
    handleDownload(row) {
      window.open(`${website.flowDesignUrl}/app/rest/models/${row.id}/bpmn20`);
    },
    handleSlotDelete(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return removeModel(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
          this.onLoad(this.page);
        });
    },
    handleRefresh() {
      this.flowBox = false;
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      modelList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.none-border {
  border: 0;
  background-color: transparent !important;
}

.one-el-dialog {
  //隐藏对话框的顶部
  /deep/ .el-dialog__header {
    display: none !important;
  }

  /deep/ .el-dialog__body {
    padding: 0;
    margin: 0;
  }

  /deep/ .father {
    position: relative;
  }

  .el-icon-close {
    display: block;
    text-align: right;
    cursor: pointer;
    height: 30px;
  }
}
</style>
