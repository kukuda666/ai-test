<script setup>
import Sidebar from './Sidebar.vue';
import IdentitySubmissionView from '../../views/IdentitySubmissionView.vue';
</script>

<template>
  <div class="layout-container">
    <Sidebar />
    <main class="main-content">
      <IdentitySubmissionView />
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f5f7fa;
}
</style>
