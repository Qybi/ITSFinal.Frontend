import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, InputNumber, Button, Card, message, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { AppContext } from '../../contexts/AppContext.jsx';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function SensorDataForm({ sensorDataId, onSave, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { API_BASE_URL } = useContext(AppContext);
  
  // Use sensorDataId prop or id from params
  const dataId = sensorDataId || id;
  const isEditing = Boolean(dataId);

  useEffect(() => {
    if (isEditing && dataId) {
      fetchSensorData();
    }
  }, [dataId]);

  const fetchSensorData = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sensors-data/edit/${dataId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sensor data');
      }
      
      const data = await response.json();
      console.log('sensor data:', data);
      setSensorData(data);
      
      // Set form values with parsed timestamp
      form.setFieldsValue({
        ...data,
        timestamp: data.timestamp ? dayjs(data.timestamp) : null,
        id: id,
        sensorId: data.sensorId
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      message.error('Failed to load sensor data');
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // Format the data for API
      const formattedValues = {
        ...values,
        timestamp: values.timestamp ? values.timestamp.toISOString() : null,
      };

      const url = isEditing 
        ? `${API_BASE_URL}/api/sensors-data/${dataId}` 
        : `${API_BASE_URL}/api/sensors-data`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} sensor data`);
      }

      const result = await response.json();
      message.success(`Sensor data ${isEditing ? 'updated' : 'created'} successfully!`);
      
      // Call onSave callback if provided, otherwise navigate
      if (onSave) {
        onSave(result);
      } else {
        navigate(-1); // Go back to previous page
      }
    } catch (error) {
      console.error('Error saving sensor data:', error);
      message.error(`Failed to ${isEditing ? 'update' : 'create'} sensor data`);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check the form fields and try again');
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  if (initialLoading) {
    return (
      <Card loading={true} style={{ margin: '16px 0' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading sensor data...
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleCancel}
          />
          {isEditing ? 'Edit Sensor Data' : 'Create New Sensor Data'}
        </div>
      }
      style={{ margin: '16px 0', maxWidth: '800px' }}
    >
      <Form
        form={form}
        name="sensorDataForm"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          magnitude: 0,
          latitude: 0,
          longitude: 0,
          depth: 0,
        }}
      >
        {/* Timestamp - Restricted for editing */}
        <Form.Item
          label="Timestamp"
          name="timestamp"
          rules={[
            {
              required: true,
              message: 'Please select the timestamp!',
            },
          ]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select timestamp"
            style={{ width: '100%' }}
            disabled={isEditing} // Disable when editing existing data
          />
        </Form.Item>

        {isEditing && (
          <div style={{ 
            backgroundColor: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: '4px', 
            padding: '8px 12px', 
            marginBottom: '16px',
            fontSize: '12px',
            color: '#d46b08'
          }}>
            ⚠️ Timestamp cannot be modified for existing records
          </div>
        )}

        {/* Magnitude */}
        <Form.Item
          label="Magnitude"
          name="magnitude"
          rules={[
            {
              required: true,
              message: 'Please input the magnitude!',
            },
            {
              type: 'number',
              min: 0,
              max: 10,
              message: 'Magnitude must be between 0 and 10!',
            },
          ]}
        >
          <InputNumber
            placeholder="Enter magnitude (0-10)"
            style={{ width: '100%' }}
            step={0.1}
            precision={2}
            min={0}
            max={10}
          />
        </Form.Item>

        {/* Latitude */}
        <Form.Item
          label="Latitude"
          name="latitude"
          rules={[
            {
              required: true,
              message: 'Please input the latitude!',
            },
            {
              type: 'number',
              min: -90,
              max: 90,
              message: 'Latitude must be between -90 and 90!',
            },
          ]}
        >
          <InputNumber
            placeholder="Enter latitude (-90 to 90)"
            style={{ width: '100%' }}
            step={0.000001}
            precision={6}
            min={-90}
            max={90}
          />
        </Form.Item>

        {/* Longitude */}
        <Form.Item
          label="Longitude"
          name="longitude"
          rules={[
            {
              required: true,
              message: 'Please input the longitude!',
            },
            {
              type: 'number',
              min: -180,
              max: 180,
              message: 'Longitude must be between -180 and 180!',
            },
          ]}
        >
          <InputNumber
            placeholder="Enter longitude (-180 to 180)"
            style={{ width: '100%' }}
            step={0.000001}
            precision={6}
            min={-180}
            max={180}
          />
        </Form.Item>

        {/* Depth */}
        <Form.Item
          label="Depth (km)"
          name="depth"
          rules={[
            {
              required: true,
              message: 'Please input the depth!',
            },
            {
              type: 'number',
              min: 0,
              message: 'Depth must be a positive number!',
            },
          ]}
        >
          <InputNumber
            placeholder="Enter depth in kilometers"
            style={{ width: '100%' }}
            step={0.1}
            precision={1}
            min={0}
            addonAfter="km"
          />
        </Form.Item>

        {/* Notes */}
        <Form.Item
          label="Notes"
          name="notes"
          rules={[
            {
              max: 1000,
              message: 'Notes must not exceed 1000 characters!',
            },
          ]}
        >
          <TextArea
            placeholder="Enter additional notes or observations"
            rows={4}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          label="id"
          hidden={true}
          name="id"
        >
          <Input value={id} readOnly />
        </Form.Item>

        <Form.Item
          label="sensorId"
          hidden={true}
          name="sensorId"
        >
          <Input readOnly />
        </Form.Item>

        {/* Form Actions */}
        <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {isEditing ? 'Update Data' : 'Create Data'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
