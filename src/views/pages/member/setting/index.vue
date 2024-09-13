<template>
    <div class="panel">
        <el-form :model="formData" :rules="formRules" label-width="200px">
            <el-form-item prop="getCouponNeedPhone" label="领券是否需要手机号">
                <el-radio-group v-model="formData.getCouponNeedPhone">
                    <el-radio label="否" value="false" />
                    <el-radio label="是" value="true" />
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="loginNeedPhone" label="登录是否需要手机号">
                <el-radio-group v-model="formData.loginNeedPhone">
                    <el-radio label="否" value="false" />
                    <el-radio label="是" value="true" />
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="openWxCard" label="是否开通微信会员卡">
                <el-radio-group v-model="formData.openWxCard">
                    <el-radio label="否" value="false" />
                    <el-radio label="是" value="true" />
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="submitOrderNeedPhone" label="提交订单是否需要手机号">
                <el-radio-group v-model="formData.submitOrderNeedPhone">
                    <el-radio label="否" value="false" />
                    <el-radio label="是" value="true" />
                </el-radio-group>
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
import { getMemberSetting, saveMemberSetting } from '../../../../api/member';

class FormData {
    getCouponNeedPhone: string
    loginNeedPhone: string
    openWxCard: string
    submitOrderNeedPhone: string
}

const formData = ref(new FormData());

const formRules = ref({
    getCouponNeedPhone: { required: true, message: '请选择该项', trigger: 'blur' },
    loginNeedPhone: { required: true, message: '请选择该项', trigger: 'blur' },
    openWxCard: { required: true, message: '请选择该项', trigger: 'blur' },
    submitOrderNeedPhone: { required: true, message: '请选择该项', trigger: 'blur' },
});

const onSubmit = () => {
    saveMemberSetting(formData.value).then((res: any) => {
        if (res.data.code !== 200) {
            errorNotification(res.data.message);
            return;
        }

        successNotification(res.data.message);
    })
}

onMounted(() => {
    getMemberSetting().then((res: any) => {
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