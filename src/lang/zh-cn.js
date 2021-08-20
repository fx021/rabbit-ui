import {CUR_YEAR, UPPER_LIMIT_YEAR} from "vue-cron-generator/src/constant/filed";

export default {
  title: '信义迅',
  logoutTip: '退出系统, 是否继续?',
  submitText: '确定',
  cancelText: '取消',
  search: '请输入搜索内容',
  menuTip: '没有发现菜单',
  route: {
    info: '个人信息',
    website: '信义官网',
    avuexwebsite: 'avue官网',
    dashboard: '首页',
    more: '更多',
    tags: '标签',
    store: '本地存储',
    api: '全局函数',
    logs: '日志监控',
    table: '表格',
    form: '表单',
    top: '返回顶部',
    data: '数据展示',
    permission: '权限',
    error: '异常页面',
    test: '测试页面'
  },
  login: {
    title: '登录',
    info: '信义迅 微服务开发平台',
    tenantId: '请输入租户ID',
    username: '请输入账号',
    password: '请输入密码',
    wechat: '微信',
    qq: 'QQ',
    github: 'github',
    gitee: '码云',
    phone: '请输入手机号',
    code: '请输入验证码',
    submit: '登录',
    userLogin: '账号密码登录',
    phoneLogin: '手机号登录',
    thirdLogin: '第三方系统登录',
    msgText: '发送验证码',
    msgSuccess: '秒后重发',
  },
  navbar: {
    logOut: '退出登录',
    userinfo: '个人信息',
    dashboard: '首页',
    lock: '锁屏',
    bug: '没有错误日志',
    bugs: '条错误日志',
    screenfullF: '退出全屏',
    screenfull: '全屏',
    language: '中英文',
    notice: '消息通知',
    theme: '主题',
    color: '换色'
  },
  tagsView: {
    search: '搜索',
    menu: '更多',
    clearCache: '清除缓存',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  loginUser: '登录用户id',
  loginName: '登录用户名字',
  loginDept: '登录用户部门',
  loginRole: '登录用户角色',
  loginPost: '登录用户岗位',
  loginAccount: '登录用户账号',
  currentDateTime: '当前日期时间',
  currentTimeStampe: '当前时间戳',
  commonDataSource: '公共数据源',
  common: {
    tip: '提示',
    from: '从',
    fromThe: '从第',
    start: '开始',
    every: '每',
    between: '在',
    and: '到',
    end: '之间的',
    specified: '固定的',
    symbolTip: '通配符支持',
    valTip: '值为',
    nearest: '最近的',
    current: '本',
    nth: '第',
    index: '个',
    placeholder: '请选择',
    placeholderMulti: '请选择(支持多选)',
    help: '帮助',
    wordNumError: '格式不正确，必须有6或7位',
    reverse: '反向解析',
    reset: '重置',
    tagError: '表达式不正确',
    numError: '含有非法数字',
    use: '使用',
    inputPlaceholder: 'Cron表达式'
  },
  custom: {
    unspecified: '不固定',
    workDay: '工作日',
    lastTh: '倒数第',
    lastOne: '最后一个',
    latestWorkday: '最后一个工作日',
    empty: '不配置'
  },
  second: {
    title: '秒',
    val: '0 1 2...59'
  },
  minute: {
    title: '分',
    val: '0 1 2...59'
  },
  hour: {
    title: '时',
    val: '0 1 2...23'
  },
  dayOfMonth: {
    timeUnit: '日',
    title: '日',
    val: '1 2...31'
  },
  month: {
    title: '月',
    val: '1 2...12，或12个月的缩写(JAN ... DEC)'
  },
  dayOfWeek: {
    timeUnit: '日',
    title: '周',
    val: '1 2...7或星期的缩写(SUN ... SAT)',
    SUN: '星期天',
    MON: '星期一',
    TUE: '星期二',
    WED: '星期三',
    THU: '星期四',
    FRI: '星期五',
    SAT: '星期六'
  },
  year: {
    title: '年',
    val: CUR_YEAR + ' ... ' + UPPER_LIMIT_YEAR
  },
  period: {
    startError: '开始格式不符',
    cycleError: '循环格式不符'
  },
  range: {
    lowerError: '下限格式不符',
    upperError: '上限格式不符',
    lowerBiggerThanUpperError: '下限不能比上限大'
  },
  weekDay: {
    weekDayNumError: '周数格式不符',
    nthError: '天数格式不符'
  }
}
