import { defineStore } from "pinia";


export const useSettingStore = defineStore("setting", {
    state: () => ({
        menuCollapse: false,
    }),
    actions: {
        setMenuCollapse() {
            this.menuCollapse = !this.menuCollapse
        },
    }
})