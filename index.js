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
<<<<<<< HEAD
        origin:"https://chat-app-lemon-five-15.vercel.app/",
=======
        origin:"chat-app-api-cdl6-an75ycxmk-rapidgamingleague-gmailcom.vercel.app",
>>>>>>> 6b837cc4e1fabf4a3508089cba887a9a3e53f54e
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
