import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp =  async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/sign-up",
        values
      );
      
      const data = response.data;

      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("deleteTimeStamp", JSON.stringify(data.deleteTimeStamp));
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
    } finally {
      setLoading(false);
    }
   
  }
  return { loading, signUp };
}

export default useSignUp;