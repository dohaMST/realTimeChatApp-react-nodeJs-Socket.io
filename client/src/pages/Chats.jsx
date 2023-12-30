import React, { useEffect, useState } from 'react'
import '../styles/chats.scss'
import ScrollToBottom from "react-scroll-to-bottom"

function Chats({roomid, username, socket}) {
    const [currentMsg, setCurrentMsg]= useState("")
    const [messageList, setMessageList] = useState([])

    const sendMessage = async ()=>{
        if (currentMsg !== ""){
            const messageData = {
                roomid : roomid,
                author: username,
                message: currentMsg,
                time: new Date(Date.now()).getHours()
                        + ":" + 
                        new Date(Date.now()).getMinutes(),
            }
            await socket.emit("send_message", messageData)
            setMessageList((prv)=>[...prv, messageData])
            setCurrentMsg("")
        }
    }
    useEffect(()=>{
        const handleReceiveMessage = (data) => {
            console.log(data);
            setMessageList((prev) => [...prev, data]);
        };
    
        socket.on("receive_message", handleReceiveMessage);
    
        return () => {
            // Clean up the event listener when the component unmounts
            socket.off("receive_message", handleReceiveMessage);
        };
        // socket.on("receive_message", (data)=>{
        //     console.log(data);
        //     setMessageList((prv)=>[...prv, data])
        // })
    }, [socket])
  return (
    <div className='chatContainer'>
        <div className="chatHeader">
            <p>Live Chat</p>
        </div>
        <div className="chatBody chat-body">
            <ScrollToBottom className="message-container msgContainer">
                {messageList.map((messageContent, index)=>{
                   return (
                    <div
                      className="message"
                      id={username === messageContent.author ? "you" : "other"}
                    >
                      <div>
                        <div className="message-content">
                          <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                          <p id="time">{messageContent.time}</p>
                          <p id="author">{messageContent.author}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </ScrollToBottom>
        </div>
        <div className="chatFooter">
            <input type="text"
                    placeholder='Hey...'
                    value={currentMsg} 
                    onChange={(e)=>setCurrentMsg(e.target.value)}
                    onKeyPress={(e)=>{e.key === "Enter" && sendMessage()}}
                    />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chats