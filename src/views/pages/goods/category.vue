<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="分类名称">
                    <el-input v-model="formInline.name" placeholder="请输入分类名称" clearable />
                </el-form-item>
                <el-form-item label="所属店铺">
                    <el-select v-model="formInline.storeId" placeholder="所属店铺" clearable>
                        <el-option v-for="item in storeList" :key="item.value" :label="item.label"
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
                    <el-button type="primary" plain @click="dialogAddCategoryFormVisible = true"
                        :icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="categoryListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="store" label="所属店铺" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="logo" label="图片">
                    <template #default="scope">
                        <el-image class="table-item-logo" :src="scope.row.logoUrl">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon>
                                        <Picture />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="updateTime" label="更新时间" width="180" />
                <el-table-column label="状态" fixed="right" align="center" width="80">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="onCategoryStatusChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleCategoryItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleCategoryItemDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row class="pagination-row">
            <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 40]" size="default" layout="total, sizes, prev, pager, next, jumper"
                    :total="total" @size-change="refreshData" @current-change="refreshData" />
            </el-config-provider>
        </el-row>
    </div>

    <el-dialog v-model="dialogAddCategoryFormVisible" title="新增分类" width="700px" @close="onAddCategoryFormClose">
        <v-custom-form ref="addCategoryFormRef" v-model="addCategoryFormData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="handleAddCategoryConfirm">确定</el-button>
            <el-button @click="onAddCategoryFormClose">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogEditCategoryFormVisible" title="编辑分类" width="700px">
        <v-custom-form ref="editCategoryFormRef" v-model="editCategoryFormData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="handleEditCategoryConfirm">确定</el-button>
            <el-button @click="dialogEditCategoryFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getGoodsCategoryList, saveGoodsCategory, updateGoodsCategoryStatus } from '../../../api/goods';
import { onMounted } from 'vue';
import { errorNotification, successNotification } from '../../../utils/notification';
import { ElConfigProvider, ElMessageBox } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import VCustomForm from '@/components/custom-form/index.vue';
import { formConfigs } from './category-form-config';

const categoryListData = ref([]);
const storeList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const formInline = ref({
    name: '',
    storeId: '',
    status: '',
});
const dialogAddCategoryFormVisible = ref(false);
const dialogEditCategoryFormVisible = ref(false);
const addCategoryFormData = ref({
    name: '',
    storeId: null,
    sort: 0,
    logo: '',
    description: '',
    status: 'A',
});
const editCategoryFormData = ref({});
const addCategoryFormRef = ref();
const editCategoryFormRef = ref();

const onSubmitQuery = () => {
    currentPage.value = 1;
    refreshData();
}

const onSubmitReset = () => {
    formInline.value = {
        name: '',
        storeId: '',
        status: '',
    }
};

const handleEditCategoryConfirm = () => {
    editCategoryFormRef.value.formRef.validate().then(() => {
        saveGoodsCategory(editCategoryFormData.value).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                dialogEditCategoryFormVisible.value = false;
                refreshData();
            } else {
                errorNotification(res.data.message);
            }
        })
    }).catch(() => {
        errorNotification('请正确填写表单信息');
    })
}

const handleCategoryItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: 'D'
        }
        updateGoodsCategoryStatus(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                refreshData();
            } else {
                errorNotification(res.data.message);
            }
        })
    })
}

const handleCategoryItemEdit = (row: any) => {
    dialogEditCategoryFormVisible.value = true;
    editCategoryFormData.value = row;
    editCategoryFormData.value.storeId = row.storeId === 0 ? null : row.storeId;
    if (row.logo) {
        formConfigs.forEach((item: any) => {
            if (item.field == 'logo') {
                item.imageUrl = row.logoUrl;
            }
        })
    }
}

const onCategoryStatusChange = (row: any) => {
    const statusName = row.status == 'A' ? '启用' : '禁用';
    ElMessageBox.confirm('确认要' + statusName + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: row.status
        }
        updateGoodsCategoryStatus(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                refreshData();
            } else {
                errorNotification(res.data.message);
            }
        }).catch(() => {
            errorNotification('更改状态失败');
        })
    }).catch(() => {
        row.status = row.status == 'A' ? 'N' : 'A';
    })
}

const handleAddCategoryConfirm = () => {
    addCategoryFormRef.value.formRef.validate().then(() => {
        saveGoodsCategory(addCategoryFormData.value).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                dialogAddCategoryFormVisible.value = false;
                refreshData();
            } else {
                errorNotification(res.data.message);
            }
        }).catch(() => {
            errorNotification('请正确填写表单信息');
        })
    }).catch(() => {
        errorNotification('请正确填写表单信息');
    })
}

const onAddCategoryFormClose = () => {
    addCategoryFormData.value = {
        name: '',
        storeId: null,
        sort: 0,
        logo: '',
        description: '',
        status: 'A',
    }
    dialogAddCategoryFormVisible.value = false;
}

const refreshData = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        name: formInline.value.name,
        storeId: formInline.value.storeId,
        status: formInline.value.status
    }

    getGoodsCategoryList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;

        storeList.value = res.data.data.storeList.map((store: any) => ({
            value: store.id,
            label: store.name
        }));
        storeList.value.unshift({ value: 0, label: '公共店铺' });

        formConfigs[1].options = storeList.value;

        categoryListData.value = data.paginationResponse.content;
        categoryListData.value.forEach((item: any) => {
            item.logoUrl = data.imagePath + item.logo;

            for (var i = 0; i < storeList.value.length; i++) {
                if (item.storeId == storeList.value[i].value) {
                    item.store = storeList.value[i].label;
                }
            }
        })

        total.value = data.paginationResponse.totalElements;
    })
}

onMounted(() => {
    refreshData();
})
</script>

<style lang="less" scoped>
.container {
    display: block;
    padding: 20px;
}

.search-form-card {
    width: 100%;
    border: 1px solid #e2e1e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 10px;
    background-color: #f5f5f5;

    .el-input {
        width: 200px;
    }

    .el-select {
        width: 180px;
    }

}

.pagination-row {
    margin-top: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
}

.table-item-logo {
    width: 60px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 30px;
}
</style>