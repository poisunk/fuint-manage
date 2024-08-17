import { defineStore } from "pinia"

export const useMenuStore = defineStore("menu", {
    state: () => {
        return {
            data: [
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
                    name: '商品管理',
                    path: '/goods',
                    icon: 'Edit',
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
                        }
                    ]
                }
            ]
        }
    },
})