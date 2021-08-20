import request from "@/router/axios";
// 分页查询
export const selectTables = (params) => {
  return request({
    url: "/api/rabbit-resource/formcustom/selectTables",
    headers: {
      "content-type": "application/json;charset=utf-8"
    },
    method: "post",
    data: {
      "size": params.size,
      "current": params.current,
      "rabbitFormTables": {
        "tbName": params.tbName,
        "sourceId": params.sourceId,
        "headerId": params.headerId,
        "tbDescription": params.tbDescription
      }
    }
  });
};

// 同步
export const createTable = (tableId) => {
  return request({
    url: "/api/rabbit-resource/formcustom/createTable",

    method: "get",
    params: {
      "tableId": tableId
    }
  });
};

// 删除前的询问
export const tableSize = (tableId) => {
  return request({
    url: "/api/rabbit-resource/formcustom/tableSize",
    method: "get",
    params: {
      "tableId": tableId
    }
  });
};

// 正式删除
export const deleteTable = (tableId) => {
  return request({
    url: "/api/rabbit-resource/formcustom/table",
    method: "delete",
    params: {
      "tableId": tableId
    }
  });
};


// 主表名称
export const selectByHeaderName = (tableName) => {
  return request({
    url: "/api/rabbit-resource/formcustom/selectByHeaderName",
    method: "get",
    params: {
      "tableName": tableName
    }
  });
};
