<template>
    <div>
        <el-button :type="type" :icon="icon" @click="expandButton">{{ text }}</el-button>

        <el-dialog title="箭头数据管理" v-model="dialogVisible" width="50%" :modal="true" center :lock-scroll="false"
            append-to-body @update:modelValue="handleDialogClosed">

            <!-- 搜索框和按钮 -->
            <div class="search-container">
                <el-input v-model="searchQuery" placeholder="请输入名称搜索" clearable />
                <el-button type="primary" @click="addDataDialogVisible = true">添加</el-button>
            </div>

            <!-- 表格数据 -->
            <el-table :data="filteredTableData" fit style="width: 100%; margin-bottom: 10px;">
                <el-table-column type="index" label="序号" width="124vh" />
                <el-table-column prop="arrowName" label="名称" />
                <el-table-column prop="createUser" label="创建者" sortable />
                <el-table-column prop="createTime" label="创建日期" sortable />
                <el-table-column prop="updateTime" label="最近修改" sortable>
                    <template #default="scope">
                        <span>{{ scope.row.updateTime ? scope.row.updateTime : '暂无修改' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="exist" label="是否启用" sortable>
                    <template #default="scope">
                        <span>{{ scope.row.exist ? '是' : '否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" @click="editRow(scope.row)" :icon="Edit" size="small" />
                        <el-button type="danger" @click="deleteRow(scope.row)" :icon="Delete" size="small" />
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize"
                :current-page="currentPage" @current-change="handlePageChange"
                style="text-align: right; margin-top: 10px;" />

            <template #footer>
                <el-button @click="closeDialog">关闭</el-button>
            </template>
        </el-dialog>


        <!-- 编辑表单的对话框 -->
        <el-dialog title="编辑箭头数据" v-model="editDialogVisible" width="30%" center :lock-scroll="false">
            <el-form :model="editForm">
                <el-form-item label="箭头名称" :label-width="formLabelWidth">
                    <el-input v-model="editForm.arrowName" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEdit">保存</el-button>
            </template>
        </el-dialog>

        <!-- 添加箭头数据对话框 -->
        <el-dialog title="添加数据" v-model="addDataDialogVisible" width="30%" center :lock-scroll="false"
            @update:modelValue="addDataDialogClosed">
            <el-form :model="editForm">
                <el-form-item label="箭头名称" :label-width="formLabelWidth">
                    <el-input v-model="addDataArrowsName" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addDataDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addArrowsData">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

// 定义 emit
const emit = defineEmits(['dialogClosed'])

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
    updateArrowsData: '/manageArrows/updateArrowsData',
    deleteArrowsData: '/manageArrows/deleteArrowsData',
}

const expandButton = async () => {
    await getPageData()
    dialogVisible.value = true
}

const dialogVisible = ref(false)
const editDialogVisible = ref(false)
const addDataDialogVisible = ref(false)
const tableData = ref([])
const total = ref(0)
const pageSize = ref(8)
const currentPage = ref(1)
const searchQuery = ref('')
const addDataArrowsName = ref('')
const editForm = ref({})
const formLabelWidth = '120px'

// 监听 dialog 关闭
const handleDialogClosed = (value) => {
    if (!value) {
        // console.log('对话框已关闭')
        emit('dialogClosed') // 触发事件
    }
}
const addDataDialogClosed = () => {
    addDataArrowsName.value = ''
}

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

    // addDataDialogVisible.value = true

    if(addDataArrowsName.value === ''){
        proxy.Message.warning('添加的数据不能为空,请重新输入')
        return
    }

    const result = await proxy.Request({
        url: api.addArrowsData,
        showLoading: true,
        params: { arrowName: addDataArrowsName.value }
    })
    // 清除添加的数据
    addDataArrowsName.value = ''
    addDataDialogVisible.value = false
    // 添加完成重新获取数据
    getPageData()
}

const editRow = (row) => {
    editForm.value = { ...row }
    editDialogVisible.value = true
}

const saveEdit = async () => {
    const result = await proxy.Request({
        url: api.updateArrowsData,
        showLoading: true,
        params: {
            id: editForm.value.id,
            arrowName: editForm.value.arrowName,
            exist: editForm.value.exist
        }
    })
    console.log('result -----> ', result);

    if (result.code === 200) {
        proxy.Message.success(result.message)
        getPageData()
        editDialogVisible.value = false
    }
    proxy.Message.error(result.message)
}

const deleteRow = (row) => {
    proxy.Confirm(
        `是否关闭当前箭头数据: 【${row.arrowName}】`,
        async () => {
            let result = await proxy.Request({
                url: api.deleteArrowsData,
                showLoading: true,
                params: {
                    id: row.id,
                    arrowName: row.arrowName
                }
            })

            if (!result) {
                return
            }
            if (result.code === 200) {
                proxy.Message.success(result.message)
                getPageData()
            }
            proxy.Message.error(result.message)
        }
    )
}

const handlePageChange = (page) => {
    currentPage.value = page
    getPageData()
}

const closeDialog = () => {
    dialogVisible.value = false
}

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
.search-container .el-input {
    width: 200px;
}

.search-container .el-button {
    margin-left: 10px;
}
</style>
