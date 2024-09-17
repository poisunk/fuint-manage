export const formConfigs = [
    {
        type: 'select',
        label: '会员等级',
        field: 'gradeId',
        placeholder: '请输入会员等级',
        options: [],
        required: true,
    },
    {
        type: 'input',
        label: '卡券ID',
        field: 'couponId',
        placeholder: '请输入要赠送的卡券ID',
    },
    {
        type: 'input',
        label: '卡券数量',
        field: 'couponNum',
        placeholder: '请输入赠送的卡券数量',
    },
    {
        type: 'input',
        label: '积分数量',
        field: 'point',
        placeholder: '请输入赠送的积分数量',
    }
]