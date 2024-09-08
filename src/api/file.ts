import request from "../utils/request"

export function uploadFile(data: any) {
    return request({
        url: "/clientApi/file/upload",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: data
    })
}

export function backendUploadFile(data: any) {
    return request({
        url: "/backendApi/file/upload",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: data
    })
}