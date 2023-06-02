import { useState } from "react";
import "./chat.css";
import SideDrawer from "../../components/sideDrawer/sideDrawer"
import MyChats from "../../components/myChats/myChats"
import ChatBox from "../../components/chatBox/chatBox"

const Chat = () => {

  const[fetchAgain,setFetchAgain] = useState(false);
  const [rooms,setRooms] = useState(false);

  return (
    <div className="Chat">
        <SideDrawer rooms={rooms} setRooms={setRooms}/>
        <div className="cContainer">
          <div className="cl">
            <MyChats fetchAgain={fetchAgain}/>
          </div>
          <div className="cr">
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
          </div>
        </div>
    </div>
  );
};

export default Chat;