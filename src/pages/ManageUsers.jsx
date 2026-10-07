import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Switch, message, Card, Space, Typography } from "antd";
import { ArrowLeftOutlined, EditOutlined, UserOutlined, ProjectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";

const { Title, Text } = Typography;

const ManageUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // --- Demo Data ---
  const demoTasks = [
    { id: "task-1", title: "Frontend Implementation", project: "E-Commerce Web", userCount: 2 },
    { id: "task-2", title: "Backend API Setup", project: "E-Commerce Web", userCount: 1 },
    { id: "task-3", title: "Mobile App UI Design", project: "Mobile App", userCount: 1 },
  ];

  const demoUsers = [
    {
      id: "1",
      taskId: "task-1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "Lead Developer",
      isActive: true,
    },
    {
      id: "2",
      taskId: "task-1",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      role: "Frontend Dev",
      isActive: true,
    },
    {
      id: "3",
      taskId: "task-2",
      firstName: "Robert",
      lastName: "Brown",
      email: "robert.b@example.com",
      role: "Backend Dev",
      isActive: true,
    },
    {
      id: "4",
      taskId: "task-3",
      firstName: "Alice",
      lastName: "Green",
      email: "alice.g@example.com",
      role: "UI Designer",
      isActive: false,
    },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    // Simulate API call to fetch tasks
    setTimeout(() => {
      setTasks(demoTasks);
      setLoading(false);
    }, 800);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setLoading(true);
    // Simulate API call to fetch users for the selected task
    setTimeout(() => {
      const filteredUsers = demoUsers.filter(u => u.taskId === task.id);
      setUsers(filteredUsers);
      setLoading(false);
    }, 500);
  };

  const handleBackToTasks = () => {
    setSelectedTask(null);
    setUsers([]);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u))
      );
      setLoading(false);
      message.success(`User ${newStatus ? "activated" : "deactivated"} successfully!`);
    }, 500);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u))
        );
        setLoading(false);
        setIsEditModalVisible(false);
        setEditingUser(null);
        message.success("User details updated successfully!");
      }, 500);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // --- Column Definitions ---

  const taskColumns = [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Assigned Users",
      dataIndex: "userCount",
      key: "userCount",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleTaskSelect(record)}>
          Manage Users
        </Button>
      ),
    },
  ];

  const userColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          onChange={() => handleToggleStatus(record)}
          loading={loading}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card
        className="shadow-lg"
        title={
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={selectedTask ? handleBackToTasks : () => navigate("/tracker")}
              type="text"
            />
            <Title level={3} style={{ margin: 0 }}>
              {selectedTask ? `Users for: ${selectedTask.title}` : "Select a Task to Manage Users"}
            </Title>
          </div>
        }
      >
        {selectedTask ? (
          <div>
            <div className="mb-4 flex items-center gap-2 text-gray-500">
               <ProjectOutlined /> <Text type="secondary">Project: {selectedTask.project}</Text>
            </div>
            <Table
              dataSource={users}
              columns={userColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </div>
        ) : (
          <Table
            dataSource={tasks}
            columns={taskColumns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title="Edit User Details"
        open={isEditModalVisible}
        onOk={handleUpdateUser}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
