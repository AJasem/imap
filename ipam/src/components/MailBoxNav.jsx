import React  from "react";
import { Button, Popover } from "antd";
import Navbar from "./Navbar";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import { Typography } from "antd";

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
        localStorage.clear();
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
  
  const remainingTimeText = remainingTime ? `Your email will be deleted in ${remainingTime.days}
   days and ${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}` : "";


  return (
    <div className="mailbox-nav">
    <div className="left-icons">
        <Popover content={<Navbar handleSwitch={handleSwitch}/>}>
          <Button>Menu</Button>
        </Popover>
      </div>
      <Typography.Text>{remainingTimeText}</Typography.Text>
      <Button
        icon={<LogoutOutlined style={{ color: "red" }} />}
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </Button>
      </div>
  );
}

export default MailBoxNav;