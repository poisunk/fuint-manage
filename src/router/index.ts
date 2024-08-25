import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home.vue'
import { useUserStore } from '../store/user'

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


router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (!userStore.init && to.path !== '/login') {
        next('/login');
    } else if (userStore.init && to.path === '/login') {
        next('/dashboard');
    } else {
        next();
    }
})

export default router;
