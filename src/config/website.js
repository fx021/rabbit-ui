/**
 * 全局配置文件
 */
export default {
  title: "Rabbit",
  logo: "R",
  key: 'saber',//配置主键,目前用于存储
  indexTitle: 'Rabbit',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: false, // 是否开启验证码模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Rabbit-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 第三方系统授权地址
  authUrl: 'http://localhost/rabbit-auth/oauth/render',
  // 流程设计器地址
  // flowDesignUrl: 'http://172.18.2.80:8087/rabbit-flowable',
  flowDesignUrl: 'http://10.2.101.54:8087/rabbit-flowable',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://172.18.2.80:8108/ureport',
}
