<template>
  <div>
    <basic-container>
      <avue-tabs :option="option" @change="handleChange"></avue-tabs>
      <avue-form
        v-if="type == 'info'"
        v-model="infoForm"
        :option="infoFormOption"
        @submit="handleInfoSubmit"
      ></avue-form>
      <avue-form
        v-else-if="type == 'password'"
        v-model="passwordForm"
        :option="passwordFormoption"
        @submit="handlePasswordSubmit"
      ></avue-form>
    </basic-container>
  </div>
</template>

<script>
import option from "@/const/user/info";
import { getUserInfo, updateInfo, updatePassword } from "@/api/system/user";
import md5 from "js-md5";
const validatePhone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};

function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}
const validateEmail = (rule, value, callback) => {
  if (!isEmail(value)) {
    callback(new Error('邮箱格式错误'))
  } else {
    callback()
  }
}

export default {
  data() {
    return {
      type: "info",
      option: option,
      infoForm: {},
      passwordForm: {},

      infoFormOption: {
        submitText: "修改",
        column: [
          {
            label: "头像",
            type: "upload",
            listType: "picture-img",
            propsHttp: {
              res: "data",
              url: "link",
            },
            canvasOption: {
              text: " ",
              ratio: 0.1,
            },
            action: "/api/rabbit-resource/oss/endpoint/put-file",
            tip: "只能上传jpg/png用户头像，且不超过500kb",
            span: 12,
            row: true,
            prop: "avatar",
          },
          {
            label: "姓名",
            span: 12,
            row: true,
            prop: "name",
          },
          {
            label: "用户名",
            span: 12,
            row: true,
            prop: "realName",
          },
          {
            label: "手机号",
            span: 12,
            row: true,
            prop: "phone",
            rules: [{ validator: validatePhone, trigger: 'blur', required: true, }]
          },
          {
            label: "邮箱",
            prop: "email",
            span: 12,
            row: true,
            rules: [{ validator: validateEmail, trigger: 'blur', required: true, }]
          },
        ],
      },

      passwordFormoption: {
        submitText: "修改",
        column: [
          {
            label: "原密码",
            span: 12,
            row: true,
            type: "password",
            prop: "oldPassword",
          },
          {
            label: "新密码",
            span: 12,
            row: true,
            type: "password",
            prop: "newPassword",
          },
          {
            label: "确认密码",
            span: 12,
            row: true,
            type: "password",
            prop: "newPassword1",
          },
        ],
      },
    };
  },
  created() {
    let user = this.$store.getters.userInfo
    if (user) {
      this.infoForm = {
        id: user.user_id,
        avatar: user.avatar,
        name: user.nick_name,
        phone: '********',
        realName: user.real_name,
      }
    }
    this.handleWitch();
  },
  methods: {
    handleInfoSubmit(form, done) {
      updateInfo(this.infoForm).then((res) => {
        if (res.data.success) {
          this.$message({
            type: "success",
            message: "修改信息成功!",
          });
          done()
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
          done()
        }
      });
    },
    handlePasswordSubmit(form, done) {
      updatePassword(
        md5(this.passwordForm.oldPassword),
        md5(this.passwordForm.newPassword),
        md5(this.passwordForm.newPassword1)
      ).then((res) => {
        if (res.data.success) {
          this.$message({
            type: "success",
            message: "修改密码成功!",
          });
          done()
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
          done()
        }
      });
    },
    handleWitch() {
      if (this.type === "info") {
        getUserInfo().then((res) => {
          const user = res.data.data;
          this.infoForm = {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            realName: user.realName,
            phone: user.phone,
            email: user.email,
          };
        });
      }
    },
    handleChange(item) {
      this.type = item.prop;
      // this.handleWitch();
    },
  },
};
</script>

<style>
</style>
