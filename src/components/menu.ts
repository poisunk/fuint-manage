export const menuData = [
    {
        name: '内容管理',
        path: '/content',
        icon: 'Edit',
        children: [
            {
                name: '轮播管理',
                path: '/content/banner/list',
                icon: 'CircleCheck',
            },
            {
                name: '文章管理',
                path: '/content/article',
                icon: 'CircleCheck',
            }
        ]
    },
    {
        name: '店铺管理',
        path: '/store',
        icon: 'Shop',
        children: [
            {
                name: "店铺列表",
                path: "/store/list",
                icon: "CircleCheck",
            }
        ]
    },
    {
        name: '会员管理',
        path: '/member',
        icon: 'User',
        children: [
            {
                name: "会员分组",
                path: "/member/group",
                icon: "CircleCheck",
            },
            {
                name: "会员列表",
                path: "/member/list",
                icon: "CircleCheck",
            },
            {
                name: "会员等级",
                path: "/member/grade",
                icon: "CircleCheck",
            },
            {
                name: "开卡赠礼",
                path: "/member/openGift",
                icon: "CircleCheck",
            },
            {
                name: "会员设置",
                path: "/member/setting",
                icon: "CircleCheck",
            }
        ]
    },
    {
        name: '卡券管理',
        path: '/coupon',
        icon: 'Ticket',
        children: [
            {
                name: "分组管理",
                path: "/coupon/group",
                icon: "CircleCheck",
            },
            {
                name: "卡券列表",
                path: "/coupon/list",
                icon: "CircleCheck",
            }
        ]
    },
    {
        name: '订单管理',
        path: '/order',
        icon: 'List',
        children: [
            {
                name: "订单列表",
                path: "/order/list",
                icon: "CircleCheck",
            },
            {
                name: "售后订单",
                path: "/order/refund",
                icon: "CircleCheck",
            },
            {
                name: "交易设置",
                path: "/order/setting",
                icon: "CircleCheck",
            }
        ]
    },
    {
        name: '商品管理',
        path: '/goods',
        icon: 'Goods',
        children: [
            {
                name: '商品分类',
                path: '/goods/category',
                icon: 'CircleCheck',
            },
            {
                name: '商品列表',
                path: '/goods/list',
                icon: 'CircleCheck',
            },
            {
                name: '库存管理',
                path: '/goods/stock',
                icon: 'CircleCheck',
            },
        ]
    },
    {
        name: '积分管理',
        path: '/point',
        icon: 'Coin',
        children: [
            {
                name: '积分设置',
                path: '/point/setting',
                icon: 'CircleCheck',
            },
            {
                name: '积分明细',
                path: '/point/record',
                icon: 'CircleCheck',
            }
        ],
    },
    {
        name: '充值管理',
        path: '/balance',
        icon: 'CreditCard',
        children: [
            {
                name: '充值设置',
                path: '/balance/setting',
                icon: 'CircleCheck',
            },
            {
                name: '余额明细',
                path: '/balance/record',
                icon: 'CircleCheck',
            }
        ],
    },
    {
        name: '系统管理',
        path: '/system',
        icon: 'Setting',
        children: [
            {
                name: '后台菜单',
                path: '/system/menu',
                icon: 'CircleCheck',
            },
            {
                name: '后台日志',
                path: '/system/logs',
                icon: 'CircleCheck',
            },
            {
                name: '后台角色',
                path: '/system/role',
                icon: 'CircleCheck',
            },
            {
                name: '后台管理员',
                path: '/system/account',
                icon: 'CircleCheck',
            }
        ],
    }
]