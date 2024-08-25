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
                    <el-button type="primary" plain @click="dialogAddBannerFormVisible = true"
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
                        <el-image class="table-item-image" :src="scope.row.logoUrl"
                            :preview-src-list="[scope.row.logoUrl]" />
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

    <VDialogFormBanner v-model="dialogAddBannerFormVisible" title="新增商品分类" @confirm="handleBannerConfirm"
        @cancel="handleBannerCancel" :bannerForm="bannerForm" :storeList="storeList" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getGoodsCategoryList } from '../../../api/goods';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { errorNotification, successNotification } from '../../../utils/notification';
import VDialogFormBanner from '@/components/dialog-form-goods-category.vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const categryListData = ref([]);
const storeList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const formInline = ref({
    name: '',
    storeId: '',
    status: '',
});
const dialogAddBannerFormVisible = ref(false);

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
        storeList.value.unshift({ value: '0', label: '公共店铺' });

        categryListData.value = data.paginationResponse.content;
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
</style>