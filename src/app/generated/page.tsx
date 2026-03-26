/*
* app/personnel-report/page.tsx
* This component renders the personnel reporting page.
* It includes a search bar, a table to display personnel, and action buttons for reporting.
* It uses Ant Design for UI components to achieve a clean and enterprise-ready look.
* The layout uses Tailwind CSS for spacing and overall structure.
*/

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Input, Button, DatePicker, Space, Modal, message, Tag } from 'antd';
import { SearchOutlined, UploadOutlined, SyncOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import moment, { Moment } from 'moment';
import './globals.css'; // Ensure global Ant Design styles are loaded, or configure through Next.js theme

const { RangePicker } = DatePicker;

// Define the structure for a personnel record
interface Personnel {
  id: string;
  serialNo: number;
  reportingPeriod: string; // YYYY-MM
  name: string;
  idNumber: string;
  nationality: string;
  firstDeclarationDate: string; // YYYY-MM-DD
  occurrenceDate: string; // YYYY-MM-DD
  reporterName: string;
  contactInfo: string;
  declaringAgency: string;
  idType: string;
  idExpiryDate: string; // YYYY-MM-DD
  declaringEntityIdentity: string;
  status: 'pending' | 'reported' | 'failed';
  key: string; // Ant Design table requires a unique key
}

// Define pagination state structure
interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const PersonnelReportPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Personnel[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [reportingPeriod, setReportingPeriod] = useState<[Moment, Moment] | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  // Function to fetch personnel data from the API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString(),
      });
      if (reportingPeriod && reportingPeriod[0] && reportingPeriod[1]) {
        params.append('startDate', reportingPeriod[0].format('YYYY-MM-DD'));
        params.append('endDate', reportingPeriod[1].format('YYYY-MM-DD'));
      }
      if (keyword) {
        params.append('keyword', keyword);
      }

      const response = await fetch(`/api/personnel/list?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Map the data to include a serial number and key for Ant Design table
      setData(result.data.map((item: Personnel, index: number) => ({
        ...item,
        serialNo: (pagination.current - 1) * pagination.pageSize + index + 1,
        key: item.id
      })));
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error('Failed to fetch personnel data:', error);
      message.error('加载人员列表失败。');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, reportingPeriod, keyword]);

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle search action (resets pagination to page 1)
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page on new search
    // fetchData will be called via useEffect due to pagination.current change
  };

  // Handle reporting multiple selected personnel
  const handleReport = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一位人员进行报送。');
      return;
    }

    Modal.confirm({
      title: '确认报送',
      content: `确定要报送选中的 ${selectedRowKeys.length} 位人员吗？`,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/personnel/report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: selectedRowKeys }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          message.success(result.message || '报送成功！');
          setSelectedRowKeys([]); // Clear selection after successful report
          fetchData(); // Refresh list to update statuses
        } catch (error) {
          console.error('Failed to report personnel:', error);
          message.error('报送失败。');
        } finally {
          setLoading(false);
        }
      },
      maskClosable: false,
    });
  };

  // Handle reporting a single personnel directly from the action column
  const handleReportSingle = async (id: string) => {
    Modal.confirm({
      title: '确认报送',
      content: '确定要报送此人员吗？',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/personnel/report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: [id] }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          message.success(result.message || '报送成功！');
          fetchData(); // Refresh list to update statuses
        } catch (error) {
          console.error('Failed to report personnel:', error);
          message.error('报送失败。');
        } finally {
          setLoading(false);
        }
      },
      maskClosable: false,
    });
  };

  // Callback for when table row selections change
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Configuration for row selection in Ant Design table
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Define table columns
  const columns: TableProps<Personnel>['columns'] = [
    {
      title: '序号',
      dataIndex: 'serialNo',
      key: 'serialNo',
      width: 70,
      fixed: 'left',
    },
    {
      title: '所属期',
      dataIndex: 'reportingPeriod',
      key: 'reportingPeriod',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '证件号',
      dataIndex: 'idNumber',
      key: 'idNumber',
      width: 180,
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width: 80,
    },
    {
      title: '首次申报日期',
      dataIndex: 'firstDeclarationDate',
      key: 'firstDeclarationDate',
      width: 140,
    },
    {
      title: '发生日期',
      dataIndex: 'occurrenceDate',
      key: 'occurrenceDate',
      width: 140,
    },
    {
      title: '报送人姓名',
      dataIndex: 'reporterName',
      key: 'reporterName',
      width: 120,
    },
    {
      title: '联系方式',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      width: 120,
    },
    {
      title: '申报中介机构',
      dataIndex: 'declaringAgency',
      key: 'declaringAgency',
      width: 150,
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      key: 'idType',
      width: 100,
    },
    {
      title: '证件有效期',
      dataIndex: 'idExpiryDate',
      key: 'idExpiryDate',
      width: 140,
    },
    {
      title: '申报主体身份',
      dataIndex: 'declaringEntityIdentity',
      key: 'declaringEntityIdentity',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'pending' | 'reported' | 'failed') => {
        let color = 'gold';
        let text = '待报送';
        if (status === 'reported') {
          color = 'green';
          text = '已报送';
        } else if (status === 'failed') {
          color = 'red';
          text = '报送失败';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' ? (
            <Button type="link" size="small" onClick={() => handleReportSingle(record.id)}>
              报送
            </Button>
          ) : (
            <Button type="link" size="small" disabled>
              查看
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Handle table pagination, sorting, and filtering changes
  const handleTableChange: TableProps<Personnel>['onChange'] = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  // Show a modal with hint information (as per prototype image)
  const showHintModal = () => {
    setModalContent({
      title: '提示',
      body: '此处显示详细提示信息，例如报送规则、注意事项等。\n\n已报送记录: 100条\n待报送记录: 50条\n报送成功记录: 45条\n报送失败记录: 5条'
    });
    setIsModalVisible(true);
  };

  // Close the hint modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">身份信息报送</h1>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-medium mb-4 text-gray-700">平台内的经营者和从业人员身份信息报送表</h2>
        <p className="text-gray-500 text-sm mb-4">此功能用于查询平台内的经营者和从业人员的身份信息及报送情况。</p>

        {/* Search and Filter Section */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Space>
            <span className="text-gray-700">所属期:</span>
            <RangePicker
              onChange={(dates) => setReportingPeriod(dates as [Moment, Moment])}
              value={reportingPeriod}
              picker="month"
              format="YYYY-MM"
              className="w-[180px]"
            />
            <span className="text-gray-700">关键字:</span>
            <Input
              placeholder="证件号/姓名"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-[200px]"
              onPressEnter={handleSearch}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
            <Button
              icon={<SyncOutlined />}
              onClick={() => {
                setReportingPeriod(null);
                setKeyword('');
                setSelectedRowKeys([]);
                setPagination(prev => ({ ...prev, current: 1 })); // Trigger refetch via useEffect
              }}
            >
              重置
            </Button>
          </Space>
        </div>

        {/* Action Buttons Section */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Button type="primary" icon={<UploadOutlined />} onClick={handleReport} disabled={selectedRowKeys.length === 0 || loading}>
              一键报送
            </Button>
            <Button className="ml-3" onClick={() => message.info('功能开发中：跳转到数据报送记录页面')}>
              数据报送记录
            </Button>
          </div>
          <Button type="link" onClick={showHintModal}>查看报送信息</Button>
        </div>

        {/* Personnel Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={{
            ...pagination,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 2000 }} // Enable horizontal scrolling for wide table
          bordered
          size="small"
        />
      </div>

      {/* Hint Modal */}
      <Modal
        title={modalContent?.title}
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="submit" type="primary" onClick={handleModalClose}>
            知道了
          </Button>,
        ]}
        maskClosable={false}
      >
        <p style={{ whiteSpace: 'pre-line' }}>{modalContent?.body}</p>
      </Modal>
    </div>
  );
};

export default PersonnelReportPage;
