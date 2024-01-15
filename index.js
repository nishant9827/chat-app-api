require('dotenv').config();
require('./config/db');
const express = require('express');
const userRoute = require('./routes/userRoutes');
const messageRoute = require('./routes/messageRoute');
const socket = require('socket.io');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/',userRoute);
app.use('/',messageRoute);



const port = process.env.PORT || 4000;

const server = app.listen(port,()=>{
    console.log(`Application is running on port ${port}`)
})

const io = socket(server,{
    cors:{
        origin:"https://chat-app-lemon-five-15.vercel.app/",
        Credentials:true,
    }
})

global.onlineUser = new Map();

io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUser.set(userId,socket.id);
    })

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUser.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    })
})