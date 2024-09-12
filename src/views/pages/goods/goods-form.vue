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
                            <div class="create-sn" @click="createGoodsNo">随机生成商品条码</div>
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
                                <el-option v-for="item in storeList" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                            <div class="input-tips">提示: 未选择则属于公共商品</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商品图片" prop="images">
                        <template #label>
                            <label>商品图片</label>
                        </template>
                        <el-upload v-model:file-list="imageFileList" list-type="picture-card" action=""
                            :http-request="handleUpload" :on-remove="handleImageRemove">
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


                    <el-form-item v-if="goodsData.isSingleSpec === 'N'" label="商品规格" prop="spec">
                        <div class="spec-list">
                            <div class="spec-list-head">
                                <el-button @click="addSpec" type="primary">添加规格</el-button>
                            </div>
                            <div class="spec-list-item" v-for="(item, index) in specList" :key="index">
                                <div class="spec-item-main">
                                    <div style="margin-bottom: 10px">
                                        <span class="spec-item-label">规格名</span>
                                        <el-input v-model="item.name" placeholder="请输入规格名" />
                                    </div>
                                    <div>
                                        <span class="spec-item-label">规格值</span>
                                        <el-tag v-for="(tagItem, index) in item.child" :key="index" size="large"
                                            type="primary" class="tag-item" closable
                                            @close="removeSpecValue(item, tagItem)">{{
                                                tagItem.value }}</el-tag>
                                        <el-button @click="addSpecValue(item)" type="primary" plain
                                            :icon="Plus">添加</el-button>
                                    </div>
                                </div>
                                <el-button @click="removeSpec(item)" type="danger" plain :icon="Delete">删除</el-button>
                            </div>

                            <div class="spec-setting">
                                <span>规格设置</span>
                                <el-input v-model="specSetting.skuNo" placeholder="sku编码" style="width: 140px" />
                                <span class="create-sn" @click="createSkuNo">随机生成</span>
                                <el-input v-model="specSetting.price" placeholder="商品价格" style="width: 100px;" />
                                <el-input v-model="specSetting.linePrice" placeholder="划线价格" style="width: 100px;" />
                                <el-input v-model="specSetting.stock" placeholder="商品库存" style="width: 100px;" />
                                <el-input v-model="specSetting.weight" placeholder="商品重量" style="width: 100px;" />
                                <el-button type="danger" style="margin-left: 10px" plain
                                    @click="onSubmitSpecSetting">确认设置</el-button>
                            </div>

                            <el-table :data="skuDataList" border empty-text="暂无数据" style="width: 100%;"
                                :header-cell-style="{ 'text-align': 'center', 'color': '#515a6e' }">
                                <el-table-column prop="no" label="序号" align="center" width="60" />
                                <el-table-column prop="logo" label="图片" align="center" width="120">
                                    <template #default="scope">
                                        <el-upload class="uploader" action="" type="drag" :show-file-list="false"
                                            :http-request="handleScpeLogoUpload(scope.row)">
                                            <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl"
                                                class="uploader-image" />
                                            <el-icon v-else class="uploader-icon">
                                                <Plus />
                                            </el-icon>
                                        </el-upload>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specList" label="规格" align="center">
                                    <template #default="scope">
                                        <div v-for="(item, index) in scope.row.specList" :key="index">
                                            <el-tag style="font-size: 14px" size="large" round>{{ item.value }}</el-tag>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="skuNo" label="sku编码">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.skuNo" style="width: auto;" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="销售价格(元)">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.price" style="width: auto;" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="linePrice" label="划线价格(元)">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.linePrice" style="width: auto;" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="stock" label="商品库存">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.stock" style="width: auto;" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="weight" label="重量(千克)">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.weight" style="width: auto;" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="goodsData.type == 'coupon'" prop="coupnIds" label="卡券ID">
                        <div>
                            <el-input v-model="goodsData.coupnIds" placeholder="请输入购买的卡券ID，英文逗号分隔，如：1000,1001,1002"
                                clearable type="textarea" style="width: 500px" />
                            <div class="input-tips">提示：购买的卡券ID，英文逗号分隔</div>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="goodsData.isSingleSpec === 'Y'" label="库存数量" prop="stock">
                        <el-input v-model="goodsData.stock" placeholder="请输入库存数量" clearable />
                    </el-form-item>

                    <el-form-item v-if="goodsData.isSingleSpec === 'Y'" label="商品价格" prop="price">
                        <div>
                            <el-input v-model="goodsData.price" placeholder="请输入商品价格" clearable />
                            <div class="input-tips">单位：元</div>
                        </div>
                    </el-form-item>

                    <el-form-item v-if="goodsData.isSingleSpec === 'Y'" label="划线价格" prop="linePrice">
                        <div>
                            <el-input v-model="goodsData.linePrice" placeholder="请输入划线价格" clearable />
                            <div class="input-tips">单位：元</div>
                        </div>
                    </el-form-item>


                    <el-form-item label=" 初始销量" prop="initSale">
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
                        <QuillEditor v-model:content="goodsData.description" content-type="html" :options="editorOption"
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

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { deleteGoodsSpec, deleteGoodsSpecValue, getGoodsInfo } from '../../../api/goods';
import { saveGoods, saveGoodsSpecName, saveGoodsSpecValue } from '../../../api/goods';
import { errorNotification, successNotification } from '../../../utils/notification';
import { uploadFile } from '../../../api/file';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import router from '../../../router';
import { useTagsViewStore } from '../../../store/tags-view';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { Delete, Plus } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';

const activeName = ref('basic');
const typeList = ref([]);
const storeList = ref([]);
const cateList = ref([]);
const basicFormRef = ref();
const extensionFormRef = ref();
const specList = ref([]);
const skuDataList = ref([]);
const imageFileList = ref([]);
const imagePath = ref([]);
const goodsId = ref();
const goodsData = ref({
    type: '',
    name: '',
    goodsNo: '',
    cateId: '',
    storeId: null,
    sort: 0,
    status: 'A',
    images: [],
    canUsePoint: 'Y',
    isMemberDiscount: 'Y',
    isSingleSpec: 'Y',
    stock: '',
    price: '',
    linePrice: '',
    initSale: 0,
    salePoint: '',
    description: '',
    couponIds: '',
});
const specSetting = ref({
    skuNo: '',
    price: '',
    linePrice: '',
    stock: '',
    weight: '',
})


const tagsViewStore = useTagsViewStore();
const route = useRoute();

const createGoodsNo = () => {
    const goodsNo = "1" + Math.floor(Math.random() * Math.pow(10, 14));
    goodsData.value.goodsNo = goodsNo.toString();
};

const createSkuNo = () => {
    const skuNo = "1" + Math.floor(Math.random() * Math.pow(10, 14));
    specSetting.value.skuNo = skuNo.toString();
}

const handleSubmit = () => {
    if (activeName.value == 'basic') {
        basicFormRef.value.validate((valid: any) => {
            if (!valid) {
                errorNotification('请检查基础信息内容');
                return;
            }

            let params = {
                type: goodsData.value.type,
                name: goodsData.value.name,
                goodsNo: goodsData.value.goodsNo,
                cateId: goodsData.value.cateId,
                storeId: goodsData.value.storeId,
                images: goodsData.value.images,
                sort: goodsData.value.sort,
                status: goodsData.value.status,
            };
            if (goodsId.value != 0) {
                params = Object.assign(params, { goodsId: goodsId.value });
            }
            saveGoods(params).then((res) => {
                if (res.data.code == 200) {
                    successNotification(res.data.message);
                } else {
                    errorNotification(res.data.message);
                }
            });
        })
    } else if (activeName.value == 'extension') {
        extensionFormRef.value.validate((valid: any) => {
            if (!valid) {
                errorNotification('请检查扩展信息内容');
                return;
            }

            let params = {
                canUsePoint: goodsData.value.canUsePoint,
                isMemberDiscount: goodsData.value.isMemberDiscount,
                isSingleSpec: goodsData.value.isSingleSpec,
                initSale: goodsData.value.initSale,
                salePoint: goodsData.value.salePoint,
            };

            if (goodsId.value != 0) {
                params = Object.assign(params, { goodsId: goodsId.value });
            }

            if (goodsData.value.isSingleSpec == 'Y') {
                params = Object.assign(params, {
                    stock: goodsData.value.stock,
                    price: goodsData.value.price,
                    linePrice: goodsData.value.linePrice
                });
            } else {
                params = Object.assign(params, {
                    specList: goodsData.value.specList,
                    skuData: skuDataList.value
                });
            }

            if (goodsData.value.type == 'coupon') {
                params = Object.assign(params, { couponIds: goodsData.value.couponIds });
            }

            saveGoods(params).then((res) => {
                if (res.data.code == 200) {
                    successNotification(res.data.message);
                } else {
                    errorNotification(res.data.message);
                }
            });
        });
    } else if (activeName.value == 'description') {
        let params = {
            description: goodsData.value.description
        }

        if (goodsId.value != 0) {
            params = Object.assign(params, { goodsId: goodsId.value });
        }

        saveGoods(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
            } else {
                errorNotification(res.data.message);
            }
        });
    }
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
            goodsData.value.images.push(res.data.data.fileName);
            imageFileList.value = imageFileList.value.map((item: any) => {
                if (item.uid == file.file.uid) {
                    return {
                        name: res.data.data.fileName,
                        url: res.data.data.url
                    }
                } else {
                    return item
                }
            });
        } else {
            errorNotification(res.data.message);
        }
    });
};

const handleScpeLogoUpload = (row: any) => {
    return (file: any) => {
        const formData = new FormData();
        formData.append('file', file.file);
        uploadFile(formData).then((res: any) => {
            if (res.data.code === 200) {
                row.logo = res.data.data.fileName;
                row.logoUrl = res.data.data.url
            } else {
                errorNotification(res.data.message);
            }
        })
    }
}

const handleImageRemove = (file: any) => {
    goodsData.value.images = goodsData.value.images.filter((item: any) => {
        return item != file.name
    });
    imageFileList.value = imageFileList.value.filter((item: any) => {
        return item.name != file.name
    });
};

const onSubmitSpecSetting = () => {
    for (let i = 0; i < skuDataList.value.length; i++) {
        let skuData = skuDataList.value[i];
        skuData.skuNo = specSetting.value.skuNo;
        skuData.price = specSetting.value.price;
        skuData.linePrice = specSetting.value.linePrice;
        skuData.stock = specSetting.value.stock;
        skuData.weight = specSetting.value.weight;
    }
}

const addSpec = () => {
    ElMessageBox.prompt('请输入规格名称', '添加规格', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '规格名称不能为空',
    }).then(({ value }) => {
        if (goodsId.value === 0) {
            errorNotification('请先保存基础信息');
            return;
        }
        const params = {
            goodsId: goodsId.value,
            name: value
        }
        saveGoodsSpecName(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                specList.value.push({ id: res.data.data.id, name: value, child: [] });
            } else {
                errorNotification(res.data.message);
            }
        })
    })
}

const addSpecValue = (item: any) => {
    ElMessageBox.prompt('请输入规格值', '添加规格值', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '规格值不能为空',
    }).then(({ value }) => {
        if (goodsId.value === 0) {
            errorNotification('请先保存基础信息');
            return;
        }

        const params = {
            goodsId: goodsId.value,
            specName: item.name,
            value: value
        }
        saveGoodsSpecValue(params).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                const childItem = { id: res.data.data.id, name: item.name, value: value };
                item.child.push(childItem);

                onAddSpecValue(childItem);
            } else {
                errorNotification(res.data.message);
            }
        })
    });
}

const removeSpec = (item: any) => {
    ElMessageBox.confirm('确定要删除该规格吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        if (goodsId.value === 0) {
            errorNotification('请先保存基础信息');
            return;
        }

        deleteGoodsSpec(goodsId.value, item.name).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                specList.value = specList.value.filter((spec: any) => spec.id != item.id);

                reloadSkuDataList();
            } else {
                errorNotification(res.data.message);
            }
        })
    })
}

const removeSpecValue = (item: any, tagItem: any) => {
    ElMessageBox.confirm('确定要删除该规格值吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteGoodsSpecValue(tagItem.id).then((res) => {
            if (res.data.code == 200) {
                successNotification(res.data.message);
                item.child = item.child.filter((child: any) => child.id != tagItem.id);

                onRemoveSpecValue(tagItem, item.child.length == 0);
            } else {
                errorNotification(res.data.message);
            }
        })
    })
}

const onAddSpecValue = (item: any) => {
    const specListLength = specList.value.length;
    skuDataList.value.forEach((skuData: any, index: number) => {
        if (skuData.specList.length != specListLength) {
            skuData.specList.push({ id: item.id, name: item.name, value: item.value });
        } else if (skuData.specList.length == specListLength) {
            let cloneData = JSON.parse(JSON.stringify(skuData));
            cloneData.specList[specListLength - 1] = { id: item.id, name: item.name, value: item.value };
            let specIds = cloneData.specIds.split('-');
            specIds[specListLength - 1] = item.id;
            cloneData.specIds = specIds.join('-');
            skuDataList.value.push(cloneData);
        }
    });

    updateSkuDataNo();
}

const onRemoveSpecValue = (item: any, isLast: boolean) => {
    if (!isLast) {
        skuDataList.value = skuDataList.value.filter((skuData: any) => {
            let specIds = skuData.specIds.split('-');
            for (let i = 0; i < specIds.length; i++) {
                if (specIds[i] == item.id) {
                    return false;
                }
            }
            return true;
        });
    } else {
        skuDataList.value = skuDataList.value.map((skuData: any) => {
            let specIds = skuData.specIds.split('-');
            specIds = specIds.filter((specId: any) => specId != item.id);
            skuData.specIds = specIds.join('-');

            skuData.specList = skuData.specList.filter((spec: any) => spec.id != item.id);
            return skuData;
        });
    }

    updateSkuDataNo();
}

const reloadSkuDataList = (saveOriginData: boolean = false) => {
    let originSkuDataList = [];
    if (saveOriginData) {
        originSkuDataList = JSON.parse(JSON.stringify(skuDataList.value));
    }
    skuDataList.value = [];
    specList.value.forEach((item: any) => {
        let tempList = JSON.stringify(skuDataList.value);
        skuDataList.value = [];
        item.child.forEach((child: any) => {
            let temp = JSON.parse(tempList);
            if (temp.length == 0) {
                temp.push({
                    no: "",
                    skuNo: "",
                    logo: "",
                    logoUrl: "",
                    price: 0,
                    linePrice: 0,
                    stock: 0,
                    weight: 0,
                    specIds: "",
                    specList: [],
                })
            }
            temp.forEach((childItems: any) => {
                childItems.specIds += childItems.specList.length == 0 ? `${child.id}` : `-${child.id}`
                childItems.specList.push({
                    id: child.id,
                    name: child.name,
                    value: child.value
                })
            })
            skuDataList.value = skuDataList.value.concat(temp);
        })
    })
    if (saveOriginData) {
        for (let i = 0; i < skuDataList.value.length; i++) {
            for (let j = 0; j < originSkuDataList.length; j++) {
                if (skuDataList.value[i].specIds == originSkuDataList[j].specIds) {
                    skuDataList.value[i] = originSkuDataList[j];
                }
            }
        }
    }

    updateSkuDataNo();
}

const updateSkuDataNo = () => {
    let i = 1;
    skuDataList.value.forEach((item: any) => {
        item.no = i++;
    })
}

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
    coupnIds: [{ required: true, message: '优惠券ID不能为空', trigger: 'blur' }],
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

onMounted(() => {
    goodsId.value = route.query.goodsId ? route.query.goodsId : 0;
    getGoodsInfo(goodsId.value).then((res) => {
        if (res.data.code == 200) {
            const data = res.data.data;
            typeList.value = data.typeList;
            storeList.value = data.storeList.map((store: any) => ({
                value: store.id,
                label: store.name
            }));
            storeList.value.unshift({ value: 0, label: '公共店铺' });

            cateList.value = data.cateList;
            imagePath.value = data.imagePath;

            if (data.goods) {
                goodsData.value = data.goods;
                goodsData.value.images = data.images;
                imageFileList.value = goodsData.value.images.map((item: any) => {
                    return {
                        name: item,
                        url: imagePath.value + item
                    };
                });
            }

            specList.value = data.specData;
            for (let i = 0; i < specList.value.length; i++) {
                // 过滤掉没有名称的规格
                specList.value[i].child = specList.value[i].child.filter((item: any) => {
                    return item.name;
                })

                specList.value[i].child = specList.value[i].child.map((item: any) => {
                    return {
                        id: item.id,
                        name: specList.value[i].name,
                        value: item.name,
                    }
                })
            }

            skuDataList.value = data.skuData;
            skuDataList.value = skuDataList.value.map((item: any) => {
                if (item.logo) {
                    item.logoUrl = imagePath.value + item.logo
                }
                return item
            })

            reloadSkuDataList(true);
        } else {
            errorNotification(res.data.message);
        }
    });
});
</script>

<style lang="less" scoped>
.container {
    border: 1px solid #ccc;
    margin: 20px;
}

.tabs-container {
    padding: 5px 10px 20px;
}

.create-sn {
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

.uploader {
    width: 80px;
    height: 80px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    padding: 0;

    .uploader-image {
        width: 80px;
        height: 80px;
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
    width: 80px;
    height: 80px;
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

:deep(.el-form-item__content) {
    display: block;
}

.spec-list {
    display: block;
}

.spec-list-head {
    margin-bottom: 10px;
}

.spec-list-item {
    background-color: #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #e2e1e1;
    margin-bottom: 10px;

    .spec-item-main {
        flex: 1;
    }

    .spec-item-label {
        font-size: 14px;
        color: #666;
        font-weight: bold;
        margin: 0 10px;
    }

    .el-input {
        width: 240px;
    }

    .tag-item {
        margin-right: 10px;
    }
}

.spec-setting {
    margin: 20px 0 3px 0;

    .el-input {
        margin-left: 10px;
    }
}
</style>