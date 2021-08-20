<template>
  <el-input v-model="name" placeholder="自动计算" readonly :size="size" v-if="!readonly"></el-input>
  <span v-else>{{name}}</span>
</template>

<script>
export default {//行表达式
  name: 'RowExpression',
  model: {
    event: 'change'
  },
  props: {
    action: String,//表达式
    prepend: String,//前缀
    append: String,//后缀
    actionData: Array,//表达式值记录,label,value
    prop: String,//对应的prop
    readonly: Boolean,//是否只读
    precision: {//精度
      type: Number,
      default: 2
    },
    controls: Boolean,//过滤非数字
    size: String,//控件大小
    value: [String, Number],
    row: Object//列表行数据
  },
  data: () => {
    return {
      name: "",
      unwatchList: []
    }
  },
  created() {
    if (this.prop && this.prop.startsWith('p#')) {
      this.computeValue()
    } else {
      this.name = this.formatShow(this.value)
    }
    this.bindWatch()
  },
  beforeDestroy() {
    this.bindWatch(true)
  },
  methods: {
    bindWatch(unbind) {
      if (this.unwatchList.length) {
        for (let unwatch of this.unwatchList) {
          unwatch()
        }
        this.unwatchList = []
      }
      if (!unbind && this.actionData) {
        for (let item of this.actionData) {
          if (item.value) {
            let watch = this.$watch(() => {
              return this.row[item.value]
            }, () => {
              this.computeValue()
            })
            this.unwatchList.push(watch)
          }
        }
      }
    },
    computeValue() {
      this.name = ''
      if (this.row && this.actionData) {
        let show = ''
        let isValue = true
        let lastExp = ''
        let qualterExp = ''
        let qualterShow = show
        let checkLast = false
        let hasQualter = false
        let pattern = /[+\-*/()%\s]+/
        for (let dic of this.actionData) {
          let exp;
          if (dic.value) {
            exp = this.row[dic.value]
            if (exp === undefined || exp === null || exp === '') {
              // this.name = lastExp ? '[Waiting...]' : ''
              // return
              hasQualter = true
              if (qualterShow && !checkLast) {
                checkLast = true
                show = qualterShow
                lastExp = qualterExp
              }
              continue
            }
            isValue = true
          } else {
            exp = dic.label
            if (dic.label.includes('(')) {
              if (!checkLast) {
                qualterShow = show
                qualterExp = lastExp
              }
            } else if (dic.label.includes(")")) {
              qualterShow = ''
              if (checkLast) {
                checkLast = false
                continue
              }
              checkLast = false
            }
            if (!checkLast) {
              isValue = !pattern.test(exp)
            }
          }
          if (checkLast) {
            continue
          }
          if (isValue && this.controls && isNaN(exp)) {
            if (lastExp) {
              show = show.substring(0, show.length - lastExp.length)
            }
            continue
          }
          if (!hasQualter || /[+\-*/()%]\s*$/.test(show)) {
            lastExp = exp
            show += exp
            hasQualter = false
          }
        }
        if (hasQualter) {
          if (/[+-]\s*$/.test(show)) {
            show += '0'
          } else {
            show += '1'
          }
        }
        try {
          // console.log('actionData', this.actionData)
          // console.log('expression ' + this.action + " -> " + show)
          let result = Function(`return ${show}`)()
          this.$emit('change', result)
          this.name = this.formatShow(result)
        } catch (error) {
          console.log('解析异常', show, error)
        }
      }
    },
    //row, index, dic,size
    formatNumber(num) {
      if (typeof num == 'string') {
        num = +num
      }
      return num.toFixed(this.precision)
    },
    formatShow(text) {
      if (text === undefined || text === null) {
        text = ' / '
      } else if (this.precision >= 0 && !isNaN(text)) {
        text = this.formatNumber(text)
      }
      if (this.prepend) {
        text = this.prepend + text
      }
      if (this.append) {
        text += this.append
      }
      return text
    },
  },
  watch: {
    actionData() {
      this.bindWatch()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
