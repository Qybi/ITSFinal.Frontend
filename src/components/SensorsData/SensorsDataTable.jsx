import React, { useState, useEffect, useContext } from 'react';
import { Table, Card, Button, Input, DatePicker, Space, Tag, Tooltip, message, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import SensorDataForm from './SensorDataForm.jsx';
import { AppContext } from '../../contexts/AppContext.jsx';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

export default function SensorsDataTable({ sensorId }) {
  const [sensorsData, setSensorsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const navigate = useNavigate();
  
  const { API_BASE_URL } = useContext(AppContext);

  // Fetch sensors data
  const fetchSensorsData = async () => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/api/sensors-data?sensorId=${sensorId}`
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch sensors data');
      }
      
      const data = await response.json();
      console.log('sensors data:', data);
      setSensorsData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching sensors data:', error);
      message.error('Failed to load sensors data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorsData();
  }, [sensorId]);

  // Filter data based on search text and date range
  useEffect(() => {
    let filtered = sensorsData;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(item =>
        item.notes?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.magnitude?.toString().includes(searchText) ||
        item.latitude?.toString().includes(searchText) ||
        item.longitude?.toString().includes(searchText) ||
        item.depth?.toString().includes(searchText)
      );
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.timestamp);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      });
    }

    setFilteredData(filtered);
  }, [sensorsData, searchText, dateRange]);

  const getMagnitudeColor = (magnitude) => {
    if (magnitude < 2) return 'green';
    if (magnitude < 4) return 'orange';
    if (magnitude < 6) return 'red';
    return 'purple';
  };

  const getDepthColor = (depth) => {
    if (depth < 10) return 'cyan';
    if (depth < 50) return 'blue';
    if (depth < 100) return 'geekblue';
    return 'purple';
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      render: (timestamp) => (
        <span>
          {dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: 'Magnitude',
      dataIndex: 'magnitude',
      key: 'magnitude',
      width: 120,
      sorter: (a, b) => a.magnitude - b.magnitude,
      render: (magnitude) => (
        <Tag color={getMagnitudeColor(magnitude)}>
          {magnitude?.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      key: 'latitude',
      width: 120,
      sorter: (a, b) => a.latitude - b.latitude,
      render: (latitude) => (
        <Tooltip title={`Latitude: ${latitude}`}>
          <span style={{ fontFamily: 'monospace' }}>
            {latitude?.toFixed(6)}°
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      key: 'longitude',
      width: 120,
      sorter: (a, b) => a.longitude - b.longitude,
      render: (longitude) => (
        <Tooltip title={`Longitude: ${longitude}`}>
          <span style={{ fontFamily: 'monospace' }}>
            {longitude?.toFixed(6)}°
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Depth',
      dataIndex: 'depth',
      key: 'depth',
      width: 120,
      sorter: (a, b) => a.depth - b.depth,
      render: (depth) => (
        <Tag color={getDepthColor(depth)}>
          {depth?.toFixed(1)} km
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: {
        showTitle: false,
      },
      render: (notes) => (
        <Tooltip placement="topLeft" title={notes}>
          {notes || '-'}
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (text, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
            title="View Details"
          />
        </Space>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    console.log('View details for record:', record);

    navigate(`/sensors-data/edit/${record.id}`)
  };

  const handleRefresh = () => {
    fetchSensorsData();
    setSearchText('');
    setDateRange(null);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {sensorId ? `Sensor ${sensorId} Data` : 'Sensors Data'}
          </span>
          {/* <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button> */}
        </div>
      }
      style={{ margin: '16px 0' }}
    >
      {/* Filters */}
      {/* <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input.Search
            placeholder="Search by notes, magnitude, coordinates, or depth"
            allowClear
            style={{ width: 300 }}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['Start Time', 'End Time']}
            onChange={handleDateRangeChange}
            value={dateRange}
            style={{ width: 350 }}
          />
        </Space>
      </div> */}

      {/* Statistics */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Tag color="blue">Total Records: {filteredData.length}</Tag>
          {filteredData.length > 0 && (
            <>
              <Tag color="green">
                Avg Magnitude: {(filteredData.reduce((sum, item) => sum + item.magnitude, 0) / filteredData.length).toFixed(2)}
              </Tag>
              <Tag color="orange">
                Max Magnitude: {Math.max(...filteredData.map(item => item.magnitude)).toFixed(2)}
              </Tag>
              <Tag color="purple">
                Avg Depth: {(filteredData.reduce((sum, item) => sum + item.depth, 0) / filteredData.length).toFixed(1)} km
              </Tag>
            </>
          )}
        </Space>
      </div>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={(record, index) => `${record.timestamp}-${index}`}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </Card>
  );
}
