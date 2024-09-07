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

interface ArticleListParams {
    page: number
    pageSize: number
    title: string
    status: string
}

export function getArticleList(params: ArticleListParams) {
    return request({
        url: "/backendApi/article/list",
        method: "get",
        params: params
    })
}

interface SaveArticleParams {
    id?: string
    title: string
    brief: string
    storeId: string
    image: string
    description: string
    sort: number
    status: string
}

export function saveArticle(data: SaveArticleParams) {
    return request({
        url: "/backendApi/article/save",
        method: "post",
        data: data
    })
}

interface UpdateArticleStatusParams {
    id: string
    status: string
}

export function updateArticleStatus(data: UpdateArticleStatusParams) {
    return request({
        url: "/backendApi/article/updateStatus",
        method: "post",
        data: data
    })
}