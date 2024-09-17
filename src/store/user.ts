import { defineStore } from "pinia";
import { doLogin, getLoginInfo, getRouters } from "../api/login";
import { getToken, removeToken, setToken } from "../utils/storage";

interface LoginData {
    username: string
    password: string
    captchaCode: string
    uuid: string
}

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            token: getToken("Access-Token"),
            init: false,
            userInfo: null,
            menuList: [],
            routerInit: false,
        }
    },
    actions: {
        login(data: LoginData) {
            return new Promise((resolve, reject) => {
                doLogin(data).then((res) => {
                    if (res.data.code == 200) {
                        this.init = true;
                        this.token = res.data.data.token;
                        setToken("Access-Token", res.data.data.token);
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
            });
        },

        getInfo() {
            return new Promise((resolve, reject) => {
                getLoginInfo().then((res) => {
                    if (res.data.code == 200) {
                        this.userInfo = res.data.data;
                        this.getMenuList();
                        resolve(res.data);
                    } else {
                        this.logout();
                        reject(res.data);
                    }
                }).catch((err) => {
                    this.logout();
                    reject(err);
                })
            });
        },

        logout() {
            return new Promise((resolve, reject) => {
                removeToken('Access-Token');
                this.init = false;
                this.token = "";
                this.userInfo = null;
                this.menuList = [];
                this.routerInit = false;
                resolve(true);
            });
        },

        getMenuList() {
            return new Promise((resolve, reject) => {
                // if (this.menuList.length > 0) {
                //     resolve(this.menuList);
                //     return
                // }
                getRouters().then((res) => {
                    if (res.data.code == 200) {
                        this.menuList = res.data.data.filter((item: any) => !item.hidden);

                        for (let i = 0; i < this.menuList.length; i++) {
                            if (this.menuList[i].children) {
                                this.menuList[i].children = this.menuList[i].children.filter((item: any) => !item.hidden);
                            }
                        }

                        resolve(res.data);
                    } else {
                        this.logout();
                        reject(res.data);
                    }
                }).catch((err) => {
                    this.logout();
                    reject(err);
                })
            })
        },

        generateRoutes() {
            return new Promise(async (resolve, reject) => {
                if (this.menuList.length == 0) {
                    await this.getMenuList();
                }
                resolve(this.buildRouters(this.menuList));
            })
        },

        buildRouters(menuList: any) {
            let routes: any[] = [];

            for (let i = 0; i < menuList.length; i++) {
                let route = this.buildRoute(menuList[i], true)

                if (menuList[i].children) {
                    let childrenRoutes: any[] = [];
                    for (let j = 0; j < menuList[i].children.length; j++) {
                        childrenRoutes.push(this.buildRoute(menuList[i].children[j]))
                    }
                    Object.assign(route, {
                        children: childrenRoutes
                    })
                }

                routes.push(route)
            }

            return routes
        },

        buildRoute(menu: any, isRoot = false) {
            let route = {
                path: menu.path,
                name: menu.name,
                meta: menu.meta,
            }

            if (!isRoot) {
                Object.assign(route, {
                    component: modules[`/src/views/pages${menu.path}/index.vue`],
                })
            }
            return route
        }
    },

    persist: {
        enabled: true,
    },
})