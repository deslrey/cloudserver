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
            <el-switch v-model="switchValue" class="mb-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="编辑节点"
                inactive-text="展示节点信息" />
        </div>

        <div class="chart-container">
            <div v-if="noData" class="no-data-container">
                <img src="../../assets/img/download.webp" alt="暂无数据" class="no-data-image">
            </div>
            <div v-else id="main" ref="main" class="main"></div>
        </div>

        <el-dialog v-model="dialogVisiblePerson" title="编辑人节点信息">
            <el-form :model="nodeForm">
                <el-form-item label="姓名">
                    <el-input v-model="nodeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="nodeForm.age"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="nodeForm.gender"></el-input>
                </el-form-item>
                <el-form-item label="出生地">
                    <el-input v-model="nodeForm.birthplace"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="nodeForm.idCard"></el-input>
                </el-form-item>
                <el-form-item label="描述信息">
                    <el-input v-model="nodeForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisiblePerson = false">取消</el-button>
                <el-button type="primary" @click="saveNode">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog v-model="dialogVisibleEntitie" title="编辑物节点信息">
            <el-form :model="nodeForm">
                <el-form-item label="名称">
                    <el-input v-model="nodeForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述信息">
                    <el-input v-model="nodeForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEntitie = false">取消</el-button>
                <el-button type="primary" @click="saveNode">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog v-model="dialogVisibleShow" title="节点信息">
            <div v-show="nodeForm.nodeType === 'person'">
                <h2>
                    <el-form-item label="姓名">
                        {{ nodeForm.name }}
                    </el-form-item>
                    <el-form-item label="年龄">
                        {{ nodeForm.age }}
                    </el-form-item>
                    <el-form-item label="性别">
                        {{ nodeForm.gender }}
                    </el-form-item>
                    <el-form-item label="出生地">
                        {{ nodeForm.birthplace }}
                    </el-form-item>
                    <el-form-item label="身份证号">
                        {{ nodeForm.idCard }}
                    </el-form-item>
                    <el-form-item label="描述信息">
                        {{ nodeForm.description }}
                    </el-form-item>
                </h2>
            </div>
            <div v-show="nodeForm.nodeType === 'entity'">
                <h2>
                    <el-form-item label="名称">
                        <el-input v-model="nodeForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述信息">
                        <el-input v-model="nodeForm.description"></el-input>
                    </el-form-item>
                </h2>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleShow = false">取消</el-button>
                <el-button type="primary" @click="dialogVisibleShow = !dialogVisibleShow">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
let dialogVisiblePerson = ref(false)
let switchValue = ref(false)
let vagueSearch = ref(false)
let dialogVisibleEntitie = ref(false)
let dialogVisibleShow = ref(false)
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
    console.log('输入的姓名:', searchName.value)
    getGroupRela(value.value.id)
    getAllData(value.value.id)
}


const categories = [
    { name: '人' },
    { name: '物' }
]




const handleChartClick = (params) => {

    const data = params.data

    if (!nodeDataMap.has(data.id)) {
        proxy.Message.error("当前查看节点数据存在异常");
        return
    }

    let node = nodeDataMap.get(data.id);

    Object.assign(nodeForm.value, node);
    if (params.dataType === 'node') {
        if (switchValue.value) {
            if (data.category === 0) {
                dialogVisiblePerson.value = true
            } else {
                dialogVisibleEntitie.value = true
            }
        } else {
            dialogVisibleShow.value = true
        }


    } else if (params.dataType === 'edge') {
        alert(`关系线: ${params.data.name}`)
    }
}

const saveNode = () => {
    console.log('保存节点:', nodeForm.value)
    dialogVisiblePerson.value = false
    dialogVisibleEntitie.value = false

    nodeForm.value.groupId = value.value.id
    updateNodeData(nodeForm.value)
}


const updateNodeData = async (nodeData) => {
    const result = await proxy.Request({
        url: api.updateNodeData,
        showLoading: true,
        params: nodeData
    })
    if (result.code == 200) {
        proxy.Message.success(`${result.message}`);
        nodeDataMap.clear()
        handleSubmit()
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
</style>
