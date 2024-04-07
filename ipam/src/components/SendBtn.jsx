import React, { useState , useEffect } from "react";
import { Button, Modal, Form, Input, Upload } from "antd";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import useSendEmail from "../hooks/useSend";
import { useSendModal } from "../context/SendModalContext.jsx";

const SendButton = () => {
  
  const [fileList, setFileList] = useState([]);
  const { loading, sendEmail } = useSendEmail();

  const { openModal , closeModal , isOpen} = useSendModal();
 const handleClick = () => {
    openModal();
  };

  const handleOk = async () => {
    const formValues = await form.validateFields();
    closeModal();
    sendEmail(formValues, fileList);
  };

  const handleCancel = () => {
    closeModal();
  };

  const [form] = Form.useForm();


  return (
    <>
      <Button
        type="primary"
        shape='default'
         icon={<SendOutlined />}
        style={{
          zIndex: 1,
          padding: "20px",
          margin: "0 0 0 10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1f1f1f",
        }}
        onClick={handleClick}
      >
        Compose
      </Button>
      <Modal
        title="Send Email"
        visible={isOpen}
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
            rules={[{ required: true, message: "Please input recipient's email" }]}
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