import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function MsgContent({ selectedMessage, handleNextMessage, handlePrevMessage, handleBackToList, messages, selectedIndex }) {
 
  const menu = (
    <Menu>
      <Menu.Item>
        {selectedMessage.from.address}
         
        
      </Menu.Item>
    </Menu>
  );

  return (
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

      <div className="msg-info">
        <div>
          <Dropdown overlay={menu}>
            <Button>From</Button>
          </Dropdown>
        </div>
        <div>
          <strong>From:</strong> {selectedMessage.from.name ? selectedMessage.from.name : selectedMessage.from.address}
        </div>
        <div>
          <strong>Subject:</strong> {selectedMessage.subject}
        </div>
        <div>
          <strong>Date:</strong> {selectedMessage.date}
        </div>
      </div>

      <div
        className="msg"
        dangerouslySetInnerHTML={{
          __html: selectedMessage.html,
        }}
      ></div>
    </div>
  );
}

export default MsgContent;
