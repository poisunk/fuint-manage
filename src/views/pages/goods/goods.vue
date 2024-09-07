<template>
    <div class="container">
        <el-form class="search-form-card" inline="true" :model="formInline" label-width="68px">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="formInline.name" placeholder="请输入商品名称" clearable />
            </el-form-item>

            <el-form-item label="所属店铺" prop="storeId">
                <el-select v-model="formInline.storeId" placeholder="所属店铺" clearable style="width: 180px;">
                    <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="商品分类" prop="cateId">
                <el-select v-model="formInline.cateId" placeholder="商品分类" clearable style="width: 180px;">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="商品条码" prop="goodsNo">
                <el-input v-model="formInline.goodsNo" placeholder="请输入商品条码" clearable />
            </el-form-item>

            <el-form-item label="商品类型" prop="type">
                <el-select v-model="formInline.type" placeholder="商品类型" clearable style="width: 180px;">
                    <el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="规格类型" prop="isSingleSpec">
                <el-select v-model="formInline.isSingleSpec" placeholder="规格类型" clearable>
                    <el-option label="单规格" value="Y" />
                    <el-option label="多规格" value="N" />
                </el-select>
            </el-form-item>

            <el-form-item label="上架状态" prop="status">
                <el-select v-model="formInline.status" placeholder="上架状态" clearable>
                    <el-option label="上架" value="A" />
                    <el-option label="下架" value="N" />
                </el-select>
            </el-form-item>

            <el-form-item label="库存状态" prop="stock">
                <el-select v-model="formInline.stock" placeholder="库存状态" clearable>
                    <el-option label="有库存" value="Y" />
                    <el-option label="无库存" value="N" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmitQuery" :icon="Search">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="default" @click="onSubmitReset" :icon="Refresh">重置</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="onSubmitAdd" :icon="Plus">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="goodsListData" style="width: 100%">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="store" label="所属店铺" />
            <el-table-column prop="name" label="商品名称" align="center" width="300" />
            <el-table-column prop="logo" label="主图" align="center">
                <template #default="scope">
                    <el-image class="table-item-logo" :src="scope.row.logo">
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
            <el-table-column prop="goodsNo" label="商品条码" align="center" width="150" />
            <el-table-column prop="stock" label="剩余库存" align="center" />
            <el-table-column prop="cate" label="所属分类" />
            <el-table-column prop="price" label="价格" align="center" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column label="上架状态" fixed="right" align="center" width="80">
                <template #default="scope">
                    <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                        @change="onGoodsStatusChange(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="180">
                <template #default="scope">
                    <el-button link type="primary" size="small" :icon="Edit"
                        @click="handleGoodsItemEdit(scope.row)">编辑</el-button>
                    <el-button link type="primary" size="small" :icon="Delete"
                        @click="handleGoodsItemDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="pagination-row">
            <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 40]" size="default" layout="total, sizes, prev, pager, next, jumper"
                    :total="total" @size-change="refreshData" @current-change="refreshData" />
            </el-config-provider>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getGoodsList, updateGoodsStatus } from '../../../api/goods';
import { onMounted } from 'vue';
import { errorNotification, successNotification } from '../../../utils/notification';
import { ElConfigProvider, ElMessageBox } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { formConfigs } from './category-form-config';
import router from '../../../router';

const goodsListData = ref([]);
const storeList = ref([]);
const categoryList = ref([]);
const typeList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const formInline = ref({
    name: '',
    storeId: '',
    cateId: '',
    goodsNo: '',
    type: '',
    stock: '',
    isSingleSpec: '',
    status: '',
});

const onSubmitQuery = () => {
    currentPage.value = 1;
    refreshData();
};

const onSubmitReset = () => {
    for (let key in formInline.value) {
        formInline.value[key] = '';
    }
};

const onSubmitAdd = () => {
    router.push('/goods/add');
};


const handleGoodsItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: 'D'
        }
        updateGoodsStatus(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                refreshData();
            } else {
                errorNotification(res.data.message);
            }
        })
    })
}

const handleGoodsItemEdit = (row: any) => {
    router.push('/goods/edit?goodsId=' + row.id);
}

const onGoodsStatusChange = (row: any) => {
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
        updateGoodsStatus(params).then((res) => {
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


const refreshData = () => {
    const params = Object.assign({}, formInline.value, {
        page: currentPage.value,
        pageSize: pageSize.value,
    })

    getGoodsList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;

        storeList.value = res.data.data.storeList;

        categoryList.value = res.data.data.cateList;
        typeList.value = res.data.data.typeList;

        formConfigs[1].options = storeList.value;

        goodsListData.value = data.paginationResponse.content;
        goodsListData.value.forEach((item: any) => {
            for (var i = 0; i < storeList.value.length; i++) {
                if (item.storeId == storeList.value[i].id) {
                    item.store = storeList.value[i].name;
                }
            }

            for (var i = 0; i < categoryList.value.length; i++) {
                if (item.cateId == categoryList.value[i].id) {
                    item.cate = categoryList.value[i].name;
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
    width: 100%;
    display: block;
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
        width: 240px;
    }

    .el-select {
        width: 120px;
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