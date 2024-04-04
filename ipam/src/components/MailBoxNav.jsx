import React from "react";
import { Button, Popover } from "antd";
import Navbar from "./Navbar";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
function MailBoxNav({handleSwitch}) {
    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };
  return (
    <div className="mailbox-nav">
    <div className="left-icons">
        <Popover content={<Navbar handleSwitch={handleSwitch}/>}>
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
      </div>
  );
}

export default MailBoxNav;