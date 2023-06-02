import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from "./pages/chat/chat"
import Login from "./pages/login/login";
import Register from "./pages/register/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css"
import Rooms from "./pages/rooms/rooms";

function App() {
  const {user} = useContext(AuthContext);

  const ProtectedRoute = ({children}) =>{
    if(!user){
      return <Navigate to="login"/>
    }
    return children;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<ProtectedRoute><Chat/></ProtectedRoute>}/>
        <Route path="/rooms" element={<ProtectedRoute><Rooms/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;