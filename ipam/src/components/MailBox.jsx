import React, { useState, useEffect } from "react";
import axios from "axios";
import useRequireAuth from "../hooks/useRequireAuth";
import { List, Typography, Button } from "antd";
import { Popover } from "antd";
import {
  DeleteOutlined,
  RightOutlined,
  LeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Navbar from "./Navbar";

import {
  MailOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import SendButton from "./SendBtn";
import { useNavigate } from "react-router-dom";

const MailBox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const auth = useRequireAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
    // Redirect to login page or update state to reflect logout
  };

  useEffect(() => {
    let intervalId;

    const fetchMessages = async () => {
      try {
        if (!auth) return;

        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(
          "https://api.ahmads.dev/fetch-emails",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (auth) {
      fetchMessages(); // Fetch messages immediately
      intervalId = setInterval(fetchMessages, 10000); // Fetch messages every 30 seconds
    }

    return () => clearInterval(intervalId); // Cleanup interval on component unmount or auth change
  }, [auth]);

  const handleListClick = async (message, index) => {
    setSelectedMessage(message);
    setSelectedIndex(index);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        "https://api.ahmads.dev/mark-as-seen",
        {
          uid: message.uid,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        // Update the seen status of the message in the state
        setMessages(
          messages.map((msg) =>
            msg.uid === message.uid ? { ...msg, seen: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setSelectedIndex(null);
  };

  const handleDeleteMessage = async (uid) => {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        "http://localhost:3005/delete-message",
        {
          uid,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        // Remove the message from the state
        setMessages(messages.filter((msg) => msg.uid !== uid));
        setSelectedMessage(null);
        setSelectedIndex(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleNextMessage = () => {
    if (selectedIndex < messages.length - 1) {
      setSelectedMessage(messages[selectedIndex + 1]);
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevMessage = () => {
    if (selectedIndex > 0) {
      setSelectedMessage(messages[selectedIndex - 1]);
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div className="box-container">
      <div className="left-icons">
        <Popover content={<Navbar />} trigger={"click"}>
          <Button>Menu</Button>
        </Popover>
      </div>
      <Button
        icon={<LogoutOutlined style={{ color: "red" }} />}
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </Button>
      <div className="box">
        <SendButton />

        {selectedMessage === null ? (
          <div className="msg-list">
            {messages.length === 0 ? (
              <Typography.Text>No messages to display</Typography.Text>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(message, index) => (
                  <List.Item
                    style={{
                      backgroundColor: message.seen ? "white" : "#f0f0f0",
                    }}
                    actions={[
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.uid);
                        }}
                      />,
                      <Button icon={<CalendarOutlined />} />,
                    ]}
                    onClick={() => handleListClick(message, index)}
                  >
                    <List.Item.Meta
                      avatar={<Button icon={<MailOutlined />} />}
                      description={`From: ${message.from}`}
                    />
                    <div>{message.date}</div>
                  </List.Item>
                )}
              />
            )}
          </div>
        ) : (
          <div className="msg-content">
            <div className="btn-nav">
              <Button onClick={handleBackToList}>Back To List</Button>
              <Button
                className="prev-btn"
                icon={<LeftOutlined />}
                onClick={handlePrevMessage}
                disabled={selectedIndex === 0}
              />
              <Button
                className="next-btn"
                icon={<RightOutlined />}
                onClick={handleNextMessage}
                disabled={selectedIndex === messages.length - 1}
              />
            </div>
            <div
              className="msg"
              dangerouslySetInnerHTML={{
                __html: selectedMessage.html,
              }}
            ></div>
            <div className="btn-nav"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailBox;
