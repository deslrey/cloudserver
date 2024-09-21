<template>
    <div>
        <!-- 触发按钮 -->
        <el-button :type="type" :icon="icon" @click="expandButton">{{ text }}</el-button>

        <!-- 弹出的展示栏 (Dialog) -->
        <el-dialog title="箭头数据管理" v-model="dialogVisible" width="50%" :modal="true" :center="true" :lock-scroll="false"
            append-to-body>
            <el-button type="primary" @click="addArrowsData">添加</el-button>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="arrowName" label="名称" />
                <el-table-column prop="createUser" label="创建者" />
                <el-table-column prop="createTime" label="创建日期" />
                <el-table-column prop="updateTime" label="最近修改" />
                <el-table-column prop="exist" label="是否启用" />
            </el-table>

            <!-- Dialog 的 footer -->
            <template #footer>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { defineProps } from 'vue'

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

const expandButton = () => {
    dialogVisible.value = true
    getPageData()
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

const addArrowsData = async () => {

    const result = await proxy.Request({
        url: api.addArrowsData,
        showLoading: true,
        params: { arrowName: "钱" }
    })

    console.log('addArrowsData ------> ', result);
}

// 控制 Dialog 显示/隐藏
const dialogVisible = ref(false)

// 示例数据
const tableData = ref([])

const getPageData = async () => {
    const result = await proxy.Request({
        url: api.getPageData,
        showLoading: true,
    })

    console.log('result ------> ', result.data.list);
    tableData.value = result.data.list
    console.log('tableData ------> ', tableData.value);

}
</script>

<style scoped>
/* 可以在此添加自定义样式 */
</style>