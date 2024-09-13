<template>
    <div class="panel">
        <el-form :model="formData" :rules="formRules" label-width="150px">
            <el-form-item prop="isClose" label="关闭系统交易功能">
                <el-radio-group v-model="formData.isClose">
                    <el-radio label="否" value="false" />
                    <el-radio label="是" value="true" />
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="deliveryFee" label="配送费">
                <div>
                    <el-input v-model="formData.deliveryFee" placeholder="请输入配送费" />
                    <div class="input-tip">单位：元</div>
                </div>
            </el-form-item>

            <el-form-item prop="deliveryMinAmount" label="起送金额">
                <div>
                    <el-input v-model="formData.deliveryMinAmount" placeholder="请输入起送金额" />
                    <div class="input-tip">单位：元</div>
                </div>
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
import { getOrderSetting, saveOrderSetting } from '../../../../api/order';
import { errorNotification, successNotification } from '../../../../utils/notification';

class FormData {
    deliveryFee: string
    deliveryMinAmount: string
    isClose: boolean
}

const formData = ref(new FormData());

const formRules = ref({
    isClose: { required: true, message: '请选择是否关闭系统交易功能', trigger: 'blur' },
    deliveryFee: { required: true, message: '请输入配送费', trigger: 'blur' },
    deliveryMinAmount: { required: true, message: '请输入起送金额', trigger: 'blur' },
});

const onSubmit = () => {
    saveOrderSetting(formData.value).then((res: any) => {
        if (res.data.code !== 200) {
            errorNotification(res.data.message);
            return;
        }

        successNotification(res.data.message);
    })
}

onMounted(() => {
    getOrderSetting().then((res: any) => {
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
        margin-left: 200px;
    }
}
</style>