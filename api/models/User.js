import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email:{
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            // required: true,
        },
        photo: {
            type: String,
            default:"http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon",
        }  
    },
    {timestamps: true}
);

const user = mongoose.model("User", UserSchema);
export default user;