import request from "../utils/request.ts"

interface BannerListParams {
    page: number
    pageSize: number
    title: string
    storeId: string
    status: string
}

export function getBannerList(params: BannerListParams) {
    return request({
        url: "/backendApi/banner/list",
        method: "get",
        params: params
    })
}

interface BannerParams {
    title: string
    storeId: string
    image: string
    url: string
    sort: number
    description: string
    status: string
}

export function saveBanner(data: BannerParams) {
    return request({
        url: "/backendApi/banner/save",
        method: "post",
        data: data
    })
}

interface UpdateBannerParams {
    id: string
    status: string
}

export function updateBanner(data: UpdateBannerParams) {
    return request({
        url: "/backendApi/banner/updateStatus",
        method: "post",
        data: data
    })
}