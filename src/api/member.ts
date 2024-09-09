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