import React from "react";
import { Menu } from "antd";
import { VerticalAlignTopOutlined, InboxOutlined } from "@ant-design/icons";

const Navbar = ({ handleSwitch }) => {
  const menuItems = [
    { key: "1", icon: <InboxOutlined />, 
    onClick: () => handleSwitch({ key: "fetch-emails" }), title: "Inbox" },
    { key: "2", icon: <VerticalAlignTopOutlined />,
     onClick: () => handleSwitch({ key: "sent" }), title: "Sent" },
  ];

  return (
    <Menu>
      {menuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default Navbar;