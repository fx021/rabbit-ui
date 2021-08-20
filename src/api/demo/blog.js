import request from "@/router/axios";
export const getList = (current, size, params) => {
  return request({
    url: "/api/rabbit-desk/blog/list",
    method: "get",
    params: { ...params, current, size }
  });
};
export const getDetail = id => {
  return request({
    url: "/api/rabbit-desk/blog/detail",
    method: "get",
    params: { id }
  });
};
export const remove = ids => {
  return request({
    url: "/api/rabbit-desk/blog/remove",
    method: "post",
    params: { ids }
  });
};
export const submit = row => {
  return request({
    url: "/api/rabbit-desk/blog/submit",
    method: "post",
    data: row
  });
};
