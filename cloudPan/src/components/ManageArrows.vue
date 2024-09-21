<template>
    <div>
        <!-- 触发按钮 -->
        <el-button :type="type" :icon="icon" @click="expandButton">{{ text }}</el-button>

        <!-- 弹出的展示栏 (Dialog) -->
        <el-dialog title="箭头数据管理" v-model="dialogVisible" width="50%" :modal="true" :center="true" :lock-scroll="false"
            append-to-body>

            <!-- 搜索框和按钮 -->
            <div class="search-container">
                <el-input v-model="searchQuery" placeholder="请输入名称搜索" clearable />
                <el-button type="primary" @click="addArrowsData">添加</el-button>
            </div>

            <!-- 表格数据 -->
            <el-table :data="filteredTableData" style="width: 100%; margin-bottom: 20px;">
                <el-table-column prop="arrowName" label="名称" />
                <el-table-column prop="createUser" label="创建者" />
                <el-table-column prop="createTime" label="创建日期" />
                <el-table-column prop="updateTime" label="最近修改">
                    <template #default="scope">
                        <span>{{ scope.row.updateTime ? scope.row.updateTime : '暂无修改' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="exist" label="是否启用">
                    <template #default="scope">
                        <span>{{ scope.row.exist ? '是' : '否' }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize"
                :current-page="currentPage" @current-change="handlePageChange"
                style="text-align: right; margin-top: 10px;">
            </el-pagination>

            <!-- Dialog 的 footer -->
            <template #footer>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { Edit } from '@element-plus/icons-vue'

// 接收父组件传入的参数
const props = defineProps({
    type: {
        type: String,
        default: 'primary',
    },
    icon: {
        type: Object,
        default: () => Edit,
    },
    text: {
        type: String,
        default: '编辑箭头',
    },
})

const { proxy } = getCurrentInstance()

const api = {
    getPageData: '/manageArrows/getPageData',
    addArrowsData: '/manageArrows/addArrowsData',
    updateArrowsData: '/manageArrows/updateArrowsData'
}

const expandButton = async () => {
    await getPageData()
    dialogVisible.value = true
}

// 控制 Dialog 显示/隐藏
const dialogVisible = ref(false)

// 表格数据
const tableData = ref([])

// 分页参数
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 搜索框输入的内容
const searchQuery = ref('')

// 获取当前页数据
const getPageData = async () => {
    const result = await proxy.Request({
        url: api.getPageData,
        showLoading: true,
        params: {
            pageNo: currentPage.value,
            pageSize: pageSize.value
        }
    })
    tableData.value = result.data.list
    total.value = result.data.totalCount
}

// 添加箭头数据
const addArrowsData = async () => {
    const result = await proxy.Request({
        url: api.addArrowsData,
        showLoading: true,
        params: { arrowName: "钱" }
    })
    console.log('addArrowsData ------> ', result);
}

// 更新箭头数据
const updateArrowsData = async () => {
    const result = await proxy.Request({
        url: api.updateArrowsData,
        showLoading: true,
        params: {}
    })
    console.log('updateArrowsData ------> ', result);
}

// 监听页码变化
const handlePageChange = (page) => {
    currentPage.value = page
    getPageData()
}

// 计算当前页展示的数据
const filteredTableData = computed(() => {
    if (searchQuery.value) {
        return tableData.value.filter(item =>
            item.arrowName.includes(searchQuery.value)
        )
    }
    return tableData.value
})
</script>
<style scoped>
.search-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.search-container .el-input {
    width: 150px;
    margin-right: 10px;
}
</style>
