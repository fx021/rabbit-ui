<template>
  <div
    class="form"
    v-loading.fullscreen="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中..."
  >
    <div class="form-group">
      <div class="group-label">
        <span>表单按钮</span>
        <span @click="onButtonTable(-1)">新增</span>
      </div>
      <el-table :data="formBtns" border size="mini">
        <el-table-column label="排序" align="center" width="80">
          <template slot-scope="scope">
            <i
              class="el-icon-sort-down sort-menu"
              v-if="scope.$index<formBtns.length-1"
              @click="onFormSort(scope.$index,1)"
            ></i>
            <i
              class="el-icon-sort-up sort-menu"
              v-if="scope.$index>0"
              @click="onFormSort(scope.$index,-1)"
            ></i>
            <i
              class="el-icon-plus sort-menu"
              v-if="scope.$index==formBtns.length-1"
              @click="onButtonTable(-1,1)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="按钮名称" align="center" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text" placeholder="按钮名称" size="mini" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="提交链接" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.url" placeholder="提交链接（POST）" size="mini" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="附带参数" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.body" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="前缀图标" align="center" width="80">
          <template slot-scope="scope">
            <icon-select v-model="scope.row.icon"></icon-select>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="类型" size="mini">
              <el-option label="主题色" value="primary"></el-option>
              <el-option label="白色" value="info"></el-option>
              <el-option label="黄色" value="warning"></el-option>
              <el-option label="红色" value="danger"></el-option>
              <el-option label="绿色" value="success"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="朴素" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.plain" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showCodeClick(scope.$index,0,scope.row.code)"
              size="small"
            >代码增强</el-button>
            <el-button type="text" @click="onButtonTable(scope.$index)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>列表按钮</span>
        <span @click="btnTableClick(-1)">新增</span>
      </div>
      <el-table :data="listBtns" border size="mini">
        <el-table-column label="排序" align="center" width="80">
          <template slot-scope="scope">
            <i
              class="el-icon-sort-down sort-menu"
              v-if="scope.$index<listBtns.length-1"
              @click="onListSort(scope.$index,1)"
            ></i>
            <i
              class="el-icon-sort-up sort-menu"
              v-if="scope.$index>0"
              @click="onListSort(scope.$index,-1)"
            ></i>
            <i
              class="el-icon-plus sort-menu"
              v-if="scope.$index==listBtns.length-1"
              @click="btnTableClick(-1,1)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="按钮名称" align="center" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text" placeholder="按钮名称" size="mini" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="提交链接" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.url" placeholder="提交链接（POST）" size="mini" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="权限编码" align="center" width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.alias" placeholder="权限编码" size="mini" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="附带参数" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.body" size="mini"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="前缀图标" align="center" width="80">
          <template slot-scope="scope">
            <icon-select v-model="scope.row.icon"></icon-select>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="类型"
              size="mini"
              :disabled="scope.row.mode=='menu'"
            >
              <el-option label="文字" value="text"></el-option>
              <el-option label="主题色" value="primary"></el-option>
              <el-option label="白色" value="info"></el-option>
              <el-option label="黄色" value="warning"></el-option>
              <el-option label="红色" value="danger"></el-option>
              <el-option label="绿色" value="success"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="放置区域" align="center" width="120">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.mode"
              placeholder="区域"
              size="mini"
              @change="val=>onBtnModeChange(scope.row,val)"
            >
              <el-option label="左上角" value="left"></el-option>
              <el-option label="操作栏" value="menu"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="朴素" align="center" width="60">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.plain" size="mini" :disabled="scope.row.mode=='menu'"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showCodeClick(scope.$index+30,-1,scope.row.code)"
              size="small"
            >代码增强</el-button>
            <el-button type="text" @click="btnTableClick(scope.$index)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="form-group">
      <div class="group-label">
        <span>拦截增强</span>
      </div>
      <div class="btns">
        <span class="btns-label">主表相关拦截点</span>
        <el-button @click="showCodeClick(-1,1)" :icon="codeData['6']?'el-icon-mouse':''">保存前拦截</el-button>
        <el-button @click="showCodeClick(-2,2)" :icon="codeData['7']?'el-icon-mouse':''">保存后拦截</el-button>
        <el-button @click="showCodeClick(-3,3)" :icon="codeData['8']?'el-icon-mouse':''">列表前拦截</el-button>
        <el-button @click="showCodeClick(-4,4)" :icon="codeData['9']?'el-icon-mouse':''">列表后拦截</el-button>
        <el-button @click="showCodeClick(-5,5)" :icon="codeData['10']?'el-icon-mouse':''">删除前拦截</el-button>
        <el-button @click="showCodeClick(-6,6)" :icon="codeData['11']?'el-icon-mouse':''">删除后拦截</el-button>
        <el-button @click="showCodeClick(-7,7)" :icon="codeData['12']?'el-icon-mouse':''">表单默认值</el-button>
      </div>
      <div class="btns" v-for="item in groupList" :key="item.id">
        <span class="btns-label">{{item.label}}</span>
        <el-button
          @click="showCodeClick(`${item.id}_1`,7)"
          :icon="codeData[`${item.id}_1`]?'el-icon-mouse':''"
        >子行默认值</el-button>
        <el-button
          @click="showCodeClick(`${item.id}_2`,8)"
          :icon="codeData[`${item.id}_2`]?'el-icon-mouse':''"
        >子行数据验证</el-button>
        <el-button
          @click="showCodeClick(`${item.id}_3`,9)"
          :icon="codeData[`${item.id}_3`]?'el-icon-mouse':''"
        >子行删除前</el-button>
        <el-button
          @click="showCodeClick(`${item.id}_4`,10)"
          :icon="codeData[`${item.id}_4`]?'el-icon-mouse':''"
        >子行删除后</el-button>
      </div>
    </div>
    <el-drawer :visible.sync="showCode" size="50%" :title="codeTitle" :value="1" append-to-body>
      <div>
        <textarea ref="editor"></textarea>
      </div>
      <div style="text-align:end;margin-top:24px;margin-right:16px">
        <el-button type="warning" size="small" @click="onCodeClear" plain>清空</el-button>
        <el-button type="primary" size="small" @click="onCodeConfirm">确定</el-button>
        <el-button size="small" @click="showCode=false">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import IconSelect from './IconSelect'
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import "codemirror/theme/hopscotch.css"
import "codemirror/mode/groovy/groovy.js"
export default {//表单增强,详见getTitlePrefix
  name: 'FormEnhance',
  components: { IconSelect },
  props: {
    formId: String,
    loading: Boolean,
    tableName: String,
  },
  computed: {
    caseName() {//tableName驼峰
      if (this.tableName) {
        let names = this.tableName.toLowerCase().split('_')
        return names.map(it => it.substr(0, 1).toUpperCase() + it.substr(1)).join('')
      }
      return 'Test'
    },
    codeTitle() {//代码标题
      let prefix = this.getTitlePrefix()
      return `${prefix} 执行代码`
    }
  },
  data: () => {
    return {
      showCode: false,
      updateIndex: -1,
      formBtns: [],
      listBtns: [],
      codeData: {},
      formLoading: false,
      hasData: false,
      editorView: '',
      groupList: []
    }
  },
  beforeDestroy() {
    if (this.editorView) {
      try {
        this.editorView.toTextArea()
      } catch (error) {
        console.log("destroy editorView error", error)
      }
      this.editorView = ''
    }
  },
  created() {
    this.formLoading = true
    Promise.all(this.getCodeData(), this.getGroupList())
      .then(() => {
        this.formLoading = false
      }).catch(() => {
        this.formLoading = false
      })
  },
  methods: {
    getCodeData() {//获取表单增强数据
      return new Promise((resolve, reject) => {
        this.$axios.get('/api/rabbit-resource/formcustom/form-enhance', {
          params: {
            formId: this.formId,
            type: 102
          }
        }).then(res => {
          let data = res.data.data || []
          this.parseCodeData(data)
          this.hasData = data.length > 0
          resolve()
        }).catch(err => reject(err))
      })
    },
    parseCodeData(data, decode) {//解析服务器数据
      let codeData = {}
      let forms = []
      let list = []
      for (let item of data) {
        if (item.type == 0) {
          forms = JSON.parse(item.content)
        } else if (item.type == 1) {
          list = JSON.parse(item.content)
        } else {
          codeData[item.type] = decode ? decodeURIComponent(item.content) : item.content
        }
      }
      for (let i = 0; i < forms.length; i++) {//表单按钮groovy,需要移动,赋值到对象去吧
        let key = i + 30 + ''
        forms[i].code = codeData[key]
        codeData[key] = undefined
      }
      for (let i = 0; i < list.length; i++) {//列表按钮groovy
        let key = i + 60 + ''
        list[i].code = codeData[key]
        codeData[key] = undefined
      }
      this.formBtns = forms
      this.listBtns = list
      this.codeData = codeData
    },
    getGroupList() {//获取表单卡片信息
      return new Promise((resolve, reject) => {
        this.$axios.get(`/api/rabbit-resource/formcustom/form-list/${this.formId}?flag=3`)
          .then(res => {
            let data = res.data.data
            let form = data ? JSON.parse(data.pcForm) : {}
            let groups = form.group || []
            let groupList = []
            for (let group of groups) {
              if (group.listable) {
                groupList.push({ id: group.linkId, label: group.label })
              }
            }
            this.groupList = groupList
            resolve()
          }).catch(err => reject(err))
      })
    },
    onFormSort(index, direct) {//表单按钮排序
      let newIndex = index + direct;
      if (newIndex < 0 || newIndex > this.formBtns.length) {
        return;
      }
      let item = this.formBtns[index];
      let dirItem = this.formBtns[newIndex];
      if (newIndex > index) {
        this.formBtns.splice(index, 2, dirItem, item);
      } else {
        this.formBtns.splice(newIndex, 2, item, dirItem);
      }
    },
    onListSort(index, direct) {//列表按钮排序
      let newIndex = index + direct;
      if (newIndex < 0 || newIndex > this.listBtns.length) {
        return;
      }
      let item = this.listBtns[index];
      let dirItem = this.sumColumnList[newIndex];
      if (item.mode != dirItem.mode) {
        this.$message.warning('不同位置的按钮不能互相移动')
        return
      }
      if (newIndex > index) {
        this.listBtns.splice(index, 2, dirItem, item);
      } else {
        this.listBtns.splice(newIndex, 2, item, dirItem);
      }
    },
    btnTableClick(index) {//新增/删除列表按钮
      if (index == -1) {
        if (this.checkListBtn()) {
          if (this.listBtns.length == 10) {
            this.$message.warning('超出限制个数')
            return
          }
          let btn = { mode: 'left', type: 'text', plain: true }
          this.listBtns.push(btn)
        }
      } else {
        this.$confirm('确定要删除吗?', '删除确认')
          .then(() => {
            this.listBtns.splice(index, 1)
          }).catch(() => {
            //cancel
          })
      }
    },
    checkListBtn() {//列表按钮检查
      if (this.listBtns.length > 0) {
        for (let i = 0; i < this.listBtns.length; i++) {
          let last = this.listBtns[i]
          if (!last.text) {
            this.$message.warning('请输入列表按钮名称')
            return false
          }
          if (last.alias && ['add', 'edit', 'print', 'import', 'excel', 'edit', 'delete', 'search',
            'date', 'view', 'export', 'copy'].includes(last.alias)) {
            this.$message.warning('输入的权限编码是系统编码')
            return false
          }
          if (!last.url && !last.code) {
            this.$message.warning('列表提交链接和代码增强需要设置一个')
            return false
          }
          let index = this.listBtns.findIndex(it => it !== last && it.text === last.text && it.mode === last.mode)
          if (index >= 0 && i != index) {
            this.$message.warning(`第${i + 1}个列表按钮名称与第${index + 1}个重复`)
            return false
          }
        }
      }
      return true
    },
    onBtnModeChange(row, val) {//列表按钮位置变更
      if (val == 'menu') {
        row.type = 'text'
        row.plain = false
      }
      this.listBtns.sort((a, b) => {
        if (a.mode == b.mode) {
          return 0
        }
        return a.mode == 'menu' ? -1 : 1
      })
    },
    onCodeClear() {//清空代码
      if (isNaN(this.updateIndex)) {
        this.codeData[this.updateIndex] = undefined
      } else if (this.updateIndex >= 30) {
        let btn = this.listBtns[this.updateIndex - 30]
        btn.code = undefined
      } else if (this.updateIndex >= 0) {
        let btn = this.formBtns[this.updateIndex]
        btn.code = undefined
      } else {
        this.codeData[this.getCodeKey()] = undefined
      }
      if (this.editorView) {
        this.editorView.setValue('')
      }
      this.showCode = false
    },
    getTitlePrefix(flag) {//代码分类标题前缀
      flag = flag || this.updateIndex
      if (isNaN(flag)) {
        if (flag.endsWith('_1')) {
          return '子行默认值'
        }
        if (flag.endsWith('_2')) {
          return '验证子行数据'
        }
        if (flag.endsWith('_3')) {
          return '子行删除前'
        }
        if (flag.endsWith('_4')) {
          return '子行删除后'
        }
      } else if (flag == -1) {
        return '提交前'
      } else if (flag == -2) {
        return '提交后'
      } else if (flag == -3) {
        return '列表前'
      } else if (flag == -4) {
        return '列表后'
      } else if (flag == -5) {
        return '删除前'
      } else if (flag == -6) {
        return '删除后'
      } else if (flag == -7) {
        return '表单默认值'
      } else if (flag >= 30) {
        return '列表按钮' + (flag - 29)
      }
      return '表单按钮' + (flag + 1)
    },
    getDocPattern(flag) {//代码pattern
      flag = flag || this.updateIndex
      if (isNaN(flag)) {
        if (flag.endsWith('_2')) {
          return /\s+String\s+lineDataValid\s*\(.+/
        }
        if (flag.endsWith('_3')) {
          return /\s+String\s+lineRemoveBefore\s*\(.+/
        }
        if (flag.endsWith('_4')) {
          return /\s+String\s+lineRemoveAfter\s*\(.+/
        }
        return /\s+String\s+formValid\s*\(.+/
      } else if (flag == -1) {
        return /\s+boolean\s+onBeforeSave\s*\(.+/
      } else if (flag == -2) {
        return /\s+boolean\s+onAfterSave\s*\(.+/
      } else if (flag == -3) {
        return /\s+boolean\s+onBeforeList\s*\(.+/
      } else if (flag == -4) {
        return /\s+boolean\s+onAfterList\s*\(.+/
      } else if (flag == -5) {
        return /\s+boolean\s+onBeforeRemove\s*\(.+/
      } else if (flag == -6) {
        return /\s+boolean\s+onAfterRemove\s*\(.+/
      } else if (flag == -7) {
        return /\s+Map<String, Object>\s+formValue\s*\(.+/
      }
      return /\s+Object\s+execute\s*\(.+/
    },
    onCodeConfirm() {//代码赋值
      if (!this.editorView) {
        this.$message.warning('编辑器初始化失败，请重新刷新页面')
        return
      }
      let doc = this.editorView.getValue("\n")
      if (!doc || /^\s+$/.test(doc)) {
        doc = undefined
      } else {
        let pattern = this.getDocPattern()
        if (!pattern.test(doc)) {
          for (let i = 1; i < 8; i++) {
            let pat = this.getDocPattern(-i)
            if (pat.test(doc)) {
              this.$confirm('代码与模板不一致，需要设置为' + (this.getTitlePrefix(-i)) + '拦截吗?')
                .then(() => {
                  this.codeData[this.getCodeKey(-i)] = doc
                  this.showCode = false
                }).catch(() => {
                  //cancel
                  this.showCode = false
                })
              return
            }
          }
          this.$message.warning('代码与模板不一致')
          // console.log("pattern", pattern, doc)
          return
        }
      }
      if (isNaN(this.updateIndex)) {
        this.codeData[this.updateIndex] = doc
      } else if (this.updateIndex >= 30) {
        let btn = this.listBtns[this.updateIndex - 30]
        btn.code = doc
      } else if (this.updateIndex >= 0) {
        let btn = this.formBtns[this.updateIndex]
        btn.code = doc
      } else {
        this.codeData[this.getCodeKey()] = doc
      }
      this.showCode = false
    },
    getCodeKey(index) {//非按钮的type格式化
      return 5 - (index === undefined ? this.updateIndex : index) + ''
    },
    showCodeClick(index, key, doc) {
      this.showCode = true
      this.updateIndex = index
      if (isNaN(index)) {
        doc = this.codeData[index]
      } else if (index < 0) {
        doc = this.codeData[this.getCodeKey()]
      }
      if (!doc) {
        doc = this.getScriptTemplate(key)
      }
      const setValue = () => {
        setTimeout(() => {
          this.editorView.setValue(doc || '')
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
            mode: "text/x-groovy",
            theme: 'hopscotch',
            autofocus: true,
          })
          setValue()
        })
      } else {
        setValue()
      }
    },
    checkFormBtn() {
      if (this.formBtns.length) {
        let last = this.formBtns[this.formBtns.length - 1]
        if (!last.text) {
          this.$message.warning('请输入表单按钮名称')
          return false
        }
        if (!last.url && !last.code) {
          this.$message.warning('表单提交链接和代码需要设置一个')
          return false
        }
        let index = this.formBtns.findIndex(it => it.text == last.text)
        if (index != this.formBtns.length - 1) {
          this.$message.warning(`第${this.formBtns.length}个表单按钮名称与第${index + 1}个重复`)
          return false
        }
      }
      return true
    },
    onButtonTable(index) {
      if (index == -1) {
        if (!this.checkFormBtn()) {
          return
        }
        if (this.formBtns.length == 10) {
          this.$message.warning('超出限制个数')
          return
        }
        this.formBtns.push({ type: 'warning', plain: true, param: true })
      } else {
        this.$confirm('确定要删除吗?', '删除确认')
          .then(() => {
            this.formBtns.splice(index, 1)
          }).catch(() => {
            //cancel
          })
      }
    },
    onSubmitClick() {
      if (!this.checkListBtn() || !this.checkFormBtn()) {
        return
      }
      this.formLoading = true
      let obj = []
      let formBtns = []
      for (let i = 0; i < this.formBtns.length; i++) {
        let btn = Object.assign({}, this.formBtns[i])
        if (btn.code) {
          let item = { content: encodeURIComponent(this.formBtns[i].code), type: i + 30 + '' }
          obj.push(item)
        }
        btn.code = undefined
        formBtns.push(btn)
      }
      let listBtns = []
      for (let i = 0; i < this.listBtns.length; i++) {
        let btn = Object.assign({}, this.listBtns[i])
        if (btn.code) {
          let item = { content: encodeURIComponent(this.listBtns[i].code), type: i + 60 + '' }
          obj.push(item)
        }
        btn.code = undefined
        listBtns.push(btn)
      }
      if (formBtns.length) {
        obj.push({ type: 0, content: JSON.stringify(formBtns) })
      }
      if (listBtns.length) {
        obj.push({ type: 1, content: JSON.stringify(listBtns) })
      }
      for (let key in this.codeData) {
        let code = this.codeData[key]
        if (code) {
          obj.push({ type: key, content: encodeURIComponent(code) })
        }
      }
      if (!this.hasData && !obj.length) {
        this.$emit('submit')
        this.formLoading = false
        return
      }
      this.$axios.post('/api/rabbit-resource/formcustom/form-enhance/' + this.formId, obj)
        .then(res => {
          this.$message.success(res.data.msg)
          this.$emit('submit')
          this.hasData = true
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
    },
    getScriptTemplate(type) {//模板
      if (type == 0 || type == -1) {
        return `package org.springrabbit.resource.service.impl;

import org.springrabbit.resource.entity.RabbitFormForms;
import java.util.Map;

public class ${this.caseName}${type == 0 ? 'Form' : 'List'}Btn implements BtnExecutor{

	@Override
	public Object execute(RabbitFormForms formForms, String btnText, Map<String, Object> param) {

		return null;
	}
}`
      }
      if (type == 1 || type == 2) {
        let method = type == 1 ? 'onBeforeSave' : 'onAfterSave'
        return `package org.springrabbit.resource.service.impl;

import org.springrabbit.resource.entity.RabbitFormForms;
import java.util.Map;

public class ${this.caseName}SaveInterceptor extends FormInterceptor {

	@Override
	public boolean ${method}(RabbitFormForms formForms, Map<String, Object> formData, FormDataServiceImpl dataService) {

		return false;
	}
}`
      }
      if (type == 3) {
        return `package org.springrabbit.resource.service.impl;

import org.springrabbit.resource.entity.RabbitFormForms;
import org.springrabbit.resource.form.SqlListVo;

public class ${this.caseName}ListInterceptor extends FormInterceptor {

	@Override
	public boolean onBeforeList(RabbitFormForms formForms, SqlListVo requestData, FormDataServiceImpl dataService) {

		return false;
	}
}`
      }
      if (type == 4) {
        return `package org.springrabbit.resource.service.impl;

import org.springrabbit.resource.entity.RabbitFormForms;
import org.springrabbit.resource.form.SqlListVo;

import java.util.Map;

public class ${this.caseName}ListInterceptor extends FormInterceptor {

	@Override
	public boolean onAfterList(RabbitFormForms formForms, SqlListVo requestData, Map<String, Object> resultData, FormDataServiceImpl dataService) {

		return false;
	}
}`
      }
      if (type == 5 || type == 6) {
        let method = type == 5 ? 'onBeforeRemove' : 'onAfterRemove'
        let result = type == 5 ? 'boolean' : 'void'
        let ret = type == 5 ? 'return false;' : ''
        return `package org.springrabbit.resource.service.impl;

import org.springrabbit.resource.entity.RabbitFormForms;

public class ${this.caseName}RemoveInterceptor extends FormInterceptor {

	@Override
	public ${result} ${method}(RabbitFormForms formForms, String rowId, FormDataServiceImpl dataService) {

		${ret}
	}
}`
      }
      if (type == 7) {
        return `package org.springrabbit.resource.service.impl;

import java.util.Map;

public class ${this.caseName}ValueInterceptor extends FormInterceptor {

	@Override
	public Map<String, Object> formValue(Long formId, String linkId, FormDataServiceImpl dataService) {

		return null;
	}
}`
      }
      if (type == 8) {
        return `package org.springrabbit.resource.service.impl;

import java.util.Map;

public class ${this.caseName}Validtor extends FormInterceptor {

	@Override
	public String lineDataValid(Long formId, String linkId, Map<String, Object> parentData, Map<String, Object> rowData, FormDataServiceImpl dataService) {

		return null;
	}
}`
      }
      if (type == 9 || type == 10) {
        let method = type == 9 ? 'lineRemoveBefore' : 'lineRemoveAfter'
        let result = type == 9 ? 'String' : 'void'
        let ret = type == 9 ? 'return null;' : ''
        return `package org.springrabbit.resource.service.impl;

import java.util.Map;

public class ${this.caseName}LineRemover extends FormInterceptor {

	@Override
	public ${result} ${method}(Long formId, String linkId, Map<String, Object> parentData, Map<String, Object> rowData, FormDataServiceImpl dataService) {

		${ret}
	}
}`
      }
    }
  },
  watch: {
    formLoading(val) {
      this.$emit('update:loading', val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-group {
  padding: 0 12px 12px;
}

.form-group:not(:first-child) {
  border-top: 12px solid #f2f2f2;
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
.btns:not(:first-child) {
  margin-top: 24px;
}
.btns-label {
  color: #409eff;
  display: inline-block;
  margin-right: 24px;
  min-width: 133px;
  border: 1px dashed #409eff;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1;
}
</style>
