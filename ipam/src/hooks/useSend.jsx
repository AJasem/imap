import { useState } from "react";
import axios from "axios";
import { message } from "antd";

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendEmail = async (formValues, fileList) => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      message.error("Missing Token");
      setLoading(false);
      return;
    }

    const data = {
      to: formValues.to,
      subject: formValues.subject,
      text: formValues.message,
      attachments: fileList.map((attachment) => {
        return {
          filename: attachment.name,
          content: attachment.originFileObj,
        };
      }),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/send-email",
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      message.success(response.data.message);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error);
      } else if (error.request) {
        message.error("No response received from server");
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendEmail };
};

export default useSendEmail;