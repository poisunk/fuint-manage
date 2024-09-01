<template>
    <div class="container">
        <el-tabs v-model="activeName" class="tabs-container">
            <el-tab-pane label="基础信息" name="basic">
                <el-form ref="basicFormRef" :model="goodsData" :rules="basicFormRules" class="form-container"
                    label-width="120px">
                    <el-form-item label="商品类型" prop="type">
                        <el-select v-model="goodsData.type" placeholder="商品类型" clearable>
                            <el-option v-for="item in typeList" :key="item.key" :label="item.name"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="goodsData.name" placeholder="请输入商品名称" clearable />
                    </el-form-item>

                    <el-form-item label="商品条码" prop="goodsNo">
                        <div style="width: 100%;">
                            <el-input v-model="goodsData.goodsNo" placeholder="请输入商品条码" clearable />
                            <div id="create-goodsNo" @click="createGoodsNo">随机生成商品条码</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商品分类" prop="cateId">
                        <el-select v-model="goodsData.cateId" placeholder="商品分类" clearable>
                            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="所属店铺" prop="storeId">
                        <div>
                            <el-select v-model="goodsData.storeId" placeholder="所属店铺" clearable>
                                <el-option v-for="item in storeList" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                            <div class="input-tips">提示: 未选择则属于公共商品</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商品图片" prop="images">
                        <template #label>
                            <label>商品图片</label>
                        </template>
                        <el-upload v-model:file-list="goodsData.imageUrls" list-type="picture-card" action=""
                            :http-request="handleUpload" @on-remove="handleImageRemove">
                            <el-icon class="uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="显示排序" prop="sort">
                        <div>
                            <el-input-number v-model="goodsData.sort" />
                            <div class="input-tips">提示: 数字越小，排行越靠前</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商品状态" prop="status">
                        <el-radio-group v-model="goodsData.status">
                            <el-radio label="上架" value="A" />
                            <el-radio label="下架" value="N" />
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>


            <el-tab-pane label="扩展信息" name="extension">
                <el-form ref="extensionFormRef" :model="goodsData" :rules="extensionFormRules" class="form-container"
                    label-width="120px">
                    <el-form-item label="积分抵扣" prop="canUsePoint">
                        <el-radio-group v-model="goodsData.canUsePoint">
                            <el-radio label="允许" value="Y" />
                            <el-radio label="不允许" value="N" />
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="会员折扣" prop="isMemberDiscount">
                        <el-radio-group v-model="goodsData.isMemberDiscount">
                            <el-radio label="有折扣" value="Y" />
                            <el-radio label="无折扣" value="N" />
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="规格类型" prop="isSingleSpec">
                        <el-radio-group v-model="goodsData.isSingleSpec">
                            <el-radio label="单规格" value="Y" />
                            <el-radio label="多规格" value="N" />
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="库存数量" prop="stock">
                        <el-input v-model="goodsData.stock" placeholder="请输入库存数量" clearable />
                    </el-form-item>

                    <el-form-item label="商品价格" prop="price">
                        <div>
                            <el-input v-model="goodsData.price" placeholder="请输入商品价格" clearable />
                            <div class="input-tips">单位：元</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="划线价格" prop="linePrice">
                        <div>
                            <el-input v-model="goodsData.linePrice" placeholder="请输入划线价格" clearable />
                            <div class="input-tips">单位：元</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="初始销量" prop="initSale">
                        <div>
                            <el-input v-model="goodsData.initSale" type="number" placeholder="请输入初始销量" clearable />
                            <div class="input-tips">提示：输入数字，虚拟销量</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商品卖点" prop="salePoint">
                        <el-input v-model="goodsData.salePoint" placeholder="请输入商品卖点，几个字总结" clearable />
                    </el-form-item>
                </el-form>
            </el-tab-pane>


            <el-tab-pane label="商品介绍" name="description">
                <div style="width: 375px; margin-left: 80px">
                    <el-form class="form-container" label-width="120px">
                        <QuillEditor v-model="goodsData.description" :options="editorOption"
                            style="min-height: 500px" />
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>

        <div class="footer">
            <el-button @click="handleSubmit" type="primary" size="large">确定</el-button>
            <el-button @click="handleCancel" size="large">取消</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getGoodsInfo, saveGoods } from '../../../api/goods';
import { errorNotification, successNotification } from '../../../utils/notification';
import { uploadFile } from '../../../api/file';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import router from '../../../router';
import { useTagsViewStore } from '../../../store/tags-view';

const activeName = ref('basic');
const typeList = ref([]);
const storeList = ref([]);
const cateList = ref([]);
const basicFormRef = ref();
const extensionFormRef = ref();
const goodsData = ref({
    type: '',
    name: '',
    goodsNo: '',
    cateId: '',
    storeId: null,
    sort: 0,
    status: 'A',
    images: [],
    imageUrls: [],
    canUsePoint: 'Y',
    isMemberDiscount: 'Y',
    isSingleSpec: 'Y',
    stock: '',
    price: '',
    linePrice: '',
    initSale: 0,
    salePoint: '',
    description: '',
});

const tagsViewStore = useTagsViewStore();

const createGoodsNo = () => {
    const goodsNo = "1" + Math.floor(Math.random() * Math.pow(10, 14));
    goodsData.value.goodsNo = goodsNo.toString();
};

const handleSubmit = () => {
    basicFormRef.value.validate((valid: any) => {
        if (!valid) {
            console.log(goodsData.images);

            activeName.value = 'basic';
            errorNotification('请检查基础信息内容');
            return;
        }

        extensionFormRef.value.validate((valid: any) => {
            if (!valid) {
                activeName.value = 'extension';
                errorNotification('请检查扩展信息内容');
                return;
            }

            saveGoods(goodsData.value).then((res) => {
                if (res.data.code == 200) {
                    successNotification(res.data.message);
                } else {
                    errorNotification(res.data.message);
                }
            })
        })
    })
}

const handleCancel = () => {
    tagsViewStore.delView(router.currentRoute.value);
    router.back();
};

const handleUpload = (file: any) => {
    const formData = new FormData();
    formData.append('file', file.file);
    uploadFile(formData).then((res: any) => {
        if (res.data.code === 200) {
            goodsData.value.imageUrls.push(res.data.data.url);
            goodsData.value.images.push(res.data.data.fileName);
            console.log(goodsData.value.imageUrls);
            console.log(goodsData.value.images);
        }
    });
};

const handleImageRemove = (file: any) => {
    const index = goodsData.value.imageUrls.indexOf(file.url);
    goodsData.value.imageUrls.splice(index, 1);
    goodsData.value.images.splice(index, 1);
}

getGoodsInfo(0).then((res) => {
    if (res.data.code == 200) {
        typeList.value = res.data.data.typeList;
        storeList.value = [{ id: '0', name: '公共店铺' }];
        storeList.value = storeList.value.concat(res.data.data.storeList);
        cateList.value = res.data.data.cateList;
    } else {
        errorNotification(res.data.message);
    }
});

const basicFormRules = {
    type: [{ required: true, message: '请选择商品类型', trigger: 'blur' }],
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    goodsNo: [{ required: true, message: '请输入商品条码', trigger: 'blur' }],
    cateId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
    images: [{ required: true, message: '商品图片不能为空', trigger: 'blur' }],
}

const extensionFormRules = {
    canUsePoint: [{ required: true, message: '积分抵扣不能为空', trigger: 'blur' }],
    isMemberDiscount: [{ required: true, message: '会员折扣不能为空', trigger: 'blur' }],
    isSingleSpec: [{ required: true, message: '规格类型不能为空', trigger: 'blur' }],
    stock: [{ required: true, message: '库存数量不能为空', trigger: 'blur' }],
    price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
}

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
    }
}
</script>

<style lang="less" scoped>
.container {
    border: 1px solid #ccc;
    margin: 20px;
}

.tabs-container {
    padding: 5px 10px 20px;
}

#create-goodsNo {
    font-size: 12px;
    color: #00f;
    cursor: pointer;
    width: 100px;
}

.form-container {
    margin-left: 20px;
    margin-top: 20px;

    .el-input {
        width: 450px;
    }

    .el-select {
        width: 450px;
    }

    .el-form-item {
        margin-bottom: 25px;
    }
}

:deep(.el-upload--picture-card),
:deep(.el-upload-list__item),
:deep(.el-upload-list__item-thumbnail) {
    width: 100px;
    height: 100px;

    object-fit: cover;
}

.el-icon.uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
}

.input-tips {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 200;
    line-height: 12px;
    margin-top: 5px;
}

.footer {
    margin-bottom: 20px;
    margin-left: 200px;
}


:deep(.el-form-item__label) {
    font-weight: bold;
}
</style>