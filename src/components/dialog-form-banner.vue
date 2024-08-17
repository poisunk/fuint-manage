<template>
    <el-dialog v-model="dialogFormVisible" :title="title" width="700px" @close="handleCancel">
        <el-form ref="bannerFormRef" :model="bannerForm" :rules="rules" label-width="120px" class="banner-form">
            <el-form-item label="标题" prop="title">
                <el-input v-model="bannerForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="所属店铺" prop="storeId">
                <el-select v-model="bannerForm.storeId" placeholder="所属店铺">
                    <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="链接" prop="url">
                <el-input v-model="bannerForm.url" placeholder="请输入链接" />
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="handleUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <p style="margin-top: 10px;font-size: 12px;font-weight: 200;">（提示：点击图片修改，建议尺寸：640 x
                    350）
                </p>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="bannerForm.sort" placeholder="请输入排序，数字越小越靠前" />
            </el-form-item>
            <el-form-item label="备注信息" prop="description">
                <el-input v-model="bannerForm.description" placeholder="请输入备注信息" type="textarea"
                    style="width: 500px;" />
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="bannerForm.status">
                    <el-radio label="A">启用</el-radio>
                    <el-radio label="N">禁用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item style="float: right">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile } from '../api/file';
import { successNotification, errorNotification } from '../util/notification';
import { saveBanner } from '../api/content';

const props = defineProps({
    title: String
});
const emit = defineEmits(['confirm', 'cancel']);

const bannerForm = ref({
    title: '',
    storeId: null,
    url: '',
    sort: null,
    description: '',
    image: '',
    status: 'A',
});
const imageUrl = ref('');
const bannerFormRef = ref();

const rules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    image: [
        { required: true, message: '请上传图片', trigger: 'blur' }
    ]
};

const handleUpload = (file: any) => {
    var file = file.file;
    const formData = new FormData();
    formData.append('file', file);
    uploadFile(formData).then((res) => {
        imageUrl.value = res.data.data.url;
        bannerForm.value.image = res.data.data.fileName;
    })
}

const handleConfirm = () => {
    bannerFormRef.value.validate((valid: any) => {
        if (!valid) {
            errorNotification('请填写必填项');
            return;
        }

        bannerForm.storeId = bannerForm.storeId === '' ? null : bannerForm.storeId;
        bannerForm.sort = bannerForm.sort === '' ? null : bannerForm.sort;
        saveBanner(bannerForm.value).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                emit('confirm');
                clearForm();
            } else {
                errorNotification(res.data.message);
            }
        })
    })
};


const handleCancel = () => {
    emit('cancel');
    clearForm();
}

const clearForm = () => {
    imageUrl.value = '';
    bannerForm.value = {
        title: '',
        storeId: null,
        url: '',
        sort: null,
        description: '',
        image: '',
        status: 'A',
    }
}

const setForm = (data: any) => {
    imageUrl.value = data.imageUrl;
    bannerForm.value = data;
}

defineExpose({
    clearForm,
    setForm
})
</script>

<style lang="less" scoped>
.banner-form {
    padding-bottom: 30px;


    .el-input {
        width: 500px;
    }

    .el-select {
        width: 240px;
    }
}


.avatar-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    .avatar {
        width: 60px;
        height: 60px;
        display: block;
    }
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 50px;
    text-align: center;
}
</style>
