import React, { useState } from "react"
import io from "socket.io-client"
import Chats from "./pages/Chats"
import "./styles/app.scss"

const socket = io.connect("http://localhost:3001")
function App() {
  const [username, setUsername]= useState("")
  const [roomid, setRoomid] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom =()=>{
    if(username !== "" && roomid !== ""){
      socket.emit("join_room", roomid)
      setShowChat(true)
    }
  }
  return (
    <div className="appContainer">
      {!showChat ? (
        <div className="formContainer">
        <h3>Join A Chat</h3>
        <input type="text"
                placeholder="jhon ..."
                onChange={(e)=>setUsername(e.target.value)}
                />
        <input type="text"
                placeholder="Room Id ..."
                onChange={(e)=>setRoomid(e.target.value)} 
                />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      )
      :(
        <Chats socket={socket} username ={username} roomid={roomid} />

      )}

    </div>
  );
}

export default App;
