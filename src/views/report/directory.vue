<template>
  <div>
    <iframe
      :src="finesrc"
      width="100%"
      height="850 px"
      frameborder="0"
      scrolling="auto"
      ref="iframe"
    ></iframe>
  </div>
</template>
<script>
import {finereportlogin} from "@/api/report/report";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      finesrc: "",
    };
  },
  computed: {...mapGetters(["userInfo", "permission"])},
  mounted() {
    var user = this.userInfo.account;
    finereportlogin(user, user).then((data) => {
      if (data.errorCode) {
        window.alert(data.errorMsg);
      } else {
        // window.open("/webroot/decision", "_blank");
        this.finesrc = "/webroot/decision/directory";

      }
    });
  },
};
</script>

<style>
</style>
