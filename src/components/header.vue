<template>
    <div class="fixed-header">
        <div class="nav-bar">
            <div class="left-menu">
                <div @click="toggleClick" class="menu-fold-btn">
                    <el-icon size="24">
                        <component :is="menuCollapse ? 'Expand' : 'Fold'" />
                    </el-icon>
                </div>

                <div class="breadcrumb-container">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/dashboard' }">系统首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">{{ item.name
                            }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>

            <div class="right-menu">
                <div class="user-container">
                    <el-dropdown trigger="click">
                        <div class="user-info">
                            <span class="user-icon">
                                <el-avatar size="medium" shadow="square">系</el-avatar>
                            </span>
                            <span class="user-name">&nbsp;系统管理员</span>
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <el-icon class="el-icon--right" size="20" color="#333" style="margin-right: 8px;cursor:pointer;">
                    <Setting />
                </el-icon>
            </div>
        </div>
        <div class="tags-view">
            <v-tags-view></v-tags-view>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useSettingStore } from '../store/setting';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import VTagsView from '@/components/tags-view.vue';

const router = useRouter();
const userStore = useUserStore();
const breadcrumbList = computed(() => router.currentRoute.value.matched.filter((item: any) => item.name !== 'Dashboard'));

const menuCollapse = computed(() => { return useSettingStore().menuCollapse });

const toggleClick = () => {
    useSettingStore().setMenuCollapse(!menuCollapse.value);
}

const logout = () => {
    userStore.logout();
    router.push('/login');
}
</script>

<style lang="less" scoped>
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
}

.left-menu {
    display: flex;
    align-items: center;
    height: 100%;
}

.right-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    width: 200px;
}

.breadcrumb-container {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 10px;
    white-space: nowrap;
}

.menu-fold-btn {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 15px;
    transition: background 0.3s;
    cursor: pointer;
}

.user-info {
    position: relative;
    height: 49px;
    line-height: 49px;
    padding: 0 10px;
    padding-left: 5px;
    cursor: pointer;
}

.tags-view {
    width: 100%;
    padding: 0 15px;
    height: 40px;
    background: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
}
</style>