<template>
    <el-container>
        <el-aside width="200px">
            <v-side-bar />
        </el-aside>
        <el-container style="height: 100vh">
            <el-header style="padding: 0;height: 90px">
                <v-header />
            </el-header>
            <el-main style="padding: 0;">
                <el-scrollbar>
                    <router-view v-slot="{ Component, route }" :key="key">
                        <transition name="fade-transform" mode="out-in">
                            <keep-alive :include="cacheViews">
                                <component :is="Component" :key="route.fullPath" />
                            </keep-alive>
                        </transition>
                    </router-view>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VSideBar from '@/components/sidebar.vue';
import vHeader from '@/components/header.vue';
import { useTagsViewStore } from '../store/tags-view';
import { useRoute } from 'vue-router';

const tagsViewStore = useTagsViewStore();
const cacheViews = computed(() => tagsViewStore.cachedViews);

const route = useRoute();

const key = computed(() => {
    return route.path
})
</script>

<style lang="less" scoped></style>
