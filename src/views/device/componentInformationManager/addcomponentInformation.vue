<template>
  <div class="operation-staging">
    <el-card class="box-card">
      <div class="details-title">
        <div class="right">
          <el-button
            type="primary"
            size="small"
            plain
            v-if="$route.query.id"
            icon="el-icon-document-checked"
            >位置维护
          </el-button>
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
                <el-form-item label="组件厂家" prop="manufactor">
                  <el-select
                    v-model="form.manufactor"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in panelFactoryOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="组件型号" prop="componentModel">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.componentModel"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="功率" prop="power">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.power"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="组件分类" prop="componentType">
                  <el-select
                    v-model="form.componentType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in componentTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="封装形式" prop="packageType">
                  <el-select
                    v-model="form.packageType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in packageTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发电形式" prop="powerType">
                  <el-select
                    v-model="form.powerType"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in powerTypeOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="长(m)" prop="length">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.length"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="宽(m)" prop="width">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.width"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="组件材料" prop="componentMaterials">
                  <el-select
                    v-model="form.componentMaterials"
                    filterable
                    allow-create
                    collapse-tags
                    clearable
                    default-first-option
                  >
                    <el-option
                      v-for="item in componentMaterialsOptions"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="最大电压(v)" prop="maxVoltage">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.maxVoltage"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="工作温度(°C)" prop="temperature">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.temperature"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最大风载/最大雪载(pa)" prop="maxLoad">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.maxLoad"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="最大保险丝额定电流(A)"
                  prop="maxElectricCurrent"
                >
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.maxElectricCurrent"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="额定电池工作温度(℃)"
                  prop="batteryTemperature"
                >
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    :disabled="$route.query.id && !listState"
                    v-model="form.batteryTemperature"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="最大功率Pmp温度系数" prop="pmpCoefficient">
                  <el-input
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    :disabled="$route.query.id && !listState"
                    v-model="form.pmpCoefficient"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="开路电压Voc温度系数" prop="vocCoefficient">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.vocCoefficient"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="短路电流Isc温度系数" prop="iscCoefficient">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.iscCoefficient"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电池片规格" prop="batterySpecification">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    v-model="form.batterySpecification"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item label="组件电池片数量" prop="batterySize">
                  <el-input
                    :disabled="$route.query.id && !listState"
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    v-model="form.batterySize"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item label="附件" prop="imgList">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :file-list="form.imgList"
                  :on-change="handleChange"
                >
                  <!-- :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                      :on-preview="handlePreview" -->
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      style="height: 146px"
                      alt=""
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </div>
          <div class="sublevel">
            <div class="content">
              <div class="basice-box" style="margin-left: 0px">
                <table class="basice-table" style="margin-left: 0px">
                  <tr class="table-title">
                    <th style="width: 200px">电学参数</th>
                    <th>辐射强度（W/m²）</th>
                    <th>最大功率Pmp(W)</th>
                    <th>最大功率点工作电压Vmp(V)</th>
                    <th>最大功率点工作电流Imp(A)</th>
                    <th>开路电压Voc(V)</th>
                    <th>短路电流Isc(A)</th>
                    <th>组件效率(%)</th>
                  </tr>
                  <tr
                    class="table-content"
                    v-for="item in form.componentParamList"
                    :key="item.id"
                  >
                    <td>
                      <template>
                        {{ item.paramName }}
                      </template>
                    </td>
                    <td>
                      <el-input
                        v-model="item.radiation"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        v-model="item.maxPmp"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.maxVmp"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.maxImp"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.voc"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 220px; padding: 0">
                      <el-input
                        v-model="item.isc"
                        placeholder="请输入"
                      ></el-input>
                    </td>
                    <td style="width: 200px; padding: 0">
                      <el-input
                        v-model="item.efficiency"
                        placeholder="请输入"
                      ></el-input>
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
                    oninput="value=value.replace(/[^0-9.]/g,'').replace(/^\./g, '').replace('.', 'dollar#dollar').replace(/\./g, '').replace('dollar#dollar', '.');"
                    :disabled="$route.query.id && !listState"
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
    <!-- 预览图片弹窗 -->
    <el-dialog :visible.sync="imgDialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { imgUpload } from "@/api/upload/upload";
import lrz from "lrz";
import { addComponentTemplate } from "@/api/device/componentInformation";
import { querySubStationDropDownList } from "@/api/organization/substation";
export default {
  name: "addcomponentInformation",
  data() {
    return {
      componentMaterialsOptions: JSON.parse(
        window.localStorage.getItem("componentMaterialsOptions")
      ),
      componentTypeOptions: JSON.parse(
        window.localStorage.getItem("componentTypeOptions")
      ),
      powerTypeOptions: JSON.parse(
        window.localStorage.getItem("powerTypeOptions")
      ),
      packageTypeOptions: JSON.parse(
        window.localStorage.getItem("packageTypeOptions")
      ),
      panelFactoryOptions: JSON.parse(
        window.localStorage.getItem("panelFactoryOptions")
      ),
      dialogImageUrl: "",
      imgDialogVisible: false,
      listState: false,
      form: {
        imgList: [],
        isEffective: 1,
        componentParamList: [
          {
            id: "0",
            paramName: "STC", //电学参数
            radiation: "", //辐射强度（W/m²）
            maxPmp: "", //最大功率Pmp(W)
            maxVmp: "", //最大功率点工作电压Vmp(V)
            maxImp: "", //最大功率点工作电流Imp(A)
            voc: "", //开路电压Voc(V)
            isc: "", //短路电流Isc(A)
            efficiency: "", //组件效率(%)
          },
          {
            id: "0",
            paramName: "NOTC", //电学参数
            radiation: "", //辐射强度（W/m²）
            maxPmp: "", //最大功率Pmp(W)
            maxVmp: "", //最大功率点工作电压Vmp(V)
            maxImp: "", //最大功率点工作电流Imp(A)
            voc: "", //开路电压Voc(V)
            isc: "", //短路电流Isc(A)
            efficiency: "", //组件效率(%)
          },
        ],
      },

      options: [],
      tableData: [],
      dialogform: {
        companyList: "",
        subStationPersonName: "",
        subStationCode: "",
      },
      rules: {
        manufactor: [
          {
            required: true,
            message: "请输入组件厂家",
            trigger: ["blur", "change"],
          },
        ],
        componentModel: [
          { required: true, message: "请输入组件型号", trigger: "blur" },
        ],
        power: [{ required: true, message: "请输入功率", trigger: "blur" }],
        componentType: [
          { required: true, message: "请选择组件分类", trigger: "change" },
        ],
        packageType: [
          { required: true, message: "请选择封装形式", trigger: "change" },
        ],
        powerType: [
          { required: true, message: "请选择发电形式", trigger: "change" },
        ],
        length: [{ required: true, message: "请输入长度", trigger: "blur" }],
        width: [{ required: true, message: "请输入宽度", trigger: "blur" }],
        componentMaterials: [
          { required: true, message: "请选择组件材料", trigger: "change" },
        ],
      },
      currentRowId: "",
    };
  },
  watch: {
    $route() {
      this.listState = false;
    },
  },
  mounted() {
    querySubStationDropDownList({ keyWord: "" }).then((res) => {
      this.options = res.data.data;
    });
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
            addComponentTemplate(this.form).then((res) => {
              if (res.data.code == "200") {
                this.$router.push({ path: "./componentInformation" });
                this.$message({
                  message: "新增成功!",
                  type: "success",
                });
              } else {
                this.$message.error("新增失败");
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleChange(file, fileList) {
      console.log("handleChange", file, fileList);
      this.btnshow = true;
      lrz(file.raw)
        .then((file) => {
          imgUpload(file.origin).then((res) => {
            res.data.data.url = this.imgUrl + res.data.data.fileId;
            res.data.data.status = "success";
            res.data.data.uid = fileList[fileList.length - 1].uid;
            fileList[fileList.length - 1] = res.data.data;
            this.form.imgList = fileList;
            this.btnshow = false;
          });
        })
        .catch(function (err) {
          // 处理失败会执行
        });
    },
    // 图片删除
    handleRemove(file) {
      const i = this.form.imgList.findIndex((x) => {
        return x.uid === file.uid;
      });
      if (i > -1) this.form.imgList.splice(i, 1);
    },
    // 图片预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
  },
};
</script>

<style lang='scss' scoped>
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