<template>
    <el-container>
        <el-aside>
            <v-side-bar />
        </el-aside>
        <el-container style="height: 100vh">
            <el-header style="padding: 0;height: 90px">
                <v-header />
            </el-header>
            <el-main style="padding: 0;">
                <el-scrollbar>
                    <router-view v-slot="{ Component, route }" :key="route.path">
                        <transition name="fade-transform" mode="out-in">
                            <keep-alive :include="tagsViewStore.cachedViews">
                                <component :is="Component" :key="route.path" />
                            </keep-alive>
                        </transition>
                    </router-view>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import VSideBar from '@/components/sidebar.vue';
import vHeader from '@/components/header.vue';
import { useTagsViewStore } from '../store/tags-view';
import { useRoute } from 'vue-router';

const tagsViewStore = useTagsViewStore();

const route = useRoute();

</script>

<style lang="less" scoped>
.el-aside {
    height: 100vh;
    width: 200px;
    overflow: hidden;
}
</style>
