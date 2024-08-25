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