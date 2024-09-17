<template>
    <div class="tags-container">
        <el-scrollbar class="tags-view-wrapper">
            <router-link to="/dashboard" class="tags-view-item" :class="route.path == '/dashboard' ? 'active' : ''">
                <span class="tags-title">系统首页</span>
            </router-link>

            <router-link v-for="tag in visitedViews" :key="tag.path" :to="tag.fullPath" class="tags-view-item"
                :class="isActive(tag.path)">
                <span class="tags-title">{{ tag.meta.title }}</span>
                <el-icon class="tags-icon" @click.prevent.stop="closeTag(tag)">
                    <Close />
                </el-icon>
            </router-link>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTagsViewStore } from '../store/tags-view';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
const visitedViews = tagsViewStore.visitedViews;

const isActive = (path: string) => {
    return path === route.path ? 'active' : '';
};

const closeTag = (tag: any) => {
    tagsViewStore.delView(tag);
    const { path } = tag;
    if (path === route.path) {
        const latestView = visitedViews.slice(-1)[0];
        if (latestView) {
            router.push(latestView.path);
        } else {
            router.push('/dashboard');
        }
    }
};

const addTags = () => {
    const { name } = router.currentRoute.value;
    if (name && name !== 'Dashboard') {
        tagsViewStore.addView(route);
    }
};

onMounted(() => {
    addTags();
})

watch(
    () => router.currentRoute.value,
    () => {
        addTags();
    },
);
</script>

<style lang="less" scoped>
.tags-view-wrapper {
    display: flex;
    align-items: center;
    height: 40px;
}

.tags-view-item {
    display: inline-block;
    position: relative;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    padding: 0 10px;
    margin-top: 7px;
    color: #495060;
    font-size: 12px;
    margin-right: 10px;
    text-decoration: none;
}

.active {
    color: #000c;
    margin-right: 10px;
}

.active .tags-title:before {
    content: "";
    background: #16baaa;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 5px;
}

.tags-icon {
    margin-top: -2px;
    vertical-align: middle;
    margin-left: 4px;
    border-radius: 50%;
}

.tags-icon:hover {
    background-color: #b4bccc;
    color: #fff;
}
</style>