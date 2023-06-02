import { useContext, useEffect, useState } from "react";
import "./myChats.css"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Chats from "../chats/Chats";
import GroupModal from "../groupModal/groupModal"

const MyChats = ({fetchAgain}) => {

    const [open,setOpen] = useState(false);
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);

    const fetchChats = async ()=>{
      setLoading(true)
      try {
        const {data} = await axios.get("/chat");
        setData(data);
        setLoading(false)
      } catch (error) {
        alert("Oops! Something went wrong");
      }
  };

  useEffect(()=>{
    fetchChats();
  }, [fetchAgain]);

    return (
      <div className="MyChats">
        <div className="chatItems">
          <div className="cHeaderItem">
            MyChats
          </div>
          <div className="cHeaderItem" onClick={()=>setOpen(!open)}>
            <span>New Group <i class="fas fa-solid fa-plus"></i></span>
          </div>
        </div>

        <hr />
        {
          loading ? "Loading Please Wait"
          :(
            <div className="list">
              {data?.map(item =>(                  
              <Chats item={item} key={item._id}/>                
            ))}  
          </div>
          )
        }
        {open && <GroupModal setOpen={setOpen}/>}
      </div>
    );
  };
  
  export default MyChats;