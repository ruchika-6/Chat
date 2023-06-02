import { useContext, useState } from "react";
import "./room.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Room = ({item,search}) => {

const [loading,setLoading] = useState(false);

const {user,setSelectedChat} = useContext(AuthContext);

const navigate = useNavigate();

const handleClick = async ()=>{
  setLoading(true);
  try{
    const {data} = await axios.put("/chat/groupadd",{
      chatId: item._id,
      userId:user._id
    })

    setSelectedChat(data);
    // setFetchAgain(!fetchAgain)
    setLoading(false);
    navigate("/");
  }
  catch(err)
  {
    console.log(err);
    alert("Oops! Something went wrong");
  }
}

return (
    <div className="roomItem">
      <img
        src={item.photo}
        className="riImg"
        style={{
          width:`${search && "50px"}`,
          height:`${search && "50px"}`
        }}
      />
      <div className="riDesc">
        <div className="riTitle">{item.chatName}</div>
        <div><strong>Admin</strong> : {item.GroupAdmin.email}</div>
      </div>
      <div className="riBtn">
        <button onClick={handleClick}>Join Room</button>
      </div>
    </div>
  );
};

export default Room;
