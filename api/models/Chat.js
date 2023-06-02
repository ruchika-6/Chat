import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true
        },
        isGroup:{
            type: Boolean,
            default: false,
        },
        users:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        GroupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        photo: {
            type: String,
            default: "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
        },
        public:{
            type: Boolean,
            default: false
        } 
    },
    {timestamps: true}
);

const chat = mongoose.model("Chat", ChatSchema);
export default chat;