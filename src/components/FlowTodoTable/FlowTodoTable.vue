<template>
  <div>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
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
          v-if="permission.work_todo_handle"
          plain
          class="none-border"
          @click.stop="handleWork(scope.row)"
        >处理</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.work_todo_detail"
          plain
          class="none-border"
          @click.stop="handleDetail(scope.row)"
        >详情</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.work_todo_follow"
          plain
          class="none-border"
          @click.stop="handleImage(scope.row,scope.index)"
        >跟踪</el-button>
      </template>
    </avue-crud>
    <el-dialog title="流程图" append-to-body :visible.sync="flowBox" :fullscreen="true">
      <iframe
        :src="flowUrl"
        width="100%"
        style="height:83vh;"
        title="流程图"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        allowtransparency="yes"
      ></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flowBox = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { todoList } from "@/api/work/work";
import { flowCategory } from "@/util/flow";

export default {
  name: "FlowTodoTable",
  props: {
    search: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: 'auto',
    },
    read: Boolean
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
        calcHeight: 60,
        tip: false,
        simplePage: true,
        searchShow: false,
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
            type: "select",
            row: true,
            dicUrl: "/api/rabbit-system/dict/dictionary?code=flow",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            dataType: "number",
            slot: true,
            prop: "category",
            search: true,
            hide: true,
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
            label: '申请时间',
            prop: 'createTime',
            width: 165,
          },
        ]
      },
      data: [],
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
      let fromView = "DEAL";
      //判断是否是起草节点
      this.$axios.get("/api/rabbit-flow/process/queryDraftAnswers", {
        params: {
          processDefinitionId: row.processDefinitionId,
        }
      }).then(res => {
        if(res.data.id === row.taskDefinitionKey){
          fromView = "DRAFT";
        }
        if(row.processDefinitionName==='工单管理_情况说明单'){
          fromView="FactSheet"
        }
        this.$router.push({
          path: `/work/process/handle`,
          query: {
            taskId: row.taskId,
            taskDefinitionKey: row.taskDefinitionKey,
            processNodeName: row.taskName,
            processInstanceId: row.processInstanceId,
            businessId: row.businessId,
            processDefinitionId: row.processDefinitionId,
            fromView: fromView,
          }
        });
      })
    },
    // 详情按钮
    handleDetail(row) {
      console.log(row)

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
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const query = {
        ...this.query,
        category: (params.category) ? flowCategory(params.category) : null
      };
      this.loading = true;
      todoList(page.currentPage, page.pageSize, Object.assign(params, query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
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
