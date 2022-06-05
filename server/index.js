const http=require("http");
const express=require("express");
const cors=require("cors");
const socketIO=require("socket.io");

const app=express();
const port=4500 || process.env.PORT;

const users=[{}];

app.use(cors());
app.get("/",(req,res)=>{
    res.send("It's working")
})
const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{

    console.log("New Connection");
    
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(user+' has Joined');
        socket.broadcast.emit('userJoined',{user:'Admin',message:users[socket.id] +' has joined'})
        socket.emit('welcome',{user:'Admin',message:'welcome to the chat '+users[socket.id]})
    })
    
    socket.on('discnnect',()=>{
        socket.broadcast.emit('leave',{user:'Admin',message:users[socket.id] +' has left'})
        console.log('user left');
    })
    
    socket.on('message',({message,id})=>{
        console.log(message);
        io.emit('sendmessage',{user:users[id],message,id})
    })
})
server.listen(port,()=>{
    console.log('server is working on http://localhost:'+port);
})