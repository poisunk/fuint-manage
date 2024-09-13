<template>
    <div class="panel">
        <div class="main-panel">
            <div class="title">充值规则设置</div>

            <div class="recharge-item-container">
                <div v-for="item in formData.rechargeItem" class="recharge-item">
                    <el-input v-model="item.rechargeAmount" size="medium" placeholder="充值金额，单位：元" />
                    <span class="recharge-tips">赠送</span>
                    <el-input v-model="item.giveAmount" size="medium" placeholder="赠送金额，单位：元" />

                    <el-button link @click="deleteRechargeItem(item)" size="medium" type="danger" :icon="Delete" />
                </div>
            </div>

            <div>
                <el-icon @click="addRechargeItem" class="add-item" size="20">
                    <Plus />
                </el-icon>
            </div>

            <el-input v-model="formData.remark" placeholder="请输入充值说明" type="textarea" rows="4" clearable
                style="width: 400px" />

            <el-form label-width="70px" style="margin-top: 20px;">
                <el-form-item label="开启状态">
                    <el-radio-group v-model="formData.status">
                        <el-radio label="启用" value="A" />
                        <el-radio label="禁用" value="N" />
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>

        <div class="footer">
            <el-button @click="onSubmit" size="large" type="primary">保存</el-button>
            <el-button size="large">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { errorNotification, successNotification } from '../../../../utils/notification';
import { getBalanceSetting, saveBalanceSetting } from '../../../../api/balance';
import { Plus, Delete } from '@element-plus/icons-vue';

class FormData {
    rechargeItem: any[]
    remark: string
    status: string = ''
}

const formData = ref(new FormData());

const addRechargeItem = () => {
    formData.value.rechargeItem.push({
        rechargeAmount: '',
        giveAmount: ''
    })
}

const deleteRechargeItem = (item: any) => {
    formData.value.rechargeItem = formData.value.rechargeItem.filter((i: any) => i !== item);
}

const onSubmit = () => {
    saveBalanceSetting(formData.value).then((res: any) => {
        if (res.data.code !== 200) {
            errorNotification(res.data.message);
            return;
        }

        successNotification(res.data.message);
    })
}

onMounted(() => {
    getBalanceSetting().then((res: any) => {
        formData.value.rechargeItem = res.data.data.rechargeRuleList;
        formData.value.remark = res.data.data.remark
        formData.value.status = res.data.data.status
    })
})
</script>

<style lang="less" scoped>
.panel {
    margin: 20px;
    border: 1px solid #e2e1e1;

    .main-panel {
        margin-top: 10px;
        margin-left: 200px;
        padding: 10px 0;

        .title {
            font-size: 18px;
        }

        .status-container {
            align-items: center;
            vertical-align: middle;
        }

        .label {
            font-weight: 700;
            color: #606266;
            margin-right: 10px;
            margin-left: 10px;
            font-size: 15px;
        }
    }

    .footer {
        margin-top: 10px;
        margin-bottom: 20px;
        margin-left: 200px;
    }
}


.add-item {
    width: 30px;
    height: 30px;
    cursor: pointer;
    color: white;
    background-color: #409eff;
    border-radius: 50%;
    margin: 20px 0;
}

.add-item:hover {
    background-color: #66b1ff;
}

.recharge-item-container {

    .recharge-item {
        display: flex;
        line-height: 36px;
        margin-top: 20px;

        .recharge-tips {
            width: 50px;
            line-height: 36px;
            background-color: #409eff;
            color: white;
            border-radius: 2px;
            text-align: center;
            font-size: 14px;
            display: block;
            margin: 0 10px;
        }

        .el-input {
            width: 200px;
            line-height: 36px;
        }

        .el-button {
            margin-left: 15px;
        }
    }
}
</style>