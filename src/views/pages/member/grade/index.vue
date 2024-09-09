<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="等级名称">
                    <el-input v-model="formInline.name" placeholder="请输入等级名称" clearable />
                </el-form-item>

                <el-form-item label="升级方式">
                    <el-select v-model="formInline.catchType" placeholder="升级方式" clearable>
                        <el-option v-for="item in catchTypeList" :key="item.value" :label="item.name"
                            :value="item.value" />
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
                    <el-button type="primary" plain @click="onOpenAddGradeForm" :icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="gradeListData" style="width: 100%">
                <el-table-column prop="grade" label="等级" />
                <el-table-column prop="name" label="等级名称" />
                <el-table-column prop="catchType" label="升级方式" />
                <el-table-column prop="catchValue_text" label="升级条件值" align="center" />
                <el-table-column prop="validDay_text" label="有效天数" align="center" />
                <el-table-column prop="discount_text" label="支付折扣" align="center" />
                <el-table-column prop="speedPoint_text" label="积分加速" align="center" />
                <el-table-column label="状态" align="center" width="80">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleGradeStatusChange(scope.row, scope.row.status)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleGradeItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleGradeItemDelete(scope.row)">删除
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

    <el-dialog v-model="dialogGradeInfoFormVisible" :title="dialogTitle" width="700px" @closed="onGradeInfoFormClosed">
        <v-custom-form ref="gradeInfoFormRef" v-model="gradeInfoData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="onGradeInfoFormConfirm">确定</el-button>
            <el-button @click="dialogGradeInfoFormVisible = false">取消</el-button>
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
import { deleteMemberGrade, getMemberGradeList, saveMemberGrade, updateMemberGradeStatus } from '../../../../api/member';
import { formConfigs } from './form-config';

const formInline = ref({
    name: '',
    catchType: '',
    status: '',
});
const emptyGradeInfoData = {
    grade: '',
    name: '',
    catchCondition: '',
    userPrivilege: '',
    catchType: '',
    catchValue: '',
    validDay: '',
    discount: '',
    speedPoint: '',
    status: 'A',
}
const gradeListData = ref([]);
const gradeInfoData = ref(JSON.parse(JSON.stringify(emptyGradeInfoData)));
const catchTypeList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogGradeInfoFormVisible = ref(false);
const dialogTitle = ref('');
const gradeInfoFormRef = ref({});

const onSubmitQuery = () => {
    searchGradeList();
}

const onSubmitReset = () => {
    formInline.value = {
        name: '',
        catchType: '',
        status: '',
    }
    searchGradeList();
}

const onGradeInfoFormClosed = () => {
    gradeInfoData.value = JSON.parse(JSON.stringify(emptyGradeInfoData));
    dialogGradeInfoFormVisible.value = false;
}

const onOpenAddGradeForm = () => {
    dialogTitle.value = '新增会员等级';
    dialogGradeInfoFormVisible.value = true;
}

const handleGradeItemEdit = (row: any) => {
    gradeInfoData.value = row;
    dialogTitle.value = '编辑会员等级';
    dialogGradeInfoFormVisible.value = true;
}

const handleGradeItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteMemberGrade(row.id).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            searchGradeList();
        })
    })
}

const handleGradeStatusChange = (row: any, status: string = '') => {
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
            userGradeId: row.id,
            status: status
        }
        updateMemberGradeStatus(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                if (status == 'D') {
                    return;
                }
                row.status = row.status == 'A' ? 'N' : 'A';
                return;
            }

            successNotification(res.data.message);
            searchGradeList();
        })
    }).catch(() => {
        if (status == 'D') {
            return;
        }
        row.status = row.status == 'A' ? 'N' : 'A';
    });
}

const onGradeInfoFormConfirm = () => {
    gradeInfoFormRef.value.formRef.validate().then(() => {
        let params = {
            ...gradeInfoData.value
        }

        saveMemberGrade(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            dialogGradeInfoFormVisible.value = false;
            searchGradeList();
        })
    }).catch(() => {
        errorNotification('请填写必填项');
    })
}

const searchGradeList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    getMemberGradeList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }
        const data = res.data.data;
        catchTypeList.value = data.catchTypeList;
        setFormFieldValue('catchType', 'options', catchTypeList.value.map((item: any) => ({
            value: item.value,
            label: item.name
        })));

        total.value = data.paginationResponse.totalElements;

        gradeListData.value = data.paginationResponse.content;
        gradeListData.value.forEach((item: any) => {
            item.catchValue_text = item.catchValue == 0 ? '无条件' : item.catchValue;
            item.validDay_text = item.validDay == 0 ? '永久' : item.validDay + '天';
            item.discount_text = item.discount == 0 ? '无折扣' : item.discount + '折';
            item.speedPoint_text = item.speedPoint == 0 ? '无加速' : item.speedPoint + '倍数';
        })
    })
}

const handlePaginationChange = () => {
    searchGradeList();
}


const setFormFieldValue = (fieldName: string, valueName: string, value: any) => {
    for (const item of formConfigs) {
        if (item.field == fieldName) {
            item[valueName] = value;
        }
    }
}

onMounted(() => {
    searchGradeList();
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

.pagination-row {
    margin-top: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;

}
</style>