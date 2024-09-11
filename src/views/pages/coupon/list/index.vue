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

                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        {{ scope.row.status === 'A' ? '启用' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="260">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Plus"
                            @click="handleItemSendCoupon(scope.row)">发券</el-button>
                        <el-button link type="primary" size="small" :icon="CopyDocument"
                            @click="handleItemShowQrcode(scope.row)">二维码</el-button>
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleItemDelete(scope.row)">删除</el-button>
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


    <el-dialog v-model="dialogSendCouponFormVisible" title="发放卡券" @closed="onSendCouponFormClosed">
        <el-form ref="sendCouponFormRef" :model="sendCouponFormData" :rules="sendCouponFormRules" label-width="120px">
            <el-form-item prop="name" label="卡券名称">
                <el-input v-model="sendCouponFormData.name" placeholder="请输入卡券名称" style="width: 300px" disabled />
            </el-form-item>

            <el-form-item prop="object" label="发放对象">
                <div style="vertical-align: middle;">
                    <el-radio-group v-model="sendCouponFormData.object">
                        <el-radio label="部分用户" value="part" />
                        <el-radio label="全部用户" value="all" />

                        <el-button v-if="sendCouponFormData.object === 'part'" type="primary"
                            @click="onSelectMember">选择会员（已选择{{ selectMemberIds.length > 0 ?
                                selectMemberIds.split(',').length : 0 }}人）</el-button>
                        <el-button v-if="sendCouponFormData.object === 'all'" type="danger">总会员数：{{
                            totalMember }}</el-button>
                    </el-radio-group>
                </div>
            </el-form-item>

            <el-form-item prop="num" label="发放数量">
                <el-input v-model="sendCouponFormData.num" placeholder="请输入发放数量" style="width: 500px" />
            </el-form-item>

            <el-form-item prop="remark" label="备注">
                <el-input v-model="sendCouponFormData.remark" type="textarea" placeholder="请输入备注" rows="5"
                    style="width: 500px" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button type="primary" @click="onSendCouponFormConfirm">确定</el-button>
            <el-button @click="dialogSendCouponFormVisible = false">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogSelectMemberVisible" title="选择会员" width="1020px" @closed="onSelectMemberDialogClosed">
        <div class="select-member-content">
            <div class="group-list">
                <div class="search">
                    <el-input v-model="selectMemberGroupKeyword" placeholder="请输入会员号，手机号" />
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </div>
                <el-tree :data="memberGroupList" :props="defaultTreeProps" show-checkbox :render-after-expand="false"
                    @check-change="handleMemberSelectCheckChange" />
            </div>

            <div class="member-list">
                <el-alert class="tips" :title="`共${selectMemberTableData.length}名会员，已选择${selectedMemberList.length}名会员`"
                    type="error" :closable="false" />
                <el-table :data="selectMemberTableData" style="width: 100%"
                    @selection-change="handleSelectMemberTableChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="userNo" label="会员号" />
                    <el-table-column prop="name" label="名称" />
                    <el-table-column prop="mobile" label="手机号">
                        <template #default="scope">
                            {{ scope.row.mobile ? scope.row.mobile : '-' }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <template #footer>
            <el-button type="primary" @click="onSelectMemberTableConfirm">确定</el-button>
            <el-button @click="dialogSelectMemberVisible = false">取消</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogQrcodeVisible" title="查看二维码" width="500px">
        <div v-loading="qrcodeLoading" class="dialog-qr">
            <div class="qr-detail">
                <div class="qr-title">小程序：</div>
                <el-image class="qr-code" :src="qrCodeData.minAppQrCode" />
            </div>
            <div class="qr-detail">
                <div class="qr-title">H5：</div>
                <el-image class="qr-code" :src="qrCodeData.h5QrCode" />
            </div>
        </div>

        <template #footer>
            <el-button type="primary" @click="dialogQrcodeVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete, CopyDocument } from '@element-plus/icons-vue';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { deleteCoupon, getCouponList, quickSearchCouponGroupList, saveCoupon, sendCounpon } from '../../../../api/coupon';
import { uploadFile } from '../../../../api/file';
import { formatDate } from '../../../../utils/date-utils';
import { getMemberGroupList, getTotalMember, searchMemberList } from '../../../../api/member';
import { Tree } from 'element-plus/es/components/tree-v2/src/types';
import { debounce } from '../../../../store/instruction';
import { createQrcode } from '../../../../api/common';

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

class SendCouponFormData {
    couponId: string
    userIds: string
    mobile: string
    num: number
    remark: string
    object: string = 'part'
    name: string
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
const dialogSendCouponFormVisible = ref(false);
const dialogSelectMemberVisible = ref(false);
const dialogQrcodeVisible = ref(false);
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
const sendCouponFormData = ref(new SendCouponFormData());
const sendCouponFormRef = ref({});
const sendCouponFormRules = {
    num: [{ required: true, message: '请输入发放数量', trigger: 'blur' }],
}
const totalMember = ref(0);
const defaultTreeProps = {
    children: 'children',
    label: 'name',
    value: 'id',
}
const memberGroupList = ref([]);
const selectMemberGroupKeyword = ref([]);
const selectMemberGroupIds = ref('');
const selectMemberTableData = ref([]);
const selectedMemberList = ref([]);
const selectMemberIds = ref('');
const qrCodeData = ref({
    h5QrCode: '',
    minAppQrCode: '',
})
const qrcodeLoading = ref(false);

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

const handleItemSendCoupon = (row: any) => {
    sendCouponFormData.value.couponId = row.id;
    sendCouponFormData.value.name = row.name;
    dialogSendCouponFormVisible.value = true;
}

const onSendCouponFormClosed = () => {
    sendCouponFormData.value = new SendCouponFormData();
    selectMemberIds.value = '';
    dialogSendCouponFormVisible.value = false;
}

const onSelectMember = () => {
    dialogSelectMemberVisible.value = true;

    getMemberGroupList().then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        memberGroupList.value = res.data.data;
    })
}

const onSelectMemberDialogClosed = () => {
    selectMemberTableData.value = [];
}

const onSelectMemberTableConfirm = () => {
    selectMemberIds.value = selectMemberTableData.value.map((item: any) => {
        return item.id
    }).join(',');
    dialogSelectMemberVisible.value = false;
}

const handleItemShowQrcode = (row: any) => {
    dialogQrcodeVisible.value = true;
    qrcodeLoading.value = true;

    const parms = {
        id: row.id,
        type: 'coupon'
    }

    createQrcode(parms).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        qrCodeData.value = res.data.data;
        qrcodeLoading.value = false;
    })
}

const handleMemberSelectCheckChange = (data: any, checked: boolean, immediate: boolean) => {
    console.log(data, checked, immediate);
    if (data.children.length > 0) {
        return;
    }
    if (checked) {
        selectMemberGroupIds.value += data.id + ',';
    } else {
        selectMemberGroupIds.value = selectMemberGroupIds.value.replace(
            data.id + ',',
            ''
        );
    }
    updateSelectMemberTable();
}

const updateSelectMemberTable = debounce(() => {
    if (selectMemberGroupIds.value.length == 0) {
        selectMemberTableData.value = [];
        return;
    }

    const params = {
        keyword: selectMemberGroupKeyword.value,
        groupIds: selectMemberGroupIds.value.slice(0, -1),
    }

    searchMemberList(params).then((res) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        selectMemberTableData.value = res.data.data;
    })
}, 500);

const handleSelectMemberTableChange = (val: any) => {
    selectedMemberList.value = val;
}

const onSendCouponFormConfirm = () => {
    sendCouponFormRef.value.validate().then(() => {
        ElMessageBox.confirm('您确认要发放卡券吗？', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            const params = {
                couponId: sendCouponFormData.value.couponId,
                userIds: sendCouponFormData.value.userIds,
                mobile: sendCouponFormData.value.mobile,
                num: sendCouponFormData.value.num,
                object: sendCouponFormData.value.object,
            }

            sendCounpon(params).then((res) => {
                if (res.data.code != 200) {
                    errorNotification(res.data.message);
                    return;
                }

                successNotification(res.data.message);
                dialogSendCouponFormVisible.value = false;
            })
        })
    }).catch(() => {
        errorNotification('请检查表单内容是否有误');
    })
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
        console.log(infoFormData.value);

        let params = {
            ...infoFormData.value,
            gradeIds: infoFormData.value.gradeIds ? infoFormData.value.gradeIds.join(',') : '',
        }

        if (infoFormData.value.inRule && infoFormData.value.inRule.length > 0) {
            params.inRule = infoFormData.value.inRule.map((item: any) => item.join('_')).join(',');
        } else {
            params.inRule = '';
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
            item.gradeIds = item.gradeIds.length == 0 ? [] : item.gradeIds.split(',').map((id: any) => Number(id));
            item.inRule = item.inRule.length == 0 ? [] : item.inRule.split(',').map((item: any) => item.split('_'));
            item.isGive = item.isGive ? '1' : '0';
            item.isAllGoods = item.goodsIds ? '1' : '0';

            item.beginTime = formatDate(new Date(item.beginTime), 'yyyy-MM-dd HH:mm:ss');
            item.endTime = formatDate(new Date(item.endTime), 'yyyy-MM-dd HH:mm:ss');
            return item;
        });

        console.log(gradeList.value);
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

    getTotalMember().then((res) => {
        if (res.data.code != 200) {
            return;
        }
        totalMember.value = res.data.data.totalMember;
    })
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

.select-member-content {
    height: 400px;
    margin: 10px;

    .group-list {
        width: 300px;
        height: 400px;
        border: 1px solid #ccc;
        padding: 10px;
        overflow-y: scroll;
        float: left;

        .search {
            margin: 0;

            .el-input {
                width: 190px;
                height: 36px;
            }

            .el-button {
                padding: 10px 20px;
                margin-left: 2px;
                font-size: 14px;
            }
        }

        .el-tree {
            margin-top: 10px;
        }
    }

    .member-list {
        width: 600px;
        height: 400px;
        border: 1px solid #ccc;
        padding: 10px;
        margin-left: 20px;
        float: left;

        .tips {
            font-size: 14px;
            top: 25px;
            position: absolute;
            width: 400px;
            height: 37px;
        }
    }
}

.dialog-qr {
    margin: 10px;

    .qr-detail {
        margin-bottom: 10px;
        text-align: center;

        .qr-title {
            font-weight: bold;
            font-size: 16px;
            padding-right: 100px;
        }

        .qr-code {
            width: 200px;
            height: 200px;
            border: 1px solid #ccc;
        }
    }
}
</style>