<template>
    <div>
        <!-- 触发按钮 -->
        <el-button :type="type" :icon="icon" @click="dialogVisible = true">{{ text }}</el-button>

        <!-- 弹出的展示栏 (Dialog) -->
        <el-dialog title="数据展示" v-model="dialogVisible" width="50%" :modal="true" :center="true" :lock-scroll="false"
            append-to-body>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="age" label="年龄" />
                <el-table-column prop="address" label="地址" />
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
}

// 控制 Dialog 显示/隐藏
const dialogVisible = ref(false)

// 示例数据
const tableData = [
    { name: '张三', age: 25, address: '北京市' },
    { name: '李四', age: 30, address: '上海市' },
    { name: '王五', age: 28, address: '广州市' },
]

const getPageData = async () => {
    const result = await proxy.Request({
        url: api.getPageData,
        showLoading: true,
    })

    console.log('result ------> ', result.data.list);

}

getPageData()
</script>

<style scoped>
/* 可以在此添加自定义样式 */
</style>