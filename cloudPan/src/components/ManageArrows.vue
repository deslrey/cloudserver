<template>
    <div>
        <el-button :type="type" :icon="icon" @click="expandButton">{{ text }}</el-button>

        <el-dialog title="箭头数据管理" v-model="dialogVisible" width="50%" :modal="true" :center="true" :lock-scroll="false"
            append-to-body>

            <!-- 搜索框和按钮 -->
            <div class="search-container">
                <el-input v-model="searchQuery" placeholder="请输入名称搜索" clearable />
                <el-button type="primary" @click="addArrowsData">添加</el-button>
            </div>

            <!-- 表格数据 -->
            <el-table :data="filteredTableData" fit style="width: 100%; margin-bottom: 20px;">
                <el-table-column type="index" label="序号" />

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
                <el-button @click="dialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>


        <!-- 编辑表单的对话框 -->
        <el-dialog title="编辑箭头数据" v-model="editDialogVisible" width="30%" :lock-scroll="false">
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
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

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
const editDialogVisible = ref(false)  // 编辑对话框的显示状态
const tableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const searchQuery = ref('')
const editForm = ref({})  // 保存当前编辑的数据
const formLabelWidth = '120px'

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

// 编辑 row 数据
const editRow = (row) => {
    editForm.value = { ...row }  // 深拷贝当前行的数据
    editDialogVisible.value = true  // 打开编辑对话框
}

// 保存编辑后的数据
const saveEdit = () => {

    console.log('editForm ------> ', editForm);


    // const saveEdit = async () => {
    // const result = await proxy.Request({
    //     url: api.updateArrowsData,
    //     showLoading: true,
    //     method: 'post',
    //     params: {
    //         id: editForm.value.id,
    //         arrowName: editForm.value.arrowName
    //     }
    // })
    // if (result) {
    //     getPageData()  // 编辑成功后刷新表格数据
    //     editDialogVisible.value = false  // 关闭编辑对话框
    // }
}

// 进行删除操作
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
            getPageData()
        }
    )

}

const handlePageChange = (page) => {
    currentPage.value = page
    getPageData()
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