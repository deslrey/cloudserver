<template>
    <div>
        <!-- 触发按钮 -->
        <el-button :type="type" :icon="icon" @click="expandButton">{{ text }}</el-button>

        <!-- 弹出的展示栏 (Dialog) -->
        <el-dialog title="箭头数据管理" v-model="dialogVisible" width="50%" :modal="true" :center="true" :lock-scroll="false"
            append-to-body>
            <el-button type="primary" @click="addArrowsData">添加</el-button>

            <!-- 表格数据 -->
            <el-table :data="currentTableData" style="width: 100%; margin-bottom: 20px;">
                <el-table-column prop="arrowName" label="名称" />
                <el-table-column prop="createUser" label="创建者" />
                <el-table-column prop="createTime" label="创建日期" />
                <el-table-column prop="updateTime" label="最近修改" />
                <el-table-column prop="exist" label="是否启用" />
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
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { Edit } from '@element-plus/icons-vue'

// 接收父组件传入的参数
const props = defineProps({
    type: {
        type: String,
        default: 'primary',
    },
    icon: {
        type: Object,
        default: () => Edit, // 默认图标为 Edit
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
    await getPageData()  // 等待数据加载完成
    dialogVisible.value = true
}


// 控制 Dialog 显示/隐藏
const dialogVisible = ref(false)

// 表格数据
const tableData = ref([])

// 分页参数
const total = ref(0)          // 数据总条数
const pageSize = ref(10)      // 每页显示的数据条数
const currentPage = ref(1)    // 当前页

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

const addArrowsData = async () => {

    const result = await proxy.Request({
        url: api.addArrowsData,
        showLoading: true,
        params: { arrowName: "钱" }
    })

    console.log('addArrowsData ------> ', result);
}

const updateArrowsData = async () => {

    const result = await proxy.Request({
        url: api.updateArrowsData,
        showLoading: true,
        params: {

        }
    })

    console.log('updateArrowsData ------> ', result);

}

// 监听页码变化
const handlePageChange = (page) => {
    currentPage.value = page
    getPageData()
}

// 计算当前页展示的数据
const currentTableData = computed(() => {
    return tableData.value
})
</script>

<style scoped>
/* 增加分页与表格底部的间距，确保分页正常显示 */
.el-pagination {
    margin-top: 10px;
}
</style>
