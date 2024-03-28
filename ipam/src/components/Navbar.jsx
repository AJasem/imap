// Navbar.js
import React from "react";
import { Menu } from "antd";
import { VerticalAlignTopOutlined, ExclamationCircleOutlined, InboxOutlined } from "@ant-design/icons";

const Navbar = ({ handleSwitch }) => { // Corrected prop name
  const menuItems = [
    { key: "1", icon: <InboxOutlined />, onClick: () => handleSwitch({ key: "fetch-emails" }), title: "fetch-emails" },
    { key: "2", icon: <VerticalAlignTopOutlined />, onClick: () => handleSwitch({ key: "sent" }), title: "sent" },
    { key: "3", icon: <ExclamationCircleOutlined />, onClick: () => handleSwitch({ key: "spam" }), title: "spam" }
  ];

  return (
    <Menu items={menuItems} />
  );
};

export default Navbar;