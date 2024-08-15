<template>
    <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick" @tab-remove="removeTab">
        <el-tab-pane label="系统首页" name="/dashboard"></el-tab-pane>
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.name" closable :name="item.path"></el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watch, ref } from 'vue';

const activeTabName = ref('/dashboard');
const tabs = ref([]);

const handleClick = (tab: any) => {
    router.push(tab.props.name)
}

const removeTab = (targetName: string) => {
    tabs.value = tabs.value.filter((tab: any) => tab.path !== targetName);

    if (activeTabName.value === targetName) {
        activeTabName.value = tabs.value.length > 0 ? tabs.value[tabs.value.length - 1].path : '/dashboard';
        router.push(activeTabName.value)
    }
}


const router = useRouter();
watch(
    () => router.currentRoute.value,
    (newValue: any) => {
        if (newValue.path == "/" || newValue.path == "/dashboard") {
            activeTabName.value = "/dashboard"
            return
        }

        for (let i = 0; i < tabs.value.length; i++) {
            if (tabs.value[i].path == newValue.path) {
                activeTabName.value = newValue.path
                return
            }
        }
        tabs.value.push({
            name: newValue.name,
            path: newValue.path
        })
        activeTabName.value = newValue.path
    },
    {
        immediate: true,
    }
)
</script>

<style lang="less" scoped>
.tabs {
    background-color: #00ACAC;
}
</style>