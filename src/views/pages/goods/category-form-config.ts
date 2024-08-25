export const formConfigs = [
    {
        type: 'input',
        label: '分类名称',
        field: 'name',
        placeholder: '请输入分类名称',
        required: true,
    },
    {
        type: 'select',
        label: '所属店铺',
        field: 'storeId',
        placeholder: '所属店铺,为空则属于公共店铺',
        options: [],
    },
    {
        type: 'input-number',
        label: '排序',
        field: 'sort',
        placeholder: '提示：数值越小，排行越靠前',
    },
    {
        type: 'upload',
        label: '图片',
        field: 'logo',
        placeholder: '（提示：点击图片修改，建议尺寸：128 x 128）',
    },
    {
        type: 'textarea',
        label: '备注信息',
        field: 'description',
        placeholder: '请输入内容',
    },
    {
        type: 'radio',
        label: '状态',
        field: 'status',
        options: [
            {
                label: '启用',
                value: 'A'
            },
            {
                label: '禁用',
                value: 'N'
            }
        ]
    }
]