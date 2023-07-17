import express from "express";
import { verifyToken } from "../Utils/verifyToken.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js"

const router = express.Router();

//SEND A MESSAGE
router.post("/",verifyToken,async (req,res)=>{
    const { content,chatId } = req.body;
    if(!content || !chatId)
        res.status(500).json("Invalid data passed into request");

    let newMessage = {
        sender: req.user.id,
        Content: content,
        chat: chatId
    };

    try {
        //cannot populate while creating
        let message = await Message.create(newMessage);
        
        message = await message.populate("sender", "name photo");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:"chat.users",
            select: "name photo email"
        });

        await Chat.findByIdAndUpdate(chatId,{lastMessage: message});
        res.status(200).json(message);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/:chatId",async (req,res)=>{
    try{
        const message = await Message.find({chat: req.params.chatId})
        .populate("sender", "name photo email")
        .populate("chat");

        res.status(200).json(message);
    }catch{
        res.status(500).send(error);
    }
})

export default router;