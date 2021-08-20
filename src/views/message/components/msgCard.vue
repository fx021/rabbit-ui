<template>
  <div class="card" :class="{unread:message.status === 0}">
    <div class="card__title">{{ message.title || '' }}</div>
    <div class="card__content">
      <template v-if="message.createBy">
        <div class="title">申请人</div>
        <div class="tags">
          <div class="tag"> {{ message.createdBy }} </div>
        </div>
      </template>

      <div class="info">发送时间：{{ message.sendTime }}</div>
      <div class="info">{{ message.messageContent }}</div>
    </div>
    <div class="card__footer">
      <a  @click="handleWork(message)" class="link"> 查看详情 </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data(){
    return{
      // 处理后的参数
      obj:{},
    }
  },
  created() {
  },
  methods:{
    // 查看详情
    handleWork(row) {
        if(this.$route.params.templateId==3||this.$route.params.templateId==4){
                this.$router.push(row.formId)
        }else{
           let url=row.formId.substring(row.formId.lastIndexOf("?")+1);
                    let processInfoList = url.split("&")
                    for(let i=0;i<processInfoList.length;i++){
                      let processInfo = processInfoList[i].split("=")
                      this.obj[processInfo[0]]=processInfo[1];
                    }
                    let fromView = "DETAIL";
                    if (row.templateType === "0") {
                      //待阅
                      fromView = "DETAIL"
                    } else if (row.templateType === "1") {
                      //待办
                      // fromView = "DRAFT"
                      fromView = "DEAL"
                    } else if (row.templateType === "2") {
                      //已阅
                      fromView = "DETAIL"
                    } else if (row.templateType === "3") {
                      //已办
                      fromView = "DETAIL"
                    }

                    this.$router.push({
                      path: `/work/process/handle`,
                      query: {
                        taskId: this.obj.taskId,
                        taskDefinitionKey: this.obj.taskDefinitionKey,
                        processNodeName: this.obj.processNodeName,
                        processInstanceId: this.obj.processInstanceId,
                        businessId: this.obj.businessId,
                        processDefinitionId: this.obj.processDefinitionId,
                        fromView: fromView,
                      }
                    });
        }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  padding: 0 15px;
  min-width: 300px;
  max-width: 500px;
  position: relative;

  &.unread:before {
    content: "";
    position: absolute;
    top: -4px;
    left: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #fa2528;
  }

}

.card__title {
  font-size: 16px;
  border-bottom: 1px solid #e9eaec;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card__content {
  .title {
    line-height: 30px;
    height: 30px;
    font-weight: bold;
  }

  .tags {
    display: flex;
  }

  .tag {
    padding: 0 6px;
    font-size: 12px;
    background-color: #409eff;
    color: #fff;
    $height: 20px;
    height: $height;
    line-height: $height;
    border-radius: $height / 2;
  }

  .info {
    font-size: 12px;
    line-height: 25px;
  }
}

.card__footer {
  border-top: 1px solid #e9eaec;
  padding: 6px 0;

  .link {
    color: #409eff;
    display: flex;
    align-items: center;
    cursor: pointer;

    &::after {
      content: ">";
      margin-left: auto;
    }
  }
}
</style>>
