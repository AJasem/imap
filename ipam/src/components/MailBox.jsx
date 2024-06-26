import React, { useState, useEffect } from "react";
import axios from "axios";
import useRequireAuth from "../hooks/useRequireAuth";
import { Typography, Button } from "antd";
import MailBoxNav from "./MailBoxNav";
import MsgList from "./MsgList";
import Footer from "./Footer";
import MsgContent from "./MsgContent";
import { SendModalProvider } from "../context/SendModalContext";
import { useNavigate } from "react-router-dom";
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
        `https://api.ahmads.dev/${ENDPOINT}`,
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
    if (message.seen) {
      return;
    }
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
      const response = await axios.delete(
        `https://api.ahmads.dev/delete-message/${ENDPOINT}/${uid}`, 
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
    <SendModalProvider>
    <div className="box-container">
      <MailBoxNav handleSwitch={handleSwitch}/>
      <div className="box">
       
        {selectedMessage === null ? (
          <div className="msg-list">
            <div className="msg-list-header">
             {ENDPOINT === 'sent' ?  <h1>Sent</h1> : <h1>Inbox</h1>}
             </div>
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
      <Footer />
    </div>
    </SendModalProvider>
  );
};

export default MailBox;
