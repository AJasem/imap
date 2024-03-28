import React, { useState, useEffect } from "react";
import axios from "axios";
import useRequireAuth from "../hooks/useRequireAuth";
import { Typography, Button } from "antd";
import MailBoxNav from "./MailBoxNav";
import MsgList from "./MsgList";
import SendButton from "./SendBtn";
import MsgContent from "./MsgContent";

const MailBox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [ENDPOINT, setENDPOINT] = useState('fetch-emails');
  const auth = useRequireAuth();
const fetchMessages = async (ENDPOINT) => {
    try {
      if (!auth) {
        return;
      }
     
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `http://localhost:3005/${ENDPOINT}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        if (Array.isArray(response.data)) {
         setMessages(response.data);
         console.log(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    let intervalId;
    if (auth) {
      fetchMessages(ENDPOINT); 
      intervalId = setInterval(() => fetchMessages(ENDPOINT), 10000);
    }

    return () => clearInterval(intervalId); 
  }, [auth, ENDPOINT]);

  const handleListClick = async (message, index) => {
    setSelectedMessage(message);
    setSelectedIndex(index);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        "http://localhost:3005/mark-as-seen",
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
  const handleSwitch = (e) => {
    setENDPOINT(e.key);
    fetchMessages(e.key);
    setSelectedMessage(null);
    setSelectedIndex(null);
  };

  return (
    <div className="box-container">
      <MailBoxNav handleSwitch={handleSwitch}/>
      <div className="box">
        <SendButton />

        {selectedMessage === null ? (
          <div className="msg-list">
            {messages.length === 0 ? (
              <Typography.Text>No messages to display</Typography.Text>
            ) : (
              <MsgList messages={messages} handleDeleteMessage={handleDeleteMessage}
               handleListClick={handleListClick} />
            )}
          </div>
        ) : (
       <MsgContent selectedMessage={selectedMessage} handleNextMessage={handleNextMessage}
        handlePrevMessage={handlePrevMessage} handleBackToList={handleBackToList} messages={messages}
         selectedIndex={selectedIndex} />
        )}
      </div>
    </div>
  );
};

export default MailBox;
