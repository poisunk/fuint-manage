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

interface SearchRoleListParams {
    page: number
    pageSize: number
    name: string
    status: string
}

export function searchRoleList(params: SearchRoleListParams) {
    return request({
        url: "/backendApi/duty/list",
        method: "get",
        params
    });
}

interface RoleParams {
    id?: string
    roleName: string
    roleType: string
    status: string
    description: string
    menuIds: any
}

export function addSystemRole(params: RoleParams) {
    return request({
        url: "/backendApi/duty/add",
        method: "post",
        data: params
    });
}

export function updateSystemRole(params: RoleParams) {
    return request({
        url: "/backendApi/duty/update",
        method: "post",
        data: params
    });
}

export function deleteSystemRole(id: string) {
    return request({
        url: "/backendApi/duty/delete/" + id,
        method: "post",
    });
}

interface UpdateRoleStatusParams {
    roleId: string
    status: string
}

export function updateRoleStatus(params: UpdateRoleStatusParams) {
    return request({
        url: "/backendApi/duty/updateStatus",
        method: "post",
        data: params
    });
}

export function getSystemRoleInfo(roleId: string) {
    return request({
        url: "/backendApi/duty/info/" + roleId,
        method: "get",
    });
}

interface AccountListParams {
    page: number
    pageSize: number
    accountName: string
    realName: string
    accountStatus: string
}

export function getAccountList(params: AccountListParams) {
    return request({
        url: "/backendApi/account/list",
        method: "get",
        params
    });
}

export function getAccountInfo(userId: string | number) {
    return request({
        url: "/backendApi/account/info/" + userId,
        method: "get",
    });
}

interface AccountParams {
    id?: string
    accountName: string
    accountStatus: string
    realName: string
    password?: string
    storeId: string
    merchantId: string
    staffId?: string
    roleIds: string
}

export function doCreateAccount(params: AccountParams) {
    return request({
        url: "/backendApi/account/doCreate",
        method: "post",
        data: params
    });
}

export function doUpdateAccount(params: AccountParams) {
    return request({
        url: "/backendApi/account/update",
        method: "post",
        data: params
    });
}

export function deleteAccount(id: string) {
    return request({
        url: "/backendApi/account/delete/" + id,
        method: "get",
    });
}

interface UpdateAccountStatusParams {
    userId: string
    status: number
}

export function updateAccountStatus(params: UpdateAccountStatusParams) {
    return request({
        url: "/backendApi/account/updateStatus",
        method: "post",
        data: params
    });
}

interface ResetAccountPwdParams {
    userId: string
    password: string
}

export function resetAccountPwd(params: ResetAccountPwdParams) {
    return request({
        url: "/backendApi/account/resetPwd",
        method: "post",
        data: params
    });
}

