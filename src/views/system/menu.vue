<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      :before-open="beforeOpen"
      :before-close="beforeClose"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @tree-load="treeLoad"
    >
      <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="permission.menu_delete"
          @click="handleDelete"
        >删 除</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="handleAdd(scope.row, scope.index)"
          v-if="userInfo.role_name.includes('admin')"
        >子项</el-button>
      </template>
      <template slot-scope="{ row }" slot="source">
        <div style="text-align: center">
          <i :class="row.source" />
        </div>
      </template>
      <template slot-scope="scope" slot="paramsForm">
        <el-select
          v-model="scope.row.params"
          filterable
          remote
          placeholder="请输入表单名称/编号"
          :remote-method="querFormList"
          :loading="formLoading"
        >
          <el-option
            v-for="item in formList"
            :key="item.id"
            :label="item.formName"
            :value="item.id"
          >
            <span style="float: left">{{ item.formName }}</span>
            <span
              style="float: right; color: #7692ba; font-size: 12px"
            >{{ item.remark || item.code }}</span>
          </el-option>
        </el-select>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getLazyList, remove, update, add, getMenu, searchFormList, getFormListByIds, getMaxSort } from "@/api/system/menu";
import { mapGetters } from "vuex";
import iconList from "@/config/iconList";
// import func from "@/util/func";
import { getMenuTree } from "@/api/system/menu";

export default {
  data() {
    return {
      form: {},
      query: {},
      formList: [],
      formLoading: false,
      loading: true,
      selectionList: [],
      parentId: 0,
      parentCategory: 0,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // 表格列居中
        align: "center",
        // 表格按钮居中
        menuAlign: "center",
        lazy: true,
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        menuWidth: 260,
        dialogClickModal: false,
        column: [
          {
            label: "菜单名称",
            prop: "name",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入菜单名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "路由地址",
            prop: "path",
            rules: [
              {
                required: true,
                message: "请输入路由地址",
                trigger: "blur",
              },
            ],
          },
          {
            label: "目标表单",
            prop: "params",
            hide: true,
            display: false,
            formslot: true,
            type: 'select',
            rules: [
              {
                required: true,
                message: "请选择目标表单",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上级菜单",
            prop: "parentId",
            type: "tree",
            dicData: [],
            hide: true,
            props: {
              label: "name",
              value: 'id'
            },
            rules: [
              {
                required: false,
                message: "请选择上级菜单",
                trigger: "click",
              },
            ],
          },
          {
            label: "菜单图标",
            prop: "source",
            type: "icon",
            slot: true,
            iconList: iconList,
            rules: [
              {
                required: true,
                message: "请输入菜单图标",
                trigger: "click",
              },
            ],
          },
          {
            label: "菜单编号",
            prop: "code",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入菜单编号",
                trigger: "blur",
              },
            ],
          },
          {
            label: "菜单类型",
            prop: "category",
            type: "radio",
            dicData: [
              {
                label: "菜单",
                value: 1,
              },
              {
                label: "按钮",
                value: 2,
              },
              {
                label: "表单",
                value: 3,
              },
            ],
            hide: true,
            rules: [
              {
                required: true,
                message: "请选择菜单类型",
                trigger: "blur",
              },
            ],
          },
          {
            label: "菜单别名",
            prop: "alias",
            search: true,
            rules: [
              {
                required: true,
                message: "请输入菜单别名",
                trigger: "blur",
              },
            ],
          },
          {
            label: "菜单排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入菜单排序",
                trigger: "blur",
              },
            ],
          },
          {
            label: "英文名称",
            prop: "menuName",
            cell: true,
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入英文名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "菜单备注",
            prop: "remark",
            type: "textarea",
            span: 24,
            minRows: 2,
            hide: true,
          },
        ],
      },
      data: [],
    };
  },
  created() {
    this.languageText();
  },
  watch: {
    "form.category"(val) {
      let column = this.findObject(this.option.column, 'path')
      if (column) {
        column.rules[0].required = val != 2;
        column.display = val != 3
      }
      let column2 = this.findObject(this.option.column, 'params')
      column2.display = val == 3
      let column3 = this.findObject(this.option.column, 'source')
      column3.rules[0].required = val != 2;
    },
    language() {
      this.languageText();
    },
  },
  computed: {
    ...mapGetters(["userInfo", "permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.menu_add, false),
        viewBtn: this.vaildData(this.permission.menu_view, false),
        delBtn: this.vaildData(this.permission.menu_delete, false),
        editBtn: this.vaildData(this.permission.menu_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },

  methods: {
    // 国际化语言
    languageText() {
      if (this.language == "zh-cn") {
        this.option.column[9].label = "英文名称";
      } else {
        this.option.column[9].label = "中文名称";
      }
    },
    // 上级菜单
    initParentData() {
      getMenuTree().then((res) => {
        const column = this.findObject(this.option.column, "parentId");
        column.dicData = res.data.data;
      });
    },
    // 新增子项
    handleAdd(row) {
      if (this.addTimer) {
        clearTimeout(this.addTimer)
        this.addTimer = null
        this.onAddButtons(row)
        return
      }
      this.parentId = row.id
      this.parentCategory = row.category
      this.addTimer = setTimeout(() => {
        this.addTimer = null
        this.$refs.crud.value.parentId = row.id;
        if (row.category == 3) {
          this.form.action = 10
          this.$set(this.form, 'path', row.path.split("/").pop())
          this.$set(this.form, 'alias', 'add')
          this.$set(this.form, 'name', '新增')
          this.$set(this.form, 'code', row.code + '_add')
        } else {
          this.form.action = 0
        }
        this.$refs.crud.option.column.filter((item) => {
          if (row.category == 3 && item.prop === 'path') {
            item.addDisabled = true
          } else if (item.prop === "parentId") {
            item.value = row.id;
            item.addDisabled = true;
          }
        });
        this.$refs.crud.rowAdd();
      }, 300)
    },
    // 保存
    rowSave(row, done, loading) {
      this.updateMenuTlList(row)
      add(row).then(
        (res) => {
          // 获取新增数据的相关字段
          const data = res.data.data;
          row.id = data.id;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.updated = true
          // 数据回调进行刷新
          done(row);
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    updateMenuTlList(row) {
      if (row.action == 10 && row.category != 2) {
        row.action = 0
      }
      if (Array.isArray(row.parentId)) {
        row.parentId = row.parentId.length ? row.parentId[0] : 0
      } else if (!row.parentId) {
        row.parentId = 0
      }
      let menuTlList = row.menuTlList;
      if (row.category == 3 && row.params) {
        row.path = '/list/' + row.params
      }
      let zhCn = this.language == "zh-cn"
      if (menuTlList && menuTlList.length) {
        let count = 0
        for (let i = 0; i < menuTlList.length; i++) {
          let menu = menuTlList[i]
          if (menu.language == 'zh-cn') {
            menu.menuName = zhCn ? row.name : row.menuName
            count += 1
          } else if (menu.language == 'en') {
            menu.menuName = zhCn ? row.menuName : row.name
            count += 2
          }
          if (count === 3) {
            break
          }
        }
        if (count === 0 || count === 1) {
          menuTlList.push({
            language: 'en',
            menuName: zhCn ? row.menuName : row.name
          })
        }
        if (count === 0 || count === 2) {
          menuTlList.push({
            language: 'zh-cn',
            menuName: zhCn ? row.name : row.menuName
          })
        }
      } else {
        row.menuTlList = [{
          language: this.language,
          menuName: row.name
        }, {
          language: zhCn ? 'en' : 'zh-cn',
          menuName: row.menuName
        }]
      }
      row.description = row.remark;
    },
    // 修改保存
    rowUpdate(row, index, done, loading) {
      this.updateMenuTlList(row)
      update(row).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.updated = true
          // 数据回调进行刷新
          done(row);
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.updated = true
          // 数据回调进行刷新
          done(row);
        });
    },
    // 左上角的删除
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          // 刷新表格数据并重载
          this.data = [];
          this.parentId = 0;
          this.$refs.crud.refreshTable();
          this.$refs.crud.toggleSelection();
          // 表格数据重载
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    searchReset() {
      this.query = {};
      this.parentId = 0;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.parentId = "";
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
    beforeOpen(done, type) {
      this.initParentData()
      if (["edit", "view"].includes(type)) {
        // 查询多语言表格数据
        getMenu(this.form.id).then((res) => {
          let detail = res.data.data
          this.form = detail
          this.parseParamByPath(detail)
          let menuTlList = detail.menuTlList
          if (menuTlList && menuTlList.length) {
            let find = this.language == "zh-cn" ? 'en' : 'zh-cn'
            let en = menuTlList.find(it => it.language == find)
            this.form.menuName = en && en.menuName
            let current = menuTlList.find(it => it.language == this.language)
            if (current) {
              this.form.name = current.menuName
            }
          }
        }).catch(() => {
          this.parseParamByPath(this.form)
        })
      }
      if ('add' === type) {
        getMaxSort(this.parentId).then(res => {
          if (res.data.data) {
            this.$set(this.form, 'sort', res.data.data)
          }
        })
      }
      done();
    },
    parseParamByPath(target) {
      if (target.category == 3 && target.path) {
        let index = target.path.lastIndexOf("/")
        if (index > 0) {
          let param = target.path.substr(index + 1)
          this.$set(this.form, 'params', param)
          getFormListByIds(param).then(res => {
            this.formList = res.data.data || []
          })
        }
      }
    },
    onAddButtons(row) {
      if (row.category != 2) {
        console.log("addButtons", this.$refs.crud.$refs.table.store)
        this.$confirm(`确定要为菜单 '${row.name}' 快速创建按钮吗`)
          .then(() => {
            this.loading = true
            this.$axios.post(`/api/rabbit-system/menu/buttons/${row.id}/${row.category == 3 ? 1 : 0}`)
              .then(res => {
                let list = res.data.data || []
                if (list.length) {
                  let children = row.children
                  if (!children) {
                    children = list
                  } else {
                    for (let menu of list) {
                      if (!children.find(it => it.id == menu.id)) {
                        children.push(menu)
                      }
                    }
                  }
                  row.children = children
                  row.hasChildren = true
                  let states = this.$refs.crud.$refs.table.store.states
                  if (states.tableData[row.id]) {
                    states.tableData[row.id].children = children
                    states.lazyTreeNodeMap[row.id] = children
                  }
                }
                this.$message.success('创建成功')
              }).finally(() => {
                this.loading = false
              })
          }).catch(() => {
            //cancel
          })
      }
    },
    // 关闭弹出框
    beforeClose(done) {
      this.$refs.crud.tableForm = {};
      this.$refs.crud.value.parentId = "";
      this.$refs.crud.value.addDisabled = false;
      this.$refs.crud.option.column.filter((item) => {
        if (item.prop === 'path') {
          item.value = ''
          item.addDisabled = false
          item.disabled = false
        } else if (item.prop === "parentId") {
          item.value = "";
          item.addDisabled = false;
        }
      });
      this.$nextTick(() => {
        done();
        if (this.updated) {
          this.refreshChange()
        }
      })
    },
    currentChange(currentPage) {
      this.parentId = 0
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.parentId = 0
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.parentId = 0
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      // 菜单管理页面数据
      getLazyList(this.parentId, Object.assign(params, this.query))
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
          this.selectionClear();
        }).catch(() => {
          this.loading = false
        })
    },
    // 折叠里面的数据
    treeLoad(tree, treeNode, resolve) {
      const parentId = tree.id;
      this.parentId = parentId
      getLazyList(parentId).then((res) => {
        resolve(res.data.data);
      });
    },
    querFormList(query) {
      if (query) {
        this.formLoading = true
        searchFormList(query).then(res => {
          this.formList = res.data.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      }
    }
  },
};
</script>

<style></style>
