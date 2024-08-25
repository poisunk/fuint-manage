<template>
    <el-form ref="formRef" :model="modelValue" :rules="rules" label-width="120px" class="banner-form">
        <template v-for="item in formConfigs" :key="item.label">
            <el-form-item :label="item.label" :prop="item.field">
                <template v-if="item.type === 'input'">
                    <el-input v-model="modelValue[item.field]" :placeholder="item.placeholder" />
                </template>

                <template v-if="item.type === 'select'">
                    <el-select v-model="modelValue[item.field]" :placeholder="item.placeholder">
                        <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </template>

                <template v-if="item.type === 'textarea'">
                    <el-input v-model="modelValue[item.field]" type="textarea" :placeholder="item.placeholder"
                        style="width: 500px;" />
                </template>

                <template v-if="item.type === 'upload'">
                    <el-upload class="uploader" action="" :show-file-list="false" :http-request="handleUpload(item)">
                        <img v-if="modelValue[item.field]" :src="item.imageUrl" class="uploader-image" />
                        <el-icon v-else class="uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <p style="margin-top: 10px;font-size: 12px;font-weight: 200;">{{ item.placeholder }}</p>
                </template>

                <template v-if="item.type === 'radio'">
                    <el-radio-group v-model="modelValue[item.field]">
                        <el-radio v-for="option in item.options" :key="option.value" :label="option.value">
                            {{ option.label }}
                        </el-radio>
                    </el-radio-group>
                </template>
            </el-form-item>
        </template>
    </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormItem } from './form-type';
import { uploadFile } from '../../api/file';

const props = defineProps({
    title: String,
    formConfigs: Array<FormItem>,
    formRef: Object,
    modelValue: Object
});

const rules = ref({});

for (const item of props.formConfigs) {
    if (!item.required) {
        continue;
    }
    const rule = [{
        required: item.required,
        message: item.label + '不能为空',
        trigger: 'blur'
    }];
    Object.assign(rules.value, { [item.field]: rule });
}

const formRef = ref();

const handleUpload = (item: FormItem) => {
    return (file: any) => {
        const formData = new FormData();
        formData.append('file', file.file);
        uploadFile(formData).then((res: any) => {
            if (res.data.code === 200) {
                item.imageUrl = res.data.data.url;
                props.modelValue[item.field] = res.data.data.fileName;
            }
        });
    };
};

defineExpose({
    formRef
})
</script>

<style lang="less" scoped>
.el-input {
    width: 500px;
}

.el-select {
    width: 240px;
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