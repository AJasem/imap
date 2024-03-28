// SignUp.js
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "https://api.ahmads.dev/sign-up",
        values
      );
      const data = response.data;

      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem("token", JSON.stringify(data.token));
        navigate("/mailbox");
      } else {
        message.error(`${response.message.error}`);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = Array.isArray(error.response.data.error)
          ? error.response.data.error.join(" ")
          : error.response.data.error;
        message.error(`${errorMessage}`);
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error(`${error.message}`);
      }
    }
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
            message: "Please input your email!",
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
