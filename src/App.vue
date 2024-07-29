<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { reactive } from "vue";
import framework from "@/views/Framework.vue";
// import zhCn from "element-plus/lib/locale/lang/zh-cn";
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 更新导入路径

const locale = zhCn;
const config = reactive({
  max: 1,
});
</script>

<style scoped>
</style>
