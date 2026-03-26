<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const menuItems = ref([
  {
    name: '运营平台',
    icon: '📊', // Placeholder icon
    children: [
      { name: '待审企业管理', path: '#' },
      { name: '待发票管核', path: '#' },
      { name: '继续结算管理', path: '#' },
      { name: '核查处置记录', path: '#' },
      { name: '电子合同', path: '#' },
    ]
  },
  {
    name: '平台信息报送',
    icon: '📝',
    expanded: true, // This section appears expanded in the image
    children: [
      { name: '互联网平台报送', path: '#' },
      { name: '身份信息报送', path: '/identity-submission' },
      { name: '身份信息更正', path: '#' },
      { name: '纳入信息报送', path: '#' },
      { name: '纳入信息更正', path: '#' },
      { name: '报送进度查询', path: '#' },
    ]
  },
  // ... other top-level menu items if any, not fully visible
]);

const toggleSubMenu = (item) => {
  item.expanded = !item.expanded;
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title">运营平台</h1>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.name" class="menu-item">
          <div class="menu-title" @click="item.children && toggleSubMenu(item)">
            <span class="menu-icon">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
            <span v-if="item.children" class="toggle-icon">{{ item.expanded ? '▼' : '▶' }}</span>
          </div>
          <ul v-if="item.children && item.expanded" class="submenu">
            <li v-for="subItem in item.children" :key="subItem.name" class="submenu-item">
              <RouterLink :to="subItem.path" active-class="active-link">{{ subItem.name }}</RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  background-color: var(--color-sidebar-bg);
  color: var(--color-sidebar-text);
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 24px;
  margin: 0;
  color: #fff;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-title {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: background-color 0.2s;
  color: var(--color-sidebar-text);
}

.menu-title:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  margin-right: 10px;
  font-size: 18px;
}

.toggle-icon {
  margin-left: auto;
  font-size: 12px;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.1);
}

.submenu-item a {
  display: block;
  padding: 10px 20px 10px 45px; /* Indent sub-items */
  color: var(--color-sidebar-text);
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.submenu-item a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.submenu-item a.active-link {
  background-color: var(--color-primary); /* Highlight active link */
  color: #fff;
}
</style>
