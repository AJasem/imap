import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const { email, password } = values;
    try {
      const response = await axios.post("https://api.ahmads.dev/login", {
        email: email,
        password: password,
      });
      const data = response.data;
      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem("token", JSON.stringify(data.token));
        navigate("/mailbox");
      } else {
        message.error(`${data.message}`);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;
        message.error(`${errorMessage}`);
      } else {
        message.error(`${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <h3>Sign In</h3>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Login;
