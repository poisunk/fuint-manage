import resquest from "../utils/request";

interface PointRechargeParams {
    amount: string;
    remark: string;
    userId: number;
    type: number;
}

export function doPointRecharge(params: PointRechargeParams) {
    return resquest({
        url: '/backendApi/point/doRecharge',
        method: 'post',
        data: params
    })
}

export function getPointSetting() {
    return resquest({
        url: '/backendApi/point/setting',
        method: 'get',
    })
}

interface SavePointSettingParams {
    pointNeedConsume: string
    canUsedAsMoney: string
    exchangeNeedPoint: string
    rechargePointSpeed: string
    status: string
}

export function savePointSetting(params: SavePointSettingParams) {
    return resquest({
        url: '/backendApi/point/saveSetting',
        method: 'post',
        data: params
    })
}

interface PointListParams {
    page: number
    pageSize: number
    userId: string
    userNo: string
    mobile: string
    status: string
}

export function getPointList(params: PointListParams) {
    return resquest({
        url: '/backendApi/point/list',
        method: 'get',
        params
    })
}