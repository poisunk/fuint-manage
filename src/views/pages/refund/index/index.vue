<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="订单号">
                    <el-input v-model="formInline.orderSn" placeholder="请输入订单号" clearable />
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model="formInline.mobile" placeholder="请输入手机号" clearable />
                </el-form-item>

                <el-form-item label="会员ID">
                    <el-input v-model="formInline.userId" placeholder="请输入会员ID" clearable />
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="formInline.status" placeholder="状态" clearable>
                        <el-option label="启用" value="A" />
                        <el-option label="禁用" value="N" />
                    </el-select>
                </el-form-item>

                <el-form-item label="提交时间">
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
                <el-table-column prop="id" label="售后ID" width="60" />
                <el-table-column prop="orderInfo.orderSn" label="订单号" align="center" width="200" />
                <el-table-column prop="orderInfo.userInfo.id" label="会员ID" align="center" width="80" />
                <el-table-column prop="storeInfo.name" label="所属店铺" align="center" width="140" />
                <el-table-column label="售后类型" align="center" width="80">
                    <template #default="scope">
                        <span>{{ refundTypeList.find((item) => item.value === scope.row.type)?.name ?
                            refundTypeList.find((item) => item.value === scope.row.type)?.name : '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="退款金额" align="center" width="80">
                    <template #default="scope">
                        <span>{{ scope.row.amount?.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" width="200">
                    <template #default="scope">
                        <span>{{ scope.row.remark ? scope.row.remark : '无' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="80">
                    <template #default="scope">
                        <el-tag
                            :type="(scope.row.status === 'B' ? 'success' : '') || (scope.row.status === 'C' ? 'danger' : '') || 'info'">
                            {{ statusList.find((item) => item.value === scope.row.status)?.name }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="提交时间" align="center" width="160" />
                <el-table-column prop="updateTime" label="更新时间" align="center" width="160" />

                <el-table-column label="操作" fixed="right" width="200">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="View"
                            @click="handleItemDetail(scope.row)">订单详情</el-button>
                        <el-button link type="primary" size="small" :icon="EditPen"
                            @click="handleItemAudit(scope.row)">审核
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

    <el-dialog v-model="dialogAuditVisible" title="审核售后订单">
        <el-form :model="auditFormData" label-width="120px">
            <el-form-item label="订单号">
                <el-input v-model="auditFormData.orderInfo.orderSn" disabled />
            </el-form-item>

            <el-form-item label="订单总金额">
                <el-input v-model="auditFormData.orderInfo.amount" disabled />
            </el-form-item>

            <el-form-item label="会员名称">
                <el-input v-model="auditFormData.orderInfo.userInfo.name" disabled />
            </el-form-item>

            <el-form-item label="申请时间">
                <el-input v-model="auditFormData.createTime" disabled />
            </el-form-item>

            <el-form-item label="申请备注">
                <el-input v-model="auditFormData.remark" placeholder="请输入备注" type="textarea" />
            </el-form-item>

            <el-form-item label="状态">
                <el-select v-model="auditFormData.status" placeholder="状态" style="width: 200px">
                    <el-option v-for="item in statusList" :key="item.key" :label="item.name" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="auditFormData.status === 'C'" label="拒绝原因">
                <el-input v-model="auditFormData.refuseReason" placeholder="请输入拒绝原因" type="textarea" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button type="primary" @click="handleAuditConfirm">确定</el-button>
            <el-button @click="dialogAuditVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, View, EditPen } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { saveRefund, searchRefundList } from '../../../../api/order';
import router from '../../../../router';

class InlineFormData {
    orderSn: string
    mobile: string
    userId: string
    status: string
    startTime: string
    endTime: string
}

const formInline = ref(new InlineFormData());
const tableListData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const refundTypeList = ref([]);
const statusList = ref([]);
const dialogAuditVisible = ref(false);
const auditFormData = ref({});

const onSubmitQuery = () => {
    searchTableList();
}

const onSubmitReset = () => {
    formInline.value = new InlineFormData();
    searchTableList();
}

const handleItemDetail = (row: any) => {
    router.push('/order/detail?orderId=' + row.orderInfo.id);
}

const handleItemAudit = (row: any) => {
    auditFormData.value = JSON.parse(JSON.stringify(row));
    dialogAuditVisible.value = true;
}

const handleAuditConfirm = () => {
    const params = {
        refundId: auditFormData.value.id,
        status: auditFormData.value.status,
        rejectReason: auditFormData.value.rejectReason
    }

    saveRefund(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        if (!res.data.data) {
            errorNotification("系统未知错误，请联系管理员");
            return;
        }

        successNotification(res.data.message);
        dialogAuditVisible.value = false;
        searchTableList();
    })
}

const searchTableList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    searchRefundList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.paginationResponse.totalElements;

        tableListData.value = data.paginationResponse.content;

        refundTypeList.value = data.refundTypeList;
        statusList.value = data.statusList;
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
</style>