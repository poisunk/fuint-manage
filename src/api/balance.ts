import resquest from "../utils/request";

interface BalanceRechargeParams {
    amount: string;
    remark: string;
    userId: number;
    type: number;
}

export function doBalanceRecharge(params: BalanceRechargeParams) {
    return resquest({
        url: '/backendApi/balance/doRecharge',
        method: 'post',
        data: params
    })
}

export function getBalanceSetting() {
    return resquest({
        url: '/backendApi/balance/setting',
        method: 'get'
    })
}

interface SaveBalanceSettingParams {
    rechargeItem: string
    remark: string
    status: string
}

export function saveBalanceSetting(params: SaveBalanceSettingParams) {
    return resquest({
        url: '/backendApi/balance/saveSetting',
        method: 'post',
        data: params
    })
}