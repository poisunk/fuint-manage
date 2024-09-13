<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="卡券ID">
                    <el-input v-model="formInline.couponId" placeholder="请输入卡券ID" clearable />
                </el-form-item>

                <el-form-item label="会员等级">
                    <el-select v-model="formInline.gradeId" placeholder="会员等级" clearable>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
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
                <el-table-column prop="gradeInfo.name" label="会员等级" />
                <el-table-column prop="couponInfo.name" label="赠送卡券" align="center" />
                <el-table-column prop="couponInfo.sendNum" label="卡券数量" align="center" />
                <el-table-column prop="point" label="赠送积分" align="center" />

                <el-table-column prop="createTime" label="创建时间" align="center" width="160">
                    <template #default="scope">
                        <span>{{ new Date(scope.row.createTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center" width="160">
                    <template #default="scope">
                        <span>{{ new Date(scope.row.updateTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" fixed="right" align="center">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleItemStatusChange(scope.row, scope.row.status)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
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

    <el-dialog v-model="dialogInfoFormVisible" :title="dialogTitle" width="700px" @closed="onInfoFormClosed">
        <v-custom-form ref="infoFormRef" v-model="infoFormData" :formConfigs="formConfigs" />
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
import VCustomForm from '@/components/custom-form/index.vue';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { deleteOpenGift, saveOpenGift, searchOpenGiftList, updateOpenGiftStatus } from '../../../../api/member';
import { formConfigs } from './form-config';

class InfoFormData {
    id: string = ''
    gradeId: string
    couponId: string
    couponNum: string
    point: string
    status: string = 'A'
}

class InlineFormData {
    couponId: string
    gradeId: string
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
const gradeList = ref([]);

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

const handleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteOpenGift(row.id).then((res) => {
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
            id: row.id,
            status: status
        }

        updateOpenGiftStatus(params).then((res) => {
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
    infoFormRef.value.formRef.validate().then(() => {
        const params = {
            ...infoFormData.value
        }

        saveOpenGift(params).then((res) => {
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

    searchOpenGiftList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.paginationResponse.totalElements;

        tableListData.value = data.paginationResponse.content.map((item: any) => {
            item.gradeId = item.gradeInfo.id;
            item.couponId = item.couponInfo.id;
            return item;
        });
        gradeList.value = data.userGradeList;

        setFormFieldValue('gradeId', 'options', data.userGradeList.map((item: any) => ({
            value: item.id,
            label: item.name
        })));
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
</style>