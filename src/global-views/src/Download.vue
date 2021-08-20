<template>
  <el-tooltip
    :content="tooltipContent"
    placement="top"
    v-if="!readonly && !disbaled"
    style="display:inline-block"
  >
    <div>
      <span v-if="action && step==2" class="remark left">{{action}}</span>
      <el-button type="success" :size="size" @click="onDownload">附件下载</el-button>
      <span v-if="action && !step" class="remark right">{{action}}</span>
      <p v-if="action && step==1" class="remark bottom">{{action}}</p>
    </div>
  </el-tooltip>
  <span v-else>{{actionData && actionData.length?(actionData[0].label):(action||'')}}</span>
</template>

<script>
export default {//下载控件
  name: 'Download',
  model: {//与配置统一
    prop: 'value',
    event: 'change'
  },
  props: {
    action: String,//说明
    actionData: {//附件
      type: Array,
      default: () => []
    },
    step: {//说明位置,详见view-list.js
      type: Number,
      default: 3
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: () => 'small'
    },
    value: {
      type: [String, Array],
      default: () => ''
    }
  },
  computed: {
    tooltipContent() {//tooltip内容
      if (this.action && this.step == 3) {
        return `${this.actionData[0].label}：${this.action}`
      }
      return this.actionData[0].label
    },
  },
  data: () => {
    return {
      loading: false
    }
  },
  methods: {
    onDownload() {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = this.actionData[0].value
      link.download = this.actionData[0].label
      document.body.appendChild(link)
      link.click();
      document.body.removeChild(link)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.remark {
  font-size: 13px;
  color: #d78282;
}
.right {
  margin-left: 12px;
}
.left {
  margin-right: 12px;
}
.bottom {
  margin-top: 6px;
  line-height: 1;
}
</style>
