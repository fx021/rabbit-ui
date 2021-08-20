import {CUR_YEAR, UPPER_LIMIT_YEAR} from "vue-cron-generator/src/constant/filed";
export default {
  title: 'Rabbit',
  logoutTip: 'Exit the system, do you want to continue?',
  submitText: 'submit',
  cancelText: 'cancel',
  search: 'Please input search content',
  menuTip: 'none menu list',
  route: {
    info: 'info',
    website: 'website',
    avuexwebsite: 'avuex',
    dashboard: 'dashboard',
    more: 'more',
    tags: 'tags',
    store: 'store',
    permission: 'permission',
    api: 'api',
    logs: 'logs',
    table: 'table',
    form: 'form',
    top: 'backtop',
    data: 'data',
    error: 'error',
    test: 'test'
  },
  login: {
    title: 'Login',
    info: 'Enterprise Development Platform',
    tenantId: 'Please input tenantId',
    username: 'Please input username',
    password: 'Please input a password',
    wechat: 'Wechat',
    qq: 'QQ',
    github: 'github',
    gitee: 'gitee',
    phone: 'Please input a phone',
    code: 'Please input a code',
    submit: 'Login',
    userLogin: 'userLogin',
    phoneLogin: 'phoneLogin',
    thirdLogin: 'thirdLogin',
    msgText: 'send code',
    msgSuccess: 'reissued code',
  },
  navbar: {
    info: 'info',
    logOut: 'logout',
    userinfo: 'userinfo',
    dashboard: 'dashboard',
    lock: 'lock',
    bug: 'none bug',
    bugs: 'bug',
    screenfullF: 'exit screenfull',
    screenfull: 'screenfull',
    language: 'language',
    notice: 'notice',
    theme: 'theme',
    color: 'color'
  },
  tagsView: {
    search: 'Search',
    menu: 'menu',
    clearCache: 'Clear Cache',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  loginUser: 'current user\'s id',
  loginName: 'current user\'s name',
  loginDept: 'current user\'s departments',
  loginRole: 'current user\'s roles',
  loginPost: 'current user\'s oosts',
  loginAccount: 'current user\'s account',
  currentDateTime: 'current datetime',
  currentTimeStampe: 'current timestampe',
  commonDataSource: 'Common Datasource',
  common: {
    tip: 'Tip',
    from: 'From',
    fromThe: 'From',
    start: ' Start ',
    every: 'Per ',
    between: '',
    and: ' To ',
    end: ' ',
    specified: 'Specified',
    symbolTip: 'Symbol ',
    valTip: 'Value ',
    nearest: ' Nearest',
    current: 'Current ',
    nth: ' The',
    index: 'th ',
    placeholder: 'Select',
    placeholderMulti: '(Multi)Select',
    help: 'Help',
    wordNumError: 'Need 6 or 7 words',
    reverse: 'Reverse',
    reset: 'Reset',
    tagError: 'Tag Error ',
    numError: 'Number Error ',
    use: 'Use',
    inputPlaceholder: 'Cron Expression'
  },
  custom: {
    unspecified: 'Unspecified',
    workDay: ' Work Day',
    lastTh: ' Last',
    lastOne: ' Last',
    latestWorkday: ' Last Work Day',
    empty: 'Empty'
  },
  second: {
    title: 'Second',
    val: '0 1 2...59'
  },
  minute: {
    title: 'Minute',
    val: '0 1 2...59'
  },
  hour: {
    title: 'Hour',
    val: '0 1 2...23'
  },
  dayOfMonth: {
    timeUnit: 'Day',
    title: 'Day',
    val: '1 2...31'
  },
  month: {
    title: 'Month',
    val: '1 2...12 or JAN ... DEC'
  },
  dayOfWeek: {
    timeUnit: 'Day',
    title: 'Week',
    val: '1 2...7 or SUN ... SAT',
    SUN: 'Sunday',
    MON: 'Monday',
    TUE: 'Tuesday',
    WED: 'Wednesday',
    THU: 'Thursday',
    FRI: 'Friday',
    SAT: 'Saturday'
  },
  year: {
    title: 'Year',
    val: CUR_YEAR + ' ... ' + UPPER_LIMIT_YEAR
  },
  period: {
    startError: 'Start is Error',
    cycleError: 'Cycle is Error'
  },
  range: {
    lowerError: 'Lower is Error',
    upperError: 'Upper is Error',
    lowerBiggerThanUpperError: 'Lower should smaller than Upper'
  },
  weekDay: {
    weekDayNumError: 'The Week Number is Error',
    nthError: 'The Day in Week is Error'
  }

}
