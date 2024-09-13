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

interface RefundListParams {
    page: number
    pageSize: number
    orderSn: string
    mobile: string
    userId: string
    status: string
    startTime: string
    endTime: string
}

export function searchRefundList(params: RefundListParams) {
    return request({
        url: "/backendApi/refund/list",
        method: "get",
        params
    });
}

interface SaveRefundParams {
    refundId: string
    status: string
    rejectReason: string
}

export function saveRefund(params: SaveRefundParams) {
    return request({
        url: "/backendApi/refund/save",
        method: "post",
        data: params
    });
}