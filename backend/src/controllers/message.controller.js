import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req,res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
        console.log(`Error in message controller: ${error.message}`);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export const getMessages = async (req,res) => {
    try{
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {
                    senderId:myId,
                    receiverId:userToChatId
                },
                {
                    senderId:userToChatId,
                    receiverId:myId
                }
            ]
        })

        res.status(200).json(messages);
    }catch(error){
        console.log(`Error in getMessages Controller: ${error.message}`)
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const sendMessage = async (req,res) => {
    try{
        const { text,message } = req.body;
        const senderId = req.user._id;
        const { id:receiverId } = req.params;

        let imageUrl;
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            imgage: imageUrl
        });

        await newMessage.save();
        // implement realtime functionality using socket.io

        res.status(201).json(newMessage);
    }catch(error){
        console.log(`Error in sendMessage controller: ${error.message}`);
        res.status(500).json({message:"Internal Server Error"});
    }
};