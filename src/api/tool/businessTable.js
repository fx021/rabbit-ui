import request from "@/router/axios";
// import i18n from '@/lang'
// 新增保存
export const saveTableAndCols = params => {
  return request({
    url: "/api/rabbit-resource/formcustom/saveTableAndCols",
    method: "post",
    headers: {
      "content-type": "application/json;charset=utf-8"
    },
    data: params
  });
};
// 数据源,公共数据源由服务端管理吧
export const getDataSource = query => {
  // const defSource = { name: i18n.t('commonDataSource'), id: '0' }

  return new Promise((resolve, reject) => {
    request({
      url: "/api/rabbit-resource/formcustom/getDataSource",
      method: "get",
      params: { name: query }
    }).then(res => {
      let data = res.data.data || []
      // data.unshift(defSource)
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
};

// 主表名称
export const selectMainTable = sourceId => {
  return request({
    url: "/api/rabbit-resource/formcustom/selectMainTable",
    method: "get",
    params: {
      'sourceId': sourceId
    }
  });
};


// 主表名称
export const selectByTableName = params => {
  return request({
    url: "/api/rabbit-resource/formcustom/selectByTableName",
    method: "get",
    params
  });
};

// 字段类型
export const selectColtype = () => {
  return request({
    url: "/api/rabbit-resource/formcustom/selectColtype",
    method: "get"

  });
};

// 修改
export const selectTables = (tableId) => {
  return request({
    url: "/api/rabbit-resource/formcustom/selectTables",
    method: "post",
    data: {
      "tableId": tableId
    }
  });
};

//   修改保存
export const updateTable = params => {
  return request({
    url: "/api/rabbit-resource/formcustom/table",
    method: "put",
    headers: {
      "content-type": "application/json;charset=utf-8"
    },
    data: params
  });
};

/**
 * 加载表字段和备注等
 */
export const loadTablCols = params => {
  return request({
    url: "/api/rabbit-resource/formcustom/table-info",
    method: "get",
    params: params
  });
};
