<template>
  <div class="icon-wrapper">
    <i :class="[icon]" v-if="icon" @click="onIconClick" :style="iconStyle"></i>
    <el-button type="text" size="mini" @click="onIconClick" v-else :disabled="disabled">选择</el-button>
    <el-drawer
      title="选择图标"
      :visible.sync="visible"
      size="33%"
      @closed="onDrawerClosed"
      append-to-body
      class="my-pop"
    >
      <div v-if="showOther" style="text-align:center;margin-top:16px">
        <el-tooltip effect="dark" content="如果下方没有显示相应图标即不存在" placement="top-start">
          <el-input
            v-model="otherIcon"
            placeholder="请输入图标全类名"
            size="mini"
            clearable
            style="margin-bottom:12px"
          >
            <el-button slot="prepend" icon="el-icon-back" size="mini" @click="showOther=false"></el-button>
            <el-button slot="append" size="mini" @click="onClickConfirm">确定</el-button>
          </el-input>
        </el-tooltip>
        <i :class="['icon-view',otherIcon]" v-show="otherIcon"></i>
      </div>
      <template v-else>
        <div class="icon-group">
          <i v-for="item in iconList" :key="item" :class="[item]" @click="onClickItem(item)"></i>
        </div>
        <div class="icon-btns">
          <el-button type="warning" plain size="small" @click="showOther=true">其他图标</el-button>
          <el-button plain size="small" @click="onClickItem('')">清除</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import ICONLIST from './icon-list.js'

export default {//图标选择
  name: 'IconSelect',
  computed: {
    iconList() {
      return ICONLIST()
    },
    iconStyle() {
      return {
        color: this.disabled ? '#C0C4CC' : this.color,
        fontSize: this.size + 'px',
        cursor: this.selectable ? 'pointer' : 'none'
      }
    }
  },
  model: {
    prop: 'icon',
    event: 'change'
  },
  props: {
    icon: String,//选中的icon
    size: {
      type: Number,
      default: 20,
    },
    color: {
      type: String,
      default: '#f8b3b3',
    },
    selectable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      otherIcon: '',
      showOther: false,
      visible: false
    }
  },
  methods: {
    onIconClick() {
      if (this.selectable && !this.disabled) {
        this.showOther = false
        this.visible = true
      }
    },
    onClickConfirm() {
      if (this.otherIcon) {
        this.onClickItem(this.otherIcon)
      } else {
        this.$message.warning('请输入图标全类名')
      }
    },
    onClickItem(item) {
      this.visible = false
      this.$emit('change', item)
    },
    onDrawerClosed(e) {
      this.$emit('closed', e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon-group i {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  text-align: center;
  cursor: pointer;
}
.icon-group,
.icon-btns {
  text-align: left;
}
.icon-btns {
  margin-top: 12px;
}
.icon-group i:hover {
  background-color: #ebebee;
}
.icon-custom {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.icon-view {
  font-size: 40px;
  color: #4d8ac8;
}
</style>
