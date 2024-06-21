import React  from "react";
import { Button, Popover } from "antd";
import Navbar from "./Navbar";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import { Typography } from "antd";
import SendButton from "./SendBtn";
import { SendModalProvider } from "../context/SendModalContext";

function MailBoxNav({handleSwitch}) {
    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const deleteTimeStamp = localStorage.getItem("deleteTimeStamp");
    const deleteTimeInMillis = deleteTimeStamp ? parseInt(deleteTimeStamp) : 0;
  
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const remainingTimeInMillis = deleteTimeInMillis - currentTime;
  
      if (remainingTimeInMillis <= 0) {
        clearInterval(timer);
        localStorage.removeItem("token");
        navigate("/sign-in"); 
      } else {
        const remainingDays = Math.floor(remainingTimeInMillis / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((remainingTimeInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((remainingTimeInMillis % (1000 * 60 * 60)) / (1000 * 60));
        const remainingSeconds = Math.floor((remainingTimeInMillis % (1000 * 60)) / 1000);
        setRemainingTime({ days: remainingDays, hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds });
      }
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);
  
  const remainingTimeText = remainingTime ? `Your email will be deleted in ${remainingTime.days}d:${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}` : "";


  return (
    <div className="mailbox-nav">
      <div className="top-buttons">
    <div className="left-icons">
    
        <Popover content={<Navbar handleSwitch={handleSwitch}/>}>
          <Button className="menu" >Menu</Button>
        </Popover>
       
        <SendButton />
       
      </div>
      
      <Button
        icon={<LogoutOutlined style={{ color: "red" }} />}
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </Button>
      </div>
      <Typography.Text className="delete-text">{remainingTimeText}</Typography.Text>
      </div>
  );
}

export default MailBoxNav;