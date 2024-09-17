import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/home.vue';
import { useUserStore } from '../store/user';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getRouters } from '../api/login';

const modules = import.meta.glob('@/views/**/**.vue');

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/pages/dashboard.vue'),
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

await initRouters();

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
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
export async function initRouters() {
    await getRouters().then((res) => {
        if (res.data.code == 200) {
            const menuList = res.data.data;

            let routers: any[] = [];
            for (let i = 0; i < menuList.length; i++) {
                let route = {
                    path: menuList[i].path,
                    name: menuList[i].name,
                    meta: menuList[i].meta
                }

                if (menuList[i].children) {
                    let childrenRoutes: any[] = [];
                    for (let j = 0; j < menuList[i].children.length; j++) {
                        childrenRoutes.push({
                            path: menuList[i].children[j].path,
                            name: menuList[i].children[j].name,
                            meta: menuList[i].children[j].meta,
                            component: modules[`/src/views/pages${menuList[i].children[j].path}/index.vue`],

                        })
                    }
                    Object.assign(route, {
                        children: childrenRoutes
                    })
                }

                routers.push(route)
            }

            routers.forEach((item: any) => {
                router.addRoute('Home', item)
            });
        }
    })
}