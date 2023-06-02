import { useEffect, useState } from "react";
import "./rooms.css";
import SideDrawer from "../../components/sideDrawer/sideDrawer"
import axios from "axios";
import Room from "../../components/room/room";

const Rooms = () => {

  const[fetchAgain,setFetchAgain] = useState(false);
  const [rooms,setRooms] = useState(true);
  const [allRooms,setAllRooms] = useState([]);
  const [loading,setLoading] = useState(false);

  const fetchChats = async ()=>{
    setLoading(true);
    try {
      const {data} = await axios.get('/chat/rooms');
      
      setAllRooms(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong");
    }
  }

  useEffect(()=>{
    fetchChats()
  },[])


  return (
    <div className="Rooms">
        <SideDrawer rooms = {rooms} setRooms={setRooms}/>
        <div className="rContainer">
            <div className="rWrapper">
                <div className="rText">Public Rooms</div>
                <hr />
                {
                  loading ? "Loading Please Wait"
                  :(
                    <div className="roomsList">
                      {allRooms?.map(item =>(                  
                      <Room item={item} key={item._id} search={false}/>                
                    ))}  
                    </div>
                  )
                }
            </div>
        </div>
    </div>
  );
};

export default Rooms;