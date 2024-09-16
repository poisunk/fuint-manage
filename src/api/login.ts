import request from "../utils/request.ts"

interface LoginParams {
    captchaCode: string;
    password: string;
    username: string;
    uuid: string;
}

export function getCode() {
    return request({
        url: "/clientApi/captcha/getCode",
        method: "get"
    })
}

export function doLogin(params: LoginParams) {
    return request({
        url: "/backendApi/login/doLogin",
        method: "post",
        data: params
    })
}

export function getLoginInfo() {
    return request({
        url: "/backendApi/login/getInfo",
        method: "get"
    })
}

export function getRouters() {
    return request({
        url: "/backendApi/login/getRouters",
        method: "get"
    })
}
