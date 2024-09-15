<template>
    <div class="content">
        <el-button plain type="primary" @click="handleAdd" :icon="Plus">添加</el-button>
        <el-table :data="tabelDataList" row-key="id" style="width: 100%">
            <el-table-column prop="name" label="菜单名称" width="180" />
            <el-table-column label="图标" align="center" width="80">
                <template #default="scope">
                    <el-icon v-if="scope.row.icon">
                        <component :is="scope.row.icon"></component>
                    </el-icon>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标名称" />
            <el-table-column prop="path" label="组件路径" />
            <el-table-column label="排序" align="center" width="180">
                <template #default="scope">
                    <el-input-number v-model="scope.row.sort" @change="handleSortChange(scope.row)" />
                </template>
            </el-table-column>

            <el-table-column label="是否菜单" align="center">
                <template #default="scope">
                    <el-switch v-model="scope.row.isMenu" :active-value="1" :inactive-value="0"
                        @change="handleIsMenuChange(scope.row, scope.row.isMenu)" />
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" align="center" width="200">
                <template #default="scope">
                    <el-button link size="small" type="primary" @click="handleEdit(scope.row)"
                        :icon="Edit">编辑</el-button>
                    <el-button link size="small" type="primary" @click="handleItemAdd(scope.row)"
                        :icon="Plus">添加</el-button>
                    <el-button link size="small" type="primary" @click="handleDelete(scope.row)"
                        :icon="Delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="700px" @closed="onFormClosed">
        <el-form :model="formData" label-width="80px">
            <el-form-item prop="name" label="菜单名称">
                <el-input v-model="formData.name" placeholder="请输入菜单名称" />
            </el-form-item>

            <el-form-item prop="isMenu" label="是否菜单">
                <el-radio-group v-model="formData.isMenu">
                    <el-radio label="是" :value="1" />
                    <el-radio label="否" :value="0" />
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="icon" label="图标">
                <el-input v-model="formData.icon" placeholder="请输入图标名称" />
            </el-form-item>

            <el-form-item prop="parentId" label="上级菜单">
                <el-tree-select v-model="formData.pid" :data="tabelDataList" :render-after-expand="false"
                    :props="{ value: 'id', label: 'name', children: 'children' }" check-strictly />
            </el-form-item>

            <el-form-item prop="path" label="组件路径">
                <el-input v-model="formData.path" placeholder="请输入组件路径" />
            </el-form-item>

            <el-form-item prop="sort" label="排序">
                <el-input-number v-model="formData.sort" />
            </el-form-item>

            <el-form-item prop="status" label="状态">
                <el-radio-group v-model="formData.status">
                    <el-radio label="启用" value="A" />
                    <el-radio label="禁用" value="N" />
                </el-radio-group>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { addSource, deleteSource, getSystemSourceList, updateSource } from '../../../../api/system';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';

const tabelDataList = ref([]);
const dialogFormVisible = ref(false);
const dialogTitle = ref('');
const formData = ref({});

const handleEdit = (data: any) => {
    dialogTitle.value = '编辑菜单';
    formData.value = data;
    dialogFormVisible.value = true;
}

const onFormClosed = () => {
    formData.value = {};
}

const handleAdd = () => {
    dialogTitle.value = '添加菜单';
    formData.value = {
        isMenu: 1,
        sort: 0,
        pid: 0,
        icon: '',
        status: 'A',
    };
    dialogFormVisible.value = true;
}

const handleSortChange = (data: any) => {
    doUpdateSource(data);
}

const handleIsMenuChange = (data: any) => {
    doUpdateSource(data);
}

const handleItemAdd = (data: any) => {
    dialogTitle.value = '添加子菜单';
    formData.value = {
        isMenu: 1,
        sort: 0,
        pid: data.id,
        icon: '',
        status: 'A',
    };
    dialogFormVisible.value = true;
}

const handleDelete = (data: any) => {
    ElMessageBox.confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteSource(data.id).then((res: any) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            refreshTableData();
        })
    })
}

const handleSubmit = () => {
    if (dialogTitle.value == '编辑菜单') {
        doUpdateSource(formData.value);
    } else if (dialogTitle.value == '添加菜单' || dialogTitle.value == '添加子菜单') {
        doAddSource(formData.value);
    }
}

const doUpdateSource = (data: any) => {
    const params = {
        id: data.id,
        status: data.status,
        name: data.name,
        parentId: data.pid,
        icon: data.icon,
        path: data.path,
        sort: data.sort,
        isMenu: data.isMenu,
    }

    updateSource(params).then((res: any) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        successNotification(res.data.message);
        refreshTableData();
    });
}

const doAddSource = (data: any) => {
    const params = {
        status: data.status,
        name: data.name,
        parentId: data.pid,
        icon: data.icon,
        path: data.path,
        sort: data.sort,
        isMenu: data.isMenu,
    }

    addSource(params).then((res: any) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        successNotification(res.data.message);
        refreshTableData();
        dialogFormVisible.value = false;
    });
}

const refreshTableData = () => {
    getSystemSourceList().then((res: any) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        tabelDataList.value = res.data.data;

        tabelDataList.value = buildMenuTree(tabelDataList.value);

        tabelDataList.value.sort((a: any, b: any) => a.sort - b.sort);
    })
}

const buildMenuTree = (data: any) => {
    const returnList = [];
    for (let i = 0; i < data.length; i++) {
        const menu = data[i];
        if (menu.pid == 0) {
            menu.children = bulidMenuChildren(data, menu.id);
            returnList.push(menu);
        }
    }
    return returnList;
}

const bulidMenuChildren = (data: any, pid: any) => {
    const childList = [];
    for (let i = 0; i < data.length; i++) {
        const menu = data[i];
        if (menu.pid == pid) {
            menu.children = bulidMenuChildren(data, menu.id);
            childList.push(menu);
        }
    }
    childList.sort((a: any, b: any) => a.sort - b.sort);
    return childList;
}
onMounted(() => {
    refreshTableData();
})
</script>

<style lang="less" scoped>
.content {
    padding: 10px;
}
</style>