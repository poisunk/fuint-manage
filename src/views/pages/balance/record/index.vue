<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="会员ID">
                    <el-input v-model="formInline.userId" placeholder="请输入会员ID" clearable />
                </el-form-item>

                <el-form-item label="会员号">
                    <el-input v-model="formInline.userNo" placeholder="请输入会员号" clearable />
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model="formInline.mobile" placeholder="请输入手机号" clearable />
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
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="tableListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="userInfo.id" label="会员ID" />
                <el-table-column prop="userInfo.userNo" label="会员号" align="center" />
                <el-table-column prop="userInfo.mobile" label="手机号" align="center">
                    <template #default="scope">
                        <span>{{ scope.row.userInfo.mobile ? scope.row.userInfo.mobile : '-' }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="userInfo.name" label="会员名称" align="center" />
                <el-table-column prop="amount" label="变动数量" align="center">
                    <template #default="scope">
                        <span :style="{ color: scope.row.amount > 0 ? 'green' : 'red' }">{{ scope.row.amount > 0 ? '+'
                            + scope.row.amount : scope.row.amount }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="description" label="备注" align="center">
                    <template #default="scope">
                        <span>{{ scope.row.description ? scope.row.description : '无' }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="updateTime" label="时间" align="center" width="160">
                    <template #default="scope">
                        <span>{{ new Date(scope.row.updateTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="operator" label="操作人" align="center">
                    <template #default="scope">
                        <span>{{ scope.row.operator ? scope.row.operator : '-' }}</span>
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
import { errorNotification, successNotification } from '../../../../utils/notification';
import { searchBalanceList } from '../../../../api/balance';

class InlineFormData {
    userId: string
    userNo: string
    mobile: string
    status: string
}

const formInline = ref(new InlineFormData());
const tableListData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const onSubmitQuery = () => {
    searchTableList();
}

const onSubmitReset = () => {
    formInline.value = new InlineFormData();
    searchTableList();
}

const searchTableList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    searchBalanceList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.paginationResponse.totalElements;

        tableListData.value = data.paginationResponse.content;
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
        width: 220px;
    }

    .el-select {
        width: 220px;
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