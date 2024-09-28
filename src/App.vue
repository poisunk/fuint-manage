<template>
    <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import router from './router';
import { useUserStore } from './store/user';
import { useSettingStore } from './store/setting';
import { debounce } from './utils/instruction';

const settingStore = useSettingStore();

const userStore = useUserStore();

//获取屏幕宽度
const screenWidth = ref(window.innerWidth)

// 初始化
if (screenWidth.value < 992) {
    settingStore.menuShow = false
    settingStore.menuCollapse = true
}

const handleResize = () => {
    screenWidth.value = window.innerWidth
}
const debounceHandleResize = debounce(handleResize, 200)
window.addEventListener("resize", debounceHandleResize)

onBeforeMount(async () => {
    if (!userStore.init) {
        router.push('/login');
    }
})

onMounted(async () => {
    if (userStore.init) {
        userStore.getInfo();
    }
})


watch(screenWidth, (newValue, oldValue) => {
    if (newValue < 992) {
        settingStore.menuShow = false
        settingStore.menuCollapse = true
    } else {
        settingStore.menuShow = true
        settingStore.menuCollapse = true
    }
})

</script>

<style lang="less"></style>
