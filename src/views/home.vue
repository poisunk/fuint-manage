<template>
    <el-container>
        <el-aside v-if="menuShow" :width="menuCollapse ? '64px' : '200px'">
            <v-side-bar />
        </el-aside>

        <el-drawer v-else :with-header="false" class="drawer" v-model="menuNotCollapse" direction="ltr"
            @close="handleClose">
            <v-side-bar />
        </el-drawer>

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
import { computed } from 'vue';
import VSideBar from '@/components/sidebar.vue';
import vHeader from '@/components/header.vue';
import { useTagsViewStore } from '../store/tags-view';
import { useRoute } from 'vue-router';
import { useSettingStore } from '../store/setting';

const tagsViewStore = useTagsViewStore();

const route = useRoute();

const settingStore = useSettingStore();
const menuCollapse = computed(() => { return settingStore.menuCollapse });
const menuNotCollapse = computed(() => { return !settingStore.menuCollapse });
const menuShow = computed(() => { return settingStore.menuShow });

const handleClose = (done: () => void) => {
    settingStore.setMenuCollapse(false);
}
</script>

<style lang="less" scoped>
.el-aside {
    height: 100vh;
    overflow: hidden;
    transition: width 0.28s;
}

.el-aside-close {
    display: none;
}

::v-deep(.el-drawer) {
    width: 200px !important;
}

::v-deep(.el-drawer__body) {
    padding: 0;
    width: 200px;
}
</style>
