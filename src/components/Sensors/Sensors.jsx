import React from "react";
import { useEffect } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext.jsx";

export default function Sensors() {
  const [sensors, setSensors] = React.useState([]);
  const navigate = useNavigate();

  const { API_BASE_URL } = React.useContext(AppContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sensors`)
      .then((response) => response.json())
      .then((data) => {
        console.log("sensors data:", data);
        setSensors(data);
      })
      .catch((error) => {
        console.error("Error fetching sensors:", error);
      });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      key: "latitude",
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <a href={`/sensors/${record.id}`}>View Data</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href={`/sensors/edit/${record.id}`}>Edit</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href={`/sensors/delete/${record.id}`}>Delete</a>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Sensors</h1>
      <Button type="primary" onClick={() => navigate("/sensors/new")}>
        Add New
      </Button>
      <Table
        columns={columns}
        dataSource={sensors}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
