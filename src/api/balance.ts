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