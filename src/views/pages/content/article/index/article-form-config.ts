export const formConfigs = [
    {
        type: 'input',
        label: '标题',
        field: 'title',
        placeholder: '请输入标题',
        required: true,
    },
    {
        type: 'textarea',
        label: '简介',
        field: 'brief',
        placeholder: '请输入简介',
    },
    {
        type: 'upload',
        label: '图片',
        field: 'image',
        placeholder: "（提示：点击图片修改，建议尺寸：640 x 350）",
        imageUrl: ''
    },
    {
        type: 'input-number',
        label: '排序',
        field: 'sort',
        placeholder: '提示：数值越小，排行越靠前',
    },
    {
        type: 'slot',
        label: '内容',
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