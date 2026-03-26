<script setup>
import { ref } from 'vue';

const menuItems = ref([
  { id: '1', title: '等工企业管理', icon: '■', children: [] },
  { id: '2', title: '等工派遣管理', icon: '■', children: [] },
  { id: '3', title: '继续经营核算', icon: '■', children: [] },
  { id: '4', title: '继续经营记录', icon: '■', children: [] },
  { id: '5', title: '电子合同', icon: '■', children: [] },
  {
    id: '6', title: '平台信息报送', icon: '■',
    children: [
      { id: '6-1', title: '互联网平台报送' },
      { id: '6-2', title: '身份信息报送', active: true },
      { id: '6-3', title: '身份信息更正' },
      { id: '6-4', title: '收入信息报送' },
      { id: '6-5', title: '收入信息更正' },
      { id: '6-6', title: '报送进度查询' }
    ]
  }
]);

const toggleSubMenu = (item) => {
  item.expanded = !item.expanded;
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      运营平台
    </div>
    <nav class="menu">
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.id" :class="{'menu-item-has-children': item.children && item.children.length}">
          <div class="menu-item-title" @click="toggleSubMenu(item)">
            <span class="menu-item-icon">{{ item.icon }}</span>
            <span>{{ item.title }}</span>
            <span v-if="item.children && item.children.length" class="submenu-toggle">{{ item.expanded ? '▼' : '▶' }}</span>
          </div>
          <ul v-if="item.children && item.children.length && item.expanded" class="submenu-list">
            <li v-for="subItem in item.children" :key="subItem.id" :class="{'submenu-item': true, 'active': subItem.active}">
              {{ subItem.title }}
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 0;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.sidebar-header {
  background-color: #34495e;
  color: #fff;
  font-size: 20px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
}

.menu {
  padding: 10px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item-title {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.menu-item-title:hover {
  background-color: #3f5b75;
}

.menu-item-icon {
  margin-right: 10px;
  font-size: 16px;
}

.submenu-toggle {
  margin-left: auto;
  font-size: 10px;
}

.submenu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #3a5068;
}

.submenu-item {
  padding: 10px 20px 10px 45px; /* Indent sub-items */
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.submenu-item:hover {
  background-color: #4a637a;
}

.submenu-item.active {
  background-color: #409eff;
  color: #fff;
}
</style>
