import { useContext } from "react";
import "./messages.css"
import Scrollablefeed from "react-scrollable-feed";
import { AuthContext } from "../../context/AuthContext";

const Messages = ({messages})=>{

    const {user} = useContext(AuthContext);

    const sameSender = (messages,m,i,userId)=>{
        return i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
          messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    }

    const lastMessage = (messages,i,userId)=>{
        return i===messages.length-1 &&
        messages[messages.length-1].sender._id !==userId &&
        messages[messages.length-1].sender._id;
    }
    return(
        <div className="Messages">
            <Scrollablefeed>
                {messages.map((m,i)=>(
                    <div key={messages._id} className="messageItem"
                        style={{
                            justifyContent:`${m.sender._id === user._id ?
                                "flex-end" : "flex-start"
                                }`
                        }}
                    >
                        {(sameSender(messages,m,i,user._id) ||
                            (lastMessage(messages,i,user._id)) ) &&
                            <img className="dp" src={m.sender.photo} alt="" />
                        }
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ?
                                "#BEE3F8" : "#B9F5D0"
                                }`,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                marginTop: "2px",
                                marginLeft: `${(sameSender(messages,m,i,user._id) ||
                                    (lastMessage(messages,i,user._id)) )?
                                    "2px" : "32px"
                                    }`,
                                marginRight:"5px",
                                marginBottom: `${(sameSender(messages,m,i,user._id) ||
                                    (lastMessage(messages,i,user._id)) )?
                                    "10px" : "0px"
                                    }`,
                            }}
                        >{m.Content}</span>
                    </div>
                ))}
            </Scrollablefeed>
        </div>
    )
}

export default Messages;