<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useUserStore } from '../store/user';
import { useSettingStore } from '../store/setting';
import { el } from 'element-plus/es/locale';

const router = useRouter();
const onRouter = computed(() => {
    return router.currentRoute.value.path
})

const userStore = useUserStore();
const menuList = computed(() => {
    return userStore.menuList
})

const settingStore = useSettingStore();
const menuCollapse = computed(() => { return settingStore.menuCollapse });

</script>

<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <div v-if="!menuCollapse" class="sidebar-title fade-show">会员营销管理系统</div>
            <el-icon v-else class="fade-show" color="#00acac" size="50" style="margin-top: 20px">
                <ChromeFilled />
            </el-icon>
            <div v-if="!menuCollapse" class="info-card">
                <div id="username">系统管理员</div>
                <div id="user-role">(管理员角色)</div>
            </div>
        </div>
        <el-scrollbar class="menu-scrollbar">
            <el-menu :default-active="onRouter" mode="vertical" background-color="#304156" text-color="#fff"
                active-text-color="#09989b" unique-opened router :collapse="menuCollapse" :collapse-transition="false">
                <el-menu-item index="/dashboard">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>系统首页</span>
                </el-menu-item>

                <el-sub-menu v-for="item in menuList" :key="item.path" :index="item.path" :disabled="item.hidden">
                    <template #title>
                        <el-icon size="14">
                            <component :is="item.meta.icon"></component>
                        </el-icon>
                        <span>{{ item.meta.title }}</span>
                    </template>
                    <el-menu-item class="sub-menu-item" v-for="subItem in item.children" :key="subItem.meta.title"
                        :index="subItem.path">
                        <el-icon size="14">
                            <component :is="subItem.meta.icon"></component>
                        </el-icon>
                        <span>{{ subItem.meta.title }}</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<style scoped lang="less">
.sidebar {
    height: 100vh;
    background-color: #304156;
    color: white;
    align-items: center;
    overflow: hidden;


    .sidebar-header {
        height: 100px;
        align-items: center;
        text-align: center;
    }

    .el-scrollbar {
        height: calc(100vh - 100px);
    }
}

.menu-scrollbar {
    background: #304156;
    border-right: none;

    .el-menu {
        border-right: none;
    }
}

.fade-show {
    animation: fadeIn 0.5s;

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
}

.sidebar-title {
    margin: 0;
    padding: 10px 0;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    color: white;
    text-wrap: nowrap;
}

.info-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #00ACAC;
    margin: 10px 5px;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;

    #username {
        font-size: 14px;
        font-weight: bold;
    }

    #user-role {
        font-size: 10px;
    }
}

.sub-menu-item {
    background-color: #1f2d3d;
}

.sub-menu-item:hover {
    background-color: #141e28;
}
</style>