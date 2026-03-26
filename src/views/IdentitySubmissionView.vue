<template>
  <div class="identity-submission-view">
    <h2 class="page-header-title">平台内的经营者和从业人员身份信息报送表</h2>
    <p class="page-description">根据税务总局《涉税专业服务机构身份信息报送办法（试行）》相关规定，平台定期向税务机关报送经营者和从业人员身份信息。</p>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="所属期">
          <el-date-picker
            v-model="searchForm.period"
            type="month"
            placeholder="选择所属月份"
            value-format="YYYY-MM"
          />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="searchForm.keyword" placeholder="证件号/姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-area">
      <div class="table-header-actions">
        <el-button type="primary" @click="reportSelected">一键报送</el-button>
        <el-button @click="refreshData">刷新报送状态</el-button>
      </div>

      <el-table
        :data="personnelList"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" width="60" />
        <el-table-column prop="reportingPeriod" label="所属期" width="100" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="idNumber" label="证件号" width="180" />
        <el-table-column prop="idType" label="证件类型" width="100" />
        <el-table-column prop="nationality" label="国籍" width="80" />
        <el-table-column prop="birthplace" label="出生地" width="100" />
        <el-table-column prop="birthDate" label="出生日期" width="120" />
        <el-table-column prop="gender" label="性别" width="70" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="contactName" label="联系人姓名" width="100" />
        <el-table-column prop="status" label="报送状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submissionTime" label="报送时间" width="160" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button link type="danger" size="small" @click="handleResubmit(scope.row)">补报</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination-container"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Alert/Dialog components for various prompts -->
    <el-dialog
      v-model="showSubmitDialog"
      title="提示"
      width="30%"
      center
    >
      <span>本次报送结果：</span>
      <p>报送成功记录: {{ submitResult.successCount }} 条</p>
      <p>报送失败记录: {{ submitResult.failCount }} 条</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="showSubmitDialog = false">知道了</el-button>
        </span>
      </template>
    </el-dialog>

    <el-alert
      v-if="showAlert" 
      title="1.税务总局通过线上获取的涉税专业服务机构基本信息，作为平台内经营者身份信息，并报送。" 
      type="info" 
      show-icon 
      :closable="false"
      style="margin-top: 20px;"
    />
    
    <!-- Other informational boxes can be implemented similarly with el-alert or custom divs -->
    <div class="info-box tips-box" v-if="showTips">
      <h3>问题</h3>
      <p>1. 数据报错，如何修改？</p>
      <p>2. 涉税机构发生企业信息变更，例如：注销报送资格的，还需要再次报送与企业变更后的身份信息吗？</p>
      <p>3. 报送业务能否撤回？（不能撤回）</p>
    </div>
    <div class="info-box advice-box" v-if="showAdvice">
      <h3>建议</h3>
      <p>1. 报送规则：首次报送自动匹配在税务管理系统获取，上次报送数据，新增从业人员信息（以资质为准），更新即报。</p>
      <p>2. 变更：从业人员信息发生变更后，企业需从报发单处修改各项信息，更新，关联修改更新。</p>
      <p>3. 撤回（从业人员需在平台）：问题人员进行删除操作（目前暂无此功能）</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

const searchForm = ref({
  period: '',
  keyword: '',
});

const personnelList = ref([]);
const selectedPersonnel = ref([]);
const loading = ref(false);
const total = ref(0);
const pagination = ref({
  page: 1,
  limit: 10,
});

const showSubmitDialog = ref(false);
const submitResult = ref({
  successCount: 0,
  failCount: 0,
});

const showAlert = ref(true); // Example for the top alert
const showTips = ref(true); // Example for the '问题' box
const showAdvice = ref(true); // Example for the '建议' box

const getStatusTagType = (status) => {
  switch (status) {
    case '已报送': return 'success';
    case '待报送': return 'info';
    case '报送失败': return 'danger';
    case '部分成功': return 'warning';
    default: return '';
  }
};

const fetchPersonnelList = async () => {
  loading.value = true;
  try {
    const params = {
      period: searchForm.value.period,
      keyword: searchForm.value.keyword,
      page: pagination.value.page,
      limit: pagination.value.limit,
    };
    const response = await axios.get('/api/personnel/submission', { params });
    personnelList.value = response.data.list.map((item, index) => ({ // Add an artificial id for selection
      ...item,
      id: (pagination.value.page - 1) * pagination.value.limit + index + 1,
    }));
    total.value = response.data.total;
  } catch (error) {
    ElMessage.error('获取人员列表失败：' + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};

const onSubmit = () => {
  pagination.value.page = 1;
  fetchPersonnelList();
};

const handleSelectionChange = (val) => {
  selectedPersonnel.value = val;
};

const reportSelected = async () => {
  if (selectedPersonnel.value.length === 0) {
    ElMessage.warning('请至少选择一条记录进行报送。');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定报送选中的 ${selectedPersonnel.value.length} 条人员身份信息吗？`,
      '确认报送',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    const idsToSubmit = selectedPersonnel.value.map(p => p.id);
    const response = await axios.post('/api/personnel/submit', { ids: idsToSubmit });

    submitResult.value.successCount = response.data.successCount || 0;
    submitResult.value.failCount = response.data.failCount || 0;
    showSubmitDialog.value = true;

    ElMessage.success('报送操作已完成。');
    fetchPersonnelList(); // Refresh data after submission
  } catch (error) {
    if (error !== 'cancel') { // User clicked cancel on MessageBox
      ElMessage.error('报送失败：' + (error.response?.data?.message || error.message));
    }
  }
};

const refreshData = () => {
  fetchPersonnelList();
  ElMessage.success('报送状态已刷新。');
};

const handleDetail = (row) => {
  ElMessage.info(`查看 ${row.name} 的详情。`);
  // Implement navigation or dialog for detail view
};

const handleResubmit = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定补报 ${row.name} (证件号: ${row.idNumber}) 的身份信息吗？`,
      '确认补报',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    const response = await axios.post('/api/personnel/submit', { ids: [row.id] });
    if (response.data.successCount > 0) {
      ElMessage.success(`${row.name} 补报成功！`);
      fetchPersonnelList();
    } else {
      ElMessage.warning(`${row.name} 补报未能成功。`);
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('补报失败：' + (error.response?.data?.message || error.message));
    }
  }
};

const handleSizeChange = (val) => {
  pagination.value.limit = val;
  fetchPersonnelList();
};

const handleCurrentChange = (val) => {
  pagination.value.page = val;
  fetchPersonnelList();
};

onMounted(() => {
  fetchPersonnelList();
});

// Mock Data (remove in real application)
if (import.meta.env.DEV) {
  const generateMockData = (count) => {
    const data = [];
    const statuses = ['已报送', '待报送', '报送失败', '部分成功'];
    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        reportingPeriod: '2023-11',
        name: `张三${i}`,
        idNumber: `32108119900101${String(i).padStart(4, '0')}`,
        idType: '居民身份证',
        nationality: '中国',
        birthplace: '江苏',
        birthDate: '1990-01-01',
        gender: i % 2 === 0 ? '男' : '女',
        contactPhone: `138001380${String(i).padStart(2, '0')}`,
        contactName: `联系人${i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        submissionTime: i % 3 === 0 ? '2023-11-15 10:30:00' : ''
      });
    }
    return data;
  };
  // Replace axios.get and axios.post in dev mode for quick testing
  axios.get = (url, config) => {
    if (url === '/api/personnel/submission') {
      const { page, limit, period, keyword } = config.params;
      let mockList = generateMockData(100);
      if (period) {
        mockList = mockList.filter(item => item.reportingPeriod === period);
      }
      if (keyword) {
        mockList = mockList.filter(item => 
          item.idNumber.includes(keyword) || item.name.includes(keyword)
        );
      }
      const start = (page - 1) * limit;
      const end = start + limit;
      return Promise.resolve({
        data: { 
          list: mockList.slice(start, end),
          total: mockList.length
        }
      });
    }
    return Promise.reject(new Error('Unknown API'));
  };
  axios.post = (url, data) => {
    if (url === '/api/personnel/submit') {
      const { ids } = data;
      const successCount = ids.length - Math.floor(Math.random() * ids.length / 2); // Simulate some failures
      const failCount = ids.length - successCount;
      return Promise.resolve({ data: { successCount, failCount } });
    }
    return Promise.reject(new Error('Unknown API'));
  };
}
</script>

<style scoped>
.identity-submission-view {
  padding: 20px;
}

.page-header-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.search-area {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-header-actions {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  justify-content: flex-end;
}

.info-box {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  padding: 15px;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.tips-box {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.advice-box {
  background-color: #f6ffed;
  border-color: #b7eb8f;
}

.info-box h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
