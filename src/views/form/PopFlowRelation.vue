<template>
  <div class="pop-flow-relation" v-loading="isLoading">
    <el-row type="flex" justify="space-between" align="middle">
      <el-form ref="form" :model="form" label-width="80px" style="width: 100%">
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-form-item label="流程标识">
              <el-select
                v-model="flowId"
                filterable
                :remote-method="getFlowList"
                collapse-tags
                remote
                clearable
                :loading="flowLoading"
                placeholder="请输入流程标识"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in flowList"
                  :key="index"
                  :label="item.key"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button
              type="success"
              size="small"
              @click="onListSubmitClick"
              :disabled="!this.flowId"
            >关联</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <el-table
      :data="tableData"
      border
      ref="fieldTable"
      v-loading="isTableLoading"
      style="width: 100%;"
      height="auto"
      @selection-change="handleSelectionChange"
      v-if="!isIndependent"
    >
      <el-table-column type="selection" width="50px"></el-table-column>
      <el-table-column prop="prop" label="字段名称">
        <template slot-scope="{row}">{{ getName(row.prop) }}</template>
      </el-table-column>
      <el-table-column prop="label" label="字段描述"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getProcessByKey, getProcessById } from "@/api/flow/flow";

export default {//关联流程
  name: "PopFlowRelation",
  props: {
    form: {//列表行数据
      type: Object,
      required: true,
    },
    isIndependent: {//是否自研表单
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flowList: [],
      flowLoading: false,

      tableData: [],
      tableSelection: [],
      // ID 列 提交的时候默认关联
      hideFieldFull: [],
      hideField: ['ID', 'HEADER_ID'],

      current: 1,
      size: 10,

      submitLoading: false,

      fieldList: [],
      flowId: "",
      // 当前保存的id
      id: "",

      isLoading: true,

    }
  },
  created() {
    this.init();
  },
  methods: {
    getName(value) {
      return value.split("#").pop();
    },
    setActiveColumnAsync(arr) {
      return new Promise(resolve => {
        const map = {};

        this.tableData.forEach((item, index) => {
          map[item.prop] = index;
        })

        this.$nextTick(() => {
          arr.forEach(item => {
            if (this.tableData[map[item]]) {
              this.$refs.fieldTable.toggleRowSelection(this.tableData[map[item]])
            }
          })
          resolve()
        })
      })
    },
    handleSelectionChange(rows) {
      this.tableSelection = rows;
    },

    async init() {
      this.isLoading = true;
      // 获取字段
      try {
        const tableColumnRes = await this.$axios.get(`/api/rabbit-resource/selfDevForm/linkBusiness/${this.form.id}`);
        const tableData = [];

        tableColumnRes.data.data.forEach(item => {
          if (this.hideField.includes(this.getName(item.columnName).toUpperCase())) {
            this.hideFieldFull.push(item.columnName)
            return;
          }
          tableData.push({
            prop: item.columnName,
            label: item.columnDesc
          })
        });
        this.tableData = tableData;
      } catch (e) {
        console.log(e)
        this.$message.error("获取字段失败");
        this.isLoading = false;
      }
      try {
        // 获取已经关联的流程和字段
        const linkProcessRes = await this.$axios.get(`/api/rabbit-resource/selfDevForm/linkProcess/${this.form.id}`)
        let { data: linkProcessData } = linkProcessRes;
        if (linkProcessData.code !== 200) {
          throw new Error()
        }
        if (linkProcessData.data.length === 0) {
          this.isLoading = false;
          return;
        }
        linkProcessData = linkProcessData.data[0];

        this.flowId = linkProcessData.processDefId;
        this.id = linkProcessData.id;

        // 关联的流程回显
        await getProcessById(linkProcessData.processDefId).then(res => {
          this.flowList = res.data.data.map(item => {
            return {
              ...item,
              key: `${item.key} 版本V${item.version}`
            }
          });
        })

        // 已选的字段回显
        await this.setActiveColumnAsync(linkProcessData.enableColumns.split(','))
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.$message.error('获取关联流程失败')
        this.isLoading = false;
      }
    },
    getFlowList(query) {
      this.flowLoading = true;

      const queryRegExp = /.+/
      clearTimeout(this.searchstaffCodeTimer);
      this.searchstaffCodeTimer = setTimeout(() => {
        query = query.trim();
        if (!queryRegExp.test(query)) {
          this.flowList = [];
          this.flowLoading = false;
          return;
        }
        getProcessByKey(query).then(res => {
          this.flowLoading = false;
          if (res.data.code !== 200) {
            this.$message.error("请求流程失败");
            this.flowList = [];
            return;
          }
          this.flowList = res.data.data.map(item => {
            return {
              ...item,
              key: `${item.key} 版本V${item.version}`
            }
          });
        })
      }, 300)
    },

    onListSubmitClick() {
      const activeCol = {};

      this.tableSelection.forEach(item => {
        activeCol[item.prop] = ''
      })

      this.hideFieldFull.forEach(item => {
        activeCol[item] = ''
      })


      const otherColumns = [];
      this.tableData.forEach(item => {
        if (typeof activeCol[item.prop] === "undefined") {
          otherColumns.push(item.prop);
        }
      })
      this.$axios.post('/api/rabbit-resource/selfDevForm/linkProcess', {
        formId: this.form.id,
        formName: this.form.formName,
        processDefId: this.flowId,
        enableColumns: Object.keys(activeCol).join(','),
        otherEnableColumns: otherColumns.join(','),
        formType: this.isIndependent ? 'SD' : 'CD',
        id: this.id
      }).then((res) => {
        if (res.data.code !== 200) {
          throw new Error()
        }
        this.$emit('confirm', res.data.data);
      }
      ).catch((err) => {
        console.log(err)
        this.$message.error('关联失败')
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.pop-flow-relation {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
    height: 100%;
  }
}
</style>
