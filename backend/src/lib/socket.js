import { Server } from "socket.io"
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173"]
    }
})

//this is to store the online users in the application
const userSocketMap = {}; //{userId:socketId}


export function getReceiverSocketId(userId){
    return userSocketMap[userId];
};

io.on("connection",(socket) => {
    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;

    if(userId)  userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));//send event to all the connected clients

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})


export {io,app,server};