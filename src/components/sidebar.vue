<script setup lang="ts">
import { useMenuStore } from '../store/menu';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const menuStore = useMenuStore();
const menuData = menuStore.data;

const router = useRouter();
const onRouter = computed(() => {
    return router.currentRoute.value.path
})

</script>

<template>
    <div class="sidebar">
        <el-menu :default-active="onRouter" mode="vertical" background-color="#304156" text-color="#fff"
            active-text-color="#09989b" unique-opened router>
            <h4>会员营销管理系统</h4>
            <div class="info-card">
                <div id="username">系统管理员</div>
                <div id="user-role">(管理员角色)</div>
            </div>

            <el-menu-item index="/dashboard">
                <el-icon>
                    <Menu />
                </el-icon>
                <span>系统首页</span>
            </el-menu-item>

            <el-sub-menu v-for="item in menuData" :key="item.name" :index="item.path">
                <template #title>
                    <el-icon size="14">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <el-menu-item class="sub-menu-item" v-for="subItem in item.children" :key="subItem.name"
                    :index="subItem.path">
                    <el-icon size="14">
                        <component :is="subItem.icon"></component>
                    </el-icon>
                    <span>{{ subItem.name }}</span>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<style scoped lang="less">
.sidebar {
    flex: 1.5;
    height: 100vh;
    background-color: #304156;
    color: white;
    align-items: center;
    display: block;

    h4 {
        margin: 0;
        padding: 10px 0;
        text-align: center;
    }

    .el-menu {
        height: 100vh;
        font-size: 14px;
    }
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