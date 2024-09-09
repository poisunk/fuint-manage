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
