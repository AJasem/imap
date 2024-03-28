import React from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";


function MsgContent({ selectedMessage , handleNextMessage , handlePrevMessage , handleBackToList , messages , selectedIndex}) {
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