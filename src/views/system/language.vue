<template>
  <basic-container>
    <el-form :model="formIanguage" label-width="80px">
      <el-form-item label="请选择" prop="formIanguageData">
        <el-select v-model="formIanguage.formIanguageData" placeholder="请选择活动区域">
          <el-option
            v-for="(item, index) in listIanguage"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <avue-crud
      ref="crud"
      :option="option1"
      :data="data"
      v-show="menuForm"
      @expand-change="expandChange"
      @row-update="menuUpdate"
      @row-save="menuSave"
      @row-del="menuDel"
      @tree-load="treeLoad"
      :table-loading="loading"
      :before-open="beforeOpen"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="handleAdd(scope.row, scope.index)"
          v-if="userInfo.role_name.includes('admin')"
        >新增子项</el-button>
      </template>
    </avue-crud>
    <basic-container v-show="dictionariesForm">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>[{{ dictValue }}] 字典详情</span>
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
            <template slot="menuLeft">
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                v-if="permission.dict_delete"
                plain
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
              >新增子项</el-button>
            </template>
            <template slot-scope="{ row }" slot="isSealed">
              <el-tag>{{ row.isSealed === 0 ? "否" : "是" }}</el-tag>
            </template>
          </avue-crud>
        </div>
      </el-card>
    </basic-container>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { optionParent, optionChild } from "@/const/system/dict";
export default {
  data() {
    return {
      // 表格等待框的控制
      loading: false,
      option1: {
        // 行展开
        expand: true,
        // 展开行的主键
        rowKey: "$index",
        //配合expand-change使用
        expandRowKeys: [],
        column: [
          {
            label: "多语言",
            prop: "language",
            align: "center",
            type: "select",
            dicUrl: "/api/rabbit-system/dict/select-language",
            props: {
              label: "remark",
              value: "dictValue",
            },
            cell: true,
          },
          {
            label: "字段名称",
            prop: "menuName",
            cell: true,
          },
        ],
      },
      data: [
        {
          language: "中文",
          menuName: "上下文五百年",
        },
        {
          language: "英语",
          menuName: "hello",
        },
      ],
      formIanguage: {
        formIanguageData: "",
      },
      listIanguage: [
        {
          label: "菜单",
          value: 1,
        },
        {
          label: "多语言",
          value: 2,
        },
        {
          label: "字典",
          value: 3,
        },
      ],
      dictValue: "暂无",
      optionParent: optionParent,
      optionChild: optionChild,
      menuForm: false,
      dictionariesForm: false,
    };
  },
  created() {
    this.formIanguageWay();
  },
  watch: {
    "form.category"() {
      const category = this.form.category
      this.$refs.crud.option.column.filter((item) => {
        if (item.prop === "path") {
          item.rules[0].required = category == 1
        }
      });
    },
    language() {
      this.languageText();
    },
    "formIanguage.formIanguageData"() {
      this.formIanguageWay();
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
  },

  methods: {
    // 手风琴模式
    expandChange(row, expendList) {
      if (expendList.length) {
        this.option1.expandRowKeys = [];
        if (row) {
          this.option1.expandRowKeys.push(row.$index);
        }
      } else {
        this.option1.expandRowKeys = [];
      }
    },
    // 判断显示的表格
    formIanguageWay() {
      if (
        this.formIanguage.formIanguageData == 1 ||
        this.formIanguage.formIanguageData == ""
      ) {
        this.dictionariesForm = false;
        this.menuForm = true;
      } else if (this.formIanguage.formIanguageData == 2) {
        this.menuForm = false;
      } else if (this.formIanguage.formIanguageData == 3) {
        this.menuForm = false;
        this.dictionariesForm = true;
      }
    },
    // 菜单保存
    menuSave(row, done, loading) {
      console.log("菜单保存", row, done, loading);
      done(row);
      this.loading = false;
    },
    // 菜单修改
    menuUpdate(row, index, done, loading) {
      console.log("菜单修改保存", row, index);
      done(row);
      this.loading = false;
    },
    // 菜单删除
    menuDel(row, index, done) {
      console.log("菜单删除", row, index);
      done(row);
      this.loading = false;
    },
    // 菜单弹出框
    // beforeOpen(){},
    // 折叠里面的数据
    treeLoad(tree, treeNode, resolve) {
      console.log("tree", tree, treeNode, resolve);
      // getLazyList(parentId).then((res) => {
      //     console.log('biaoge ',res);
      //   resolve(res.data.data);
      // });
    },
  },
};
</script>

<style>
</style>
