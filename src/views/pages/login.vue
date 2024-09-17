<script setup lang="ts">
import { ref } from 'vue';
import { getCode } from "../../api/login.ts";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { useUserStore } from '../../store/user.ts';
import router, { initRouters } from '../../router/index.ts';
import { errorNotification, successNotification } from '../../utils/notification.ts';

const userStore = useUserStore();
const loginFormRef = ref();

const identifyingImage = ref("");
const rememberAccount = ref(false);
const loginParams = ref({
    captchaCode: "",
    password: "",
    username: "",
    uuid: "",
});

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    captchaCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
}

const updateIdentifyingCode = () => {
    getCode().then((res) => {
        var data = res.data;
        if (data.code == 200) {
            identifyingImage.value = data.data.captcha;
            loginParams.value.uuid = data.data.uuid;
        }
    });
}

const login = () => {
    loginFormRef.value.validate((valid: any) => {
        if (!valid) {
            errorNotification('请填写必填项');
            return;
        }

        userStore.login(loginParams.value).then((res: any) => {
            if (res.code == 200) {
                successNotification(res.message);
                userStore.getInfo().then(async () => {
                    await initRouters();
                    router.push('/dashboard');
                })
            }
        }).catch((err: any) => {
            errorNotification(err.message);
        })
    });
}

updateIdentifyingCode();

</script>

<template>
    <el-container>
        <el-main class="background">
            <div class="login-dashboard">
                <el-row class="dashboard-title">
                    <h1>营销管理系统</h1>
                </el-row>
                <el-row>
                    <el-form ref="loginFormRef" :model="loginParams" :rules="rules" @submit.native.prevent>
                        <el-form-item prop="username">
                            <el-input placeholder="账号" v-model="loginParams.username"
                                :prefix-icon="UserFilled"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input placeholder="密码" type="password" v-model="loginParams.password"
                                :prefix-icon="Lock" show-password=true></el-input>
                        </el-form-item>
                        <el-form-item prop="captchaCode">
                            <el-input placeholder="请输入验证码" v-model="loginParams.captchaCode"
                                class="code-input"></el-input>
                            <img class="code-image" :src="identifyingImage" @click="updateIdentifyingCode" />
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="rememberAccount">记住密码</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" native-type="submit" id="login-btn"
                                @click="login">立即登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
        </el-main>
    </el-container>
</template>

<style lang="less" scoped>
.background {
    background-image: url("../../assets/img/background.png");
    align-items: center;
    justify-content: center;
    display: flex;
    height: 100vh;
}

.login-dashboard {
    background-color: white;
    width: 300px;

    padding: 20px;
    border-radius: 5%;
}

.dashboard-title {
    margin-bottom: 10px;
}

.el-form-item {
    width: 300px;
}

.el-input {
    height: 50px;
}

.code-input {
    width: 50%;
}

.code-image {
    width: 30%;
    height: 100%;
    border: 1px solid black;
    margin-left: 58px;
    cursor: pointer;
}


#login-btn {
    width: 100%;
    height: 50px;
}
</style>
