export const menuData = [
    {
        name: '内容管理',
        path: '/content',
        icon: 'Edit',
        children: [
            {
                name: '轮播管理',
                path: '/content/banner',
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
]