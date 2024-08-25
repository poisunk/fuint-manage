import request from "../utils/request"

interface CateListParams {
    page: number
    pageSize: number
    name: string
    status: string
    storeId: string
}

export function getGoodsCategoryList(params: CateListParams) {
    return request({
        url: "/backendApi/goods/cate/list",
        method: "get",
        params: params
    })
}

interface saveCategoryParams {
    name: string
    storeId: string
    sort: number
    description: string
    logo: string
    status: string
}

export function saveGoodsCategory(data: saveCategoryParams) {
    return request({
        url: "/backendApi/goods/cate/save",
        method: "post",
        data: data
    })
}

interface UpdateCategoryParams {
    id: string
    status: string
}

export function updateGoodsCategoryStatus(data: UpdateCategoryParams) {
    return request({
        url: "/backendApi/goods/cate/updateStatus",
        method: "post",
        data: data
    })
}