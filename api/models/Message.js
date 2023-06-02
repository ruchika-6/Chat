import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        Content:{
            type: String,
            trim: true,
        },
        chat:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
    },
    {timestamps: true}
);

const message = mongoose.model("Message", MessageSchema);
export default message;