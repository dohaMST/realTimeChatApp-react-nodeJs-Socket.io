const express = require("express")
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=>{
    console.log(`user connected : ${socket.id}`)


    socket.on("join_room", (data)=>{ // we will recieve "roomId" as data
        socket.join(data)
        console.log(`User with id: ${socket.id} joined room: ${data}`)
    })

    socket.on("send_message", (data)=>{
        // console.log(data)
        io.to(data.roomid).emit("receive_message", data);
        // socket.emit("receive_message", data)
    })

    socket.on("disconnected", ()=>{
        console.log("user disconnected", socket.id)
    })
})

server.listen(3001, ()=>{
    console.log("server runningj")
})