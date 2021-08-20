<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      ref="crud"
      v-model="form"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          v-if="permission.work_read_detail"
          plain
          class="none-border"
          @click.stop="handleDetail(scope.row)"
        >详情</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.work_read_follow"
          plain
          class="none-border"
          @click.stop="handleImage(scope.row,scope.index)"
        >跟踪</el-button>
      </template>
      <template #assignee="scope">
        <id-show
          :value="scope.row['assignee'].substr(9)"
          :row="scope.row"
          :column="option.column[5]"
        ></id-show>
      </template>
    </avue-crud>
    <el-dialog title="流程图" append-to-body :visible.sync="flowBox" :fullscreen="true">
      <iframe
        :src="flowUrl"
        width="100%"
        height="700"
        title="流程图"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flowBox = false">关 闭</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { readList } from "@/api/work/work";
import { flowCategory } from "@/util/flow";

export default {
  name: "WorkRead",
  props: {
    search: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [Number, String],
      default: 'auto',
    },
  },
  created() {
    this.option.searchShow = this.search;
    this.option.height = this.height;
  },
  data() {
    return {
      form: {},
      selectionId: '',
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      flowBox: false,
      flowUrl: '',
      workBox: false,
      option: {
        height: 'auto',
        calcHeight: 50,
        tip: false,
        // simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: false,
        editBtn: false,
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        dialogWidth: 900,
        menuWidth: 150,
        dialogClickModal: false,
        column: [
          {
            label: "流程分类",
            row: true,
            prop: "categoryName",
            search: false,
            width: 100,
          },
          {
            label: '流程名称',
            prop: 'processDefinitionName',
            search: true,
          },
          {
            label: '当前步骤',
            prop: 'taskName',
          },
          {
            label: '流程版本',
            prop: 'processDefinitionVersion',
            slot: true,
            width: 80,
          },
          {
            label: '发送时间',
            prop: 'createTime',
            width: 165,
          },
          {
            label: '发送人',
            prop: 'assignee',
            viewMode: 1,
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission", "flowRoutes"]),
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
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
    // 处理按钮
    handleWork(row) {
      this.$router.push({
        path: `/work/process/handle`,
        query: {
          taskId: row.taskId,
          taskDefinitionKey: row.taskDefinitionKey,
          processNodeName: row.taskName,
          processInstanceId: row.processInstanceId,
          businessId: row.businessId,
          processDefinitionId: row.processDefinitionId,
          fromView: "DEAL",
        }
      });
    },
    // 详情按钮
    handleDetail(row) {
      this.$router.push({
        path: `/work/process/handle`,
        query: {
          taskId: row.taskId,
          taskDefinitionKey: row.taskDefinitionKey,
          processNodeName: row.taskName,
          processInstanceId: row.processInstanceId,
          businessId: row.businessId,
          processDefinitionId: row.processDefinitionId,
          fromView: "DETAIL",
        }
      });
    },
    handleImage(row) {
      this.flowUrl = `/api/rabbit-flow/process/diagram-view?processInstanceId=${row.processInstanceId}`;
      this.flowBox = true;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.page.currentPage = 1
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const query = {
        ...this.query,
        category: (params.category) ? flowCategory(params.category) : null
      };
      this.loading = true;
      readList(page.currentPage, page.pageSize, query).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records || [];
      }).finally(() => {
        this.selectionClear();
        this.loading = false;
      })
    }
  }
};
</script>

<style>
.none-border {
  border: 0;
  background-color: transparent !important;
}
</style>
