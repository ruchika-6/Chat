import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {GoogleLoginButton} from "react-social-login-buttons";
import {LoginSocialGoogle} from "reactjs-social-login"

const Register = ()=>{
    const[credentials, setCredentials] = useState({});
    const [file, setFile] = useState("");

    const{loading,error,dispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setCredentials((prev)=>({...prev, [e.target.id]:e.target.value}))
    }

    const handleClick = async (e)=>{
        e.preventDefault() //Otherwise it will refresh the page
        const data = new FormData();
        data.append("file",file);
        data.append("upload_preset","upload");
        
        dispatch({type:"LOGIN_START"});
        try{
            if(!credentials.name || !credentials.email || !credentials.password)
            {
                dispatch({type:"LOGIN_FAILURE", payload:"Enter Credentials"})
                return
            }

            let newUser = {
                ...credentials,
            };
            if(file)
            {
                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/drfoxrlaf/image/upload",data);
                const {url} = uploadRes.data;

                newUser = {
                    ...credentials,
                    photo: url,
                };
            }

            await axios.post("/auth/register",newUser)
            const res = await axios.post("/auth/login",newUser)
            console.log(res);
            dispatch({type:"LOGIN_SUCCESS", payload:res.data.details})
            navigate("/");
        }catch(err){
            dispatch({type:"LOGIN_FAILURE",payload:err.response.data})
        }
    }

    return (
        <div className="login">
            <div className="lContainer">
                <label htmlFor="file">
                    <img
                    src={
                        file
                        ? URL.createObjectURL(file)
                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                    }
                    alt=""
                    className="lImage"
                    />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <input type="text" className="lInput" onChange={handleChange} id="name" placeholder="Name" required/>
                <input type="email" className="lInput" onChange={handleChange} id="email" placeholder="Email" required/>
                <input type="password" className="lInput" onChange={handleChange} id="password" placeholder="Password" required/>
                {/* <input type="phone" className="lInput" onChange={handleChange} id="phone" placeholder="Phone" required/>
                <input type="country" className="lInput" onChange={handleChange} id="country" placeholder="Country" required/>
                <input type="city" className="lInput" onChange={handleChange} id="city" placeholder="City" required/> */}
                <button disabled={loading} onClick={handleClick} className="lButton">Register</button>
                {error &&
                    <span className="error">{error}</span>
                }
                OR
                <LoginSocialGoogle
                    client_id={"476476878889-mcameiiv4k1e31147bc2q8st3o6ejnak.apps.googleusercontent.com"}
                    scope="openid profile email"
                    discoveryDocs="claims_supported"
                    access_type="offline"
                    onResolve={async ({ provider, data }) => {
                        console.log(data)
                        const newUser = {
                            name : data.name,
                            email: data.email,
                            photo: data.picture,
                        };
                            const res = await axios.post("/auth/google",newUser)
                            dispatch({type:"LOGIN_SUCCESS", payload:res.data})
                            navigate("/");  
                    }}
                    onReject={(err) => {
                    console.log(err);
                    }}
                >
                    <GoogleLoginButton/>
                </LoginSocialGoogle>
                <div className="ltext">Already have an account?</div>
                <button disabled={loading} onClick={()=>navigate("/login")} className="lButton">Login</button>
            </div>
        </div>
    )
}

export default Register;