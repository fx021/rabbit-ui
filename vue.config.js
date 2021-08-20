const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  //路径前缀
  publicPath: "/",
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    //忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT"
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
    entry.add("@/mock").end();

    // svg rule loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
        extract: false
      })

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

  },
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 8081,
    proxy: {
      "/webroot/decision": {
        // XYG服务器
        target: "http://172.18.2.92:8080",
      },
      "/api": {
        //本地服务接口地址
        // 微服务
        // target: "http://172.18.2.82",
        // 开发环境
        target: "http://10.2.101.54:8887",
        // 生良
        // target: "http://10.16.12.25:8081",
        // 新建
        // target: "http://10.16.12.34:8081",
        // 海
        // target:'http://10.16.12.168:8081',
        // target:"http://10.16.12.25:8081"
        // target: "http://10.2.101.38:8080",
        // target: "http://10.2.101.38:8080",
        // 红艳
        //  target: "http://10.16.12.95:8081",
        // 强哥的地址
        // target: "http://10.16.11.62:88",
        // 服务器网址
        // target: 'http://172.18.2.80:8080',
        // 本地的地址
        // target: 'http://10.16.12.118:8080',
        // target: "http://172.31.17.11:8080",
        // 宿舍的地址
        // target: 'http://172.31.17.11',
        //远程演示服务地址,可用于直接启动项目
        // target: "https://saber.bladex.vip/api",
        //
        ws: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  }
};
