<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="店铺名称">
                    <el-input v-model="formInline.name" placeholder="请输入店铺名称" clearable />
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
                    <el-button type="primary" plain @click="onOpenAddStoreForm" :icon="Plus">新增店铺</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="storeListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="name" label="店铺名称" />
                <el-table-column prop="merchantName" label="所属商户" />
                <el-table-column prop="isDefault" label="默认店铺" align="center">
                    <template #default="scope">
                        <el-switch v-model="scope.row.isDefault" active-value="Y" inactive-value="N" disabled />
                    </template>
                </el-table-column>
                <el-table-column prop="contact" label="联系人" />
                <el-table-column prop="phone" label="手机号" />
                <el-table-column prop="address" label="地址" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="状态" align="center" width="80">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleStoreStatusChange(scope.row, scope.row.status)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleStoreItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleStoreStatusChange(scope.row, 'D')">删除
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

    <el-dialog v-model="dialogStoreInfoFormVisible" :title="dialogTitle" width="700px" @opened="onStoreInfoFormOpened"
        @closed="onStoreInfoFormClosed">
        <v-custom-form ref="storeInfoFormRef" v-model="storeInfoData" :formConfigs="formConfigs" />
        <template #footer>
            <el-button type="primary" @click="onStoreInfoFormConfirm">确定</el-button>
            <el-button @click="dialogStoreInfoFormVisible = false">取消</el-button>
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
import { getStoreList, saveStore, updateStoreStatus } from '../../../../api/store';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { formConfigs } from './store-form-config';
import { rejects } from 'assert';

const formInline = ref({
    name: '',
    status: '',
});
const emptyStoreInfoData = {
    id: '',
    name: '',
    logo: '',
    isDefault: 'N',
    merchantId: '',
    contact: '',
    phone: '',
    address: '',
    hours: '',
    longitude: '',
    latitude: '',
    license: '',
    creditCode: '',
    bankName: '',
    bankCardName: '',
    bankCardNo: '',
    wxMchId: '',
    wxApiV2: '',
    wxCertPath: '',
    alipayAppId: '',
    alipayPrivateKey: '',
    alipayPublicKey: '',
    description: '',
    status: 'A',
}
const storeInfoData = ref(JSON.parse(JSON.stringify(emptyStoreInfoData)));
const storeListData = ref([]);
const merchantList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogStoreInfoFormVisible = ref(false);
const dialogTitle = ref('');
const storeInfoFormRef = ref({});
const imagePath = ref('');

const onSubmitQuery = () => {
    searchStoreList();
}

const onSubmitReset = () => {
    formInline.value = {
        name: '',
        status: '',
    }
    searchStoreList();
}

const onStoreInfoFormOpened = () => {

}

const onStoreInfoFormClosed = () => {
    storeInfoData.value = JSON.parse(JSON.stringify(emptyStoreInfoData));
    dialogStoreInfoFormVisible.value = false;
}

const onOpenAddStoreForm = () => {
    dialogTitle.value = '添加店铺';
    dialogStoreInfoFormVisible.value = true;
}

const handleStoreItemEdit = (row: any) => {
    storeInfoData.value = row;
    dialogTitle.value = '编辑店铺';
    dialogStoreInfoFormVisible.value = true;

    setFormFieldValue('wxCertPath', 'fileList', row.wxCertPath ? [{
        name: row.wxCertPath,
        url: imagePath.value + row.wxCertPath
    }] : []);
    setFormFieldValue('logo', 'imageUrl', row.logo ? imagePath.value + row.logo : '');
    setFormFieldValue('license', 'imageUrl', row.license ? imagePath.value + row.license : '');
}

const handleStoreStatusChange = (row: any, status: string = '') => {
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
            storeId: row.id,
            status: status
        }
        updateStoreStatus(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                if (status == 'D') {
                    return;
                }
                row.status = row.status == 'A' ? 'N' : 'A';
                return;
            }

            successNotification(res.data.message);
            searchStoreList();
        })
    }).catch(() => {
        if (status == 'D') {
            return;
        }
        row.status = row.status == 'A' ? 'N' : 'A';
    });
}

const onStoreInfoFormConfirm = () => {
    storeInfoFormRef.value.formRef.validate().then(() => {
        let params = {
            ...storeInfoData.value
        }

        saveStore(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            dialogStoreInfoFormVisible.value = false;
            searchStoreList();
        })
    }).catch(() => {
        errorNotification('请填写必填项');
    })
}

const searchStoreList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    getStoreList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }
        const data = res.data.data;
        storeListData.value = data.paginationResponse.content;
        total.value = data.paginationResponse.totalElements;

        imagePath.value = data.imagePath;

        merchantList.value = data.merchantList.map((item: any) => {
            return {
                ...item,
                value: item.id,
                label: item.name
            }
        });
        setFormFieldValue('merchantId', 'options', merchantList.value);

        storeListData.value.forEach((item: any) => {
            item.createTime = new Date(item.createTime).toLocaleString();
            for (var i = 0; i < merchantList.value.length; i++) {
                if (item.merchantId == merchantList.value[i].id) {
                    item.merchantName = merchantList.value[i].name;
                }
            }

            item.merchantName = item.merchantName ? item.merchantName : '--';
        })
    })
}

const handlePaginationChange = () => {
    searchStoreList();
}


const setFormFieldValue = (fieldName: string, valueName: string, value: any) => {
    for (const item of formConfigs) {
        if (item.field == fieldName) {
            item[valueName] = value;
        }
    }
}

onMounted(() => {
    searchStoreList();
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