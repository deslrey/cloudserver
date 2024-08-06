<template>
    <div class="container">
        <div class="form-container">
            <el-select v-model="value" filterable placeholder="选择班级" class="select-box" allow-create clearable>
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item" />
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
    getOptions: '/groups/getOptions',
    getGroupRela: '/relationships/getGroupRela'
}

const { proxy } = getCurrentInstance();
const main = ref(null)
const value = ref()
const name = ref('')
const options = ref([])
const graphData = ref([])
const linksData = ref([])

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
    if (!value.value.name) {
        proxy.Message.warning('请选择一个选项')
        return
    }
    console.log('选择器的值:', value.value.id)
    console.log('输入的姓名:', name.value)
    getGroupRela(value.value.id)
}

const getGroupRela = async (groupId) => {
    const result = await proxy.Request({
        url: api.getGroupRela,
        showLoading: true,
        params: { groupId: groupId }
    })

    if (!result || !result.data) {
        return
    }

    // 处理后端返回的数据
    const nodes = []
    const links = []
    const nodeMap = new Map()

    result.data.forEach(item => {
        const startNodeId = `${item.startId}-${item.startType}`
        const endNodeId = `${item.endId}-${item.endType}`

        if (!nodeMap.has(startNodeId)) {
            nodeMap.set(startNodeId, {
                id: startNodeId,
                name: item.startName,
                des: item.startType === 'person' ? `${item.startName}(${item.startType})` : `${item.startName}(${item.endType})`,
                symbolSize: 50,
                category: item.startType === 'person' ? 0 : 1
            })
        }
        if (!nodeMap.has(endNodeId)) {
            nodeMap.set(endNodeId, {
                id: endNodeId,
                name: item.endName,
                des: item.endType === 'person' ? `${item.endName}(${item.endType})` : `${item.endName}(${item.endType})`,
                symbolSize: 50,
                category: item.endType === 'person' ? 0 : 1
            })
        }
        links.push({
            source: startNodeId,
            target: endNodeId,
            name: item.information,
            des: item.information,
            lineStyle: { color: '#4b565b' }
        })
    })

    nodeMap.forEach(node => {
        nodes.push(node)
    })

    graphData.value = nodes
    linksData.value = links

    updateChart()
}

const categories = [
    { name: '人' },
    { name: '物' }
]

let myChart = null

const handleChartClick = (params) => {
    alert(params.name)
}

const updateChart = () => {
    if (!myChart) return

    const option = {
        title: {
            text: `关系图`
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
}

onMounted(() => {
    myChart = echarts.init(main.value)
    updateChart()

    // 监听窗口大小变化
    window.addEventListener('resize', resizeChart)

    // 注册点击事件
    myChart.on('click', handleChartClick)
})

// 在组件销毁前移除事件监听
onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
    if (myChart) {
        myChart.off('click', handleChartClick)
    }
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
