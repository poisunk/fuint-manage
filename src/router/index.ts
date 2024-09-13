import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue';
import { useUserStore } from '../store/user';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/pages/dashboard.vue'),
            },
            {
                path: '/content',
                name: '内容管理',
                children: [
                    {
                        path: '/content/banner',
                        name: '轮播管理',
                        component: () => import('../views/pages/content/banner.vue')
                    },
                    {
                        path: '/content/article',
                        name: '文章管理',
                        component: () => import('../views/pages/content/article.vue')
                    },
                ]
            },
            {
                path: '/store',
                name: '店铺管理',
                children: [
                    {
                        path: '/store/list',
                        name: '店铺列表',
                        component: () => import('../views/pages/store/list/index.vue')
                    }
                ]
            },
            {
                path: '/member',
                name: '会员管理',
                children: [
                    {
                        path: '/member/group',
                        name: '会员分组',
                        component: () => import('../views/pages/member/group/index.vue')
                    },
                    {
                        path: '/member/list',
                        name: '会员列表',
                        component: () => import('../views/pages/member/list/index.vue')
                    },
                    {
                        path: '/member/grade',
                        name: '会员等级',
                        component: () => import('../views/pages/member/grade/index.vue')
                    }
                ]
            },
            {
                path: '/coupon',
                name: '卡券管理',
                children: [
                    {
                        path: '/coupon/group',
                        name: '分组管理',
                        component: () => import('../views/pages/coupon/group/index.vue')
                    },
                    {
                        path: '/coupon/list',
                        name: '卡券列表',
                        component: () => import('../views/pages/coupon/list/index.vue')
                    }
                ]
            },
            {
                path: '/order',
                name: '订单管理',
                children: [
                    {
                        path: '/order/list',
                        name: '订单列表',
                        component: () => import('../views/pages/order/list/index.vue')
                    },
                    {
                        path: '/order/refund',
                        name: '售后订单',
                        component: () => import('../views/pages/order/refund/index.vue')
                    },
                    {
                        path: '/order/setting',
                        name: '交易设置',
                        component: () => import('../views/pages/order/setting/index.vue')
                    },
                    {
                        path: '/order/detail',
                        name: '订单详情',
                        component: () => import('../views/pages/order/detail/index.vue')
                    }
                ]
            },
            {
                path: '/goods',
                name: '商品管理',
                children: [
                    {
                        path: '/goods/category',
                        name: '商品分类',
                        component: () => import('../views/pages/goods/category.vue')
                    },
                    {
                        path: '/goods/list',
                        name: '商品列表',
                        component: () => import('../views/pages/goods/goods.vue')
                    },
                    {
                        path: '/goods/add',
                        name: '添加商品',
                        component: () => import('../views/pages/goods/goods-form.vue')
                    },
                    {
                        path: '/goods/edit',
                        name: '修改商品',
                        component: () => import('../views/pages/goods/goods-form.vue')
                    },
                    {
                        path: '/goods/stock',
                        name: '库存管理',
                        component: () => import('../views/pages/goods/stock.vue')
                    },
                ]
            },
        ]
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/pages/login.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (!userStore.init && to.path !== '/login') {
        next('/login');
    } else if (userStore.init && to.path === '/login') {
        next('/dashboard');
    } else {
        next();
    }
})

router.afterEach(() => {
    NProgress.done();
})

export default router;
