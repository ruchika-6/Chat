import { useContext, useState, useEffect } from "react";
import "./chat.css";
import SideDrawer from "../../components/sideDrawer/sideDrawer"
import MyChats from "../../components/myChats/myChats"
import ChatBox from "../../components/chatBox/chatBox"
import { AuthContext } from "../../context/AuthContext";

const Chat = () => {

  const[fetchAgain,setFetchAgain] = useState(false);
  const [rooms,setRooms] = useState(false);
  const {selectedChat} = useContext(AuthContext);
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  )

  useEffect(() => {
    window
    .matchMedia("(min-width: 600px)")
    .addEventListener('change', e => setMatches( e.matches ));
  }, []);

  return (
    <div className="Chat">
        <SideDrawer rooms={rooms} setRooms={setRooms}/>
        <div className="cContainer">
          <div className="cl" style={{display: `${!matches && selectedChat && "none"}`}}>
            <MyChats fetchAgain={fetchAgain}/>
          </div>
          <div className="cr" style={{display: `${!matches && !selectedChat && "none"}`}}>
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
          </div>
        </div>
    </div>
  );
};

export default Chat;