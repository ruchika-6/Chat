import { useContext, useState } from "react";
import "./UpdateGroupModal.css"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import SearchItem from "../searchItem/SearchItem";
import GroupUser from "../groupUser/GroupUser";

const UpdateGroupModal = ({fetchAgain,setFetchAgain,setOpen}) => {
  const {selectedChat,user,setSelectedChat} = useContext(AuthContext)
  const [chatName,setChatName] = useState(selectedChat.chatName);
  const [selectedUsers,setSelectedUsers] = useState([]);
  const [search,setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
  const [loading,setLoading] = useState(false);
  const [file, setFile] = useState("");

  const handleSearch= async (e)=>{
    setSearch(e.target.value);
    if(!search)
      return;
    
    setLoading(true);
    try {
      const {data} = await axios.get(`/users?search=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Oops! Something went wrong");
    }
}

  const handleRename = async ()=>{
    // e.preventDefault() //Otherwise it will refresh the page
    const d = new FormData();
    d.append("file",file);
    d.append("upload_preset","upload");

    if(!chatName && !file)
      return;
    try{
      let updatedGroup = {
        chatId:selectedChat._id,
        details:{
          chatName:chatName
        }
      }
      if(file)
      {
          const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/drfoxrlaf/image/upload",d);
          const {url} = uploadRes.data;

          updatedGroup = {
            chatId:selectedChat._id,
            details:{
              chatName:chatName,
              photo: url,
            }
          };
      }
      const {data} = await axios.put("/chat/rename",updatedGroup);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain)
    }
    catch(err)
    {
      console.log(err);
      alert("Oops! Something went wrong");
    }
    setChatName("")
  }

  const handleGroup = async (item)=>{
    if(selectedChat.GroupAdmin._id !== user._id)
    {
      alert("Only Admin is allowed to add users");
      return;
    }

    if(selectedChat.users.includes(item))
    {
      alert("User Already in the Group");
      return;
    }
    
    setLoading(true);
    try{
      const {data} = await axios.put("/chat/groupadd",{
        chatId: selectedChat._id,
        userId:item._id
      })

      setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      setLoading(false);
    }
    catch(err)
    {
      console.log(err);
      alert("Oops! Something went wrong");
    }
  }

  const handleRemove = async (item)=>{
    if(selectedChat.GroupAdmin._id !== user._id)
    {
      alert("Only Admin is allowed to remove users");
      return;
    }
    
    setLoading(true);
    try{
      const {data} = await axios.put("/chat/groupremove",{
        chatId: selectedChat._id,
        userId:item._id
      })

      item._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      setLoading(false);
    }
    catch(err)
    {
      console.log(err);
      alert("Oops! Something went wrong");
    }
  }

    const handleLeave = async ()=>{
      setLoading(true);
      try{
        const {data} = await axios.put("/chat/groupremove",{
          chatId: selectedChat._id,
          userId:user._id
        })

        setSelectedChat();
        setFetchAgain(!fetchAgain)
        setLoading(false);
      }
      catch(err)
      {
        console.log(err);
        alert("Oops! Something went wrong");
      }
    }

    return (
      <div className="UpdateGroupModal">
        <div className="gContainer">
            <i class="fa fa-times" aria-hidden="true" onClick={()=>setOpen(false)}></i>
            <div className="gItem">
              {selectedChat.chatName}
            </div>
            <div className="gItem">
              <label htmlFor="file">
                  <img
                  src={
                      file
                      ? URL.createObjectURL(file)
                      : selectedChat.photo || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                  className="gImg"
                  />
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
            <div className="gUsers">
              {
              selectedChat.users?.map(item=>(
                <GroupUser key = {item._id} item = {item} onClick={()=>handleRemove(item)}/>
              ))}
            </div>
            <div className="uItem">
              <div className="uRename">
                <input type="text" name="chatName" id="chatName" placeholder={selectedChat.chatName} onChange={(e)=>setChatName(e.target.value)}/>
                <button onClick={handleRename}>Update</button>
              </div>
              <input type="text" name="chatName" id="chatName" placeholder="Add Users" onChange={handleSearch}/>
            </div>
            <div className="gSearch">
            {
              loading ? "Loading Please Wait"
              : (
                //Display top 4 results
                searchResult?.slice(0,4).map(item=>(
                  <SearchItem key={item._id} item={item} onClick={()=>handleGroup(item)}/>
                )))
            }
            </div>
            <div>
              <button onClick={handleLeave} className="uBtn">Leave Group</button>
            </div>
        </div>
      </div>
    );
  };
  
  export default UpdateGroupModal;