<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="会员ID">
                    <el-input v-model="formInline.id" placeholder="请输入会员ID" clearable />
                </el-form-item>

                <el-form-item label="会员号">
                    <el-input v-model="formInline.userNo" placeholder="请输入会员号" clearable />
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model="formInline.mobile" placeholder="请输入手机号" clearable />
                </el-form-item>

                <el-form-item label="会员名称">
                    <el-input v-model="formInline.name" placeholder="请输入会员名称" clearable />
                </el-form-item>

                <el-form-item label="会员等级">
                    <el-select v-model="formInline.gradeId" placeholder="会员等级" clearable>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="会员分组">
                    <el-select v-model="formInline.groupId" placeholder="会员分组" clearable>
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="formInline.status" placeholder="状态" clearable>
                        <el-option label="启用" value="A" />
                        <el-option label="禁用" value="N" />
                    </el-select>
                </el-form-item>

                <el-form-item label="注册时间">
                    <el-config-provider :locale="zhCn">
                        <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="开始日期" />
                        ~
                        <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="结束日期" />
                    </el-config-provider>
                </el-form-item>

                <el-form-item label="所属店铺">
                    <el-select v-model="formInline.storeId" placeholder="所属店铺" clearable>
                        <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
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
                <el-table-column prop="id" label="会员ID" />
                <el-table-column prop="avatar" label="头像" align="center">
                    <template #default="scope">
                        <el-avatar v-if="scope.row.avatar" :src="scope.row.avatar" />
                        <el-avatar v-else :icon="UserFilled" />
                    </template>
                </el-table-column>
                <el-table-column prop="userNo" label="会员号" width="150" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="mobile" label="手机号" align="center" width="100">
                    <template #default="scope">
                        <span>{{ scope.row.mobile ? scope.row.mobile : '-' }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="gradeName" label="会员等级" />
                <el-table-column prop="storeName" label="所属店铺" />

                <el-table-column prop="balance" label="余额" align="center">
                    <template #default="scope">
                        <span style="color: red;">{{ scope.row.balance.toFixed(2) }}</span>
                        <el-button type="primary" @click="onOpenBalanceForm(scope.row)" size="small">充值</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="point" label="积分" align="center">
                    <template #default="scope">
                        <div>{{ scope.row.point }}</div>
                        <el-button type="primary" @click="onOpenPointForm(scope.row)" size="small">兑换</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="注册时间" width="180">
                    <template #default="scope">
                        <span>{{ new Date(scope.row.createTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="180">
                    <template #default="scope">
                        <span>{{ new Date(scope.row.updateTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" fixed="right" align="center" width="80">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleItemStatusChange(scope.row, scope.row.status)" />
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

    <el-dialog v-model="dialogInfoFormVisible" :title="dialogTitle" width="700px" @closed="onInfoFormClosed">
        <v-custom-form ref="infoFormRef" v-model="infoFormData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="onInfoFormConfirm">确定</el-button>
            <el-button @click="dialogInfoFormVisible = false">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogBalanceFormVisible" :title="dialogBalanceTitle" width="700px">
        <el-form ref="balanceFormRef" :model="balanceFormData" :rules="balanceFormRules" label-width="120px">
            <el-form-item label="会员信息">
                <div>{{ balanceFormData.userNo }} (ID:{{ balanceFormData.id }})</div>
            </el-form-item>

            <el-form-item v-if="dialogBalanceTitle === '余额充值/扣减'" label="可用余额">
                <div>￥{{ balanceFormData.balance.toFixed(2) }}</div>
            </el-form-item>
            <el-form-item v-else label="可用积分">
                <div>{{ balanceFormData.point }}</div>
            </el-form-item>

            <el-form-item label="变更方式">
                <el-radio-group v-model="balanceFormData.type">
                    <el-radio value="1">增加</el-radio>
                    <el-radio value="2">扣减</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="amount" label="变更数量" required>
                <el-input v-model="balanceFormData.amount" placeholder="请输入变更数量" style="width: 500px;" />
            </el-form-item>

            <el-form-item label="备注">
                <el-input v-model="balanceFormData.remark" type="textarea" placeholder="请输入备注" style="width: 500px;" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button type="primary" @click="onBalanceFormConfirm">确定</el-button>
            <el-button @click="dialogBalanceFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete, UserFilled, MoreFilled, Key } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import VCustomForm from '@/components/custom-form/index.vue';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { deleteMember, getMemberList, resetMemberPassword, saveMember, updateMemberStatus } from '../../../../api/member';
import { formConfigs } from './form-config';
import { doBalanceRecharge } from '../../../../api/balance';
import { doPointRecharge } from '../../../../api/point';

class InfoFormData {
    id: number
    name: string
    storeId: number
    groupId: number
    gradeId: number
    startTime: string
    endTime: string
    userNo: string
    mobile: string
    sex: number = 1
    idcard: string
    birthday: string
    address: string
    status: string = 'A'
    description: string
    timeRange: string
}

const formInline = ref({
    mobile: '',
    id: '',
    userNo: '',
    name: '',
    gradeId: '',
    groupIds: '',
    status: '',
    storeIds: '',
});
const tableListData = ref([]);
const infoFormData = ref(new InfoFormData());
const gradeList = ref([]);
const storeList = ref([]);
const groupList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogInfoFormVisible = ref(false);
const dialogBalanceFormVisible = ref(false);
const dialogTitle = ref('');
const dialogBalanceTitle = ref('');
const infoFormRef = ref({});
const balanceFormData = ref({})
const balanceFormRef = ref({});
const balanceFormRules = {
    amount: [{ required: true, message: '请输入变更数量', trigger: 'blur' }]
}

const onSubmitQuery = () => {
    searchTableList();
}

const onSubmitReset = () => {
    formInline.value = {
        name: '',
        catchType: '',
        status: '',
    }
    searchTableList();
}

const onInfoFormClosed = () => {
    infoFormData.value = new InfoFormData();
    dialogInfoFormVisible.value = false;
}

const onOpenPlusForm = () => {
    dialogTitle.value = '新增会员';
    dialogInfoFormVisible.value = true;
}

const handleItemEdit = (row: any) => {
    infoFormData.value = row;
    dialogTitle.value = '编辑会员';
    dialogInfoFormVisible.value = true;
}

const onOpenBalanceForm = (row: any) => {
    balanceFormData.value = {
        id: row.id,
        userNo: row.userNo,
        balance: row.balance,
        type: '1',
        amount: '',
        remark: '',
    }
    dialogBalanceTitle.value = '余额充值/扣减';
    dialogBalanceFormVisible.value = true;
}

const onOpenPointForm = (row: any) => {
    balanceFormData.value = {
        id: row.id,
        userNo: row.userNo,
        point: row.point,
        type: '1',
        amount: '',
        remark: '',
    }
    dialogBalanceTitle.value = '积分变更';
    dialogBalanceFormVisible.value = true;
}

const onBalanceFormConfirm = () => {
    balanceFormRef.value.validate().then(() => {
        const params = {
            userId: balanceFormData.value.id,
            type: balanceFormData.value.type,
            amount: balanceFormData.value.amount,
            remark: balanceFormData.value.remark
        }

        let chargeFunction;
        if (dialogBalanceTitle.value == '余额充值/扣减') {
            chargeFunction = doBalanceRecharge;
        } else {
            chargeFunction = doPointRecharge;
        }

        chargeFunction(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            dialogBalanceFormVisible.value = false;
            searchTableList();
        });
    }).catch(() => {
        errorNotification('请检查表单内容');
    })
}

const handleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteMember(row.id).then((res) => {
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
            userId: row.id,
            status: status
        }

        updateMemberStatus(params).then((res) => {
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

const handleItemResetPassword = (row: any) => {
    ElMessageBox.prompt(`重置会员号："${row.userNo}"的密码`, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(({ value }) => {
        const params = {
            userId: row.id,
            password: value
        }

        resetMemberPassword(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    })
}

const onInfoFormConfirm = () => {
    infoFormRef.value.formRef.validate().then(() => {
        const params = {
            id: infoFormData.value.id ? infoFormData.value.id : "",
            ...infoFormData.value
        }

        saveMember(params).then((res) => {
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

    getMemberList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;

        gradeList.value = data.userGradeList.map((grade: any) => ({
            ...grade,
            value: grade.id,
            label: grade.name
        }));
        data.storeList.unshift({ id: 0, name: '公共店铺' })
        storeList.value = data.storeList.map((store: any) => ({
            ...store,
            value: store.id,
            label: store.name
        }))
        groupList.value = data.groupList;

        total.value = data.paginationResponse.totalElements;

        tableListData.value = data.paginationResponse.content.map((item: any) => {
            item.groupId = item.groupId === 0 ? null : item.groupId;
            item.gradeId = Number(item.gradeId);
            return item;
        })

        setFormFieldValue('storeId', 'options', storeList.value);
        setFormFieldValue('groupId', 'options', groupList.value);
        setFormFieldValue('gradeId', 'options', gradeList.value);
    })
}

const handlePaginationChange = () => {
    searchTableList();
}


const setFormFieldValue = (fieldName: string, valueName: string, value: any) => {
    for (const item of formConfigs) {
        if (item.field == fieldName) {
            item[valueName] = value;
        }
    }
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

.el-table-item.cell {
    cursor: pointer;
    display: block;

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
}
</style>