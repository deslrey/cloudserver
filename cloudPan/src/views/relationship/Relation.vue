<template>
    <div class="container">

        <div class="form-container">
            <el-select v-model="optionValue" filterable placeholder="选择班级" class="select-box" allow-create clearable>
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
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

        <!-- 人物节点侧边栏 -->
        <el-drawer v-model="isSidebarVisible" direction="rtl" size="35%" :wrapper-closable="false" @close="handleClose"
            :with-header="false">
            <h2 class="node-sidebar-title">节点信息</h2>
            <ul class="sidebar-list">
                <li v-for="(item, index) in items" :key="index" @mouseover="hoverIndex = index"
                    @mouseleave="hoverIndex = null" class="sidebar-item">
                    <div class="item-row">
                        <!-- 数据标题 -->
                        <span class="item-title">{{ personSidebarList[index] }} :</span>

                        <!-- 显示数据 -->
                        <span v-if="editIndex !== index" class="item-content">{{ item }}</span>

                        <!-- 编辑模式 -->
                        <el-input v-else v-model="editedValue" size="small" class="edit-input item-content"></el-input>

                        <!-- 按钮组 -->
                        <div class="button-group">
                            <!-- 编辑按钮 -->
                            <el-button v-if="hoverIndex === index && editIndex !== index"
                                @click="startEditing(index, item)" type="primary" size="small" class="edit-btn">
                                编辑
                            </el-button>

                            <!-- 确认和取消按钮 -->
                            <div v-if="editIndex === index" class="action-btns">
                                <el-button @click="confirmEdit(index)" type="primary" size="small">
                                    确认
                                </el-button>
                                <el-button @click="cancelEdit" type="default" size="small">
                                    取消
                                </el-button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- 底部按钮区域 -->
            <div class="footer-buttons">
                <el-button @click="handleCancel" type="default" size="large">取消</el-button>
                <el-button @click="handleConfirm" type="primary" size="large">确认</el-button>
            </div>
        </el-drawer>



    </div>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

import * as echarts from 'echarts'

const api = {
    getOptions: '/groups/getOptions',
    getGroupRela: '/relationships/getGroupRela',
    getAllData: '/groupMembers/getAllData',
    updateNodeData: '/relationships/updateNodeData',
}
const { proxy } = getCurrentInstance();
const main = ref(null)
const optionValue = ref(null)
const searchName = ref('')
const idCard = ref('')
const options = ref([])
const graphData = ref([])
const linksData = ref([])
const noData = ref(true)
const vagueSearch = ref(false)

const changeSidebarData = ref(false)

const nodeColor = ref('#FF0000')
const nodeForm = ref({
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

// 保存初始状态
const initialNodeData = {
    id: null,
    groupId: null,
    nodeType: "",
    role: null,
    name: "",
    age: null,
    gender: "",
    birthplace: "",
    idCard: "",
    description: "",
    exist: true
};

const isSidebarVisible = ref(false); // 控制侧边栏显示状态
const hoverIndex = ref(null); // 悬停的索引
const editIndex = ref(null); // 当前编辑的索引
const editedValue = ref(''); // 当前编辑的值

const personSidebarList = ref(['名称', '性别', '年龄', '出生地', '身份证号', '描述'])


// 显示的值列表
const items = computed(() => [
    nodeForm.value.name,
    nodeForm.value.gender,
    nodeForm.value.age,
    nodeForm.value.birthplace,
    nodeForm.value.idCard,
    nodeForm.value.description
])


// 取消操作：重置 nodeForm 为初始状态
const handleCancel = () => {
    handleClose();
};

// 确认操作
const handleConfirm = async () => {
    if (!changeSidebarData.value) {
        //  如果节点信息未编辑,点击确认之后不会提请求,直接返回
        handleClose()
        return
    }

    // 节点信息存在编辑过
    const groupIdSidebar = nodeForm.value.groupId
    const itemArrays = items.value
    nodeForm.value.name = itemArrays[0]
    nodeForm.value.gender = itemArrays[1]
    nodeForm.value.age = itemArrays[2]
    nodeForm.value.birthplace = itemArrays[3]
    nodeForm.value.idCard = itemArrays[4]
    nodeForm.value.description = itemArrays[5]

    // console.log('nodeForm ------> ', nodeForm.value);

    const result = await proxy.Request({
        url: api.updateNodeData,
        showLoading: true,
        params: nodeForm.value
    })

    if (result.code !== 200) {
        proxy.Message.error('节点信息更新失败,请重试')
        handleClose()
        return
    }
    proxy.Message.success('节点信息更新成功')
    handleClose()
    // 重新加载节点关系数据
    nodeDataMap.clear()
    getAllData(groupIdSidebar)

};

// 关闭侧边栏
const handleClose = () => {
    isSidebarVisible.value = false;
    // 清空编辑状态
    editIndex.value = null;
    editedValue.value = '';
    changeSidebarData.value = false
    // 重置 nodeForm 为初始状态
    Object.assign(nodeForm.value, initialNodeData);
};


// 开始编辑
const startEditing = (index, value) => {
    editIndex.value = index;
    editedValue.value = value;
};

// 确认编辑
const confirmEdit = (index) => {
    items.value[index] = editedValue.value
    editIndex.value = null
    changeSidebarData.value = true
};

// 取消编辑
const cancelEdit = () => {
    editIndex.value = null;
    editedValue.value = '';
    changeSidebarData.value = false
};

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
    if (!optionValue.value) {
        proxy.Message.warning('请选择一个选项')
        return
    }
    getAllData(optionValue.value)

    console.log('节点 ------> ', nodeDataMap);


    getGroupRela(optionValue.value)

}

const categories = [
    { name: '人' },
    { name: '物' }
]

const handleChartClick = (params) => {
    const data = params.data
    const dataType = params.dataType

    // console.log("节点数据 ------> ", data);  // Add this line to check if the event triggers

    if (dataType === 'node') {
        if (!nodeDataMap.has(data.id)) {
            proxy.Message.error("当前查看节点数据存在异常");
            return
        }
        let node = nodeDataMap.get(data.id);

        // console.log('node ------> ', node);
        Object.assign(nodeForm.value, node)
        isSidebarVisible.value = true
    } else if (dataType === 'edge') {
        proxy.Message.success(`${data.name}`)
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
                ...person, groupId: groupId
            })
        }
    })

    entityList.forEach(entity => {
        let id = `${entity.id}-${entity.nodeType}`
        if (!nodeDataMap.has(id)) {
            nodeDataMap.set(id, {
                ...entity, groupId: groupId
            })
        }
    })

    // console.log('map ------> ', nodeDataMap)

}


// 公共处理函数
const processGroupRelaData = async (groupId, isVagueSearch = true) => {
    const result = await getGroupRelaDate(groupId);
    if (!result) {
        noData.value = true;
        return;
    }

    let nodes = [];
    let links = [];
    let nodeMap = new Map();

    result.forEach(item => {
        const startNodeId = `${item.startId}-${item.startType}`;
        const endNodeId = `${item.endId}-${item.endType}`;

        const startNodeBool = startNodeId.includes('person');
        const endNodeBool = endNodeId.includes('person');

        const startNodeIdMap = startNodeBool ? nodeDataMap.get(startNodeId) : null;
        const endNodeIdMap = endNodeBool ? nodeDataMap.get(endNodeId) : null;

        // 检查 searchName 和 idCard 是否为空
        const hasValidSearchName = searchName.value && searchName.value.trim() !== '';
        const hasValidIdCard = idCard.value && idCard.value.trim() !== '';

        // 模糊或精准匹配，添加对空值的检查
        const matchStart = isVagueSearch
            ? (hasValidSearchName && item.startName.includes(searchName.value)) ||
            (startNodeBool && hasValidIdCard && String(startNodeIdMap?.idCard).includes(idCard.value))
            : (hasValidSearchName && item.startName === searchName.value) &&
            (startNodeBool && hasValidIdCard && startNodeIdMap?.idCard === idCard.value);

        const matchEnd = isVagueSearch
            ? (hasValidSearchName && item.endName.includes(searchName.value)) ||
            (endNodeBool && hasValidIdCard && String(endNodeIdMap?.idCard).includes(idCard.value))
            : (hasValidSearchName && item.endName === searchName.value) &&
            (endNodeBool && hasValidIdCard && endNodeIdMap?.idCard === idCard.value);

        let highlightNode = false;
        let highlightArrow = false;

        if (hasValidSearchName) {
            highlightNode = matchStart;
            highlightArrow = matchStart || matchEnd;
        }

        // 添加或更新起始节点
        if (!nodeMap.has(startNodeId)) {
            nodeMap.set(startNodeId, {
                id: startNodeId,
                relationId: item.relationId,
                name: item.startName,
                des: `${item.startName}(${item.startType})`,
                symbolSize: 50,
                category: startNodeBool ? 0 : 1,
                itemStyle: {
                    color: matchStart ? nodeColor : null
                }
            });
        }

        if (hasValidSearchName) {
            highlightNode = matchEnd;
            highlightArrow = highlightArrow || highlightNode;
        }

        // 添加或更新结束节点
        if (!nodeMap.has(endNodeId)) {
            nodeMap.set(endNodeId, {
                id: endNodeId,
                relationId: item.relationId,
                name: item.endName,
                des: `${item.endName}(${item.endType})`,
                symbolSize: 50,
                category: endNodeBool ? 0 : 1,
                itemStyle: {
                    color: matchEnd ? nodeColor : null
                }
            });
        }

        // 添加链接
        links.push({
            source: startNodeId,
            target: endNodeId,
            name: item.information,
            des: item.information,
            symbol: item.information.includes('好友') ? ['none', 'arrow'] : ['none', 'none'],
            lineStyle: {
                color: highlightArrow ? nodeColor : '#4b565b'
            }
        });
    });

    // 将 Map 转换为数组
    nodes = Array.from(nodeMap.values());

    graphData.value = nodes;
    linksData.value = links;

    noData.value = nodes.length === 0 && links.length === 0;

    nextTick(() => {
        if (!myChart) {
            myChart = echarts.init(main.value);
        }
        updateChart();
    });

};

// 模糊查找
const getVagueGroupRela = async (groupId) => {
    await processGroupRelaData(groupId, true); // 调用公共函数，传入模糊查找标志
};

// 精准查找
const getPrecisionGroupRela = async (groupId) => {
    await processGroupRelaData(groupId, false); // 调用公共函数，传入精准查找标志
};

const getGroupRelaDate = (groupId) => {
    // 处理 Promise，获取结果
    return proxy.Request({
        url: api.getGroupRela,
        showLoading: true,
        params: { groupId: groupId }
    }).then(result => {

        // 检查数据是否存在
        if (!result || !result.data) {
            noData.value = true;
            return null;
        }

        return result.data; // 返回数据
    }).catch(error => {
        console.error('请求失败：', error);
        noData.value = true; // 请求失败时的处理
        return null;
    });
};


const getGroupRela = (groupId) => {

    if (vagueSearch.value) {
        getVagueGroupRela(groupId)
    } else {
        getPrecisionGroupRela(groupId)
    }

}


const updateChart = () => {
    if (!myChart || noData.value) return

    const option = {
        title: {
            text: `${optionValue.value.name} - 关系图`
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
/* 每行保持水平布局，避免挤压 */
.sidebar-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.item-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 32px;
    /* 固定行高，防止编辑时撑开 */
    transition: height 0.3s;
    /* 增加行高过渡效果 */
    overflow: hidden;
    /* 防止内容溢出 */
}

/* 数据标题样式 */
.item-title {
    font-weight: bold;
    white-space: nowrap;
    font-size: 14px;
    /* 设定字体大小 */
}

/* 按钮组样式优化 */
.button-group {
    display: flex;
    align-items: center;
    margin-left: auto;
}

/* 编辑按钮样式 */
.edit-btn {
    font-size: 12px;
    color: #fff;
    background-color: #409eff;
    border-radius: 4px;
    border: 1px solid #409eff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
    text-align: center;
    height: 32px;
    /* 固定按钮高度 */
    box-sizing: border-box;
    line-height: 1;
    /* 确保文本垂直居中 */
}

/* 鼠标悬停时的效果 */
.edit-btn:hover {
    background-color: #66b1ff;
}

/* 确认和取消按钮的样式 */
.action-btns {
    display: flex;
    gap: 5px;
}

/* 输入框样式 */
.edit-input {
    flex: 1;
    /* 输入框占据剩余空间 */
    min-width: 0;
    /* 防止输入框过大 */
    height: 32px;
    /* 固定输入框高度，与按钮一致 */
    margin-right: 5px;
    /* 控制与按钮的间距 */
    box-sizing: border-box;
    border: none;
    /* 去掉默认边框 */
    outline: none;
    /* 去掉输入聚焦时的外边框 */
    box-shadow: 0 0 0 1px rgba(220, 223, 230, 0.8);
    /* 使用淡色阴影模拟边框效果 */
    border-radius: 4px;
    /* 使输入框边角与按钮一致 */
    transition: all 0.3s;
    /* 添加过渡效果 */
    font-size: 14px;
    /* 设定字体大小 */
    line-height: 32px;
    /* 确保文本垂直居中 */
}

/* 强制去除 Element Plus 输入框外层边框 */
.el-input__inner {
    border: none !important;
    /* 去掉输入框的默认外边框 */
    box-shadow: none !important;
    /* 去掉外边框阴影效果 */
    padding: 4px 8px !important;
    /* 确保内边距一致 */
    font-size: 14px;
    /* 设定字体大小 */
}

/* 数据内容样式 */
.item-content {
    white-space: nowrap;
    transition: opacity 0.3s;
    /* 添加过渡效果 */
    font-size: 14px;
    /* 设定字体大小 */
}

/* 标题样式 */
.node-sidebar-title {
    text-align: center;
    padding: 0;
    /* 移除内部边距 */
    margin: 0;
    /* 移除外部边距 */
    font-size: 30px;
    /* 调整字体大小，适配布局 */
    line-height: 1.5;
    /* 调整行高 */
}

/* Vue SFC 中的 scoped 样式需要使用深度选择器 >>> 或 ::v-deep */
:deep(.el-drawer__header) {
    margin-bottom: 0 !important;
    /* 强制去掉默认的 margin */
}

.footer-buttons {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    gap: 20px;
    /* 按钮之间的间距 */
    position: absolute;
    bottom: 20px;
    /* 距离底部的距离 */
    left: 50%;
    transform: translateX(-50%);
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
