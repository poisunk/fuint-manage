import request from "../util/request.ts"

export function getHomeInfo() {
    return request({
        url: "/backendApi/home/index",
        method: "get"
    })
}

export function getHomeStatistics(tag: string) {
    return request({
        url: "/backendApi/home/statistic",
        method: "get",
        params: {
            tag: tag
        }
    })
}