import request from "@/utils/request";


interface CreateQrCodeParams {
    id: string
    type: string
}

export function createQrcode(params: CreateQrCodeParams) {
    return request({
        url: "/backendApi/common/createQrCode",
        method: "post",
        data: params
    })
}