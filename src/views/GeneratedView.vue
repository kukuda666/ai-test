<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">平台内的经营者和从业人员身份信息报送表</h1>

    <!-- Search/Filter Section -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label for="period" class="block text-sm font-medium text-gray-700">所属期</label>
          <input type="text" id="period" v-model="searchParams.period" placeholder="请输入所属期 (如: 2023-01)"
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="keyword" class="block text-sm font-medium text-gray-700">关键字 (证件号/姓名)</label>
          <input type="text" id="keyword" v-model="searchParams.keyword" placeholder="请输入证件号或姓名"
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        </div>
        <div class="flex space-x-2">
          <button @click="fetchPersonnel" :disabled="loading"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            查询
          </button>
          <button @click="resetSearch" :disabled="loading"
                  class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            重置
          </button>
        </div>
        <div class="flex space-x-2 justify-end md:col-span-1">
          <button @click="reportSelected"
                  :disabled="selectedPersonnel.length === 0 || loading"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            一键报送 ({{ selectedPersonnel.length }})
          </button>
          <button @click="showDeferredInfo = true"
                  class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            暂缓报送信息
          </button>
        </div>
      </div>
    </div>

    <!-- Info/Hint section from image -->
    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
      <p class="font-bold">平台内经营者和从业人员身份信息查询中...</p>
      <p>1. 驾驶员培训从业人员应在取得教练证件后，报送其身份信息。</p>
      <p>2. 对已报送的从业人员信息，如有变更，请在身份信息更正模块进行更正操作。</p>
      <p>3. 平台内新注册的企业请先在企业信息管理模块报送企业信息后，再进行从业人员身份信息报送。</p>
    </div>

    <!-- Table Section -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">人员列表</h2>
      <div v-if="loading" class="text-center py-4">加载中...</div>
      <div v-else-if="error" class="text-center py-4 text-red-600">{{ error }}</div>
      <div v-else-if="personnelList.length === 0" class="text-center py-4 text-gray-500">
        没有找到符合条件的人员。
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" :disabled="personnelList.length === 0"
                       class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">证件类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">证件号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性别</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出生日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(person, index) in personnelList" :key="person.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" :value="person.id" v-model="selectedPersonnel"
                       class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-90">{{ (pagination.currentPage - 1) * pagination.pageSize + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.period }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.idType }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.idNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.gender }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.dob }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ person.contactPhone }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="personnelList.length > 0" class="mt-4 flex justify-between items-center">
        <span class="text-sm text-gray-700">
          显示 {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} - 
          {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.total) }} 共 {{ pagination.total }} 条
        </span>
        <div class="flex space-x-1">
          <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1 || loading"
                  class="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            上一页
          </button>
          <span class="px-3 py-1 bg-blue-500 text-white rounded-md">{{ pagination.currentPage }}</span>
          <button @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage * pagination.pageSize >= pagination.total || loading"
                  class="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- Hint/Modal Dialog (Simplified) -->
    <div v-if="showHintDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative p-8 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium leading-6 text-gray-900">提示</h3>
        <div class="mt-2 text-gray-700">
          <p>报送成功记录: {{ reportResults.successCount }}条</p>
          <p>报送失败记录: {{ reportResults.failureCount }}条</p>
          <p v-if="reportResults.failureDetails.length > 0" class="text-sm text-red-500">失败详情: {{ reportResults.failureDetails.join(', ') }}</p>
        </div>
        <div class="mt-4 text-right">
          <button @click="showHintDialog = false" class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            知道了
          </button>
        </div>
      </div>
    </div>

    <!-- Deferred Info Modal (Simplified) -->
    <div v-if="showDeferredInfo" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative p-8 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium leading-6 text-gray-900">暂缓报送信息</h3>
        <div class="mt-2 text-gray-700">
          <p>此处显示暂缓报送的人员信息及原因。</p>
          <p>(根据原型图，这部分内容比较复杂，暂时简化)</p>
        </div>
        <div class="mt-4 text-right">
          <button @click="showDeferredInfo = false" class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Backend API URL (adjust if your backend runs on a different host/port)
const BASE_URL = 'http://localhost:3000/api'; 

const personnelList = ref([]);
const selectedPersonnel = ref([]);
const searchParams = ref({
  period: '',
  keyword: '',
});
const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 10,
});
const loading = ref(false);
const error = ref(null);
const showHintDialog = ref(false);
const showDeferredInfo = ref(false);
const reportResults = ref({
  successCount: 0,
  failureCount: 0,
  failureDetails: [],
});

const isAllSelected = computed(() => {
  if (personnelList.value.length === 0) return false;
  return selectedPersonnel.value.length === personnelList.value.length &&
         personnelList.value.every(person => selectedPersonnel.value.includes(person.id));
});

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedPersonnel.value = personnelList.value.map(person => person.id);
  } else {
    selectedPersonnel.value = [];
  }
};

const fetchPersonnel = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${BASE_URL}/personnel`, {
      params: {
        ...searchParams.value,
        currentPage: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
      },
    });
    personnelList.value = response.data.data;
    pagination.value.total = response.data.total;
    pagination.value.currentPage = response.data.currentPage;
    pagination.value.pageSize = response.data.pageSize;
    selectedPersonnel.value = []; // Clear selection on new fetch
  } catch (err) {
    console.error('Failed to fetch personnel:', err);
    error.value = '无法加载人员列表，请稍后再试。';
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchParams.value.period = '';
  searchParams.value.keyword = '';
  pagination.value.currentPage = 1; // Reset pagination as well
  fetchPersonnel();
};

const reportSelected = async () => {
  if (selectedPersonnel.value.length === 0) {
    alert('请至少选择一位人员进行报送。');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post(`${BASE_URL}/report`, { ids: selectedPersonnel.value });
    reportResults.value.successCount = response.data.successCount;
    reportResults.value.failureCount = response.data.failureCount;
    reportResults.value.failureDetails = response.data.failureDetails || [];
    showHintDialog.value = true;
    selectedPersonnel.value = []; // Clear selection after reporting
    fetchPersonnel(); // Refresh the list after reporting
  } catch (err) {
    console.error('Failed to report personnel:', err);
    reportResults.value.successCount = 0;
    reportResults.value.failureCount = selectedPersonnel.value.length;
    reportResults.value.failureDetails = ['报送失败，请检查网络或稍后再试。'];
    showHintDialog.value = true;
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page > 0 && page <= Math.ceil(pagination.value.total / pagination.value.pageSize)) {
    pagination.value.currentPage = page;
    fetchPersonnel();
  }
};

onMounted(() => {
  fetchPersonnel();
});
</script>

<style>
/* Basic styles for body and root element if not handled by framework or index.html */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* 
  To use Tailwind CSS, you'll need to install it and configure it in your Vue project.
  Typically, you would have a main.css file (e.g., in src/assets/main.css or src/index.css)
  that imports Tailwind directives:
  
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  And then import that CSS file in your main.js (or main.ts).
  For demonstration, these are placed here, but in a real project, follow Tailwind setup docs.
*/
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
