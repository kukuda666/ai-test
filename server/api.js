const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS for all routes - IMPORTANT for frontend to communicate
app.use(cors()); 
// To parse JSON request bodies
app.use(bodyParser.json()); 

// Mock data for personnel
let mockPersonnelData = [];
const generateMockData = (count = 50) => {
  const data = [];
  const idTypes = ['身份证', '护照', '驾驶证'];
  const genders = ['男', '女'];
  for (let i = 1; i <= count; i++) {
    const period = `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`;
    const idType = idTypes[Math.floor(Math.random() * idTypes.length)];
    // Simplified ID number generation
    const idNumber = `32010${Math.floor(Math.random() * 900000000000) + 100000000000}`.substring(0, 18); 
    const name = `张三${i}`;
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const dob = `198${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const contactPhone = `13${Math.floor(Math.random() * 900000000) + 100000000}`;
    data.push({
      id: i,
      period,
      idType,
      idNumber,
      name,
      gender,
      dob,
      contactPhone,
      status: 'pending', // Added status for reporting simulation: 'pending', 'reported', 'failed'
    });
  }
  return data;
};

mockPersonnelData = generateMockData();

// API to get personnel list
app.get('/api/personnel', (req, res) => {
  const { period, keyword, currentPage = 1, pageSize = 10 } = req.query;

  let filteredData = mockPersonnelData;

  // Filter by period
  if (period) {
    filteredData = filteredData.filter(p => p.period.includes(period));
  }
  // Filter by keyword (ID number or Name)
  if (keyword) {
    const lowerCaseKeyword = keyword.toLowerCase();
    filteredData = filteredData.filter(p =>
      p.idNumber.toLowerCase().includes(lowerCaseKeyword) || 
      p.name.toLowerCase().includes(lowerCaseKeyword)
    );
  }

  // Pagination
  const page = parseInt(currentPage);
  const size = parseInt(pageSize);
  const startIndex = (page - 1) * size;
  const endIndex = page * size;

  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    total: filteredData.length,
    currentPage: page,
    pageSize: size,
  });
});

// API to report personnel
app.post('/api/report', (req, res) => {
  const { ids } = req.body; // ids is an array of personnel IDs to be reported

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'No personnel IDs provided for reporting.' });
  }

  let successCount = 0;
  let failureCount = 0;
  const failureDetails = [];

  ids.forEach(id => {
    const personIndex = mockPersonnelData.findIndex(p => p.id === id);
    if (personIndex !== -1) {
      // Simulate some failures (e.g., random 20% failure rate) and already reported status
      if (mockPersonnelData[personIndex].status === 'reported') {
        failureCount++;
        failureDetails.push(`ID: ${id} - 已报送`);
      } else if (Math.random() < 0.2) { // 20% chance of failure
        failureCount++;
        failureDetails.push(`ID: ${id} - 模拟报送失败`);
        mockPersonnelData[personIndex].status = 'failed'; // Update status to 'failed'
      } else {
        successCount++;
        mockPersonnelData[personIndex].status = 'reported'; // Update status to 'reported'
      }
    } else {
      failureCount++;
      failureDetails.push(`ID: ${id} - 未找到人员`);
    }
  });

  res.json({
    message: 'Reporting process completed.',
    successCount,
    failureCount,
    failureDetails,
    reportedIds: ids,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  console.log('To run this backend, ensure you have Node.js installed.');
  console.log('Install dependencies: npm install express cors body-parser');
  console.log('Then run: node server.js');
});
