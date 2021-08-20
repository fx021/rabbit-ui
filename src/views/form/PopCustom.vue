<template>
  <div
    class="form"
    v-loading.fullscreen="submitLoading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中..."
  >
    <div class="form-group">
      <div class="group-label">
        <span>弹出框配置信息</span>
      </div>
      <div class="wrap-row">
        <label class="el-form-item__label v-required">弹出框名称</label>
        <el-input
          v-model="form.popName"
          placeholder="请输入弹出框名称"
          clearable
          maxlength="40"
          size="small"
          show-word-limit
          style="min-width:252px;"
        >
          <!-- <el-button slot="append" type="primary">自动生成</el-button> -->
        </el-input>
        <label class="el-form-item__label v-required">数据类型</label>
        <el-select
          v-model="form.dataType"
          style="width:120px"
          :disabled="!!form.id"
          size="small"
          @change="onDataTypeChange"
        >
          <el-option label="业务表" :value="0"></el-option>
          <el-option label="自定义SQL" :value="1"></el-option>
          <el-option label="API接口" :value="2"></el-option>
        </el-select>
        <label class="el-form-item__label v-required" v-show="form.dataType==0">业务表</label>
        <el-select
          v-show="form.dataType==0"
          v-model="form.tableId"
          placeholder="业务表名称"
          size="small"
          filterable
          remote
          :remote-method="onSearchTable"
          :loading="tableLoading"
          @change="onSelectTable"
          :disabled="!!form.id"
        >
          <el-option :label="item.tbName" :value="item.id" :key="item.id" v-for="item in tableList">
            <span style="float: left">{{ item.tbName }}</span>
            <span
              :style="{float: 'right',color: !item.syncStatus?'#e5e3de': (item.formPop>=2?'#8f91b0':'#7fa1d3'), fontSize: '12px'}"
            >{{ item.tbDescription}}</span>
          </el-option>
        </el-select>
        <label class="el-form-item__label v-required" v-show="form.dataType==1">数据源</label>
        <el-select
          v-show="form.dataType==1"
          v-model="form.sourceId"
          placeholder="请选择数据源"
          size="small"
          filterable
          :disabled="!!form.id"
        >
          <el-option :label="item.name" :value="item.id" v-for="item in sourceList" :key="item.id"></el-option>
        </el-select>
        <label class="el-form-item__label" v-show="form.dataType==2">签名秘钥</label>
        <el-input v-model="form.sign" placeholder="接口签名秘钥" v-show="form.dataType==2" size="small"></el-input>
        <label class="el-form-item__label">搜索菜单宽</label>
        <el-input-number
          v-model="form.searchMenuSpan"
          placeholder="1-24"
          style="width: 80px;"
          size="small"
          :controls="false"
        ></el-input-number>
      </div>
      <div class="wrap-row">
        <label class="el-form-item__label">备注</label>
        <el-input v-model="form.remark" placeholder="请输入弹出框备注" clearable size="small" />
        <label class="el-form-item__label" style="margin-left:16px">搜索按钮位置</label>
        <el-select v-model="form.searchMenuPosition" style="width:100px" size="small">
          <el-option label="左对齐" value="left"></el-option>
          <el-option label="居中" value="center"></el-option>
          <el-option label="右对齐" value="right"></el-option>
        </el-select>
        <label class="el-form-item__label">搜索框间距</label>
        <el-input-number
          v-model="form.searchGutter"
          placeholder="像素"
          style="width: 80px;"
          size="small"
          :controls="false"
        ></el-input-number>
        <label class="el-form-item__label">半收缩展示</label>
        <el-select v-model="form.searchIndex" style="width:140px" size="small">
          <el-option label="2个以上展示" :value="2"></el-option>
          <el-option label="3个以上展示" :value="3"></el-option>
          <el-option label="4个以上展示" :value="4"></el-option>
          <el-option label="5个以上展示" :value="5"></el-option>
          <el-option label="不收缩展示" :value="0"></el-option>
        </el-select>
        <!-- <el-button
          type="success"
          size="small"
          style="margin-left:30px"
          @click="onSubmitClick"
          :loading="submitLoading"
          :disabled="submitLoading"
          v-if="showSubmit"
        >提交</el-button>-->
      </div>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>{{form.dataType==2?'接口链接（POST）':'SQL语句'}}</span>
        <div class="under-btn group-right">
          <el-dropdown @command="handleInsertCommand">
            <span class="under-btn">插入参数</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in argList"
                :command="item"
                :key="item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span @click="onParseSql">解析</span>
        </div>
      </div>
      <div id="editor">
        <textarea ref="editor"></textarea>
      </div>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>列表配置</span>
        <span class="under-btn group-right" @click="viewTableClick(-1)">新增</span>
      </div>
      <el-table :data="viewData" border size="mini" :max-height="460" row-key="_id">
        <span slot="empty"></span>
        <el-table-column label="排序" align="center" width="60">
          <template slot-scope="scope">
            <i
              class="el-icon-sort-down sort-menu"
              v-if="scope.$index<viewData.length-1"
              @click="onViewSort(scope.$index,1)"
            ></i>
            <i
              class="el-icon-sort-up sort-menu"
              v-if="scope.$index>0"
              @click="onViewSort(scope.$index,-1)"
            ></i>
            <i
              class="el-icon-plus sort-menu"
              v-if="scope.$index==viewData.length-1"
              @click="viewTableClick(-1)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="字段名称" align="center" width="180">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.prop"
              placeholder="字段名称"
              size="mini"
              @change="val => onViewColChange(val,scope.row)"
            >
              <el-option
                :label="viewColLabel(item)"
                :value="viewColValue(item)"
                v-for="item in selectCols"
                :key="item.colName"
                :disabled="colDisabled(scope.$index,item)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="控件名称" align="center" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="控件名称" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="控件类型" align="center" width="120">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="控件类型"
              size="mini"
              filterable
              @change="type=>onViewTypeChange(scope.row,type)"
            >
              <el-option
                :label="item.label"
                :value="item.type"
                v-for="item in filterViewList(scope.row)"
                :key="item.type"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" width="66">
          <template slot="header">
            <span>
              主键
              <el-tooltip content="辅助选择需要，可确保切换页码后数据也被选中；必须且只能有一个主键" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.primaryKey"
              size="mini"
              :disabled="form.dataType==0"
              @change="val => onPrimaryChange(scope.row,val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="显示" align="center" width="46">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.display" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" width="88">
          <template slot="header">
            <span>
              列表宽
              <el-tooltip content="可输入百分号，设置为min-width。剩余宽度将按比例分配给设置了min-width的列" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.width" placeholder="像素" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="单行" align="center" width="46">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.overHidden" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="可查询" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.search" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="查询模式" align="center" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.searchMode" size="mini" :disabled="!scope.row.search">
              <el-option label="模糊查询" :value="0" :disabled="isDateView(scope.row.type)"></el-option>
              <el-option label="左匹配查询" :value="1" :disabled="isDateView(scope.row.type)"></el-option>
              <el-option label="全匹配查询" :value="2"></el-option>
              <el-option label="大于查询" :value="3"></el-option>
              <el-option label="大于等于" :value="4"></el-option>
              <el-option label="小于查询" :value="5"></el-option>
              <el-option label="小于等于" :value="6"></el-option>
              <el-option label="不等于查询" :value="7"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="查询提示" align="center" width="170">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.searchPlaceholder"
              placeholder="占位提示"
              size="mini"
              :disabled="!scope.row.search"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="查询标签宽" align="center" width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.searchLabelWidth"
              placeholder="像素"
              size="mini"
              :disabled="!scope.row.search"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="查询列占比" align="center" width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.searchSpan"
              placeholder="1-24"
              size="mini"
              :disabled="!scope.row.search"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="查询多选" align="center" width="78">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.searchMultiple" :disabled="!scope.row.search"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="参数1" align="center" width="120">
          <template slot-scope="scope">
            <dict-select
              v-model="scope.row.param1"
              size="mini"
              :prop="scope.row.prop || scope.row._id"
              :visible="!submitLoading"
              v-if="isDictView(scope.row.type)"
              @cascade="onDictCascaded"
            ></dict-select>
            <show-editor
              v-model="scope.row.param1"
              size="mini"
              :row="scope.row"
              v-else-if="scope.row.type==='idShow'"
            ></show-editor>
            <el-input
              v-model="scope.row.param1"
              :placeholder="viewPlaceholder(scope.row,1)"
              size="mini"
              :disabled="scope.row.type==='userSelect'"
              v-else-if="!getParamSelectData(scope.row,1)"
            ></el-input>
            <el-select
              v-model="scope.row.param1"
              :placeholder="viewPlaceholder(scope.row,1)"
              size="mini"
              v-else
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :key="item.value"
                v-for="item in getParamSelectData(scope.row,1)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数2" align="center" width="120">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.param2"
              type="month"
              placeholder="选择月"
              v-if="scope.row.type=='elCalendar'"
              size="mini"
              style="width:99px"
            ></el-date-picker>
            <el-input
              v-model="scope.row.param2"
              :placeholder="viewPlaceholder(scope.row,2)"
              size="mini"
              v-else-if="!getParamSelectData(scope.row,2)"
            ></el-input>
            <el-select
              v-model="scope.row.param2"
              :placeholder="viewPlaceholder(scope.row,2)"
              size="mini"
              v-else
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :key="item.value"
                v-for="item in getParamSelectData(scope.row,2)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数3" align="center" width="120">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.param3"
              :placeholder="viewPlaceholder(scope.row,3)"
              size="mini"
              v-if="!getParamSelectData(scope.row,3)"
            ></el-input>
            <el-select
              v-model="scope.row.param3"
              :placeholder="viewPlaceholder(scope.row,3)"
              size="mini"
              v-else
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :key="item.value"
                v-for="item in getParamSelectData(scope.row,3)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数4" align="center" width="120">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.param4"
              :placeholder="viewPlaceholder(scope.row,4)"
              size="mini"
              v-if="!getParamSelectData(scope.row,4)"
            ></el-input>
            <el-select
              v-model="scope.row.param4"
              :placeholder="viewPlaceholder(scope.row,4)"
              size="mini"
              v-else
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :key="item.value"
                v-for="item in getParamSelectData(scope.row,4)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数5" align="center" width="120">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.param5"
              :placeholder="viewPlaceholder(scope.row,5)"
              size="mini"
              v-if="!getParamSelectData(scope.row,5)"
            ></el-input>
            <el-select
              v-model="scope.row.param5"
              :placeholder="viewPlaceholder(scope.row,5)"
              size="mini"
              v-else
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :key="item.value"
                v-for="item in getParamSelectData(scope.row,5)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="viewTableClick(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ViewListLoader from "./view-list.js";
import DictSelect from './DictSelect'
import ShowEditor from './ShowEditor'
// import ExpEditor from './ExpEditor'
import PopDataSelect from './PopDataSelect'
import { getDataSource } from "@/api/tool/businessTable"
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import "codemirror/theme/hopscotch.css"
import "codemirror/mode/sql/sql.js"
import {
  generateId, formatFileSize, parseFileSize, safeParseInt, safeString, sysArgs,
  parseSQLParams, parseStringArray, getListTypeAccept
} from '@/util/generator'
const defaultForm = { dataType: 0, sourceId: '0', searchGutter: 10, searchMenuSpan: 8, searchIndex: 2, searchMenuPosition: 'center', remark: '', popName: '' }
export default {//弹出框定义,不允许再选择弹出框
  name: 'PopCustom',
  provide() {
    return {
      parentCustom: this
    };
  },
  props: {
    popData: Object,//弹出框列表页面传值,本地回显
    popId: [String, Number],//弹出框id
    showSubmit: {
      type: Boolean,
      default: false
    },
    submiting: {//提交loading
      type: Boolean,
      default: false
    },
    visible: {//侧边栏可见
      type: Boolean,
      default: true
    }
  },
  components: {
    PopDataSelect, DictSelect, ShowEditor
  },
  beforeDestroy() {
    if (this.editorView) {
      try {
        this.editorView.toTextArea()
      } catch (error) {
        console.log("destroy editorView error", error)
      }
      this.editorView = null
    }
    if (this._sourceTimer) {
      clearTimeout(this._sourceTimer)
      this._sourceTimer = null
    }
    delete this._dicProps
    delete this._cascadedMap
    delete this._currentTable
  },
  data: () => {
    return {
      form: Object.assign({}, defaultForm),
      tableLoading: false,
      viewData: [],
      viewList: null,
      submitLoading: false,
      tableList: [],
      selectCols: [],
      sourceList: [],
      initing: false,
      selectArg: '',
    }
  },
  computed: {
    argList() {//系统参数
      return sysArgs()
    }
  },
  mounted() {
    this.editorView = CodeMirror.fromTextArea(this.$refs.editor, {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      lineWrapping: true,
      autofocus: true,
      mode: "sql",
      theme: 'hopscotch'
    });
    if (this.form.source) {
      this.editorView.setValue(this.form.source)
    }
    this.getSourceList()
    this.ensureViewList()
  },
  methods: {
    ensureViewList() {//过滤一下不可用的view
      if (!this.viewList || !this.viewList.length) {
        let excludes = ['popData', 'rowExpression', 'ueditor', 'elCalendar', 'download', 'upload']
        this.viewList = ViewListLoader().filter(it => !excludes.includes(it.type))
      }
    },
    handleInsertCommand(command) {//插入SQL参数
      if (this.editorView) {
        let line = this.editorView.getCursor()
        this.editorView.replaceRange(` #{${command.value},${command.label}} `, line)
        this.editorView.focus()
        this.editorView.setCursor(this.editorView.lineCount(), 0)
      }
    },
    onDataTypeChange(type) {//弹出框类型变更
      if (type == 0 && this._currentTable && this._currentTable.tbName) {
        this.replaceDoc('select * from ' + this._currentTable.tbName)
      } else {
        this.replaceDoc()
      }
      // this.form.source = ''
    },
    onPrimaryChange(row, val) {//主键变更,确保只有一个主键
      if (val) {
        let view = this.viewData.find(it => it.primaryKey && row != it)
        if (view) {
          // this.$message.warning('只能有一个主键')
          this.$set(view, 'primaryKey', false)
        }
      }
    },
    viewColValue(col) {//控件prop
      if (col.tableName) {
        return `n#${col.tableName}#${col.colName}`
      }
      return col.colName
    },
    viewColLabel(col) {//控件label
      if (col.status == 2 && col.colDefault) {
        return col.colDefault
      }
      return col.colName
    },
    selectColFun() {//控件字段集合
      return this.selectCols || []
    },
    onSearchTable(search) {//业务表模糊搜索
      if (search) {
        this.tableLoading = true
        this.$axios.get('/api/rabbit-resource/formcustom/selectByTableName', {
          params: {
            tableName: search
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.tableList = res.data.data
          }
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      }
    },
    colDisabled(index, colItem) {//字段只选择一次
      index;
      let colName = this.viewColValue(colItem)
      return !!this.viewData.find(it => it.prop == colName)
    },
    onSelectTable(id) {//业务表变更
      let table = this.tableList.find(it => it.id == id)
      if (table) {
        this.replaceDoc("select * from " + table.tbName)
        this._currentTable = table
        if (!table.syncStatus) {
          this.$message.warning(table.tbName + " 还未同步")
        }
        setTimeout(() => {
          this.onParseSql()
        }, 100);
      }
    },
    getSourceList(query) {//数据源
      getDataSource(query).then(data => {
        this.sourceList = data
      })
    },
    onParseSql() {//解析SQL/链接
      if (!this.checkDoc()) return
      let sql;
      if (this.form.dataType == 0) {
        sql = "T";
      } else {
        sql = this.getDocs()
        sql = sql.replace(/#\{.+?\}/g, "'1'")
      }
      this.form.page = true
      this.$axios.post('/api/rabbit-resource/formcustom/parse', {
        sql: sql,
        sourceId: this.form.dataType == 0 ? this.form.tableId : (this.form.dataType == 2 ? -1 : this.form.sourceId)
      }).then(res => {
        if (res.data.data) {
          if (this.form.dataType == 2) {//接口
            let json = res.data.data
            if (typeof json == 'string') {
              json = JSON.parse(json)
            }
            if (json.code != 200) {
              this.$message.warning(json.msg || '请求异常')
              return
            }
            let vData = json.data
            if (!Array.isArray(vData)) {
              if (!vData.records || !Array.isArray(vData.records)) {
                this.$message.warning('返回的数据格式不正确')
                return
              }
              this.form.page = false
              vData = vData.records
            }
            if (vData.length == 0) {
              this.$message.warning('接口未返回数据')
              return
            }
            let vItem = vData[0]
            this.selectCols = []
            let viewData = []
            for (let key in vItem) {
              this.selectCols.push({
                colName: key
              })
              let lowerid = key.toLowerCase()
              viewData.push({
                prop: key,
                type: 'input',
                display: lowerid != 'id' && lowerid != 'header_id',
                primaryKey: lowerid == 'id',
                searchSpan: 8,
                searchLabelWidth: 80,
                searchMode: 0,
                _id: generateId()
              })
            }
            this.viewData = viewData
          } else {
            let viewData = []
            for (let item of res.data.data) {
              // if (this.viewData.find(it => it.colName == item.colName)) {
              //   continue
              // }
              let lowerid = item.colName.toLowerCase()
              let viewItem = {
                prop: this.viewColValue(item),
                tableName: item.tableName,
                tableId: item.tableId,
                type: item.colType == 6 ? "datetime" : (item.colType < 4 ? 'number' : 'input'),
                display: lowerid != 'id' && lowerid != 'header_id',
                // colType: item.colType,
                label: item.status == 2 ? '' : item.colDesc,
                primaryKey: item.colPrimary === 1,
                searchSpan: 8,
                searchLabelWidth: 80,
                searchMode: item.colType == 6 ? 6 : 0,
                _id: generateId()
              }
              this.onViewTypeChange(viewItem, viewItem.type, 1)
              viewData.push(viewItem)
            }
            this.viewData = viewData
            this.selectCols = res.data.data
          }
        }
      })
    },
    getCurrentTableInfo(tid) {//业务表信息回显
      this.$axios.get("/api/rabbit-resource/formcustom/tables-id", {
        params: { ids: tid }
      }).then(res => {
        if (res.data.data && res.data.data.length) {
          this._currentTable = res.data.data[0]
          this.tableList = [this._currentTable]
        }
      })
      //控件字段
      this.$axios.post("/api/rabbit-resource/formcustom/parse", {
        sql: "T",
        sourceId: tid
      }).then(res => {
        if (res.data.data) {
          this.selectCols = res.data.data
        }
      })
    },
    onSubmitClick() {//提交
      if (!this.form.popName) {
        this.$message.warning('请输入弹出框名称')
        return
      }
      if (this.viewData.length == 0) {
        this.$message.warning('字段还未配置')
        return
      }
      if (!this.checkDoc()) return
      const colInfo = this.getAvueData()
      if (!colInfo) return
      this.submitLoading = true
      const data = { colInfo: JSON.stringify(colInfo) }
      data.popName = this.form.popName
      data.remark = this.form.remark
      data.dataType = this.form.dataType
      data.id = this.form.id
      if (data.dataType == 0) {
        data.sourceId = this._currentTable && this._currentTable.sourceId
        data.extra = this.form.tableId
      } else if (data.dataType == 1) {
        data.sourceId = this.form.sourceId + ''
        data.extra = this.form.sourceId
      } else {
        data.extra = this.form.sign
      }
      data.dictProps = this._dicProps && JSON.stringify(this._dicProps)
      // data.popProps = this._popProps && JSON.stringify(this._popProps)
      let source = this.getDocs()
      data.source = source
      data.params = JSON.stringify(parseSQLParams(source))//解析SQL参数
      // console.log("params ", params)
      this.$axios.post("/api/rabbit-resource/formcustom/pop-data", data)
        .then(res => {
          if (res.data.data) {
            this.$set(this.form, 'id', res.data.data)
            data.id = res.data.data
            data.status = 1
            this.$message.success(res.data.msg)
            this.$emit('change', data, true)
          }
          this.submitLoading = false
        }).catch(() => {
          this.submitLoading = false
        })
    },
    replaceDoc(doc) {//editor显示内容
      if (this.editorView) {
        this.editorView.setValue(doc || '')
        this.editorView.setCursor(this.editorView.lineCount(), 0)
      }
    },
    getDocs() {//获取editor内容
      return !this.editorView ? '' : this.editorView.getValue(" ")
    },
    hasDoc() {//editor是否有内容
      return this.getDocs().length > 0
    },
    filterViewList(view) {//根据字段类型过滤控件
      let colType = 4
      if (view.prop) {
        let colList = this.selectColFun(view.tableId)
        let index = view.prop.lastIndexOf('#')
        let colName = index > 0 ? view.prop.substring(index + 1) : view.prop
        let colItem = colList.find(it => it.colName == colName)
        colType = colItem ? colItem.colType : 4
      }
      if (colType == 6) {
        let allowTypes = ['input', 'datetime', 'date', 'daterange', 'datetimerange', 'time', 'timerange']
        return this.viewList.filter(it => allowTypes.includes(it.type))
      }
      if (colType == 3) {//小数
        let allowTypes = ['input', 'number']
        return this.viewList.filter(it => allowTypes.includes(it.type))
      }
      if (colType < 3) {//数字
        let allowTypes = ['input', 'number', 'radio', 'select', 'checkbox', 'password']
        return this.viewList.filter(it => allowTypes.includes(it.type))
      }
      return this.viewList
    },
    onViewSort(index, direct) {//控件上下排序
      let newIndex = index + direct;
      if (newIndex < 0 || newIndex > this.viewData.length) {
        return;
      }
      let item = this.viewData[index];
      let dirItem = this.viewData[newIndex];
      if (newIndex > index) {
        this.viewData.splice(index, 2, dirItem, item);
      } else {
        this.viewData.splice(newIndex, 2, item, dirItem);
      }
    },
    viewTableClick(index) {//保证列表的控件在最后
      //新增/删除控件，选择业务表后，默认将非id，header_id字段加入
      if (index == -1) {
        let view = { searchSpan: 8, display: true, searchLabelWidth: 80, searchMode: 0, type: 'input', _id: generateId() }
        this.viewData.push(view);
      } else {
        let view = this.viewData[index]
        if (view.primaryKey) {
          this.$message.warning("不能删除主键");
          return
        }
        if (this.form.id) {
          this.$confirm('正处于编辑模式, 确定要删除吗?')
            .then(() => {
              this.viewData.splice(index, 1)
            }).catch(() => {
              //cancel
            })
        } else {
          this.viewData.splice(index, 1)
        }
      }
    },
    onViewColChange(val, row) {//控件字段变更
      let colList = this.selectColFun()
      let colItem = colList.find(it => val == this.viewColValue(it))
      // row.colType = colItem && colItem.colType
      if (!row.label && colItem) {
        row.label = colItem.colDesc
      }
    },
    viewCellClassFunc() {
      return "my-cell";
    },
    viewPlaceholder(listItem, num) {//参数的placeholder
      let params = this.viewParams(listItem.type, num);
      if (params) {
        this.getParamSelectData(listItem, -1);
        return params.placeholder;
      }
      return `参数${num}`;
    },
    getParamSelectData(listItem, num) {//参数选择list
      // console.log("getParamSelectData")
      if (listItem.dicDatas) {
        return num == -1 ? null : listItem.dicDatas[num - 1];
      }
      this.onViewTypeChange(listItem, listItem.type, 1);
      return !listItem.dicDatas || num == -1
        ? null
        : listItem.dicDatas[num - 1];
    },
    onViewTypeChange(listItem, type, init) {//控件类型变更
      listItem.lastType = type
      let viewItem = this.viewList.find(it => it.type == type);
      if (!init && !this.initing) {
        let same = listItem.oldType != undefined && listItem.oldType == type;
        for (let i = 1; i < 6; i++) {
          this.$set(listItem, `param${i}`, same ? listItem[`old${i}`] : null);
          // this.$set(listItem, `param${i}`, null);
        }
      }
      let dicDatas = {};
      listItem.dicDatas = dicDatas;
      if (viewItem && viewItem.params && viewItem.params.length > 0) {
        for (let i = 0; i < viewItem.params.length; i++) {
          let paramItem = viewItem.params[i];
          let key = `param${i + 1}`;
          if (paramItem.dicData) {
            if (listItem[key] == null) {
              this.$set(listItem, key, paramItem.emptyVal);
            }
            dicDatas[i] = paramItem.dicData;
          } else if (paramItem.emptyVal != undefined) {
            if (!init || listItem[key] == null) {
              this.$set(listItem, key, paramItem.emptyVal);
            }
          }
        }
      }
    },
    viewParams(type, num) {//控件的参数
      let viewItem = this.viewList.find(it => it.type == type);
      if (viewItem && viewItem.params && viewItem.params.length >= num) {
        return viewItem.params[num - 1];
      }
      return "";
    },
    isDateView(type) {
      return ['date', 'datetime', 'time', 'daterange', 'timerange', 'datetimerange',
        'month', 'year', 'week'].includes(type)
    },
    isDictView(type) {//是否字典控件
      return ['select', 'radio', 'checkbox', 'cascader'].includes(type)
    },
    hasCasParent(dicId) {
      //下拉框才有联动效果,其他的会有bug
      if (!this._cascadedMap) {
        return false
      }
      let cas = this._cascadedMap[dicId]
      if (!cas) {
        return false
      }
      for (let view of this.viewData) {
        if (view.type == 'select' && view.param1 == cas) {
          return true
        }
      }
      return false
    },
    loopFindDicCasProp(dicId, container, hasFind) {
      //下拉框才有联动效果
      if (!this._cascadedMap || hasFind.includes(dicId)) {
        return
      }
      hasFind.push(dicId)
      let cas = null
      for (let key in this._cascadedMap) {
        if (this._cascadedMap[key] == dicId) {
          cas = key
          break
        }
      }
      if (!cas) {
        return
      }
      let view = null
      for (let item of this.viewData) {
        if (item.type == 'select' && item.param1 == cas) {
          view = item
          break
        }
      }
      if (view && container) {
        container.push(view.prop)
      }
      this.loopFindDicCasProp(cas, container, hasFind)
    },
    onDictCascaded(cascadedMap) {//字典级联定义
      if (!this._cascadedMap) {
        this._cascadedMap = cascadedMap
      } else {
        this._cascadedMap = Object.assign(this._cascadedMap, cascadedMap)
      }
    },
    parseAvueData(res, watch) {//解析服务端数据
      this.initing = true
      if (res.dictProps) {
        this._dicProps = JSON.parse(res.dictProps)
        this._cascadedMap = {}
        for (let dic of this._dicProps) {
          if (dic.cascadedId) {
            this._cascadedMap[dic.dicId] = dic.cascadedId
          }
        }
      } else {
        this._dicProps = []
        this._cascadedMap = {}
      }
      // if (res.popProps) {
      //   this._popProps = JSON.parse(res.popProps)
      // }
      let data = res.colInfo
      //解析avue的json数据
      if (typeof data == "string") {
        data = JSON.parse(data)
      }
      this.form.id = res.id
      this.form.popName = res.popName
      this.form.dataType = res.dataType
      this.form.remark = res.remark
      this.form.page = data.page
      if (res.dataType == 0) {
        this.form.tableId = res.extra
        this.getCurrentTableInfo(this.form.tableId)
      } else if (res.dataType == 1) {
        this.form.sourceId = res.extra
        this.$axios.post("/api/rabbit-resource/formcustom/parse", {
          sql: res.source,
          sourceId: res.extra
        }).then(res => {
          if (res.data.data) {
            this.selectCols = res.data.data
          }
        })
      } else {
        this.form.sign = res.extra
      }
      this.form.source = res.source
      this.replaceDoc(res.source)
      // console.log("parse data", data)
      if (!data) {
        this.viewData = [];
        this.initing = false
        return;
      }
      this.form.searchIndex = data.searchIndex
      this.form.searchMenuSpan = data.searchMenuSpan
      this.form.searchMenuPosition = data.searchMenuPosition || data.menuPosition
      this.form.searchGutter = data.searchGutter

      this.ensureViewList()
      let column = data.column
      let viewData = []
      for (let i = 0; i < column.length; i++) {
        let view = column[i]
        if (view.component) {
          view.type = view.component;
          delete view.component
        }
        if (view.minWidth !== undefined) {
          view.width = view.minWidth + '%'
          delete view.minWidth
        }
        //组装param1-5
        let paramView = this.viewList.find(it => it.type == view.type);
        if (paramView && paramView.params && paramView.params.length > 0) {
          // let nullNum = 5 - paramView.params.length;
          for (let k = 0; k < paramView.params.length; k++) {
            let param = paramView.params[k];
            let old = view[param.key];
            if (param.key == 'listType' && view.listType1) {
              old = view.listType1
              view.listType1 = undefined
            } else if (param.key == 'fileSize' && old) {
              old = formatFileSize(old)
            } else if (old && param.valType == 'array' && old.length) {
              old = old.join(",")
            }
            view[`old${k + 1}`] = old;
            view[`param${k + 1}`] = old;
          }
        }
        this.onViewTypeChange(view, view.type, 1)
        viewData.push(view);
      }
      this.viewData = viewData
      if (!watch) {
        this.$emit('change', res)
      }
      setTimeout(() => {
        this.initing = false
      }, 600);
    },
    getAvueData(preview) {//组装avue option
      let views = []
      let _dicProps = []
      let hasPrimary = false
      for (let i = 0; i < this.viewData.length; i++) {
        let view = this.viewData[i];
        if (!view.label) {
          this.$message.error(
            "控件必须有名称,请为控件+" + (i + 1) + "+设置名称"
          );
          return;
        }
        if (!view.prop && view.type != 'expression') {
          this.$message.error(
            "控件必须有字段,请为 " + view.label + " 选择字段"
          );
          return;
        }
        if (view.primaryKey) {
          hasPrimary = true
        }
        view.searchSpan = safeParseInt(view.searchSpan, 8)
        let newView = Object.assign({}, view);
        newView.width = safeString(newView.width)
        newView.hide = newView.display === false
        if (typeof newView.width == 'string' && newView.width.substr(newView.width.length - 1) == '%') {
          newView.minWidth = newView.width.substr(0, newView.width.length - 1)
          delete newView.width
        }
        newView.dicDatas = undefined
        newView.dicData = undefined
        newView.oldType = undefined
        newView.lastType = undefined
        newView.dicUrl = undefined
        newView.props = undefined
        newView.multiple = undefined
        newView.limit = undefined
        newView.actionData = undefined
        newView.propsHttp = undefined
        newView.fileSize = undefined
        newView.canvasOption = undefined
        newView.showWordLimit = undefined
        newView.controls = undefined
        newView.cascaderItem = undefined
        newView.cascaderItem2 = undefined
        if (view.type === 'userSelect' || view.newFlag === 2) {
          newView.accept = undefined
          newView.action = view.action
          newView.actionData = view.actionData
        } else if (view.type !== 'idShow') {
          newView.action = undefined
          newView.accept = undefined
        }
        if (newView.type == 'upload') {
          newView.action = '/api/rabbit-resource/oss/endpoint/upload'
          newView.propsHttp = {
            res: 'data',
            name: 'originalName',
            url: 'link'
          }
        } else if (newView.type == 'switch') {
          newView.dicData = [{ label: '', value: 0 }, { label: '', value: 1 }]
        }
        let paramView = this.viewList.find(it => it.type == view.type);
        if (paramView) {
          if (paramView.component) {
            newView.component = paramView.component;
            delete newView.type;
          }
          if (paramView.params && paramView.params.length > 0) {
            for (let k = 0; k < paramView.params.length; k++) {
              let param = paramView.params[k];
              let paramVal = newView[`param${k + 1}`];
              if (param.required && !paramVal) {
                this.$message.error(
                  "请为 " + view.label + " 设置" + param.placeholder
                );
                return;
              }
              if (newView.dicData && paramVal != undefined) {
                if (param.key == 'activeText') {
                  newView.dicData[1].label = paramVal
                } else if (param.key == 'inactiveText') {
                  newView.dicData[0].label = paramVal
                } else if (param.key == 'inactiveValue') {
                  newView.dicData[0].value = !isNaN(paramVal) ? parseInt(paramVal) :
                    (/^\s*false\s*$/i.test(paramVal) ? false : paramVal)
                } else if (param.key == 'activeValue') {
                  newView.dicData[1].value = !isNaN(paramVal) ? parseInt(paramVal) :
                    (/^\s*true\s*$/i.test(paramVal) ? true : paramVal)
                }
              }
              if (param.key == 'controlsPosition') {
                newView.controls = paramVal != 'none'
              } else if (param.key == 'maxlength' && paramVal) {
                newView.showWordLimit = true
              } else if (param.valType == "dic") {
                newView.dicUrl = `/api/rabbit-system/dict/select-child?parentId=${paramVal}&flag=${view.type == 'cascader' ? 1 : 0}`
                newView.props = {
                  label: 'dictValue',
                  value: 'dictKey'
                }

                let cascadedId = undefined
                if ('select' == view.type) {
                  cascadedId = this._cascadedMap && this._cascadedMap[paramVal]
                  let casItems = []
                  let hasFind = []
                  this.loopFindDicCasProp(paramVal, casItems, hasFind)
                  if (casItems.length > 0) {
                    newView.cascaderItem = casItems
                  } else if (this.hasCasParent(paramVal)) {
                    newView.dicUrl += '&key={{key}}'
                  }
                }
                _dicProps.push({
                  tableId: newView.tableId || this.form.tableId,
                  tableName: newView.tableName || this._currentTable.tbName,
                  viewId: newView._id,
                  colName: newView.prop,
                  dicId: paramVal,
                  cascadedId: cascadedId
                })
              } else if (view.type == "upload") {
                if (param.key === "limit") {
                  if (paramVal == '1' || paramVal == 1) {
                    newView.limit = 1
                    newView.multiple = false
                  } else {
                    newView.multiple = true
                    if (paramVal != '' && paramVal != undefined) {
                      newView.limit = parseInt(paramVal)
                      if (newView.limit < 0) {
                        newView.limit = 0
                      }
                    } else {
                      newView.limit = 0
                    }
                  }
                  continue
                } else if (param.key === "watermark" && paramVal) {
                  newView.canvasOption = {
                    text: paramVal,
                    opacity: 50,
                    fontSize: 12,
                    color: "#5a8b76"
                  }
                } else if (param.key === "fileSize") {
                  let fileSize = parseFileSize(paramVal, 6 * 1024 * 1024)
                  if (fileSize === false) {
                    this.$message.warning('文件大小不正确')
                    return
                  }
                  newView.fileSize = fileSize
                  continue
                } else if (param.key == "listType") {
                  newView.listType1 = paramVal
                  // console.log('listType', paramVal)
                  let accepts = getListTypeAccept(paramVal)
                  paramVal = accepts[0]
                  newView.accept = accepts[1]
                }
              }
              if (param.valType == "array") {
                let arrayVal = parseStringArray(paramVal)
                if (arrayVal) {
                  if (arrayVal.length == 1 && param.key == 'defaultTime') {
                    arrayVal.push(arrayVal[0])
                  }
                  newView[param.key] = arrayVal
                } else {
                  newView[param.key] = undefined
                }
              } else {
                newView[param.key] = param.valType == 'integer' ? safeParseInt(paramVal, param.emptyVal) : paramVal
              }
            }
          }
        }
        for (let k = 1; k < 6; k++) {
          if (!preview) {
            delete newView[`old${k}`];
          }
          delete newView[`param${k}`];
        }
        views.push(newView);
      }//view end
      if (!hasPrimary) {
        this.$message.warning('需要指定一个唯一主键')
        return
      }
      //组装成avue的json数据
      let data = {
        addBtn: false, columnBtn: false, cellBtn: false, saveBtn: false, printBtn: false, updateBtn: false,
        menu: false, cancelBtn: false, delBtn: false, editBtn: false, excelBtn: false, refreshBtn: true,
        searchBtn: true, page: this.form.page !== false, viewBtn: false, column: views
      };
      data.searchMenuSpan = safeParseInt(this.form.searchMenuSpan, 24)
      data.searchGutter = safeParseInt(this.form.searchGutter)
      data.searchIcon = !!this.form.searchIndex
      data.searchMenuPosition = this.form.searchMenuPosition
      data.searchIndex = this.form.searchIndex
      if (!preview) {
        this._dicProps = _dicProps
      }
      return data;
    },
    checkDoc() {//检查SQL合理性
      if (this.form.dataType == 0) {
        if (!this.form.tableId) {
          this.$message.warning('请输入业务表')
          return false
        }
        let doc = this.getDocs()
        if (this.hasDoc()) {
          if (!/^\s*select\s+.+from\s+.+/i.test(doc)) {
            this.$message.warning('SQL不正确')
            this.replaceDoc("select * from " + this._currentTable.tbName)
            return false
          }
          let reg = new RegExp('\\s+from\\s+' + this._currentTable.tbName, 'i')
          if (!reg.test(doc)) {
            this.$message.warning('表名不正确')
            this.replaceDoc("select * from " + this._currentTable.tbName)
            return false
          }
        } else {
          this.replaceDoc("select * from " + this._currentTable.tbName)
        }
      }
      if (this.form.dataType == 1 && this.form.sourceId === '') {
        this.$message.warning('请选择数据源')
        return false
      }
      if (this.form.dataType == 1 && !this.hasDoc()) {
        this.$message.warning('请输入自定义SQL')
        return false
      }
      if (this.form.dataType == 1 && !/^\s*select\s+.+from\s+.+/i.test(this.getDocs())) {
        this.$message.warning('SQL不正确')
        return false
      }
      // if (this.form.dataType != 2 && /\s+(offset|limit|top|row_num[<>]?)\s+/i.test(this.getDocs())) {
      //   this.$message.warning('不能包含limit语句')
      //   // this.replaceDoc("select * from " + this._currentTable.tbName)
      //   return false
      // }
      if (this.form.dataType == 2 && !this.hasDoc()) {
        this.$message.warning('请输入api接口Url')
        return false
      }
      if (this.form.dataType == 2 && !/\s*https?:\/\/.+/.test(this.getDocs())) {
        this.$message.warning('url连接不正确')
        return false
      }
      return true
    }
  },
  watch: {
    // popData(val) {
    //   console.log("watch popData")
    //   this.parseAvueData(val, true)
    // },
    visible: {//用于初始化
      handler(val) {
        if (!val) {
          this.lastId = this.form.id || this.popId || ''
          this.submitLoading = false
          return
        }
        // console.log("this.popid", this.popId, this.lastId)
        if (!this.popId && this.lastId === '') {//联系点击新建
          return
        }
        if (this.popData && this.popData.colInfo) {
          this.submitLoading = true
          setTimeout(() => {
            this.parseAvueData(this.popData, true)
            this.submitLoading = false
          }, 410);
          return
        }
        this.form = Object.assign({}, defaultForm)
        if (!this.popId) {
          if (this._currentTable) {
            this._currentTable = {}
            this.replaceDoc('')
            this.viewData = []
            this.selectCols = []
          }
          this.onSearchTable('0')
        } else {//获取弹出框设置
          // this.form.id = val
          this.submitLoading = true
          setTimeout(() => {
            this.$axios.get('/api/rabbit-resource/formcustom/pop-data?ids=' + this.popId)
              .then(res => {
                if (res.data.data && res.data.data.length) {
                  this.parseAvueData(res.data.data[0])
                  this.submitLoading = false
                } else {
                  this.submitLoading = false
                  this.$alert('数据已删除', '数据异常', {
                    callback: () => {
                      this.$emit('change', 'remove', val)
                    }
                  })
                }
              }).catch(() => {
                this.submitLoading = false
              })
          }, 100);
        }
      },
      immediate: true
    },
    submitLoading(val) {//提交状态同步
      this.$emit("update:submiting", val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-group {
  padding: 0 12px 12px;
}
.form-group:not(:last-child) {
  border-bottom: 12px solid #f2f2f2;
}
.form-group:last-child {
  margin-bottom: 12px;
}
.wrap-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  box-sizing: border-box;
}
.wrap-row .el-input {
  width: 22%;
}
.wrap-row:not(:first-child) {
  margin-top: 10px;
}

.wrap-row label {
  display: inline-block;
  width: 100px;
}
.group-label {
  border-bottom: 1px #cbd5f0 solid;
  padding: 12px;
  display: block;
  font-weight: bold;
  margin-bottom: 16px;
}
.under-btn {
  color: #4d8ac8;
  font-weight: normal;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}
.group-right {
  float: right;
  margin-top: 3px;
}
.group-right > span:not(:first-child) {
  margin-left: 24px;
}
</style>
