export const formConfigs = [
    {
        type: 'input',
        label: '分组名称',
        field: 'name',
        placeholder: '请输入分组名称',
        required: true,
    },
    {
        type: 'textarea',
        label: '备注信息',
        field: 'description',
        placeholder: '请输入备注信息',
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