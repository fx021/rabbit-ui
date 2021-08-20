<template>
  <avue-form ref="form" v-model="vo" :option="option">
    <template #leaderName="{ disabled }">
      <div>
        <el-input
          readonly
          :disabled="disabled"
          :value="vo.leaderName"
          placeholder="请选择 领导"
          @click.native="selectLeaderDialogVisible = true"
        ></el-input>
        <!-- 选择领导 Dialog Start -->
        <el-dialog
          title="选择领导"
          append-to-body
          :visible.sync="selectLeaderDialogVisible"
          width="60%"
        >
          <user-select @choose="handleSelectLeader" @cancel="selectLeaderDialogVisible = false" />
        </el-dialog>
        <!-- 选择领导 Dialog End -->
      </div>
    </template>
  </avue-form>
</template>

<script>
import userSelect from "./userSelect.vue";

export default {
  components: { userSelect },
  props: {
    vo: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      disabled: true,
      selectLeaderDialogVisible: false,
      option: {
        menuBtn: false,
        column: [
          {
            label: "组织名称",
            prop: "virtualorganizationName",
            rules: [
              {
                required: true,
                message: "请输入虚拟组织架构名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "组织全称",
            prop: "fullName",
            rules: [
              {
                required: true,
                message: "请输入组织全称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "领导",
            prop: "leaderName",
            formslot: true,
            rules: [
              {
                required: true,
                message: "请选择领导",
                trigger: "blur",
              },
            ],
          },
          {
            label: "备注",
            prop: "remark",
            rules: [],
          },
        ],
      },
    };
  },
  methods: {
    validate(callback) {
      this.$refs.form.validate((vaild, done) => {
        callback(vaild, done)
      });
    },

    handleSelectLeader(leader) {
      this.$set(this.vo, "leaderUserId", leader.id);
      this.$set(this.vo, "leaderName", leader.realName);
      this.selectLeaderDialogVisible = false;
      this.$refs.form.clearValidate();
    },
  },
};
</script>

<style>
</style>
