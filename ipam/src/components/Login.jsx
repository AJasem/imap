import { Form, Input, Button } from "antd";
import useLogin from "../hooks/useLogin";

function Login() {
  
  const { loading, login } = useLogin();

  const handleSubmit = async (values) => {
    login(values);
  };

  return (
    <div className="form">
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
          rules={[{ required: true, message: "@ahmads.dev" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;