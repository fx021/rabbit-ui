<template>
  <basic-container>
    <el-form
      :model="form"
      size="small"
      label-position="right"
      label-width="100px"
      :rules="rules"
      ref="form"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="表名:" prop="tbName">
            <el-input
              :value="form.tbName"
              placeholder="请输入表名"
              clearable
              @input="onTbNameInput"
              :disabled="editMode"
            >
              <el-button slot="append" v-if="isImportMode" @click="loadTableCols">导入表</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <div class="line">
            <el-checkbox
              v-model="autoUpper"
              @change="autoUpperClick"
              label="自动大写"
              size="small"
              v-if="isImportMode"
            ></el-checkbox>
            <el-form-item label="表描述:" prop="tbDescription">
              <el-input v-model="form.tbDescription" placeholder="请输入表描述" clearable></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <el-form-item label="数据源:">
            <el-select
              v-model="form.sourceId"
              placeholder="请选择数据源"
              style="width:100%"
              @change="onSourceChange"
              :disabled="editMode"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in sourceList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <div class="line">
            <el-checkbox
              v-model="form.subTable"
              @change="onSubTabldeChange"
              label="是否子表"
              size="small"
            ></el-checkbox>
            <el-form-item label="主表:" prop="headerId">
              <el-select
                v-model="form.headerId"
                :placeholder="form.headerName||'请选择主表'"
                clearable
                filterable
                remote
                :disabled="!form.subTable"
                :loading="tableLoading"
                style="width:100%"
                :remote-method="headerTableQuerySearch"
              >
                <el-option
                  :label="item.tbName"
                  :value="item.id"
                  v-for="item in tableList"
                  :key="item.id"
                >
                  <span style="float: left">{{ item.tbName }}</span>
                  <span
                    style="float: right; color: #89a6ce; font-size: 13px"
                  >{{ item.tbDescription || item.remark }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注:">
            <el-input v-model="form.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div :class="[btnFloat?'btns-float':'btns']">
            <el-button type="primary" @click="handleRowAdd" size="small" v-if="!isImportMode">新增字段</el-button>
            <el-button type="success" @click="submit" size="small">保存</el-button>
            <el-button @click="backtrack" size="small">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="listData" size="small" border stripe style="margin-bottom:32px">
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.sort"
            placeholder="数字"
            size="small"
            :controls="true"
            controls-position="right"
            style="width:100%"
            v-if="rowEditing(scope.row)"
          ></el-input-number>
          <span v-else>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段名" align="center" min-width="160">
        <template slot-scope="scope">
          <el-tooltip
            v-if="rowEditing(scope.row)"
            :content="scope.row.$error"
            :value="!!scope.row.$error"
            :disabled="!scope.row.$error"
            placement="top"
            :key="scope.$index"
            :popper-options="poperOption"
            manual
          >
            <el-input
              :value="scope.row.colName"
              placeholder="字段名"
              size="small"
              @input="onColNameInput(scope.row,$event)"
              @blur="validateColName(scope.row,scope.$index)"
              :class="{'is-error':!!scope.row.$error}"
              :disabled="editDisabled(scope.row,scope.$index)"
              clearable
            ></el-input>
          </el-tooltip>
          <span v-else>{{scope.row.colName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段描述" align="center" min-width="120">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.colDesc"
            placeholder="字段描述"
            size="small"
            clearable
            v-if="rowEditing(scope.row) || isImportMode"
          ></el-input>
          <span v-else>{{scope.row.colDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" align="center" width="120">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.colType"
            placeholder="类型"
            size="small"
            :disabled="editDisabled(scope.row,scope.$index)"
            @change="val=>colTypeChange(scope.row)"
            v-if="rowEditing(scope.row)"
            style="width:100%"
          >
            <el-option
              :label="item.dictValue"
              :value="item.dictKey"
              v-for="item in typeList"
              :key="item.dictKey"
            ></el-option>
          </el-select>
          <span v-else>{{typeFormat(scope.row.colType)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="长度" align="center" width="92">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.colLen"
            placeholder="长度"
            :disabled="scope.row.colType == 5 || scope.row.colType == 6 || editDisabled(scope.row,scope.$index)"
            size="small"
            :min="0"
            :max="scope.row.colType==1?32:(scope.row.colType==2||scope.row.colType==3?38:9999)"
            :controls="false"
            style="width:100%"
            v-if="rowEditing(scope.row)"
          ></el-input-number>
          <span v-else>{{scope.row.colLen}}</span>
        </template>
      </el-table-column>
      <el-table-column label="小数位数" align="center" width="92">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.digists"
            :disabled="scope.row.colType != 3 || editDisabled(scope.row,scope.$index)"
            placeholder="小数位数"
            size="small"
            :controls="false"
            :min="0"
            :max="10"
            style="width:100%"
            v-if="rowEditing(scope.row)"
          ></el-input-number>
          <span v-else>{{scope.row.digists}}</span>
        </template>
      </el-table-column>
      <el-table-column label="主键" align="center" width="92">
        <template slot-scope="scope">
          <el-select
            v-if="rowEditing(scope.row)|| isImportMode"
            v-model="scope.row.colPrimary"
            placeholder="主键"
            size="small"
            @change="onPrimaryChange(scope.row,$event)"
            :disabled="!isImportMode"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
          <span v-else>{{scope.row.colPrimary?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="可为null" align="center" width="92">
        <template slot-scope="scope">
          <el-select
            v-if="rowEditing(scope.row)"
            v-model="scope.row.nullable"
            placeholder="可为null"
            size="small"
            :disabled="editDisabled(scope.row,scope.$index)"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
          <span v-else>{{scope.row.nullable?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认值" align="center" min-width="120">
        <template slot-scope="scope">
          <span v-if="!rowEditing(scope.row)">{{scope.row.colDefault}}</span>
          <el-select
            v-model="scope.row.colDefault"
            placeholder="默认值"
            v-else-if="scope.row.colType==6"
            size="small"
            clearable
            style="width:100%"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in defDates"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-tooltip
            v-else
            :content="scope.row.$defError"
            :value="!!scope.row.$defError"
            :disabled="!scope.row.$defError"
            placement="top"
            :key="scope.$index"
            :popper-options="poperOption"
            manual
          >
            <el-input
              v-model="scope.row.colDefault"
              placeholder="默认值"
              size="small"
              :disabled="scope.row.colType == 5 ||editDisabled(scope.row,scope.$index)"
              :class="{'is-error':!!scope.row.$defError}"
              @blur="validateDefault(scope.row)"
            ></el-input>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" :width="editMode?'130':'70'">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="editMode"
            size="small"
            @click="rowCell(scope.row, scope.$index)"
            class="menu-btn"
          >{{ scope.row.$cellEdit ? "取消" : "编辑" }}</el-button>
          <el-button type="text" size="small" @click="deleteRow(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </basic-container>
</template>

<script>
import {
  getDataSource,
  saveTableAndCols,
  selectByTableName,
  selectColtype,
  selectTables,
  updateTable, loadTablCols
} from "@/api/tool/businessTable";
import { closeTagByPath } from "@/util/tags";

export default {
  data() {
    return {
      isloaded: false,
      autoUpper: true,
      form: {
        tbName: null,
        tbDescription: null,
        syncStatus: 0,
        subTable: false,
        sourceId: '0',
        headerId: "",
        headerName: null,
        remark: '',
      },
      btnFloat: false,
      hasPrimary: true,
      editImport: false,
      dataChange: false,
      sourceList: [],
      tableList: [],
      typeList: [],
      tableLoading: false,
      listData: [{
        colName: "ID", colDesc: "主键", sort: 0, colType: 2, '$error': '', $colName: 'ID',
        colLen: "36", digists: "0", nullable: 0, colPrimary: 1, colDefault: "",
      }],
      oriData: {},
      rules: {
        tbName: [{ required: true, message: '请输入表名', trigger: "blur" },
        {
          pattern: "^[a-zA-Z][a-zA-Z_0-9]+$",
          message: "表名应只包含英文字母数字或下划线,且字母开头",
          trigger: "blur",
        }],
        tbDescription: [{ required: true, message: '请输入表描述', trigger: 'blur' },],
        headerId: []
      },
      defDates: [
        {
          label: "CURRENT_TIMESTAMP",
          value: "CURRENT_TIMESTAMP",
        },
        {
          label: "1972-01-01 00:00:00",
          value: "1972-01-01 00:00:00",
        },
        {
          label: 'NULL',
          value: "",
        },
      ],
      poperOption: { boundariesElement: 'viewport', gpuAcceleration: false, removeOnDestroy: true }
    };
  },
  computed: {
    editMode() {
      return !!this.$route.params.id
    },
    isImportMode() {
      return !!this.$route.query.name
    },
    hasSynced() {
      return this.form.syncStatus == 1
    },
  },
  created() {
    if (this.isImportMode) {
      this.listData = []
    }
    this.init();
  },
  mounted() {
    let view = document.getElementById('avue-view')
    view.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    let view = document.getElementById('avue-view')
    view.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    typeFormat(type) {
      let col = this.typeList.find(it => it.dictKey == type)
      return (col && col.dictValue) || type
    },
    validateColName(row, index) {
      if (this.isImportMode || !row.$cellEdit) {
        return false
      }
      let value = row.colName.trim()
      let error = null
      if (value === '') {
        error = '请输入字段名'
      } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        error = '字段名应只包含英文数字或下划线，并以英文字母开头'
      } else {
        const ColNameDenyList = [
          "id",
          "header_id",
          "created_by",
          "create_dept",
          "creation_date",
          "last_updated_by",
          "last_update_date",
          "last_update_login",
          "act_id",
          "status"
        ];
        if (ColNameDenyList.includes(value.toLowerCase()) && row.$colName !== 'ID' && row.$colName !== 'HEADER_ID') {
          error = '不允许的字段名'
        }
      }
      this.$set(row, '$error', error)
      return !!error
    },
    // 默认值验证
    validateDefault(item) {
      let value = item.colDefault && item.colDefault.trim()
      item.colDefault = value
      if (value && (item.colType == 1 || item.colType == 2) && !/^[0-9]*$/.test(value)) {
        this.$set(item, '$defError', '只能输入整数')
        return true;
      }
      if (value && item.colType == 3 && isNaN(value)) {
        this.$set(item, '$defError', '只能输入数字')
        return true;
      }
      this.$set(item, '$defError', null)
      return false;
    },
    init() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        target: "#avue-view",
      });
      Promise.all([
        this.getTableData(),
        this.getselectColtype(),
        this.getDataSource(),
      ]).then(() => {
        this.isloaded = true;
        loading.close();
      }).catch((err) => {
        this.isloaded = true;
        loading.close()
        if ('remove' == err) {
          this.$alert("数据已删除", '数据异常', {
            callback: () => {
              setTimeout(() => {
                this.$router.$avueRouter.closeTag()
              }, 500);
            }
          })
        }
      })
    },
    rowEditing(row) {
      return row.$cellEdit || (!this.editMode && !this.isImportMode)
    },
    editDisabled(row) {
      let colName = row.$colName || row.colName
      return /^(id|header_id)$/i.test(colName);
    },
    onSubTabldeChange(val) {
      this.rules.headerId = val ? [{ required: true, message: '请选择一个主表' }] : []
      if (!val) {
        this.$refs.form.clearValidate('headerId')
      }
      if (this.isImportMode) {
        if (val && this.listData.length) {
          if (!this.listData.find(item => item.colName.toUpperCase() === 'HEADER_ID')) {
            this.form.subTable = false
            this.$message.warning('未包含HEADER_ID字段, 不能设置为子表')
          }
        }
        return
      }
      let index = this.listData.findIndex(item => item.colName === 'HEADER_ID');
      if (val && index < 0) {
        this.listData.splice(1, 0, {
          // 字段名
          colName: "HEADER_ID",
          // 字段描述
          colDesc: "主表ID",
          sort: 1,
          // 字段类型
          colType: 2,
          // 长度
          colLen: "36",
          // 小数位数
          digists: "0",
          $colName: 'HEADER_ID',
          // 允许空
          nullable: 0,
          // 主键
          colPrimary: 0,
          // 默认值
          colDefault: '',
        });
      } else if (!val && index > 0) {
        this.listData.splice(index, 1)
      }
    },
    onColNameInput(row, value) {
      if (this.autoUpper) {
        row.colName = value.toUpperCase().replace('——', '_').trim()
      } else {
        row.colName = value.trim()
      }
    },
    onTbNameInput(value) {
      if (this.autoUpper) {
        this.form.tbName = value.toUpperCase().replace('——', '_').trim()
      } else {
        this.form.tbName = value.trim()
      }
      if (!this.dataChange) {
        this.dataChange = true
        this.$store.commit('SET_CHECKLEAVE', true)
      }
    },
    onSourceChange() {
      this.form.headerId = ''
      if (this.isImportMode) {
        this.listData = []
      }
    },
    onPrimaryChange(row, val) {
      if (val) {
        let find = this.listData.find(it => it.colPrimary && it.colName != row.colName)
        if (find) {
          find.colPrimary = 0
        }
        this.hasPrimary = true
      } else {
        let find = this.listData.find(it => it.colPrimary)
        this.hasPrimary = !!find
      }
    },
    autoUpperClick() {//自动大写切换
      // this.autoUpper = !this.autoUpper
      if (this.form.tbName) {
        this.form.tbName = this.autoUpper ? this.form.tbName.toUpperCase() : this.form.tbName.toLowerCase()
      }
    },
    // 自定义删除
    deleteRow(row, index) {
      if (this.isImportMode) {
        this.$message.warning("导入模式下不可删除");
        return
      }
      if (this.editDisabled(row, index)) {
        this.$message.success("默认字段，无法删除");
      } else if (index > 0) {
        this.$confirm(`确定要删除 ${row.colName || '该行'}吗?`, {
          type: "warning",
        }).then(() => {
          this.listData.splice(index, 1);
          if ((this.form.subTable && this.listData.length == 1)
            || (!this.form.subTable && this.listData.length == 2)) {
            if (!this.form.tbName) {
              this.$store.commit('SET_CHECKLEAVE', false)
            }
          }
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        }).catch(() => {
          //cancel
        })
      }
    },
    // 自定义修改
    rowCell(row, index) {
      if (row.$cellEdit !== true) {
        this.oriData[index] = this.deepClone(row);
        row.$colName = row.colName
        row.$cellEdit = true
        this.$set(this.listData, index, row);
      } else {
        let item = this.oriData[index] || Object.assign({}, row, { '$cellEdit': false, '$descEdit': false })
        item.$descEdit = false
        this.$set(this.listData, index, item);
      }
    },
    //新增字段
    handleRowAdd() {
      this.listData.push({ sort: this.listData.length, colType: 4, colName: '', colDesc: '', colLen: 200, digists: 0, colDefault: '', nullable: 1, colPrimary: 0, $colName: '11', $cellEdit: true })
      setTimeout(() => {
        if (this.listData.length > 4) {
          this.$nextTick(() => {
            this.scrollPage()
          })
        }
        this.dataChange = true
        this.$store.commit('SET_CHECKLEAVE', true)
      });
    },
    // 字段类型
    getselectColtype() {
      return new Promise((resolve, reject) => {
        selectColtype().then((res) => {
          let list = res.data.data || []
          for (let item of list) {
            item.dictKey = parseInt(item.dictKey)
          }
          this.typeList = list
          resolve();
        }).catch(err => {
          reject(err)
        })
      });
    },
    // 返回
    backtrack() {
      this.$confirm("离开页面的话 , 表单数据将清零")
        .then(() => {
          this.$store.commit('SET_CHECKLEAVE', false)
          closeTagByPath(this.$route.fullPath);
        }).catch(() => {
          //cancel
        })
    },
    // 数据源接口
    getDataSource() {
      return new Promise((resolve, reject) => {
        getDataSource().then((res) => {
          this.sourceList = res || []
          resolve();
        }).catch(err => {
          reject && reject(err)
        })
      });
    },
    // 获取业务表数据
    getTableData() {
      return new Promise((resolve, reject) => {
        if (!this.$route.params.id) {
          resolve();
          return;
        }
        selectTables(this.$route.params.id).then((res) => {
          if (!res.data.data) {
            reject('remove')
            return
          }
          //渲染表单
          this.form = res.data.data.rabbitFormTables;
          let headerName = res.data.data.headerName;
          if (headerName) {
            this.tableList = [{ id: this.form.headerId, tbName: headerName }]
            this.form.headerName = headerName
          }
          this.editImport = this.form.imp > 0
          this.form.subTable = !!this.form.headerId
          this.loadTable = this.form.tbName
          // 渲染表格
          let crudData = res.data.data.rabbitFormColsList;
          this.listData = crudData || [];
          resolve();
        }).catch(err => {
          reject(err)
        })
      });
    },
    loadTableCols() {//导入表
      this.$refs.form.validateField('tbName', err => {
        if (!err) {
          const loading = this.$loading({
            lock: true,
            text: "加载中...",
            spinner: "el-icon-loading",
            target: "#avue-view",
          });
          let tbName = this.form.tbName
          loadTablCols({ sourceId: this.form.sourceId, tbName })
            .then(res => {
              let data = res.data.data || {}
              let cols = data.cols || []
              this.hasPrimary = false
              if (!cols.length) {
                loading.close()
                this.loadTable = ''
                this.$alert('未查询到表信息')
                return
              }
              this.loadTable = tbName
              let headerId = false

              for (let i = 0; i < cols.length; i++) {
                let colItem = cols[i]
                let upper = colItem.colName.toUpperCase()
                if (upper === 'HEADER_ID') {
                  headerId = true
                }
                if (upper === 'ID') {
                  colItem.colPrimary = 1
                  this.hasPrimary = true
                  // } else {
                  // colItem.$cellEdit = true
                } else {
                  colItem.colPrimary = 0
                }
                if (typeof colItem.colType === 'string') {
                  colItem.colType = parseInt(colItem.colType)
                }
                if (colItem.colType === 5) {
                  colItem.colLen = 0
                }
                if (typeof colItem.nullable === 'string') {
                  colItem.nullable = parseInt(colItem.nullable)
                }
                colItem.sort = i
              }

              this.form.tbDescription = data.desc || ''
              this.listData = cols
              loading.close()
              let msg = ''
              if (this.form.subTable && !headerId) {
                this.form.subTable = false
                msg = '未包含HEADER_ID字段，不能设置为子表'
              } else if (headerId && !this.form.subTable) {
                this.$set(this.form, 'subTable', true)
                this.onSubTabldeChange(true)
              }
              if (!this.hasPrimary) {
                this.$alert('该表没有id，请指定表的主键；' + msg)
              } else if (msg) {
                this.$message.warning(msg)
              }
            }).catch(() => {
              loading.close()
            })
        }
      })
    },
    submit() {
      if (!this.hasPrimary) {
        this.$message.warning('请指定主键')
        return
      }
      this.$refs.form.validate(suc => {
        if (!suc) {
          this.scrollPage(1)
          return
        }
        if (this.isImportMode && this.loadTable !== this.form.tbName) {
          this.form.tbName = this.loadTable
        }
        // 如果默认值为空, 则改成NULL
        let imp = 0
        let implCols = { 'ID': 2, 'CREATION_DATE': 4, 'LAST_UPDATE_DATE': 8, 'CREATED_BY': 16, 'LAST_UPDATED_BY': 32, 'CREATE_DEPT': 64, 'LAST_UPDATE_LOGIN': 128, 'ACT_ID': 256, 'STATUS': 512 }
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i];
          if (this.validateColName(item, i)) {
            this.$message.warning(`${item.colName} 不合法`)
            return
          }
          if (this.validateDefault(item)) {
            this.$message.warning(`${item.colName} 默认值不合理 ${item.colDefault}`)
            return
          }
          if (item.colDefault && /null/i.test(item.colDefault)) {
            item.colDefault = null;
          }
          if (this.isImportMode || this.editImport) {
            let flag = implCols[item.colName.toUpperCase()]
            if (flag) {
              imp += flag
            }
          }
          if (item.sort === '' || item.sort === null) {
            item.sort = 10000
          }
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          target: "#avue-view",
        });
        let params = {};
        // 传递的顺序不能错
        params.rabbitFormTables = this.form;
        this.form.imp = imp
        if (this.isImportMode || this.editImport) {
          this.form.syncStatus = 1
          this.form.imp += 1
        }
        params.rabbitFormColsList = this.listData;
        // 判断是新增保存, 还是编辑保存
        if (!this.editMode) {
          params = JSON.stringify(params);
          saveTableAndCols(params)
            .then((res) => {
              const { data } = res;
              if (data.code !== 200 || !data.data.id) {
                throw new Error();
              }
              this.$store.commit('SET_CHECKLEAVE', false)
              loading.close()
              this.$router.push(`/tool/businessTable/detail/${data.data.id}`);
              this.$message({
                type: "success",
                message: "新增业务表已提交成功",
              });
            })
            .catch((err) => {
              loading.close()
              this.$message.error('新增业务表失败');
            });
        } else {
          params = JSON.stringify(params);
          updateTable(params)
            .then((res) => {
              const { data } = res;
              if (data.code !== 200) {
                throw new Error();
              }
              this.$store.commit('SET_CHECKLEAVE', false)
              this.getTableData()
              loading.close()
              this.$message({
                type: "success",
                message: data.msg,
              });
            })
            .catch(() => {
              loading.close()
              this.$message.error('修改业务表失败');
            });
        }
      })
    },
    colTypeChange(item) {
      let value = item.colType
      if (value == 1) {
        item.colLen = 10;
        item.colDefault = "";
        item.digists = 0;
      } else if (value == 2) {
        item.colLen = 36;
        item.colDefault = "";
        item.digists = 0;
      } else if (value == 3) {
        item.colLen = 10;
        item.digists = 2;
        item.colDefault = "";
      } else if (value == 4) {
        item.colLen = 200;
        item.colDefault = "";
        item.digists = 0;
      } else if (value == 5) {
        item.colLen = 0;
        item.colDefault = "";
        item.digists = 0;
      } else if (value == 6) {
        item.colLen = 0;
        item.colDefault = "";
        item.digists = 0;
      }
    },
    scrollPage(top) {
      let element = document.getElementById('avue-view')
      if (element) {
        element.scrollTop = top ? 0 : element.scrollHeight
      }
    },
    handleScroll(e) {
      this.btnFloat = e.target.scrollTop > 132
    },
    // 父表选择模糊查询
    headerTableQuerySearch(queryString) {
      if (!queryString) {
        this.tableList = []
        return
      }
      this.tableLoading = true
      const params = {
        sourceId: this.form.sourceId,
        tableName: queryString,
      };
      selectByTableName(params).then((res) => {
        this.tableList = res.data.data || []
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.error-container {
  position: relative;
  z-index: 10;
}
.error-msg {
  color: #f56c6c;
  font-size: 12px;
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1000000000000;
  background: white;
  white-space: nowrap;
}
/deep/ .el-table__header th {
  background: #fcfcfc;
}
/deep/ .el-input.is-error input {
  border-color: #f56c6c;
}
.btns /deep/ .el-button:not(:first-child) {
  margin-left: 10px;
}

/deep/ .el-col-24 {
  width: 100%;
}

.line {
  display: flex;
  flex-direction: row;
}
.line > div:first-child,
.line > label {
  margin-left: 36px;
  margin-top: 6px;
}
.line > div:last-child {
  flex-grow: 1;
}

.menu-btn {
  margin-left: 0;
  margin-right: 10px;
}

.btns-float {
  position: fixed;
  right: 30px;
  top: 114px;
  background: white;
  padding: 12px;
  z-index: 100;
}

.btns {
  text-align: end;
}
</style>
