<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="formInline.name" placeholder="请输入角色名称" clearable />
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="formInline.status" placeholder="状态" clearable>
                        <el-option label="启用" value="A" />
                        <el-option label="禁用" value="N" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmitQuery" :icon="Search">搜索</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="default" @click="onSubmitReset" :icon="Refresh">重置</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" plain @click="onOpenPlusForm" :icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="tableListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="type" label="角色类型" align="center" />

                <el-table-column label="状态" fixed="right" align="center">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleItemStatusChange(scope.row, scope.row.status)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleItemDelete(scope.row)">删除
                        </el-button>
                    </template>

                </el-table-column>
            </el-table>
        </el-row>
        <el-row class="pagination-row">
            <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 40]" size="default" layout="total, sizes, prev, pager, next, jumper"
                    :total="total" @size-change="handlePaginationChange" @current-change="handlePaginationChange" />
            </el-config-provider>
        </el-row>
    </div>

    <el-dialog v-model="dialogInfoFormVisible" :title="dialogTitle" width="700px" @opened="onInfoFormOpened"
        @closed="onInfoFormClosed">
        <el-form ref="infoFormRef" :model="infoFormData" :rules="infoFormRules" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="infoFormData.roleName" placeholder="请输入角色名称" />
            </el-form-item>

            <el-form-item label="角色类型" prop="roleType">
                <el-select v-model="infoFormData.roleType" placeholder="请选择角色类型">
                    <el-option label="超级管理员" value="1" />
                    <el-option label="普通管理员" value="2" />
                    <el-option label="普通用户" value="3" />
                </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="infoFormData.status">
                    <el-radio label="启用" value="A" />
                    <el-radio label="禁用" value="N" />
                </el-radio-group>
            </el-form-item>

            <el-form-item label="菜单权限" prop="menuIds">
                <div>
                    <el-checkbox v-model="menuTreeOption.expandAll" @change="onTreeExpandChange">
                        展开/收起
                    </el-checkbox>
                    <el-checkbox v-model="menuTreeOption.selectAll" @change="onTreeSelectChange">
                        全选/全不选
                    </el-checkbox>
                    <el-checkbox v-model="menuTreeOption.checkStrictly">
                        父子联动
                    </el-checkbox>
                </div>
                <el-tree class="tree-container" ref="menuTreeRef" :data="sourceTreeList" show-checkbox node-key="id"
                    :default-checked-keys="infoFormData.menuIds" :check-strictly="!menuTreeOption.checkStrictly"
                    :props="{ children: 'childrens' }" v-loading="menuTreeLoading" />
            </el-form-item>

            <el-form-item label="备注" prop="description">
                <el-input v-model="infoFormData.description" placeholder="请输入备注" type="textarea" rows="3" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="onInfoFormConfirm">确定</el-button>
            <el-button @click="dialogInfoFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { errorNotification, successNotification } from '@/utils/notification';
import { addSystemRole, deleteSystemRole, getSystemRoleInfo, getSystemSourceTreeList, searchRoleList, updateRoleStatus, updateSystemRole } from '@/api/system';

class InfoFormData {
    id: string = ''
    roleName: string
    roleType: string
    status: string = 'A'
    description: string
    menuIds: any = []
}

class InlineFormData {
    name: string
    status: string = ''
}

const formInline = ref(new InlineFormData());
const tableListData = ref([]);
const infoFormData = ref(new InfoFormData());
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogInfoFormVisible = ref(false);
const dialogTitle = ref('');
const infoFormRef = ref({});
const infoFormRules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleType: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
}

const roleEnum = {
    '超级管理员': '1',
    '普通管理员': '2',
    '普通用户': '3'
}
const sourceTreeList = ref([]);
const menuTreeRef = ref();
const menuTreeOption = ref({
    expendAll: false,
    selectAll: false,
    checkStrictly: true
})
const menuTreeLoading = ref(false);

const onSubmitQuery = () => {
    searchTableList();
}

const onSubmitReset = () => {
    formInline.value = new InlineFormData();
    searchTableList();
}

const onInfoFormClosed = () => {
    infoFormData.value = new InfoFormData();
    dialogInfoFormVisible.value = false;
    menuTreeOption.value = {
        expendAll: false,
        selectAll: false,
        checkStrictly: true
    }
    onTreeSelectChange();
}

const onInfoFormOpened = () => {
    if (dialogTitle.value == '编辑角色') {
        menuTreeLoading.value = true;
        getSystemRoleInfo(infoFormData.value.id).then((res: any) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            menuTreeRef.value.setCheckedKeys(res.data.data.checkedKeys);
        }).finally(() => {
            menuTreeLoading.value = false;
        })
    }
}

const onOpenPlusForm = () => {
    dialogTitle.value = '新增角色';
    dialogInfoFormVisible.value = true;
}

const onTreeSelectChange = () => {
    const nodes = menuTreeRef.value.store._getAllNodes();
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].checked = menuTreeOption.value.selectAll;
    }
}

const onTreeExpandChange = () => {
    const nodes = menuTreeRef.value.store._getAllNodes();
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].expanded = menuTreeOption.value.expandAll;
    }
}

const handleItemEdit = (row: any) => {
    infoFormData.value = {
        id: row.id,
        roleName: row.name,
        roleType: roleEnum[row.type],
        status: row.status,
        description: row.description,
        menuIds: row.menuIds
    }
    dialogTitle.value = '编辑角色';
    dialogInfoFormVisible.value = true;
}

const handleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteSystemRole(row.id).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    })
}

const handleItemStatusChange = (row: any, status: string = '') => {
    let statusName = status == 'A' ? '启用' : '禁用';
    if (status == 'D') {
        statusName = '删除';
    }
    ElMessageBox.confirm('确认要' + statusName + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            roleId: row.id,
            status: status
        }

        updateRoleStatus(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                if (status == 'D') {
                    return;
                }
                row.status = row.status == 'A' ? 'N' : 'A';
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    }).catch(() => {
        if (status == 'D') {
            return;
        }
        row.status = row.status == 'A' ? 'N' : 'A';
    });
}

const onInfoFormConfirm = () => {
    infoFormRef.value.validate().then(() => {
        const selectNodes = menuTreeRef.value.getCheckedNodes();
        const menuIds = [];
        for (let i = 0; i < selectNodes.length; i++) {
            menuIds.push(selectNodes[i].id);
        }

        let params = {
            roleName: infoFormData.value.roleName,
            roleType: infoFormData.value.roleType,
            status: infoFormData.value.status,
            menuIds: menuIds,
            description: infoFormData.value.description ? infoFormData.value.description : '',
        }

        let handleFuction = addSystemRole;

        if (dialogTitle.value == '编辑角色') {
            params['id'] = infoFormData.value.id;
            handleFuction = updateSystemRole;
        }

        handleFuction(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            dialogInfoFormVisible.value = false;
            searchTableList();
        })
    }).catch(() => {
        errorNotification('请填写必填项');
    })
}

const searchTableList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    searchRoleList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.totalElements;

        tableListData.value = data.content;
    });
}

const handlePaginationChange = () => {
    searchTableList();
}

onMounted(() => {
    searchTableList();

    getSystemSourceTreeList().then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        sourceTreeList.value = res.data.data;
    })
});
</script>

<style lang="less" scoped>
.container {
    padding: 20px;
}

.search-form-card {
    width: 100%;
    border: 1px solid #e2e1e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 10px;
    background-color: #f5f5f5;

    .el-form-item {
        margin-right: 10px;
    }

    .el-input {
        width: 200px;
    }

    .el-select {
        width: 180px;
    }

}

.table-item-image {
    width: 60px;
    height: 50px;
    border-radius: 5px;
}

.table-item-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.pagination-row {
    margin-top: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;

}

.el-form {
    padding: 20px;
}

.tree-container {
    border: 1px solid #e2e1e1;
    width: 100%;
}
</style>