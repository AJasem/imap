import { Form, Input, Button, Select } from "antd";
import React from "react";
import useSignUp from "../hooks/useSignUp";

const { Option } = Select;

function SignUp() {
  const signUp = useSignUp();
  const onFinish = (values) => {
    signUp(values);
  };
  return (
    <div className="form">
      <Form name="sign_up" initialValues={{ remember: true, deletionTime: "1" }} onFinish={onFinish}>
        <h3>Sign Up</h3>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "@ahmads.dev",
              type: "email",
            },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="deletionTime"
          rules={[{ required: true, message: "Please select deletion time!" }]}
        >
          <Select placeholder="Select deletion time">
            <Option value="1">1 day</Option>
            <Option value="3">3 days</Option>
            <Option value="7">1 week</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUp;