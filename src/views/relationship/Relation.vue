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
            <div v-if="noData" class="no-data-container">
                <img src="../../assets/img/download.webp" alt="暂无数据" class="no-data-image">
            </div>
            <div v-else id="main" ref="main" class="main"></div>
        </div>

        <el-dialog v-model="dialogVisiblePerson" title="编辑人节点信息">
            <el-form :model="nodeForm">
                <el-form-item label="节点名称">
                    <el-input v-model="nodeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="节点类型">
                    <el-input v-model="nodeForm.type"></el-input>
                </el-form-item>
                <el-form-item label="节点信息">
                    <el-input v-model="nodeForm.information"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisiblePerson = false">取消</el-button>
                <el-button type="primary" @click="saveNode">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog v-model="dialogVisibleEntitie" title="编辑物节点信息">
            <el-form :model="nodeForm">
                <el-form-item label="节点名称">
                    <el-input v-model="nodeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="节点类型">
                    <el-input v-model="nodeForm.type"></el-input>
                </el-form-item>
                <el-form-item label="节点信息">
                    <el-input v-model="nodeForm.information"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNode">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const api = {
    getOptions: '/groups/getOptions',
    getGroupRela: '/relationships/getGroupRela'
}

const { proxy } = getCurrentInstance();
const main = ref(null)
const value = ref(null)
const name = ref('')
const options = ref([])
const graphData = ref([])
const linksData = ref([])
const noData = ref(true)
const dialogVisiblePerson = ref(false)
const dialogVisibleEntitie = ref(false)
const nodeForm = ref({
    id: null,
    name: '',
    type: '',
    information: ''
})

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
        noData.value = true
        return
    }

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
            lineStyle: { color: '#4b565b' },
            symbol: item.information.includes('好友') ? ['none', 'arrow'] : ['none', 'none']
        })
    })

    nodeMap.forEach(node => {
        nodes.push(node)
    })

    graphData.value = nodes
    linksData.value = links

    noData.value = nodes.length === 0 && links.length === 0

    nextTick(() => {
        if (!myChart) {
            myChart = echarts.init(main.value)
        }
        updateChart()
    })
}

const categories = [
    { name: '人' },
    { name: '物' }
]

let myChart = null

const updateChart = () => {
    if (!myChart || noData.value) return

    const option = {
        title: {
            text: `${value.value.name} - 关系图`
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

    // Bind the click event here
    myChart.off('click') // Remove previous event listeners to avoid multiple bindings
    myChart.on('click', handleChartClick)
}

const handleChartClick = (params) => {
    console.log('点击事件触发', params); // Add this log to check if the click event is triggered
    if (params.dataType === 'node') {
        if (params.data.category === 0) {
            dialogVisiblePerson.value = true
            alert('我是人节点')
        } else if (params.data.category === 1) {
            alert('我是物节点')
        }

        nodeForm.value.id = params.data.id
        nodeForm.value.name = params.data.name
        nodeForm.value.type = params.data.category === 0 ? '人' : '物'
        nodeForm.value.information = params.data.des
        console.log('nodeForm ------> ', nodeForm);

        dialogVisibleEntitie.value = true
    } else if (params.dataType === 'edge') {
        alert(`关系: ${params.data.name}`)
    }
}

const saveNode = () => {
    console.log('保存节点:', nodeForm.value)
    dialogVisible.value = false
    // 保存节点的逻辑，例如调用后端接口保存数据
}

onMounted(() => {
    nextTick(() => {
        if (main.value) {
            myChart = echarts.init(main.value)
            updateChart()

            window.addEventListener('resize', resizeChart)
        }
    });
})

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
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
}

.form-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
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
}

.main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #f9f9f9;
    /* 修改背景颜色 */
}

.no-data-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f0f0f0;
}

.no-data-image {
    max-width: 100%;
    max-height: 100%;
}
</style>
