<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" inline="true" :model="formInline" label-width="70px">
                <el-form-item label="卡券ID">
                    <el-input v-model="formInline.id" placeholder="请输入卡券ID" clearable />
                </el-form-item>

                <el-form-item label="分组ID">
                    <el-input v-model="formInline.groupId" placeholder="请输入分组ID" clearable />
                </el-form-item>

                <el-form-item label="名称">
                    <el-input v-model="formInline.name" placeholder="请输入卡券名称" clearable />
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="formInline.type" placeholder="卡券类型" clearable>
                        <el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.value" />
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
                    <el-button type="primary" plain @click="onOpenPlusForm" :icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="tableListData" style="width: 100%">
                <el-table-column prop="id" label="卡券ID" />
                <el-table-column prop="url" label="图标">
                    <template #default="scope">
                        <el-image class="table-item-image" :src="scope.row.imageUrl" />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="卡券名称" />
                <el-table-column prop="groupName" label="分组" align="center" />
                <el-table-column prop="typeName" label="类型" align="center" />
                <el-table-column label="有效期" align="center" width="180">
                    <template #default="scope">
                        <div
                            v-if="scope.row.beginTime && scope.row.endTime && scope.row.beginTime !== scope.row.endTime">
                            {{ scope.row.beginTime }}
                            {{ scope.row.endTime }}
                        </div>
                        <div v-else>{{ `领取后${scope.row.expireTime}天` }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="注册时间" width="160" align="center">
                    <template #default="scope">
                        <span>{{ new Date(scope.row.createTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" fixed="right" align="center">
                    <template #default="scope">
                        {{ scope.row.status === 'A' ? '启用' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="200">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleItemDelete(scope.row)">删除
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

    <el-dialog v-model="dialogInfoFormVisible" :title="dialogTitle" width="900px" @closed="onInfoFormClosed">
        <el-form class="info-form" ref="infoFormRef" :model="infoFormData" :rules="infoFormRules" label-width="200px">
            <el-form-item prop="type" label="卡券类型">
                <el-select v-model="infoFormData.type" placeholder="卡券类型">
                    <el-option v-for="item in typeList" :key="item.key" :label="item.name" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item prop="groupId" label="卡券分组">
                <el-select v-model="infoFormData.groupId" placeholder="卡券分组">
                    <el-option v-for="item in couponGroupList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item prop="name" label="卡券名称">
                <el-input v-model="infoFormData.name" placeholder="卡券名称" />
            </el-form-item>

            <el-form-item prop="expireType" label="过期类型" required>
                <el-radio-group v-model="infoFormData.expireType">
                    <el-radio label="固定时间" value="fix" />
                    <el-radio label="领取后过期" value="flex" />
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="infoFormData.expireType === 'fix'" prop="beginTime" label="有效时间">
                <el-config-provider :locale="zhCn">
                    <el-date-picker v-model="infoFormData.beginTime" type="datetime" placeholder="开始时间"
                        value-format="YYYY-MM-DD HH:mm:ss" />
                    &nbsp;至&nbsp;
                    <el-date-picker v-model="infoFormData.endTime" type="datetime" placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss" />
                </el-config-provider>
            </el-form-item>

            <el-form-item v-if="infoFormData.expireType === 'flex'" prop="expireTime" label="有效天数">
                <el-input v-model="infoFormData.expireTime" placeholder="有效天数" style="width: 200px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'P'" prop="inRule" label="预存规则">
                <div>
                    <el-button type="danger" @click="onAddInRule" :icon="Plus">添加</el-button>
                    <div v-for="(item, index) in infoFormData.inRule" style="margin-top: 10px">
                        <el-input v-model="item[0]" placeholder="请输入实际支付金额" style="width: 200px" />
                        <span style="margin: 0 10px">至</span>
                        <el-input v-model="item[1]" placeholder="请输入实际到账金额" style="width: 200px" />
                        <el-button type="danger" @click="onRemoveInRule(index)" circle
                            style="margin-left: 10px;width: 20px;height: 20px">-</el-button>
                    </div>
                </div>
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="amount" label="卡券面额">
                <el-input v-model="infoFormData.amount" placeholder="请输入卡券面额，单位：元" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'T'" prop="outRule" label="计次次数">
                <el-input v-model="infoFormData.outRule" placeholder="请输入计次次数" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type !== 'P'" prop="sendWay" label="发放方式" required>
                <el-radio-group v-model="infoFormData.sendWay">
                    <el-radio label="后台发放" value="backend" />
                    <el-radio label="线下发放" value="offline" />
                    <el-radio label="前台发放" value="front" />
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="total" label="发放总数量">
                <el-input v-model="infoFormData.total" placeholder="请输入发放总数量，单位：套" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="outRule" label="满多少可用">
                <el-input v-model="infoFormData.outRule" placeholder="单位：元，输入0表示无门槛" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="isGive" label="允许转赠好友">
                <el-radio-group v-model="infoFormData.isGive">
                    <el-radio label="不允许" value="0" />
                    <el-radio label="允许" value="1" />
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="isAllGoods" label="适用商品">
                <el-radio-group v-model="infoFormData.isAllGoods">
                    <el-radio label="全场通用" value="0" />
                    <el-radio label="指定商品" value="1" />
                </el-radio-group>
            </el-form-item>

            <el-form-item v-if="infoFormData.isAllGoods === '1' && infoFormData.type === 'C'" prop="goodsIds"
                label="指定商品">
                <el-input v-model="infoFormData.goodsIds" placeholder="商品id以英文逗号分隔，如：1212,2244,5573" type="textarea"
                    rows="5" style="width: 500px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type !== 'P'" prop="limitNum" label="每人最多拥有数量">
                <el-input v-model="infoFormData.limitNum" placeholder="请输入每人最多拥有数量" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type !== 'P'" prop="point" label="领取所需积分">
                <el-input v-model="infoFormData.point" placeholder="输入0或为空则表示不需要积分领取" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type !== 'P'" prop="receiveCode" label="领取码">
                <el-input v-model="infoFormData.receiveCode" placeholder="为空表示不需要领取码" style="width: 300px" />
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="gradeIds" label="会员等级">
                <el-select v-model="infoFormData.gradeIds" multiple placeholder="适用会员等级">
                    <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item v-if="infoFormData.type === 'C'" prop="useFor" label="使用专项" clearable>
                <el-select v-model="infoFormData.useFor" placeholder="请选择使用专项">
                    <el-option v-for="item in couponUseForList" :key="item.value" :label="item.name"
                        :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item prop="storeId" label="适用店铺">
                <el-select v-model="infoFormData.storeId" placeholder="请选择适用店铺">
                    <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item prop="image" label="图标">
                <el-upload class="uploader" type="drag" action="" :show-file-list="false" :http-request="handleUpload">
                    <img v-if="infoFormData.image" :src="infoFormData.imageUrl" class="uploader-image" />
                    <el-icon v-else class="uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <p style="margin-top: 10px;font-size: 12px;font-weight: 200;">（提示：点击图片修改，建议尺寸：300 x 240）</p>
            </el-form-item>

            <el-form-item prop="description" label="描述信息">
                <el-input v-model="infoFormData.description" type="textarea" placeholder="请输入描述" rows="8"
                    style="width: 500px" />
            </el-form-item>

            <el-form-item prop="remarks" label="后台备注">
                <el-input v-model="infoFormData.remarks" type="textarea" placeholder="请输入备注" rows="5"
                    style="width: 500px" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="onInfoFormConfirm">确定</el-button>
            <el-button @click="dialogInfoFormVisible = false">取消</el-button>
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
import { errorNotification, successNotification } from '../../../../utils/notification';
import { deleteCoupon, getCouponList, quickSearchCouponGroupList, saveCoupon } from '../../../../api/coupon';
import { uploadFile } from '../../../../api/file';
import { formatDate } from '../../../../utils/date-utils';

class InfoFormData {
    id: string = ''
    type: string = 'C'
    groupId: number
    name: string
    expireType: string = 'fix'
    expireTime: string
    beginTime: string
    endTime: string
    amount: string
    sendWay: string = 'backend'
    total: string
    outRule: string
    isGive: string = '0'
    isAllGoods: string = '0'
    goodsIds: any
    inRule: any
    description: string
    remarks: string
    image: string = '/static/defaultImage/coupon.png'
    storeId: string
    useFor: string
    gradeIds: any
    receiveCode: string
    point: string
    limitNum: string
}

class InlineFormData {
    id: string
    groupId: string
    name: string
    type: string
    status: string = ''
}

const formInline = ref(new InlineFormData());
const tableListData = ref([]);
const infoFormData = ref(new InfoFormData());
const typeList = ref([]);
const groupList = ref([]);
const gradeList = ref([]);
const couponUseForList = ref([]);
const storeList = ref([]);
const couponGroupList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogInfoFormVisible = ref(false);
const dialogTitle = ref('');
const infoFormRef = ref({});
const infoFormRules = {
    type: [{ required: true, message: '请选择卡券类型', trigger: 'blur' }],
    groupId: [{ required: true, message: '请选择卡券组', trigger: 'blur' }],
    name: [{ required: true, message: '请输入卡券名称', trigger: 'blur' }],
    expireTime: [{ required: true, message: '请输入该项', trigger: 'blur' }],
    beginTime: [{ required: true, message: '请输入开始时间', trigger: 'change' }],
    amount: [{ required: true, message: '请输入卡券面额', trigger: 'blur' }],
    total: [{ required: true, message: '请输入发行总数量', trigger: 'blur' }],
    outRule: [{ required: true, message: '请输入该项', trigger: 'blur' }],
    inRule: [{ required: true, message: '请输入该项', trigger: 'blur' }],
}
const imagePath = ref('');

const onSubmitQuery = () => {
    searchTableList();
}

const onSubmitReset = () => {
    formInline.value = new InlineFormData();
    searchTableList();
}

const onInfoFormClosed = () => {
    infoFormData.value = new InfoFormData();
    dialogInfoFormVisible.value = false;
}

const onOpenPlusForm = () => {
    infoFormData.value.imageUrl = imagePath.value + infoFormData.value.image;
    dialogTitle.value = '新增卡券';
    dialogInfoFormVisible.value = true;
}

const handleItemEdit = (row: any) => {
    infoFormData.value = row;
    infoFormData.value.imageUrl = row.image ? imagePath.value + row.image : '/static/defaultImage/coupon.png';
    dialogTitle.value = '编辑卡券';
    dialogInfoFormVisible.value = true;
}

const handleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.name + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteCoupon(row.id).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            searchTableList();
        })
    })
}

const onInfoFormConfirm = () => {
    infoFormRef.value.validate().then(() => {
        const params = {
            ...infoFormData.value,
            gradeIds: infoFormData.value.gradeIds ? infoFormData.value.gradeIds.join(',') : '',
            inRule: infoFormData.value.inRule.length > 0 ? infoFormData.value.inRule.map((item: any) => item.join('_')).join(',') : '',
        }

        saveCoupon(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            successNotification(res.data.message);
            dialogInfoFormVisible.value = false;
            searchTableList();
        })
    }).catch((err) => {
        console.log(err);
        errorNotification('请填写必填项');
    })
}

const onAddInRule = () => {
    if (infoFormData.value.inRule == null) {
        infoFormData.value.inRule = [];
    }
    infoFormData.value.inRule.push(['', '']);
}

const onRemoveInRule = (index: number) => {
    infoFormData.value.inRule.splice(index, 1);
}

const searchTableList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...formInline.value
    }

    getCouponList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        const data = res.data.data;
        total.value = data.paginationResponse.totalElements;

        typeList.value = data.typeList;
        groupList.value = data.groupList;
        gradeList.value = data.gradeList;
        couponUseForList.value = data.couponUseForList;
        storeList.value = data.storeList;
        storeList.value.unshift({ id: 0, name: '公共店铺' });

        imagePath.value = data.imagePath;

        tableListData.value = data.paginationResponse.content.map((item: any) => {
            item.imageUrl = imagePath.value + item.image;
            item.groupName = groupList.value.filter((group: any) => group.id == item.groupId)[0].name;
            item.typeName = typeList.value.filter((type: any) => type.value == item.type)[0].name;
            item.gradeIds = item.gradeIds.length == 0 ? [] : item.gradeIds.split(',');
            item.gradeIds = item.gradeIds.map((item: any) => gradeList.value.filter((grade: any) => grade.id == item)[0].name);
            item.inRule = item.inRule.length == 0 ? [] : item.inRule.split(',').map((item: any) => item.split('_'));
            item.isGive = item.isGive ? '1' : '0';
            item.isAllGoods = item.goodsIds ? '1' : '0';

            item.beginTime = formatDate(new Date(item.beginTime), 'yyyy-MM-dd HH:mm:ss');
            item.endTime = formatDate(new Date(item.endTime), 'yyyy-MM-dd HH:mm:ss');
            return item;
        });
    })

    if (couponGroupList.value.length == 0) {
        quickSearchCouponGroupList().then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.message);
                return;
            }

            couponGroupList.value = res.data.data.groupList;
        })
    }
}

const handlePaginationChange = () => {
    searchTableList();
}


const handleUpload = (file: any) => {
    const formData = new FormData();
    formData.append('file', file.file);
    uploadFile(formData).then((res: any) => {
        if (res.data.code === 200) {
            infoFormData.value.imageUrl = res.data.data.url;
            infoFormData.value.image = res.data.data.fileName;
        }
    });
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

.info-form {
    .el-input {
        width: 500px;
    }

    .el-select {
        width: 260px;
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


.uploader {
    width: 60px;
    height: 60px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    padding: 0;

    .uploader-image {
        width: 60px;
        height: 60px;
        display: block;
        object-fit: cover;
    }
}

.uploader:hover {
    border-color: var(--el-color-primary);
}

.el-icon.uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    text-align: center;
}
</style>