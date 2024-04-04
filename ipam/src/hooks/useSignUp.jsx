import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  const navigate = useNavigate();

  return async (values) => {
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
        const errorMessage = Array.isArray(error.response.data.error)
          ? error.response.data.error.join(" ")
          : error.response.data.error;
        message.error(`${errorMessage}`);
      } else {
        message.error(`${error.message}`);
      }
    }
  }
}

export default useSignUp;