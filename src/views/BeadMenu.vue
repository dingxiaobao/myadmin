<template>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/list' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{path.one}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{path.two}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    data() {
        return {
           path:JSON.parse(sessionStorage.getItem('path'))
        }
    },
}
</script>