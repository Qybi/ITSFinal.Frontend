import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext.jsx';

export default function CategoryForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const { API_BASE_URL } = React.useContext(AppContext);
  
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Fetch category data for editing
      setLoading(true);
      fetch(`${API_BASE_URL}/api/categories/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch category');
          }
          return response.json();
        })
        .then(data => {
          setCategory(data);
          form.setFieldsValue(data);
        })
        .catch(error => {
          console.error('Error fetching category:', error);
          message.error('Failed to load category data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing, form]);

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const url = isEditing ? `${API_BASE_URL}/api/categories/${id}` : `${API_BASE_URL}/api/categories`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} category`);
      }

      const result = await response.json();
      message.success(`Category ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      message.error(`Failed to ${isEditing ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check the form fields and try again');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card 
        title={isEditing ? 'Edit Category' : 'Create New Category'}
        extra={
          <Button onClick={() => navigate('/categories')}>
            Back to Categories
          </Button>
        }
      >
        <Form
          form={form}
          name="categoryForm"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {isEditing && (
            <Form.Item
              label="ID"
              name="id"
            >
              <Input disabled placeholder="Auto-generated ID" />
            </Form.Item>
          )}

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input the category name!',
              },
              {
                min: 2,
                message: 'Name must be at least 2 characters long!',
              },
              {
                max: 100,
                message: 'Name must not exceed 100 characters!',
              },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: 'Please input the category code!',
              },
              {
                min: 2,
                message: 'Code must be at least 2 characters long!',
              },
              {
                max: 20,
                message: 'Code must not exceed 20 characters!',
              },
              {
                pattern: /^[A-Z0-9_]+$/,
                message: 'Code must contain only uppercase letters, numbers, and underscores!',
              },
            ]}
          >
            <Input 
              placeholder="Enter category code (e.g., ELECTRONICS)" 
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => navigate('/categories')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {isEditing ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
