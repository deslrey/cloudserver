<template>
    <el-table :data="filterTableData" stripe size="large">
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

    <el-dialog v-model="dialogVisible" title="编辑" width="500" destroy-on-close align-center close-on-press-escape>
        <el-form :model="editForm">
            <el-form-item label="Name">
                <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="Description">
                <el-input v-model="editForm.description" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitEdit">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits, getCurrentInstance, computed, reactive } from 'vue'
import Message from '../../utils/Message';

const emits = defineEmits(['addFile', 'reload'])

const { proxy } = getCurrentInstance();
const search = ref('')
const background = ref(false)
const disabled = ref(false)
const dialogVisible = ref(false)
const editForm = reactive({
    id: null,
    name: '',
    description: ''
})

let tableData = reactive({
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    list: []
})

const api = {
    getAllGroups: '/groups/getAllGroups',
    deleteGroup: '/groups/deleteGroup',
    updateGroup: '/groups/updateGroup'
}

const tableDataList = async () => {
    const params = {
        pageNo: tableData.currentPage,
        pageSize: tableData.pageSize,
    }
    console.log('tableData ------> ', tableData)
    console.log('params ------> ', params)
    const result = await proxy.Request({
        url: api.getAllGroups,
        showLoading: true,
        params: params
    })
    console.log('result ------> ', result)
    tableData.totalCount = result.data.totalCount
    tableData.currentPage = result.data.pageNo
    tableData.pageSize = result.data.pageSize
    tableData.list = result.data.list
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
    console.log('row ------> ', row);
    editForm.id = row.id
    editForm.name = row.name
    editForm.description = row.description
    editForm.exist = row.exist
    dialogVisible.value = true
    console.log('editForm ------> ', editForm);
}

const handleDelete = (row) => {
    console.log('handleDelete ------> ', row.id)
    proxy.Confirm(
        `你确定要删除【${row.name}】这组关系数据吗?`,
        async () => {
            let result = await proxy.Request({
                url: api.deleteGroup,
                params: {
                    groupsId: row.id
                }
            })
            if (!result) {
                return
            }
            tableDataList()
        }
    )

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

const submitEdit = async () => {
    console.log('editForm ------> ', editForm);

    let result = await proxy.Request({
        url: api.updateGroup,
        method: 'post',
        params: {
            id: editForm.id,
            name: editForm.name,
            description: editForm.description
        }
    })
    console.log('result ------> ', result);
    if (result) {
        dialogVisible.value = false
        Message.success(result.message)
        tableDataList()
    }
}
</script>

<style>
.pagination-container {
    position: fixed;
    bottom: 10px;
    right: 10px;
}
</style>
