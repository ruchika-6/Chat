import express, { json } from "express";
import mongoose, { disconnect } from "mongoose";
import AuthRoute from "./routes/auth.js";
import ChatRoute from "./routes/chat.js";
import Messages from "./routes/messages.js"
import UserRoute from "./routes/users.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv"

dotenv.config();

const app = express();
async function connect(){
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected...");
    }catch(error)
    {
        throw error;
    }
}; 

mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDb disconnected")
})

mongoose.connection.on("connected", ()=>{
    console.log("mongoDb connected")
})

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/auth", AuthRoute);
app.use("/chat", ChatRoute);
app.use("/users", UserRoute);
app.use("/messages", Messages);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "/client/build")));

app.get("*", (req, res) =>
res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
);

// --------------------------deployment------------------------------

//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    const errStatus = err.status || 500
    const errMessage = err.message || "Something Went Wrong!"
    return res.status(errStatus).json(errMessage);
})

var online = [];

const server = app.listen(8000,()=>{
    connect();
    console.log("Connected to Backend...");
})

const io = new Server(server, {
    pingTimeout: 60000, //It will wait 60 sec while being inactive.
    //After timeout it will close the connection to save bandwidth
    cors : {
        origin: "http://localhost:3000",
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io");

    //personal socket for user
    socket.on("setup", (userData)=>{
        //creating a room exclusively for that particular user
        socket.join(userData._id);
        socket.userid = userData._id;
        socket.emit("connected");  
        if(!online.includes(userData._id))
        {
            online=[...online,userData._id];
        }
        socket.broadcast.emit("online",online);
    });

    socket.on("joinChat",(room)=>{
        socket.join(room);
    });

    socket.on('newMessage',(message)=>{
        var chat = message.chat;
        if(!chat.users)
            return console.log("Chat users not defined");
        
        chat.users.forEach(element => {
            if(element._id == message.sender._id)
                return;
            
            //emit to the user's room
            socket.in(element._id).emit("messageReceived",message);
        });
    })

    socket.on('logout',(userData)=>{
        online = online.filter((n)=>n!==userData._id);
        socket.broadcast.emit("online",online);
    })

    socket.on('disconnect',()=>{
        setTimeout(() => {
            online = online.filter((n)=>n!==socket.userid);
            socket.broadcast.emit("online",online);
        }, 5000);
    })
})  