<template>
  <el-row class="dict-container" ref="container">
    <el-col :span="24" style="flex: 1">
      <basic-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
          </div>
          <div class="clearfix">
            <avue-crud
              :option="optionParent"
              :table-loading="loading"
              :data="dataParent"
              :page="pageParent"
              ref="crud"
              v-model="formParent"
              :permission="permissionList"
              :before-open="beforeOpen"
              @row-del="rowDel"
              @row-update="rowUpdate"
              @row-save="rowSave"
              @search-change="searchChange"
              @search-reset="searchReset"
              @selection-change="selectionChange"
              @current-change="currentChange"
              @size-change="sizeChange"
              @refresh-change="refreshChange"
              @on-load="onLoadParent"
            >
              <template slot-scope="{type,size,row}" slot="menu">
                <el-button icon="el-icon-view" :size="size" :type="type" @click="handleChildView(row)">查看子项</el-button>
              </template>
              <template #cascadedIdForm="{ row, disabled }">
                <!-- <div>{{scope}}</div> -->
                <el-autocomplete
                  v-model="row.casName"
                  :disabled="disabled"
                  value-key="dictValue"
                  placeholder="请输入关联的字典名"
                  clearable
                  :fetch-suggestions="cascadedQuerySearch"
                  @select="handleSelectCascateDict(row, $event)"
                ></el-autocomplete>
              </template>
              <template slot="menuLeft">
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  v-if="permission.dict_delete"
                  @click="handleDelete"
                >删 除
                </el-button>
              </template>
              <template slot-scope="{ row }" slot="isSealed">
                <el-tag>{{ row.isSealed === 0 ? "否" : "是" }}</el-tag>
              </template>
            </avue-crud>
          </div>
        </el-card>
      </basic-container>
    </el-col>
    <el-col :span="24" style="flex: 1">
      <basic-container>
        <el-card class="box-card">
          <div slot="header" class="clearfix header">
            <span>[{{ dictValue }}] 字典详情</span>
            <div class="back-btn" @click="hanndlebackToList">X</div>
          </div>
          <div class="clearfix">
            <avue-crud
              :option="optionChild"
              :table-loading="loadingChild"
              :data="dataChild"
              ref="crudChild"
              v-model="formChild"
              :permission="permissionList"
              :before-open="beforeOpenChild"
              :before-close="beforeCloseChild"
              @row-del="rowDelChild"
              @row-update="rowUpdateChild"
              @row-save="rowSaveChild"
              @search-change="searchChangeChild"
              @search-reset="searchResetChild"
              @selection-change="selectionChangeChild"
              @current-change="currentChangeChild"
              @size-change="sizeChangeChild"
              @refresh-change="refreshChangeChild"
              @on-load="onLoadChild"
            >
              <template #cascadedIdForm="{ row, disabled }">
                <el-select
                  v-model="row.cascadedId"
                  placeholder
                  :disabled="disabled"
                  filterable
                  clearable
                >
                  <el-option
                    :label="item.dictValue"
                    :value="item.id"
                    v-for="item in cascadedOptions"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </template>
              <template slot="menuLeft">
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  v-if="permission.dict_delete"
                  plain
                  @click="handleDelete"
                >删 除
                </el-button>
              </template>
              <template slot-scope="scope" slot="menu">
                <el-button
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  size="small"
                  @click.stop="handleAdd(scope.row, scope.index)"
                  v-if="userInfo.role_name.includes('admin')"
                >新增子项
                </el-button>
              </template>
              <template slot-scope="{ row }" slot="isSealed">
                <el-tag>{{ row.isSealed === 0 ? "否" : "是" }}</el-tag>
              </template>
            </avue-crud>
          </div>
        </el-card>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import {
  getParentList,
  getChildList,
  remove,
  update,
  add,
  getDict,
  getDictTree, getMaxSort,
} from "@/api/system/dict";
import {optionParent, optionChild} from "@/const/system/dict";
import {validatenull} from "@/util/validate";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      dictValue: "暂无",
      parentId: -1,
      formParent: {},
      formChild: {},
      selectionList: [],
      query: {},
      loading: true,
      loadingChild: false,
      pageParent: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      pageChild: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      // 关联字典的子项
      cascadedOptions: [],
      cascadedProps: {
        value: "id",
        label: "dictValue",
      },

      cascadedId: -1,
      dataParent: [],
      dataChild: [],
      optionParent: optionParent,
      optionChild: optionChild,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.dict_add, false),
        delBtn: this.vaildData(this.permission.dict_delete, false),
        editBtn: this.vaildData(this.permission.dict_edit, false),
        viewBtn: false,
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
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      getDictTree().then((res) => {
        const column = this.findObject(this.optionChild.column, "parentId");
        column.dicData = res.data.data;
      });
    },
    handleAdd(row) {
      this.$refs.crudChild.value.parentId = row.id;
      this.$refs.crudChild.option.column.filter((item) => {
        if (item.prop === "parentId") {
          item.value = row.id;
        }
      });
      this.$refs.crudChild.rowAdd();
    },
    rowSave(row, done, loading) {
      const params = Object.assign(
        {
          dictKey: -1,
        },
        row
      );
      if (!params.casName) {
        params.cascadedId = undefined
      }
      delete params.casName;
      delete params.$casName;

      add(params).then(
        () => {
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      const params = Object.assign({}, row);
      if (!params.casName) {
        params.cascadedId = undefined
      }
      delete params.casName;
      delete params.$casName;

      update(params).then(
        () => {
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    // 选择关联字典
    handleSelectCascateDict(row, item) {
      if (row.id === item.id) {
        this.$message.warning("不能关联自身");
        row.casName = row.$casName;
        return;
      }
      row.$casName = item.casName;
      row.cascadedId = item.id;
    },
    // 选择关联字段
    handleSelectCascateValue(row, item) {
      row.$casName = item.casName;
      row.cascadedId = item.id;
    },
    handleChildView(row) {
      this.$refs.container.$el.style.left = "-100%";

      this.query = {};
      this.parentId = row.id;
      this.dictValue = row.dictValue;
      this.$refs.crudChild.value.code = row.code;
      this.$refs.crudChild.value.parentId = row.id;
      this.$refs.crudChild.option.column.filter((item) => {
        if (item.prop === "code") {
          item.value = row.code;
        }
        if (item.prop === "parentId") {
          item.value = row.id;
        }
      });

      this.cascadedId = validatenull(row.cascadedId) ? -1 : row.cascadedId;

      this.onLoadChild(this.pageChild);
    },
    searchReset() {
      this.query = {};
      this.pageParent.currentPage = 1
      this.onLoadParent(this.pageParent);
    },
    searchChange(params, done) {
      this.query = params;
      this.pageParent.currentPage = 1;
      this.onLoadParent(this.pageParent, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud && this.$refs.crud.toggleSelection();
    },
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
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDict(this.formParent.id).then((res) => {
          this.formParent = res.data.data;
        });
      }

      if (["add"].includes(type)) {
        getMaxSort(0).then((res) => {
          let max = "0";
          if (res.data.code === 200) {
            max = res.data.data;
          }
          this.$set(this.formParent, 'sort', max)
        })
      }

      done();
    },
    currentChange(currentPage) {
      this.pageParent.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.pageParent.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoadParent(this.pageParent, this.query);
    },
    rowSaveChild(row, done, loading) {
      add(row).then(
        () => {
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdateChild(row, index, done, loading) {
      const params = Object.assign({}, row);
      delete params.casName;
      delete params.$casName;
      update(params).then(
        () => {
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDelChild(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    searchResetChild() {
      this.query = {};
      this.pageChild.currentPage = 1;
      this.onLoadChild(this.pageChild);
    },
    searchChangeChild(params, done) {
      this.query = params;
      this.pageChild.currentPage = 1;
      this.onLoadChild(this.pageChild, params);
      done();
    },
    selectionChangeChild(list) {
      this.selectionList = list;
    },
    selectionClearChild() {
      this.selectionList = [];
      this.$refs.crudChild && this.$refs.crudChild.toggleSelection();
    },
    handleDeleteChild() {
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
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crudChild.toggleSelection();
        });
    },
    beforeOpenChild(done, type) {
      if (["add", "edit"].includes(type)) {
        this.initData();
      }
      if (["edit", "view"].includes(type)) {
        getDict(this.formChild.id).then((res) => {
          this.formChild = res.data.data;
        });
      }

      if (["add"].includes(type)) {
        getMaxSort(this.parentId).then((res) => {
          let max = "0";
          if (res.data.code === 200) {
            max = res.data.data;
          }
          this.$set(this.formChild, 'sort', max)
        })
      }

      done();
    },
    beforeCloseChild(done) {
      this.$refs.crudChild.value.parentId = this.parentId;
      this.$refs.crudChild.option.column.filter((item) => {
        if (item.prop === "parentId") {
          item.value = this.parentId;
        }
      });
      done();
    },
    currentChangeChild(currentPage) {
      this.pageChild.currentPage = currentPage;
    },
    sizeChangeChild(pageSize) {
      this.pageChild.pageSize = pageSize;
    },
    refreshChangeChild() {
      this.onLoadChild(this.pageChild, this.query);
    },
    onLoadParent(page, params = {}) {
      this.loading = true;
      getParentList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        const data = res.data.data;
        this.pageParent.total = data.total;
        this.dataParent = data.records.map((item) => {
          return {
            ...item,
            $casName: item.casName,
          };
        });
        this.loading = false;
        this.selectionClear();
      });
    },
    onLoadChild(page, params = {}) {
      if (this.parentId == -1) {
        return;
      }
      this.loadingChild = true;

      // 获取当前选中的字典子项
      getChildList(
        page.currentPage,
        page.pageSize,
        this.parentId,
        Object.assign(params, this.query)
      ).then((res) => {
        this.dataChild = res.data.data.map((item) => {
          return {
            ...item,
            $casName: item.casName,
          };
        });
        this.loadingChild = false;
        this.selectionClear();
        this.$nextTick(() => {
          document.getElementById('avue-view').scrollTop = 0
        })
      });
      // 获取与当前选中的字典相关联的字典子项
      if (this.cascadedId != -1) {
        this.$set(this.optionChild.column, 7, {
          label: "关联值",
          prop: "cascadedId",
          formslot: true,
          hide: true,
        });
        this.$set(this.optionChild.column, 8, {
          label: "关联值",
          prop: "casName",
          editDisplay: false,
          viewDisplay: false,
          addDisplay: false,
        });
        getChildList(1, 100, this.cascadedId, {
          dictValue: "",
        }).then((res) => {
          this.cascadedOptions = res.data.data;
        });
      } else {
        this.$delete(this.optionChild.column, 7);
        this.$delete(this.optionChild.column, 8);
      }
    },
    // 关联字典的输入搜索
    cascadedQuerySearch(queryString, cb) {
      getParentList(0, 100, {
        dictValue: queryString,
      }).then((res) => {
        cb(res.data.data.records);
      });
    },
    // 子关联字典的输入搜索
    // ChildCascadedQuerySearch(queryString) {
    //   return new Promise((resolve, reject) => {
    //     getChildList(1, 100, this.cascadedId, {
    //       dictValue: queryString,
    //     }).then((res) => {
    //       this.cascadedOptions = res.data.data;
    //       resolve();
    //     });
    //   });
    // },
    hanndlebackToList() {
      this.$refs.container.$el.style.left = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.dict-container {
  width: 200%;
  transition: left 0.5s;
  position: relative;
  display: flex;
  left: 0;
}

.header {
  display: flex;

  .back-btn {
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
