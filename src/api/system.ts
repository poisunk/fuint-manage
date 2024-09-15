import request from "../utils/request.ts";

export function getSystemLogList(params: any) {
    return request({
        url: "/backendApi/actlog/list",
        method: "get",
        params
    });
}

export function getSystemSourceList() {
    return request({
        url: "/backendApi/source/list",
        method: "get",
    });
}

export function getSystemSourceTreeList() {
    return request({
        url: "/backendApi/source/treeselect",
        method: "get",
    });
}

interface UpdateSourceParams {
    id: number
    name: string
    status: string
    parentId: string
    icon: string
    path: string
    sort: string
}

export function updateSource(params: UpdateSourceParams) {
    return request({
        url: "/backendApi/source/update",
        method: "post",
        data: params
    });
}

interface AddSourceParams {
    name: string
    status: string
    parentId: string
    icon: string
    path: string
    sort: string
}

export function addSource(params: AddSourceParams) {
    return request({
        url: "/backendApi/source/add",
        method: "post",
        data: params
    });
}

export function deleteSource(id: string) {
    return request({
        url: "/backendApi/source/delete/" + id,
        method: "get",
    });
}