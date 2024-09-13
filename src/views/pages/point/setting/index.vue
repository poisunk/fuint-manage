<template>
    <div class="panel">
        <el-form :model="formData" :rules="formRules" label-width="200px">
            <el-form-item prop="pointNeedConsume" label="返1积分所需消费金额">
                <el-input v-model="formData.pointNeedConsume" placeholder="请输入返1积分所需消费金额" />
            </el-form-item>

            <el-form-item prop="canUsedAsMoney" label="积分是否可当作现金使用">
                <el-radio-group v-model="formData.canUsedAsMoney">
                    <el-radio label="是" value="true" />
                    <el-radio label="否" value="false" />
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="exchangeNeedPoint" label="多少积分可抵扣1元现金">
                <el-input v-model="formData.exchangeNeedPoint" placeholder="请输入多少积分可抵扣1元现金" />
            </el-form-item>

            <el-form-item prop="rechargePointSpeed" label="充值返积分倍数">
                <el-input v-model="formData.rechargePointSpeed" placeholder="请输入充值返积分倍数" />
            </el-form-item>
        </el-form>

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
import { getPointSetting, savePointSetting } from '../../../../api/point';

class FormData {
    pointNeedConsume: string
    canUsedAsMoney: string
    exchangeNeedPoint: string
    rechargePointSpeed: string
}

const formData = ref(new FormData());

const formRules = ref({
    pointNeedConsume: { required: true, message: '请填写该项', trigger: 'blur' },
    canUsedAsMoney: { required: true, message: '请填写该项', trigger: 'blur' },
    rechargePointSpeed: { required: true, message: '请填写该项', trigger: 'blur' },
    exchangeNeedPoint: { required: true, message: '请填写该项', trigger: 'blur' },
});

const onSubmit = () => {
    savePointSetting(formData.value).then((res: any) => {
        if (res.data.code !== 200) {
            errorNotification(res.data.message);
            return;
        }

        successNotification(res.data.message);
    })
}

onMounted(() => {
    getPointSetting().then((res: any) => {
        formData.value = res.data.data;
    })
})
</script>

<style lang="less" scoped>
.panel {
    margin: 20px;
    border: 1px solid #e2e1e1;

    .el-form {
        margin-top: 30px;
        margin-left: 50px;
    }

    .el-input {
        width: 400px;
    }

    .input-tip {
        font-size: 12px;
        color: #999;
    }

    .footer {
        margin-top: 30px;
        margin-bottom: 5px;
        margin-left: 250px;
    }
}
</style>