import React from "react";
import { Menu, Dropdown } from "antd";
import {
  VerticalAlignTopOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const Navbar = () => {
  return (
    <Menu>
      <Menu.Item key="1" icon={<InboxOutlined />} onClick={onclick}>
        Inbox
      </Menu.Item>
      <Menu.Item key="2" icon={<VerticalAlignTopOutlined />} onClick={onclick}>
        Sent
      </Menu.Item>
      <Menu.Item key="3" icon={<ExclamationCircleOutlined />} onClick={onclick}>
        Spam
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
