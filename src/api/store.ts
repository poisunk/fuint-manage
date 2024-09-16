import request from "../utils/request.ts"

interface StoreListParams {
    page: number
    pageSize: number
    name: string
    status: string
}

export function getStoreList(params: StoreListParams) {
    return request({
        url: "/backendApi/store/list",
        method: "get",
        params
    })
}

interface UpdateStoreStatusParams {
    storeId: string
    status: string
}

export function updateStoreStatus(params: UpdateStoreStatusParams) {
    return request({
        url: "/backendApi/store/updateStatus",
        method: "post",
        data: params
    })
}

interface SaveStoreParams {
    id?: string
    name: string,
    logo: string,
    isDefault: string,
    merchantId: number,
    contact: string,
    phone: string,
    address: string,
    hours: string,
    longitude: string,
    latitude: string,
    license: string,
    creditCode: string,
    bankName: string,
    bankCardName: string,
    bankCardNo: string,
    wxMchId: string,
    wxApiV2: string,
    wxCertPath: string,
    alipayAppId: string,
    alipayPrivateKey: string,
    alipayPublicKey: string,
    description: string,
    status: string,
}

export function saveStore(params: SaveStoreParams) {
    return request({
        url: "/backendApi/store/save",
        method: "post",
        data: params
    })
}

interface SearchStoreListParams {
    merchantId?: string
    id?: string
    name?: string
}

export function searchStoreList(params: SearchStoreListParams) {
    return request({
        url: "/backendApi/store/searchStore",
        method: "get",
        params
    })
}