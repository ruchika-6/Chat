import { useContext, useState } from "react";
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import "./sideDrawer.css"
import Modal from "../modal/modal";
import SearchItem from "../searchItem/SearchItem";
import Room from "../room/room"
import NotificationBadge, { Effect } from "react-notification-badge"
import {useNavigate} from "react-router-dom"
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
var socket;

const SideDrawer = ({rooms,setRooms}) => {

  const [search,setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading,setLoading] = useState(false);
  const [chatLoading,setChatLoading] = useState(false);
  const [openNotif,setOpenNotif] = useState(false);

  const {user,dispatch,setSelectedChat,chats,setChats,notifications,setNotifications} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = ()=>{
      socket = io(ENDPOINT);
      socket.emit('logout',user);
      dispatch({type:"LOGOUT"});
  }

  const handleSearch= async (e)=>{

    setSearch(e.target.value);
    setOpenDrawer(true)

      // if(!search)
      //   alert("Search box is Empty!!");
      
      setLoading(true);

      try {
        if(!rooms)
        {
          const {data} = await axios.get(`/users?search=${search}`); 
          setLoading(false);
          setSearchResult(data);
        }
        else
        {
          const {data} = await axios.get(`/chat/search?search=${search}`);
          setLoading(false);
          setSearchResult(data);
        }
      } catch (error) {
        alert("Oops! Something went wrong");
      }
  }

  const handleClick = async (userId)=>{
    setChatLoading(true)
    try {
      const {data} = await axios.post(`/chat`,({userId:userId._id}));
      
      console.log(data[0]);
      if(!chats.find((c)=>c._id === data[0]._id))
        setChats([data[0],...chats]);

      setNotifications(notifications.filter((n)=>n.chat._id !== data[0]._id))
      setSelectedChat(data[0]);
      setChatLoading(false);
      setOpenDrawer(false)
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong");
    }
  }

    return (
      <div className="SideDrawer">
        <div className="sItem">
            <div className="sSearch">
              <i class="fas fa-search"></i>
            </div>
            <input type="text" name="search" id="search" placeholder={rooms? "Search Rooms" : "Search Users"} onChange={handleSearch} />
            {!rooms ? <button onClick={()=>{setRooms(!rooms);navigate('/rooms');}}>Public Rooms</button>
              : <button onClick={()=>{setRooms(!rooms);navigate('/');}}>My Chats</button>
            }
        </div>
        <div className="sItem">
          <div style={{
            marginBottom:"12px"
          }}>
          <NotificationBadge
            count={notifications.length}
          /></div>
          <i class="fas fa-solid fa-bell" onClick={()=>setOpenNotif(!openNotif)}></i>
        {!openNotif &&
         <div className="sMenu hide">
              {
                notifications.length>0 ?
                notifications.map((item)=>(
                  <div key={item._id}>
                    {
                      item.chat.isGroup ? `Notification from ${item.chat.chatName}`
                      : `Notification from ${item.sender.name}`
                    }
                  </div>
                ))
                : "No new notifications"
              }
          </div>}
        {openNotif &&
         <div className="sMenu show">
              {
                notifications.length>0 ?
                notifications.map((item)=>(
                  <div key={item._id} 
                    onClick={()=>{setNotifications(notifications.filter((n)=>n.chat._id !== item.chat._id));setSelectedChat(item.chat);}}
                    style={{
                      cursor: "pointer"
                    }}
                  >
                    {
                      item.chat.isGroup ? `Notification from ${item.chat.chatName}`
                      : `Notification from ${item.sender.name}`
                    }
                  </div>
                ))
                : "No new notifications"
              }
          </div>}
          <div className="sProfile">
            <img src={user.photo || "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon"} alt="" onClick={()=>setOpen(!open)} className="profilePic"/>
            {
              open &&
              <div className="sMenu">
                <button onClick={()=>{setOpenModal(true); setOpen(false)}}>My Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            }
          </div>
        </div>
        {openModal && <Modal item={user} setOpenModal = {setOpenModal}/>}
          <div className={openDrawer? "openDrawer":"closeDrawer"} style={{
            width: `${openDrawer && rooms && "410px"}`
          }}>
            {loading? ("Loading Please Wait")
            :(
              <>
                  {!rooms ? searchResult?.map(item =>(                  
                      <SearchItem item={item} key={item._id} onClick={()=>handleClick(item)}/>                
                    ))
                    : searchResult?.map(item =>(                  
                      <Room item={item} key={item._id} search={true}/>                
                    ))
                  }  
              </>
            )}
          </div>
      </div>
    );
  };
  
  export default SideDrawer;