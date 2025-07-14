import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Spin, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { AppContext } from '../../contexts/AppContext.jsx';
import SensorsDataTable from '../SensorsData/SensorsDataTable.jsx';

export default function Sensor() {
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const { API_BASE_URL } = React.useContext(AppContext);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/sensors/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Sensor not found');
          }
          return response.json();
        })
        .then(data => {
          console.log('sensor data:', data);
          setSensor(data);
        })
        .catch(error => {
          console.error('Error fetching sensor:', error);
          message.error('Failed to load sensor data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Loading sensor...</p>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Sensor not found</h2>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/sensors')}
        >
          Back to Sensors
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Card
        title={`Sensor: ${sensor.code}`}
        extra={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              icon={<EditOutlined />}
              onClick={() => navigate(`/sensors/edit/${sensor.id}`)}
            >
              Edit
            </Button>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/sensors')}
            >
              Back
            </Button>
          </div>
        }
      >
        <Descriptions 
          bordered 
          column={1}
          size="middle"
        >
          <Descriptions.Item label="ID">
            {sensor.id}
          </Descriptions.Item>
          <Descriptions.Item label="Code">
            <code style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              {sensor.code}
            </code>
          </Descriptions.Item>
          <Descriptions.Item label="Latitude">
            {sensor.latitude}
          </Descriptions.Item>
          <Descriptions.Item label="Longitude">
            {sensor.longitude}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <SensorsDataTable sensorId={id} />
    </div>
  );
}
