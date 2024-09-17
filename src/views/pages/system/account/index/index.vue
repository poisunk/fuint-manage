<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="formInline.accountName" placeholder="请输入用户名" clearable />
                </el-form-item>

                <el-form-item label="真实姓名">
                    <el-input v-model="formInline.realName" placeholder="请输入真实姓名" clearable />
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="formInline.accountStatus" placeholder="状态" clearable>
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
                <el-table-column prop="accountName" label="用户名" />
                <el-table-column prop="realName" label="真实姓名" align="center" />
                <el-table-column prop="merchantName" label="所属商户" align="center" />
                <el-table-column prop="storeName" label="所属店铺" align="center">
                    <template #default="scope">
                        <div>{{ scope.row.storeName ? scope.row.storeName : '-' }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="createDate" label="创建时间" align="center" width="180" />

                <el-table-column label="状态" fixed="right" align="center">
                    <template #default="scope">
                        <el-switch v-model="scope.row.accountStatus" :active-value="1" :inactive-value="0"
                            @change="handleItemStatusChange(scope.row, scope.row.accountStatus)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="200">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleItemDelete(scope.row)">删除
                        </el-button>

                        <el-dropdown size="small">
                            <span class="el-dropdown-link">
                                <el-icon class="el-icon--right">
                                    <MoreFilled />
                                </el-icon>
                                更多
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleItemResetPassword(scope.row)"
                                        :icon="Key">重置密码</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
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
        <el-form class="info-form" ref="infoFormRef" :model="infoFormData" :rules="infoFormRules" label-width="120px">
            <el-form-item label="用户名" prop="accountName">
                <el-input v-model="infoFormData.accountName" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item v-if="dialogTitle == '新增管理员'" label="登录密码" prop="password">
                <el-input v-model="infoFormData.password" placeholder="请输入登录密码" />
            </el-form-item>

            <el-form-item v-if="dialogTitle == '新增管理员'" label="确认密码" prop="confirmPassword">
                <el-input v-model="infoFormData.confirmPassword" placeholder="请输入确认密码" />
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="infoFormData.realName" placeholder="请输入真实姓名" />
            </el-form-item>

            <el-form-item label="状态" prop="accountStatus">
                <el-radio-group v-model="infoFormData.accountStatus">
                    <el-radio label="启用" :value="1" />
                    <el-radio label="禁用" :value="0" />
                </el-radio-group>
            </el-form-item>

            <el-form-item label="分配角色" prop="roleIds">
                <el-select v-model="infoFormData.roleIds" placeholder="请选择角色" multiple>
                    <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="所属商户" prop="merchantId">
                <el-select v-model="infoFormData.merchantId" placeholder="请选择商户" @change="onMerchantSelectChange">
                    <el-option v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="所属店铺" prop="storeId">
                <el-select v-model="infoFormData.storeId" placeholder="请选择店铺" clearable>
                    <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
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
import { deleteAccount, doCreateAccount, doUpdateAccount, getAccountInfo, getAccountList, resetAccountPwd, updateAccountStatus } from '@/api/system';
import { searchStoreList } from '@/api/store';

class InfoFormData {
    id: string = ''
    accountName: string
    accountStatus: number = 1
    realName: string = ''
    password: string
    confirmPassword: string
    storeId: string
    merchantId: string
    staffId: string
    roleIds: number[] = []
}

class InlineFormData {
    accountName: string
    realName: string
    accountStatus: string = ''
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
    accountName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
}
const roleList = ref([]);
const merchantList = ref([]);
const storeList = ref([]);

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
    roleList.value = [];
    merchantList.value = [];
    storeList.value = [];
}

const onInfoFormOpened = () => {
    let searchId = -1;
    if (infoFormData.value.id) {
        searchId = infoFormData.value.id;
    }
    getAccountInfo(searchId).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        roleList.value = res.data.data.roles;
        merchantList.value = res.data.data.merchants;
        infoFormData.value.merchantId = merchantList.value[0].id;
        onMerchantSelectChange(merchantList.value[0].id);

        if (dialogTitle.value == '修改管理员') {
            infoFormData.value.roleIds = res.data.data.roleIds;
        }
    })
}

const onOpenPlusForm = () => {
    dialogTitle.value = '新增管理员';
    dialogInfoFormVisible.value = true;
}

const handleItemEdit = (row: any) => {
    infoFormData.value = row;
    dialogTitle.value = '修改管理员';
    dialogInfoFormVisible.value = true;
}

const handleItemResetPassword = (row: any) => {
    ElMessageBox.prompt('请输入"' + row.accountName + '"的新密码', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        type: 'warning',
    }).then(({ value }) => {
        const params = {
            userId: row.id,
            password: value
        }

        resetAccountPwd(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
        })
    })
}

const onMerchantSelectChange = (value: string) => {
    const params = {
        merchantId: value
    }
    searchStoreList(params).then((res) => {
        storeList.value = res.data.data.storeList;
        storeList.value.unshift({ id: 0, name: '全部店铺' });
    })
}

const handleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.accountName + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteAccount(row.id).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    })
}

const handleItemStatusChange = (row: any, status: number) => {
    let statusName = status == 1 ? '启用' : '禁用';
    ElMessageBox.confirm('确认要' + statusName + row.accountName + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            userId: row.id,
            status: status
        }

        updateAccountStatus(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                row.accountStatus = row.accountStatus == 1 ? 0 : 1;
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    }).catch(() => {
        row.accountStatus = row.accountStatus == 1 ? 0 : 1;
    });
}

const onInfoFormConfirm = () => {
    if (infoFormData.value.password != infoFormData.value.confirmPassword) {
        errorNotification('两次密码输入不一致');
        return;
    }

    infoFormRef.value.validate().then(() => {
        const params = {
            accountName: infoFormData.value.accountName,
            realName: infoFormData.value.realName,
            accountStatus: infoFormData.value.accountStatus,
            roleIds: infoFormData.value.roleIds,
            merchantId: infoFormData.value.merchantId,
            storeId: infoFormData.value.storeId,
            staffId: '',
        }

        let handleFunction = doCreateAccount;

        if (dialogTitle.value == '新增管理员') {
            params['password'] = infoFormData.value.password;
        } else if (dialogTitle.value == '修改管理员') {
            handleFunction = doUpdateAccount;
            params['id'] = infoFormData.value.id;
        }

        handleFunction(params).then((res) => {
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

    getAccountList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.totalElements;

        tableListData.value = data.content;
    })
}

const handlePaginationChange = () => {
    searchTableList();
}

onMounted(() => {
    searchTableList();
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

.info-form {
    .el-input {
        width: 400px;
    }

    .el-select {
        width: 180px;
    }
}


.el-dropdown {
    display: inline-block;
    align-items: center;
    color: #606266;
    font-size: 14px;
    margin-left: 12px;
    vertical-align: middle;
}

.el-dropdown-link {
    color: #409EFF;
    font-size: 12px;
    cursor: pointer;
}

.el-dropdown-link:hover {
    color: #9fcfff;
}
</style>