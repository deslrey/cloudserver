<template>
    <div class="container">
        <div class="form-container">
            <el-select v-model="value" filterable placeholder="选择班级" class="select-box" allow-create clearable>
                <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name" />
            </el-select>
            <el-input v-model="name" placeholder="请输入姓名" class="input-box" />
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
        <div class="chart-container">
            <div id="main" ref="main" class="main"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const api = {
    getOptions: '/groups/getOptions'
}

const { proxy } = getCurrentInstance();
const main = ref(null)
const value = ref('')
const name = ref('')
const options = ref([])

const getOptions = async () => {
    const result = await proxy.Request({
        url: api.getOptions,
        showLoading: true,
        params: { count: 100 }
    })
    if (!result) {
        return
    }
    options.value = result.data

}
getOptions()

const handleSubmit = () => {
    if (!value.value) {
        proxy.Message.warning('请选择一个选项')
        return
    }
    console.log('选择器的值:', value.value)
    console.log('输入的姓名:', name.value)
}

const categories = [
    { name: '级别1' },
    { name: '级别2' },
    { name: '级别3' },
    { name: '级别4' }
]
const graphData = ref([
    { name: 'node01', des: 'nodedes01', symbolSize: 70, category: 0, itemStyle: { color: '#0000ff' } },
    { name: 'node02', des: 'nodedes02', symbolSize: 50, category: 1 },
    { name: 'node03', des: 'nodedes3', symbolSize: 50, category: 1 },
    { name: 'node04', des: 'nodedes04', symbolSize: 50, category: 1, itemStyle: { color: '#2EA7C2FF' } },
    { name: 'node05', des: 'nodedes05', symbolSize: 50, category: 3 },
    { name: 'node06', des: 'nodedes04', symbolSize: 50, category: 2 },
])
const linksData = ref([
    { source: 'node01', target: 'node02', name: 'link01', des: 'link01des' },
    { source: 'node01', target: 'node03', name: 'link02', des: 'link02des' },
    { source: 'node01', target: 'node04', name: 'link03', des: 'link03des' },
    { source: 'node01', target: 'node05', name: 'link04', des: 'link05des' },
    { source: 'node01', target: 'node06', name: 'link06', des: 'link05des', symbol: ['circle', 'arrow'], lineStyle: { color: '#66FFCC' } }
])

let myChart = null;

onMounted(() => {
    myChart = echarts.init(main.value)
    const option = {
        title: {
            text: 'ECharts 关系图'
        },
        tooltip: {
            formatter: function (x) {
                return x.data.des
            }
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: [{
            data: categories.map(a => a.name)
        }],
        series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 40,
            focusNodeAdjacency: true,
            legendHoverLink: false,
            roam: true,
            edgeSymbolSize: [2, 10],
            edgeLabel: {
                normal: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            force: {
                repulsion: 2500,
                edgeLength: [10, 50]
            },
            draggable: true,
            lineStyle: {
                normal: {
                    width: 2,
                    color: '#4b565b',
                }
            },
            edgeLabel: {
                normal: {
                    show: true,
                    formatter: function (x) {
                        return x.data.name
                    }
                }
            },
            label: {
                normal: {
                    show: true,
                    textStyle: {}
                }
            },
            data: graphData.value,
            links: linksData.value,
            categories: categories
        }]
    }
    myChart.setOption(option)

    // 监听窗口大小变化
    window.addEventListener('resize', resizeChart)

    // 点击事件
    myChart.on('click', function (params) {
        alert(params.name)
    })
})

// 在组件销毁前移除事件监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
})

function resizeChart() {
    if (myChart) {
        myChart.resize()
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* Space between form and chart */
    padding: 20px;
    /* Space around the container */
    height: 100vh;
    box-sizing: border-box;
}

.form-container {
    display: flex;
    flex-direction: row;
    /* Horizontal layout */
    gap: 10px;
    /* Space between select box, input, and button */
    align-items: center;
}

.select-box,
.input-box {
    width: 240px;
}

.chart-container {
    flex: 1;
    width: 100%;
    height: 100%;
    /* Ensure it takes the full height of the container */
}

.main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background-color: skyblue;
}
</style>
