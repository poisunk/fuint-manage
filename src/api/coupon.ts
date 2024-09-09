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