<template>
    <div class="container">
        <div class="select-container">
            <el-select v-model="value" filterable placeholder="Select" class="select-box">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div class="chart-container">
            <div id="main" ref="main" class="main"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const main = ref(null)
const categories = [
    { name: '级别1' },
    { name: '级别2' },
    { name: '级别3' },
    { name: '级别4' }
]
let currentNode = null

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

const value = ref('')
const options = [
    {
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    }
]

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
    gap: 10px;
    /* Space between select box and chart */
    padding: 10px;
    /* Space around the container */
    height: 100vh;
    box-sizing: border-box;
}

.select-container {
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
