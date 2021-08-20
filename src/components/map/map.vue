<template>
  <div
    :style="{
      position: 'relative',
      height: `calc(${height})`,
      overflow: 'hidden auto',
    }"
  >
    <div class="left">
      <el-select
        v-model="hierarchy"
        placeholder="地图层级"
        @change="hierarchyChange"
        filterable
        style="width: 110px; margin-right: 5px"
      >
        <el-option
          v-for="item in hierarchyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="coverage"
        placeholder="图层选择"
        @change="coverageChange"
        style="width: 110px"
      >
        <el-option
          v-for="item in coverageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="right">
      <div v-if="plantArea">
        <template v-if="!compileShow && plantArea">
          <el-button type="primary" size="small" plain @click="rollback"
            >清除上一个
          </el-button>
          <el-button type="primary" size="small" plain @click="empty"
            >清空
          </el-button>
        </template>
        <el-button
          type="primary"
          size="small"
          plain
          icon="el-icon-document-delete"
          @click="compile"
          >{{ !compileShow ? "提交" : "编辑" }}
        </el-button>
      </div>
      <div v-if="positionPreview">
        <el-select
          v-model="form.mainStationIdList"
          filterable
          allow-create
          collapse-tags
          clearable
          default-first-option
          placeholder="请选择组织电站"
          style="width: 150px; margin-right: 5px"
          @change="selectChange"
          @clear="clear"
        >
          <el-option
            v-for="item in mainStationOptions"
            :key="item.id"
            :label="item.mainStationName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <my-select
          v-model="form.groupTypeList"
          :options="EquipmentOptions"
          ref="selectRef"
          :disabled="!form.mainStationIdList"
          @change="groupChange"
          @input="handleInput"
          :optionProp="{ value: 'id', label: 'groupName' }"
        />
        <el-input
          v-model="form.range"
          placeholder="请输入缩放范围"
          @focus="groupChange"
          @keyup.enter.native="groupChange"
          style="width: 130px"
        ></el-input>
      </div>
    </div>
    <div id="map" class="map"></div>
  </div>
</template>
<script>
import maps from "@/util/map";
import { queryMainStationDropDownList } from "@/api/organization/allStation";
import {
  queryAllMainStationMapPosition,
  getCurrentMainStationMapPosition,
  queryEquipmentByGroup,
  queryEquipmentDetail,
} from "@/api/map/map";
import mySelect from "@/components/select/select.vue";
import { queryEquipmentGroupList } from "@/api/device/equipmentGroup";
export default {
  name: "Map",
  components: { mySelect },
  props: {
    height: {
      type: String,
      default: () => {
        return "87.5vh";
      },
    },
    latlng: {
      type: Object,
    },
    // 选点
    setpoint: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 区域
    plantArea: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 设备位置
    positionPreview: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    // 区域坐标
    fencePointList: {
      type: Object,
    },
  },
  data() {
    return {
      google_street: "", //电子地图
      google_satellite: "", //卫星地图
      myIcon: "", //在线的点位图标
      myIconGray: "", //离线的点位图标
      fitBounds: "", //视野范围
      interval: "",
      markers: [],
      selectedDeptId: 0,
      selectedFdName: 0,
      selectedFdNo: 0,
      map: "",
      latlngOld: {},
      compileShow: true,
      overlay: {},
      markerGroup: "",
      coverage: "2",
      hierarchy: "4",
      coverageOptions: [
        { label: "电子地图", value: "1" },
        { label: "卫星地图", value: "2" },
      ],
      // { label: "自定义图层", value: "3" },
      hierarchyOptions: [
        { label: "0级", value: "0" },
        { label: "1级", value: "1" },
        { label: "2级", value: "2" },
        { label: "3级", value: "3" },
        { label: "4级", value: "4" },
        { label: "5级", value: "5" },
        { label: "6级", value: "6" },
        { label: "7级", value: "7" },
        { label: "8级", value: "8" },
        { label: "9级", value: "9" },
        { label: "10级", value: "10" },
        { label: "11级", value: "11" },
        { label: "12级", value: "12" },
        { label: "13级", value: "13" },
        { label: "14级", value: "14" },
        { label: "15级", value: "15" },
        { label: "16级", value: "16" },
        { label: "17级", value: "17" },
        { label: "18级", value: "18" },
        { label: "19级", value: "19" },
        { label: "20级", value: "20" },
        { label: "21级", value: "21" },
      ],
      bm: "",
      // markersList: [],
      form: {
        mainStationIdList: "",
        groupTypeList: [],
        range: "1000", //缩放范围
      },
      mainStationOptions: [],
      EquipmentOptions: [],
      allMainStation: [],
      equipmentLocation: [],
    };
  },
  mounted() {
    maps.then(() => {
      console.log(window.BM);
      let BM = window.BM;
      BM.Config.HTTPS_URL = BM.Config.HTTP_URL =
        "https://mapapi.xinyiglass.com:3000";
      this.map = BM.map("map", "bigemap.googlemap-satellite", {
        center: [30, 104],
        zoom: 4,
        zoomControl: true,
      });
      this.google_street = BM.tileLayer("bigemap.googlemap-streets");
      this.google_satellite = BM.tileLayer("bigemap.googlemap-satellite");
      // this.myIcon = window.BM.divIcon({
      //   className: "my-div-icon",
      //   html: '<div><span class="pulse-icon"></span></div>',
      // }); //在线的点位图标
      // this.myIconGray = window.BM.divIcon({
      //   className: "my-div-icon",
      //   html: '<div><span class="pulse-icon-gray"></span></div>',
      // }); //离线的点位图标
      this.map.on("zoomend", () => {
        this.hierarchy = this.map.getZoom() + "";
      });
      // 选点
      if (this.setpoint) {
        console.log("选点", this.latlng);
        if (this.latlng.lat !== "" && this.latlng.lng !== "") {
          this.marker = BM.marker(this.latlng).addTo(this.map);
          this.mapSetView(this.latlng);
          this.coordinates = this.latlng;
        }
        this.mapClick();
      }
      // 电站区域
      if (this.plantArea) {
        console.log("电站区域");
        this.fencePointList = [
          [
            { lat: 20.280196656341005, lng: 101.70201860368253 },
            { lat: 21.17443221616588, lng: 102.44943223893644 },
            { lat: 21.612013574947458, lng: 105.5988347902894 },
            { lat: 20.606585065678747, lng: 105.95238883048297 },
            { lat: 29.78231117982432, lng: 105.75116749852897 },
            { lat: 29.212533460366416, lng: 104.35137156397104 },
            { lat: 28.97377253153283, lng: 102.9155958071351 },
            { lat: 29.17605844636225, lng: 101.755267996341 },
          ],
          [
            { lat: 31.280196656341005, lng: 101.70201860368253 },
            { lat: 32.17443221616588, lng: 102.44943223893644 },
            { lat: 32.612013574947458, lng: 105.5988347902894 },
            { lat: 31.606585065678747, lng: 105.95238883048297 },
            { lat: 30.78231117982432, lng: 105.75116749852897 },
            { lat: 30.212533460366416, lng: 104.35137156397104 },
            { lat: 29.97377253153283, lng: 102.9155958071351 },
            { lat: 30.17605844636225, lng: 101.755267996341 },
          ],
        ];
        console.log(this.fencePointList);
        // this.fencePointList.forEach(() => {
        this.overlay = new BM.Polygon(this.fencePointList).addTo(this.map);
        if (this.fencePointList.length > 0)
          this.map.fitBounds(this.overlay.getBounds());
        // });
        this.fenceClick();
      }
      // 设备位置预览
      if (this.positionPreview) {
        console.log("设备位置");
        queryMainStationDropDownList({ keyWord: "" }).then((res) => {
          this.mainStationOptions = res.data.data;
        });
        queryEquipmentGroupList({ keyWord: "" }).then((res) => {
          this.EquipmentOptions = res.data.data;
          this.EquipmentOptions.push({
            id: "-1",
            groupName: "其他",
          });
        });
        this.getCurrent();
      }
    });
  },
  methods: {
    //选点
    mapClick() {
      this.map.on("click", (e) => {
        console.log("点击");
        if (this.marker) this.marker.remove();
        this.marker = window.BM.marker(e.latlng).addTo(this.map);
        this.mapSetView(e.latlng);
        this.coordinates = e.latlng;
      });
    },
    // 定位级别
    mapSetView(latlng, zoom) {
      this.map.setView([latlng.lat, latlng.lng], zoom);
    },
    // 围栏
    compile() {
      let BM = window.BM;
      this.compileShow = !this.compileShow;
      if (!this.compileShow) {
        console.log("编辑", this.overlay, this.overlay._latlngs);
        // this.overlay.remove();
        // this.overlay = new BM.Polyline(this.fencePointList).addTo(this.map);
      } else {
        console.log("提交");
        this.overlay.remove();
        this.overlay = new BM.Polygon(this.fencePointList).addTo(this.map);
        this.$emit("fenceSubmit", this.fencePointList);
      }
    },
    // 围栏退回
    rollback() {
      if (this.fencePointList.length == 0) return;
      let BM = window.BM;
      this.fencePointList.pop();
      this.overlay.remove();
      this.overlay = new BM.Polyline(this.fencePointList).addTo(this.map);
    },
    // 围栏清空
    empty() {
      let BM = window.BM;
      this.fencePointList = [];
      this.overlay.remove();
      this.overlay = new BM.Polyline(this.fencePointList).addTo(this.map);
    },
    // 围栏点击
    fenceClick() {
      this.map.on("click", (e) => {
        console.log(e);
        if (!this.compileShow && this.plantArea) {
          let BM = window.BM;
          this.fencePointList.push(e.latlng);
          this.overlay.remove();
          this.overlay = new BM.Polyline(this.fencePointList).addTo(this.map);
        } else {
          // var p = this.map.project([e.latlng.lat, e.latlng.lng]);
          // var ps = this.fencePointList.map((v) => {
          //   return [this.map.project(v).x, this.map.project(v).y];
          // });
          // if (this.isIn([p.x, p.y], ps)) {
          //   alert("在内部");
          // } else {
          //   alert("在外部");
          // }
        }
      });
    },
    // 内外判断
    isIn(a, b, c) {
      var d = a[0];
      a = a[1];
      var e = !1,
        f,
        h,
        k,
        l,
        m = b.length,
        n = 0;
      for (l = m - 1; n < m; l = n, n += 1) {
        var p = !1;
        f = b[n][0];
        h = b[n][1];
        k = b[l][0];
        l = b[l][1];
        if ((f === d && h === a) || (k === d && l === a)) return c ? !0 : !1;
        if (h < a === l >= a) {
          f = ((k - f) * (a - h)) / (l - h) + f;
          if (d === f) return c ? !0 : !1;
          p = d < f;
        }
        p && (e = !e);
      }
      return e;
    },
    // 切换图层
    coverageChange(value) {
      if (value == 1) {
        this.google_street.addTo(this.map);
        this.google_satellite.remove(this.map);
      }
      if (value == 2) {
        this.google_satellite.addTo(this.map);
        this.google_street.remove(this.map);
      }
    },
    // 改变层级
    hierarchyChange(value) {
      this.map.setZoom(value);
    },
    // 获取主站点位
    getqueryAllMainStationMapPosition(mainStationList) {
      queryAllMainStationMapPosition({ mainStationList }).then((res) => {
        console.log(res.data.data);
        this.allMainStation = res.data.data;
        if (res.data.code == 200) {
          res.data.data.forEach((item) => {
            console.log(item);
            this.bm = new window.BM.marker({
              lat: item.latitude,
              lng: item.longitude,
            });
            this.bm.bindTooltip(item["mainStationName"], {
              permanent: true,
              direction: "top",
            });

            // this.markersList.push(this.bm);
            this.markers.addLayer(this.bm);
            this.mapSetView(
              {
                lat: item.latitude,
                lng: item.longitude,
              },
              15
            );
          });
        } else {
          alert(res.data.msg);
        }
      });
    },
    // //对聚合的实例点击事件
    // clusterClick() {
    //   this.markers.on("clusterclick", (a) => {
    //     console.log(a);
    //   });
    // },

    // 新建聚合图层
    createStation() {
      this.markers = new window.BM.MarkerClusterGroup({
        showCoverageOnHover: false, //不显示边框
        zoomToBoundsOnClick: true, //点击放大
        removeOutsideVisibleBounds: true, //只显示当前窗口内的内容,
      });
      this.map.addLayer(this.markers);
    },

    // 主站位置
    getCurrent() {
      if (!this.markers) this.markers.remove();
      this.createStation();
      this.markersClick();
      this.map.addLayer(this.markers);
      getCurrentMainStationMapPosition({}).then((res) => {
        console.log(res.data.data);
        this.allMainStation = res.data.data;
        this.form.mainStationIdList = res.data.data.mainStationId;
        if (res.data.code == 200) {
          this.bm = new window.BM.marker({
            lat: res.data.data.latitude,
            lng: res.data.data.longitude,
          });
          this.bm.bindTooltip(res.data.data["mainStationName"], {
            permanent: true,
            direction: "top",
          });
          // this.markersList.push(this.bm);
          this.markers.addLayer(this.bm);
          this.mapSetView(
            {
              lat: res.data.data.latitude,
              lng: res.data.data.longitude,
            },
            15
          );
        } else {
          alert(res.data.msg);
          this.getqueryAllMainStationMapPosition([]);
        }
      });
    },

    // 分组位置
    groupChange() {
      // console.log(this.form.mainStationIdList);
      // console.log(this.form.groupTypeList);
      // console.log(this.form.groupTypeList.includes("-1"));
      if (this.form.groupTypeList.length == 0) return this.markers.remove();
      queryEquipmentByGroup({
        mainStationIds: [this.form.mainStationIdList],
        groupIds: this.form.groupTypeList,
        includeNoGroupPosition: this.form.groupTypeList.includes("-1") ? 1 : 0,
        range: this.form.range,
      }).then((res) => {
        console.log(res.data.data);
        this.markers.remove();
        this.createStation();
        // this.equipmentClick();
        this.map.addLayer(this.markers);
        this.equipmentLocation = res.data.data;
        if (res.data.code == 200) {
          if (!res.data.data) return;
          res.data.data.forEach((item) => {
            // console.log(item);
            this.bm = new window.BM.marker(
              {
                lat: item.latitude,
                lng: item.longitude,
              },
              item
              // {
              //   icon: window.BM.icon({
              //     iconUrl: '/img/bg/img-logo.png',
              //   }),
              // }
            );
            if (item.rangePositionList) {
              let arr = [];
              arr.push(item.positionId);
              item.rangePositionList.forEach((data) => {
                console.log(data.positionId);
                arr.push(data.positionId);
              });
              item.positionId = arr;
              this.addDialog(this.bm, item);
              console.log("多个", item.positionId);
            } else {
              item.positionId = [item.positionId];
              this.addDialog(this.bm, item);
              console.log("单个", item.positionId);
            }
            this.mapSetView(
              {
                lat: item.latitude,
                lng: item.longitude,
              },
              8
            );
          });
        } else {
          alert(res.data.msg);
        }
      });
    },
    //对标注点击事件
    markersClick() {
      this.markers.on("click", (a) => {
        console.log("markersClick", a);
        this.mapSetView(a.latlng, 12);
      });
    },
    // 设备类型标注点击
    // equipmentClick() {
    //   this.markers.on("click", (a) => {
    //     console.log(document.getElementsByClassName("tip_div"));
    //     this.mapSetView(a.latlng);
    //     setTimeout(() => {
    //       console.log(document.getElementsByClassName("tip_div"));
    //       if (document.getElementsByClassName("tip_div").length == 0) return;
    //       let id = document.getElementsByClassName("tip_div")[0].id;
    //       console.log(id);
    //       console.log(this.bm);
    //       // let positionId = id.split(",");
    //       queryEquipmentDetail({
    //         positionId: id,
    //       }).then((res) => {
    //         let item = res.data.data;
    //         console.log(item);
    //         this.bm.options = item;
    //         this.bm.bindPopup(`
    //           <div class="tip_div" id="${item.positionId}">
    //             <div class="popup_div">
    //               <table>
    //                 <tr>
    //                   <th >设备名称：</th>
    //                   <td>${item.positionName ? item.positionName : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >设备编号：</th>
    //                   <td>${item.positionCode ? item.positionCode : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >BTF：</th>
    //                   <td>${item.manufactor ? item.manufactor : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >IP：</th>
    //                   <td>${item.manufactor ? item.manufactor : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >LPI：</th>
    //                   <td>${item.manufactor ? item.manufactor : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >BSRM：</th>
    //                   <td>${item.manufactor ? item.manufactor : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >JB：</th>
    //                   <td>${item.manufactor ? item.manufactor : ""}</td>
    //                 </tr>
    //                 <tr>
    //                   <th >设备品牌：</th>
    //                   <td>${item.manufactor ? item.manufactor : ""}</td>
    //                 </tr>
    //               </table>
    //             </div>
    //           </div>
    //         `);
    //         this.markers.addLayer(this.bm);
    //       });
    //     }, 300);
    //   });
    // },
    // 分组位置添加弹窗
    addDialog(bm, item) {
      console.log(item.positionId);
      queryEquipmentDetail({
        positionId: item.positionId.toString(),
      }).then((res) => {
        let item = res.data.data;
        console.log(item);
        bm.bindPopup(`
          <div class="tip_div" id="${item.positionId}">
            <div class="popup_div">
              <table>
                <tr>
                  <th >设备名称：</th>
                  <td>${item.positionName ? item.positionName : ""}</td>
                </tr>
                <tr>
                  <th >设备编号：</th>
                  <td>${item.positionCode ? item.positionCode : ""}</td>
                </tr>
                <tr>
                  <th >BTF：</th>
                  <td>${item.manufactor ? item.manufactor : ""}</td>
                </tr>
                <tr>
                  <th >IP：</th>
                  <td>${item.manufactor ? item.manufactor : ""}</td>
                </tr>
                <tr>
                  <th >LPI：</th>
                  <td>${item.manufactor ? item.manufactor : ""}</td>
                </tr>
                <tr>
                  <th >BSRM：</th>
                  <td>${item.manufactor ? item.manufactor : ""}</td>
                </tr>
                <tr>
                  <th >JB：</th>
                  <td>${item.manufactor ? item.manufactor : ""}</td>
                </tr>
                <tr>
                  <th >设备品牌：</th>
                  <td>${item.manufactor ? item.manufactor : ""}</td>
                </tr>
              </table>
            </div>
          </div>
        `);
        this.markers.addLayer(bm);
      });
      // bm.bindPopup(`
      //   <div class="tip_div" id="${item.positionId}">
      //     <div class="popup_div">
      //       <table>
      //         <tr>
      //           <th >设备名称：</th>
      //           <td>${item.positionName ? item.positionName : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >设备编号：</th>
      //           <td>${item.positionCode ? item.positionCode : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >BTF：</th>
      //           <td>${item.manufactor ? item.manufactor : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >IP：</th>
      //           <td>${item.manufactor ? item.manufactor : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >LPI：</th>
      //           <td>${item.manufactor ? item.manufactor : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >BSRM：</th>
      //           <td>${item.manufactor ? item.manufactor : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >JB：</th>
      //           <td>${item.manufactor ? item.manufactor : ""}</td>
      //         </tr>
      //         <tr>
      //           <th >设备品牌：</th>
      //           <td>${item.manufactor ? item.manufactor : ""}</td>
      //         </tr>
      //       </table>
      //     </div>
      //   </div>
      //  `);
      // this.markers.addLayer(bm);
      // console.log(bm, this.markers);
    },
    // 下拉框改变
    selectChange() {
      console.log("selectChange");
      this.$refs.selectRef.value = "";
      this.form.groupTypeList = [];
      this.markers.remove();
      this.createStation();
      this.markersClick();
      this.map.addLayer(this.markers);
      this.getqueryAllMainStationMapPosition([this.form.mainStationIdList]);
    },
    clear() {
      console.log("clear");
      this.markers.remove();
    },
    handleInput(val) {
      queryEquipmentGroupList({ keyWord: val }).then((res) => {
        this.EquipmentOptions = res.data.data;
        if ("其他".indexOf(val) > -1 || val == "") {
          this.EquipmentOptions.push({
            id: "-1",
            groupName: "其他",
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.left {
  padding: 15px;
  position: absolute;
  top: 0%;
  left: 2.5%;
  z-index: 9;
}
.right {
  /*background-color: #eee;*/
  padding: 15px;
  position: absolute;
  top: 0%;
  right: 1%;
  z-index: 9;
}
/deep/.bigemap-popup {
  width: 280px;
  .bigemap-popup-content {
    // background-color: #d3d3d3;
    .tip_div {
      line-height: 40px;
      // background-color: #d3d3d3;
      overflow: auto;
      .popup_div {
        // background-color: #d3d3d3;
        margin-top: 10px;
        padding: 5px 5px 5px 5px;
        tr {
          line-height: 25px;
          th {
            width: 65px;
            display: inline-block;
            line-height: initial;
            padding: 0;
            margin: 0;
          }
          td {
            line-height: initial;
            padding: 0;
            margin: 0;
          }
        }
      }
    }
  }
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
</style>

