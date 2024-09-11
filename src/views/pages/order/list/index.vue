<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="会员ID">
                    <el-input v-model="formInline.userId" placeholder="请输入会员ID" clearable />
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model="formInline.mobile" placeholder="请输入手机号" clearable />
                </el-form-item>

                <el-form-item label="订单号">
                    <el-input v-model="formInline.orderSn" placeholder="请输入订单号" clearable />
                </el-form-item>

                <el-form-item label="订单类型">
                    <el-select v-model="formInline.type" placeholder="订单类型" clearable>
                        <el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="所属店铺">
                    <el-select v-model="formInline.storeId" placeholder="所属店铺" clearable>
                        <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="订单状态">
                    <el-select v-model="formInline.status" placeholder="订单状态" clearable>
                        <el-option v-for="item in statusList" :key="item.key" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="支付状态">
                    <el-select v-model="formInline.payStatus" placeholder="支付状态" clearable>
                        <el-option v-for="item in payStatusList" :key="item.key" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="配送方式">
                    <el-select v-model="formInline.orderMode" placeholder="配送方式" clearable>
                        <el-option v-for="item in orderModeList" :key="item.key" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="下单时间">
                    <ElConfigProvider :locale="zhCn">
                        <el-date-picker v-model="formInline.startTime" type="datetime" placeholder="开始日期" />
                        ~
                        <el-date-picker v-model="formInline.endTime" type="datetime" placeholder="结束日期" />
                    </ElConfigProvider>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmitQuery" :icon="Search">搜索</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="default" @click="onSubmitReset" :icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="tableListData" style="width: 100%">
                <el-table-column prop="id" label="订单ID" width="80" />
                <el-table-column prop="orderSn" label="订单号" align="center" width="200">
                    <template #default="scope">
                        <span class="table-order-sn">{{ scope.row.orderSn }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userInfo.name" label="会员名称" align="center" width="80" />
                <el-table-column prop="type" label="订单类型" align="center" width="120">
                    <template #default="scope">
                        <span>{{ typeList.find((item) => item.value === scope.row.type)?.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="storeInfo.id" label="所属店铺" align="center" width="140">
                    <template #default="scope">
                        <span>{{ storeList.find((item) => item.id === scope.row.storeInfo.id)?.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="payAmount" label="总金额" align="center" width="80">
                    <template #default="scope">
                        <span>{{ scope.row.payAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="payStatus" label="支付状态" align="center" width="120">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.payStatus === 'B'">已支付</el-tag>
                        <el-tag type="danger" v-else>待支付</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="订单状态" align="center" width="80">
                    <template #default="scope">
                        <el-tag type="info">{{ scope.row.statusText }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="orderMode" label="配送方式" align="center" width="80">
                    <template #default="scope">
                        <span>{{ orderModeList.find((item) => item.value === scope.row.orderMode)?.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="payTime" label="下单时间" align="center" width="140" />

                <el-table-column prop="payAmount" label="支付金额" align="center" width="80">
                    <template #default="scope">
                        <span>{{ scope.row.payAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="discount" label="优惠金额" align="center" width="80">
                    <template #default="scope">
                        <span>{{ scope.row.discount.toFixed(2) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="pointAmount" label="积分金额" align="center" width="80">
                    <template #default="scope">
                        <span>{{ scope.row.pointAmount.toFixed(2) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="updateTime" label="更新时间" align="center" width="140" />

                <el-table-column label="操作" fixed="right" align="center" width="140">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit" @click="">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete" @click="">删除</el-button>
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
import { deleteCouponGroup, getCouponGroupList, saveCouponGroup, updateCouponGroupStatus } from '../../../../api/coupon';
import { searchOrderList } from '../../../../api/order';

class InlineFormData {
    userId: string
    mobile: string
    orderSn: string
    type: string
    storeId: string
    status: string
    payStatus: string
    orderMode: string
    startTime: string
    endTime: string
}

const formInline = ref(new InlineFormData());
const tableListData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const orderModeList = ref([]);
const payStatusList = ref([]);
const payTypeList = ref([]);
const statusList = ref([]);
const storeList = ref([]);
const typeList = ref([]);

const onSubmitQuery = () => {
    searchTableList();
}

const onSubmitReset = () => {
    formInline.value = new InlineFormData();
    searchTableList();
}

const handleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteCouponGroup(row.id).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    })
}

const searchTableList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    searchOrderList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.paginationResponse.totalElements;

        orderModeList.value = data.orderModeList;
        payStatusList.value = data.payStatusList;
        payTypeList.value = data.payTypeList;
        statusList.value = data.statusList;
        storeList.value = data.storeList;
        storeList.value.unshift({ id: 0, name: '公共店铺' });
        typeList.value = data.typeList;

        tableListData.value = data.paginationResponse.content;
    })
}

const getTypeName = (type: string) => {
    return typeList.value.filter((item: any) => item.value == type)[0].name
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

.table-order-sn {
    color: #cbdfff;
}
</style>