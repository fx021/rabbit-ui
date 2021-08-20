<template>
  <div>
    <el-input
      v-model="inputTxt"
      placeholder="附件"
      readonly
      :size="size"
      @click.native="onInputClick"
    ></el-input>
    <el-dialog
      title="附件上传"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      append-to-body
      destroy-on-close
      @closed="onDialogClosed"
    >
      <avue-upload
        v-model="fileList"
        action="/api/rabbit-resource/oss/endpoint/upload"
        drag
        ref="upload"
        :limit="1"
        :multiple="false"
        :upload-exceed="uploadExceed"
        :props-http="propsHttp"
        style="text-align:center"
      ></avue-upload>
      <div slot="footer">
        <el-button size="small" @click="onCancel">取消</el-button>
        <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {//下载的上传
  name: 'DownloadEditor',
  model: {
    prop: 'value',
    event: 'select'
  },
  props: {
    row: Object,//控件信息
    value: Array,
    size: String
  },
  data: () => {
    return {
      visible: false,
      inputTxt: '',
      fileList: [],
      propsHttp: {
        res: 'data',
        name: 'originalName',
        url: 'link'
      }
    }
  },
  created() {
    this.onDialogClosed()
  },
  methods: {
    uploadExceed() {
      this.$message.warning('只能上传一个')
    },
    onInputClick() {
      this.visible = true
    },
    onCancel() {
      this.visible = false
    },
    onConfirm() {
      if (this.fileList && this.fileList.length) {
        this.$emit('select', this.fileList)
        this.inputTxt = this.fileList[0].label
      } else {
        this.$emit('select')
        this.inputTxt = ''
      }
      this.visible = false
    },
    beforeClose(done) {
      if (this.$refs.upload.loading) {
        this.$message.warning('上传中...')
      } else {
        done()
      }
    },
    onDialogClosed() {
      if (this.value) {
        this.fileList = this.value
        if (this.fileList.length) {
          this.inputTxt = this.fileList[0].label
        } else {
          this.inputTxt = ''
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
  text-align: end;
  position: absolute;
  top: 18px;
  right: 70px;
}
</style>
