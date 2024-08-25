export const formConfigs = [
    {
        type: 'input',
        label: '标题',
        field: 'title',
        placeholder: '请输入标题',
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
        type: 'input',
        label: '链接',
        field: 'url',
        placeholder: '请输入链接',
    },
    {
        type: 'upload',
        label: '图片',
        field: 'image',
        placeholder: '（提示：点击图片修改，建议尺寸：640 x 350）',
        required: true,
    },
    {
        type: 'input',
        label: '排序',
        field: 'sort',
        placeholder: '请输入排序，数字越小越靠前',
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
            { label: '启用', value: 'A' },
            { label: '禁用', value: 'N' },
        ],
    }
]