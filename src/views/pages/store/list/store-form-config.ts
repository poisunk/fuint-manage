import { placeholderSign } from "element-plus/es/components/table-v2/src/private";

export const formConfigs = [
    {
        type: 'input',
        label: '店铺名称',
        field: 'name',
        placeholder: '请输入店铺名称',
        required: true,
    },
    {
        type: 'upload',
        label: '商户logo',
        field: 'logo',
        placeholder: '（提示：点击图片修改）',
        imageUrl: ''
    },
    {
        type: 'radio',
        label: '是否默认店铺',
        field: 'isDefault',
        options: [
            {
                label: '否',
                value: 'N'
            },
            {
                label: '是',
                value: 'Y'
            },
        ]
    },
    {
        type: 'select',
        label: '所属商户',
        field: 'merchantId',
        placeholder: '请选择所属商户',
        options: [],
        required: true
    },
    {
        type: 'input',
        label: '联系人姓名',
        field: 'contact',
        placeholder: '请输入联系人',
        required: true
    },
    {
        type: 'input',
        label: '联系人电话',
        field: 'phone',
        placeholder: '请输入联系人电话',
        required: true
    },
    {
        type: 'input',
        label: '店铺详细地址',
        field: 'address',
        placeholder: '请输入店铺详细地址',
    },
    {
        type: 'input',
        label: '营业时间',
        field: 'hours',
        placeholder: '请输入营业时间',
    },
    {
        type: 'input',
        label: '店铺纬度',
        field: 'longitude',
        placeholder: '请输入店铺纬度',
    },
    {
        type: 'input',
        label: '店铺经度',
        field: 'latitude',
        placeholder: '请输入店铺经度',
    },
    {
        type: 'upload',
        label: '营业执照',
        field: 'license',
        placeholder: '（提示：点击图片修改）',
        imageUrl: ''
    },
    {
        type: 'input',
        label: '统一社会信用码',
        field: 'creditCode',
        placeholder: '请输入统一社会信用码',
    },
    {
        type: 'input',
        label: '银行名称',
        field: 'bankName',
        placeholder: '请输入银行名称',
    },
    {
        type: 'input',
        label: '银行卡账户名',
        field: 'bankCardName',
        placeholder: '请输入银行卡账户名',
    },
    {
        type: 'input',
        label: '银行卡卡号',
        field: 'bankCardNo',
        placeholder: '请输入银行卡卡号',
    },
    {
        type: 'input',
        label: '微信支付商户号',
        field: 'wxMchId',
        placeholder: '请输入微信支付商户号，为空则资金进入平台账户',
    },
    {
        type: 'input',
        label: '微信支付APIv2',
        field: 'wxApiV2',
        placeholder: '请输入微信支付APIv2，为空则资金进入平台账户',
    },
    {
        type: 'upload-file',
        label: '微信支付证书',
        field: 'wxCertPath',
        fileList: [],
    },
    {
        type: 'input',
        label: '支付宝appId',
        field: 'alipayAppId',
        placeholder: '请输入支付宝appId，为空则资金进入平台账户',
    },
    {
        type: 'input',
        label: '支付宝应用私钥',
        field: 'alipayPrivateKey',
        placeholder: '请输入支付宝应用私钥，为空则资金进入平台账户',
    },
    {
        type: 'input',
        label: '支付宝支付公钥',
        field: 'alipayPublicKey',
        placeholder: '请输入支付宝支付公钥，为空则资金进入平台账户',
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
            {
                label: '启用',
                value: 'A'
            },
            {
                label: '禁用',
                value: 'N'
            },
        ]
    }
]