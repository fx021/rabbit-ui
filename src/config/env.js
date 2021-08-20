// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let iconfontVersion = ['567566_pwc3oottzol', '1066523_6bvkeuqao36'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`

const bizUrlEnvConfig = {
    "rabbitWebsocket":"",
}

const env = process.env
if (env.NODE_ENV === 'development') {
    bizUrlEnvConfig.rabbitWebsocket = "10.2.101.54:8887";
    baseUrl = ``; // 开发环境地址
} else if (env.NODE_ENV === 'production') {
    bizUrlEnvConfig.rabbitWebsocket = "10.2.101.54:8887";
    baseUrl = ``; //生产环境地址
} else if (env.NODE_ENV === 'test') {
    bizUrlEnvConfig.rabbitWebsocket = "10.2.101.54:8887";
    baseUrl = ``; //测试环境地址
}


const localGateWayRouterConfig = {
    "rabbit-resource":"10.2.101.54:8010",
    "rabbit-admin":"10.2.101.54:99",
    "rabbit-log":"10.2.101.54:8103",
    "rabbit-develop":"10.2.101.54:7007",
    "rabbit-system":"10.2.101.54:8106",
    "rabbit-desk":"10.2.101.54:8105",
    "xye-manager":"10.2.101.54:8001",//
    "rabbit-user":"10.2.101.54:8102",
    "rabbit-flow":"10.2.101.54:8008",//
    "rabbit-auth":"10.2.101.54:9100",
    "rabbit-gateway":"10.2.101.54:8887",
    "rabbit-customer":"10.2.101.54:8107"
}

export {
    localGateWayRouterConfig,
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    bizUrlEnvConfig,
    codeUrl,
    env
}
