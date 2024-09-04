<template>
    <div class="container">

        <div class="form-container">
            <el-select v-model="value" filterable placeholder="选择班级" class="select-box" allow-create clearable>
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item" />
            </el-select>
            <el-input v-model="searchName" placeholder="请输入查询名称" class="input-box" clearable />
            <el-input v-model="idCard" placeholder="请输入身份证号" class="input-box" clearable />
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <span class="demonstration">高亮节点颜色</span>
            <el-color-picker v-model="nodeColor" />
            <el-switch v-model="vagueSearch" class="mb-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="模糊查找"
                inactive-text="精准查找" />
        </div>

        <div class="chart-container">
            <div v-if="noData" class="no-data-container">
                <img src="../../assets/img/download.webp" alt="暂无数据" class="no-data-image">
            </div>
            <div v-else id="main" ref="main" class="main"></div>
        </div>
        <!-- 添加侧边栏 -->
        <el-drawer title="节点信息" v-model="sidebarVisible" size="30%" direction="rtl" :with-header="false">
            <div class="node-info">
                <div v-for="(item, index) in nodeInfo" :key="index" class="info-item"
                    :class="{ 'highlight': hoverIndex === index }" @mouseenter="hoverIndex = index"
                    @mouseleave="hoverIndex = null">
                    <div class="item-content">
                        <span class="item-label">{{ item.label }}: </span>
                        <!-- 显示原值或输入框 -->
                        <span v-if="!item.editMode" class="item-value">{{ item.value }}</span>
                        <input v-if="item.editMode" type="text" v-model="item.tempValue" class="edit-input" />
                    </div>
                    <!-- 编辑按钮 -->
                    <span v-if="!item.editMode && editingIndex === null" class="edit-btn"
                        @click="() => editItem(index)">
                        编辑
                    </span>
                    <!-- 编辑状态下的操作按钮 -->
                    <div v-if="item.editMode" class="op-buttons">
                        <span class="confirm-btn" @click="() => confirmEdit(index)">确认</span>
                        <span class="cancel-btn" @click="() => cancelEdit(index)">取消</span>
                    </div>
                </div>
            </div>
            <!-- 自定义底部 -->
            <template #footer>
                <div style="display: flex; justify-content: center; padding: 10px;">
                    <el-button @click="cancel" style="margin-right: 10px;">取消</el-button>
                    <el-button type="primary" @click="confirm">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>


<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount, nextTick } from 'vue'

import * as echarts from 'echarts'

const api = {
    getOptions: '/groups/getOptions',
    getGroupRela: '/relationships/getGroupRela',
    getAllData: '/groupMembers/getAllData',
    updateNodeData: '/groupMembers/updateNodeData'
}
const { proxy } = getCurrentInstance();
let main = ref(null)
let value = ref(null)
let searchName = ref('')
let idCard = ref('')
let options = ref([])
let graphData = ref([])
let linksData = ref([])
let noData = ref(true)
let vagueSearch = ref(false)

const sidebarVisible = ref(false) // 控制侧边栏显示
// 当前悬停的行索引
const hoverIndex = ref(null)

// 当前编辑的行索引
const editingIndex = ref(null)

const nodeColor = ref('#FF0000')
let nodeForm = ref({
    id: null,
    groupId: null,
    nodeType: '',
    role: '',
    name: '',
    age: null,
    gender: '',
    birthplace: '',
    idCard: '',
    description: '',
    exist: false
})

const nodeInfo = ref([
    { label: '名称', value: '节点1', tempValue: '', editMode: false },
    { label: '类型', value: '类型A', tempValue: '', editMode: false },
    // 可以添加更多字段...
])

// 编辑功能
const editItem = (index) => {
    if (editingIndex.value !== null) {
        // 如果已有行在编辑状态，取消编辑状态
        cancelEdit(editingIndex.value)
    }
    nodeInfo.value[index].tempValue = nodeInfo.value[index].value
    nodeInfo.value[index].editMode = true
    editingIndex.value = index
}

const cancelEdit = (index) => {
    nodeInfo.value[index].editMode = false
    nodeInfo.value[index].tempValue = ''
    if (editingIndex.value === index) {
        editingIndex.value = null
    }
}

const confirmEdit = (index) => {
    nodeInfo.value[index].value = nodeInfo.value[index].tempValue
    nodeInfo.value[index].editMode = false
    nodeInfo.value[index].tempValue = ''
    if (editingIndex.value === index) {
        editingIndex.value = null
    }
}

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

    getGroupRela(value.value.id)
    getAllData(value.value.id)
}

const categories = [
    { name: '人' },
    { name: '物' }
]

const handleChartClick = (params) => {
    console.log("Node clicked:", params);  // Add this line to check if the event triggers


    const data = params.data

    if (!nodeDataMap.has(data.id)) {
        proxy.Message.error("当前查看节点数据存在异常");
        return
    }

    let node = nodeDataMap.get(data.id);

    Object.assign(nodeForm.value, node);
    if (params.dataType === 'node') {
        // 打开侧边栏
        sidebarVisible.value = true;
        // alert(`节点: ${params.data.name}`)
    } else if (params.dataType === 'edge') {
        alert(`关系线: ${params.data.name}`)
    }
}

let myChart = null
let nodeDataMap = new Map()

const getAllData = async (groupId) => {
    const result = await proxy.Request({
        url: api.getAllData,
        showLoading: true,
        params: { groupId: groupId }
    })

    if (!result || !result.data) {
        return
    }

    const data = result.data
    let personList = data.person
    let entityList = data.entity

    personList.forEach(person => {
        let id = `${person.id}-${person.nodeType}`
        if (!nodeDataMap.has(id)) {
            nodeDataMap.set(id, {
                ...person
            })
        }
    })

    entityList.forEach(entity => {
        let id = `${entity.id}-${entity.nodeType}`
        if (!nodeDataMap.has(id)) {
            nodeDataMap.set(id, {
                ...entity
            })
        }
    })

    console.log('map ------> ', nodeDataMap);

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
        let highlightNode = false
        let highlightArrow = false
        if (searchName.value != '') {
            highlightNode = item.startName.indexOf(searchName.value) == -1 ? false : true
            if (highlightNode) {
                highlightArrow = true
            }
        }

        if (!nodeMap.has(startNodeId)) {
            nodeMap.set(startNodeId, {
                id: startNodeId,
                relationId: item.relationId,
                name: item.startName,
                des: `${item.startName}(${item.startType})`,
                symbolSize: 50,
                category: item.startType === 'person' ? 0 : 1,
                itemStyle: {
                    color: highlightNode ? nodeColor : null
                }
            })
        }
        highlightNode = false
        if (searchName.value != '') {
            highlightNode = item.endName.indexOf(searchName.value) == -1 ? false : true
            if (highlightNode) {
                highlightArrow = true
            }
        }
        if (!nodeMap.has(endNodeId)) {
            nodeMap.set(endNodeId, {
                id: endNodeId,
                relationId: item.relationId,
                name: item.endName,
                des: `${item.endName}(${item.endType})`,
                symbolSize: 50,
                category: item.endType === 'person' ? 0 : 1,
                itemStyle: {
                    color: highlightNode ? nodeColor : null
                }
            })
        }
        links.push({
            source: startNodeId,
            target: endNodeId,
            name: item.information,
            des: item.information,
            lineStyle: { color: '#4b565b' },
            symbol: item.information.includes('好友') ? ['none', 'arrow'] : ['none', 'none'],
            lineStyle: {
                color: highlightArrow ? nodeColor : null
            }
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
                // edgeLength: [10, 50]
                edgeLength: [20, 60]
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
.node-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    /* 数据和按钮分开 */
    align-items: center;
    padding: 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
    /* 平滑的背景色过渡效果 */
}

.info-item.highlight {
    background-color: #f5f5f5;
    /* 高亮显示的背景色 */
}

.item-content {
    display: flex;
    align-items: center;
    gap: 10px;
    /* 数据和编辑按钮之间的间隔 */
}

.item-label {
    font-weight: bold;
}

.item-value {
    margin-right: 20px;
    /* 数据和编辑按钮之间的间隔 */
}

.edit-input {
    border: 1px solid #dcdfe6;
    /* 边框颜色 */
    padding: 5px 10px;
    /* 内边距，调整输入框高度和宽度 */
    border-radius: 4px;
    /* 圆角 */
    font-size: 14px;
    /* 字体大小 */
    outline: none;
    /* 移除点击后的外框 */
    transition: border-color 0.3s, box-shadow 0.3s;
    /* 添加平滑过渡效果 */
}

.edit-input:focus {
    border-color: #409eff;
    /* 聚焦时的边框颜色 */
    box-shadow: 0 0 5px rgba(64, 158, 255, 0.3);
    /* 聚焦时的阴影效果 */
}

.edit-btn,
.confirm-btn,
.cancel-btn {
    cursor: pointer;
    padding: 2px 5px;
    border-radius: 4px;
}

.edit-btn {
    color: #409eff;
    border: 1px solid #409eff;
}

.confirm-btn {
    color: #67c23a;
    border: 1px solid #67c23a;
}

.cancel-btn {
    color: #f56c6c;
    border: 1px solid #f56c6c;
}

.op-buttons {
    display: flex;
    gap: 8px;
}



.node-info p {
    margin: 10px 0;
    line-height: 1.5;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
}

.el-dropdown {
    position: absolute;
    z-index: 1000;
}


.form-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.select-box,
.input-box {
    width: 180px;
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

.show_node_title {
    text-align: center;
}
</style>
