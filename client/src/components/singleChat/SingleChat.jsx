import { useContext, useEffect, useState } from "react";
import "./SingleChat.css";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../modal/modal";
import UpdateGroupModal from "../updateGroupModal/UpdateGroupModal";
import Messages from "../messages/messages";
import axios from "axios";
import io from "socket.io-client"
import Picker from "emoji-picker-react";

const ENDPOINT = "http://localhost:8000";
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const {user,setSelectedChat,selectedChat,notifications,setNotifications} = useContext(AuthContext);
  const [open,setOpen] = useState(false);
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);
  const[newMessage,setNewMessage] = useState("");
  const [socketConnected,setSocketConnected] = useState(false);
  const [online,setOnline] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const getSender = (users)=>{
    return users[0]._id === user._id ? users[1] : users[0];
  }

  const fetchMessages = async ()=>{
    if(!selectedChat)
      return;
    try{
      setLoading(true);
      const {data} = await axios.get(`/messages/${selectedChat._id}`);
      setMessages(data);
      socket.emit("joinChat",selectedChat._id);
      setLoading(false);
    }catch(err)
    {
      console.log(err);
      alert("Oops! Something went wrong");
    }
  }

  const sendMessage = async (e)=>{
      if(newMessage)
      {try {
        setNewMessage("");
        const {data} = await axios.post("/messages",{
          content:newMessage,
          chatId: selectedChat._id
        });
        socket.emit("newMessage", data);
        setMessages([...messages,data]);
        setShowPicker(false);
      } catch (error) {
        console.log(error);
        alert("Oops! Something went wrong");
      }}
  }

  useEffect(()=>{
    socket = io(ENDPOINT);
    //emitting to 'setup' socket
    socket.emit("setup", user);
    socket.on("connected", ()=> setSocketConnected(true));
  },[])

  const typingHandler = (e)=>{
    setNewMessage(e.target.value);
  }

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare = selectedChat;
  },[selectedChat]);

  useEffect(()=>{
    socket.on("online",(n)=>{
      setOnline(n);
    })
  })

  useEffect(()=>{
    socket.on("messageReceived",(message)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==message.chat._id)
      {
        if(!notifications.includes(message))
        {
          setNotifications([message,...notifications]);
          setFetchAgain(!fetchAgain);
        }
      }else{
        setMessages([...messages,message])
      }
    })
  })

return (
    <div className="SingleChat">
      {
        !selectedChat ? "Click on user to start chatting"
        : (
          <div className="sContainer">
            <div className="sHeader">
              <i class="fa fa-arrow-left" aria-hidden="true" onClick={()=>setSelectedChat("")}></i>
              <div className="sTitle">
                {selectedChat.isGroup? selectedChat.chatName : getSender(selectedChat.users).name}
                {!selectedChat.isGroup && online.includes(getSender(selectedChat.users)._id)
                  &&
                  <div style={{fontSize: "10px",textAlign: "center"}}>Online</div>
                }
              </div>
              <i class="fa fa-eye" aria-hidden="true" onClick={()=>setOpen(!open)}></i>
            </div>
            {open && !selectedChat.isGroup && <Modal item={getSender(selectedChat.users)} setOpenModal = {setOpen}/>}
            {open && selectedChat.isGroup && <UpdateGroupModal setOpen = {setOpen} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            <div className="sChat">
              {loading ? "Loading..."
              :(
                <div className="messages">
                  <Messages messages={messages}/>
                </div>
              )}
              <div className="sText">
                <i class="far fa-smile" onClick={()=>setShowPicker(!showPicker)}></i>
                <input type="text" id="text" value={newMessage} placeholder="Enter a message..." onKeyDown={(e)=>{if(e.key === "Enter" && newMessage)sendMessage()}} onChange={typingHandler}/>
                {showPicker && <div className="emojiPicker"><Picker
                pickerStyle={{ width: '100%' }}
                onEmojiClick={(emojiObject)=> setNewMessage((prevMsg)=> prevMsg + emojiObject.emoji)} /></div>}
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>        
          </div>
        )
      }
    </div>
  );
};

export default SingleChat;
