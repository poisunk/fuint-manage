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
                        path: '/member/grade',
                        name: '会员等级',
                        component: () => import('../views/pages/member/grade/index.vue')
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
