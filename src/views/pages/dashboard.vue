<template>
    <div>
        <el-row>
            <div class="dashboard-card">
                <div class="dashboard-title">
                    运营概况
                </div>
                <div class="dashboard-content">
                    <el-row>
                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <Document />
                                </el-icon>
                                <p class="text">今日新增订单数（笔）</p>
                                <p class="number">{{ homeInfo.todayOrder }}</p>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <Money />
                                </el-icon>
                                <p class="text">今日交易金额（元）</p>
                                <p class="number">{{ homeInfo.todayPay }}</p>
                            </el-card>
                        </el-col>


                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <User />
                                </el-icon>
                                <p class="text">今日新增会员数</p>
                                <p class="number">{{ homeInfo.todayUser }}</p>
                            </el-card>
                        </el-col>


                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <ShoppingCart />
                                </el-icon>
                                <p class="text">今日活跃会员数</p>
                                <p class="number">{{ homeInfo.todayActiveUser }}</p>
                            </el-card>
                        </el-col>
                    </el-row>


                    <el-row>
                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <WindPower />
                                </el-icon>
                                <p class="text">总会员数</p>
                                <p class="number">{{ homeInfo.totalUser }}</p>
                            </el-card>
                        </el-col>

                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <Connection />
                                </el-icon>
                                <p class="text">总交易金额（元）</p>
                                <p class="number">{{ homeInfo.totalPay }}</p>
                            </el-card>
                        </el-col>


                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <DocumentChecked />
                                </el-icon>
                                <p class="text">总订单数</p>
                                <p class="number">{{ homeInfo.totalOrder }}</p>
                            </el-card>
                        </el-col>


                        <el-col :span="6">
                            <el-card shadow="hover" class="dashboard-item">
                                <el-icon class="circle-icon" size="35">
                                    <Sell />
                                </el-icon>
                                <p class="text">总支付人数</p>
                                <p class="number">{{ homeInfo.totalPayUser }}</p>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-row>

        <el-row>
            <div class="dashboard-card">
                <div class="dashboard-title">
                    报表统计
                </div>
                <div class="dashboard-content">
                    <el-row>
                        <el-col :span="12">
                            <div class="charts" id="order-chart" ref="orderChart"></div>
                        </el-col>

                        <el-col :span="12">
                            <div class="charts" id="active-user-chart" ref="activeUserChart"></div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getHomeInfo, getHomeStatistics } from '../../api/home';
import * as echarts from 'echarts';

const orderChart = ref();
const activeUserChart = ref();

const homeInfo = ref({
    todayActiveUser: 0,
    todayOrder: 0,
    todayPay: 0,
    todayUser: 0,
    totalOrder: 0,
    totalPay: null,
    totalPayUser: 0,
    totalUser: 0,
});

getHomeInfo().then(res => {
    homeInfo.value = res.data.data;
    for (let key in homeInfo.value) {
        if (homeInfo.value[key] === null) {
            homeInfo.value[key] = 0;
        }
    }
})

getHomeStatistics("order,Cuser_active").then(res => {
    console.log(res.data.data);
    const labels = res.data.data.labels;
    const orderData = res.data.data.data[0];
    const activeUserData = res.data.data.data[1];

    const orderEchart = echarts.init(orderChart.value);

    var option = {
        title: {
            show: true,
            text: "近7日订单数量",
            left: "center",
            textStyle: {
                fontSize: 14
            }
        },
        legend: {
            data: ['订单数'],
            bottom: 0
        },
        color: ['#ff5b57'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: labels,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '订单数',
                data: orderData,
                type: 'bar',
            },
        ]
    };

    orderEchart.setOption(option);

    const activeUserEchart = echarts.init(activeUserChart.value);

    var option = {
        title: {
            show: true,
            text: "近7日活跃用户",
            left: "center",
            textStyle: {
                fontSize: 14
            }
        },
        legend: {
            data: ['活跃用户'],
            bottom: 0
        },
        color: ['#1bb5b5'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: labels,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '活跃用户',
                data: activeUserData,
                type: 'line',
            },
        ]
    };

    activeUserEchart.setOption(option);

    window.onresize = function () {
        orderEchart.resize();
        activeUserEchart.resize();
    }
})
</script>

<style lang="less" scoped>
.dashboard-card {
    border: 1px solid #e2e1e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    width: 100%;
    margin: 0 20px 20px;
}

.dashboard-title {
    background-color: #f4f4f4;
    padding: 12px;
    font-weight: bold;
    border-bottom: 1px solid #e2e1e1;
}

.dashboard-content {
    padding: 20px;
}

.dashboard-item {
    margin: 5px;

    .text {
        text-align: left;
        font-size: 14px;
        margin: 0;
        text-indent: 10px;
    }

    .number {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        text-indent: 10px;
        color: #ff5b57;
    }
}

.circle-icon {
    color: gray;
    border: 5px solid white;
    border-radius: 50%;
    padding: 3px;
    margin-right: 10px;
    outline: 1px solid gray;
    float: left;
}

.charts {
    width: 100%;
    height: 400px;
}
</style>