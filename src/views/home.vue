<script setup lang="ts">
import VSideBar from '@/components/sidebar.vue';
import vTabs from '@/components/tabs.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <el-container class="container">
        <v-side-bar />
        <el-main class="main">
            <el-row class="main-title">
                <el-icon id="sidebar-fold" size="24">
                    <component is="Fold" />
                </el-icon>
                <span>{{ router.currentRoute.value.name }}</span>
            </el-row>
            <v-tabs />
            <router-view />
        </el-main>
    </el-container>
</template>

<style lang="less" scoped>
.container {
    height: 100vh;
    display: flex;
}

.main {
    flex: 4;
    height: 100vh;
    padding: 0;
}

.main-title {
    padding: 10px 20px;
    color: #303133;
    display: flex;
    align-items: center;

    #sidebar-fold {
        margin-right: 30px;
        cursor: pointer;
    }
}
</style>
