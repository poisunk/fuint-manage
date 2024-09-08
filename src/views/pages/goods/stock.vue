<template>
    <div class="container">
        <el-row>
            <el-form class="search-line-form" :inline="true" :model="formInline" label-width="70px"
                style="width: 100%;">
                <el-form-item label="说明备注">
                    <el-input v-model="formInline.description" placeholder="请输入说明备注" clearable />
                </el-form-item>
                <el-form-item label="操作类型">
                    <el-select v-model="formInline.type" placeholder="操作类型" clearable>
                        <el-option label="入库" value="increase" />
                        <el-option label="出库" value="reduce" />
                    </el-select>
                </el-form-item>

                <el-form-item label="所属店铺">
                    <el-select v-model="formInline.storeId" placeholder="所属店铺" clearable>
                        <el-option v-for="item in storeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmitQuery" :icon="Search">搜索</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="default" @click="onSubmitReset" :icon="Refresh">重置</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" plain @click="onAddIncreaseStock" :icon="Plus">新增入库</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="default" plain @click="onAddReduceStock" :icon="Plus">新增出库</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="stockListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="typeName" label="类型" />
                <el-table-column prop="store" label="所属店铺" />
                <el-table-column prop="description" label="说明备注" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="updateTime" label="更新时间" width="180" />
                <el-table-column label="操作" fixed="right" align="center" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="View"
                            @click="onViewStock(scope.row)">详情</el-button>
                        <el-button link type="primary" size="small" :icon="Delete" @click="onRemoveStock(scope.row)">删除
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

    <el-dialog v-model="dialogStockInfoVisible" :title="dialogTitle" width="70%" @closed="onStockDialogClosed">
        <el-form :model="stockInfoData" label-width="120px">
            <el-form-item label="所属店铺">
                <div>
                    <el-select v-model="stockInfoData.storeId" placeholder="所属店铺" clearable>
                        <el-option v-for="item in storeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <p class="input-tips">提示: 未选择则属于公共所有</p>
                </div>
            </el-form-item>

            <el-form-item label="说明备注">
                <el-input v-model="stockInfoData.description" type="textarea" placeholder="请输入说明备注" rows="5" />
            </el-form-item>
        </el-form>

        <el-button v-if="dialogTitle == '新增入库' || dialogTitle == '新增出库'" type="primary" @click="onOpenGoodsListDialog"
            :icon="Plus">添加商品</el-button>

        <el-table :data="stockInfoData.goodsList" border style="width: 100%">
            <el-table-column prop="goodsNo" label="商品条码" />
            <el-table-column prop="logoUrl" label="主图" align="center">
                <template #default="scope">
                    <el-image style="width: 60px; height: 60px" :src="scope.row.logoUrl" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" align="center" />
            <el-table-column prop="specInfo" label="商品规格" />
            <el-table-column prop="stock" label="数量" width="180" align="center">
                <template #default="scope">
                    <el-input-number v-model="scope.row.num" :min="0" :disabled="dialogTitle == '入库详情'" />
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link :type="dialogTitle == '入库详情' ? 'default' : 'default'" size="small" :icon="Delete"
                        @click="onRemoveSelectGoods(scope.row)" :disabled="dialogTitle == '入库详情'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <span class="dialog-footer">
                <el-button v-if="dialogTitle == '新增入库' || dialogTitle == '新增出库'" type="primary"
                    @click="onSubmitStockInfo">提交</el-button>
                <el-button v-if="dialogTitle == '新增入库' || dialogTitle == '新增出库'"
                    @click="onStockDialogCancel">取消</el-button>
                <el-button v-else @click="onStockDialogCancel">关闭</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogGoodsListVisible" title="选择商品" width="55%">
        <el-form class="search-line-form" inline="true" label-width="70px">
            <el-form-item label="商品名称">
                <el-input v-model="selectGoodsKeyword" placeholder="商品名称" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchSelectGoodsList" :icon="Search">查找商品</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="selectGoodsListData" border style="width: 100%">
            <el-table-column label="选择" width="55" align="center">
                <template #default="scope">
                    <el-checkbox v-model="scope.row.checked" @change="onSelectGoods(scope.row)" />
                </template>
            </el-table-column>
            <el-table-column prop="logoUrl" label="主图" align="center">
                <template #default="scope">
                    <el-image style="width: 60px; height: 60px" :src="scope.row.logoUrl" />
                </template>
            </el-table-column>
            <el-table-column prop="goodsNo" label="商品条码" />
            <el-table-column prop="name" label="商品名称" align="center" />
            <el-table-column prop="specInfo" label="商品规格" align="center" />
            <el-table-column prop="stock" label="库存" align="center" />
        </el-table>

        <el-row class="pagination-row">
            <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="selectGoodsListPagination.currentPage"
                    v-model:page-size="selectGoodsListPagination.pageSize" :page-sizes="[10, 20, 30, 40]" size="default"
                    layout="total, sizes, prev, pager, next, jumper" :total="selectGoodsListPagination.total"
                    @size-change="handlePaginationChange" @current-change="handlePaginationChange" />
            </el-config-provider>
        </el-row>

        <template #footer>
            <el-button @click="dialogGoodsListVisible = false">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, View, Delete } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { errorNotification, successNotification } from '../../../utils/notification';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import VCustomForm from '@/components/custom-form/index.vue';
import { deleteStock, getStockInfo, getStockList, saveStockInfo, selectGoodsList } from '../../../api/goods';

const formInline = ref({
    description: '',
    storeId: '',
    type: '',
});
const storeList = ref([]);
const stockListData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const imagePath = ref('');
const dialogTitle = ref('');
const dialogStockInfoVisible = ref(false);
const dialogGoodsListVisible = ref(false);
const stockInfoData = ref({
    description: '',
    storeId: null,
    type: '',
    goodsList: []
})
const selectGoodsListData = ref([]);
const selectGoodsKeyword = ref('');
const selectGoodsListPagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

const onSubmitQuery = () => {
    searchStockList();
}

const onSubmitReset = () => {
    formInline.value = {
        description: '',
        storeId: '',
        type: '',
    }
}

const onAddIncreaseStock = () => {
    dialogTitle.value = '新增入库';
    dialogStockInfoVisible.value = true;
    stockInfoData.value.type = 'increase';
}

const onAddReduceStock = () => {
    dialogTitle.value = '新增出库';
    dialogStockInfoVisible.value = true;
    stockInfoData.value.type = 'reduce';
}

const onOpenGoodsListDialog = () => {
    dialogGoodsListVisible.value = true;
    searchSelectGoodsList();
}

const onStockDialogCancel = () => {
    dialogStockInfoVisible.value = false;
}

const onStockDialogClosed = () => {
    stockInfoData.value = {
        description: '',
        storeId: null,
        type: '',
        goodsList: []
    }
}

const onSelectGoods = (goods: any) => {
    if (goods.checked) {
        stockInfoData.value.goodsList.push(goods);
    } else {
        stockInfoData.value.goodsList = stockInfoData.value.goodsList.filter((item: any) => {
            return item.skuId != goods.skuId
        });
    }
}

const onSubmitStockInfo = () => {
    if (stockInfoData.value.goodsList.length == 0) {
        ElMessageBox.alert('请先选择商品', '系统提示', {
            confirmButtonText: '确认',
            type: 'warning',
        })
        return;
    }
    saveStockInfo(stockInfoData.value).then((res) => {
        if (res.data.code == 200) {
            successNotification(res.data.message);
            dialogStockInfoVisible.value = false;
            searchStockList();
        } else {
            errorNotification(res.data.message);
        }
    })
}

const searchSelectGoodsList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        keyword: selectGoodsKeyword.value,
    }
    selectGoodsList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }
        const data = res.data.data;
        selectGoodsListPagination.value.total = data.paginationResponse.totalElements;

        selectGoodsListData.value = data.paginationResponse.content;
        selectGoodsListData.value.forEach((item: any) => {
            item.checked = false;
            item.logoUrl = imagePath.value + item.logo;
            item.num = 0;

            let specInfo = '';
            if (item.specList) {
                item.specList.forEach((spec: any) => {
                    specInfo += spec.value;
                })
            }
            item.specInfo = specInfo.length ? specInfo : '--';

            for (let i = 0; i < stockInfoData.value.goodsList.length; i++) {
                if (stockInfoData.value.goodsList[i].skuId == item.skuId) {
                    item.checked = true;
                    break;
                }
            }
        })
    })
}

const onRemoveSelectGoods = (goods: any) => {
    stockInfoData.value.goodsList = stockInfoData.value.goodsList.filter((item: any) => {
        return item.skuId != goods.skuId
    })
}

const onViewStock = (stock: any) => {
    getStockInfo(stock.id).then((res) => {
        if (res.data.code == 200) {
            const data = res.data.data;
            stockInfoData.value.goodsList = data.goodsList;
            stockInfoData.value.goodsList.forEach((item: any) => {
                item.logoUrl = imagePath.value + item.logo;
                let specInfo = '';
                if (item.specList) {
                    item.specList.forEach((spec: any) => {
                        specInfo += spec.value;
                    })
                }
                item.specInfo = specInfo.length ? specInfo : '--';
            })
            stockInfoData.value.description = data.stockInfo.description;
            stockInfoData.value.storeId = data.stockInfo.storeId;

            dialogTitle.value = '入库详情';
            dialogStockInfoVisible.value = true;
        } else {
            errorNotification(res.data.message);
        }
    })
}

const onRemoveStock = (stock: any) => {
    ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '系统提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteStock(stock.id).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                searchStockList();
            } else {
                errorNotification(res.data.message);
            }
        })
    })
}

const searchStockList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        description: formInline.description,
        storeId: formInline.storeId,
        type: formInline.type,
    }

    getStockList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }
        const data = res.data.data;

        total.value = data.paginationResponse.totalElements;

        imagePath.value = data.imagePath;
        storeList.value = data.storeList.map((store: any) => ({
            value: store.id,
            label: store.name
        }));
        storeList.value.unshift({ value: 0, label: '公共店铺' });

        stockListData.value = data.paginationResponse.content;
        stockListData.value.forEach((item: any) => {
            item.createTime = new Date(item.createTime).toLocaleString();
            item.updateTime = new Date(item.updateTime).toLocaleString();
            for (var i = 0; i < storeList.value.length; i++) {
                if (item.storeId == storeList.value[i].value) {
                    item.store = storeList.value[i].label;
                }
            }

            item.typeName = item.type == 'increase' ? '入库' : '出库';
            item.description = item.description ? item.description : '--';
        })
    })
}

const handlePaginationChange = () => {
    searchStockList();
}

onMounted(() => {
    searchStockList();
});
</script>

<style lang="less" scoped>
.container {
    padding: 20px;
}

.search-line-form {
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

.input-tips {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 200;
    line-height: 12px;
    margin-top: 5px;
}

:deep(.el-form-item__label) {
    font-weight: bold;
}

:deep(.el-form-item__content) {
    display: block;
}
</style>