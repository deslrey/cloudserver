<template>
    <h1>{{ message }}</h1>
    <el-button type="success"  @click="test">点我发送请求</el-button>
</template>
<script setup>
import { ref } from 'vue';
import RelationRequest from '../../api/relation/RelationRequest';


let message = ref('Hello')

function test() {
    RelationRequest.getTest().then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });
}

</script>
<style></style>