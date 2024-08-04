<template>
    <div>
        <div id="main" ref="main" class="main"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { pa } from 'element-plus/es/locales.mjs';

const main = ref(null)
const showForm = ref(false)
const formData = ref({ name: '', des: '', symbolSize: 40, category: 0 })
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

onMounted(() => {
    const myChart = echarts.init(main.value)
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

    // 点击事件
    myChart.on('click', function (params) {
        alert(params.name)
    })
})
</script>

<style scoped>
.main {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    background-color: skyblue;
}

.form-container {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

form {
    display: flex;
    flex-direction: column;
}

form div {
    margin-bottom: 10px;
}

label {
    margin-right: 10px;
}

button {
    margin-top: 10px;
}
</style>