<template>
  <div
    class="form"
    v-loading.fullscreen="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中..."
  >
    <div class="form-group">
      <div class="group-label">
        <span>表单配置信息</span>
        <!-- <span @click="onPreviewClick">预览</span> -->
      </div>
      <div class="wrap-row">
        <label class="el-form-item__label v-required">表单编号</label>
        <el-input
          v-model="form.code"
          placeholder="请输入表单编号"
          clearable
          maxlength="40"
          show-word-limit
          size="small"
          style="min-width:252px"
          :disabled="!!form.id"
        >
          <el-button slot="append" @click="onAutoClick" v-if="!form.id">自动生成</el-button>
        </el-input>
        <label class="el-form-item__label v-required">名称</label>
        <el-input
          v-model="form.formName"
          placeholder="请输入表单名称"
          clearable
          maxlength="40"
          show-word-limit
          size="small"
          style="width: 20%;"
        ></el-input>
        <label class="el-form-item__label">备注</label>
        <el-input
          v-model="form.remark"
          placeholder="请输入备注说明"
          clearable
          maxlength="100"
          show-word-limit
          size="small"
          :readonly="readonly"
          style="width: 24%;"
        ></el-input>
      </div>
      <div class="wrap-row">
        <label class="el-form-item__label v-required">业务表</label>
        <el-select
          v-model="form.tableId"
          placeholder="请选择业务表"
          filterable
          remote
          size="small"
          :remote-method="onSearchTable"
          :loading="tableLoading"
          @change="onMainTableChange"
          :disabled="!!form.id"
        >
          <el-option
            v-for="item in tableList"
            :label="item.tbName"
            :value="item.id"
            :key="item.id"
            :disabled="!item.syncStatus"
          >
            <span style="float: left">{{ item.tbName }}</span>
            <span
              :style="{float: 'right', color: item.formPop%2!=0?'#8f91b0':'#7fa1d3', fontSize: '12px'}"
            >{{ item.tbDescription }}</span>
          </el-option>
        </el-select>
        <label class="el-form-item__label label-margin-left">标签宽度</label>
        <el-input
          v-model="form.labelWidth"
          placeholder="像素"
          style="width:72px"
          size="small"
          :readonly="readonly"
        ></el-input>
        <label class="el-form-item__label label-margin-left">标签对齐</label>
        <el-select
          v-model="form.labelPosition"
          style="width:100px"
          size="small"
          :readonly="readonly"
        >
          <el-option label="左对齐" value="left"></el-option>
          <el-option label="右对齐" value="right"></el-option>
          <el-option label="顶对齐" value="top"></el-option>
        </el-select>
        <el-button type="text" style="margin-left:24px" @click="showMoreSetting=!showMoreSetting">
          更多设置
          <i :class="[showMoreSetting?'el-icon-arrow-down':'el-icon-arrow-up']"></i>
        </el-button>
        <!-- <el-button
          type="success"
          size="small"
          style="margin-left:12%"
          @click="onSubmitClick"
          :loading="loading"
          v-if="showSubmit && !readonly"
        >提交</el-button>-->
      </div>
      <div class="wrap-row" v-show="showMoreSetting">
        <label class="el-form-item__label">控件大小</label>
        <el-select v-model="form.size" style="width:88px" size="small">
          <el-option label="偏大" value="medium"></el-option>
          <el-option label="适中" value="small"></el-option>
          <el-option label="最小" value="mini"></el-option>
          <el-option label="最大" value="large"></el-option>
        </el-select>
        <label class="el-form-item__label label-margin-left">控件间隔</label>
        <el-input v-model="form.gutter" placeholder="像素" style="width:72px" size="small"></el-input>
        <label class="el-form-item__label label-margin-left">按钮位置</label>
        <el-select v-model="form.menuPosition" style="width:100px" size="small">
          <el-option label="左对齐" value="left"></el-option>
          <el-option label="居中" value="center"></el-option>
          <el-option label="右对齐" value="right"></el-option>
        </el-select>
        <el-checkbox label="提交按钮" v-model="form.submitBtn" style="margin-left:24px;"></el-checkbox>
        <el-checkbox label="清空按钮" v-model="form.emptyBtn"></el-checkbox>
        <el-checkbox label="发起流程" v-model="form.flowBtn"></el-checkbox>
        <el-checkbox label="回车提交" v-model="form.enter"></el-checkbox>
      </div>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>
          卡片信息
          <el-switch
            v-model="form.tabs"
            active-text="tab显示"
            style="margin-left:24px"
            @change="onTabsSwitch"
          ></el-switch>
        </span>
        <span @click="groupClick(-1)" v-if="!readonly">新增</span>
      </div>
      <el-table :data="groupList" border stripe size="mini" ref="groupTable" row-key="linkId">
        <el-table-column align="center" label="排序" width="60">
          <template slot-scope="scope">
            <i
              class="el-icon-sort-down sort-menu"
              v-if="scope.$index<groupList.length-1"
              @click="onGroupSort(scope.$index,1)"
            ></i>
            <i
              class="el-icon-sort-up sort-menu"
              v-if="scope.$index>0"
              @click="onGroupSort(scope.$index,-1)"
            ></i>
            <i
              class="el-icon-plus sort-menu"
              v-if="scope.$index==groupList.length-1"
              @click="groupClick(-1,1)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="卡片名称" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.label"
              placeholder="请输入卡片名称"
              size="mini"
              :disabled="scope.row.linkId=='2'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="必填" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.required"
              @change="val => onGroupRequiredChange(scope.row, val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="显示" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.display" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="禁用" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.disabled"
              size="mini"
              @change="val => onGroupDisabledChange(scope.row, val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="折叠" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.arrow"
              size="mini"
              :disabled="form.tabs || scope.row.linkId=='2'"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="默认展开" align="center" width="90">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.collapse"
              size="mini"
              :disabled="form.tabs || scope.row.linkId=='2'"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="图标" align="center" width="60">
          <template slot-scope="scope">
            <icon-select v-model="scope.row.icon" :disabled="scope.row.linkId=='2'"></icon-select>
          </template>
        </el-table-column>
        <el-table-column label="列表" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.listable"
              size="mini"
              :disabled="scope.row.linkId=='2' || scope.row.linkId=='1'"
              @change="val => onGroupListableChange(scope.row, val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="分页" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.page"
              size="mini"
              :disabled="!scope.row.listable"
              @change="val => onGroupPageChange(scope.row,val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="复制" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.copyBtn" size="mini" :disabled="!scope.row.listable"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="导入" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.importBtn" size="mini" :disabled="!scope.row.listable"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="双击编辑" align="center" width="72">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.dblEdit" size="mini" :disabled="!scope.row.listable"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="110" v-if="!readonly">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="onLinkBtnClick(scope.row, scope.$index)"
              :disabled="!scope.row.listable"
            >关联表</el-button>
            <el-button type="text" @click="groupClick(scope.$index)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>控件信息</span>
        <el-select
          v-model="filterGroup"
          placeholder="卡片过滤"
          size="small"
          style="margin-left:24px"
          clearable
        >
          <el-option
            :label="item.label"
            :value="item.linkId"
            v-for="item in groupList"
            :key="item.linkId"
          ></el-option>
        </el-select>
        <span @click="viewTableClick(-1)" v-if="!readonly">新增</span>
      </div>
      <el-table
        :data="filterViews"
        border
        size="mini"
        ref="viewTable"
        :max-height="450"
        :cell-class-name="viewCellClassFunc"
        row-key="_id"
      >
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
              @click="viewTableClick(-1, 1)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="字段名称" align="center" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.prop"
              placeholder="字段名称"
              size="mini"
              @change="val=>onViewColChange(val,scope.row)"
              :disabled="isViewInPop(scope.row._id) || isAutoView(scope.row)"
            >
              <el-option
                :label="viewColLabel(item, scope.row)"
                :value="viewColValue(item)"
                v-for="item in selectColFun(scope.row.tableId)"
                :key="item.colName"
                :disabled="colDisabledFunc(item)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="控件名称" align="center" width="130">
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
        <el-table-column label="参数1" align="center" width="120">
          <template slot-scope="scope">
            <pop-data-select
              v-model="scope.row.param1"
              v-if="scope.row.type=='popData'"
              size="mini"
              :visible="!loading"
              :key="scope.$index"
              :view-index="scope.$index"
              :prop="scope.row.prop || scope.row._id"
              :view-id="scope.row._id"
              :table-id="getGroupTableId(scope.row.groupId)"
              :col-default="getColDefault(scope.row._id)"
              @select="onPopDataSelected"
            ></pop-data-select>
            <dict-select
              :key="scope.row._id"
              v-model="scope.row.param1"
              :visible="!loading"
              :prop="scope.row.prop || scope.row._id"
              size="mini"
              v-else-if="isDictView(scope.row.type)"
              @cascade="onDictCascaded"
            ></dict-select>
            <exp-editor
              v-model="scope.row.param1"
              :row="scope.row"
              size="mini"
              v-else-if="scope.row.type==='rowExpression'"
            ></exp-editor>
            <user-editor
              v-model="scope.row.param1"
              :row="scope.row"
              size="mini"
              @select="val=>onUserInfoSelect(scope,val)"
              v-else-if="scope.row.type==='userSelect'"
            ></user-editor>
            <download-editor
              v-model="scope.row.param1"
              :row="scope.row"
              size="mini"
              v-else-if="scope.row.type==='download'"
            ></download-editor>
            <show-editor
              v-model="scope.row.param1"
              :row="scope.row"
              size="mini"
              v-else-if="scope.row.type==='idShow'"
            ></show-editor>
            <el-input
              v-model="scope.row.param1"
              :placeholder="viewPlaceholder(scope.row,1)"
              size="mini"
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
        <el-table-column label="卡片" align="center" width="130">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.groupId"
              placeholder="卡片"
              size="mini"
              :disabled="!!scope.row.tableLink || isAutoView(scope.row)"
              @change="gid => onViewGroupChange(gid,scope)"
            >
              <el-option
                :label="item.label"
                :value="item.linkId"
                v-for="item in groupList"
                :disabled="isGroupDisabled(item,scope.row)"
                :key="item.linkId"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="宽度" align="center" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.span" placeholder="1-24" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="显示" align="center" width="46">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.display" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="必填" align="center" width="46">
          <template slot-scope="scope" v-if="!readonly">
            <el-checkbox
              v-model="scope.row.required"
              size="mini"
              @change="val=>onViewRequiredChange(scope.row.groupId,val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="禁用" align="center" width="46">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.disabled"
              size="mini"
              @change="val=>onViewDisabledChange(scope.row.groupId,val)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="禁修改" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.editDisabled" size="mini"></el-checkbox>
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
        <el-table-column label="默认值" align="center" width="120">
          <template slot-scope="scope">
            <value-editor
              v-model="scope.row.valueExp"
              placeholder="默认值"
              size="mini"
              :view-type="scope.row.type"
              :prop="scope.row.prop"
              :col-default="getColDefault(scope.row._id)"
              :param1="scope.row.param1"
              :param2="scope.row.param2"
              :edit-mode="!!form.id"
            ></value-editor>
          </template>
        </el-table-column>
        <el-table-column label="占位提示" align="center" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.placeholder" placeholder="占位提示" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="校验表达式" align="center" width="200">
          <template slot-scope="scope" v-if="!readonly">
            <el-input v-model="scope.row.pattern" placeholder="校验表达式" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="校验提示" align="center" width="200">
          <template slot-scope="scope" v-if="!readonly">
            <el-input v-model="scope.row.message" placeholder="校验提示" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="标签宽" align="center" width="95">
          <template slot-scope="scope" v-if="!readonly">
            <el-input v-model="scope.row.labelWidth" placeholder="像素" clearable size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="列表宽" align="center" width="80">
          <template slot-scope="scope" v-if="!readonly">
            <el-input v-model="scope.row.width" placeholder="像素" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center" v-if="!readonly">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="viewChangeClick(scope.$index)">change</el-button>
            <el-button type="text" size="mini" @click="viewTableClick(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      :title="linkEditTitle"
      :visible.sync="showTableLink"
      direction="rtl"
      size="60%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="my-pop"
    >
      <el-form
        :model="editTable"
        label-width="80px"
        label-position="right"
        size="small"
        style="margin-top:16px"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="卡片属表">
              <el-select
                v-model="editTable.tableId"
                placeholder="请选择卡片属表"
                filterable
                remote
                :remote-method="onSearchLinkTable"
                :loading="linkTableLoading"
                @change="onLinkTableChange"
                style="width:100%"
              >
                <el-option
                  v-for="item in linkTableList"
                  :label="item.tbDescription?(item.tbName+'（'+item.tbDescription+'）'):item.tbName"
                  :value="item.id"
                  :key="item.id"
                  :disabled="linkTableDisabled(item)"
                >
                  <span
                    style="float: left"
                  >{{ item.tbDescription?(item.tbName+'（'+item.tbDescription+'）'):item.tbName }}</span>
                  <span
                    style="float: right; color: #7fa1d3; font-size: 13px"
                    v-if="item.headerId==editTable.linkTable || _currentTable.headerId==item.id "
                  >{{ item.headerId == editTable.linkTable ? '子' : '父' }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="关联表">
              <el-select v-model="editTable.linkTable" disabled style="width:100%">
                <el-option
                  v-for="item in tableList"
                  :label="item.tbName+'（'+item.tbDescription+'）'"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="9">
            <el-form-item label="唯一主键">
              <el-select v-model="editTable.rowKey" placeholder="主键" style="width:100%">
                <el-option
                  v-for="item in linkColList"
                  :label="viewColLabel(item)"
                  :value="viewColValue(item)"
                  :key="item.colName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="SQL别名">
              <el-input v-model="editTable.alias" placeholder="SQL别名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="8">
              <el-tooltip content="已绑定了一个属表，勾选此项可重写SQL" placement="top-start">
                <el-checkbox label="SQL复写" v-model="editTable.rewrite"></el-checkbox>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="查询SQL" style="display:block">
          <el-input v-model="editTable.sql" placeholder="列表查询SQL">
            <el-button slot="append" @click="onParseSql">解析</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="editTable.colList" border stripe size="mini">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="卡片表字段" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.colName"
              placeholder="请选择卡片表字段"
              size="mini"
              v-if="!scope.row.bindParam"
            >
              <el-option
                v-for="item in linkColList"
                :label="viewColLabel(item)"
                :value="viewColValue(item)"
                :disabled="item.colName=='id' || item.colName=='ID'"
                :key="item.colName"
              ></el-option>
            </el-select>
            <el-select v-model="scope.row.param" placeholder="SQL参数" size="mini" disabled v-else>
              <el-option
                v-for="item in paramList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="关联表字段" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.linkCol"
              placeholder="请选择关联表字段"
              size="mini"
              clearable
              v-if="!scope.row.bindParam"
            >
              <el-option
                v-for="item in selectColFun(editTable.linkTable)"
                :label="viewColLabel(item)"
                :value="viewColValue(item)"
                :key="item.colName"
              ></el-option>
            </el-select>
            <el-select
              v-model="scope.row.formView"
              placeholder="参数输入控件"
              size="mini"
              clearable
              v-else
            >
              <el-option
                v-for="item in viewData"
                :label="item.label"
                :value="item._id"
                :key="item._id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="参数" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.bindParam" size="mini" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="colLinkClick(-1)" size="small">新增</el-button>
            <el-button type="text" @click="colLinkClick(scope.$index)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 16px 0 8px;text-align:end">
        <el-button type="success" @click="sumTableClick(-1)" size="small" plain>增加统计信息</el-button>
      </div>
      <el-table :data="editTable.sumList" border stripe size="mini">
        <el-table-column label="排序" align="center" width="60px">
          <template slot-scope="scope">
            <i
              class="el-icon-sort-down sort-menu"
              v-if="scope.$index<editTable.sumList.length-1"
              @click="onSumSort(scope.$index,1)"
            ></i>
            <i
              class="el-icon-sort-up sort-menu"
              v-if="scope.$index>0"
              @click="onSumSort(scope.$index,-1)"
            ></i>
            <i
              class="el-icon-plus sort-menu"
              v-if="scope.$index==editTable.sumList.length-1"
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
            <el-input v-model="scope.row.label" placeholder="前缀" size="mini"></el-input>
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
                :label="viewColLabel(item)"
                :value="viewColValue(item)"
                v-for="item in linkColList"
                :key="item.colName"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="小数位数" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.decimals" placeholder="小数位数" size="mini" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="流程变量" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" placeholder="默认{prop}_{type}" size="mini" :min="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="sumTableClick(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:end;margin-top:24px;">
        <el-button
          type="warning"
          size="small"
          plain
          @click="onLinkCancel"
          :loading="linkSetting"
        >取消关联</el-button>
        <el-button type="primary" size="small" @click="onLinkConfirm" :loading="linkSetting">确定</el-button>
        <el-button size="small" @click="showTableLink=false">取消</el-button>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="showPreview"
      size="100%"
      :title="'表单预览 '+(form.formName || '')"
      :value="1"
      :append-to-body="true"
      class="my-pop"
      destroy-on-close
    >
      <avue-form :option="formOption" v-model="avueModel" @submit="onPreviewSubmit">
        <template #menuForm="scope" v-if="formOption.flowBtn">
          <el-button
            :size="scope.size"
            :loading="scope.disabled"
            type="warning"
            plain
            icon="el-icon-position"
          >发起流程</el-button>
        </template>
      </avue-form>
    </el-drawer>
    <el-drawer
      :visible.sync="showChangeCode"
      size="50%"
      :title="changeTitle"
      :value="1"
      append-to-body
      :close-on-click-modal="false"
    >
      <div>
        <textarea ref="editor"></textarea>
      </div>
      <div style="padding:12px;line-height:1">
        <p>javascript事件</p>
        <p class="remark">使用self代替this；value为当前值；column为当前控件定义；</p>
        <p class="remark">获取表单的值可以使用 self.getValueByLabel('标签名')；</p>
        <p class="remark">更新表单的值可以使用 self.updateValueByLabel('标签名','对应值')；</p>
        <p class="remark">禁用某个字段可以调用 self.disableColumnByLabel('标签名',true/false)；</p>
        <p class="remark">self.getFormData()获取表单数据对象；发送请求可以使用self.$axios；</p>
      </div>
      <div style="text-align:end;margin-top:24px;margin-right:16px">
        <el-button type="warning" size="small" @click="onChangeEvent(1)" plain>清空</el-button>
        <el-button type="primary" size="small" @click="onChangeEvent">确定</el-button>
        <el-button size="small" @click="showChangeCode=false">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import IconSelect from "./IconSelect.vue";
import ViewListLoader from "./view-list.js";
import DictSelect from './DictSelect'
import PopDataSelect from './PopDataSelect'
import ValueEditor from './ValueEditor'
import UserEditor from './UserEditor'
import ExpEditor from './ExpEditor';
import DownloadEditor from './DownloadEditor';
import ShowEditor from './ShowEditor';
import {
  generateId, formatFileSize, parseFileSize, safeParseInt, safeString,
  parseSQLParams, parseStringArray, getListTypeAccept, parseExpression
} from '@/util/generator'
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import "codemirror/theme/hopscotch.css"
import "codemirror/mode/javascript/javascript.js"

const defaultForm = {
  labelWidth: 80,
  labelPosition: "right",
  gutter: 10,
  size: "small",
  menuPosition: "right",
  submitBtn: true,
  emptyBtn: true,
  flowBtn: false,
  submitText: "提交",
  emptyText: "清空",
  code: "",
  formName: "",
  remark: ""
}
export default {//表单定义
  name: "FormCustom",
  provide() {
    return {
      parentCustom: this
    };
  },
  props: {
    formId: String,//表单id
    formData: {//表单列表的row,可用于本地回显
      type: Object,
      default: () => {
      }
    },
    submiting: {//loading同步给外部
      type: Boolean,
      default: false
    },
    readonly: {//只读,暂时用不到
      type: Boolean,
      default: false
    },
    visible: {//侧边栏可见是否,用于watch初始化数据
      type: Boolean,
      default: true
    }
    // showSubmit: {
    //   type: Boolean,
    //   default: true
    // },
  },
  components: {
    IconSelect, DictSelect, PopDataSelect, ValueEditor,
    ExpEditor, UserEditor, DownloadEditor, ShowEditor
  },
  computed: {
    linkEditTitle() {//关联标题
      let label = this.editTable.label || "";
      return `卡片 ${label} 关联表`;
    },
    changeTitle() {//change标题
      let view = this.viewData[this.updateIndex]
      if (!view) {
        return 'change事件'
      }
      return `change事件（${view.label || (this.updateIndex + 1)}）`
    },
    filterViews() {
      if (!this.filterGroup || this.groupList.length < 2) {
        return this.viewData
      }
      return this.viewData.filter(it => it.groupId === this.filterGroup)
    }
  },
  data: () => {
    return {
      avueModel: {},//预览的form
      form: Object.assign({}, defaultForm),//表单自定义对象
      loading: false,//加载标记
      tableList: [],//主业务表选择list
      linkTableList: [],//关联表选择list
      linkSetting: false,//关联操作标记
      viewData: [],//表单控件list
      showTableLink: false,//显示关联设置页面
      showIconSelect: false,//显示图标选择页面
      showChangeCode: false,//显示change编辑页面
      showPreview: false,//显示预览页面
      tableLoading: false,//主业务表模糊搜索loading
      hasOperation: false,//标记用户操作
      linkTableLoading: false,//关联模糊搜索loading
      showMoreSetting: false,//更多设置标记
      editTable: {},//关联表设置model
      linkTables: [],//关联表设置信息集合
      updateIndex: -1,//正在操作的哪一行
      groupList: [{
        display: true, linkId: '1', arrow: true, collapse: true, disabled: false,
        label: '', required: false, listable: false, page: false
      }],//卡片集合,默认卡片id为1,不可删除
      viewList: null,//选择的控件集合,来源view-list.js
      linkColList: [],//关联的选择字段list
      tableCols: {},//<tableId,colList>缓存
      formOption: {},//预览option
      paramList: [],//关联表SQL参数
      filterGroup: ''
    };
  },
  beforeDestroy() {
    if (this.editorView) {
      try {
        this.editorView.toTextArea()
      } catch (error) {
        console.log("destroy editorView error", error)
      }
      this.editorView = undefined
    }
    delete this._dicProps
    delete this._popProps
    delete this._cascadedMap
    delete this._currentTable
  },
  mounted() {
    // console.log("monute", this.formData)
    if (!this.viewList) {
      this.viewList = ViewListLoader();
    }
  },
  methods: {
    viewColLabel(colItem, viewItem) {//控件的字段显示
      let prefix = viewItem && viewItem.tableLink ? (viewItem.tableLink + ".") : ''
      if (colItem.status == 2 && colItem.colDefault) {
        return prefix + colItem.colDefault
      }
      return prefix + colItem.colName
    },
    viewColValue(col) {//控件的prop格式化
      if (col.tableName) {
        return `n#${col.tableName}#${col.colName}`
      }
      // if (col.tableId) {
      //   return `t#${col.tableId}#${col.colName}`
      // }
      return col.colName
    },
    onTabsSwitch(val) {//tab显示变更,插入/删除表头卡片
      if (val) {
        let nogroup = this.groupList.find(it => it.linkId == '2')
        if (!nogroup) {
          this.groupList.push({//固定id 2
            linkId: '2',
            label: '表头(不按tab显示,在顶部)',
            display: true,
            arrow: false,
            listable: false,
            page: false,
            required: false,
            disabled: false,
            collapse: true
          })
        }
      } else {
        let index = this.groupList.findIndex(it => it.linkId == '2')
        if (index >= 0) {
          this.groupList.splice(index, 1)
          let sort = false
          for (let view of this.viewData) {
            if (view.groupId == '2') {
              view.groupId = '1'
              sort = true
            }
          }
          sort && this.sortViewByGroup()
        }
      }
    },
    onSearchTable(name) {//主表模糊搜索
      if (name) {
        this.tableLoading = true;
        this.$axios.get("/api/rabbit-resource/formcustom/selectByTableName", {
          params: {
            tableName: name
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.tableList = res.data.data;
          }
          this.tableLoading = false;
        }).catch(() => {
          this.tableLoading = false;
        });
      }
    },
    isDictView(type) {//字典赋值的控件
      return ['select', 'radio', 'checkbox', 'cascader'].includes(type)
    },
    hasCasParent(dicId) {//查询是否有级联的父字典
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
    loopFindDicCasProp(dicId, container, hasFind) {//查询级联字典
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
    onDictCascaded(cascadedMap) {//字典级联设置
      if (!this._cascadedMap) {
        this._cascadedMap = cascadedMap
      } else {
        this._cascadedMap = Object.assign(this._cascadedMap, cascadedMap)
      }
      this.hasOperation = true
    },
    onSearchLinkTable(name) {//关联表模糊搜索
      if (name) {
        this.linkTableLoading = name !== true;
        this.$axios.get("/api/rabbit-resource/formcustom/selectByTableName", {
          params: {
            tableName: name === true ? "-1" : name,
            sourceId: name === true ? this._currentTable.id : this._currentTable.sourceId
          }
        }).then(res => {
          if (res.data && res.data.data) {
            this.linkTableList = res.data.data;
          }
          this.linkTableLoading = false;
        }).catch(() => {
          this.linkTableLoading = false;
        });
      }
    },
    linkTableDisabled(item) {//关联表不多选,不能与主表一样
      let disabled = this.form.tableId == item.id || !item.syncStatus
      if (disabled) {
        return disabled
      }
      return !!this.linkTables.find(it => it.tableId == item.id)
    },
    onLinkTableChange(id, start) {//关联表变更,start初始化回显
      if (id === "") {
        return
      }
      let table = start ? null : this.linkTableList.find(it => it.id == id)
      let tableName = table && table.tbName
      let desc = table && table.tbDescription
      this.$axios.post("/api/rabbit-resource/formcustom/parse", {
        sql: "T",
        sourceId: id
      }).then(res => {
        let colList = res.data && res.data.data || []
        this.linkColList = colList
        if (start) {//回显
          this.tableCols[id] = colList
        } else {
          this.editTable.hasParam = false
          this.paramList = []
          this.editTable.tableName = tableName
          this.editTable.desc = desc

          if (this.editTable.colList.length > 0) {
            this.editTable.colList = []
          }
          if (this.editTable.sumList && this.editTable.sumList.length > 0) {
            this.editTable.sumList = []
          }
          this.colLinkClick(-1)
        }
      })
    },
    onMainTableChange(id) {//业务表选择,未同步的表不能选择
      let table = this.tableList.find(it => it.id == id);
      let old = this._currentTable && this._currentTable.id;
      this.loadTableCols(id, old);
      if (
        !this.form.formName ||
        (this._currentTable &&
          this.form.formName == this._currentTable.tbName + "的表单")
      ) {
        this.form.formName = table.tbName + "的表单";
      }
      let group = this.groupList.find(it => it.linkId == '1')
      let clabel =
        this._currentTable &&
        this._currentTable.tbDescription &&
        this._currentTable.remark;
      let label = table.tbDescription || table.remark;
      if ((label && !group.label) || (clabel && clabel != group.label)) {
        this.$set(group, "label", label);
      }
      if ((table.remark && !this.form.remark) || (this._currentTable && this._currentTable.remark === this.form.remark)) {
        this.form.remark = table.remark
      }
      //选中的业务表,可参考业务表模糊搜索接口返回的数据结构
      this._currentTable = table;
    },
    onParseSql(toast, psql) {//关联表的字段来源于SQL
      let sql = psql || this.editTable.sql
      if (!sql) {
        return
      }
      if (![1, 2].includes[toast] && /^\d+$/.test(this.editTable.tableId)) {//1确认过, 2初始化
        this.$confirm('已绑定了一个业务表，重写SQL将覆盖业务表。不想覆盖，可勾选"SQL复写"', '', {
          type: 'warning'
        }).then(() => {
          this.onParseSql(1)
        }).catch(() => {
          //cancel
        })
        return
      }
      let parseSql
      let source
      let doc = sql.replace(/#\{.+?\}/g, "'1'")
      if (this.editTable.rewrite && !isNaN(this.editTable.tableId)) {
        parseSql = 'T'
        source = this.editTable.tableId
      } else {
        source = this._currentTable && this._currentTable.sourceId || 0
        parseSql = doc
      }
      let hasParam = doc.length != sql.length
      this.$axios.post("/api/rabbit-resource/formcustom/parse", {
        sql: parseSql,
        sourceId: source,
      }).then(res => {
        if (res.data.data) {
          this.linkColList = res.data.data
          if (hasParam) {
            this.paramList = parseSQLParams(sql, true)
          } else {
            this.paramList = []
          }
          if (toast !== 2) {//非初始化
            this.editTable.hasParam = hasParam
            if (!this.editTable.rewrite) {
              this.editTable.tableId = generateId()
              this.editTable.tableName = ''
            }
            if (this.editTable.colList.length > 0) {
              this.editTable.colList = []
            }
            if (this.editTable.sumList && this.editTable.sumList.length > 0) {
              this.editTable.sumList = []
            }
            this.colLinkClick(-1)
            // console.log('sql tableId', this.editTable.tableId)
          }
        }
      })
    },
    loadTableCols(cid, old) {//主表切换,加载字段
      this.$axios.post("/api/rabbit-resource/formcustom/parse", {
        sql: "T",
        sourceId: cid
      }).then(res => {
        if (res.data.data) {
          if ('start' === old) {
            setTimeout(() => {
              this.$set(this.tableCols, cid, res.data.data)
            })
            return
          }
          //清空所有数据
          this.hasOperation = true
          let newViews = []
          this.form.rowKey = null
          let cols = []
          let index = -1
          for (let view of res.data.data) {
            let lowerid = view.colName.toLowerCase();
            let display = lowerid != "id" && lowerid != "header_id"
            let valueExp = view.colDefault ? { type: 10, value: view.colDefault } : null
            let viewType = view.colType == 6 ? "datetime" : (view.colType < 4 ? 'number' : 'input')
            let viewItem = {
              span: 12,
              display: display,
              type: viewType,
              groupId: '1',
              prop: this.viewColValue(view),
              // colType: view.colType,//表的的类型修改后会同步不了
              param3: viewType != 'input' ? null : view.colLen,
              param4: view.colType == 3 ? view.digists : null,
              param1: null,
              param2: null,
              param5: null,
              placeholder: null,
              width: null,
              labelWidth: null,
              message: null,
              pattern: null,
              valueExp: valueExp,
              tableId: view.tableId,
              required: display && view.nullable === 0,
              disabled: false,
              tableName: view.tableName,
              label: view.colDesc || view.colName,
              _id: generateId()
            }
            if (view.colPrimary && cid == this.form.tableId) {
              this.form.rowKey = view.tableName ? (`n#${view.tableName}#${view.colName}`) : view.colName
            }
            if (index === -1 && lowerid == 'id') {
              index = newViews.length
            }
            this.onViewTypeChange(viewItem, viewType, 1)
            newViews.push(viewItem);
            cols.push({
              colName: view.colName,
              tableId: view.tableId,
              tableName: view.tableName,
              colType: view.colType,
              colDesc: view.colDesc
            });
          }
          if (!this.form.rowKey && index >= 0) {
            this.form.rowKey = newViews[index].prop
          }
          this.tableCols[cid] = cols;
          if (old) {
            delete this.tableCols[old]
          }
          if (this._popProps) {
            this._popProps = []
          }
          if (this._dicProps) {
            this._dicProps = []
          }
          if (this._viewPopMap) {
            this._viewPopMap = {}
          }
          if (this.linkTables.length) {
            this.linkTables = []
          }
          if (this.groupList.length > 1) {
            let group = this.groupList.find(it => it.linkId == '1')
            this.groupList = [group]
          }
          this.viewData = newViews;
        }
      });
    },
    onPreviewClick() {//预览
      let option = this.getAvueData();
      // console.log("preview", option);
      if (!option) {
        return;
      }
      this.avueModel = {}
      this.formOption = option;
      this.showPreview = true;
    },
    selectColFun(tableId) {//字段选择列表
      // console.log("selectColFun", tableId, this.tableCols)
      return this.tableCols[tableId] || [];
    },
    getColDefault(viewId) {//获取该弹出框的列表映射
      let props = this._popProps || []
      let data = props.find(it => it.viewId === viewId)
      // console.log("col default", props, data, viewId)
      return data && data.data
    },
    popDataSelectable(popId, viewId, tableId) {//弹出框是否可选择,限制每个弹出框使用一次
      let props = this._popProps || []
      for (let item of props) {
        if (item.popId === popId) {
          if (item.viewId === viewId) {
            return true
          }
          let view = this.viewData.find(it => it._id === item.viewId)
          if (view && view.tableId === tableId) {//子表可选择
            return false
          }
        }
      }
      // let data = props.find(it => it.popId == popId)
      // if (data && data.viewId !== viewId) {
      //   return false
      // }
      return true
    },
    buildViewPopMap() {//为了方便获取view的弹出框定义,形成一个控件id和popId的映射
      let viewMap = {}
      let props = this._popProps || []
      for (let prop of props) {
        let data = prop.data || []
        for (let col of data) {
          if (col.colMode == 1) {//控件
            viewMap[col.formView] = prop.popId
            if (!col.colReplace) {
              continue
            }
            if (!this.tableCols) {
              this.tableCols = {}
            }
            let colList = this.tableCols[col.popTableId]
            if (!colList) {
              colList = []
              this.$set(this.tableCols, col.popTableId, colList)
            }
            let cols = col.popCol.split("#")
            if (cols.length == 3 && cols[0] == 'n') {
              if (!colList.find(it => it.colName == cols[2])) {
                colList.push({
                  colName: cols[2],
                  tableName: cols[1],
                  tableId: col.popTableId
                })
              }
            } else if (cols.length == 1) {
              colList.push({
                colName: cols[0],
                tableName: col.tableName,
                tableId: col.popTableId
              })
            }
          }
        }
      }
      this._viewPopMap = viewMap
      // console.log("tableCols", this.tableCols)
    },
    isViewInPop(vid) {//组件是否来自弹出框
      if (this._viewPopMap && this._viewPopMap[vid]) {
        return true
      }
      if (!this._popProps) {
        return false
      }
      return !!this._popProps.find(it => it.viewId == vid)
    },
    onPopDataSelected(popId, viewIndex, viewId, colData, lazy) {//弹出框确认
      this.hasOperation = true
      if (!this._popProps) {
        this._popProps = []
      }
      if (this.filterViews !== this.viewData) {
        let find = this.filterViews[viewIndex]
        viewIndex = this.viewData.findIndex(it => it._id === find._id)
      }
      let viewItem = this.viewData[viewIndex]
      let index = this._popProps.findIndex(it => it.viewId == viewItem._id)
      if (index >= 0) {//删除旧的字段列表
        let oldPop = this._popProps[index]
        let oldList = oldPop.data || []
        for (let pitem of oldList) {
          if (pitem.colReplace) {
            delete this.tableCols[pitem.popTableId]
          }
        }
      }
      // console.log("onPopDataSelected", viewItem, colData)
      let cols = this.selectColFun(viewItem.tableId)
      let fromTable = cols && cols.length > 0 && cols[0].tableName
      let where = []
      let formCols = {}
      let tempTable = generateId()
      let formCol = ''
      let colSize = 0
      for (let item of colData) {
        if (item.colMode == 2) {//参数,记录好id就可以
          continue
        }
        if (item.colMode == 0) {//字段映射
          let colView = this.viewData.find(it => it.prop == item.colName)
          if (colView) {
            colView.display = false
          }
          where.push({
            fromId: viewItem._id,
            fromTable: fromTable,
            fromCol: item.colName,
            toCol: item.popCol,
            toTable: item.popTable
          })
          formCols[item.popCol] = popId
          colSize++
        } else if (item.formView == viewItem._id) {//控件映射
          if (viewItem.prop == item.popCol || (colSize == 1 && formCols[viewItem.prop])) {
            item.colReplace = true
          }
          this.bindPopCol2Form(viewItem, item, tempTable)
          if (viewItem.disabled) {
            viewItem.disabled = false
          }
          formCol = viewItem.prop
        } else if (item.formView) {
          let viewInner = this.viewData.find(it => it._id == item.formView)
          // viewInner.popId = popId
          if (viewInner) {
            if (viewInner.prop == item.popCol || (colSize == 1 && formCols[viewInner.prop])) {
              item.colReplace = true
            }
            if (item.popType) {
              viewInner.type = item.popType
              viewInner.lastType = item.popType
            }
            this.bindPopCol2Form(viewInner, item, tempTable)
            formCol = viewInner.prop
          }
        }
        if (formCol && formCols[formCol]) {//字段和控件都映射的,是冗余字段,不构成where
          let findex = where.findIndex(it => it.toCol == formCol)
          if (findex >= 0) {
            where.splice(findex, 1)
            // console.log("remove where", where)
          }
        }
        formCol = ''
      }
      let group = this.groupList.find(it => it.linkId == viewItem.groupId)
      // index = this._popProps.findIndex(it => it.popId == popId)
      let obj = {
        popId: popId,
        viewId: viewId,
        linkId: viewItem.groupId,
        listable: group && group.listable,
        lazy: lazy,
        data: colData,
        where: where
      }
      if (index >= 0) {
        this._popProps.splice(index, 1, obj)
      } else {
        this._popProps.push(obj)
      }
      this.buildViewPopMap()
    },
    bindPopCol2Form(viewItem, item, tempTable) {//弹出框信息绑定到view组件
      if (!viewItem.label && item.popLabel) {
        viewItem.label = item.popLabel
      }
      if (item.viewMode) {
        viewItem.param1 = item.viewMode
        viewItem.param2 = item.prepend
        viewItem.param3 = item.append
        viewItem.param4 = null
        viewItem.param5 = null
        viewItem.action = item.action
        viewItem.accept = item.accept
        if (viewItem.type !== 'idShow') {
          viewItem.type = 'idShow'
          this.onViewTypeChange(viewItem, viewItem.type, 1)
        }
      } else {
        let showComponents = { 'areaSelect': 1, 'userSelect': 2, 'deptSelect': 3, 'postSelect': 4, 'roleSelect': 5, 'upload': 9 }
        let showIndex = !item.popType ? 0 : showComponents[item.popType]
        if (showIndex) {
          if (viewItem.type !== item.popType) {
            viewItem.type = item.popType
            if (showIndex !== 9) {
              viewItem[`param${showIndex === 1 ? 4 : (showIndex == 2 ? 3 : 2)}`] = true
            }
            this.onViewTypeChange(viewItem, viewItem.type, 1)
          }
        } else if (viewItem.type == 'input' || viewItem.type == 'password' || viewItem.type == 'textarea') {//只读
          viewItem.param5 = true
        } else if (viewItem.type != 'popData') {
          viewItem.disabled = true
        }
      }
      viewItem.display = true
      if (!viewItem.prop || item.colReplace) {
        viewItem.prop = item.popCol
        item.popTableId = item.popTableId || tempTable
        viewItem.tableId = item.popTableId
        item.colReplace = true
        let cols = item.popCol.split("#")
        let col = item.popCol
        if (cols.length == 3 && cols[0] == 'n') {
          viewItem.tableName = cols[1]
          col = cols[2]
        } else {
          viewItem.tableName = item.popTable
        }
        let colList = this.tableCols[viewItem.tableId]
        if (!colList) {
          colList = []
          this.tableCols[viewItem.tableId] = colList
        }
        if (!colList.find(it => it.colName == col)) {
          colList.push({
            colName: col,
            tableName: viewItem.tableName,
            tableId: viewItem.tableId
          })
        }
      }
    },
    colDisabledFunc(colItem) {//控件字段不多选
      let value = this.viewColValue(colItem)
      return !!this.viewData.find(
        it => it.prop == value && (!colItem.tableId || colItem.tableId == it.tableId)
      );
    },
    onAutoClick() {//表单编号赋值
      if (!this._serverId) {
        if (this.loading) {
          return
        }
        this.getServerFormId();
      } else {
        this.form.code = "form-" + this._serverId;
      }
    },
    getServerFormId() {//获取表单编号
      this.$axios.get("/api/rabbit-resource/formcustom/createId")
        .then(res => {
          // console.log("res", res.data)
          if (res.data.data) {
            this._serverId = res.data.data;
            this.onAutoClick();
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    onGroupSort(index, direct) {//卡片上下排序
      let newIndex = index + direct;
      // console.log("onGroupSort index", index, newIndex);
      if (newIndex < 0 || newIndex > this.groupList.length) {
        return;
      }
      let item = this.groupList[index];
      let dirItem = this.groupList[newIndex];
      if (item.linkId == '2' || dirItem.linkId == '2') {
        this.$message.warning('表头组只能排在最后')
        return
      }
      if (newIndex > index) {
        this.groupList.splice(index, 2, dirItem, item);
      } else {
        this.groupList.splice(newIndex, 2, item, dirItem);
      }
      this.sortViewByGroup()
    },
    onViewSort(index, direct) {//view上下顺序切换
      let newIndex = index + direct;
      let array = this.filterViews
      if (newIndex < 0 || newIndex > array.length) {
        return;
      }
      let item = array[index];
      let dirItem = array[newIndex];
      if (item.groupId != dirItem.groupId) {
        this.$message.warning('只能相同卡片内进行排序')
        return
      }
      if (array !== this.viewData) {
        index = this.viewData.findIndex(it => it._id === item._id)
        newIndex = this.viewData.findIndex(it => it._id === dirItem._id)
      }
      if (newIndex > index) {
        this.viewData.splice(index, 2, dirItem, item);
      } else {
        this.viewData.splice(newIndex, 2, item, dirItem);
      }
    },
    groupClick(index, from) {//删除/增加卡片
      if (index == -1) {
        let index = this.groupList.findIndex(it => it.linkId == '2')
        let group = {
          display: true, linkId: generateId(), arrow: true, collapse: false, required: false,
          disabled: false, page: false, label: '', listable: false
        }
        if (index >= 0) {
          this.groupList.splice(index, 0, group)
        } else {
          this.groupList.push(group);
        }
        this.hasOperation = true
        if (this.groupList.length > 3) {
          this.$nextTick(() => {
            let ele = document.querySelector(".my-form .el-drawer__body")
            if (from) {
              ele.scrollTop += 41
            } else {
              ele.scrollTop = 41 * this.groupList.length
            }
          })
        }
      } else {
        let group = this.groupList[index]
        if (group.linkId == '1' || group.linkId == '2') {//默认卡片和表头不可删除
          this.$message.warning('不能删除该卡片')
          return
        }
        const removeGroup = () => {
          this.hasOperation = true
          let dels = this.groupList.splice(index, 1);
          if (dels && dels.length > 0) {
            return new Promise(resovle => {
              let groupId = dels[0].linkId;
              let removeLink = false
              if (this.linkTables) {
                let linkIndex = this.linkTables.findIndex(it => it.linkId == groupId)
                // console.log("removeLink", linkIndex)
                if (linkIndex >= 0) {
                  removeLink = true
                  let link = this.linkTables.splice(linkIndex, 1)[0]
                  if (link.tableId != this.form.tableId) {
                    delete this.tableCols[link.tableId]
                    // console.log("removeTableCols", link.tableId)
                  }
                }
              }
              if (this.filterGroup === groupId) {
                this.filterGroup = ''
              }
              let newViews = []
              for (let i = 0; i < this.viewData.length; i++) {
                let item = this.viewData[i];
                if (item.groupId == groupId) {
                  if (!removeLink) {
                    item.groupId = '1';
                    if (item.tableId != this.form.tableId) {
                      item.tableId = this.form.tableId;
                      item.tableName = this._currentTable.tbName
                      item.prop = ''
                    }
                    item.tableLink = undefined
                    item.tableAlias = undefined
                    newViews.push(item)
                  }
                } else {
                  newViews.push(item)
                }
              }
              this.viewData = newViews
              if (!removeLink) {
                this.sortViewByGroup()
              }
              resovle()
            })
          }
        }
        if (group.listable) {
          this.$confirm('确定要删除列表的卡片吗?')
            .then(() => {
              removeGroup()
            }).catch(() => {
              //cancel
            })
        } else if (this.form.id) {
          this.$confirm('正处于编辑模式, 确定要删除吗?')
            .then(() => {
              removeGroup()
            }).catch(() => {
              //cancel
            })
        } else {
          removeGroup()
        }
      }
    },
    onChangeEvent(clear) {//change确认
      if (!this.editorView) {
        this.$message.warning("编辑器初始化失败,请重新刷新页面")
        return
      }
      let view = this.viewData[this.updateIndex]
      if (clear === 1) {
        view.changeEvent = undefined
        this.showChangeCode = false
        return
      }
      let doc = this.editorView.getValue("\n")
      if (!doc || /^\s+$/.test(doc)) {
        view.changeEvent = undefined
      } else {
        view.changeEvent = doc
      }
      this.showChangeCode = false
    },
    viewChangeClick(index) {//编辑view,change
      //编辑change事件
      let view = this.filterViews[index]
      if (this.filterViews !== this.viewData) {
        this.updateIndex = this.viewData.findIndex(it => it._id === view._id)
      } else {
        this.updateIndex = index
      }
      this.showChangeCode = true
      let doc = view.changeEvent || ''
      const setValue = () => {
        setTimeout(() => {
          this.editorView.setValue(doc)
          this.editorView.focus()
          if (doc) {
            this.editorView.setCursor(this.editorView.lineCount(), 0)
          }
        }, 200);
      }
      if (!this.editorView) {
        this.$nextTick(() => {
          this.editorView = CodeMirror.fromTextArea(this.$refs.editor, {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            lineWrapping: true,
            smartIndent: true,
            mode: "javascript",
            theme: 'hopscotch',
            autofocus: true,
          });
          // console.log("editor", this.editorView)
          setValue()
        })
      } else {
        setValue()
      }
    },
    viewTableClick(index, add) {//新增/删除控件
      //保证列表的控件在最后
      //新增/删除控件，选择业务表后，默认将非id，header_id字段加入
      if (!this.form.tableId) {
        this.$message.warning('请先选择业务表')
        return
      }
      if (index == -1) {
        let index = this.viewData.length - 1
        let groupId = '1'
        let tableId
        let tableName
        let link = null
        if (this.filterViews !== this.viewData) {
          let find = this.filterViews[this.filterViews.length - 1]
          index = this.viewData.findIndex(it => it._id === find._id)
          add = 1
        }
        if (!add) {
          for (let i = index; i >= 0; i--) {//找出默认卡片控件位置
            if (this.viewData[i].groupId == '1') {
              index = i
              break
            }
          }
          tableId = this.form.tableId
          tableName = this._currentTable && this._currentTable.tbName
        } else {//找出最后个控件信息
          groupId = this.viewData[index].groupId
          tableId = this.viewData[index].tableId
          tableName = this.viewData[index].tableName
          link = this.viewData[index].tableLink
        }
        let view = {
          span: 12, display: true, type: "input", label: '', prop: null,
          param3: null, param4: null, param1: null, param2: null, param5: null,
          placeholder: null, width: null, labelWidth: null, message: null, pattern: null,
          required: false, disabled: false, groupId: groupId, tableId: tableId,
          tableName: tableName, _id: generateId()
        };
        if (link) {
          view.tableLink = link
        }
        this.viewData.splice(index + 1, 0, view);
        this.hasOperation = true
        if (this.viewData.length > 2) {
          this.$nextTick(() => {
            let ele = this.$refs.viewTable.$refs.bodyWrapper
            if (ele) {
              ele.scrollTop = !add ? index * 40.5 : (ele.scrollTop + 41)
            }
          })
        }
      } else {
        let array = this.filterViews
        //弹出框的不能删除
        if (this.isViewInPop(array[index]._id)) {
          this.$message.error("该组件已绑定了弹出框");
          return
        }
        if (this.isAutoView(array[index])) {
          this.$message.error("附带组件不能删除");
          return
        }
        const removeView = () => {
          this.hasOperation = true
          let view = array[index]
          if (view.type === 'userSelect' && view.param1) {//删除选人的附属组件
            let newData = []
            for (let i = 0; i < this.viewData.length; i++) {
              if (this.viewData[i].action != view.action) {
                newData.push(this.viewData[i])
              }
            }
            this.viewData = newData
          } else {
            if (array !== this.viewData) {
              index = this.viewData.findIndex(it => it._id === view._id)
            }
            this.viewData.splice(index, 1)
          }
        }
        if (this.form.id) {
          this.$confirm('正处于编辑模式, 确定要删除吗?')
            .then(() => {
              removeView()
            }).catch(() => {
              //cancel
            })
        } else {
          removeView()
        }
      }
    },
    colLinkClick(index) {//新增/删除关联映射
      if (index == -1) {
        if (!this.linkColList || !this.linkColList.length) {
          this.$message.warning("请先选择一个属表")
          return
        }
        if (this.editTable.colList.length == 0) {//寻找id列的对应关系
          let headerId = null
          let id = null
          let idPat = /.+id$/i //表的id是自动生成的,应该寻找以id结尾的
          let headPat = /^header_id$/i
          let rowId = null
          for (let col of this.linkColList) {
            if ('ID' == col.colName) {
              rowId = col;
            } else if (idPat.test(col.colName)) {
              id = col;
            } else if (headPat.test(col.colName)) {
              headerId = col;
            }
            if (id && headerId) {
              break
            }
          }
          if (!headerId) {
            headerId = id
          }
          let linkCols = this.selectColFun(this.editTable.linkTable)
          let linkId = undefined
          if (linkCols) {
            linkId = linkCols.find(it => 'ID' == it.colName)
          }
          let colList = []
          colList.push({
            colName: headerId && this.viewColValue(headerId),
            linkCol: linkId && this.viewColValue(linkId)
          })
          this.editTable.rowKey = rowId && this.viewColValue(rowId)
          if (this.paramList && this.paramList.length) {
            for (let item of this.paramList) {
              colList.push({
                bindParam: true,
                param: item.value
              })
            }
          }
          this.editTable.colList = colList
        } else if (this.checkLastLinkCol()) {
          this.editTable.colList.push({})
        }
      } else if (index) {
        let item = this.editTable.colList[index]
        if (item.bindParam) {
          this.$message.warning('需完善参数映射')
          return
        }
        this.editTable.colList.splice(index, 1)
      }
    },
    checkLastLinkCol() {//检查关联表映射
      if (this.editTable.colList.length > 0) {
        for (let last of this.editTable.colList) {
          if (last.bindParam && (!last.formView || !last.param)) {
            this.$message.warning('请先完善映射关系')
            return false
          }
          if (!last.bindParam && (!last.colName || !last.linkCol)) {
            this.$message.warning('请先完善映射关系')
            return false
          }
        }
      }
      return true
    },
    onLinkBtnClick(row, index) {//跳转绑定关联表
      if (!this.form.tableId) {
        this.$message.warning("请先选择业务表");
        return;
      }
      let table = this.linkTables.find(it => it.linkId == row.linkId);
      if (!table) {
        this.editTable = { linkId: row.linkId };
      } else {
        this.editTable = Object.assign({}, table);
      }
      this.editTable.linkTable = this.form.tableId;
      this.editTable.label = row.label;
      this.editTable.disabled = row.disabled
      if (!this.editTable.label) {
        this.editTable.label = `${index + 1}`;
      }
      if (!this.editTable.colList) {
        this.editTable.colList = [];
      }
      if (!this.editTable.sumList) {
        this.editTable.sumList = [];
      }
      this.linkColList = this.editTable.tableId && this.tableCols[this.editTable.tableId] || []
      this._tempTable = this.editTable.tableId
      if (table) {
        if (this.linkTableList.length == 0 && /^\d+$/.test(table.tableId)) {
          this.linkTableList = [{ id: table.tableId, tbName: table.tableName, tbDescription: '' }]
          this.onLinkTableChange(table.tableId, true)
        } else if (this.linkTableList.length == 0) {
          this.onParseSql(2)
        }
      } else {
        this.onSearchLinkTable(true)
      }
      this.showTableLink = true;
    },
    removeLinkTable(index, group) {//删除关联表信息
      let linkId = this.editTable.linkId
      if (index >= 0) {
        let link = this.linkTables.splice(index, 1)[0]
        let viewList = []
        linkId = link.linkId
        for (let view of this.viewData) {
          if (view.groupId != linkId) {
            viewList.push(view)
          }
        }
        if (link && link.tableId != this.form.tableId) {
          delete this.tableCols[link.tableId]
        }
        this.viewData = viewList
      }
      if (!group) {
        group = this.groupList.find(it => it.linkId == linkId)
      }
      if (group) {//不判断的话需用set
        if (group.page) {
          group.page = false
        }
        if (group.importBtn) {
          group.importBtn = false
        }
        if (group.copyBtn) {
          group.copyBtn = false
        }
        if (group.dblEdit) {
          group.dblEdit = false
        }
        group.listable = false
      }
      if (this._popProps && this._popProps.length) {
        let newProps = []
        for (let pop of this._popProps) {
          if (pop.linkId != linkId) {
            newProps.push(pop)
          }
        }
        this._popProps = newProps
        this.buildViewPopMap()
      }
      this.showTableLink = false
      this.linkSetting = false
    },
    onLinkCancel() {//关联表取消
      this.linkSetting = true
      let index = this.linkTables.findIndex(it => it.linkId == this.editTable.linkId)
      this.removeLinkTable(index)
    },
    onLinkConfirm() {//关联表确认
      this.linkSetting = true
      if (!this.editTable.tableId) {
        this.$message.warning('请选择卡片属表或输入查询SQL')
        this.linkSetting = false
        return
      }
      if (!this.editTable.colList || this.editTable.colList.length == 0) {
        this.$message.warning('请增加表的关联关系')
        this.linkSetting = false
        return
      }
      if (!this.checkLastLinkCol()) {
        this.linkSetting = false
        return
      }
      if (!this.editTable.rowKey && !this.editTable.disabled) {
        this.$message.warning('可编辑的卡片列表需要指定主键')
        this.linkSetting = false
        return
      }
      if (this.editTable.alias && !/[a-zA-Z][a-zA-Z0-9_-]+/.test(this.editTable.alias)) {
        this.$message.warning('别名应以字母开头，字母、数字、横杆和下划线组合')
        this.linkSetting = false
        return
      }
      if (!this.checkLastSum()) {
        this.linkSetting = false
        return
      }
      if (this.editTable.desc && this.editTable.label !== this.editTable.desc) {
        let group = this.groupList.find(it => it.linkId == this.editTable.linkId)
        group && this.$set(group, 'label', this.editTable.desc)
      }
      // console.log("onLinkConfirm", this.editTable)
      let index = this.linkTables.findIndex(it => it.linkId == this.editTable.linkId)
      if (index >= 0) {
        this.linkTables.splice(index, 1, this.editTable)
      } else {
        this.linkTables.push(this.editTable)
      }
      this.tableCols[this.editTable.tableId] = this.linkColList

      let sort = true
      if (this._tempTable && this.editTable.tableId == this._tempTable) {
        sort = false
        for (let view of this.viewData) {
          if (view.tableId == this.editTable.tableId) {
            view.tableLink = this.editTable.alias || this.editTable.tableName
          }
        }
      } else {
        let newViewList
        if (this._tempTable) {
          delete this.tableCols[this._tempTable]
          newViewList = []
          for (let view of this.viewData) {
            if (view.tableId != this._tempTable) {
              newViewList.push(view)
            }
          }
        } else {
          newViewList = this.viewData
        }
        for (let view of this.linkColList) {
          let lowerid = view.colName.toLowerCase();
          // if (!this.editTable.tableName && view.tableName) {
          //   this.editTable.tableName = view.tableName
          // }
          let display = lowerid != "id" && lowerid != "header_id"
          let valueExp = view.status != 2 && view.colDefault ? { type: 10, value: view.colDefault } : null
          let viewType = view.colType == 6 ? "datetime" : (view.colType < 4 ? 'number' : 'input')
          newViewList.push({
            span: 12,
            display: display,
            type: viewType,
            groupId: this.editTable.linkId,
            prop: this.viewColValue(view),
            required: display && view.nullable === 0,
            // colType: view.colType,
            param3: viewType != 'input' ? null : view.colLen,
            param4: view.colType == 3 ? view.digists : null,
            disabled: false,
            valueExp: valueExp,
            tableId: view.tableId,
            tableName: view.tableName,
            tableLink: this.editTable.alias || view.tableName,
            label: view.colDesc || view.colName,
            _id: generateId()
          })
        }
        this.viewData = newViewList
      }
      this.showTableLink = false
      this.editTable.label = undefined
      if (!this.editTable.tableName && !this.editTable.disabled && !/^\d+$/.test(this.editTable.tableId)) {
        let group = this.groupList.find(it => it.linkId == this.editTable.linkId)
        group && this.$set(group, "disabled", true)
      }
      this.editTable.disabled = undefined
      this.editTable.desc = undefined
      sort && this.sortViewByGroup()
      this.linkSetting = false
    },
    onViewColChange(col, viewItem) {//控件字段变更
      this.hasOperation = true
      let colList = this.selectColFun(viewItem.tableId)
      let colItem = colList.find(it => col == this.viewColValue(it))
      // viewItem.colType = colItem && colItem.colType
      if (!viewItem.label && colItem) {
        viewItem.label = colItem.colDesc
      }
      if (viewItem.tableLink) {//修正linkTableName,避免多张表
        let split = col.split("#")
        let colName = col
        let tableName = ''
        if (split.length == 3 && split[0] == 'n') {
          colName = split[2]
          tableName = split[1]
        } else if (split.length == 3 && split[0] == 't') {
          colName = split[2]
        }
        if (!tableName) {
          let colList = this.selectColFun(viewItem.tableId)
          if (colList) {
            let colSel = colList.find(it => this.viewColValue(it) == col)
            if (colSel) {
              tableName = colSel.tableName
            }
          }
        }
        if (tableName) {
          viewItem.tableName = tableName
          if (viewItem.tableFix) {
            viewItem.tableLink = tableName
            delete viewItem.tableFix
          }
        }
        if (!viewItem.label) {
          this.$set(viewItem, 'label', colName)
        }
      }
    },
    isGroupDisabled(group, row) {
      // console.log("group disbaled", row, group)
      if (this.isViewInPop(row._id)) {//弹出框的不可变更卡片
        return this.getGroupTableId(row.groupId) != this.getGroupTableId(group.linkId)
      }
      return false
    },
    onViewGroupChange(groupId, scope) {//控件卡片变更
      let viewItem = scope.row
      // let oldTable = viewItem.tableId
      if ('userSelect' == viewItem.type && viewItem.param1) {//选人的变更,其附属信息一同变更
        for (let i = 0; i < this.viewData.length; i++) {
          let view = this.viewData[i]
          if (view.action == viewItem.action) {
            view.groupId = groupId
          }
        }
      }
      let table = this.linkTables.find(it => it.linkId == groupId)
      if (table) {//切换到关联表的卡片,prop重新绑定
        viewItem.tableId = table.tableId
        // viewItem.tableName = table.tableName //可能不准确
        viewItem.tableLink = table.alias
        if (!table.alias) {
          viewItem.tableLink = table.tableName || 'temp'
          viewItem.tableFix = true
        }
        //重新选,交由 onViewColChange 修正
        viewItem.prop = ''
        viewItem.colType = undefined
        this.$set(viewItem, 'label', '')
      } else {
        viewItem.tableId = this.form.tableId
        viewItem.tableName = this._currentTable.tbName
        if (viewItem.tableLink) {
          delete viewItem.tableLink
        }
        if (viewItem.tableFix) {
          delete viewItem.tableFix
        }
      }
      // console.log("onViewGroupChange", oldTable, viewItem.tableId)
      this.sortViewByGroup()
    },
    sortViewByGroup() {//表单控件排序
      return new Promise(resovle => {
        this.hasOperation = true
        let indexMap = {}
        for (let i = 0; i < this.groupList.length; i++) {
          indexMap[this.groupList[i].linkId] = i
        }
        this.viewData.sort((a, b) => {
          if (a.groupId == b.groupId) {
            return 0
          }
          let aindex = indexMap[a.groupId]
          let bindex = indexMap[b.groupId]
          return aindex > bindex ? 1 : -1
        })
        resovle()
      })
    },
    getGroupTableId(groupId) {//获取卡片绑定的关联表id
      if (groupId == '1') return this.form.tableId
      let table = this.linkTables.find(it => it.linkId == groupId);
      return table ? table.tableId : this.form.tableId
    },
    filterViewList(view) {//根据字段类型过滤可选组件
      //避免又去修改colType,还是查询一遍吧
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
    isAutoView(view) {//是否自定生成的view,如选人的附属信息
      return view.newFlag == 2
    },
    onUserInfoSelect(scope, data) {//选人附属信息绑定
      let newData = []
      let index = scope.$index
      if (this.filterViews !== this.viewData) {
        index = this.viewData.findIndex(it => it._id === scope.row._id)
      }
      let findIndex = index
      if (!scope.row.action) {//标明附属信息来源于该选人组件
        scope.row.action = generateId()
      }
      let action = scope.row.action
      if (data && data.length) {
        for (let i = 0; i < this.viewData.length; i++) {
          let view = this.viewData[i]
          if (view.action != action) {
            newData.push(view)
          } else if (i == findIndex) {
            newData.push(view)
            index = newData.length
          }
        }
        scope.row.step = 1
        let valueMap = {
          company: { name: '所在公司', key: '{USER_COMPANY}' }, deptName: { name: '所在部门', key: '{USER_DEPT}' }, postName: { name: '所在岗位', key: '{USER_POST}' }, roleName: { name: '所属职务', key: '{USER_ROLE}' }, code: { name: '员工工号', key: '{USER_NUMBER}' }, phone: { name: '手机号', key: '{USER_PHONE}' }
        }
        let checkArr = []
        for (let item of data) {
          let view = {
            span: 12, display: true, type: "input", param5: true, groupId: scope.row.groupId, newFlag: 2,
            tableId: scope.row.tableId, tableName: scope.row.tableName, _id: generateId(), action: action,
            label: valueMap[item.value].name, prop: item.label, disabled: false, required: false
          }
          if (!item.label.startsWith('{')) {
            checkArr.push(item.label)
          }
          newData.splice(index++, 0, view)
        }
        if (checkArr.length) {
          let dataArr = []
          for (let i = 0; i < newData.length; i++) {
            let view = newData[i]
            if (view.action == action || !checkArr.includes(view.prop)) {
              dataArr.push(view)
            }
          }
          newData = dataArr
        }
      } else {
        scope.row.step = undefined
        for (let i = 0; i < this.viewData.length; i++) {
          let view = this.viewData[i]
          if (view.action == action) {
            if (view.prop.startsWith("{")) {//附属信息默认字段,valueMap->key
              continue
            }
            view.newFlag = undefined
          }
          newData.push(view)
        }
      }
      this.viewData = newData
    },
    getShowColName(colName) {//控件prop的colName
      if (!colName) return "";
      let arr = colName.split("#", 2);
      return arr[arr.length - 1];
    },
    viewCellClassFunc() {//控件表格额外class
      //{row, column, rowIndex, columnIndex}
      return "my-cell";
    },
    viewPlaceholder(listItem, num) {//参数占位说明
      let params = this.viewParams(listItem.type, num);
      if (params) {
        this.getParamSelectData(listItem, -1);
        return params.placeholder;
      }
      return `参数${num}`;
    },
    getParamSelectData(listItem, num) {//选项参数数据
      if (listItem.dicDatas) {
        return num == -1 ? null : listItem.dicDatas[num - 1];
      }
      this.onViewTypeChange(listItem, listItem.type, 1)
      return !listItem.dicDatas || num == -1
        ? null
        : listItem.dicDatas[num - 1];
    },
    onViewTypeChange(listItem, type, init) {//控件类型变更
      if (!init && this._popProps && !this.loading) {
        // console.log("removePopProps", type, listItem.label)
        //删除弹出框的定义
        let popIndex = this._popProps.findIndex(it => it.viewId == listItem._id)
        if (popIndex >= 0) {
          let oldPop = this._popProps.splice(popIndex, 1)[0]
          let oldList = oldPop.data || []
          listItem[`old1`] = null
          for (let pitem of oldList) {
            if (pitem.colReplace) {
              delete this.tableCols[pitem.popTableId]
              let view = this.viewData.find(it => it._id == pitem.formView)
              if (view) {
                view.param1 = null
                view.prop = ''
                view.tableId = this.form.tableId
                view.tableName = this._currentTable && this._currentTable.tableName
              }
            }
          }
          this.buildViewPopMap()
        } else {
          if (this._viewPopMap && this._viewPopMap[listItem._id]) {
            listItem.type = listItem.lastType || listItem.oldType || 'input'
            this.$message.warning('该组件已绑定了弹出框')
            return
          }
        }
      }
      let checkAction = null
      if (!init && !this.loading) {
        if (listItem.lastType == 'userSelect') {//删除选人的附属信息
          checkAction = listItem.action
          listItem.action = undefined
          listItem.step = undefined
        }
        let same = listItem.oldType != undefined && listItem.oldType == type;
        for (let i = 1; i < 6; i++) {
          this.$set(listItem, `param${i}`, same ? listItem[`old${i}`] : null)
          // this.$set(listItem, `param${i}`, null)
        }
        this.hasOperation = true
      }
      listItem.lastType = type
      let viewItem = this.viewList.find(it => it.type == type);
      let dicDatas = {};
      listItem.dicDatas = dicDatas;
      if (viewItem && viewItem.params && viewItem.params.length > 0) {//组装参数
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
      if (checkAction) {//删除选人附属组件
        let newData = []
        for (let item of this.viewData) {
          if (item.action != checkAction) {
            newData.push(item)
          }
        }
        this.$nextTick(() => {
          this.viewData = newData
        })
      }
    },
    viewParams(type, num) {//表格参数定义obj
      let viewItem = this.viewList.find(it => it.type == type);
      if (viewItem && viewItem.params && viewItem.params.length >= num) {
        return viewItem.params[num - 1];
      }
      return "";
    },
    onGroupListableChange(group, val) {//卡片,列表属性变化
      if (!val) {
        let linkIndex = this.linkTables.findIndex(it => it.linkId == group.linkId)
        if (linkIndex >= 0) {
          this.$confirm('该卡片已关联表, 是否需要取消关联?', '', {
            type: 'warning'
          }).then(() => {
            this.removeLinkTable(linkIndex, group)
          }).catch(() => {
            group.listable = true
          })
        }
      } else if (group.arrow && !this.form.tabs) {
        this.$set(group, 'required', true)
        this.$set(group, 'collapse', true)
      }
    },
    onGroupPageChange(group, val) {
      if (val && !group.disabled) {
        group.page = false
        this.$message.warning('能编辑的列表不能分页')
      }
    },
    onGroupDisabledChange(group, val) {
      if (group.listable) {//列表的禁用相当于是否可编辑
        if (!val) {
          let link = this.linkTables.find(it => it.linkId == group.linkId)
          if (link && !link.rowKey) {
            group.disabled = true
            this.$message.warning('关联的表未指定主键,只能禁用')
          }
          if (link && !link.tableName) {
            group.disabled = true
            this.$message.warning('只能编辑业务表模式')
          }
        }
        if (group.page && !val) {
          group.page = false
          this.$message.warning('能编辑的列表不能分页')
        }
        return
      }
      this.updateViewByGroupId(group.linkId, "disabled", val);
    },
    onGroupRequiredChange(group, val) {
      if (group.listable) {//列表的required 表明是否不能为空,不关联
        return
      }
      this.updateViewByGroupId(group.linkId, "required", val);
    },
    updateViewByGroupId(groupId, key, val) {//卡片属性关联
      for (let i = 0; i < this.viewData.length; i++) {
        let viewItem = this.viewData[i];
        if (viewItem.groupId == groupId) {
          let needSet = viewItem[key] != undefined;
          viewItem[key] = val;
          if (needSet) {
            this.$set(this.viewData, i, viewItem);
          }
        }
      }
    },
    onViewDisabledChange(groupId, val) {//卡片属性关联
      this.checkGroupValue(groupId, "disabled", val);
    },
    onViewRequiredChange(groupId, val) {//卡片属性关联
      this.checkGroupValue(groupId, "required", val);
    },
    checkGroupValue(groupId, key, val) {//卡片属性关联
      let checked = val;
      if (checked) {
        for (let i = 0; i < this.viewData.length; i++) {
          let viewItem = this.viewData[i];
          if (viewItem.groupId == groupId && viewItem[key] != val) {
            checked = !val;
          }
        }
      }
      for (let i = 0; i < this.groupList.length; i++) {
        let groupItem = this.groupList[i];
        if (groupItem.linkId == groupId) {
          if (groupItem.listable) {//忽略列表关联
            return
          }
          let needSet = groupItem[key] != undefined;
          groupItem[key] = checked;
          if (needSet) {
            this.$set(this.groupList, i, groupItem);
          }
        }
      }
    },
    checkLastSum(sumList, label) {//关联表统计检查
      if (!sumList) {
        sumList = this.editTable.sumList || []
      }
      if (sumList.length > 0) {
        let last = sumList[sumList.length - 1]
        if (!last.name || !last.type) {
          this.$message.warning(`请完善${label || ''}统计信息`)
          return false
        }
      }
      return true
    },
    onSumSort(index, direct) {//关联表统计排序
      let sumList = this.editTable.sumList || []
      let newIndex = index + direct;
      if (newIndex < 0 || newIndex > sumList.length) {
        return;
      }
      let item = sumList[index];
      let dirItem = sumList[newIndex];
      if (newIndex > index) {
        sumList.splice(index, 2, dirItem, item);
      } else {
        sumList.splice(newIndex, 2, item, dirItem);
      }
    },
    sumTableClick(index) {//关联表统计信息
      if (!this.editTable.sumList) {
        this.editTable.sumList = []
      }
      let sumList = this.editTable.sumList
      if (index == -1) {
        if (!this.linkColList || !this.linkColList.length) {
          this.$message.warning("请先选择一个属表")
          return
        }
        if (!this.checkLastSum()) {
          return
        }
        sumList.push({ type: 'sum', decimals: 2 })
      } else {
        sumList.splice(index, 1)
      }
    },
    onPreviewSubmit(form, done) {//预览
      done(form)
    },
    onSubmitClick() {//提交
      let name = safeString(this.form.formName);
      if (!name) {
        this.$message.warning("请输入表单名称");
        return;
      }
      if (!this.form.tableId) {
        this.$message.warning("请选择业务表");
        return;
      }
      if (!this.form.code) {
        if (!this._serverId) {
          this.$message.warning("请输入表单编号或点击自动生成");
          return;
        }
        this.form.code = this._serverId
      }
      this.loading = true
      let valueMap = {}
      let avue = this.getAvueData(valueMap);
      if (!avue) {
        this.loading = false
        return;
      }
      if (this._popProps && this._popProps.length) {//避免删除出错引起错误
        let popArr = []
        for (let pop of this._popProps) {
          let view = this.viewData.find(it => it._id === pop.viewId)
          if (view && view.param1 == pop.popId) {
            pop.linkId = view.groupId
            let group = this.groupList.find(it => it.linkId === view.groupId)
            pop.listable = group && group.listable
            popArr.push(pop)
          }
        }
        this._popProps = popArr
      }
      let data = {
        formName: name,
        code: safeString(this.form.code),
        id: this.form.id,
        tableId: this.form.tableId,
        remark: safeString(this.form.remark, this.form.id ? '' : null),
        valueMap: valueMap
      };
      data.pcForm = JSON.stringify(avue);
      data.tableProps = this.linkTables && JSON.stringify(this.linkTables)
      data.dictProps = this._dicProps && JSON.stringify(this._dicProps)
      data.popProps = this._popProps && JSON.stringify(this._popProps)
      this.$axios.post('/api/rabbit-resource/formcustom/save-forms', data)
        .then(res => {
          if (res.data.data) {
            this.$set(this.form, 'id', res.data.data)
            data.id = res.data.data
            if (this._currentTable) {
              data.tableName = this._currentTable.tbName
              data.sourceId = this._currentTable.sourceId
            }
            data.status = 1
            this.$message.success(res.data.msg)
            this.$emit('change', data, true)
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    getCurrentTableInfo(tid) {//表信息回显
      if (!this.tableCols[tid]) {
        this.loadTableCols(tid, 'start')
      }
      const loadEnd = () => {
        this.loading = false
      }
      this.$axios.get("/api/rabbit-resource/formcustom/tables-id", {
        params: { ids: tid }
      }).then(res => {
        if (res.data.data && res.data.data.length) {
          this._currentTable = res.data.data[0]
          this.tableList = [this._currentTable]
          if (!this.linkTables || !this.linkTables.length) {
            setTimeout(() => loadEnd(), 200);
            return
          }
          const parseSQL = (link, sql, sourceId) => {
            return new Promise((resovle, reject) => {
              this.$axios.post("/api/rabbit-resource/formcustom/parse", {
                sql: sql,
                sourceId: sourceId
              }).then(res => {
                if (res.data.data) {
                  setTimeout(() => {
                    this.$set(this.tableCols, link, res.data.data)
                  })
                }
                resovle()
              }).catch(err => reject(err))
            })
          }
          let reqs = []
          let sourceId = this._currentTable.sourceId
          for (let item of this.linkTables) {
            if (this.tableCols[item.tableId]) {
              continue
            }
            if (!isNaN(item.tableId)) {
              reqs.push(parseSQL(item.tableId, "T", item.tableId))
            } else {
              reqs.push(parseSQL(item.tableId, item.sql, sourceId))
            }
          }
          if (!reqs.length) {
            loadEnd()
            return
          }
          Promise.all(reqs).then(() => loadEnd()).catch(() => loadEnd())
        }
      }).catch(() => {
        setTimeout(() => loadEnd(), 300);
      })
    },
    parseAvueData(res, watch) {//解析服务端数据
      // console.log("parseAvueData", res, watch)
      let data = res.pcForm;
      if (res.tableProps) {
        this.linkTables = JSON.parse(res.tableProps)
      } else {
        this.linkTables = []
      }
      if (res.dictProps) {
        this._dicProps = JSON.parse(res.dictProps)
        this._cascadedMap = {}
        for (let dic of this._dicProps) {
          if (dic.cascadedId) {
            this._cascadedMap[dic.dicId] = dic.cascadedId
          }
        }
      } else {
        this._cascadedMap = {}
        this._dicProps = []
      }
      if (res.popProps) {
        this._popProps = JSON.parse(res.popProps)
      } else {
        this._popProps = []
        this._viewPopMap = {}
      }
      //解析avue的json数据
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      this.form.labelWidth = data.labelWidth;
      this.form.labelPosition = data.labelPosition;
      this.form.size = data.size;
      this.form.enter = data.enter;
      this.form.submitBtn = data.submitBtn;
      this.form.submitText = data.submitText;
      this.form.emptyBtn = data.emptyBtn;
      this.form.emptyText = data.emptyText;
      this.form.gutter = data.gutter;
      this.form.flowBtn = data.flowBtn;
      this.form.menuPosition = data.menuPosition;
      this.form.tabs = data.tabs;
      this.form.tableId = res.tableId;
      this.form.code = res.code;
      this.form.formName = res.formName;
      this.form.rowKey = data.rowKey;
      this.form.remark = res.remark;
      this.form.id = res.id;
      let groups = data.group || [];
      let column = data.column || []

      this.getCurrentTableInfo(res.tableId)
      this.buildViewPopMap(true)
      if (groups.length == 0 && column.length == 0) {
        this.$set(this.groupList, 0, {
          display: true,
          linkId: '1',
          label: res.formName,
        });
        if (!watch) {
          this.$emit('change', res)
        }
        this.groupList = [];
        this.viewData = [];
        return;
      }
      if (column.length > 0) {
        groups.push({
          linkId: '2',
          label: '表头(不按tab显示,在顶部)',
          display: true,
          arrow: false,
          collapse: true,
          column: column
        })
      }
      if (!this.viewList) {
        this.viewList = ViewListLoader()
      }
      let viewArray = []
      let groupArray = []
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let groupViews = group.column || [];
        if (group.listable && groupViews.length > 0) {
          //列表的group包含一个表格控件
          let tableOption = groupViews[0].option || {};
          groupViews = tableOption.column || [];
        }
        for (let j = 0; j < groupViews.length; j++) {
          let view = groupViews[j];
          if (view.minWidth !== undefined) {
            view.width = view.minWidth + '%'
            delete view.minWidth
          }
          view.groupId = group.linkId;
          if (view.component) {
            view.type = view.component;
            delete view.component
          }
          if (view.changeEvent) {
            view.changeEvent = decodeURIComponent(view.changeEvent)
          }
          //组装param1-5
          let paramView = this.viewList.find(it => it.type == view.type);
          if (view.value && paramView && paramView.valType == "array") {
            view.value = view.value.join()
          }
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
              view[`old${k + 1}`] = old;//用于选回原类型控件的回显
              view[`param${k + 1}`] = old;
              view[param.key] = undefined
            }
          }
          //提前装配好数据
          this.onViewTypeChange(view, view.type, 1)
          viewArray.push(view);
        }
        group.column = undefined;
        groupArray.push(group);
      }
      this.viewData = viewArray
      this.groupList = groupArray
      if (!watch) {
        this.$emit('change', res)
      }
    },
    getAvueData(valueMap) {//组装avue表单数据,valueMap 字段的默认值定义
      let viewMap = {};//按卡片分类view
      let _dicProps = []//字典回显需要
      for (let i = 0; i < this.viewData.length; i++) {
        let view = this.viewData[i];
        if (view.type !== 'download' && !safeString(view.label)) {
          this.$message.error(
            "控件必须有名称,请为控件" + (i + 1) + "设置名称"
          );
          return;
        }
        if (!view.groupId) {
          this.$message.error(
            "控件必须有分组,请为 " + view.label + " 分组"
          );
          return;
        }
        if (!view.prop && !['rowExpression', 'download'].includes(view.type)) {
          this.$message.error(
            "控件必须有字段,请为 " + view.label + " 选择字段"
          );
          return;
        }
        let views = viewMap[view.groupId];
        if (!views) {
          views = [];
          viewMap[view.groupId] = views;
        }
        view.span = safeParseInt(view.span, 12)
        let newView = Object.assign({}, view);
        newView.label = safeString(newView.label, '')
        newView.labelWidth = safeString(newView.labelWidth)
        newView.width = safeString(newView.width)
        if (typeof newView.width == 'string' && newView.width.substr(newView.width.length - 1) == '%') {
          newView.minWidth = newView.width.substr(0, newView.width.length - 1)
          delete newView.width
        }
        newView.span = parseInt(newView.span)
        //去除一些属性的影响
        newView.dicDatas = undefined//缓存的view-list.js中的params
        newView.dicData = undefined
        newView.oldType = undefined
        newView.lastType = undefined
        newView.dicUrl = undefined
        newView.props = undefined
        newView.multiple = undefined
        newView.limit = undefined
        newView.propsHttp = undefined
        newView.fileSize = undefined
        newView.actionData = undefined
        newView.canvasOption = undefined
        newView.showWordLimit = undefined
        newView.rules = undefined
        newView.controls = undefined
        newView.cascaderItem = undefined
        newView.cascaderItem2 = undefined
        newView.event = {}
        if (view.type === 'userSelect' || view.newFlag === 2) {
          newView.accept = undefined
          newView.action = view.action
          newView.actionData = view.actionData
        } else if (view.type !== 'idShow') {
          newView.action = undefined
          newView.accept = undefined
        }
        if (!valueMap) {//预览
          if (newView.labelWidth == '0') {
            newView.label = ''
          }
          if (!newView.label) {
            newView.labelWidth = 4
          }
          if (newView.valueExp) {
            newView.value = '【自动生成】'
            newView.disabled = newView.valueExp.disabled || newView.disabled
          }
          if (newView.changeEvent) {
            newView.event.change = value => {
              try {
                console.log("change value", value)
                Function('self', 'value', 'column', newView.changeEvent)(
                  { msg: '只能预览布局', form: this.formData, getFormData: () => this.formData }, value, newView)
              } catch (error) {
                console.log('change事件异常', error)
              }
            }
          }
        } else {
          if (newView.changeEvent) {//须转换，不然可能保存失败
            newView.changeEvent = encodeURIComponent(newView.changeEvent)
          }
          if (newView.valueExp && newView.valueExp.type == 1) {
            let vprop = newView.prop
            if (!/^[ntgp]#.+/.test(vprop)) {
              if (this._viewPopMap && this._viewPopMap[newView._id]) {
                vprop = 'p#' + this._viewPopMap[newView._id] + "#" + vprop
              } else if (this._popProps) {
                let pop = this._popProps.find(it => it.viewId == newView._id)
                if (pop) {
                  vprop = 'p#' + pop.popId + "#" + vprop
                }
              }
            }
            valueMap[vprop] = newView.valueExp
          }
        }
        newView.placeholder = safeString(newView.placeholder, 'number' === newView.type
          && newView.display ? '请输入数字' : undefined)
        newView.pattern = safeString(newView.pattern)
        newView.message = safeString(newView.message)
        if (newView.required || newView.pattern) {
          let rules = newView.rules || []
          if (newView.required) {
            rules.push({
              required: true,
              message: `${newView.label}不能为空`
            })
          }
          if (newView.pattern) {
            rules.push({
              type: 'pattern',
              pattern: newView.pattern,
              message: newView.message || `${newView.label}输入不正确`
              // ,trigger: newView.dictId ? 'change' : 'blur'
            })
          }
          newView.rules = rules
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
        } else if (newView.type == 'popData') {
          newView.action = this.form.code
        } else if (newView.type == 'rowExpression') {
          let expression = newView.param1
          if (!expression) {
            this.$$message.warning(`请输入${newView.label}表达式`)
            return
          }
          newView.actionData = parseExpression(expression, this.selectColFun(newView.tableId))
          // console.log("exp dic", newView.dicData)
        }
        newView.value = safeString(newView.value)

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
                    (/^\s*false\s*$/i.test(paramVal + '') ? false : paramVal)
                } else if (param.key == 'activeValue') {
                  newView.dicData[1].value = !isNaN(paramVal) ? parseInt(paramVal) :
                    (/^\s*true\s*$/i.test(paramVal + '') ? true : paramVal)
                }
                // continue
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
                if ('select' == view.type) {//查询级联设置
                  cascadedId = this._cascadedMap && this._cascadedMap[paramVal]
                  let casItems = []
                  let hasFind = []
                  this.loopFindDicCasProp(paramVal, casItems, hasFind)
                  if (casItems.length > 0) {
                    newView.cascaderItem = casItems
                  } else if (this.hasCasParent(paramVal)) {
                    newView.dicUrl += '&key={{key}}'
                  }
                  // console.log("cascaded", casItems, cascadedId)
                }
                _dicProps.push({
                  tableId: newView.tableId || this.form.tableId,
                  linkId: newView.groupId,
                  tableName: newView.tableName || this._currentTable.tbName,
                  viewId: newView._id,
                  colName: newView.prop,
                  dicId: paramVal,
                  cascadedId: cascadedId
                })
              } else if (view.type === "upload") {
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
                  // console.log('fileSize', paramVal)
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
              if (param.valType == "array") {//将逗号分隔的字符串转为数组
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
        if (newView.required && newView.readonly) {//修正
          newView.readonly = this.isViewInPop(newView._id)
        }
        // if (newView.required && newView.disabled) {//修正
        //   newView.disabled = !!newView.valueExp
        // }
        for (let k = 1; k < 6; k++) {
          if (valueMap) {
            delete newView[`old${k}`];
          }
          delete newView[`param${k}`];
        }
        views.push(newView);
      }
      if (valueMap) {
        this._dicProps = _dicProps
      }
      //组装成avue的json数据
      let data = {
        // column: [],
        labelWidth: this.form.labelWidth,
        labelPosition: this.form.labelPosition,
        size: this.form.size,
        gutter: this.form.gutter,
        menuPosition: this.form.menuPosition,
        menuBtn: this.form.submitBtn || this.form.emptyBtn,
        submitBtn: this.form.submitBtn,
        submitText: this.form.submitText,
        emptyBtn: this.form.emptyBtn,
        emptyText: this.form.emptyText,
        enter: this.form.enter,
        tabs: this.form.tabs,
        tableId: this.form.tableId,
        rowKey: this.form.rowKey,
        emptySize: this.form.size,
        submitSize: this.form.size,
        flowBtn: this.form.flowBtn,
      };
      data.gutter = safeParseInt(data.gutter, 0)
      data.labelWidth = safeParseInt(data.labelWidth, defaultForm.labelWidth)
      data.submitText = safeString(data.submitText, defaultForm.submitText)
      data.emptyText = safeString(data.emptyText, defaultForm.emptyText)
      let groups = [];
      for (let group of this.groupList) {
        let newGroup = Object.assign({}, group);
        let views = viewMap[newGroup.linkId] || [];
        if (newGroup.linkId == '2') {
          data.column = views
          continue
        } else if (newGroup.listable) {
          let gtable = this.linkTables.find(it => it.linkId == newGroup.linkId)
          if (!gtable) {
            this.$message.warning('列表的卡片未关联表' + (group.label ? `（${group.label}）` : ''))
            return
          }
          if (gtable.sumList && !this.checkLastSum(gtable.sumList, newGroup.label)) {
            return
          }
          if (gtable.sumList && gtable.sumList.length) {
            let showViews = views.filter(it => it.display) || []
            if (gtable.sumList.length > showViews.length) {
              this.$message.warning(`${newGroup.label || ''} 统计信息超出表格列数`)
              return
            }
          }
          newGroup.column = [
            {
              component: "formTable",
              span: 24,
              label: '',
              vlabel: newGroup.label,
              labelWidth: 0,
              tableId: gtable.tableId,
              readonly: !!newGroup.disabled,
              required: newGroup.required,
              option: {
                formCode: this.form.code,
                linkId: newGroup.linkId,
                dblEdit: newGroup.dblEdit,
                rowKey: gtable.rowKey,
                page: newGroup.page,
                columnBtn: false,
                printBtn: false,
                searchBtn: false,
                refreshBtn: false,
                importBtn: !!newGroup.importBtn,
                excelBtn: false,
                cancelBtn: true,
                saveBtn: true,
                addBtn: true,
                updateBtn: true,
                delBtn: true,
                editBtn: true,
                showSummary: !!(gtable.sumList && gtable.sumList.length),
                sumColumnList: gtable.sumList,
                menuPosition: this.form.menuPosition,
                labelWidth: this.form.labelWidth,
                labelPosition: this.form.labelPosition,
                gutter: Math.max(0, this.form.gutter - 4),
                size: 'mini',
                border: true,
                copyBtn: !!newGroup.copyBtn,
                menu: true, //操作栏
                align: "center",
                column: views
              }
            }
          ];
        } else {
          newGroup.column = views;
        }
        groups.push(newGroup);
      }
      data.group = groups;
      viewMap = null;
      return data;
    },
    getFormInfo(val) {//获取表单信息
      this.form = Object.assign({}, defaultForm)
      // console.log("getForm info", val)
      if (this._currentTable) {
        this._currentTable = {}
        this.viewData = []
        this.groupList = [{ display: true, linkId: '1', arrow: true, collapse: true, label: '', page: false }]
        this.tableCols = {}
      }
      if (!val) {
        this.getServerFormId()
        this.onSearchTable('0')
      } else {
        // this.loading = true
        this.form.id = val
        this.$axios.get("/api/rabbit-resource/formcustom/form/" + val)
          .then(res => {
            if (res.data.data) {
              let data = res.data.data
              this.parseAvueData(data)
            } else {
              this.loading = false
              this.$alert('数据已删除', '数据异常', {
                callback: () => {
                  this.$emit('change', 'remove', val)
                }
              })
            }
          }).catch(() => {
            this.loading = false
          })
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.hasOperation = false
          this.firstLoading = true
          if (!this.formId && this.lastId === '') {//连续点击新建
            return
          }
          // console.log("watch formid", val)
          let formId = this.formId
          if (this.formData) {
            if (this.formData.pcForm && this.formData.id == formId) {
              this.loading = true
              setTimeout(() => {
                this.parseAvueData(this.formData, true)
              }, 410);
              return
            }
          }
          this.loading = true
          setTimeout(() => {
            this.getFormInfo(formId)
          }, 100);
        } else {
          this.lastId = this.form.id || this.formId || ''
          this.loading = false
        }
      },
      immediate: true
    },
    loading(val) {
      this.$emit("update:submiting", val)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.form-group {
  padding: 0 12px 12px;
}

.form-group:not(:first-child) {
  border-top: 12px solid #f2f2f2;
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

.wrap-row .el-select {
  width: 25%;
}

.wrap-row:not(:first-child) {
  margin-top: 10px;
}

.wrap-row label {
  display: inline-block;
  width: 80px;
}

.group-label {
  border-bottom: 1px #cbd5f0 solid;
  padding: 12px;
  display: block;
  font-weight: bold;
  margin-bottom: 16px;
}

.group-label > span:not(:first-child) {
  color: #4d8ac8;
  font-weight: normal;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  float: right;
  margin-top: 2px;
}

.group-label span:last-child::after {
  clear: both;
}

.label-margin-left {
  margin-left: 10px;
}
.remark {
  color: #bcbcbc;
  font-size: 14px;
}
</style>