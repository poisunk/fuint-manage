import request from "@/utils/request";

interface SearchOrderListParams {
    page: number
    pageSize: number
    userId: string
    mobile: string
    orderSn: string
    type: string
    storeId: string
    status: string
    payStatus: string
    orderMode: string
    startTime: string
    endTime: string
}

export function searchOrderList(params: SearchOrderListParams) {
    return request({
        url: "/backendApi/order/list",
        method: "post",
        data: params
    });
}

export function deleteOrder(id: string) {
    return request({
        url: "/backendApi/order/delete/" + id,
        method: "get",
    });
}

export function getOrderInfo(id: string) {
    return request({
        url: "/backendApi/order/info/" + id,
        method: "get",
    });
}