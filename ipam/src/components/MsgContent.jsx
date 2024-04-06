import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useSendModal } from "../context/SendModalContext";


function MsgContent({ selectedMessage, handleNextMessage,
  handlePrevMessage, handleBackToList, messages, selectedIndex }) {
 const menu = (
   <Menu>
     <Menu.Item key={selectedMessage.uid}>
       <span>{selectedMessage.from.address}</span>
     </Menu.Item>
   </Menu>
 );
 const { openModal } = useSendModal();
 const handleReplay = () => {
   openModal();
 }

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
        
         <Dropdown overlay={menu} placement="bottomLeft">
           <Button onClick={handleReplay}>Replay</Button>
         </Dropdown>
        
       </div>
       <div>{selectedMessage.from.name ? selectedMessage.from.name : selectedMessage.from.address}</div>
       <div>{selectedMessage.subject}</div>
       <div>{selectedMessage.date}</div>
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
