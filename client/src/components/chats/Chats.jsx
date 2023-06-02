import "./chats.css";
import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Chats = ({item}) => {

  const {setSelectedChat,selectedChat,user,setNotifications,notifications} = useContext(AuthContext);

  const getSender = (users)=>{
    return users[0]._id === user._id ? users[1] : users[0];
  }
return (

    <div className="Chats"
      style={{
        backgroundColor: `${selectedChat?._id === item._id && "lightgreen"}`
      }}
     onClick={()=>{setNotifications(notifications.filter((n)=>n.chat._id !== item._id));setSelectedChat(item);}}>
      <img
        src={item.isGroup ? item.photo : getSender(item.users).photo}
        className="siImg"
      />
      <div className="siDesc">
        <div className="siTitle">{!item.isGroup ? getSender(item.users).name
        : item.chatName}
        </div>
        {
          item.lastMessage && <div>{item.lastMessage.sender._id === user._id ? "You: " : item.isGroup && item.lastMessage.sender.name.slice(0,8) +": " }{item.lastMessage.Content.slice(0,15)}</div>
        }
      </div>
    </div>
  );
};

export default Chats;
