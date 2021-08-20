<template>
  <div>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      v-model="form"
      ref="crud"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-radio-group v-model="mode" size="small">
          <el-radio-button label="1">通用流程</el-radio-button>
          <el-radio-button label="2">定制流程</el-radio-button>
        </el-radio-group>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          v-if="permission.work_start_flow"
          plain
          class="none-border"
          @click.stop="handleStart(scope.row)"
        >发起</el-button>
        <el-button
          type="text"
          size="small"
          v-if="permission.work_start_image"
          plain
          class="none-border"
          @click.stop="handleImage(scope.row,scope.index)"
        >流程图</el-button>
      </template>
      <template slot-scope="{row}" slot="tenantId">
        <el-tag>{{ row.tenantId === '' ? '通用' : row.tenantId }}</el-tag>
      </template>
      <template slot-scope="{row}" slot="version">
        <el-tag>v{{ row.version }}</el-tag>
      </template>
      <template slot-scope="{row}" slot="suspensionState">
        <el-tag>{{ row.suspensionState === 1 ? '激活' : '挂起' }}</el-tag>
      </template>
      <template slot-scope="{row}" slot="category">
        <el-tag>{{ row.categoryName }}</el-tag>
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
import { startList } from "@/api/work/work";
import { flowCategory } from "@/util/flow";

export default {
  name: "FlowStartTable",
  props: {
    search: {
      type: Boolean,
      default: false,
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
      mode: '1',
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
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        editBtn: false,
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        menuWidth: 150,
        dialogWidth: 900,
        dialogClickModal: false,
        column: [
          {
            label: '流程标识',
            prop: 'key',
            search: true,
          },
          {
            label: '流程名称',
            prop: 'name',
          },
          {
            label: '关联表单名称',
            prop: 'formName',
          },
          {
            label: '流程版本',
            prop: 'version',
            slot: true,
            width: 80,
          },
          {
            label: '状态',
            prop: 'suspensionState',
            slot: true,
            width: 80,
          },
          {
            label: '部署时间',
            prop: 'deploymentTime',
            width: 165,
          },
        ]
      },
      data: []
    };
  },
  watch: {
    'mode'() {
      this.onLoad(this.page);
    }
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
    //发起流程
    handleStart(row) {
      if (!row.formId || row.formId === 'null') {
        this.$message.warning('该流程未关联表单。');
        return;
      }
      if (!row.suspensionState || row.suspensionState === 2) {
        this.$message.warning('该流程状态为挂起。');
        return;
      }
      if(row.formType === "CD"){
        this.$router.push({
          path: `/work/process/form`,
          query: {
            ft: row.formType,          // formType  表单类型
            fid: row.formId,           // formId  表单ID
            processDefId: row.id,      // processDefinitionId 流程定义ID
            processkey: row.key,       // processKey  流程标识
          }
        });
      }else {
        //发起流程
        this.$axios.post(`/api/rabbit-resource/selfDevForm/startProcess/${row.formId}`, {}).then(res => {
          this.$router.push({
            path: `/work/process/handle`,
            query: {
              processDefinitionId: row.id,      // processDefinitionId 流程定义ID
              processInstanceId: res.data.data,  //processInstanceId 流程实例ID
              fromView: "DRAFT",
            }
          });
        })
      }
    },
    handleImage(row) {
      this.flowUrl = `/api/rabbit-flow/process/resource-view?processDefinitionId=${row.id}`;
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
        category: (params.category) ? flowCategory(params.category) : null,
        mode: this.mode
      };
      this.loading = true;
      startList(page.currentPage, page.pageSize, Object.assign(params, query)).then(res => {
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
