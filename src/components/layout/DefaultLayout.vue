<script setup>
import Sidebar from './Sidebar.vue';
</script>

<template>
  <div class="default-layout">
    <Sidebar />
    <main class="main-content">
      <header class="header">
        <h2 class="page-title">身份信息报送</h2>
      </header>
      <div class="content-area">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  width: 100%;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

.header {
  background-color: var(--color-background-soft);
  padding: 15px 30px;
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  min-height: 60px; /* Adjust header height */
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: var(--color-text-dark);
}

.content-area {
  padding: 20px 30px;
  flex-grow: 1;
}
</style>
