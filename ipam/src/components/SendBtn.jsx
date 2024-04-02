import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, message } from "antd";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios"; 

const SendButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setUser] = useState(JSON.parse(localStorage.getItem("token")));
  const [fileList, setFileList] = useState([]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      setOpen(false);

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

      const response = await axios.post(
        "http://localhost:3005/send-email",
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      message.success(response.data.message);
      setLoading(false);
      setOpen(false);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error);
      } else if (error.request) {
        message.error("No response received from server");
      } else {
        message.error(error.message);
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<SendOutlined style={{ fontSize: "35px" }} />}
        style={{
          zIndex: 1,
          position: "fixed",
          bottom: "50px",
          right: "100px",
          transform: "rotate(300deg)",
          width: "70px",
          height: "70px",
        }}
        onClick={handleClick}
      />
      <Modal
        title="Send Email"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Send"
        cancelText="Close"
        confirmLoading={loading}
      >
        <Form form={form}>
          <Form.Item
            label="To"
            name="to"
            rules={[
              { required: true, message: "Please input recipient's email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please input email subject" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input email message" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Attachments">
            <Upload
              fileList={fileList}
              beforeUpload={(file) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                  const base64data = reader.result.split(",")[1]; 
                  
                  file.originFileObj = base64data;
                  setFileList([...fileList, file]); 
                
                };

                reader.readAsDataURL(file);

         
                return false;
              }}
              onRemove={(file) => {
                setFileList(fileList.filter((item) => item !== file));
               
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SendButton;
