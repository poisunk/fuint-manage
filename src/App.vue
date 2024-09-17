<template>
    <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import router from './router';
import { useUserStore } from './store/user';
import { onMounted } from 'vue';

const userStore = useUserStore();

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
</script>

<style lang="less"></style>
