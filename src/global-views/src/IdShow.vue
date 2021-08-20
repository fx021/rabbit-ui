<template>
  <span :class="[size|| 'small', {'el-icon-loading': loading}]" v-if="readonly">{{ name }}</span>
  <el-input v-model="name" placeholder="自动回显" v-else readonly :size="size||'small'">
    <i slot="prepend" class="el-icon-loading" v-if="loading"></i>
  </el-input>
</template>

<script>
import cacheRequest from '@/views/form/cache-request'
import { bindUserList } from '@/util/generator'

export default {//只有id的控件的列表回显
  name: 'IdShow',
  props: {
    formId: [String, Number],
    readonly: {
      type: Boolean,
      default: true
    },
    value: [String, Number],//值
    size: String,//控件大小
    row: Object,//列表行数据
    column: Object//控件定义
  },
  data: () => {
    return {
      name: "",
      cacheData: [],
      loading: false
    }
  },
  methods: {
    getShowUrl() {
      if (this.column.viewMode == 1) {//选人
        return '/api/rabbit-user/select-ids'
      }
      if (this.column.viewMode == 2) {//部门
        return '/api/rabbit-system/dept/select-ids'
      }
      if (this.column.viewMode == 3) {//岗位
        return '/api/rabbit-system/post/select-ids'
      }
      if (this.column.viewMode == 4) {//角色
        return '/api/rabbit-system/role/select-ids'
      }
      //省市区
      return '/api/rabbit-system/region/select-ids'
    },
    getShowPrefix() {
      if (this.column.viewMode == 1) {
        return `u${this.value}`
      }
      if (this.column.viewMode == 2) {
        return `d${this.value}`
      }
      if (this.column.viewMode == 3) {
        return `p${this.value}`
      }
      if (this.column.viewMode == 4) {
        return `r${this.value}`
      }
      return this.value
    },
    parseAreaName(data) {
      let show = ''
      for (let item of data) {
        let itemShow = ''
        let postFix = ''
        if (item.provinceName) {
          itemShow += item.provinceName
          postFix = '/'
        }
        if (item.cityName && item.cityName != item.provinceName) {
          itemShow += postFix + item.cityName
          postFix = '/'
        }
        if (item.districtName) {
          itemShow += postFix + item.districtName
        }
        if (show != '') {
          show += ', '
        }
        show += itemShow
      }
      this.appendValue(show)
    },
    appendValue(name) {
      if (!name) {
        this.name = name
        return
      }
      if (this.column.prepend) {
        name = this.column.prepend + name
      }
      if (this.column.append) {
        name += this.column.append
      }
      this.name = name
    },
    parseList(list, showKey, idKey) {
      idKey = idKey || 'id'
      showKey = showKey || 'name'
      let valueList = this.value.split(',')
      let show = ''
      for (let item of valueList) {
        let showItem = list.find(it => it[idKey] == item)
        if (showItem) {
          if (show !== '') {
            show += ','
          }
          show += showItem[showKey]
        }
      }
      this.appendValue(show)
    },
    getValueParam(sql) {
      if (this.value === undefined || this.value === null) {
        return ''
      }
      if (!sql || !isNaN(this.value)) {
        return this.value
      }
      return `'${this.value.replace(/,/g, "','")}'`
    }
  },
  watch: {
    value: {
      handler(val) {
        // console.log("wath code", val)
        if (!val) {
          this.loading = false
          this.name = this.readonly ? '/' : ''
          return
        }
        this.loading = true
        if (this.column.viewMode === 6) {
          cacheRequest({
            url: '/api/rabbit-resource/formcustom/form-sql',
            method: 'post',
            data: {
              id: this.column.accept || this.formId,
              sql: this.column.action.replace("{value}", this.getValueParam(1)),
              mode: this.column.accept ? 1 : 0
            }
          }, this.column.prop || this._uid, this.value).then(data => {
            this.parseList(data)
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else if (this.column.viewMode === 5) {
          if (!this.column.action) {
            this.loading = false
            this.name = '/'
            return
          }
          cacheRequest({
            url: this.column.action.replace("{value}", this.getValueParam()),
            method: 'get',
          }, this.column.prop || this._uid, this.value).then(data => {
            let idKey = 'id'
            let nameKey = 'name'
            if (this.column.accept) {
              let array = this.column.accept.split(",")
              if (array.length > 1) {
                idKey = array[0] || idKey
                nameKey = array[1] || nameKey
              } else if (array.length === 1) {
                nameKey = array[0] || nameKey
              }
            }
            if (Array.isArray(data)) {
              this.parseList(data, nameKey, idKey)
            } else if (typeof data === 'string') {
              this.appendValue(data)
            } else {
              this.parseList([data], nameKey, idKey)
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          cacheRequest({
            url: this.getShowUrl(),
            method: 'get',
            params: { ids: val }
          }, this.column.prop || this._uid, this.getShowPrefix()).then(data => {
            if (this.column.viewMode == 1) {//选人
              this.parseList(data, 'realName')
              if (this.column.actionData) {
                this.cacheData = data
                this.row['$bindShow'] = 1
                bindUserList(this.cacheData, this.column.actionData, this, true)
              }
            } else if (this.column.viewMode == 2) {
              this.parseList(data, 'deptName')
            } else if (this.column.viewMode == 3) {
              this.parseList(data, 'postName')
            } else if (this.column.viewMode == 4) {
              this.parseList(data, 'roleName')
            } else {
              this.parseAreaName(data)
            }
            this.loading = false
            delete this.error
          }).catch(() => {
            this.loading = false
            this.error = true
          })
        }
      },
      immediate: true
    },
    row() {//刷新后还能更新
      if (!this.loading && this.cacheData.length) {
        if (!this.row['$bindShow']) {
          this.row['$bindShow'] = 1
          bindUserList(this.cacheData, this.column.actionData, this, true)
        }
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.large,
.medium {
  font-size: 16px;
}

.mini {
  font-size: 12px;
}

.small {
  font-size: 14px;
}
</style>
