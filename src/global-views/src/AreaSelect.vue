<template>
  <el-cascader
    :options="areaData"
    v-model="inputTxt"
    :props="props"
    :collapse-tags="tags"
    @change="onSelectChange"
    @visible-change="onVisibleChange"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="!required"
    :size="size"
    ref="cas"
  ></el-cascader>
</template>

<script>
export default {//省市区控件
  name: 'AreaSelect',
  model: {//与配置统一
    prop: 'value',
    event: 'change'
  },
  props: {
    limit: {//可选数量
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: () => 'small'
    },
    //2省市区, 1省市, 0 省
    cascaderIndex: {
      type: Number,
      default: 2
    },
    tags: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Array],
      default: () => ''
    }
  },
  data: () => {
    return {
      inputTxt: '',
      areaData: [],
      loading: false,
      props: {
        expandTrigger: 'click',//click,hover
        multiple: false,
        checkStrictly: false,
        emitPath: false,
        lazy: true,
        value: 'code',
        label: 'name'
      }
    }
  },
  beforeDestroy() {
    if (this._defaultSelectTimer) {
      clearTimeout(this._defaultSelectTimer)
      this._defaultSelectTimer = null
    }
    if (this._selectTimer) {
      clearTimeout(this._selectTimer)
      this._selectTimer = null
    }
  },
  created() {
    if (this.value) {//需要回显
      this.props.lazy = false
      if (typeof this.value === 'string' && this.limit != 1) {
        this.inputTxt = this.value.split(",")
      } else {
        this.inputTxt = this.value
      }
      //可在回显时减少数据
      this.getDefaultSelectList(this.value)
      // this.getAreaData('A') 
    } else {
      this.bindLazy()
    }
  },
  methods: {
    bindLazy() {
      this.props.lazy = true
      this.props.lazyLoad = (node, resolve) => {
        // console.log("lazyLoad", node)
        // if (!node || !node.data) return
        // if (node.data && node.data.children && node.data.children.length > 0) {
        //   node.data.children = undefined
        // }
        if (node.level > this.cascaderIndex) {
          resolve([])
          return
        }
        this.getAreaData(node.data && node.data.code, resolve, node.level)
      }
    },
    onSelectChange(val) {
      console.log("onSelectChange", val, this.inputTxt)
      if (this._selectTimer) {
        clearTimeout(this._selectTimer)
      }
      this._selectTimer = setTimeout(() => {
        this._selectTimer = undefined
        this._updateValue = true
        this.$emit("change", !val ? '' : (this.limit == 1 ? val : val.join()))
      }, 300);
    },
    onVisibleChange(visible) {
      this._showPane = true
      if (!this.props.lazy && visible && !this._bindAll) {
        this.getAreaData("A")
      }
    },
    getAreaData(pid, resolve) {
      this.$axios.get('api/rabbit-system/region/select-area', {
        params: {
          parentCode: pid || '00',
          level: this.cascaderIndex + 1
        }
      }).then(res => {
        let data = res.data && res.data.data || []
        if (!resolve) {
          // console.log('getAreaData', data)
          // this.checkDefaultList(data)
          this._bindAll = true
          this.areaData = data
        } else {
          resolve(data)
        }
      }).catch(() => {
        if (resolve) {
          resolve([])
        }
      })
    },
    getProvinceCode(code) {
      if (code.length == 2) {
        return code
      }
      return code.substr(0, 2)
    },
    getCityCode(code) {
      if (code.length == 4) {
        return code
      }
      return code.substr(0, 4)
    },
    getDefaultSelectList(ids) {
      if (ids && Array.isArray(ids)) {
        ids = ids.join(",")
      }
      this.loading = true
      this.$axios.get("/api/rabbit-system/region/select-ids", {
        params: {
          ids: ids
        }
      }).then(res => {
        let data = res.data.data || []
        let areaArr = []
        let provinceMap = {}
        let cityMap = {}
        // let codes = ''
        for (let area of data) {//2省市区, 1省市, 0 省
          // if (codes != '') {
          //   codes += ','
          // }
          // codes += area.code
          let provinceCode = area.provinceCode || this.getProvinceCode(area.code || area.districtCode)
          let province = provinceMap[provinceCode]
          if (!province) {
            province = { code: provinceCode, name: area.provinceName || area.name }
            if (this.cascaderIndex > 0) {
              province.children = []
            }
            provinceMap[provinceCode] = province
            areaArr.push(province)
          }
          if (this.cascaderIndex == 0) {
            continue
          }
          let cityCode = area.cityCode || this.getCityCode(area.districtCode || area.code)
          let city = cityMap[cityCode]
          if (!city) {
            city = { code: cityCode, name: area.cityName || area.name }
            if (this.cascaderIndex == 2) {
              city.children = []
            }
            cityMap[cityCode] = city
            province.children.push(city)
          }
          if (this.cascaderIndex == 2) {
            city.children.push({ code: area.districtCode || area.code, name: area.districtName || area.name })
          }
        }
        this.areaData = areaArr
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
  },
  watch: {
    limit: {
      handler(val) {
        if (val == 0 || val > 1) {
          this.props.multiple = true
        } else if (val == 1) {
          this.props.multiple = false
        }
      },
      immediate: true
    },
    value: {
      handler(val) {
        // console.log("watch area value", val)
        if (this._updateValue) {
          this._updateValue = false
          return
        }
        if (!val || val.length == 0) {
          if (this.$refs.cas) {
            this.$refs.cas.handleClear()
          }
          this.inputTxt = this.limit == 1 ? '' : []
        } else {
          if (typeof val === 'string' && this.limit != 1) {
            this.inputTxt = val.split(",")
          } else {
            this.inputTxt = val
          }
          if (this.props.lazy) {
            if (this._showPane) {
              this.props.lazy = false
              this.getAreaData('A')
            } else {
              // console.log("get default")
              this.getDefaultSelectList(val)
            }
          } else if (!this._bindAll) {
            this.getAreaData('A')
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
