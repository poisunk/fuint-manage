<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { getAccountInfo } from './api/login';
import router from './router';
import { usePermissStore } from './store/permiss';

const permiss = usePermissStore();

onBeforeMount(() => {
    getAccountInfo().then(res => {
        if (res.data.code == 401) {
            permiss.removeToken();
            router.push('/login');
        }
    })
})
</script>

<template>
    <router-view />
</template>
