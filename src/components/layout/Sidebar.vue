<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#304156"
    class="el-menu-vertical-demo"
    text-color="#bfcbd9"
    :default-active="activeMenu"
    router
  >
    <div class="logo-container">
      <h1 class="logo-title">运营平台</h1>
    </div>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Monitor /></el-icon>
        <span>平台信息报送</span>
      </template>
      <el-menu-item index="/identity-submission">
        <el-icon><User /></el-icon>
        <span>身份信息报送</span>
      </el-menu-item>
      <el-menu-item index="/other-submission-type-1">
        <el-icon><Document /></el-icon>
        <span>报送类型一</span>
      </el-menu-item>
      <el-menu-item index="/other-submission-type-2">
        <el-icon><DocumentCopy /></el-icon>
        <span>报送类型二</span>
      </el-menu-item>
    </el-sub-menu>

    <!-- Placeholder for other menu items as per the image -->
    <el-menu-item index="/generated-view">
      <el-icon><DataBoard /></el-icon>
      <span>等工企业管理</span>
    </el-menu-item>
    <el-menu-item index="/menu-item-2">
      <el-icon><PieChart /></el-icon>
      <span>等工渠道管理</span>
    </el-menu-item>
    <el-menu-item index="/menu-item-3">
      <el-icon><Money /></el-icon>
      <span>链块报酬结算</span>
    </el-menu-item>
    <el-menu-item index="/menu-item-4">
      <el-icon><Tickets /></el-icon>
      <span>链块查询记录</span>
    </el-menu-item>
    <el-menu-item index="/menu-item-5">
      <el-icon><Reading /></el-icon>
      <span>电子合同</span>
    </el-menu-item>

    <!-- Placeholder for other sub-menus -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </template>
      <el-menu-item index="/setting-item-1">子菜单1</el-menu-item>
      <el-menu-item index="/setting-item-2">子菜单2</el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  Monitor,
  User,
  Document,
  DocumentCopy,
  DataBoard,
  PieChart,
  Money,
  Tickets,
  Reading,
  Setting
} from '@element-plus/icons-vue';

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
}
.logo-title {
  color: #fff;
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}
.el-menu {
  border-right: none;
}
</style>
