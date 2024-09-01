<template>
    <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import router from './router';
import { useUserStore } from './store/user';
import { onMounted } from 'vue';
import { errorNotification } from './utils/notification';

const userStore = useUserStore();

onBeforeMount(() => {
    if (!userStore.init) {
        router.push('/login');
    }
})

onMounted(() => {
    if (userStore.init) {
        userStore.getInfo().catch((err: any) => {
            userStore.init = false;
            errorNotification(err.message);
            router.push('/login');
        });
    }
})
</script>

<style lang="less"></style>
