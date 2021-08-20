<template>
  <basic-container>
    <avue-crud
      :data="formList"
      :option="option"
      v-model="form"
      :page.sync="page"
      :table-loading="formListLoading"
      :search.sync="searchForm"
      :before-open="handleBeforeOpen"
      :before-close="handleBeforeClose"
      :row-style="rowStyle"
      @row-del="handleFormRowDel"
      @row-save="handleFormRowSave"
      @row-update="handleFormRowUpdate"
      @refresh-change="getFormList"
      @search-change="handleFormSearchChange"
      @search-reset="handleFormSearchResetChange"
      @current-change="getFormList"
      @size-change="getFormList"
    >
      <template #tableNameForm="{row,disabled}">
        <el-select
          v-model="form.tableId"
          placeholder="请选择 主表"
          filterable
          remote
          size="small"
          :remote-method="onSearchTable"
          :loading="tableSelectLoading"
          :disabled="disabled"
          @change="handleTableChange"
        >
          <el-option
            v-for="item in tableList"
            :label="item.tbName"
            :value="item.id"
            :key="item.id"
            :disabled="!item.syncStatus || !checkIsCanUse(row,item)"
          >
            <span style="float: left">{{ item.tbName }}</span>
            <span
              :style="{float: 'right', color: item.formPop%2!=0?'#8f91b0':'#7fa1d3', fontSize: '12px'}"
            >{{ item.tbDescription }}</span>
          </el-option>
        </el-select>
      </template>
      <template #tableListIdForm="{row,disabled}">
        <div>
          <el-form-item v-for="(subTable,index) in row.tableListId" :key="index">
            <el-row type="flex">
              <el-select
                v-model="subTable.value"
                placeholder="请选择 从表"
                filterable
                remote
                size="small"
                :remote-method="onSearchTable"
                :loading="tableSelectLoading"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in tableList"
                  :label="item.tbName"
                  :value="item.id"
                  :key="item.id"
                  :disabled="!item.syncStatus || !checkIsCanUse(row,item)"
                >
                  <span style="float: left">{{ item.tbName }}</span>
                  <span
                    :style="{float: 'right', color: item.formPop%2!=0?'#8f91b0':'#7fa1d3', fontSize: '12px'}"
                  >{{ item.tbDescription }}</span>
                </el-option>
              </el-select>
              <el-button
                :disabled="disabled"
                style="margin-left: 10px"
                @click="handleSubTableAdd(row, index)"
              >新增</el-button>
              <el-button :disabled="disabled" @click="handleSubTableDel(row, index)">删除</el-button>
            </el-row>
          </el-form-item>
        </div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-connection"
          size="mini"
          @click="handleFlowRelation(scope.row)"
          v-if="permission.independent_flow"
        >关联流程</el-button>
      </template>
    </avue-crud>
    <el-drawer
      direction="rtl"
      size="50%"
      ref="flowRelationDrawer"
      :visible.sync="showflowRelation"
      title="关联流程"
      class="my-pop"
      destroy-on-close
      append-to-body
    >
      <pop-flow-relation
        :form="this.editRow"
        is-independent
        @confirm="handlePopFlowRelationConfrim"
      />
    </el-drawer>
  </basic-container>
</template>

<script>
import PopFlowRelation from "@/views/form/PopFlowRelation";

export default {
  name: "Independent",
  components: { PopFlowRelation },
  created() {
    this.option.addBtn = this.permission.independent_add
    this.option.editBtn = this.permission.independent_edit
    this.option.delBtn = this.permission.independent_delete
    this.option.menu = this.permission.independent_delete || this.permission.independent_edit || this.permission.independent_flow
    this.init()
  },
  computed: {
    permission() {
      return this.$store.getters.permission || {}
    }
  },
  data() {
    return {
      formList: [],
      form: {},
      searchForm: {},
      page: {
        total: 0
      },
      option: {
        height: 'auto',
        calcHeight: 50,
        page: true,
        columnBtn: false,
        stripe: true,
        border: true,
        size: 'small',
        searchMenuSpan: 5,
        // menuWidth: 180,
        column: [
          {
            prop: 'id',
            label: '表单编号',
            search: true,
            addDisplay: false,
            editDisabled: true,
          },
          {
            prop: 'formName',
            label: '表单名称',
            search: true,
            rules: [
              { required: true, message: "请输入表单名称", }
            ]
          },
          {
            prop: 'tableName',
            label: '主表',
            search: true,
            formslot: true,
            rules: [
              {message: "请选择主表"}
            ]
          },
          {
            prop: 'formUrl',
            label: '组件路由',
            rules: [
              { required: true, message: "请输入组件路由" },
              { pattern: /^(\/[a-zA-Z]\w*)+$/, message: "路由格式错误" }
            ]
          },
          {
            prop: 'remark',
            label: '备注',
          },
          {
            prop: 'tableListId',
            label: '从表',
            hide: true,
            span: 24,
            formslot: true,
          },
        ]
      },

      formListLoading: false,

      // 关联流程
      showflowRelation: false,
      editRow: {},

      // 业务表选择
      tableList: [],
      tableSelectLoading: false,
    }
  },
  methods: {
    init() {
      this.getFormList();
    },
    getFormList: function (option) {
      this.formListLoading = true;
      this.$axios.get('/api/rabbit-resource/selfDevForm/selfDevelopLinkBusiness', {
        params: {
          size: this.page.pageSize,
          current: this.page.currentPage,
          ...this.searchForm,
          ...option
        }
      }).then(res => {
        const { data } = res;
        if (data.code === 200) {
          this.formList = data.data.records;
          this.page.total = data.data.total;
        }
      }).finally(() => {
        this.formListLoading = false;
      })
    },
    // 工具函数
    rowStyle({ row }) {
      if (row._new) {
        return {
          backgroundColor: '#ddd',
        }
      }
    },
    checkIsCanUse(row, item) {
      if (!Array.isArray(row.tableListId)) {
        return item.id !== row.tableId;
      }
      return row.tableListId.findIndex(selectedItem => {
        return selectedItem.value === item.id
      }) === -1 && item.id !== row.tableId;
    },

    // 自研表单列表事件
    handleFormSearchResetChange() {
      this.searchForm = {
        id: "",
        formName: "",
        tableId: "",
      };
      this.getFormList();
    },
    handleFormSearchChange(form, done) {
      this.page.size = 0;
      this.page.total = 0;
      this.getFormList();
      done();
    },
    // 自研表单 增 删 改
    handleFormRowDel(row, index, done) {
      this.$axios.delete(`/api/rabbit-resource/selfDevForm/deleteSelfDevelopInfo/${row.id}`).then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功');
          done()
          return;
        }
        throw new Error();
      }).catch(err => {
        console.log(err)
        this.$message.error('删除失败')
      })
    },
    handleFormRowSave(row, done) {
      const ids = [];
      row.tableListId.forEach(item => {
        if (item.value) {
          ids.push(item.value)
        }
      })

      this.$axios.post('/api/rabbit-resource/selfDevForm/linkBusiness', {
        ...row,
        formType: 'SD',
        tableListId: ids.join(',')
      }).then(res => {
        const { data } = res;
        if (data.code === 200) {
          this.$message.success('保存成功');
          this.formList.unshift({ ...data.data, _new: true })
          this.page.total += 1;
        }
      }).finally(() => {
        done()
      })
    },
    handleFormRowUpdate(row, index, done) {
      const ids = [];
      row.tableListId.forEach(item => {
        if (item.value) {
          ids.push(item.value)
        }
      })

      this.$axios.post('/api/rabbit-resource/selfDevForm/linkBusiness', {
        ...row,
        tableListId: ids.join(',')
      }).then(res => {
        const { data } = res;
        if (data.code === 200) {
          this.formList.splice(index, 1, data.data);
          this.$message.success('更新成功');
        }
      }).finally(() => {
        done()
      })
    },

    // 弹出框前后处理
    handleBeforeClose(done) {
      this.tableList = [];
      done()
    },
    handleBeforeOpen(done, type) {
      if (type === 'add') {
        this.$set(this.option.column[4], 'span', 12)
        this.$set(this.form, 'tableListId', [{ value: '' }])
        done()
      }
      if (type === 'edit') {
        this.$set(this.option.column[4], 'span', 24)
        // const option = [];
        if (typeof this.form.tableListId === 'string') {
          // this.form.tableListId = this.form.tableListId.split(',').map(id => {
          //   return {value: id}
          // })
          const allPromise = [];
          const ids = this.form.tableListId.split(',');
          const idList = [];

          if(this.form.tableId != null) {
            allPromise.push(this.$axios.get(`/api/rabbit-resource/selfDevForm/getBusinessName/${this.form.tableId}`));
            ids.forEach(id => {
              if (!id) {
                return
              }
              idList.push({value: id})
              allPromise.push(this.$axios.get(`/api/rabbit-resource/selfDevForm/getBusinessName/${id}`))
            })

          this.form.tableListId = idList;

            if (this.form.tableListId.length === 0) {
              this.$set(this.form, 'tableListId', [{value: ''}])
            }
          }


          Promise.all(allPromise).then(promise => {
            promise.forEach(res => {
              const { data } = res;
              if (data.code === 200) {
                this.tableList.push({
                  tbName: data.data.tableName,
                  id: data.data.id,
                })
              }
            })
            done()
            return
          })
        }
      }
    },

    // 子表的添加删除
    handleSubTableDel(row, index) {
      if (row.tableListId.length === 1) {
        row.tableListId = [{ value: '' }];
        return
      }
      row.tableListId.splice(index, 1);
    },
    handleSubTableAdd(row, index) {
      row.tableListId.splice(index + 1, 0, { value: '' })
    },

    // 业务表选择
    handleTableChange(val) {
      const selected = this.tableList.find(item => {
        return val === item.id
      });

      this.form.tableName = selected.tbName;
    },
    onSearchTable(name) {
      if (name) {
        this.tableSelectLoading = true;
        this.$axios.get("/api/rabbit-resource/formcustom/selectByTableName", {
          params: {
            tableName: name
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.tableList = res.data.data;
          }
          this.tableSelectLoading = false;
        }).catch(() => {
          this.tableSelectLoading = false;
        });
      }
    },

    // 关联流程
    handleFlowRelation(row) {
      this.editRow = row;
      this.showflowRelation = true;
    },
    handlePopFlowRelationConfrim(data) {
      if (!data.id) {
        this.$message.error("关联失败")
        return;
      }
      this.$message.success("关联成功")
      this.showflowRelation = false;
      this.$refs.flowRelationDrawer.closeDrawer();
    },
  }
}
</script>

<style scoped>
</style>
