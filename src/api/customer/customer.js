import { get, post } from "@/router/axios";

export const login = params => post("/login", params); //登录

// 后台接口路径
// 查询客户主数据
export const findCustomerInfo = params => get('/api/rabbit-customer/customerData/findCustomerInfo', params)
// 保存
export const saveCustomerInfo = params => get('/api/rabbit-customer/customerData/saveCustomerInfo', params)

// 查询默认收货地区
export const findTerritory = params => get('/api/rabbit-customer/customerData/findTerritory')

// 查询运输方式
export const findShipmentMethodType = params => get('/api/rabbit-customer/customerData/findShipmentMethodType')

// 查询贸易条款
export const findTermType = params => get('/api/rabbit-customer/customerData/findTermType')

// 查询发货仓库组织
export const findFacility = params => get('/api/rabbit-customer/customerData/findFacility')

// 查询国家列表数据
export const findCountryList = params => get('/api/rabbit-customer/customerData/findCountryList')

// 查询地址应用目的
export const findAddressTypeList = params => get('/api/rabbit-customer/customerData/findAddressTypeList')

// 查询产业
export const findPartyGroupByPartyId = params => get('/api/rabbit-customer/customerData/findPartyGroupByPartyId')

// 获取内部注册客户的信息(编辑查询)
export const getCustomerInfoByPartyId = params => get('/api/rabbit-customer/customerData/getCustomerInfoByPartyId', params)

// 修改客户信息（编辑保存）
export const updateCustomerByInsider = params => get('/api/rabbit-customer/customerData/updateCustomerByInsider', params)

// 根据传入参数获取区域 销售公司 销售小组
export const getCustomerBasicInfo = params => get('/api/rabbit-customer/customerData/getCustomerBasicInfo', params)

// 获取销售代表
export const getSalesRepresentativeBySalesParty = params => get('/api/rabbit-customer/customerData/getSalesRepresentativeBySalesParty', params)

// 获取客户类型列表
export const findCustomerTypeByPartyType = params => get('/api/rabbit-customer/customerData/findCustomerTypeByPartyType', params)

// 获取客户角色列表
export const findCustomerRoleByEnumeration = params => get('/api/rabbit-customer/customerData/findCustomerRoleByEnumeration', params)

// 获取客户状态列表
export const findCustomerStatusByEnumeration = params => get('/api/rabbit-customer/customerData/findCustomerStatusByEnumeration', params)


