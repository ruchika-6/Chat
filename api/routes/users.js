import express from "express";
import User from "../models/User.js"
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//GET
router.get("/",verifyToken,async (req,res)=>{
    const search = req.query.search ? 
    {
        $or: [
            {name:{$regex: req.query.search, $options: "i"}},
            {email:{$regex: req.query.search, $options: "i"}},
        ]
    }:{}

    try {
        const users = await User.find(search).find({_id:{ $ne: req.user.id }})
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error);
    }    
});

export default router;