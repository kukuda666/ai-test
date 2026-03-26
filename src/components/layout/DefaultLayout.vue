<template>
  <el-container class="common-layout">
    <el-aside width="200px">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <div class="header-content">
          <span class="page-title">{{ $route.meta.title || '运营平台' }}</span>
          <!-- User info or other header elements can go here -->
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: #fff;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 100;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 99;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.el-main {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
