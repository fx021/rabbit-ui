<template>
  <div
    class="form"
    v-loading.fullscreen="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中..."
  >
    <div class="form-group" v-if="listMode===1">
      <div class="group-label">
        <span>表单信息</span>
      </div>
      <div class="wrap-row">
        <label class="el-form-item__label v-required">表单名称</label>
        <el-input
          v-model="searchForm.formName"
          placeholder="请输入表单名称"
          clearable
          maxlength="40"
          show-word-limit
          size="small"
          style="width: 20%;"
        ></el-input>
        <label class="el-form-item__label v-required">数据源</label>
        <el-select
          v-model="searchForm.sourceId"
          placeholder="数据源"
          size="small"
          :disabled="!!row.id"
        >
          <el-option :label="item.name" :value="item.id" v-for="item in sourceList" :key="item.id"></el-option>
        </el-select>
        <label class="el-form-item__label">表单备注</label>
        <el-input
          v-model="searchForm.remark"
          placeholder="请输入备注说明"
          clearable
          maxlength="100"
          show-word-limit
          size="small"
          :readonly="readonly"
          style="width: 24%;"
        ></el-input>
        <el-button @click="onParseSQL" size="small" style="margin-left:24px" type="success">解析</el-button>
      </div>
      <div style="padding:10px 16px 0">
        <el-input v-model="searchForm.sql" placeholder="查询SQL" type="textarea"></el-input>
      </div>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>基础配置</span>
        <!-- <span @click="onPreviewClick">预览</span> -->
      </div>
      <div>
        <el-checkbox label="刷新" v-model="form.refreshBtn"></el-checkbox>
        <el-checkbox label="分页" v-model="form.page"></el-checkbox>
        <el-checkbox label="边框" v-model="form.border"></el-checkbox>
        <el-checkbox label="斑马纹" v-model="form.stripe"></el-checkbox>
        <el-checkbox label="新增" v-model="form.addBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="编辑" v-model="form.editBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="删除" v-model="form.delBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="查看" v-model="form.viewBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="复制" v-model="form.copyBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="序号" v-model="form.index"></el-checkbox>
        <el-checkbox label="序号固定" v-model="form.indexFixed"></el-checkbox>
        <el-checkbox label="懒加载" v-model="form.lazy"></el-checkbox>
        <el-checkbox label="列显隐" v-model="form.columnBtn"></el-checkbox>
      </div>
      <div class="wrap-row">
        <el-checkbox label="统计" v-model="form.showSummary" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="打印" v-model="form.printBtn"></el-checkbox>
        <el-checkbox label="导入" v-model="form.importBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="导出" v-model="form.excelBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="创建时间搜索" v-model="form.dateBtn" :disabled="listMode===1"></el-checkbox>
        <el-checkbox label="双击编辑" v-model="form.dblEdit" :disabled="listMode===1"></el-checkbox>
        <label class="el-form-item__label" style="width:auto">控件大小</label>
        <el-select v-model="form.size" style="width:88px" size="small">
          <el-option label="偏大" value="medium"></el-option>
          <el-option label="适中" value="small"></el-option>
          <el-option label="最小" value="mini"></el-option>
          <el-option label="最大" value="large"></el-option>
        </el-select>
        <label class="el-form-item__label label-margin-left" style="width:auto">菜单大小</label>
        <el-select v-model="form.menuSize" style="width:88px" size="small" clearable>
          <el-option label="偏大" value="medium"></el-option>
          <el-option label="适中" value="small"></el-option>
          <el-option label="最小" value="mini"></el-option>
        </el-select>
        <label class="el-form-item__label label-margin-left" style="width:auto">表格高度差</label>
        <el-input-number
          v-model="form.calcHeight"
          style="width:66px"
          placeholder="像素"
          size="small"
          clearable
          :min="0"
          :controls="false"
        ></el-input-number>
        <!-- <label class="el-form-item__label label-margin-left" style="width:auto">操作栏按钮个数</label>
        <el-input v-model="form.menuMoreSize" style="width:66px" size="small" clearable></el-input>-->
      </div>
      <div class="wrap-row">
        <label class="el-form-item__label" style="width:auto">操作栏宽度</label>
        <el-input-number
          v-model="form.menuWidth"
          placeholder="像素"
          style="width: 80px;"
          size="small"
          :controls="false"
        ></el-input-number>
        <label class="el-form-item__label">搜索菜单宽</label>
        <el-input-number
          v-model="form.searchMenuSpan"
          placeholder="1-24"
          style="width: 80px;"
          size="small"
          :controls="false"
        ></el-input-number>
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
          <el-option label="2个以上收缩" :value="2"></el-option>
          <el-option label="3个以上收缩" :value="3"></el-option>
          <el-option label="4个以上收缩" :value="4"></el-option>
          <el-option label="5个以上收缩" :value="5"></el-option>
          <el-option label="不收缩展示" :value="0"></el-option>
        </el-select>
        <el-checkbox label="加载显示搜索" v-model="form.searchShow" style="margin-left:20px"></el-checkbox>
      </div>
    </div>
    <div class="form-group" v-show="form.showSummary">
      <div class="group-label">
        <span>统计合计</span>
        <span @click="sumTableClick(-1)">新增</span>
      </div>
      <el-table :data="sumColumnList" border size="mini">
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <i
              class="el-icon-sort-down sort-menu"
              v-if="scope.$index<sumColumnList.length-1"
              @click="onSumSort(scope.$index,1)"
            ></i>
            <i
              class="el-icon-sort-up sort-menu"
              v-if="scope.$index>0"
              @click="onSumSort(scope.$index,-1)"
            ></i>
            <i
              class="el-icon-plus sort-menu"
              v-if="scope.$index==sumColumnList.length-1"
              @click="sumTableClick(-1,1)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="统计类型" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="统计类型" size="mini">
              <el-option label="相加" value="sum"></el-option>
              <el-option label="平均" value="avg"></el-option>
              <el-option label="数量" value="count"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="前缀" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="显示前缀" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="后缀" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.suffix" placeholder="后缀" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="统计字段" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.name" placeholder="统计字段" size="mini">
              <el-option
                :label="item.colName"
                :value="item.prop"
                v-for="item in sumCols"
                :key="item.prop"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="小数位数" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.decimals" placeholder="小数位数" size="mini" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="sumTableClick(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>排序规则</span>
        <span @click="orderTableClick(-1)">新增</span>
      </div>
      <el-table :data="orderList" border size="mini">
        <el-table-column type="index" label="序号" width="auto" align="center"></el-table-column>
        <el-table-column label="字段" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.prop" placeholder="字段" size="mini">
              <el-option
                :label="item.label"
                :value="item.prop"
                v-for="item in orderCols"
                :disabled="colSelected(item)"
                :key="item.prop"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.order" placeholder="排序" size="mini">
              <el-option label="正序" value="ASC"></el-option>
              <el-option label="倒序" value="DESC"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="orderTableClick(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>列表配置</span>
      </div>
      <el-table :data="viewData" border size="mini" row-key="_id" :max-height="450">
        <span slot="empty"></span>
        <el-table-column label="排序" align="center" width="60">
          <template slot-scope="scope">
            <span class="sort-num" v-if="viewData.length==1">{{scope.$index+1}}</span>
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
          </template>
        </el-table-column>
        <el-table-column label="字段" v-if="listMode==1" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.prop?scope.row.prop.split('#').pop():''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="控件类型" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="控件类型"
              size="mini"
              :disabled="!listMode"
            >
              <el-option
                :label="item.label"
                :value="item.type"
                v-for="item in viewList"
                :key="item.type"
                :disabled="viewDisabled(item.type)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="列名" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="列名" size="mini" :disabled="!listMode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="字典" align="center" width="100" v-if="listMode==1">
          <template slot-scope="scope">
            <dict-select
              v-model="scope.row.dictId"
              :visible="!loading"
              :disabled="!isDictView(scope.row.type)"
              :prop="scope.row.prop || scope.row._id"
              size="mini"
            ></dict-select>
          </template>
        </el-table-column>
        <el-table-column label="显示" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.display" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center">
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
        <el-table-column label="对齐" align="center" width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.align" placeholder="对齐" size="mini">
              <el-option label="左" value="left"></el-option>
              <el-option label="中" value="center"></el-option>
              <el-option label="右" value="right"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="固定" align="center" width="80">
          <template slot-scope="scope">
            <el-select v-model="scope.row.fixed" placeholder="无" size="mini">
              <el-option label="无" value="none"></el-option>
              <el-option label="左" value="left"></el-option>
              <el-option label="右" value="right"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单行" align="center" width="46">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.overHidden" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <!-- <el-table-column label="行编辑" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.cell" size="mini"></el-checkbox>
          </template>
        </el-table-column>-->
        <el-table-column label="可查询" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.search"
              size="mini"
              :disabled="!scope.row.prop || scope.row.type=='upload'"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="查询模式" align="center">
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
        <el-table-column label="查询提示" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.searchPlaceholder"
              placeholder="占位提示"
              size="mini"
              :disabled="!scope.row.search"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="查询标签宽" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.searchLabelWidth"
              placeholder="像素"
              size="mini"
              :disabled="!scope.row.search"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="查询列占比" align="center">
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
        <el-table-column label="查询排序" align="center">
          <template slot-scope="scope">
            <el-input
              controls-position="right"
              v-model="scope.row.searchOrder"
              placeholder="数字"
              size="mini"
              :disabled="!scope.row.search"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      direction="ttb"
      size="100%"
      :visible.sync="preview"
      title="列表预览"
      append-to-body
      class="my-pop"
    >
      <form-list :option="listOption" :formId="row.id"></form-list>
    </el-drawer>
  </div>
</template>

<script>
//列表配置
import ViewListLoader from './view-list'
import FormList from './FormList'
import DictSelect from './DictSelect'
import { getDataSource } from "@/api/tool/businessTable"
// import IconSelect from './IconSelect'
import { safeString, safeParseInt, generateId } from '@/util/generator'
const defaultForm = {
  refreshBtn: true, page: true, addBtn: true, editBtn: true, searchMenuPosition: 'center', columnBtn: false,
  delBtn: true, border: true, stripe: true, searchMenuSpan: 24, searchGutter: 10, viewBtn: false,
  searchShow: true, searchIndex: 2, menuWidth: 240, size: 'medium', indexFixed: false
}
export default {
  name: 'ListSetting',
  props: {
    row: Object,//表单列表行数据
    submiting: {//同步loading给外部
      type: Boolean,
      default: false
    },
    listMode: {//1是查询列表模式
      type: Number,
      default: 0
    },
    visible: {//侧边栏可见是否
      type: Boolean,
      default: true
    }
  },
  components: { FormList, DictSelect },
  computed: {
    tableName() {
      return this.row.tableName
    }
  },
  data: () => {
    return {
      form: Object.assign({}, defaultForm),
      loading: false,
      btnList: [],
      searchForm: {},
      sourceList: [],
      sumColumnList: [],
      viewData: [],
      viewSql: '',
      viewList: [],
      paramList: [],
      orderList: [],
      orderCols: [],
      sumCols: [],
      preview: false,
      listOption: {}
    }
  },
  mounted() {
    this.viewList = ViewListLoader()
    if (!this.loading && this.row.id && !this.viewData.length) {//避免热加载重置,生产不会
      this.getFormInfo()
    }
  },
  methods: {
    onSumSort(index, direct) {//统计排序
      let newIndex = index + direct;
      if (newIndex < 0 || newIndex > this.sumColumnList.length) {
        return;
      }
      let item = this.sumColumnList[index];
      let dirItem = this.sumColumnList[newIndex];
      if (newIndex > index) {
        this.sumColumnList.splice(index, 2, dirItem, item);
      } else {
        this.sumColumnList.splice(newIndex, 2, item, dirItem);
      }
    },
    onViewSort(index, direct) {//控件排序
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
    sumTableClick(index) {//新增/删除统计信息
      if (index == -1) {
        if (!this.checkLastSum()) {
          return
        }
        this.sumColumnList.push({ type: 'sum', decimals: 2 })
      } else {
        this.sumColumnList.splice(index, 1)
      }
    },
    orderTableClick(index) {//新增/删除排序信息
      if (index == -1) {
        if (this.checkLastOrder()) {
          this.orderList.push({
            prop: this.orderList.length ? '' : 'LAST_UPDATE_DATE',
            order: 'DESC'
          })
        }
      } else {
        this.orderList.splice(index, 1)
      }
    },
    checkLastOrder() {//检查排序
      if (this.orderList.length > 0) {
        let last = this.orderList[this.orderList.length - 1]
        if (!last.prop) {
          this.$message.warning('请选择排序字段')
          return false
        }
      }
      return true
    },
    colSelected(item) {
      return !!this.orderList.find(it => it.prop == item.prop)
    },
    checkLastSum() {//检查统计
      if (this.sumColumnList.length > 0) {
        let last = this.sumColumnList[this.sumColumnList.length - 1]
        if (!last.name || !last.type) {
          this.$message.warning('请完善统计信息')
          return false
        }
      }
      return true
    },
    getFormInfo() {//获取列表定义
      this.loading = true
      this.$axios.get("/api/rabbit-resource/formcustom/form-list/" + this.row.id)
        .then(res => {
          if (res.data.data) {
            this._parsing = true
            this.parseFormData(res.data.data)
            setTimeout(() => {
              this._parsing = false
            }, 600);
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    viewDisabled(type) {//哪些view不能选择
      return !['input', 'textarea', 'number', 'date', 'datetime', 'radio', 'select', 'checkbox',
        'upload', 'password'].includes(type)
    },
    isDateView(type) {//日期view
      return ['date', 'datetime', 'time', 'daterange', 'timerange', 'datetimerange',
        'month', 'year', 'week'].includes(type)
    },
    isDictView(type) {//字典view
      return ['radio', 'select', 'checkbox', 'cascader'].includes(type)
    },
    onPreviewClick() {//预览
      let option = this.getListOption()
      if (!option) {
        return
      }
      this.listOption = option
      this.preview = true
    },
    getListOption() {//组装option
      let option = Object.assign({}, this.form)
      if (!option.searchIndex) {
        option.searchIndex = 2
        option.searchIcon = false
      } else {
        option.searchIcon = true
      }
      option.showSummary = option.showSummary && this.sumColumnList.length > 0
      option.searchGutter = safeParseInt(option.searchGutter)
      option.menuWidth = safeParseInt(option.menuWidth)
      option.searchMenuSpan = safeParseInt(option.searchMenuSpan)
      option.calcHeight = safeParseInt(option.calcHeight)
      // option.menuMoreSize = safeParseInt(option.menuMoreSize)
      let column = []
      for (let view of this.viewData) {
        if (this.listMode) {
          if (!view.label) {
            this.$message.warning('请输入列名')
            return
          }
          if (this.isDictView(view.type)) {
            if (!view.dictId) {
              this.$message.warning('请选择一个字典')
              return
            }
          } else {
            view.dictId = null
          }
        }
        let newView = Object.assign({}, view)
        if (newView.component) {
          delete newView.type
        }
        //与表单统一,表格里生效的是hide
        newView.hide = newView.display === false
        newView.width = safeString(newView.width)
        newView.searchSpan = safeParseInt(newView.searchSpan, 8)
        newView.searchOrder = safeParseInt(newView.searchOrder)
        newView.searchLabelWidth = safeParseInt(newView.searchLabelWidth)
        if (typeof newView.width == 'string' && newView.width.substr(newView.width.length - 1) == '%') {
          newView.minWidth = newView.width.substr(0, newView.width.length - 1)
          delete newView.width
        }

        column.push(newView)
      }
      // option.customBtns = this.btnList
      option.column = column
      option.sumColumnList = this.sumColumnList
      return option
    },
    onSubmitClick() {//提交
      if (this.listMode == 1 && !this.searchForm.formName) {
        this.$message.warning("请输入表单名称")
        return
      }
      if (this.listMode == 1 && this.checkSQL()) {//查询列表需要设置SQL
        return
      }
      if (this.listMode == 1 && this.viewSql !== this.searchForm.sql) {
        this.$message.warning('SQL已变更，请重新解析')
        return
      }
      if (this.listMode == 1 && !this.viewData.length) {
        this.$message.warning("请点击 '解析' 按钮")
        return
      }
      if (!this.checkLastSum()) {
        return
      }
      if (this.sumColumnList.length) {
        let shows = this.viewData.filter(it => it.display)
        let len = shows ? shows.length : 0
        if (len < this.sumColumnList.length) {
          this.$message.warning('统计数量超出列表显示的列数')
          return
        }
      }
      if (!this.checkLastOrder()) {
        return
      }
      this.loading = true
      let option = this.getListOption()
      if (!option) {
        this.loading = false
        return
      }
      option.orderBy = undefined
      let orderBy = this.getOrderByString()//orderList转为string
      let sumList = this.form.showSummary && this.sumColumnList && this.sumColumnList.length ? JSON.stringify(this.sumColumnList) : undefined
      let body = { id: this.row.id, listForm: JSON.stringify(option), orderBy: orderBy, sumList: sumList }
      if (this.listMode) {
        body.formName = safeString(this.searchForm.formName)
        body.remark = safeString(this.searchForm.remark, this.row.id ? '' : null)
        let pcForm = { sql: this.searchForm.sql, sourceId: this.searchForm.sourceId }
        body.pcForm = JSON.stringify(pcForm)
      }
      this.$axios.post("/api/rabbit-resource/formcustom/form-list", body).then(res => {
        this.$message.success(res.data.msg)
        this.loading = false
        if (!this.row.id) {
          let data = res.data.data
          data.listForm = option
          data.sourceId = this.searchForm.sourceId
          this.row.id = data.id
          this.$emit('change', data, true)
        } else {
          if (this.listMode) {
            this.row.formName = this.searchForm.formName
            this.row.remark = this.searchForm.remark
            this.row.sourceId = this.searchForm.sourceId
            this.row.pcForm = body.pcForm
          }
          this.row.orderBy = orderBy
          this.row.listForm = option
          this.$emit('change', this.row, true)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getOrderByString() {//排序变为string
      if (this.orderList.length) {
        return this.orderList.map(it => `${it.prop} ${it.order}`).join()
      }
    },
    parseOrderBy(orderBy) {//字符串排序变为list
      this.orderList = []
      if (orderBy) {
        let array = orderBy.split(/\s|,/)
        for (let i = 0; i < array.length; i += 2) {
          this.orderList.push({
            prop: array[i],
            order: array[i + 1]
          })
        }
      }
    },
    initParam() {//初始化数据
      this.sumCols = []
      // this.paramList = [{ value: '#ROW', label: "#当前行#" }, { value: '#KEY', label: "#行主键#" }]
      this.orderCols = [{ prop: 'CREATION_DATE', label: '创建时间' }, { prop: 'LAST_UPDATE_DATE', label: '更新时间' }, { prop: 'CREATED_BY', label: '创建人' }, { prop: 'LAST_UPDATED_BY', label: '最后更新人' }]
    },
    checkSQL() {//SQL检查
      if (!this.searchForm.sql) {
        this.$message.warning('请输入查询SQL')
        return true
      }
      if (!/^\s*select\s+.+from\s+.+/i.test(this.searchForm.sql)) {
        this.$message.warning('SQL不正确')
        return true
      }
    },
    onParseSQL() {//获取查询列表的SQL字段
      if (this.checkSQL()) {
        return
      }
      this.loading = true
      this.$axios.post("/api/rabbit-resource/formcustom/parse", {
        sql: this.searchForm.sql,
        sourceId: this.searchForm.sourceId
      }).then(res => {
        if (res.data.data) {
          let data = res.data.data
          let array = []
          this.initParam()
          this.viewSql = this.searchForm.sql
          for (let view of data) {
            let colName = view.colName
            if (view.status == 2 && view.colDefault) {
              colName = view.colDefault
            }
            array.push({
              _id: generateId(),
              prop: colName,
              type: 'input',
              label: view.colDesc,
              search: false,
              searchMode: 0,
              searchSpan: 8,
              groupId: '1',
              searchLabelWidth: 80,
              align: 'left',
              display: 'ID' != colName
            })
            this.sumCols.push({
              prop: colName,
              colName: colName
            })
            this.orderCols.push({
              prop: colName,
              label: colName
            })
          }
          this.viewData = array
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    parseFromOption(option, watch) {//解析option
      this.initParam()
      this.updateSearchForm()
      if (typeof option == 'string') {
        option = JSON.parse(option)
      }
      if (this.row.orderBy) {
        this.parseOrderBy(this.row.orderBy)
      }
      if (!option.searchIcon) {
        option.searchIndex = 0
      }
      if (!option.searchMenuPosition) {
        option.searchMenuPosition = option.menuPosition || 'center'
      }
      this.form = option
      let columns = option.column || []
      let rowIndex = option.rowKey && option.rowKey.lastIndexOf("#")
      let prefix = rowIndex > 0 ? option.rowKey.substring(0, rowIndex + 1) : ''
      for (let view of columns) {
        if (view.component) {
          view.type = view.component
        }
        if (!view.align) {
          view.align = 'left'
        }
        if (view.minWidth !== undefined) {
          view.width = view.minWidth + '%'
          delete view.minWidth
        }
        // if (view.prop != option.rowKey) {
        //   this.paramList.push({ value: view.prop, label: view.label })
        // }
        if (!prefix || view.prop.substr(0, prefix.length) == prefix) {
          let colName = view.prop.substr(prefix.length)
          this.orderCols.push({
            prop: colName,
            label: view.label
          })
          this.sumCols.push({
            prop: view.prop,
            colName: colName,
            label: view.label
          })
        }
      }
      this.viewData = columns
      // this.btnList = option.customBtns || []
      this.sumColumnList = option.sumColumnList || []
      if (!watch) {
        this._parsing = true
        this.row.listForm = this.deepClone(option)
        this.$emit('change', this.row)
        setTimeout(() => {
          this._parsing = false
        }, 600);
      }
      this.form.orderBy = undefined
    },
    updateSearchForm() {//更新查询列表信息
      if (this.listMode) {
        let form = this.row.pcForm
        if (typeof form === 'string') {
          form = JSON.parse(form)
        }
        if (form) {
          this.$set(this.searchForm, 'sql', form.sql)
          this.$set(this.searchForm, 'sourceId', form.sourceId)
          this.viewSql = form.sql
          this.row.tableId = 0
          this.row.sourceId = form.sourceId
        } else {
          this.viewSql = ''
        }
      }
    },
    parseFormData(data) {//解析服务端数据
      this.row.orderBy = data.orderBy
      this.row.pcForm = data.pcForm
      if (data.listForm) {
        this.parseFromOption(data.listForm)
        return
      }
      if (this.listMode) {//查询列表
        this.updateSearchForm()
        return
      }
      this.initParam()
      this.viewData = []
      let pcForm = JSON.parse(data.pcForm)
      let column = pcForm.column || []
      let groups = pcForm.group || []
      this.form.rowKey = pcForm.rowKey
      this.form.size = pcForm.size
      this.form.flowBtn = pcForm.flowBtn
      // console.log("column", column, groups)
      if (groups.length == 0 && column.length == 0) {
        return;
      }
      if (column.length > 0) {
        groups.push({
          linkId: '2',
          column: column
        })
      }
      let rowIndex = pcForm.rowKey && pcForm.rowKey.lastIndexOf("#")
      let prefix = rowIndex > 0 ? pcForm.rowKey.substring(0, rowIndex + 1) : ''
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let groupViews = group.column || [];
        if (group.listable) {//列表组件不参与
          // console.log('组件卡片不参与', group.label)
          // this.form.expand = true
          continue
        }
        for (let j = 0; j < groupViews.length; j++) {
          let view = groupViews[j];
          if (!view.label) {
            view.display = false
          }
          view.searchMode = this.isDateView(view.type) ? 6 : 0
          view.searchSpan = 8
          view.groupId = group.linkId
          view.searchLabelWidth = pcForm.labelWidth || 80
          view.align = 'left'
          view.dpy = view.display

          if (view.minWidth !== undefined) {
            view.width = view.minWidth + '%'
            delete view.minWidth
          }
          if (view.component) {
            view.type = view.component;
          }
          this.viewData.push(view);
          // if (view.prop != pcForm.rowKey) {
          //   this.paramList.push({ value: view.prop, label: view.label })
          // }
          if (!prefix || view.prop.substr(0, prefix.length) == prefix) {
            let colName = view.prop.substr(prefix.length)
            this.orderCols.push({
              prop: colName,
              label: view.label
            })
            this.sumCols.push({
              prop: view.prop,
              colName: colName,
              label: view.label
            })
          }
        }
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) {
          return
        }
        if (this.listMode) {//searchList
          this.searchForm = {
            sourceId: this.row.sourceId || '0', formName: this.row.formName || '',
            remark: this.row.remark || ''
          }
          this.viewSql = ''
          this.form = {
            refreshBtn: true, page: true, border: true, stripe: true, columnBtn: false, searchGutter: 10, viewBtn: false, searchMenuPosition: 'center', searchMenuSpan: 24, searchShow: true, searchIndex: 2,
            menuWidth: 240, size: 'medium', indexFixed: false
          }
          if (!this.sourceList.length) {
            getDataSource().then(data => {
              this.sourceList = data
            })
          }
        }
        // console.log("watch list", val, this.listForm)
        if (this.row.listForm) {
          this.loading = true
          setTimeout(() => {
            this.parseFromOption(this.row.listForm, true)
            this.loading = false
          }, 450);
          return
        }
        if (this.row.id) {
          this.loading = true
          setTimeout(() => {
            this.getFormInfo()
          }, 450);
        }
        this.viewData = []
        this.btnList = []
      },
      immediate: true
    },
    loading(val) {
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
  width: 30%;
}
.wrap-row:not(:first-child) {
  margin-top: 8px;
}

.wrap-row .el-form-item__label {
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
.group-label > span:nth-child(2) {
  color: #4d8ac8;
  font-weight: normal;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  float: right;
  margin-top: 2px;
}
.label-margin-left {
  margin-left: 30px;
}
</style>
