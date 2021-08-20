<template>
  <basic-container id="i18n">
    <el-form label-width="80px" inline label-position="right" size="small">
      <el-form-item label="配置类型">
        <el-select v-model="formIanguageData" placeholder="请选择配置类型">
          <el-option
            v-for="(item, index) in option1"
            :key="index"
            :label="item.dictValue"
            :value="item.dictKey"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言配置" style="margin-left: 16px">
        <el-select v-model="checkbox2" multiple collapse-tags placeholder="请选择" @change="onChange">
          <el-option
            v-for="item in option2"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
            :disabled="langDisabled(item)"
          >
            <span style="float: left">{{ item.dictValue }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <avue-crud
      :page.sync="page"
      @on-load="onLoadMenu"
      ref="crud"
      :option="option"
      :data="dataMenu"
      @refresh-change="refreshChange"
      :table-loading="tableLoading"
    >
      <template slot-scope="{ row, index }" slot="menu">
        <el-button
          type="text"
          size="small"
          @click="rowCell(row, index)"
        >{{ row.$cellEdit ? "取消" : "修改" }}</el-button>
        <el-button
          type="text"
          size="small"
          @click="rowUpdate(row, index)"
          v-show="row.$cellEdit"
          class="menu-btn"
        >保存</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>
<script>
import {
  selectConfigType,
  selectLanguage,
  selectMenu,
  updateMenu,
} from "@/api/system/internationalization";
// import { getLanguage } from "@/api/system/menu";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // 下拉框数据
      option1: [],
      option2: [],
      // 配置类型的数据
      formIanguageData: "",
      //语言配置
      checkbox2: [],
      tableLoading: true,
      // 分页
      page: {
        // 每页显示条目个数
        pageSize: 10,
        // 当前页数
        currentPage: 1,
        pagerCount: 5,
        // 总条数,如果为0的话不显示分页
        total: 0,
      },
      option: {
        height: 'auto',
        calcHeight: 50,
        index: true,
        // 表格列居中
        align: "center",
        // 表格按钮居中
        menuAlign: "center",
        // 表格树key
        rowKey: "menuId",
        // 新增按钮
        addBtn: false,
        // 删除按钮
        delBtn: false,
        // 关闭表格中的编辑按钮
        editBtn: false,
        // 显示表格边框并可以控制表格边框
        border: true,
        // 斑马线
        stripe: true,
        // 刷新按钮
        // refreshBtn:false,
        // 显隐
        columnBtn: false,
        // 取消按钮
        cancelBtn: false,
        menuWidth: 100,
        column: [
          {
            label: "菜单编号",
            prop: "code",
            minWidth: 120,
            fixed: true,
          },
          {
            label: "路由",
            prop: "path",
            minWidth: 160,
          },
        ],
      },
      // 表格数据
      dataMenu: [],
      // 语言配置勾选的数据
      languageData: [],
      // 取消数据
      oriData: [],
    };
  },
  created() {
    this.formIanguageWay();
    this.checkbox2 = Object.assign({}, this.multilingual);
  },
  computed: {
    ...mapGetters(["language", "multilingual"]),
  },
  methods: {
    langDisabled(item) {
      return item.dictKey === 'zh-cn' || this.language === item.dictKey
    },
    formIanguageWay() {
      // 配置类型
      selectConfigType().then((res) => {
        this.option1 = res.data;
        this.formIanguageData = res.data[0].dictValue;
      });
      // 语言配置
      selectLanguage().then((res) => {
        let data = res.data;
        this.option2 = data;
        let checkbox2Data = [];
        let tableData = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].isSealed === 0) {
            checkbox2Data.push(data[i].dictKey);
            tableData.push(data[i]);
          }
        }
        // 默认勾选的语言
        this.checkbox2 = checkbox2Data;
        // 默认加载的表格数据
        this.languageData = this.checkbox2;
        // 动态加载表格栏位
        tableData.forEach((lang) => {
          this.option.column.push({
            label: lang.dictValue,
            prop: lang.dictKey,
            cell: true,
            minWidth: 250,
          });
        });
        this.onLoadMenu();
      });
    },

    // 语言配置勾选数据
    onChange() {
      if (this.changeTimer) {
        clearTimeout(this.changeTimer);
      }
      this.changeTimer = setTimeout(() => {
        this.languageData = this.checkbox2;
        // 重新渲染表格栏位
        this.option.column = [
          {
            label: "菜单编号",
            prop: "code",
            fixed: true,
            minWidth: 120,
          },
          {
            label: "路由",
            prop: "path",
            minWidth: 160,
          },
        ];
        let data1 = this.option2;
        let data2 = this.checkbox2;
        let data3 = [];
        for (let i = 0; i < data1.length; i++) {
          for (let j = 0; j < data2.length; j++) {
            if (data1[i].dictKey === data2[j]) {
              data3.push(data1[i]);
            }
          }
        }
        // 动态加载表格栏位
        data3.forEach((lang) => {
          this.option.column.push({
            label: lang.dictValue,
            prop: lang.dictKey,
            cell: true,
            minWidth: 250,
          });
        });
        this.onLoadMenu();
        this.$store.commit("SET_MULTILINGUAL", this.checkbox2);
        this.cancel();
      }, 1000);
    },
    // 失去焦点隐藏下拉框
    cancel() {
      // this.$refs.popover2.doClose();
    },
    //刷新
    refreshChange() {
      this.onChange();
    },
    // 表格数据
    onLoadMenu() {
      this.tableLoading = true;
      let size = this.page.pageSize;
      let current = this.page.currentPage;
      let menuLanguage = this.languageData.join(",");
      selectMenu(menuLanguage, size, current).then((res) => {
        let menuData = res.data.data.records || [];
        menuData = menuData.map((item) => {
          if (!item.menuTlList) {
            return item;
          }
          const langMap = {};
          item.menuTlList.forEach((lang) => {
            langMap[lang.language] = lang.menuName;
          });
          let menuID = [];
          for (let i = 0; i < item.menuTlList.length; i++) {
            menuID.push(item.menuTlList[i].id);
          }
          delete item.menuTlList;
          return {
            ...item,
            ...langMap,
            menuID,
          };
        });
        this.dataMenu = menuData;
        this.page.total = res.data.data.total;
        this.tableLoading = false;
      });
    },
    // 修改保存
    rowUpdate(row, index) {
      let params = {};
      params.code = row.code;
      params.id = row.id;
      params.path = row.path;
      let menuID = row.menuID;
      let checkbox2 = this.checkbox2;
      let menuName = checkbox2.map((lang) => {
        return row[lang];
      });
      let menuTlList = [];
      for (let i = 0; i < checkbox2.length; i++) {
        menuTlList[i] = {
          menuName: menuName[i],
          description: menuName[i],
          language: checkbox2[i],
          soureceLang: checkbox2[i],
          id: menuID[i],
        };
      }
      params.menuTlList = menuTlList;
      // 关闭修改
      this.$set(this.dataMenu[index], "$cellEdit", false);
      updateMenu(params).then(() => {
        this.onLoadMenu();
        //刷新左侧导航栏
        this.$store.dispatch("GetMenu", 1).then((menu) => {
          if (menu.length !== 0) {
            this.$router.$avueRouter.resetRoutes(menu, true);
          }
          this.$router.$avueRouter.setTitle(
            this.$store.tag && this.$store.tag.label
          );
        });
      });
    },
    // 自定义修改
    rowCell(row, index) {
      if (row.$cellEdit !== true) {
        this.oriData[index] = this.deepClone(row);
        this.$set(this.dataMenu[index], "$cellEdit", true);
      } else {
        this.$set(this.dataMenu[index], "$cellEdit", false);
        this.$set(this.dataMenu, index, this.oriData[index] || {});
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.topMenu {
  display: flex;
  flex: 1;
  align-items: center;
}
/* 其他页面没有影响 , 去掉多选√*/
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  display: none;
}
#i18n {
  color: rebeccapurple;
}
#i18n /deep/ .avue-crud__menu {
  position: absolute;
  right: 46px;
  top: 66px;
  width: auto;
}
</style>
