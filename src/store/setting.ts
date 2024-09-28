import { defineStore } from "pinia";


export const useSettingStore = defineStore("setting", {
    state: () => ({
        menuCollapse: false,
        menuShow: true,
    }),
    actions: {
        setMenuCollapse() {
            this.menuCollapse = !this.menuCollapse
        },
    }
})