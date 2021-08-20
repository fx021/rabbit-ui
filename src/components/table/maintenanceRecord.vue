<template>
  <div class="sublevel">
    <div class="content">
      <div class="title-text">维修记录</div>
      <div class="basice-box">
        <el-table
          ref="checkUserTable"
          :data="checkUserList"
          tooltip-effect="dark"
          style="width: 100%"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            label="故障开始时间"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="故障结束时间"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="duration"
            label="耗时(h)"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="alarmLevel"
            label="故障级别"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.alarmLevel | filterOptions(warningLevelOptions)
            }}</template>
          </el-table-column>
          <el-table-column
            prop="powerLoss"
            label="损失电量（kw）"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="partner"
            label="参与人"
            align="left"
            show-overflow-tooltip
            header-align="center"
          >
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            layout="total,sizes,prev,pager,next"
            @size-change="handleSizeChange"
            :total="total"
            :page-size="pageSize"
            background
            :current-page.sync="current"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { archivesMaintainHistory } from "@/api/device/equipmentArchives";
import { positionMaintainHistory } from "@/api/device/equipmentLocation";

export default {
  data() {
    return {
      current: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      warningLevelOptions: JSON.parse(
        localStorage.getItem("warningLevelOptions")
      ), // 告警级别字典
    };
  },
  props: {
    archivesId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  mounted() {
    this.getArchivesHistory();
  },
  methods: {
    getArchivesHistory() {
      if (this.sign == "record") {
        archivesMaintainHistory({
          archivesId: this.archivesId,
        }).then((res) => {
          console.log(res);
          this.checkUserList = res.data.data.pageData;
          this.pageNum = res.data.data.pageNum;
          this.total = res.data.data.total;
        });
      } else if (this.sign == "place") {
          positionMaintainHistory({
          archivesId: this.archivesId,
        }).then((res) => {
          console.log(res);
          this.checkUserList = res.data.data.pageData;
          this.pageNum = res.data.data.pageNum;
          this.total = res.data.data.total;
        });
      }
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.getArchivesHistory();
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getArchivesHistory();
    },
  },
};
</script>
<style lang="scss" scoped>
.sublevel {
  margin-top: -1px;
  .content {
    border-bottom: 1px solid #b3d8ff;
    padding-bottom: 20px;
    .title-text {
      width: 100%;
      text-align: left;
      padding: 10px 16px 26px;
      font-size: 20px;
      font-weight: bold;
    }
  }
  /deep/.el-table th,
  .el-table tr {
    background-color: #fafafa;
    color: #333;
  }
  .add-box {
    text-align: center;
    width: 100%;
    border: 1px solid #409eff;
    border-radius: 5px;
    color: #409eff;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
  }
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
