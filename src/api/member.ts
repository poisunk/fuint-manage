import request from "../utils/request.ts"

interface MemberGradeListParams {
    page: number
    pageSize: number
    name: string
    status: string
    catchType: string
}

export function getMemberGradeList(params: MemberGradeListParams) {
    return request({
        url: "/backendApi/userGrade/list",
        method: "get",
        params: params
    })
}

interface SaveMemberGradeParams {
    id?: number
    name: string
    catchCondition: string
    userPrivilege: string
    catchType: string
    catchValue: string
    validDay: string
    discount: string
    speedPoint: string
    status: string
}

export function saveMemberGrade(params: SaveMemberGradeParams) {
    return request({
        url: "/backendApi/userGrade/save",
        method: "post",
        data: params
    })
}

interface UpdateMemberGradeStatusParams {
    userGradeId: number
    status: string
}

export function updateMemberGradeStatus(params: UpdateMemberGradeStatusParams) {
    return request({
        url: "/backendApi/userGrade/updateStatus",
        method: "post",
        data: params
    })
}

export function deleteMemberGrade(userGradeId: number) {
    return request({
        url: "/backendApi/userGrade/delete/" + userGradeId,
        method: "get",
    })
}

interface MemberListParams {
    page: number
    pageSize: number
    name: string
    mobile: string
    status: string
}

export function getMemberList(params: MemberListParams) {
    return request({
        url: "/backendApi/member/list",
        method: "get",
        params: params
    })
}

interface UpdateMemberStatusParams {
    userId: number
    status: string
}

export function updateMemberStatus(params: UpdateMemberStatusParams) {
    return request({
        url: "/backendApi/member/updateStatus",
        method: "post",
        data: params
    })
}

export function deleteMember(userId: number) {
    return request({
        url: "/backendApi/member/delete/" + userId,
        method: "get",
    })
}

interface SaveMemberParams {
    id: string
    name: string
    storeId: number
    groupId: number
    gradeId: number
    startTime: string
    endTime: string
    userNo: string
    mobile: string
    sex: string
    idcard: string
    birthday: string
    address: string
    status: string
    description: string
}

export function saveMember(params: SaveMemberParams) {
    return request({
        url: "/backendApi/member/save",
        method: "post",
        data: params
    })
}

interface ResetMemberPasswordParams {
    userId: number
    password: string
}

export function resetMemberPassword(params: ResetMemberPasswordParams) {
    return request({
        url: "/backendApi/member/resetPwd",
        method: "post",
        data: params
    })
}

export function getTotalMember() {
    return request({
        url: "/backendApi/statistic/totalMember",
        method: "get",
    })
}

interface MemberGroupListParams {
    page: number
    pageSize: number
    name: string
    id: string
    status: string
}

export function searchMemberGroupList(params: MemberGroupListParams) {
    return request({
        url: "/backendApi/memberGroup/list",
        method: "get",
        params: params
    })
}

interface SaveMemberGroupParams {
    id: string
    name: string
    description: string
    status: string
}

export function saveMemberGroup(params: SaveMemberGroupParams) {
    return request({
        url: "/backendApi/memberGroup/save",
        method: "post",
        data: params
    })
}

export function deleteMemberGroup(id: number) {
    return request({
        url: "/backendApi/memberGroup/delete/" + id,
        method: "get",
    })
}

interface UpdateMemberGroupStatusParams {
    id: number
    status: string
}

export function updateMemberGroupStatus(params: UpdateMemberGroupStatusParams) {
    return request({
        url: "/backendApi/memberGroup/updateStatus",
        method: "post",
        data: params
    })
}

export function getMemberGroupList() {
    return request({
        url: "/backendApi/member/groupList",
        method: "get",
    })
}

interface SearchMemberListParams {
    groupIds: string
    keyword: string
}

export function searchMemberList(params: SearchMemberListParams) {
    return request({
        url: "/backendApi/member/searchMembers",
        method: "get",
        params: params
    })
}
