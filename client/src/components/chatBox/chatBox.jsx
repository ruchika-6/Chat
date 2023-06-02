import { useContext } from "react";
import "./chatBox.css"
import { AuthContext } from "../../context/AuthContext";
import SingleChat from "../singleChat/SingleChat";

const ChatBox = ({fetchAgain,setFetchAgain}) => {
    
  const { selectedChat } = useContext(AuthContext);

    return (
      <div className="ChatBox">
        <SingleChat item={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>
    );
  };
  
  export default ChatBox;