<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <!-- <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            >电站区域
          </el-button> -->
          <!-- <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            @click="changeState(1)"
            >置为有效
          </el-button>
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-delete"
            @click="changeState(0)"
            >置为无效
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-plus"
            @click="compile"
            >{{ $route.query.id ? (listState ? "提交" : "编辑") : "新增" }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            plain
            class="el-icon-delete"
            v-if="$route.query.id"
            @click.stop="deletes"
            >删除</el-button
          >
          <!-- //!无导出 -->
        </div>
      </div>
      <div class="main">
        <el-form
          ref="form"
          :model="form"
          :rules="!($route.query.id && !listState) ? rules : ''"
          label-width="162px"
          label-position="right"
        >
          <div class="basics">
            <div class="content">
              <div class="title">基础信息</div>
              <div class="basice-box">
                <el-form-item label="子期名称" prop="subStationName">
                  <el-input
                    v-model="form.subStationName"
                    placeholder="请选择"
                    :disabled="$route.query.id"
                    @focus="focusMainStation(0)"
                    ref="mainStation0"
                  ></el-input>
                </el-form-item>
                <el-form-item label="次分期名称" prop="stageName">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.stageName"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="上网方式" prop="accessType">
                  <el-select
                    v-model="form.accessType"
                    :disabled="$route.query.id && !listState"
                    allow-create
                    collapse-tags
                    default-first-option
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in upPowergridTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="脱硫煤标杆电价（元）">
                  <el-select
                    v-model="form.desulfurizationElePrice"
                    allow-create
                    disabled
                    collapse-tags
                    default-first-option
                    placeholder=""
                  >
                    <el-option
                      v-for="item in companyOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备案容量(MW)" prop="filingCapacity">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.filingCapacity"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="并网容量（MW）" prop="accessCapacity">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.accessCapacity"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="初次并网时间" prop="startTime">
                  <el-date-picker
                    v-model="form.startTime"
                    :disabled="$route.query.id && !listState"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="全部并网时间" prop="allTime">
                  <el-date-picker
                    v-model="form.allTime"
                    :disabled="$route.query.id && !listState"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="场地面积（m2）" prop="areaCovered">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.areaCovered"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">补贴信息</div>
              <div class="basice-box" style="margin-left: 0px">
                <table class="basice-table" style="margin-left: 0px">
                  <tr class="table-title">
                    <th style="width: 60px">序号</th>
                    <th style="width: 200px">有无补贴</th>
                    <th>补贴类型</th>
                    <th>补贴电价（元）</th>
                    <th>补贴开始时间</th>
                    <th>补贴结束时间</th>
                    <th>上网电价（元）</th>
                    <th>补贴批次</th>
                  </tr>
                  <tr
                    class="table-content"
                    v-for="(item, index) in form.subsidyList"
                    :key="item.id"
                  >
                    <td>
                      <div style="width: 100%">{{ index + 1 }}</div>
                    </td>
                    <td>
                      <el-radio-group
                        v-model="item.isSubsidy"
                        :disabled="$route.query.id && !listState"
                      >
                        <el-radio :label="1">有</el-radio>
                        <el-radio :label="0">无</el-radio>
                      </el-radio-group>
                    </td>
                    <td>
                      <!-- <div style="width: 100%">{{ item.subsidyType }}</div> -->
                      <div v-if="tariffSubsidiesTypeOptions">
                        {{ tariffSubsidiesTypeOptions[index].dictValue }}
                      </div>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <template
                        v-if="
                          index + 1 !== 1 && !($route.query.id && !listState)
                        "
                      >
                        <el-input
                          v-model="item.priceSubsidy"
                          :disabled="item.isSubsidy === 0"
                          placeholder="请选择"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                        ></el-input>
                      </template>
                      <template v-else>
                        <div
                          v-if="
                            form.desulfurizationElePrice > -1 && index + 1 == 1
                          "
                        >
                          {{
                            item.priceNetwork * 1 -
                            form.desulfurizationElePrice * 1
                          }}
                        </div>
                        <div v-else>
                          {{ item.priceNetwork * 1 }}
                        </div>
                      </template>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <template v-if="!($route.query.id && !listState)">
                        <el-date-picker
                          v-model="item.startTime"
                          :disabled="
                            ($route.query.id && !listState) ||
                            item.isSubsidy === 0
                          "
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        >
                        </el-date-picker>
                      </template>
                      <template v-else>
                        {{ item.startTime }}
                      </template>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <template v-if="!($route.query.id && !listState)">
                        <el-date-picker
                          v-model="item.endTime"
                          type="date"
                          :disabled="item.isSubsidy === 0"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        >
                        </el-date-picker>
                      </template>
                      <template v-else>
                        {{ item.endTime }}
                      </template>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <template
                        v-if="
                          index + 1 == 1 && !($route.query.id && !listState)
                        "
                      >
                        <el-input
                          v-model="item.priceNetwork"
                          placeholder="请选择"
                          :disabled="item.isSubsidy === 0"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                        ></el-input>
                      </template>
                      <template v-else>
                        {{ item.priceNetwork }}
                      </template>
                    </td>
                    <td style="width: 200px; padding: 0">
                      <template
                        v-if="
                          index + 1 == 1 && !($route.query.id && !listState)
                        "
                        ><el-input
                          v-model="item.numberSubsidy"
                          :disabled="item.isSubsidy === 0"
                          placeholder="请选择"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                        ></el-input
                      ></template>
                      <template v-else>
                        {{ item.numberSubsidy }}
                      </template>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="title-text">其他信息</div>
              <div class="basice-box">
                <el-form-item label="排序号" prop="sort">
                  <el-input
                    v-model="form.sort"
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9]/g,'')"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="isEffective">
                  <el-radio-group
                    v-model="form.isEffective"
                    :disabled="$route.query.id && !listState"
                  >
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="修改人"
                  prop="updateByUserName"
                  :disabled="$route.query.id && !listState"
                >
                  <el-input v-model="form.updateByUserName" disabled></el-input>
                </el-form-item>
                <el-form-item
                  label="修改时间"
                  prop="updateTime"
                  :disabled="$route.query.id && !listState"
                >
                  <el-input v-model="form.updateTime" disabled></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="选择所属子期"
      :visible.sync="focusMainDialogVisible"
      append-to-body
      class="focus-main-dialog"
      width="60%"
    >
      <div class="dialog-content">
        <div class="content-title">
          <el-form
            ref="dialogform"
            :model="dialogform"
            label-width="130px"
            style="display: flex"
          >
            <el-form-item label="子期名称：">
              <el-select
                v-model="dialogform.companyList"
                multiple
                filterable
                allow-create
                collapse-tags
                clearable
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.dictKey"
                  :label="item.dictValue"
                  :value="item.dictKey"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子期编码">
              <el-input
                v-model="dialogform.subStationCode"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="子期负责人：">
              <el-input
                placeholder="请输入"
                v-model="dialogform.subStationPersonName"
              ></el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchData"
              >查询</el-button
            >
          </div>
        </div>
        <div class="content-table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="" width="38" align="center">
              <template slot-scope="scope">
                <el-radio
                  v-model="currentRowId"
                  :label="scope.row.id"
                  @change="changeRedio($event, scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              width="50"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="subStationName"
              label="子期名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationCode"
              label="子期编码"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="subStationPersonName"
              label="负责人"
              show-overflow-tooltip
              align="center"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="focusMainDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="principalAdd">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tree from "@/components/organization/tree";
import { getLazyTree } from "@/api/base/region";
import {
  addStage,
  editStage,
  removeStage,
  queryStageDetail,
} from "@/api/organization/staging";
import { querySubStationList } from "@/api/organization/substation";
export default {
  name: "operationStaging",
  data() {
    return {
      listState: false,
      form: {
        subStationName: "",
        runState: 1,
        bigDataAccess: 1,
        isEffective: 1,
        subStationId: "",
        subsidyList: [
          //次分期补贴
          {
            id: "", //次分期补贴id
            subStationId: "", //子期id
            stageId: "", //次分期id
            isSubsidy: 0, //有无补贴 1：有 0：无
            subsidyType: "1", //补贴类型(数据字典)
            priceSubsidy: 0, //补贴电价(元)
            priceNetwork: 0, //上网电价（元)
            startTime: "", //初次并网时间
            endTime: "", //全部并网时间
            numberSubsidy: "", //补贴批次
            createBy: null,
            createTime: "",
            updateBy: null,
            updateTime: "",
          },
          {
            id: "", //次分期补贴id
            subStationId: "", //子期id
            stageId: "", //次分期id
            isSubsidy: 0, //有无补贴 1：有 0：无
            subsidyType: "2", //补贴类型(数据字典)
            priceSubsidy: 0, //补贴电价(元)
            priceNetwork: "", //上网电价（元)
            startTime: "", //初次并网时间
            endTime: "", //全部并网时间
            numberSubsidy: "", //补贴批次
            createBy: null,
            createTime: "",
            updateBy: null,
            updateTime: "",
          },
          {
            id: "", //次分期补贴id
            subStationId: "", //子期id
            stageId: "", //次分期id
            isSubsidy: 0, //有无补贴 1：有 0：无
            subsidyType: "3", //补贴类型(数据字典)
            priceSubsidy: 0, //补贴电价(元)
            priceNetwork: "", //上网电价（元)
            startTime: "", //初次并网时间
            endTime: "", //全部并网时间
            numberSubsidy: "", //补贴批次
            createBy: null,
            createTime: "",
            updateBy: null,
            updateTime: "",
          },
        ],
      },
      rules: {
        subStationCode: [
          { required: true, message: "请输入子期编码", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
        stageName: [
          { required: true, message: "请输入次分期名称", trigger: "blur" },
        ],
        accessType: [
          { required: true, message: "请输入上网方式", trigger: "change" },
        ],
        filingCapacity: [
          { required: true, message: "请输入备案容量(MW)", trigger: "blur" },
        ],
        accessCapacity: [
          { required: true, message: "请输入并网容量（MW）", trigger: "blur" },
        ],
        areaCovered: [
          { required: true, message: "请输入场地面积（m2）", trigger: "blur" },
        ],
        subStationName: [
          {
            required: true,
            message: "请输入子期名称",
            trigger: ["blur", "change"],
          },
        ],
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      focusMainDialogVisible: false,
      // focusMainDialogVisible2: false,
      principaNum: "",
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          getLazyTree(node.level == 0 ? "00" : node.value).then((res) => {
            const nodes = res.data.data.map((item) => ({
              value: item.id,
              label: item.title,
              leaf: !item.hasChildren,
            }));
            resolve(nodes);
          });
        },
      },
      tableData: [],
      changeRediod: {},
      dialogform: {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      currentRowId: "",
      companyOptions: JSON.parse(window.localStorage.getItem("companyOptions")),
      upPowergridTypeOptions: JSON.parse(
        window.localStorage.getItem("upPowergridTypeOptions")
      ),
      tariffSubsidiesTypeOptions: JSON.parse(
        window.localStorage.getItem("tariffSubsidiesTypeOptions")
      ),
      pageNum: 1,
      pageSize: 10,
    };
  },
  components: { Tree },

  mounted() {
    if (this.$route.query.id) this.getQueryStageDetail();
  },
  methods: {
    // 新建、提交
    compile() {
      if (this.$route.query.id) {
        if (this.listState) {
          console.log("点击提交");
          this.formValidate("add");
        } else {
          console.log("点击编辑");
          this.listState = !this.listState;
        }
      } else {
        console.log("新增");
        this.formValidate("new");
      }
    },
    formValidate(data) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (data == "new") {
            addStage(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({ name: "次分期", params: { refresh: true } });
            });
          } else {
            this.form.stageId = this.$route.query.id;
            editStage(this.form).then(() => {
              this.$router.$avueRouter.closeTag();
              this.$router.push({ name: "次分期", params: { refresh: true } });
              this.listState = !this.listState;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //子期弹窗
    focusMainStation(num) {
      this.principaNum = num;
      this.tableData = [];
      this.dialogform = [];
      if (this.principaNum == 0) {
        this.focusMainDialogVisible = true;
        this.$refs.mainStation0.blur();
        this.getQuerySubStationList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
      }
    },
    getQuerySubStationList(data) {
      console.log(data);
      querySubStationList(data).then((res) => {
        console.log(res.data.data);
        this.tableData = res.data.data.pageData;
        this.pageNum = res.data.data.pageNum;
        this.pageSize = res.data.data.pageSize;
        this.total = res.data.data.total;
      });
    },
    // 查询
    searchData() {
      this.getQuerySubStationList({
        companyList: this.dialogform.companyList,
        subStationCode: this.dialogform.subStationCode,
        subStationPersonName: this.dialogform.subStationPersonName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    selectData(data) {
      console.log("addData", data);
      this.addData = data;
    },
    // 表格单选
    changeRedio(event, row) {
      console.log("row", row);
      this.changeRediod = row;
    },
    // 删除
    deletes() {
      this.$confirm("操作无法撤回，确定要删除吗?").then(() => {
        removeStage({ stageIdList: [this.$route.query.id] }).then(() => {
          this.$router.$avueRouter.closeTag();
          this.$router.push({ name: "次分期", params: { refresh: true } });
        });
      });
    },
    // 添加
    principalAdd() {
      this.focusMainDialogVisible = false;
      this.form.desulfurizationElePrice = this.changeRediod.desulfurizationElePrice;
      this.form.subStationName = this.changeRediod.subStationName;
      this.form.subStationId = this.changeRediod.id;
    },
    // 次分期详情
    getQueryStageDetail() {
      queryStageDetail({ stageId: this.$route.query.id }).then((res) => {
        this.form = res.data.data;
      });
    },
    // 翻页事件
    handlePageChange(pageNum) {
      this.pageNum = pageNum;
      this.searchData();
    },
    // 序号列
    indexMethod(index) {
      return index + this.pageNum * this.pageSize - 9;
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchData();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-upload-list__item {
  transition: none !important;
}
table {
  border-collapse: collapse;
  border-spacing: 0px;
  margin-left: 20px;
  th {
    text-align: right;
  }
}

.focus-main-dialog {
  .dialog-content {
    .content-title {
      display: flex;
      /deep/.el-button--medium {
        padding: 13px 20px;
        margin-left: 30px;
      }
      /deep/.el-tag.el-tag--info {
        max-width: 120px;
        overflow: hidden;
        position: relative;
        .el-select__tags-text {
          max-width: 90px;
          display: inline-block;
          overflow: hidden;
        }
        .el-tag__close {
          position: relative;
          top: -7px;
          right: 0;
        }
      }
    }
    .content-table {
      /deep/.el-table {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th {
                background-color: #fafafa;
                color: #333;
              }
            }
          }
        }
      }
    }
  }
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.add-dialog {
  .add-content {
    .add-title {
      margin-left: 20px;
      display: flex;
      .sertch-condition {
        margin-right: 20px;
      }
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }
  }
  /deep/ .el-dialog {
    width: 58%;
    .el-dialog__title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      word-wrap: break-word;
    }
    .el-dialog__body {
      .el-table--border {
        .el-table__header-wrapper {
          .el-table__header {
            .has-gutter {
              th,
              tr {
                background-color: #fafafa;
                color: #333;
              }
            }
          }
        }
      }
    }
  }
}
.operation-staging {
  .details-title {
    width: 100%;
    .right {
      display: flex;
      justify-content: flex-end;
    }
  }
  .main {
    margin: 10px 0;
    color: #606266;
    .basics {
      .content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-top: 1px solid #b3d8ff;
        border-bottom: 1px solid #b3d8ff;
        padding-top: 20px;
        padding-bottom: 20px;
        // .upload-box {
        //   width: 87%;
        // }
        .title {
          width: 100%;
          text-align: left;
          padding: 10px 16px 26px;
          font-size: 20px;
          font-weight: bold;
        }
        .basice-box {
          display: flex;
          flex-wrap: wrap;
          margin-left: 20px;
          /deep/.el-form-item {
            display: flex;
            width: 33%;
            .el-form-item__label {
              padding: 10px;
              text-align: right;
              font-size: 14px;
              color: #606266;
              line-height: 40px;
              padding: 0 12px 0 0;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              width: 150px;
              display: block;
              font-weight: bold;
            }
            .el-form-item__content {
              margin: 0 !important;
              margin-left: 10px !important;
              width: calc(100% - 183.41px);
              .el-cascader {
                width: 100%;
              }
              .el-select {
                width: 100%;
              }
              .el-date-editor {
                width: 100%;
              }
              .el-textarea {
                width: 344.91 * 2.5+10px;
              }
            }
          }
          .location {
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
              color: #409eff;
              font-size: 21px;
              margin-left: 5px;
            }
            .el-form-item {
              width: 100%;
            }
          }
        }
      }
    }
    .sublevel {
      margin-top: -1px;
      .content {
        border-bottom: 1px solid #b3d8ff;
        .title-text {
          width: 100%;
          text-align: left;
          padding: 10px 16px 26px;
          font-size: 20px;
          font-weight: bold;
        }
        .basice-box {
          display: flex;
          flex-wrap: wrap;
          margin-left: 20px;
          /deep/.el-form-item {
            display: flex;
            width: 33%;
            .el-form-item__label {
              padding: 10px;
              text-align: right;
              font-size: 14px;
              color: #606266;
              line-height: 40px;
              padding: 0 12px 0 0;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              width: 150px;
              display: block;
              font-weight: bold;
            }
            .el-form-item__content {
              margin: 0 !important;
              margin-left: 10px !important;
              width: calc(100% - 183.41px);
              .el-cascader {
                width: 100%;
              }
              .el-select {
                width: 100%;
              }
              .el-textarea {
                width: 344.91 * 2.5+10px;
                margin-left: -10px;
              }
            }
          }
          .basice-table {
            width: 100%;
            margin-bottom: 30px;
            .table-title {
              background-color: #fafafa;
              th {
                text-align: center;
                border: 1px solid #ebeef5;
                border-radius: 5px;
                padding: 12px 0;
                min-width: 0;
                padding-right: 10px;
                padding-left: 10px;
                font-size: 14px;
                color: #909399;
              }
            }
            .table-content {
              td {
                text-align: center;
                border: 1px solid #ebeef5;
                padding: 12px 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                font-size: 14px;
                color: #606266;
                /deep/.el-input__inner {
                  // border: 1px solid transparent;
                }
              }
            }
          }
        }
      }
      /deep/.el-table th,
      .el-table tr {
        background-color: #fafafa;
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
  }
}
</style>
