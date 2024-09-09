export const formConfigs = [
    {
        type: 'input',
        label: '等级',
        field: 'grade',
        placeholder: '请输入会员等级',
        required: true,
    },
    {
        type: 'input',
        label: '等级名称',
        field: 'name',
        placeholder: '请输入等级名称',
        required: true,
    },
    {
        type: 'input',
        label: '升级条件描述',
        field: 'catchCondition',
        placeholder: '请输入升级条件描述',
    },
    {
        type: 'textarea',
        label: '升级权益描述',
        field: 'userPrivilege',
        placeholder: '请输入升级权益描述',
    },
    {
        type: 'select',
        label: '升级方式',
        field: 'catchType',
        placeholder: '升级方式',
        options: [],
        required: true,
    },
    {
        type: 'input',
        label: '升级条件值',
        field: 'catchValue',
        placeholder: '请输入升级条件值',
        required: true,
    },
    {
        type: 'input',
        label: '有效天数',
        field: 'validDay',
        placeholder: '请输入有效天数，0表示永久有效',
        required: true,
    },
    {
        type: 'input',
        label: '支付折扣',
        field: 'discount',
        placeholder: '请输入支付折扣，如: 8.8',
        required: true,
    },
    {
        type: 'input',
        label: '积分加速',
        field: 'speedPoint',
        placeholder: '请输入积分加速倍数',
        required: true,
    },
    {
        type: 'radio',
        label: '状态',
        field: 'status',
        options: [
            { label: '启用', value: 'A' },
            { label: '禁用', value: 'N' },
        ],
    }
]