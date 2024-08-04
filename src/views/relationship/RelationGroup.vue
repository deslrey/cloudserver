<template>
    <el-table :data="filterTableData" stripe>
        <el-table-column label="Name" prop="name" />
        <el-table-column label="Description" prop="description" />
        <el-table-column align="right">
            <template #header>
                <el-input v-model="search" size="small" placeholder="Type to search" />
            </template>
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">
                    Edit
                </el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                    Delete
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="pagination-container">
        <el-pagination v-model:current-page="tableData.currentPage" v-model:page-size="tableData.pageSize"
            :page-sizes="[10, 20, 30, 40]" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="tableData.totalCount"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import { ref, defineEmits, getCurrentInstance, computed, reactive } from 'vue'
const emits = defineEmits(['addFile', 'reload'])

const { proxy } = getCurrentInstance();
const search = ref('')
const background = ref(false)
const disabled = ref(false)

let tableData = reactive({
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    list: []
})

const api = {
    getAllGroups: "/groups/getAllGroups",
}

const tableDataList = async () => {
    const params = {
        pageNo: tableData.currentPage,
        pageSize: tableData.pageSize,
    }

    const result = await proxy.Request({
        url: api.getAllGroups,
        showLoading: true,
        params: params
    })

    const { list, totalCount, currentPage, pageSize } = result.data
    Object.assign(tableData, { list, totalCount, currentPage, pageSize })
    console.log(tableData)
}

// 页面加载时请求数据
tableDataList()

const filterTableData = computed(() =>
    tableData.list.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const handleEdit = (row) => {
    console.log(row)
}

const handleDelete = (row) => {
    console.log(row)
}

const handleSizeChange = (val) => {
    tableData.pageSize = val
    tableDataList()
    console.log(`${val} items per page`)
}

const handleCurrentChange = (val) => {
    tableData.currentPage = val
    tableDataList()
    console.log(`current page: ${val}`)
}
</script>

<style>
.pagination-container {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
</style>
