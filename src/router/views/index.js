import Layout from "@/page/index/";

export default [{
    path: "/wel",
    component: Layout,
    redirect: "/wel/index",
    children: [{
        path: "index",
        name: "首页",
        meta: {
          i18n: "dashboard"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/wel/index")
      },
      {
        path: "dashboard",
        name: "控制台",
        meta: {
          i18n: "dashboard",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/wel/dashboard")
      }
    ]
  },
  {
    path: "/organization",
    component: Layout,
    redirect: "/organization/allStation",
    children: [{
        path: "allStation",
        name: "组织",
        meta: {
          i18n: "organization",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/index")
      },
      {
        path: "allDetails",
        name: "组织详情",
        meta: {
          i18n: "organization",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/masterStationManager/allDetails")
      },
      {
        path: "newDetails",
        name: "新建组织",
        meta: {
          i18n: "organization",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/masterStationManager/newDetails")
      },
      {
        path: "substation",
        name: "子期",
        meta: {
          i18n: "organization",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/substation")
      },
      {
        path: "detailsSubstation",
        name: "子期详情",
        meta: {
          i18n: "organization",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/subStationManager/operationSubstation")
      },
      {
        path: "newSubstation",
        name: "新建子期",
        meta: {
          i18n: "organization",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/subStationManager/operationSubstation")
      },
      {
        path: "staging",
        name: "次分期",
        meta: {
          i18n: "organization",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/staging")
      },
      {
        path: "detailsStaging",
        name: "次分期详情",
        meta: {
          i18n: "organization",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/stagingManager/operationStaging")
      },
      {
        path: "newStaging",
        name: "新建次分期",
        meta: {
          i18n: "organization",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/organization/stagingManager/operationStaging")
      },
    ]
  },
  {
    path: "/device",
    component: Layout,
    redirect: "/device/equipmentAccount",
    children: [{
        path: "equipmentAccount",
        name: "设备台账",
        meta: {
          i18n: "device",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentAccount")
      },
      {
        path: "componentAccount",
        name: "组件台账",

        i18n: "device",
        meta: {
          i18n: "device",
          menu: false,
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/componentAccount")
      },
      {
        path: "componentInformation",
        name: "组件模板",
        meta: {
          i18n: "device",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/componentInformation")
      },
      {
        path: "InspectionContents",
        name: "巡检内容",
        meta: {
          i18n: "device",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/InspectionContents")
      },
      {
        path: "addInspectionContents",
        name: "新增巡检内容",
        meta: {
          i18n: "device",
          $keepAlive: true,
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/InspectionContentsManager/add")
      },
      {
        path: "detailInspectionContents",
        name: "巡检内容详情",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/InspectionContentsManager/detail")
      },
      {
        path: "equipmentGroup",
        name: "设备分组",
        meta: {
          menu: false,
          i18n: "device",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentGroup")
      },
      {
        path: "equipmentLocation",
        name: "设备位置",
        meta: {
          i18n: "device",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentLocation")
      },
      {
        path: "newequipmentLocation",
        name: "新建设备位置",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentLocationManager/operationEquipmentLocation")
      },
      {
        path: "detailsequipmentLocation",
        name: "详情设备位置",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentLocationManager/operationEquipmentLocation")
      },
      {
        path: "addEquipmentGroup",
        name: "新增设备分组",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentGroupManager/addEquipmentGroup")
      },
      {
        path: "detailEquipmentGroup",
        name: "编辑设备分组",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentGroupManager/detailEquipmentGroup")
      },
      {
        path: "addcomponentInformation",
        name: "新建组件模板",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/componentInformationManager/addcomponentInformation")
      },
      {
        path: "detailcomponentInformation",
        name: "组件模板详情",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/componentInformationManager/detailcomponentInformation")
      },
      {
        path: "equipmentArchives",
        name: "设备档案",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/equipmentArchives")
      },
      {
        path: "newArchives",
        name: "新建档案",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/ArchivesManager/operationArchives")
      },
      {
        path: "detailsArchives",
        name: "档案详情",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/ArchivesManager/operationArchives")
      },
      {
        path: "matrix",
        name: "方阵",
        meta: {
          i18n: "device",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/matrix")
      },
      {
        path: "newMatrix",
        name: "新建方阵",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/matrixManager/operationMatrix")
      },
      {
        path: "detailsMatrix",
        name: "方阵详情",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/matrixManager/operationMatrix")
      },
      {
        path: "positionPreview",
        name: "设备位置预览",
        meta: {
          i18n: "device",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/device/positionPreview")
      },
    ]
  },
  {
    path: "/operationManagement",
    component: Layout,
    redirect: "/operationManagement/alarmManagement",
    children: [{
        path: "alarmManagement",
        name: "告警管理",
        meta: {
          i18n: "alarmManagement",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/operationManagement/alarmManagement"
          )
      },
      {
        path: "newAlarmManagement",
        name: "新建告警",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/operationManagement/alarmManagement/operationAlarm")
      },
      {
        path: "detailsAlarmManagement",
        name: "告警详情",
        meta: {
          i18n: "device",
          menu: false
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/operationManagement/alarmManagement/operationAlarm")
      },
      {
        path: "alarmInformationConfiguration",
        name: "告警信息配置",
        meta: {
          i18n: "operationManagement",
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/operationManagement/alarmInformationConfiguration"
          )
      },
      {
        path: "detailAlarmInformation",
        name: "告警信息配置详情",
        meta: {
          i18n: "operationManagement",
          menu: false
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/operationManagement/alarmInformationManager/detail"
          )
      },
      {
        path: "addAlarmInformation",
        name: "新增告警信息配置",
        meta: {
          i18n: "operationManagement",
          menu: false
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/operationManagement/alarmInformationManager/add"
          )
      },
    ]
  },
  {
    path: "/taskWorkOrder",
    component: Layout,
    redirect: "/taskWorkOrder/monitoringRecord",
    children: [
      {
        path: "dailyTask",
        name: "日常任务",
        meta: {
          i18n: "dailyTask",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskWorkOrder/dailyTask"
          )
      },
      {
        path: "newDailyTask",
        name: "新增日常任务",
        meta: {
          i18n: "dailyTask",
          menu: false,

        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/independents/dailyTask/operationDailyTask"
          )
      },
      {
        path: "dailyTaskDetail",
        name: "日常任务详情",
        meta: {
          i18n: "dailyTask",
          menu: false,

        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/independents/dailyTask/operationDailyTask"
          )
      },
      {
        path: "outgoingTask",
        name: "外出任务",
        meta: {
          i18n: "outgoingTask",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskWorkOrder/outgoingTask"
          )
      },
      {
        path: "newOutgoingTask",
        name: "新增外出任务",
        meta: {
          i18n: "outgoingTask",
          menu: false,

        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/independents/outgoingTask/operationOutgoingTask"
          )
      },
      {
        path: "outgoingTaskDetail",
        name: "外出任务详情",
        meta: {
          i18n: "outgoingTask",
          menu: false,

        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/independents/outgoingTask/operationOutgoingTask"
          )
      },
      {
        path: "taskFeedback",
        name: "任务反馈",
        meta: {
          i18n: "taskFeedback",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskWorkOrder/taskFeedback"
          )
      },
      {
        path: "detailTaskFeedback",
        name: "任务反馈详情",
        meta: {
          i18n: "monitoringRecord",
          menu: false,
          // $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/independents/taskFeedback/detail"
          )
      },
      {
        path: "monitoringRecord",
        name: "监控记录",
        meta: {
          i18n: "monitoringRecord",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskWorkOrder/monitoringRecord"
          )
      },
      {
        path: "addmonitoringRecord",
        name: "新增监控记录",
        meta: {
          i18n: "monitoringRecord",
          menu: false,
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskWorkOrder/monitoringRecordManager/add"
          )
      },
      {
        path: "detailmonitoringRecord",
        name: "监控记录详情",
        meta: {
          i18n: "monitoringRecord",
          menu: false,
          // $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/independents/monitoringRecord/detail"
          )
      },
    ]},
  {
    path: "/taskManagement",
    component: Layout,
    redirect: "/taskManagement/patrolTask",
    children: [{
        path: "patrolTask",
        name: "巡检任务",
        meta: {
          i18n: "taskManagement",
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskManagement/patrolTask"
          )
      },
      {
        path: "detailPatrolTask",
        name: "巡检任务详情",
        meta: {
          i18n: "taskManagement"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/taskManagement/patrolTaskManager/detail")
      },
      {
        path: "detailPatrolTaskList",
        name: "任务清单详情",
        meta: {
          i18n: "taskManagement"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/taskManagement/patrolTaskManager/detailList")
      },
      {
        path: "alarmConfirmation",
        name: "告警确认单",
        meta: {
          i18n: "taskManagement",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/taskManagement/alarmConfirmation")
      },
      {
        path: "equipmentDescription",
        name: "设备情况说明单",
        meta: {
          i18n: "taskManagement",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/taskManagement/equipmentDescription")
      },
      {
        path: "addOperationEquipmentDescription",
        name: "新增设备情况",
        meta: {
          i18n: "taskManagement",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/equipmentDescription/operationEquipmentDescription")
      },
      {
        path: "operationEquipmentDescription",
        name: "设备情况详情",
        meta: {
          i18n: "taskManagement",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/equipmentDescription/operationEquipmentDescription")
      },
      {
        path: "repairOrder",
        name: "维修工单",
        meta: {
          i18n: "taskManagement",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/orderManage/repairOrder")
      },
      {
        path: "newRepairOrder",
        name: "新增维修工单",
        meta: {
          i18n: "taskManagement"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/repairOrder/operationRepair")
      },
      {
        path: "repairOrderDetail",
        name: "维修工单详情",
        meta: {
          i18n: "taskManagement"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/repairOrder/operationRepair")
      },
      {
        path: "detailAlarmConfirmation",
        name: "告警确认单详情",
        meta: {
          i18n: "taskManagement",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/alarmConfirmation/detailAlarmConfirmation")
      },
      {
        path: "automaticAllocation",
        name: "自动派发",
        meta: {
          i18n: "taskManagement",
          $keepAlive: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskManagement/automaticAllocation"
          )
      },
      {
        path: "detailOperationAutomaticAllocation",
        name: "自动派发详情",
        meta: {
          i18n: "taskManagement",
          menu: false
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskManagement/automaticAllocationManager/operationAutomaticAllocation"
          )
      },
      {
        path: "newOperationAutomaticAllocation",
        name: "新增自动派发",
        meta: {
          i18n: "taskManagement",
          menu: false
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/taskManagement/automaticAllocationManager/operationAutomaticAllocation"
          )
      },
    ]
  },
  {
    path: "/backstage",
    component: Layout,
    redirect: "/backstage/grouping",
    children: [{
        path: "baseFrequency",
        name: "基础频率",
        meta: {
          i18n: "backstage",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/baseFrequency")
      },
      {
        path: "newBaseFrequency",
        name: "新增基础频率",
        meta: {
          i18n: "backstage",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/baseFrequencyManager/operationBaseFrequency")
      },
      {
        path: "detailsBaseFrequency",
        name: "基础频率详情",
        meta: {
          i18n: "backstage",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/baseFrequencyManager/operationBaseFrequency")
      },
      {
        path: "shiftConfiguration",
        name: "班次配置",
        meta: {
          i18n: "backstage",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/shiftConfiguration")
      },
      {
        path: "addShiftConfiguration",
        name: "新建班次配置",
        meta: {
          i18n: "backstage",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/shiftConfigurationManager/add")
      },
      {
        path: "detailShiftConfiguration",
        name: "班次配置详情",
        meta: {
          i18n: "backstage",
          // $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/shiftConfigurationManager/detail")
      },
      {
        path: "checkPlanFrequency",
        name: "巡检频率",
        meta: {
          i18n: "backstage",
          $keepAlive: true,
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/checkPlanFrequency")
      },
      {
        path: "newCheckPlanFrequency",
        name: "新增巡检频率",
        meta: {
          i18n: "backstage",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/checkPlanFrequencyManager/operationCheckPlanFrequency")
      },
      {
        path: "detailsCheckPlanFrequency",
        name: "巡检频率详情",
        meta: {
          i18n: "backstage",
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/checkPlanFrequencyManager/operationCheckPlanFrequency")
      },
      {
        path: "grouping",
        name: "分组类别",
        meta: {
          i18n: "backstage",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/grouping")
      },
      {
        path: "add",
        name: "新增分组类别",
        meta: {
          i18n: "backstage"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/grouping/add")
      },
      {
        path: "detail",
        name: "分组类别详情",
        meta: {
          i18n: "backstage"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/grouping/detail")
      },
      {
        path: "statistics",
        name: "统计读数类型配置",
        meta: {
          i18n: "backstage",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/statistics")
      },
      {
        path: "attendance",
        name: "出勤类型配置",
        meta: {
          i18n: "backstage",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/attendance")
      },
      {
        path: "taskClassification",
        name: "任务分类配置",
        meta: {
          i18n: "backstage",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/taskClassification")
      },
      {
        path: "taskContent",
        name: "任务内容配置",
        meta: {
          i18n: "backstage",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/backstage/taskContent")
      }
    ]
  },
  {
    path: "/planManage",
    component: Layout,
    redirect: "/planManage/deviceInspection",
    children: [{
        path: "deviceInspection",
        name: "设备巡检计划",
        meta: {
          i18n: "planManage",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/planManage/deviceInspection")
      },
      {
        path: "newDeviceInspection",
        name: "新增设备巡检计划",
        meta: {
          i18n: "planManage"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/planManage/operationDeviceInspection")
      },
      {
        path: "deviceInspectionDetail",
        name: "设备巡检计划详情",
        meta: {
          i18n: "planManage"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/planManage/operationDeviceInspection")
      },
      {
        path: "newApply",
        name: "新增设备停机申请",
        meta: {
          i18n: "planManage"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/planManage/apply")
      },
      {
        path: "applyDetail",
        name: "设备停机申请详情",
        meta: {
          i18n: "planManage"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/planManage/apply")
      }
    ]
  },
  {
    path: "/workArrange",
    component: Layout,
    redirect: "/workArrange",
    children: [{
      path: "workArrange",
      name: "人员排班",
      meta: {
        i18n: "workArrange",
        $keepAlive: true
      },
      component: () =>
        import( /* webpackChunkName: "views" */ "@/views/workArrange/workArrange")
    },
    {
      path: "newWorkArrange",
      name: "新增人员排班",
      meta: {
        i18n: "workArrange"
      },
      component: () =>
        import( /* webpackChunkName: "views" */ "@/independents/workArrange/operationWorkArrange")
    },
    {
      path: "workArrangeDetail",
      name: "人员排班详情",
      meta: {
        i18n: "workArrange"
      },
      component: () =>
        import( /* webpackChunkName: "views" */ "@/independents/workArrange/operationWorkArrange")
    }],
  },
  {
    path: "/taskApplication",
    component: Layout,
    redirect: "/taskApplication/patrolInspection",
    children: [{
        path: "patrolInspection",
        name: "设备巡检任务申请列表",
        meta: {
          i18n: "taskApplication",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/taskApplication/patrolInspection")
      },
      {
        path: "detailpatrolInspection",
        name: "设备巡检任务申请列表详情",
        meta: {
          i18n: "taskManagement"
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/independents/patrolInspection/detailpatrolInspection")
      },
      {
        path: "shutDownApplication",
        name: "巡检设备停机申请列表",
        meta: {
          i18n: "taskApplication",
          $keepAlive: true
        },
        component: () =>
          import( /* webpackChunkName: "views" */ "@/views/taskApplication/shutDownApplication")
      },
    ]
  },
  //
  {
    path: "/test",
    component: Layout,
    redirect: "/test/index",
    children: [{
      path: "index",
      name: "测试页",
      meta: {
        i18n: "test"
      },
      component: () =>
        import( /* webpackChunkName: "views" */ "@/views/util/test")
    }]
  },
  {
    path: "/dict-horizontal",
    component: Layout,
    redirect: "/dict-horizontal/index",
    children: [{
      path: "index",
      name: "字典管理",
      meta: {
        i18n: "dict"
      },
      component: () =>
        import(
          /* webpackChunkName: "views" */
          "@/views/util/demo/dict-horizontal"
        )
    }]
  },
  {
    path: "/dict-vertical",
    component: Layout,
    redirect: "/dict-vertical/index",
    children: [{
      path: "index",
      name: "字典管理",
      meta: {
        i18n: "dict"
      },
      component: () =>
        import(
          /* webpackChunkName: "views" */
          "@/views/util/demo/dict-vertical"
        )
    }]
  },
  {
    path: "/info",
    component: Layout,
    redirect: "/info/index",
    children: [{
      path: "index",
      name: "个人信息",
      meta: {
        i18n: "info"
      },
      component: () =>
        import( /* webpackChunkName: "views" */ "@/views/system/userinfo")
    }]
  },
  {
    path: "/work/process/",
    component: Layout,
    children: [{
        path: "form",
        name: "流程发起",
        meta: {
          i18n: "work"
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/work/process/form"
          )
      },
      {
        path: "handle",
        name: "处理流程",
        meta: {
          i18n: "work"
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/work/process/handle"
          )
      },
      {
        path: "detail",
        name: "流程详情",
        meta: {
          i18n: "work"
        },
        component: () =>
          import(
            /* webpackChunkName: "views" */
            "@/views/work/process/detail"
          )
      }
    ]
  },
  {
    path: "/tool/businessTable/detail",
    component: Layout,
    children: [{
      path: ":id",
      meta: {
        $keepAlive: false,
      },
      name: "业务表详情",
      component: () => import(
        /* webpackChunkName: "views" */
        "@/views/tool/businessTable"
      )
    }]
  },
  {
    path: "/tool/businessTable/",
    component: Layout,
    children: [{
      path: "add",
      meta: {
        $keepAlive: false,
      },
      name: "业务表新增",
      component: () => import(
        /* webpackChunkName: "views" */
        "@/views/tool/businessTable"
      )
    }]
  },
  {
    path: "/flow/manager/permission",
    component: Layout,
    children: [{
      path: ":id",
      name: '权限配置',
      meta: {
        $keepAlive: false,
      },
      component: () => import(
        /* webpackChunkName: "views" */
        "@/views/flow/permission"
      )
    }]
  },
  {
    path: "/list",
    component: Layout,
    children: [{
      path: ":formId",
      meta: {
        $keepAlive: false,
      },
      name: "FormList",
      component: () => import(
        /* webpackChunkName: "views" */
        "@/views/form/FormList"
      ),
      props: true
    }]
  },
  {
    path: "/message",
    component: Layout,
    name: "消息",
    redirect: "/message/layout",
    meta: {
      keepAlive: true,
    },
    children: [{
      path: "layout",
      meta: {
        keepAlive: true,
      },
      name: "消息",
      component: () => import(
        /* webpackChunkName: "views" */
        "@/views/message/"
      ),
      children: [{
        path: ":templateType",
        component: () => import(
          /* webpackChunkName: "views" */
          "@/views/message/todo/"
        ),
        meta: {
          keepAlive: true,
        },
        children: [{
          path: ":templateId",
          component: () => import(
            /* webpackChunkName: "views" */
            "@/views/message/dialog"
          ),
          meta: {
            keepAlive: true,
          },
        }]
      }, ]
    }]
  },
  {
    path: "/messageTpl",
    component: Layout,
    children: [{
      path: "/messageTpl/index",
      name: "消息模板页面",
      component: () => import(
        /* webpackChunkName: "views" */
        "@/views/messageTpl/index"
      ),
    }]
  }
];
