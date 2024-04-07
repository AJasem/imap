import { Form, Input, Button, Select } from "antd";
import React from "react";
import useSignUp from "../hooks/useSignUp";
import { Link } from "react-router-dom";

const { Option } = Select;

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
          <Input placeholder="Enter email" className="Cypress-email"/>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" className="Cypress-pass"/>
        </Form.Item>

        <Form.Item
          name="deletionTime"
          rules={[{ required: true, message: "Please select deletion time!" }]}
        >  
          <Select placeholder="Select deletion time" className="Cypress-select">
            <Option value="1">1 day</Option>
            <Option value="3">3 days</Option>
            <Option value="7">1 week</Option>
          </Select>
         
        </Form.Item>


         <Form.Item>
         Already have an account?  <Link to="/sign-in" className="custom-link">Sign In</Link>
         </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="s-btn">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUp;