<template>
    <div class="main-panel">
        <div class="panel">
            <div class="title">基础信息</div>
            <div class="content">
                <el-row>
                    <el-col :span="8">
                        <span class="head">订单号：</span>
                        <span class="content-text">{{ orderInfo.orderSn }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">总金额：</span>
                        <span class="content-text">￥{{ orderInfo.payAmount?.toFixed(2) }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">订单状态：</span>
                        <span class="content-text"><el-tag type="info">{{ orderInfo.statusText }}</el-tag></span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <span class="head">订单类型：</span>
                        <span class="content-text">{{ orderInfo.typeName }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">订单时间：</span>
                        <span class="content-text">{{ orderInfo.payTime }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">备注信息：</span>
                        <span class="content-text">{{ orderInfo.remark ? orderInfo.remark : '暂无' }}</span>
                    </el-col>
                </el-row>
            </div>
        </div>


        <div class="panel">
            <div class="title">支付信息</div>

            <div class="content">
                <el-row>
                    <el-col :span="8">
                        <span class="head">支付金额：</span>
                        <span class="content-text">￥{{ orderInfo.payAmount?.toFixed(2) }}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="head">支付状态：</span>
                        <span class="content-text">
                            <el-tag type="success" v-if="orderInfo.payStatus === 'B'">已支付</el-tag>
                            <el-tag type="danger" v-else>待支付</el-tag>
                        </span>
                    </el-col>

                    <el-col :span="8">
                        <span class="head">减免金额：</span>
                        <span class="content-text">￥{{ orderInfo.discount?.toFixed(2) }}</span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <span class="head">支付方式：</span>
                        <span class="content-text">{{ payTypeList.find((item) => item.value === orderInfo.payType)?.name
                            }}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="head">支付时间：</span>
                        <span class="content-text">{{ orderInfo.payTime }}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="head">使用卡券：</span>
                        <span class="content-text">{{ orderInfo.couponInfo ? orderInfo.couponInfo.name : '--' }}</span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <span class="head">使用积分：</span>
                        <span class="content-text">{{ orderInfo.usePoint }}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="head">积分金额：</span>
                        <span class="content-text">￥{{ orderInfo.pointAmount?.toFixed(2) }}</span>
                    </el-col>

                    <el-col :span="8">
                        <span class="head">配送费用：</span>
                        <span class="content-text">￥{{ orderInfo.deliveryFee ? orderInfo.deliveryFee.toFixed(2) : '-'
                            }}</span>
                    </el-col>
                </el-row>
            </div>
        </div>


        <div class="panel">
            <div class="title">商品信息</div>

            <div class="content">
                <el-table :data="orderInfo.goods" style="width: 100%">
                    <el-table-column prop="id" label="商品ID" />
                    <el-table-column label="图片">
                        <template #default="scope">
                            <el-image class="table-item-logo" :src="scope.row.image">
                                <template #error>
                                    <div class="image-slot">
                                        <el-icon>
                                            <Picture />
                                        </el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" />
                    <el-table-column label="规格">
                        <template #default="scope">
                            <span v-if="!scope.row.specList || scope.row.specList.length === 0">--</span>
                            <el-tag v-else v-for="item in scope.row.specList" :key="item.specValue">{{ item.specValue
                                }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="价格" />
                    <el-table-column prop="discount" label="优惠金额" />
                    <el-table-column prop="num" label="数量" />
                </el-table>
            </div>
        </div>

        <div v-if="orderInfo.orderMode == 'express'" class="panel">
            <div class="title">配送信息</div>

            <div class="content">
                <el-row>
                    <el-col :span="8">
                        <span class="head">配送方式：</span>
                        <span class="content-text">物流配送</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">收货人：</span>
                        <span class="content-text">{{ orderInfo.address.name }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">联系电话：</span>
                        <span class="content-text">{{ orderInfo.address.mobile }}</span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <span class="head">配送地址：</span>
                        <span class="content-text">{{ orderInfo.address.provinceName + orderInfo.address.cityName +
                            orderInfo.address.regionName + orderInfo.address.detail }}</span>
                    </el-col>
                </el-row>
            </div>

        </div>

        <div v-if="orderInfo.orderMode == 'oneself' && orderInfo.tyep == 'goods'" class="panel">
            <div class="title">配送信息</div>

            <div class="content">
                <el-row>
                    <el-col :span="12">
                        <span class="head">配送方式：</span>
                        <span class="content-text">门店自提</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="head">自提地址：</span>
                        <span class="content-text">{{ orderInfo.storeInfo.address }}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { getOrderInfo } from '../../../../api/order';
import { useRoute } from 'vue-router';
import { errorNotification } from '../../../../utils/notification';

const orderInfo = ref({});
const payTypeList = ref([]);
const payStatusList = ref([]);

const route = useRoute();

const loadOrderInfo = (id: any) => {
    getOrderInfo(id).then((res: any) => {
        if (res.data.code != 200) {
            errorNotification(res.data.message);
            return;
        }

        orderInfo.value = res.data.data.orderInfo;

        payTypeList.value = res.data.data.payTypeList;
        payStatusList.value = res.data.data.payStatusList;
    })
}

onMounted(() => {
    const orderId = route.query.orderId;

    loadOrderInfo(orderId);
})
</script>

<style lang="less" scoped>
.main-panel {
    margin: 20px;
    border: 1px solid #b7b7b7;
    padding: 10px 0;

    .title {
        border-left: 5px solid #ff8400;
        padding-left: 10px;
        font-weight: bold;
        font-size: 16px;
    }

    .content {
        padding: 20px;

        .head {
            color: rgb(164, 164, 164);
            text-align: right;
            min-width: 120px;
            float: left;
            line-height: 40px;
        }

        .content-text {
            line-height: 40px;
        }
    }
}

.panel {
    margin: 10px;
    border: 1px solid #b7b7b7;
    padding: 10px;
}

.el-tag {
    font-size: 16px;
}

.table-item-logo {
    width: 60px;
    height: 60px;

    .image-slot {
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>