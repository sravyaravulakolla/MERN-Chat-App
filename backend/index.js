const express= require("express");
const dotenv= require("dotenv");
const {chats}= require("./data/data");
const connectDB = require("./config/db");
const colors= require("colors");
const userRoutes= require("./routes/userRoutes");
const chatRoutes= require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const videoRoutes = require("./routes/videoRoutes"); // Import video routes
const { notFound, errorHandler } = require("./middleware/errorMiddleWare");
dotenv.config();
connectDB();
const app= express();
app.use(express.json()); //to accept JSON Data   
app.get('/',(req, res)=>{
    res.send("API is running successfully");
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/zoom',videoRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT= process.env.PORT || 5000;
const server= app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));
const io = require("socket.io")(server, {
    pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection",(socket)=>{
    console.log("Connected to socket.io");
    socket.on("setup",(userData)=>{
      socket.join(userData._id);
      // console.log(userData._id);
      
      socket.emit("connected");
    });
    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("User Joined a room"+room);
      
    });
    socket.on("new message",(newMessageReceived)=>{
      var chat= newMessageReceived.chat;
      if(!chat.users) return console.log("chat.users not defined");
      chat.users.forEach(user => {
        if(user._id===newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });
    socket.on("typing", (room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));
    socket.off("setup",()=>{
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);  
    })
    
});
