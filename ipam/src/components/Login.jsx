import { Form, Input, Button } from "antd";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

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
          Don't have an account? <Link to="/sign-up" className="custom-link">Sign up</Link>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="s-btn" >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;