import { defineStore } from "pinia";
import { doLogin, getLoginInfo } from "../api/login";
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
            userInfo: null
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
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                }).catch((err) => {
                    reject(err);
                })
            });
        },

        logout() {
            return new Promise((resolve, reject) => {
                removeToken('Access-Token');
                this.init = false;
                this.token = "";
                resolve(true);
            });
        }
    },

    persist: {
        enabled: true,
    },
})