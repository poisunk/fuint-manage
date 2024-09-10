<template>
    <el-form ref="formRef" :model="modelValue" :rules="rules" label-width="120px" class="banner-form">
        <template v-for="item in formConfigs" :key="item.label">
            <el-form-item :label="item.label" :prop="item.field">
                <template v-if="item.type === 'input'">
                    <el-input v-model="modelValue[item.field]" :placeholder="item.placeholder"
                        :disabled="item.isDisabled" />
                </template>

                <template v-if="item.type === 'select'">
                    <el-select v-model="modelValue[item.field]" :placeholder="item.placeholder">
                        <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </template>

                <template v-if="item.type === 'textarea'">
                    <el-input v-model="modelValue[item.field]" type="textarea" :placeholder="item.placeholder" rows="3"
                        style="width: 500px;" />
                </template>


                <template v-if="item.type === 'upload'" #label>
                    <label>{{ item.label }}</label>
                </template>

                <template v-if="item.type === 'upload'">
                    <el-upload class="uploader" type="drag" action="" :show-file-list="false"
                        :http-request="handleUpload(item)">
                        <img v-if="modelValue[item.field]" :src="item.imageUrl" class="uploader-image" />
                        <el-icon v-else class="uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <p style="margin-top: 10px;font-size: 12px;font-weight: 200;">{{ item.placeholder }}</p>
                </template>

                <template v-if="item.type === 'radio'">
                    <el-radio-group v-model="modelValue[item.field]">
                        <el-radio v-for="option in item.options" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-radio-group>
                </template>

                <template v-if="item.type === 'input-number'">
                    <div>
                        <el-input-number v-model="modelValue[item.field]" />
                        <div class="input-tips">{{ item.placeholder }}</div>
                    </div>
                </template>

                <template v-if="item.type === 'upload-file'">
                    <el-upload v-model:file-list="item.fileList" :limit="1" :http-request="handleFileUpload(item)"
                        :on-exceed="handleFileExceed" :on-remove="handleFileRemove(item)" style="width: 500px;">
                        <el-button type="primary" :icon="Upload">点击上传</el-button>
                    </el-upload>
                </template>

                <template v-if="item.type === 'date-range'">
                    <el-config-provider :locale="zhCn">
                        <el-date-picker v-model="modelValue[item.field.split('|')[0]]" type="datetime"
                            placeholder="开始日期" value-format="YYYY-MM-DD HH:mm:ss" />
                        ~
                        <el-date-picker v-model="modelValue[item.field.split('|')[1]]" type="datetime"
                            placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-config-provider>
                </template>

                <template v-if="item.type === 'slot'">
                    <slot :name="item.field"></slot>
                </template>
            </el-form-item>
        </template>
    </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormItem } from './form-type';
import { backendUploadFile, uploadFile } from '../../api/file';
import { Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const props = defineProps({
    title: String,
    formConfigs: Array<FormItem>,
    formRef: Object,
    modelValue: Object
});

const rules = ref({});
const formRef = ref();

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
}

const handleFileUpload = (item: FormItem) => {
    if (item.fileList.length > 0) {
        item.fileList = [];
    }
    return (file: any) => {
        const formData = new FormData();
        formData.append('file', file.file);
        backendUploadFile(formData).then((res: any) => {
            if (res.data.code === 200) {
                props.modelValue[item.field] = res.data.data.fileName;
            }
        });
    };
}

const handleFileExceed = () => {
    ElMessage.warning('只能上传一个文件');
}

const handleFileRemove = (item: FormItem) => {
    props.modelValue[item.field] = '';
}

const setFormFieldValue = (fieldName: string, valueName: string, value: any) => {
    for (const item of props.formConfigs) {
        if (item.field == fieldName) {
            item[valueName] = value;
        }
    }
}

const setFieldOptions = (fieldName: string, options: any) => {
    setFormFieldValue(fieldName, 'options', options);
}

const setFormImageUrl = (fieldName: string, url: string) => {
    setFormFieldValue(fieldName, 'imageUrl', url);
}

defineExpose({
    formRef,
    setFormImageUrl,
    setFieldOptions
})
</script>

<style lang="less" scoped>
.el-input {
    width: 500px;
}

.el-select {
    width: 240px;
}


:deep(.el-form-item__label) {
    font-weight: bold;
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

.input-tips {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 200;
    line-height: 12px;
    margin-top: 5px;
}
</style>