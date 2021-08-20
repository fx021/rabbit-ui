<template>
  <basic-container>
    <avue-form :option="option" v-model="form"></avue-form>
  </basic-container>
</template>

<script>
export default {
  name: "test2",
  props: {
    id: String,
    dataId: String,
    value: Object,
    processNodeId: String,
    processInstanceId: String,
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  data: () => ({
    form: {},
    loading: false,
    dataId: "",
    option: {
      emptyBtn:false,
      submitBtn:false,
      menu: false,
      rowKey: 'ID',
      column: [ {
        prop: 'NUM',
        label: 'NO',
        value: '',
        display: true,
        disabled: false,
      },{
        prop: 'ORG',
        label: '所属组织',
        value: '',
        display: true,
        disabled: false,
      },{
        prop: 'DATE1',
        label: '检查日期',
        type: 'date',
        value: '',
        valueFormat: 'yyyy-MM-dd',
        display: true,
        disabled: false,
      }, {
        prop: 'USER',
        label: '检查人员',
        component: 'userSelect',
        viewMode: 1,
        limit: 1,
        display: true,
        disabled: false,
      }, {
        prop: 'POSITION',
        label: '隐患位置',
        value: '',
        display: true,
        disabled: false,
      }, {
        prop: 'TYPE',
        label: '隐患分类',
        type: 'radio',
        value: '0',
        dicData: [{
          label: '一般',
          value: '0'
        }, {
          label: '重大',
          value: '1'
        }],
        display: true,
        disabled: false,
      }, {
        prop: 'DESCRIPTION',
        label: '隐患描述',
        value: '',
        type: 'textarea',
        display: true,
        disabled: false,
      }, {
        prop: 'IMGS',
        label: '隐患图片',
        type: 'upload',
        accept: 'image/*',
        listType: 'picture-card',
        action: '/api/rabbit-resource/oss/endpoint/upload',
        propsHttp: {
          res: 'data',
          name: 'originalName',
          url: 'link'
        },
        display: true,
        disabled: false,
      },
        // {
        //   prop: 'DEV_TEST_B',
        //   type: 'dynamic',
        //   span:24,
        //   children: {
        //     align: 'center',
        //     headerAlign: 'center',
        //     column: [{
        //       label: '事故定义',
        //       prop: "SGDY",
        //       formslot: true,
        //     }, {
        //       label: '事故描述',
        //       prop: "SGMS",
        //       formslot: true,
        //     }]
        //   }
        // },
      ]
    }
  }),
  created() {
    this.setRole()
  },
  methods: {
    //设置权限
    setRole() {
      const userInfo = this.$store.getters.userInfo;
      const userRoleList = userInfo.role_id.split(",");
      for (let i=0;i<userRoleList.length;i++){
        if(this.processNodeId === "sid-971CBAF8-B032-47DB-B780-EEC257C1BA70"){
          //如果角色为（系统工程师）
          if(userRoleList[i] === "1370635881110577153"){
            this.option.column[0].disabled = true;
            this.option.column[1].disabled = true;
            this.option.column[2].disabled = true;
            this.option.column[3].disabled = true;
            this.option.column[5].disabled = true;
            this.option.column[6].disabled = true;
            this.option.column[7].disabled = true;
          }
          //如果角色为（主操）
          if (userRoleList[i] === "1386113805339082753"){
            this.option.column[0].disabled = true;
            this.option.column[2].disabled = true;
            this.option.column[3].disabled = true;
            this.option.column[4].disabled = true;
            this.option.column[5].disabled = true;
            this.option.column[6].disabled = true;
            this.option.column[7].disabled = true;
          }
        }
      }
    },
    saveBeforeCommit(row) {
      if (this.dataId == null) {
        this.dataId = "";
      }
      row = row || this.form;
      let obj = Object.assign({}, row)
      if (Array.isArray(obj.IMGS)) {
        obj.IMGS = JSON.stringify(obj.IMGS)
      }
      let formId = "1404733699115106306";
      let formData = {
        "ID": this.dataId,
        "NUM": obj.NUM,
        "ORG": obj.ORG,
        "USER": obj.USER,
        "POSITION": obj.POSITION,
        "DESCRIPTION": obj.DESCRIPTION,
        "IMGS": obj.IMGS,
        "TYPE": obj.TYPE,
        "DATE1": obj.DATE1,
        // "DEV_TEST_B": obj.DEV_TEST_B,
      };

      let aaa = {
        "aaa": "aaa"
      }
      //保存或更新数据
      this.$axios.post('/api/rabbit-resource/selfDevForm/saveFormData/' + formId + "?dataId=" + this.dataId,formData).then(res => {
        this.form['ID'] = res.data.data.dataId;
        this.dataId = res.data.data.dataId;
        this.$emit("submit", null)
        if (res.data.success){
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        }
      });

      /*注入流程变量 start*/
      /*this.$axios.get('/api/rabbit-flow/jurisdiction/setVariable', {
        params: {
          processInstanceId: this.processInstanceId,
          key: "USER",
          value: formData.USER,
        }
      });*/
      /*注入流程变量 end*/
    },

  },
  watch:{
    value:{
      handler(val){
        let form = val ||{}
        let obj = {}
        for(let key in form){
          let newKey = key.split("#").pop()
          if (newKey==='IMGS'){
            obj[newKey] = JSON.parse(form[key])
          }else {
            obj[newKey]=form[key]
          }
        }
        this.form = obj
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
</style>
