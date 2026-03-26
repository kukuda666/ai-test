<script setup>
import { ref, onMounted } from 'vue';

const reportingPeriod = ref('');
const keyword = ref('');
const personnelList = ref([]);
const selectedPersonnelIds = ref([]);
const showSubmissionResultModal = ref(false);
const submissionResult = ref({
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0
});

// Dummy data for demonstration
const dummyPersonnel = [
  {
    id: 'p1001',
    no: 1,
    period: '2023-11',
    unifiedId: '-',
    category: '-',
    name: '张三',
    idType: '身份证',
    idNumber: '3219XXX...',
    nationality: '中国',
    gender: '男',
    dob: '198X-XX-XX',
    contact: '139XXXXXX',
    status: '待报送',
    remark: '-'
  },
  {
    id: 'p1002',
    no: 2,
    period: '2023-11',
    unifiedId: '-',
    category: '-',
    name: '李四',
    idType: '身份证',
    idNumber: '3219YYY...',
    nationality: '中国',
    gender: '女',
    dob: '199X-XX-XX',
    contact: '138YYYYYY',
    status: '已报送',
    remark: '报送成功'
  },
  {
    id: 'p1003',
    no: 3,
    period: '2023-10',
    unifiedId: '-',
    category: '-',
    name: '王五',
    idType: '身份证',
    idNumber: '3219ZZZ...',
    nationality: '中国',
    gender: '男',
    dob: '197X-XX-XX',
    contact: '137ZZZZZZ',
    status: '待报送',
    remark: '-'
  }
];

const fetchPersonnelList = async () => {
  console.log('Fetching personnel with:', reportingPeriod.value, keyword.value);
  // In a real app, make an API call here.
  // Example: const response = await fetch(`/api/personnel/submission?period=${reportingPeriod.value}&keyword=${keyword.value}`);
  // personnelList.value = await response.json();

  // Simulate API call with dummy data
  let filteredList = dummyPersonnel;
  if (reportingPeriod.value) {
    filteredList = filteredList.filter(p => p.period === reportingPeriod.value);
  }
  if (keyword.value) {
    filteredList = filteredList.filter(p => 
      p.name.includes(keyword.value) || p.idNumber.includes(keyword.value)
    );
  }
  personnelList.value = filteredList;
  selectedPersonnelIds.value = []; // Clear selection on new search
};

const submitPersonnel = async (ids) => {
  if (ids.length === 0) {
    alert('请选择需要报送的人员！');
    return;
  }
  console.log('Submitting personnel with IDs:', ids);
  // In a real app, make an API call here.
  // Example: const response = await fetch('/api/personnel/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });
  // const result = await response.json();
  // submissionResult.value = result;

  // Simulate API call with dummy data
  const successfulSubmissions = ids.filter(id => personnelList.value.find(p => p.id === id && p.status === '待报送'));
  const failedSubmissions = ids.filter(id => personnelList.value.find(p => p.id === id && p.status === '已报送')); // Already submitted would be a 'failure' to re-submit

  submissionResult.value = {
    total: ids.length,
    success: successfulSubmissions.length,
    failed: failedSubmissions.length,
    skipped: ids.length - successfulSubmissions.length - failedSubmissions.length // Example: if some were invalid IDs
  };

  // Update status in frontend (optimistic update or after actual API success)
  successfulSubmissions.forEach(id => {
    const index = personnelList.value.findIndex(p => p.id === id);
    if (index !== -1) {
      personnelList.value[index].status = '已报送';
      personnelList.value[index].remark = '报送成功';
    }
  });

  showSubmissionResultModal.value = true;
};

const oneClickSubmit = () => {
  const idsToSubmit = personnelList.value.filter(p => p.status === '待报送').map(p => p.id);
  submitPersonnel(idsToSubmit);
};

const postponeSubmission = async () => {
  if (selectedPersonnelIds.value.length === 0) {
    alert('请选择需要暂缓报送的人员！');
    return;
  }
  console.log('Postponing personnel with IDs:', selectedPersonnelIds.value);
  // In a real app, make an API call here.
  // Example: const response = await fetch('/api/personnel/postpone', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedPersonnelIds.value }) });
  // Handle response

  alert(`已对选中的 ${selectedPersonnelIds.value.length} 人员进行暂缓报送操作 (假定成功).`);
  selectedPersonnelIds.value = []; // Clear selection
};


const handleRowSelection = (id, isChecked) => {
  if (isChecked) {
    selectedPersonnelIds.value.push(id);
  } else {
    selectedPersonnelIds.value = selectedPersonnelIds.value.filter(item => item !== id);
  }
};

const isSelected = (id) => selectedPersonnelIds.value.includes(id);

onMounted(() => {
  fetchPersonnelList(); // Load initial data
});
</script>

<template>
  <div class="identity-submission-view card">
    <h3 class="view-title">平台内的经营者和从业人员身份信息报送表</h3>

    <div class="search-form">
      <div class="form-group">
        <label for="reportingPeriod">所属期:</label>
        <input type="month" id="reportingPeriod" v-model="reportingPeriod" class="input-field" placeholder="YYYY-MM">
      </div>
      <div class="form-group">
        <label for="keyword">关键字查询:</label>
        <input type="text" id="keyword" v-model="keyword" class="input-field" placeholder="证件号 / 姓名">
      </div>
      <button @click="fetchPersonnelList" class="button">查询</button>
      <button @click="oneClickSubmit" class="button primary-button">一键报送</button>
      <button @click="postponeSubmission" class="button secondary-button">暂缓报送</button>
    </div>

    <div class="alert-info info-box-top">
      1. 校验规则参照以上政策法规和标准文件，若有误，请及时向平台实名办反馈。
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" @change="e => selectedPersonnelIds = e.target.checked ? personnelList.map(p => p.id) : []" :checked="selectedPersonnelIds.length === personnelList.length && personnelList.length > 0"></th>
            <th>序号</th>
            <th>所属期</th>
            <th>一体化报送标识</th>
            <th>专业类别</th>
            <th>姓名</th>
            <th>证件种类</th>
            <th>证件号</th>
            <th>国籍地区</th>
            <th>性别</th>
            <th>出生日期</th>
            <th>联系电话</th>
            <th>报送状态</th>
            <th>报送操作</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in personnelList" :key="person.id">
            <td><input type="checkbox" :checked="isSelected(person.id)" @change="e => handleRowSelection(person.id, e.target.checked)"></td>
            <td>{{ person.no }}</td>
            <td>{{ person.period }}</td>
            <td>{{ person.unifiedId }}</td>
            <td>{{ person.category }}</td>
            <td>{{ person.name }}</td>
            <td>{{ person.idType }}</td>
            <td>{{ person.idNumber }}</td>
            <td>{{ person.nationality }}</td>
            <td>{{ person.gender }}</td>
            <td>{{ person.dob }}</td>
            <td>{{ person.contact }}</td>
            <td>
              <span :class="{'status-success': person.status === '已报送', 'status-warning': person.status === '待报送'}">
                {{ person.status }}
              </span>
            </td>
            <td>
              <button
                v-if="person.status === '待报送'"
                @click="submitPersonnel([person.id])"
                class="button small-button"
              >
                报送
              </button>
              <span v-else>--</span>
            </td>
            <td>{{ person.remark }}</td>
          </tr>
          <tr v-if="personnelList.length === 0">
            <td colspan="15" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <!-- Pagination components would go here in a real app -->
      <p>Total {{ personnelList.length }} items</p>
    </div>

    <div class="alert-info info-box-bottom">
      <p>温馨提示：若数据有误，需自行修改或撤销报送。</p>
      <p>具体操作流程：</p>
      <ul>
        <li>【修改撤销】一体化报送：暂不支持修改撤销操作，需联系主管税务机关处理</li>
        <li>【修改撤销】二次报送：一体化报送：暂不支持修改撤销操作，需联系主管税务机关处理</li>
        <li>【修改撤销】一体化报送：暂不支持修改撤销操作，需联系主管税务机关处理</li>
        <li>【修改撤销】一体化报送：暂不支持修改撤销操作，需联系主管税务机关处理</li>
      </ul>
      <p>问题：1. 未报送数总和，核对后与实际不一致？</p>
      <p>2. 请检查核对企业注册信息是否完整，企业信息报送渠道是否匹配，报送数据是否正确？</p>
      <p>3. 确认企业注册信息后，如果实际报送人员数据不一致，请核对人员信息是否完整。</p>
      <p style="text-align: center; margin-top: 20px; font-weight: bold; color: var(--color-primary);">点击报送一体化，企业代表企业依法报送个人税赋信息，请确认无误后点击。</p>
    </div>

    <!-- Submission Result Modal -->
    <div v-if="showSubmissionResultModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <span>提示</span>
          <button @click="showSubmissionResultModal = false" class="modal-close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p>本次共提交报送数据：{{ submissionResult.total }}条</p>
          <p>报送成功记录：{{ submissionResult.success }}条</p>
          <p>报送失败记录：{{ submissionResult.failed }}条</p>
          <p>报送跳过记录：{{ submissionResult.skipped }}条</p>
        </div>
        <div class="modal-footer">
          <button @click="showSubmissionResultModal = false" class="button">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.identity-submission-view {
  padding: 30px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.view-title {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 20px;
  color: var(--color-text-dark);
}

.search-form {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.form-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: var(--color-text-dark);
}

.primary-button {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.secondary-button {
  background-color: #fff;
  border-color: #dcdfe6;
  color: var(--color-text-dark);
}
.secondary-button:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.small-button {
  padding: 5px 10px;
  font-size: 12px;
}

.info-box-top {
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap; /* Prevent text wrapping in table cells */
}

table thead th {
  background-color: var(--color-table-header);
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  font-size: 14px;
  color: var(--color-text-dark);
  border-bottom: 1px solid var(--color-border);
}

table tbody td {
  padding: 10px 15px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text-light);
}

table tbody tr:last-child td {
  border-bottom: none;
}

table tbody tr:hover {
  background-color: #f8f8f8;
}

.status-success {
  color: var(--color-success);
  font-weight: bold;
}

.status-warning {
  color: var(--color-warning);
  font-weight: bold;
}

.no-data {
  text-align: center;
  padding: 40px !important;
  color: var(--color-text-light);
}

.pagination {
  text-align: right;
  margin-top: 20px;
  color: var(--color-text-light);
  font-size: 14px;
}

.info-box-bottom {
  margin-top: 30px;
}

.info-box-bottom ul {
  list-style-type: disc;
  margin-left: 20px;
  padding-left: 0;
  margin-bottom: 15px;
}
.info-box-bottom li {
  margin-bottom: 5px;
}
.info-box-bottom p {
  margin-bottom: 10px;
  line-height: 1.6;
}
.info-box-bottom p:last-of-type {
    margin-bottom: 0;
}
</style>
