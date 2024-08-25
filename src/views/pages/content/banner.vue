<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" :inline="true" :model="formInline" label-width="70px">
                <el-form-item label="标题">
                    <el-input v-model="formInline.title" placeholder="请输入标题" clearable />
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
                    <el-button type="primary" plain @click="dialogAddBannerFormVisible = true"
                        :icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="bannerListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="store" label="所属店铺" />
                <el-table-column prop="url" label="图片">
                    <template #default="scope">
                        <el-image class="table-item-image" :src="scope.row.imageUrl" />
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="updateTime" label="更新时间" width="180" />
                <el-table-column prop="sort" label="排序" align="center" width="60" />
                <el-table-column label="状态" fixed="right" align="center" width="80">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleBannerStatusChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleBannerItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleBannerItemDelete(scope.row)">删除
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

    <el-dialog v-model="dialogAddBannerFormVisible" title="新增轮播图" width="700px" @close="onAddBannerFormClose">
        <v-custom-form ref="addBannerFormRef" v-model="addBannerFormData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="handleAddBannerConfirm">确定</el-button>
            <el-button @click="onAddBannerFormClose">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogEditBannerFormVisible" title="编辑轮播图" width="700px">
        <v-custom-form ref="editBannerFormRef" v-model="editBannerFormData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="handleEditBannerConfirm">确定</el-button>
            <el-button @click="dialogEditBannerFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getBannerList, saveBanner, updateBanner } from '../../../api/content';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { errorNotification, successNotification } from '../../../utils/notification';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import VCustomForm from '@/components/custom-form/index.vue';
import { formConfigs } from './banner-form-config';
import { el } from 'element-plus/es/locale';

const formInline = ref({
    title: '',
    storeId: '',
    status: '',
});
const addBannerFormData = ref({
    title: '',
    storeId: null,
    url: '',
    sort: null,
    description: '',
    image: '',
    status: 'A',
});
const editBannerFormData = ref({});
const storeList = ref([]);
const bannerListData = ref([]);
const dialogAddBannerFormVisible = ref(false);
const dialogEditBannerFormVisible = ref(false);
const editBannerFormRef = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const addBannerFormRef = ref();

const onSubmitQuery = () => {
    searchBannerList();
}

const onSubmitReset = () => {
    formInline.value = {
        title: '',
        storeId: '',
        status: '',
    }
};

const handleEditBannerConfirm = () => {
    editBannerFormRef.value.formRef.validate().then(() => {
        saveBanner(editBannerFormData.value).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                dialogEditBannerFormVisible.value = false;
                searchBannerList();
            } else {
                errorNotification(res.data.message);
            }
        })
    }).catch(() => {
        errorNotification('请正确填写表单信息');
    })
}

const handleAddBannerConfirm = () => {
    addBannerFormRef.value.formRef.validate().then(() => {
        saveBanner(addBannerFormData.value).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                dialogAddBannerFormVisible.value = false;
                searchBannerList();
            } else {
                errorNotification(res.data.message);
            }
        })
    }).catch(() => {
        errorNotification('请正确填写表单信息');
    })
}

const onAddBannerFormClose = () => {
    addBannerFormData.value = {
        title: '',
        storeId: null,
        url: '',
        sort: null,
        description: '',
        image: '',
        status: 'A',
    }
    dialogAddBannerFormVisible.value = false;
}

const handleBannerItemEdit = (row: any) => {
    dialogEditBannerFormVisible.value = true;
    editBannerFormData.value = row;
    editBannerFormData.value.storeId = row.storeId === 0 ? null : row.storeId;

    formConfigs.forEach((item: any) => {
        if (item.field == 'image') {
            item.imageUrl = row.imageUrl;
        }
    })
}

const handleBannerItemDelete = (row: any) => {
    ElMessageBox.confirm('此操作将永久删除该数据，是否继续？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: 'D'
        }
        updateBanner(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                searchBannerList();
            } else {
                errorNotification(res.data.message);
            }
        })
    })
};

const handleBannerStatusChange = (row: any) => {
    const statusName = row.status == 'A' ? '启用' : '禁用';
    ElMessageBox.confirm('确认要' + statusName + row.title + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: row.status
        };
        updateBanner(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
            } else {
                errorNotification(res.data.message);
            }
        })
    }).catch(() => {
        row.status = row.status == 'A' ? 'N' : 'A';
    });
}

const searchBannerList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        title: formInline.title,
        storeId: formInline.storeId,
        status: formInline.status
    }

    getBannerList(params).then((res) => {
        const data = res.data.data;

        total.value = data.dataList.totalElements;

        const imagePath = data.imagePath;
        storeList.value = res.data.data.storeList.map((store: any) => ({
            value: store.id,
            label: store.name
        }));
        storeList.value.unshift({ value: '0', label: '公共店铺' });

        formConfigs[1].options = storeList.value;

        bannerListData.value = data.dataList.content;
        bannerListData.value.forEach((item: any) => {
            item.createTime = new Date(item.createTime).toLocaleString();
            item.updateTime = new Date(item.updateTime).toLocaleString();
            item.imageUrl = imagePath + item.image;
            for (var i = 0; i < storeList.value.length; i++) {
                if (item.storeId == storeList.value[i].value) {
                    item.store = storeList.value[i].label;
                }
            }
        })
    })
}

const handlePaginationChange = () => {
    searchBannerList();
}

onMounted(() => {
    searchBannerList();
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