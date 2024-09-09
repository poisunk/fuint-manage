export const formConfigs = [
    {
        type: 'input',
        label: '会员名称',
        field: 'name',
        placeholder: '请输入会员名称',
        required: true,
    },
    {
        type: 'select',
        label: '所属店铺',
        field: 'storeId',
        placeholder: '所属店铺，为空则为公共所有',
        options: [],
    },
    {
        type: 'select',
        label: '会员分组',
        field: 'groupId',
        placeholder: '会员分组',
        options: [],
    },
    {
        type: 'select',
        label: '会员等级',
        field: 'gradeId',
        placeholder: '请输入会员等级',
        options: [],
        required: true,
    },
    {
        type: 'date-range',
        label: '有效期限',
        field: 'startTime|endTime',
    },
    {
        type: 'input',
        label: '会员号',
        field: 'userNo',
        placeholder: '请输入会员号，为空则系统将自动生成',
    },
    {
        type: 'input',
        label: '手机号',
        field: 'mobile',
        placeholder: '请输入手机号',
    },
    {
        type: 'radio',
        label: '性别',
        field: 'sex',
        options: [
            { label: '男', value: 1 },
            { label: '女', value: 0 },
        ],
    },
    {
        type: 'input',
        label: '身份证号',
        field: 'idCard',
        placeholder: '请输入身份证号',
    },
    {
        type: 'input',
        label: '生日',
        field: 'birthday',
        placeholder: '请输入生日，格式：1990-01-01',
    },
    {
        type: 'input',
        label: '通讯地址',
        field: 'address',
        placeholder: '请输入通讯地址',
    },
    {
        type: 'radio',
        label: '会员状态',
        field: 'status',
        options: [
            { label: '启用', value: 'A' },
            { label: '禁用', value: 'N' },
        ],
    },
    {
        type: 'textarea',
        label: '备注',
        field: 'description',
        placeholder: '请输入备注信息',
    }
]