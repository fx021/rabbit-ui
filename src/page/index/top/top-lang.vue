<template>
  <el-dropdown trigger="hover" @command="handleSetLanguage" placement="bottom">
    <i class="icon-zhongyingwen"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="language === lang.dictKey"
        :command="lang.dictKey"
        v-for="lang in langList"
        :key="lang.dictKey"
        >{{ lang.dictValue }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getLanguage } from "@/api/system/menu";

export default {
  name: "top-lang",
  props: {
    menuFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      langList: [],
    };
  },
  // 右上角有几种语言
  mounted() {
    this.getLanguage();
  },

  computed: {
    ...mapGetters(["language", "multilingual"]),
  },
  watch: {
    multilingual: function () {
      this.getLanguage();
    },
  },
  methods: {
    ...mapActions("user", ["GetMenu"]),
    handleSetLanguage(lang) {
      this.$store.commit("SET_LANGUAGE", lang);
      if (!this.menuFlag) {
        return;
      }
      this.$store.dispatch("GetMenu", 1).then((menu) => {
        if (menu.length !== 0) {
          this.$router.$avueRouter.resetRoutes(menu, true);
        }
        this.$router.$avueRouter.setTitle(
          this.$store.tag && this.$store.tag.label
        );
      });
    },
    // 查询语言
    getLanguage() {
      if (this.changeTimer) {
        clearTimeout(this.changeTimer);
      }
      this.changeTimer = setTimeout(() => {
        getLanguage().then((res) => {
          if (res.data.data) {
            this.langList = res.data.data;
          }
        });
      },1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dropdown-menu {
  transform: translateY(-20px);
}
</style>
