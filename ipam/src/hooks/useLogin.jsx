import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const response = await axios.post("https://api.ahmads.dev/login", {
        email: email,
        password: password,
      });
      const data = response.data;
      if (response.status === 200) {
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("deleteTimeStamp", JSON.stringify(data.deleteTimeStamp));
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

  return { loading, login };
};

export default useLogin;