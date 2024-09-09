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