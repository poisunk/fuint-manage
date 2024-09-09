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

interface GoodsListParams {
    page: number
    pageSize: number
    name: string
    goodsNo: string
    isSingleSpec: string
    type: string
    storeId: string
    stock: string
    cateId: string
    status: string
}

export function getGoodsList(data: GoodsListParams) {
    return request({
        url: "/backendApi/goods/goods/list",
        method: "get",
        params: data
    })
}

export function getGoodsInfo(id: Number) {
    return request({
        url: "/backendApi/goods/goods/info/" + id,
        method: "get",
    })
}

interface SaveGoodsParams {
    type?: string
    name?: string
    goodsNo?: string
    cateId?: string
    storeId?: string
    sort?: number
    status?: string
    images?: string[]
    canUsePoint?: string
    isMemberDiscount?: string
    isSingleSpec?: string
    stock?: string
    price?: string
    linePrice?: string
    initSale?: string
    salePoint?: string
    description?: string
}

export function saveGoods(data: SaveGoodsParams) {
    return request({
        url: "/backendApi/goods/goods/save",
        method: "post",
        data: data
    })
}

interface UpdateGoodsParams {
    id: string
    status: string
}

export function updateGoodsStatus(data: UpdateGoodsParams) {
    return request({
        url: "/backendApi/goods/goods/updateStatus",
        method: "post",
        data: data
    })
}

interface SaveSpecNameParams {
    goodsId: string
    name: string
}

export function saveGoodsSpecName(data: SaveSpecNameParams) {
    return request({
        url: "/backendApi/goods/goods/saveSpecName",
        method: "post",
        data: data
    })
}

interface SaveSpecValueParams {
    goodsId: string
    specName: string
    value: string
}

export function saveGoodsSpecValue(data: SaveSpecValueParams) {
    return request({
        url: "/backendApi/goods/goods/saveSpecValue",
        method: "post",
        data: data
    })
}

export function deleteGoodsSpec(goodsId: string, specName: string) {
    return request({
        url: "/backendApi/goods/goods/deleteSpec?goodsId=" + goodsId + " &specName=" + specName,
        method: "get",
    })
}

export function deleteGoodsSpecValue(id: string) {
    return request({
        url: "/backendApi/goods/goods/deleteSpecValue?id=" + id,
        method: "get",
    })
}

interface StockListParams {
    page: number
    pageSize: number
    storeId: string
    description: string
    type: string
}

export function getStockList(data: StockListParams) {
    return request({
        url: "/backendApi/stock/list",
        method: "get",
        params: data
    })
}

interface SaveStockParams {
    storeId: string
    description: string
    type: string
    goodsList?: any
}

export function saveStockInfo(data: SaveStockParams) {
    return request({
        url: "/backendApi/stock/save",
        method: "post",
        data: data
    })
}

export function deleteStock(id: string) {
    return request({
        url: "/backendApi/stock/delete",
        method: "post",
        data: { id: id }
    })
}

export function getStockInfo(id: string) {
    return request({
        url: "/backendApi/stock/info/" + id,
        method: "get",
    })
}

interface SelectGoodsParams {
    page?: number
    pageSize?: number
    merchantId?: string
    storeId?: string
    cateId?: string
    keyword?: string
}

export function selectGoodsList(data: SelectGoodsParams) {
    return request({
        url: "/backendApi/goods/goods/selectGoods",
        method: "post",
        data: data
    })
}
