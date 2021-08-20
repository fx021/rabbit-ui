import { dictionary } from "@/api/dictionaries/dictionaries";
export default {
    //字典
    install() {
        // 隶属集团：
        dictionary({ code: "owner_group" }).then((res) => {
            window.localStorage.setItem('ownerGroupOptions',JSON.stringify(res.data.data))
        });
        // 公司名称：
        dictionary({ code: "company" }).then((res) => {
            window.localStorage.setItem('companyOptions',JSON.stringify(res.data.data))
        });
        // 电压等级（kv）
        dictionary({ code: "upnet_voltage_level" }).then((res) => {
            window.localStorage.setItem('voltageLevelOptions',JSON.stringify(res.data.data))
        });
        // 建设类型：
        dictionary({ code: "build_type" }).then((res) => {
            window.localStorage.setItem('buildTypeOptions',JSON.stringify(res.data.data))
        });
        // 外线归属
        dictionary({ code: "line_attribution" }).then((res) => {
            window.localStorage.setItem('lineAttributionOptions',JSON.stringify(res.data.data))
        });
        // 电站类型
        dictionary({ code: "station_type" }).then((res) => {
            window.localStorage.setItem('stationTypeOptions',JSON.stringify(res.data.data))
        });
        // 调度关系
        dictionary({ code: "scheduling_relationship" }).then((res) => {
            window.localStorage.setItem('schedulingRelationshipOptions',JSON.stringify(res.data.data))
        });
        // 结算电量计量点
        dictionary({ code: "metering_point" }).then((res) => {
            window.localStorage.setItem('meteringPointOptions',JSON.stringify(res.data.data))
        });
        // 电站发电量计算类型 :集电线路表 、逆变器输出电量
        dictionary({ code: "electric_type_dict" }).then((res) => {
            window.localStorage.setItem('electricTypeDictOptions',JSON.stringify(res.data.data))
        });
        // 等效利用时数/节能减排/限电量计算类型  ：发电量 、上网电量
        dictionary({ code: "equivalent_calculation_type" }).then((res) => {
            window.localStorage.setItem('equivalentCalculationTypeOptions',JSON.stringify(res.data.data))
        });
        // 固定安装区域支路{ 发电效率计算\ 固定安装区域标杆支路计算\ 跟踪安装区域标杆支路计算 }
        dictionary({ code: "install_area_fixed_pgb" }).then((res) => {
            window.localStorage.setItem('installAreaFixedPgbOptions',JSON.stringify(res.data.data))
        });
        // 跟踪安装区域支路{发电效率计算\固定安装区域标杆支路计算\跟踪安装区域标杆支路计算}
        dictionary({ code: "install_area_track_pgb" }).then((res) => {
            window.localStorage.setItem('installAreaTrackPgbOptions',JSON.stringify(res.data.data))
        });
        // 固定安装区域 - 汇流箱、逆变器、组串逆变器、箱变、集电线路{发电效率计算\固定安装区域标杆支路计算\跟踪安装区域标杆支路计算}
        dictionary({ code: "install_area_fixed" }).then((res) => {
            window.localStorage.setItem('installAreaFixedOptions',JSON.stringify(res.data.data))
        });
        //  跟踪安装区域 - 汇流箱、逆变器、组串逆变器、箱变、集电线路{发电效率计算\固定安装区域标杆支路计算\跟踪安装区域标杆支路计算}
        dictionary({ code: "install_area_track" }).then((res) => {
            window.localStorage.setItem('installAreaTrackOptions',JSON.stringify(res.data.data))
        });
        // 	混合安装区域 - 汇流箱、逆变器、组串逆变器、箱变、集电线路{发电效率计算\固定安装区域标杆支路计算\跟踪安装区域标杆支路计算}
        dictionary({ code: "install_area_blend" }).then((res) => {
            window.localStorage.setItem('installAreaBlendOptions',JSON.stringify(res.data.data))
        });
        // 上网方式
        dictionary({ code: "up_powergrid_type" }).then((res) => {
            window.localStorage.setItem('upPowergridTypeOptions',JSON.stringify(res.data.data))
        });
        // 电价补贴类型
        dictionary({ code: "tariff_subsidies_type" }).then((res) => {
            window.localStorage.setItem('tariffSubsidiesTypeOptions',JSON.stringify(res.data.data))
        });
        // 升压站
        dictionary({ code: "install_bsrm" }).then((res) => {
            window.localStorage.setItem('installBsrmOptions',JSON.stringify(res.data.data))
        });
        // 设备类型
        dictionary({ code: "equipment_type" }).then((res) => {
            window.localStorage.setItem('equipmentTypeOptions',JSON.stringify(res.data.data))
        });
        // 设备状态
        dictionary({ code: "status_equipment" }).then((res) => {
            window.localStorage.setItem('statusEquipmentOptions',JSON.stringify(res.data.data))
        });
        // 设备简称
        dictionary({ code: "equipment_abbreviation" }).then((res) => {
            window.localStorage.setItem('equipmentAbbreviationOptions',JSON.stringify(res.data.data))
        });
        // 组件厂家
        dictionary({ code: "panel_factory" }).then((res) => {
            window.localStorage.setItem('panelFactoryOptions',JSON.stringify(res.data.data))
        });
        // 封装形式
        dictionary({ code: "package_type" }).then((res) => {
            window.localStorage.setItem('packageTypeOptions',JSON.stringify(res.data.data))
        });
        // 发电形式
        dictionary({ code: "power_type" }).then((res) => {
            window.localStorage.setItem('powerTypeOptions',JSON.stringify(res.data.data))
        });
        //
        dictionary({ code: "component_type" }).then((res) => {
            window.localStorage.setItem('componentTypeOptions',JSON.stringify(res.data.data))
        });
        // 组件材料
        dictionary({ code: "component_materials"}).then((res) => {
            window.localStorage.setItem('componentMaterialsOptions',JSON.stringify(res.data.data))
        });
        // 设备类型大数据
        dictionary({ code: "equipment_type_big_data"}).then((res) => {
            window.localStorage.setItem('equipmentTypeBigDataOptions',JSON.stringify(res.data.data))
        });
        // 组件安装方式
        dictionary({ code: "model_install"}).then((res) => {
            window.localStorage.setItem('modelInstallOptions',JSON.stringify(res.data.data))
        });
        // 安装角度
        dictionary({ code: "install_angle_dict"}).then((res) => {
            window.localStorage.setItem('installAngleDictOptions',JSON.stringify(res.data.data))
        });
        // 安装角度变化
        dictionary({ code: "install_angle_change"}).then((res) => {
            window.localStorage.setItem('installAngleChangeOptions',JSON.stringify(res.data.data))
        });
        // 外线性质
        dictionary({ code: "outside_type"}).then((res) => {
            window.localStorage.setItem('outsideTypeOptions',JSON.stringify(res.data.data))
        });
        // 巡检计划类别
        dictionary({ code: "plan_type"}).then((res) => {
            window.localStorage.setItem('planTypeOptions',JSON.stringify(res.data.data))
        });
        //标杆模板
        dictionary({ code: "standard_template"}).then((res) => {
            window.localStorage.setItem('standardTemplateOptions',JSON.stringify(res.data.data))
        });
        // 频率
        dictionary({ code: "frequency"}).then((res) => {
            window.localStorage.setItem('frequencyOptions',JSON.stringify(res.data.data))
        });
        // 设备类型
        dictionary({ code: "equipment_type"}).then((res) => {
            window.localStorage.setItem('equipmentTypeOptions',JSON.stringify(res.data.data))
        });
        // 巡检类别
        dictionary({ code: "check_category"}).then((res) => {
            window.localStorage.setItem('checkCategoryOptions',JSON.stringify(res.data.data))
        });
        //巡检状态
        dictionary({ code: "check_state"}).then((res) => {
            window.localStorage.setItem('checkStateOptions',JSON.stringify(res.data.data))
        });
        //执行状态
        dictionary({ code: "exe_state"}).then((res) => {
            window.localStorage.setItem('exeStateOptions',JSON.stringify(res.data.data))
        });
        //任务状态
        dictionary({ code: "task_state"}).then((res) => {
            window.localStorage.setItem('taskStateOptions',JSON.stringify(res.data.data))
        });
        //巡检结果
        dictionary({ code: "check_result"}).then((res) => {
            window.localStorage.setItem('checkResultOptions',JSON.stringify(res.data.data))
        });
        //派发状态
        dictionary({ code: "assign_state"}).then((res) => {
            window.localStorage.setItem('assignStateOptions',JSON.stringify(res.data.data))
        });
        //工单状态
        dictionary({ code: "order_state"}).then((res) => {
            window.localStorage.setItem('orderStateOptions',JSON.stringify(res.data.data))
        });
        //告警类别
        dictionary({ code: "alarm_category"}).then((res) => {
            window.localStorage.setItem('alarmCategoryOptions',JSON.stringify(res.data.data))
        });
        //故障类型
        dictionary({ code: "fault_type"}).then((res) => {
            window.localStorage.setItem('faultTypeOptions',JSON.stringify(res.data.data))
        });
        //告警级别
        dictionary({ code: "warning_level"}).then((res) => {
            window.localStorage.setItem('warningLevelOptions',JSON.stringify(res.data.data))
        });
        //告警类型
        dictionary({ code: "warning_type"}).then((res) => {
            window.localStorage.setItem('warningTypeOptions',JSON.stringify(res.data.data))
        });
        // 告警状态
        dictionary({ code: "alarm_state"}).then((res) => {
            window.localStorage.setItem('alarmStateOptions',JSON.stringify(res.data.data))
        });
        // 数据来源
        dictionary({ code: "data_source"}).then((res) => {
            window.localStorage.setItem('dataSourceOptions',JSON.stringify(res.data.data))
        });
        // 处理结果
        dictionary({ code: "handle_result"}).then((res) => {
            window.localStorage.setItem('handleResultOptions',JSON.stringify(res.data.data))
        });
        // 任务分类
        dictionary({ code: "task_order_type"}).then((res) => {
            window.localStorage.setItem('taskOrderTypeOptions',JSON.stringify(res.data.data))
        });
        // 任务级别
        dictionary({ code: "task_level"}).then((res) => {
            window.localStorage.setItem('taskLevelOptions',JSON.stringify(res.data.data))
        });
        // 紧急程度
        dictionary({ code: "urgency"}).then((res) => {
            window.localStorage.setItem('urgencyOptions',JSON.stringify(res.data.data))
        });
         // 记录类型
        dictionary({ code: "record_type"}).then((res) => {
            window.localStorage.setItem('recordTypeOptions',JSON.stringify(res.data.data))
        });
         // 结果判定
        dictionary({ code: "result_judgment"}).then((res) => {
            window.localStorage.setItem('resultJudgmentOptions',JSON.stringify(res.data.data))
        });
         // 任务结果
         dictionary({ code: "task_results"}).then((res) => {
            window.localStorage.setItem('taskResultsOptions',JSON.stringify(res.data.data))
        });
         // 出行方式
         dictionary({ code: "travel_mode"}).then((res) => {
            window.localStorage.setItem('travelModeOptions',JSON.stringify(res.data.data))
        });
        // 排班类型
        dictionary({ code: "work_type"}).then((res) => {
            window.localStorage.setItem('workTypeOptions',JSON.stringify(res.data.data))
        });

    }
}
