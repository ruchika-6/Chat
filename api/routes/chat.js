import express from "express";
import User from "../models/User.js"
import Chat from "../models/Chat.js"
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE OR FETCH CHAT
router.post("/",verifyToken,async (req,res)=>{
    const {userId} = req.body;

    if(!userId)
    {
        res.status(500).send("UserId not found in request");
    }

    let chat = await Chat.find({
        isGroup: false,
        $and : [
            {users: {$elemMatch: {$eq:req.user.id}}},
            {users: {$elemMatch: {$eq:userId}}}
        ]
    }).populate("users", "-password").populate("lastMessage")

    chat = await User.populate(chat, {
        path: "lastMessage.sender",
        select: "name email photo"
    });

    if(chat.length>0)
    {
        res.status(200).json(chat);

    }else{
        const newChat = {
            chatName: "sender",
            isGroup: false,
            users: [req.user.id, userId]
        };

        try {
            const createdChat = await Chat.create(newChat);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password")
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(500).send(error);
        }
    }
});

//GET CHAT
router.get("/",verifyToken,async (req,res)=>{
    try{
        let allChats = await Chat.find({users: {$elemMatch:{$eq:req.user.id}}})
        .populate("users","-password")
        .populate("lastMessage")
        .populate("GroupAdmin")
        .sort({updatedAt: -1}) //Sort by last updated

        allChats = await User.populate(allChats, {
            path: "lastMessage.sender",
            select: "name email photo"
        });
        res.status(200).json(allChats);
    }
    catch (err){
        res.status(500).send(err);
    }
});

//GET ROOMS
router.get("/rooms",verifyToken,async (req,res)=>{
    try{
        let allChats = await Chat.find({isGroup:true,public:true,users:{$not: {$elemMatch:{$eq:req.user.id}}}})
        .populate("users","-password")
        .populate("lastMessage")
        .populate("GroupAdmin")
        .sort({updatedAt: -1}) //Sort by last updated

        allChats = await User.populate(allChats, {
            path: "lastMessage.sender",
            select: "name email photo"
        });
        res.status(200).json(allChats);
    }
    catch (err){
        res.status(500).send(err);
    }
});

//FETCH ROOM
router.get("/search",verifyToken,async (req,res)=>{
    const search = req.query.search ? 
    {
        chatName:{$regex: req.query.search, $options: "i"}
    }:{}

    try {
        let chat = await Chat.find(search).find({isGroup:true,public: true,users:{$not: {$elemMatch:{$eq:req.user.id}}}})
        .populate("users", "-password").populate("lastMessage").populate("GroupAdmin")

        chat = await User.populate(chat, {
            path: "lastMessage.sender",
            select: "name email photo"
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).send(error);
    }
});

//CREATE GROUP
router.post("/group",verifyToken,async (req,res)=>{
    if(!req.body.users || !req.body.name){
        res.status(500).send("Please fill all the fields");
    }

    const users = JSON.parse(req.body.users);

    users.push(req.user.id);

    try {
        const chat = {
            chatName: req.body.name,
            isGroup: true,
            users: users,
            GroupAdmin: req.user.id,
            photo: req.body.photo,
            public: req.body.public
        }
        const group = await Chat.create(chat);
        const fullGroupChat = await Chat.findOne({_id: group._id})
        .populate("users", "-password")
        .populate("GroupAdmin", "-password")

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500).send(error)
    }
});

//RENAME GROUP
router.put("/rename",verifyToken,async (req,res)=>{
    const {chatId} = req.body;
    try {
        const updatedName = await Chat.findByIdAndUpdate(chatId,{$set: req.body.details}, {new: true})
        .populate("users", "-password")
        .populate("GroupAdmin", "-password")

        if(!updatedName)
            res.status(500).send("Chat not found");
        res.status(200).json(updatedName);
    } catch (error) {
        res.status(500).send(error);
    }
});

//REMOVE FROM GROUP
router.put("/groupremove",verifyToken,async (req,res)=>{
    const {chatId,userId} = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId,{
            $pull:{
                "users":userId
            }
        }, {new: true})
        .populate("users", "-password")
        .populate("GroupAdmin", "-password")

        if(!updatedChat)
            res.status(500).send("Chat not found");

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).send(error);
    }
});

//ADD TO GROUP
router.put("/groupadd",verifyToken,async (req,res)=>{
    const {chatId,userId} = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId,{
            $push:{
                "users":userId
            }
        }, {new: true})
        .populate("users", "-password")
        .populate("GroupAdmin", "-password")

        if(!updatedChat)
            res.status(500).send("Chat not found");

        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;