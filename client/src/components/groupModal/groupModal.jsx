import { useContext, useState } from "react";
import "./groupModal.css"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import SearchItem from "../searchItem/SearchItem";
import GroupUser from "../groupUser/GroupUser";

const GroupModal = ({setOpen}) => {

  const [chatName,setChatName] = useState("");
  const [selectedUsers,setSelectedUsers] = useState([]);
  const [search,setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
  const [loading,setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [checked,setChecked] = useState(false);
  
  const {user,chats,setChats} = useContext(AuthContext);

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

  const handleGroup = (item)=>{
    if(selectedUsers.includes(item))
      return;
    setSelectedUsers([...selectedUsers,item]);
  }

  const handleDelete = (item)=>{
    setSelectedUsers(selectedUsers.filter(person=>(person !== item)))
  }

  const handleSubmit = async ()=>{

    const d = new FormData();
    d.append("file",file);
    d.append("upload_preset","upload");

    if(!chatName || !selectedUsers)
    {
      alert("Please fill all the fields!")
      return;
    }

    let newGroup = {
      users:JSON.stringify(selectedUsers),
      name:chatName,
      photo: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
      public: checked
    }
    setLoading(true);
    try
    {
      if(file)
      {
          const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/drfoxrlaf/image/upload",d);
          const {url} = uploadRes.data;

          newGroup = {
            users:JSON.stringify(selectedUsers),
            name:chatName,
            photo:url,
            public: checked
          }
      }
      const {data} = await axios.post("/chat/group",newGroup);

      setLoading(false);
      setChats([data,...chats]);
      setOpen(false);
    }
    catch(err)
    {
      console.log(err);
      alert("Oops! Something went wrong");
    }
  }

    return (
      <div className="GroupModal">
        <div className="gContainer">
            <i class="fa fa-times" aria-hidden="true" onClick={()=>setOpen(false)}></i>
            <div className="gItem">
              Create Group
            </div>
            <div className="gItem">
              <label htmlFor="file">
                  <img
                  src={
                      file
                      ? URL.createObjectURL(file)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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
            <div className="gItem">
              <input type="text" name="chatName" id="chatName" placeholder="Enter Group Name" onChange={(e)=>setChatName(e.target.value)}/>
              <input type="text" name="chatName" id="chatName" placeholder="Add Users" onChange={handleSearch}/>
            </div>
            <div className="gUsers">
              {
              selectedUsers?.map(item=>(
                <GroupUser key = {item._id} item = {item} onClick={()=>handleDelete(item)}/>
              ))}
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
            <div className="gFooter">
              <button className="gBtn" disabled={loading} onClick={handleSubmit}>Create</button>
              <span className="gPublic">
                <span className="public">Public</span>
                <input className="checkbox" type="checkbox" onClick={()=>setChecked(!checked)}/>
              </span>
            </div>
        </div>
      </div>
    );
  };
  
  export default GroupModal;