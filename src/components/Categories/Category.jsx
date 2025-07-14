import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Spin, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { AppContext } from '../../contexts/AppContext.jsx';

export default function Category() {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const { API_BASE_URL } = React.useContext(AppContext);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/api/categories/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Category not found');
          }
          return response.json();
        })
        .then(data => {
          console.log('category data:', data);
          setCategory(data);
        })
        .catch(error => {
          console.error('Error fetching category:', error);
          message.error('Failed to load category data');
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
        <p style={{ marginTop: '16px' }}>Loading category...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Category not found</h2>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/categories')}
        >
          Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card
        title={`Category: ${category.name}`}
        extra={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              icon={<EditOutlined />}
              onClick={() => navigate(`/categories/edit/${category.id}`)}
            >
              Edit
            </Button>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/categories')}
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
            {category.id}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {category.name}
          </Descriptions.Item>
          <Descriptions.Item label="Code">
            <code style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              {category.code}
            </code>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
