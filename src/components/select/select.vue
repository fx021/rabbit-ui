<template>
  <el-select
    v-model="value"
    multiple
    @change="handleChange"
    collapse-tags
    placeholder="请选择"
    :disabled="disabled"
    @visible-change="visibleChange"
  >
    <el-input
      v-model="searchText"
      @input="handleInput"
      class="select-input"
      ref="inputRef"
    ></el-input>
    <div class="select-btns">
      <el-button type="info" plain class="btn" @click="selcetAll"
        >全选</el-button
      >
      <el-button
        type="info"
        plain
        class="btn"
        style="margin-left: 0"
        @click="cancelAll"
        >全不选</el-button
      >
    </div>
    <div class="option-list">
      <el-option
        v-for="item in options"
        :key="item[optionProp.value]"
        :label="item[optionProp.label]"
        :value="item[optionProp.value]"
        :title="item.title"
      >
      </el-option>
    </div>
    <div slot="empty" class="empty">
      <el-input
        v-model="searchText"
        @input="handleInput"
        class="select-input"
        ref="emptyRef"
      ></el-input>
      <div class="select-btns">
        <el-button type="info" plain class="btn" @click="selcetAll"
          >全选</el-button
        >
        <el-button
          type="info"
          plain
          class="btn"
          style="margin-left: 0"
          @click="cancelAll"
          >全不选</el-button
        >
      </div>
      <div class="nodata">无数据匹配</div>
    </div>
  </el-select>
</template>
<script>
export default {
  name: "select",
  model: {
    prop: "select",
    event: "change",
  },
  props: {
    select: {
      type: Array,
    },
    options: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    optionProp: {
      type: Object,
      default: {
        value: "value",
        label: "label",
      },
    },
  },
  data() {
    return {
      value: [],
      searchText: "",
    };
  },
  watch: {
    options(val) {
      if (val && val.length === 0) {
        this.$refs.inputRef && this.$refs.inputRef.blur();
        setTimeout(() => {
          this.$refs.emptyRef.focus();
        }, 100);
      } else {
        this.$refs.emptyRef && this.$refs.emptyRef.blur();
        setTimeout(() => {
          this.$refs.inputRef.focus();
        }, 100);
      }
    }
  },
  methods: {
    visibleChange() {
      this.$emit("visible-change");
    },
    handleChange() {
      this.$emit("change", this.value);
    },
    handleInput() {
      this.$emit("input", this.searchText);
    },
    selcetAll() {
      this.options.forEach((ele) => {
        if (!this.value) this.value = [];
        if (this.value.indexOf(ele[this.optionProp.value]) === -1) {
          this.value.push(ele[this.optionProp.value]);
        }
      });
      this.handleChange();
    },
    cancelAll() {
      this.options.forEach((ele, index) => {
        let indexs = this.value.indexOf(ele[this.optionProp.value]);
        if (indexs !== -1) {
          this.value.splice(indexs, 1);
        }
      });
      this.handleChange();
    },
  },
};
</script>

<style lang="scss">
.el-select-dropdown__wrap {
  max-height: 354px !important;
}
</style>
<style lang="scss" scoped>
.select-input {
  width: 94%;
  margin-left: 3%;
}
.select-btns {
  display: flex;
  justify-content: center;
  margin-top: 6px;
  .btn {
    width: 47%;
  }
}
.option-list {
  max-height: 240px;
  overflow: auto;
}
.empty {
  padding: 6px 0;
  .nodata {
    line-height: 40px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
</style>
