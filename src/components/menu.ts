import path from "path";

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