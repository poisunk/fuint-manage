import { defineStore } from "pinia"

export const usePermissStore = defineStore("permiss", {
    state: () => {
        const token = localStorage.getItem("fuint-admin-token")
        return {
            token: token
        }
    },
    actions: {
        setToken(token: string) {
            localStorage.setItem("fuint-admin-token", token)
            this.token = token
        },
        removeToken() {
            localStorage.removeItem("fuint-admin-token")
            this.token = null
        }
    }
})