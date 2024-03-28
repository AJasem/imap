import React from "react";
import { List, Button } from "antd";
import { DeleteOutlined, CalendarOutlined, MailOutlined } from "@ant-design/icons";



function MsgList({ messages, handleDeleteMessage, handleListClick }) {
    return (
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
    );
    }


    export default MsgList;