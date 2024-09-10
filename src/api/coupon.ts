import request from "../utils/request.ts";

interface CouponGroupListParams {
    page: number
    pageSize: number
    id: string
    name: string
    status: string
}

export function getCouponGroupList(params: CouponGroupListParams) {
    return request({
        url: '/backendApi/couponGroup/list',
        method: 'get',
        params
    })
}

interface SaveCouponGroupParams {
    id: string
    name: string
    description: string
    status: string
}

export function saveCouponGroup(params: SaveCouponGroupParams) {
    return request({
        url: '/backendApi/couponGroup/save',
        method: 'post',
        data: params
    })
}

interface UpdateCouponGroupStatusParams {
    id: string
    status: string
}

export function updateCouponGroupStatus(params: UpdateCouponGroupStatusParams) {
    return request({
        url: '/backendApi/couponGroup/updateStatus',
        method: 'post',
        data: params
    })
}

export function deleteCouponGroup(id: string) {
    return request({
        url: '/backendApi/couponGroup/delete/' + id,
        method: 'get',
    })
}

export function quickSearchCouponGroupList() {
    return request({
        url: '/backendApi/couponGroup/quickSearch',
        method: 'get',
    })
}

interface CouponListParams {
    page: number
    pageSize: number
    id: string
    groupId: string
    name: string
    type: string
    status: string
}

export function getCouponList(params: CouponListParams) {
    return request({
        url: '/backendApi/coupon/list',
        method: 'get',
        params
    })
}

interface SaveCouponParams {
    id: string
    type: string
    groupId: string
    name: string
    expireType: string
    expireTime: string
    beginTime: string
    endTime: string
    amount: string
    sendWay: string
    total: string
    outRule: string
    isGive: string
    goodsIds: any
    inRule: any
}

export function saveCoupon(params: SaveCouponParams) {
    return request({
        url: '/backendApi/coupon/save',
        method: 'post',
        data: params
    })
}

export function deleteCoupon(id: string) {
    return request({
        url: '/backendApi/coupon/delete/' + id,
        method: 'get',
    })
}

interface SendCounponparams {
    couponId: string
    userIds: string
    mobile: string
    num: string
    object: string
}

export function sendCounpon(params: SendCounponparams) {
    return request({
        url: '/backendApi/coupon/sendCoupon',
        method: 'get',
        params
    })
}