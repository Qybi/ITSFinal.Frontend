import React from "react";
import { useEffect } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext.jsx";

export default function Categories() {
  const [categories, setCategories] = React.useState([]);
  const navigate = useNavigate();

  const { API_BASE_URL } = React.useContext(AppContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        console.log("categories data:", data);
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <a href={`/categories/${record.id}`}>View</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href={`/categories/edit/${record.id}`}>Edit</a>
          <span style={{ margin: "0 8px" }}>|</span>
          <a href={`/categories/delete/${record.id}`}>Delete</a>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Categories</h1>
      <Button type="primary" onClick={() => navigate("/categories/new")}>
        Add New
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
