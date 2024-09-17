<template>
    <div class="container">
        <el-row>
            <el-form class="search-form-card" :inline="true" :model="formInline" label-width="70px">
                <el-form-item label="文章标题">
                    <el-input v-model="formInline.title" placeholder="请输入文章标题" clearable />
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
                    <el-button type="primary" plain @click="onOpenAddArticleForm" :icon="Plus">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table :data="articleListData" style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="url" label="图片" align="center">
                    <template #default="scope">
                        <el-image class="table-item-image" :src="scope.row.imageUrl" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="文章标题" />
                <el-table-column prop="click" label="点击数" />
                <el-table-column prop="operator" label="创建者" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column prop="sort" label="排序" align="center" width="60" />
                <el-table-column label="状态" fixed="right" align="center" width="80">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" active-value="A" inactive-value="N"
                            @change="handleArticleStatusChange(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="180">
                    <template #default="scope">
                        <el-button link type="primary" size="small" :icon="Edit"
                            @click="handleArticleItemEdit(scope.row)">编辑</el-button>
                        <el-button link type="primary" size="small" :icon="Delete"
                            @click="handleArticleItemDelete(scope.row)">删除
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

    <el-dialog v-model="dialogArticleInfoFormVisible" :title="dialogTitle" @closed="onArticleFormClosed">
        <v-custom-form ref="articleInfoFormRef" v-model="articleFormData" :formConfigs="formConfigs">
            <template #description>
                <div style="width: 500px;">
                    <QuillEditor ref="quillEditorRef" v-model:content="articleFormData.description" content-type="html"
                        :options="editorOption" style="width: 100%; min-height: 300px;" placeholder="请输入内容" />
                </div>
            </template>
        </v-custom-form>
        <template #footer>
            <el-button type="primary" @click="handleArticleFormConfirm">确定</el-button>
            <el-button @click="dialogArticleInfoFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { getArticleList, saveArticle, updateArticleStatus } from '@/api/content';
import { onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
import { errorNotification, successNotification } from '@/utils/notification';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import VCustomForm from '@/components/custom-form/index.vue';
import { formConfigs } from './article-form-config';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const formInline = ref({
    title: '',
    status: '',
});
const articleFormData = ref({
    title: '',
    storeId: 0,
    sort: 0,
    brief: '',
    description: '',
    image: '',
    status: 'A',
});
const articleListData = ref([]);
const storeList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const imagePath = ref('');
const dialogTitle = ref('');
const dialogArticleInfoFormVisible = ref(false);
const articleInfoFormRef = ref();
const quillEditorRef = ref();

const onSubmitQuery = () => {
    searchArticleList();
}

const onSubmitReset = () => {
    formInline.value = {
        title: '',
        status: '',
    }
    searchArticleList();
}

const onOpenAddArticleForm = () => {
    dialogTitle.value = '新增文章';
    dialogArticleInfoFormVisible.value = true;

    articleFormData.value.description = "";
}

const onArticleFormClosed = () => {
    articleFormData.value = {
        title: '',
        storeId: 0,
        sort: 0,
        brief: '',
        description: "",
        image: '',
        status: 'A',
    };
    articleInfoFormRef.value.setFormImageUrl('image', '');
    quillEditorRef.value.setText('');
}

const handleArticleFormConfirm = () => {
    articleInfoFormRef.value.formRef.validate().then(() => {
        let params = {
            title: articleFormData.value.title,
            brief: articleFormData.value.brief,
            image: articleFormData.value.image,
            storeId: articleFormData.value.storeId,
            sort: articleFormData.value.sort,
            description: articleFormData.value.description,
            status: articleFormData.value.status
        }

        if (dialogTitle.value == '编辑文章') {
            params = Object.assign(params, { id: articleFormData.value.id });
        }

        saveArticle(params).then((res) => {
            if (res.data.code != 200) {
                errorNotification(res.data.msg);
                return;
            }

            successNotification(res.data.msg);
            dialogArticleInfoFormVisible.value = false;

            searchArticleList();
        })
    }).catch(() => {
        errorNotification('请检查表单信息是否有误');
    })
}

const handleArticleStatusChange = (row: any) => {
    const statusName = row.status == 'A' ? '启用' : '禁用';
    ElMessageBox.confirm('确认要' + statusName + row.title + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: row.status
        }

        updateArticleStatus(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.msg);
                searchArticleList();
            } else {
                errorNotification(res.data.msg);
            }
        })
    }).catch(() => {
        row.status = row.status == 'A' ? 'N' : 'A';
    });
}

const handleArticleItemDelete = (row: any) => {
    ElMessageBox.confirm('确认要删除' + row.title + '吗？', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const params = {
            id: row.id,
            status: "D"
        }
        updateArticleStatus(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.msg);
                searchArticleList();
            } else {
                errorNotification(res.data.msg);
            }
        })
    })
}

const handleArticleItemEdit = (row: any) => {
    dialogTitle.value = '编辑文章';

    if (row.image.indexOf(imagePath.value) != -1) {
        row.image = row.image.replace(imagePath.value, '');
    }

    articleFormData.value = row;
    dialogArticleInfoFormVisible.value = true;
    articleInfoFormRef.value.setFormImageUrl('image', row.image.length == 0 ? '' : imagePath.value + row.image);
}

const searchArticleList = () => {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
        title: formInline.value.title,
        status: formInline.value.status
    }

    getArticleList(params).then((res) => {
        const data = res.data.data;

        total.value = data.dataList.totalElements;

        storeList.value = data.storeList.map((store: any) => ({
            value: store.id,
            label: store.name
        }));
        storeList.value.unshift({ value: 0, label: '公共店铺' });

        formConfigs.forEach((item: any) => {
            if (item.field == 'storeId') {
                item.options = storeList.value;
            }
        })

        imagePath.value = data.imagePath;

        articleListData.value = data.dataList.content;
        articleListData.value.forEach((item: any) => {
            item.imageUrl = item.image;
            item.createTime = new Date(item.createTime).toLocaleString();
        })
    })
}

const handlePaginationChange = () => {
    searchArticleList();
}

onMounted(() => {
    searchArticleList();
});


const editorOption = {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"], // 引用
            [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
            [{ script: "sub" }, { script: "super" }], // 上标/下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ font: [] }], // 字体种类
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除文本格式
            ['link'] // 链接、图片、视频
        ]
    },
}
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


.table-item-image {
    width: 60px;
    height: 50px;
    border-radius: 5px;
}

.pagination-row {
    margin-top: 20px;
    text-align: right;
    display: flex;
    justify-content: flex-end;

}
</style>