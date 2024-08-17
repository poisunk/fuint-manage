import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import { usePermissStore } from '../store/permiss'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: '系统首页',
                component: () => import('../views/pages/dashboard.vue'),
            },

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
            {
                path: '/goods/category',
                name: '商品分类',
                component: () => import('../views/pages/goods/category.vue')
            },
            {
                path: '/goods/list',
                name: '商品列表',
                component: () => import('../views/pages/goods/goods.vue')
            }
        ]
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/pages/login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const permiss = usePermissStore()
    if (!permiss.token && to.path !== '/login') {
        next('/login');
    } else if (permiss.token && to.path === '/login') {
        next('/dashboard');
    } else if (permiss.token && to.path === '/') {
        next('/dashboard');
    } else {
        next();
    }
})

export default router;
