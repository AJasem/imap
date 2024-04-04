import { Form, Input, Button } from "antd";
import React from "react";
import useSignUp from "../hooks/useSignUp";

function SignUp() {
  const signUp = useSignUp();
  const onFinish = (values) => {
    signUp(values);
  };
  return (
    <div className="form">
    <Form name="sign_up" initialValues={{ remember: true }} onFinish={onFinish}>
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
