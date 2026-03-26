<script setup>
import { ref, computed, onMounted } from 'vue';

const reportingPeriod = ref(''); // e.g., '2023-10'
const keyword = ref('');
const personnelList = ref([]);
const selectedPersonnelIds = ref(new Set());

const mockPersonnelData = [
  {
    id: '1001',
    serialNo: 1,
    period: '2023-10',
    socialCreditCode: '91330103MA2B...',
    serviceInstitutionType: '-',
    name: '张三',
    idNumber: '321980XXXXXX',
    idType: '居民身份证',
    nationality: '中国',
    residence: '否',
    residenceType: '-',
    contactName: '-',
    contactPhone: '-',
    registrationTime: '2023-11-01 10:45',
    sellerWasteProducer: '销售方',
    status: '未报送'
  },
  {
    id: '1002',
    serialNo: 2,
    period: '2023-10',
    socialCreditCode: '91330103MA2C...', // Changed for distinction
    serviceInstitutionType: '-',
    name: '李四',
    idNumber: '321981XXXXXX',
    idType: '居民身份证',
    nationality: '中国',
    residence: '是',
    residenceType: '经营地与注册地一致',
    contactName: '李某',
    contactPhone: '138XXXXX789',
    registrationTime: '2023-11-01 10:50',
    sellerWasteProducer: '产废',
    status: '已报送'
  },
  {
    id: '1003',
    serialNo: 3,
    period: '2023-11',
    socialCreditCode: '91330103MA2D...', // Changed for distinction
    serviceInstitutionType: '个体户',
    name: '王五',
    idNumber: '330102XXXXXX',
    idType: '居民身份证',
    nationality: '中国',
    residence: '否',
    residenceType: '-',
    contactName: '-',
    contactPhone: '-',
    registrationTime: '2023-11-05 11:00',
    sellerWasteProducer: '销售方',
    status: '未报送'
  },
  {
    id: '1004',
    serialNo: 4,
    period: '2023-11',
    socialCreditCode: '91330103MA2E...', // Changed for distinction
    serviceInstitutionType: '企业',
    name: '赵六',
    idNumber: '330103XXXXXX',
    idType: '居民身份证',
    nationality: '中国',
    residence: '是',
    residenceType: '经营地与注册地一致',
    contactName: '赵某',
    contactPhone: '139XXXXX123',
    registrationTime: '2023-11-06 12:30',
    sellerWasteProducer: '产废',
    status: '未报送'
  }
];

const fetchPersonnel = async () => {
  console.log('Fetching personnel with:', { reportingPeriod: reportingPeriod.value, keyword: keyword.value });
  // In a real application, you would make an API call here:
  // const response = await fetch(`/api/personnel/to-report?period=${reportingPeriod.value}&keyword=${keyword.value}`);
  // const data = await response.json();
  // personnelList.value = data;

  // Mocking data for demonstration
  let filteredData = mockPersonnelData;

  if (reportingPeriod.value) {
    filteredData = filteredData.filter(p => p.period === reportingPeriod.value);
  }

  if (keyword.value) {
    const lowerKeyword = keyword.value.toLowerCase();
    filteredData = filteredData.filter(p =>
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.idNumber.toLowerCase().includes(lowerKeyword)
    );
  }
  personnelList.value = filteredData;
  selectedPersonnelIds.value.clear(); // Clear selection on new search
};

const handleSearch = () => {
  fetchPersonnel();
};

const handleCheckboxChange = (id, event) => {
  if (event.target.checked) {
    selectedPersonnelIds.value.add(id);
  } else {
    selectedPersonnelIds.value.delete(id);
  }
  console.log('Selected IDs:', Array.from(selectedPersonnelIds.value));
};

const isAllSelected = computed(() => {
  if (personnelList.value.length === 0) return false;
  return personnelList.value.every(p => selectedPersonnelIds.value.has(p.id));
});

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    personnelList.value.forEach(p => selectedPersonnelIds.value.add(p.id));
  } else {
    selectedPersonnelIds.value.clear();
  }
};

const handleOneClickSubmit = async () => {
  if (selectedPersonnelIds.value.size === 0) {
    alert('请选择需要报送的人员！');
    return;
  }
  const idsToSubmit = Array.from(selectedPersonnelIds.value);
  console.log('One-click submission for IDs:', idsToSubmit);
  // In a real application, you would make an API call here:
  // const response = await fetch('/api/personnel/submit-report', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ids: idsToSubmit }),
  // });
  // const result = await response.json();
  // if (response.ok) {
  //   alert('一键报送成功！');
  //   fetchPersonnel(); // Refresh list
  // } else {
  //   alert(`报送失败: ${result.message}`);
  // }

  alert(`已模拟一键报送 ${idsToSubmit.length} 条数据: ${idsToSubmit.join(', ')}`);
  // Update status for submitted items in mock data
  personnelList.value.forEach(p => {
    if (idsToSubmit.includes(p.id)) {
      p.status = '已报送';
    }
  });
  selectedPersonnelIds.value.clear(); // Clear selection after submission
};

const handleIndividualSubmit = async (id) => {
  console.log('Individual submission for ID:', id);
  // In a real application, you would make an API call here:
  // const response = await fetch('/api/personnel/submit-report', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ids: [id] }),
  // });
  // const result = await response.json();
  // if (response.ok) {
  //   alert(`人员 ${id} 报送成功！`);
  //   fetchPersonnel(); // Refresh list
  // } else {
  //   alert(`报送失败: ${result.message}`);
  // }

  alert(`已模拟报送人员 ${id}`);
  // Update status for the submitted item in mock data
  const index = personnelList.value.findIndex(p => p.id === id);
  if (index !== -1) {
    personnelList.value[index].status = '已报送';
  }
};

const addSubmissionInfo = () => {
  alert('点击了“新增报送信息”');
  // Logic for adding new submission information
};

onMounted(() => {
  fetchPersonnel(); // Initial data load
});
</script>

<template>
  <div class="identity-submission-view">
    <h1 class="page-title">身份信息报送</h1>
    <div class="content-card">
      <div class="card-header">
        <h2>平台内的经营者和从业人员身份信息报送表</h2>
        <p class="header-subtext">
          为更好进行平台企业资质申报并协助完成平台内经营者和从业人员身份信息报送。
        </p>
        <div class="hint-box mb-4">
          平台内经营者和从业人员身份信息报送中...
        </div>
      </div>

      <div class="search-filter flex-row align-center gap-2 mb-4">
        <label for="reporting-period">所属期:</label>
        <input type="month" id="reporting-period" v-model="reportingPeriod" class="input-field" />
        <label for="keyword">关键字(证件号/姓名):</label>
        <input type="text" id="keyword" v-model="keyword" placeholder="请输入证件号或姓名" class="input-field" />
        <button @click="handleSearch" class="btn btn-primary">查询</button>
        <button
          @click="handleOneClickSubmit"
          :class="['btn', selectedPersonnelIds.size > 0 ? 'btn-primary' : 'btn-disabled']"
          :disabled="selectedPersonnelIds.size === 0"
        >一键报送</button>
        <button @click="addSubmissionInfo" class="btn btn-secondary">新增报送信息</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
              </th>
              <th>序号</th>
              <th>所属期</th>
              <th>统一社会信用代码</th>
              <th>专业服务机构类型</th>
              <th>姓名</th>
              <th>证件号</th>
              <th>证件类型</th>
              <th>国籍</th>
              <th>居住地</th>
              <th>居住类型</th>
              <th>联系人姓名</th>
              <th>联系电话</th>
              <th>注册时间</th>
              <th>销售方/产废</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="personnelList.length === 0">
              <td colspan="17" class="text-center">暂无数据</td>
            </tr>
            <tr v-for="person in personnelList" :key="person.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedPersonnelIds.has(person.id)"
                  @change="(event) => handleCheckboxChange(person.id, event)"
                  :disabled="person.status === '已报送'"
                />
              </td>
              <td>{{ person.serialNo }}</td>
              <td>{{ person.period }}</td>
              <td>{{ person.socialCreditCode }}</td>
              <td>{{ person.serviceInstitutionType }}</td>
              <td>{{ person.name }}</td>
              <td>{{ person.idNumber }}</td>
              <td>{{ person.idType }}</td>
              <td>{{ person.nationality }}</td>
              <td>{{ person.residence }}</td>
              <td>{{ person.residenceType }}</td>
              <td>{{ person.contactName }}</td>
              <td>{{ person.contactPhone }}</td>
              <td>{{ person.registrationTime }}</td>
              <td>{{ person.sellerWasteProducer }}</td>
              <td>{{ person.status }}</td>
              <td>
                <button
                  v-if="person.status === '未报送'"
                  @click="handleIndividualSubmit(person.id)"
                  class="btn btn-primary btn-small"
                >报送</button>
                <span v-else>已报送</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="message-box mt-4">
        <p>1. 数据报送默认从上次报送日期开始补报，期间内，经营仍在平台实名实工的员工。</p>
      </div>

      <div class="flex-row gap-2 mt-4">
        <div class="hint-box" style="width: 30%;">
          <p><strong>[温馨提示]</strong> 一键报送：批量进行报送操作，对所选人员进行批量报送。报送成功的人员，将不再在报送列表中显示，可在“报送进度查询”中查看报送结果。</p>
          <p><strong>[撤销报送]</strong> 一键撤销：批量进行撤销操作。撤销成功的人员，将重新显示在报送列表中，等待重新报送。</p>
        </div>
        <div class="hint-box" style="width: 30%;">
          <p><strong>须知：</strong></p>
          <p>1. 数据报送，按月汇总统计，企业每月报送平台内的经营者、从业人员的身份信息及当月经营结果数据。</p>
          <p>2. 各项数据填写不全，无法进行报送，需要补全信息后方可报送。</p>
          <p>3. 报送成功后，可在报送进度查询中查看报送结果。</p>
        </div>
        <div class="hint-box" style="width: 30%;">
          <p>此功能只针对FDI、个人独资企业和合伙企业注册类目，其他类目请勿点击此功能。</p>
          <p>新增：首次报送时自动匹配在平台有经营和从业的员工，上次报送后，新增的从业人员（以注册名为准），需要新增。</p>
          <p>变更：从业人员身份信息发生变更，企业或人员发生姓名、身份证号、国籍、居住地变更。</p>
          <p>撤回：[从业人员需登陆平台]，同意人员进行同步撤销（目前仅报送功能）。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.identity-submission-view {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.content-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header h2 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.card-header .header-subtext {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
}

.search-filter {
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.search-filter label {
  font-size: 14px;
  color: #606266;
  margin-right: 5px;
}

.btn-small {
  padding: 6px 10px;
  font-size: 12px;
}

.table-container {
  overflow-x: auto;
}

table {
  min-width: 1200px; /* Ensure table doesn't get too narrow */
}
</style>
