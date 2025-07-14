import React from "react";
import { useState, useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext.jsx";
import TextArea from "antd/es/input/TextArea.js";

export default function SensorForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sensor, setSensor] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const { API_BASE_URL } = React.useContext(AppContext);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      // Fetch sensor data for editing
      setLoading(true);
      fetch(`${API_BASE_URL}/api/sensors/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch sensor");
          }
          return response.json();
        })
        .then((data) => {
          setSensor(data);
          form.setFieldsValue(data);
        })
        .catch((error) => {
          console.error("Error fetching sensor:", error);
          message.error("Failed to load sensor data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing, form]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const url = isEditing
        ? `${API_BASE_URL}/api/sensors/${id}`
        : `${API_BASE_URL}/api/sensors`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} sensor`);
      }

      const result = await response.json();
      message.success(
        `Sensor ${isEditing ? "updated" : "created"} successfully!`
      );
      navigate("/sensors");
    } catch (error) {
      console.error("Error saving sensor:", error);
      message.error(`Failed to ${isEditing ? "update" : "create"} sensor`);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form fields and try again");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <Card
        title={isEditing ? "Edit Sensor" : "Create New Sensor"}
        extra={
          <Button onClick={() => navigate("/sensors")}>Back to Sensors</Button>
        }
      >
        <Form
          form={form}
          name="sensorForm"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {isEditing && (
            <Form.Item label="ID" name="id">
              <Input disabled placeholder="Auto-generated ID" />
            </Form.Item>
          )}

          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input the sensor code!",
              },
              {
                min: 2,
                message: "Code must be at least 2 characters long!",
              },
              {
                max: 50,
                message: "Code must not exceed 50 characters!",
              },
            ]}
          >
            <Input placeholder="Enter sensor code" />
          </Form.Item>

          <Form.Item
            label="Latitude"
            name="latitude"
            rules={[
              {
                required: true,
                message: "Please input the latitude!",
              },
              {
                pattern: /^-?([1-8]?[0-9]\.{1}\d{1,}|90\.{1}0{1,})$/,
                message: "Please enter a valid latitude (-90 to 90)!",
              },
            ]}
          >
            <Input placeholder="Enter latitude (e.g., 45.123456)" />
          </Form.Item>

          <Form.Item
            label="Longitude"
            name="longitude"
            rules={[
              {
                required: true,
                message: "Please input the longitude!",
              },
              {
                pattern: /^-?((1[0-7][0-9])|([1-9]?[0-9]))\.{1}\d{1,}$/,
                message: "Please enter a valid longitude (-180 to 180)!",
              },
            ]}
          >
            <Input placeholder="Enter longitude (e.g., 7.123456)" />
          </Form.Item>

          <Form.Item style={{ marginTop: "32px" }}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={() => navigate("/sensors")} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? "Update Sensor" : "Create Sensor"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
