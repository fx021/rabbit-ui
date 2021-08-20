<template>
  <div class="image" v-if="imgList.length">
    <el-tooltip :content="item.label" placement="top" v-for="item in imgList" :key="item.value">
      <img :src="item.src || item.value" :class="[size || 'small']" @click="openImg(item)" />
    </el-tooltip>
  </div>
  <span v-else>/</span>
</template>

<script>
export default {//上传组件在列表的回显
  name: 'UploadShow',
  props: {
    value: [String, Array],//label,value
    size: String,//控件大小
    row: Object,//表格row
    column: Object//组件定义
  },
  data: () => {
    return {
      name: "",
      imgList: [],
      change: false,
    }
  },
  methods: {
    openImg(item) {
      if (item.src) {//非图片,直接下载
        window.open(item.value, '_blank')
        return
      }
      let list = []
      let listIndex = 0
      for (let i = 0; i < this.imgList.length; i++) {
        let ele = this.imgList[i]
        if (!ele.src) {
          list.push({
            thumbUrl: ele.value, url: ele.value
          })
          if (item.value == ele.value) {
            listIndex = list.length - 1
          }
        }
      }
      this.$ImagePreview(list, listIndex);
    },
    parseMapString(text) {
      text = text.substring(1, text.length - 1)
      let labelPat = /\{label=(.+),\s/
      let valuePat = /value=(.+)},?\s*/
      let labelRes, valRes;
      let result = []
      while ((labelRes = labelPat.exec(text))) {
        let label = labelRes[1]
        text = labelRes.input.substring(labelRes[0].length)
        valRes = valuePat.exec(text)
        let value
        if (valRes) {
          value = valRes[1]
        }
        text = valRes.input.substring(valRes[0].length)
        result.push({ label, value })
      }
      return result
    },
  },
  watch: {
    value: {
      handler() {
        // console.log("upload show", this.value)
        if (this.change) {
          this.change = false
          return
        }
        if (!this.value) {
          this.fileList = []
          this.imgList = []
        } else {
          let array = this.value
          let needUpdate = false
          if (typeof this.value == 'string') {
            needUpdate = true
            try {
              array = JSON.parse(this.value)
            } catch (err) {
              // console.log("parse error", array, error)
              array = this.parseMapString(array)
            }
          }
          let imgPat = /\.(png|jpg|jpeg|gif)$/i
          let imgMap = {
            'img/word.png': /\.(doc|docx|wps)$/i, 'img/ppt.png': /\.(ppt|pptx|dps)$/i,
            'img/excel.png': /\.(xls|xlsx|et)$/i, 'img/pdf.png': /\.(pdf)$/i,
            'img/zip.png': /\.(zip|tar|7z|tgz|tar|gz|rar)$/i
          }
          let imgList = []
          for (let item of array) {
            if (!imgPat.test(item.value)) {
              for (let key in imgMap) {
                if (imgMap[key].test(item.value)) {
                  item.src = key
                  break
                }
              }
              if (!item.src) {
                item.src = 'img/file.png'
              }
            }
            imgList.push(item)
          }
          this.imgList = imgList
          if (needUpdate) {
            this.change = true
            this.$emit('input', array)
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.image {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: -2px;
}
.image img {
  margin-left: 2px;
  cursor: pointer;
  object-fit: contain;
}
.large {
  height: 48px;
}
.medium {
  height: 40px;
}
.mini {
  height: 32px;
}
.small {
  height: 36px;
}
</style>
