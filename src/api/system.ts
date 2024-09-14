import request from "../utils/request.ts";

export function getSystemLogList(params: any) {
    return request({
        url: "/backendApi/actlog/list",
        method: "get",
        params
    });
}