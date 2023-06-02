import { createContext, useEffect, useReducer, useState } from "react"

const INITIAL_STATE = {
    user:JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state,action) =>{
    switch(action.type){
        case "LOGIN_START":
            return {
                user:null,
                loading: true,
                error: null
            }
        case "LOGIN_SUCCESS":
            return {
                user:action.payload,
                loading: false,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                user:null,
                loading: false,
                error: action.payload
            }
        case "LOGOUT":
            return {
                user: null,
                loading: false,
                error: null
            }
        default:
            return state
    }
}
//passed value = {} to children components
export const AuthContextProvider = ({children}) => {
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [state,dispatch] = useReducer(AuthReducer,INITIAL_STATE);

    //function called when user changes
    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(state.user));
    },[state.user])
    return(
        <AuthContext.Provider value={{user:state.user, loading: state.loading, error: state.error, dispatch,selectedChat,setSelectedChat,chats,setChats,notifications,setNotifications}}>
            {children}  
        </AuthContext.Provider>
    )
}