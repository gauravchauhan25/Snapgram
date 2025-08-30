import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../page-styles/Messages.css";

const socket = io("http://localhost:3001");

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const chats = [
    {
      id: 1,
      name: "Chris Hemsworth",
      lastMessage: "Hey, how's it going?",
      time: "2m",
    },
    { id: 2, name: "Tom Holland", lastMessage: "Can we talk?", time: "10m" },
    {
      id: 3,
      name: "Robert Pattinson",
      lastMessage: "Sure, I'll call you.",
      time: "30m",
    },
  ];

  useEffect(() => {
    document.title = "Inbox";

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Emit the new message to the server
      const messageData = {
        chatId: selectedChat,
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("message", messageData);

      // Update the messages locally
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div className="messages-container">
      {/* Chat List */}
      <div className="chat-list">
        <h2 className="chat-list-title">Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat === chat.id ? "active" : ""}`}
            onClick={() => setSelectedChat(chat.id)}
          >
            <div className="chat-info">
              <span className="chat-name">{chat.name}</span>
              <span className="chat-last-message">{chat.lastMessage}</span>
            </div>
            <div className="chat-time">{chat.time}</div>
          </div>
        ))}
      </div>

      {/* Chat View */}
      <div className="chat-view">
        {selectedChat ? (
          <div className="chat-content">
            <h2 className="chat-header">
              {chats.find((chat) => chat.id === selectedChat)?.name}
            </h2>
            <div className="chat-messages">
              {messages
                .filter((msg) => msg.chatId === selectedChat)
                .map((msg, index) => (
                  <p
                    key={index}
                    className={`message ${
                      msg.sender === "You" ? "sent" : "received"
                    }`}
                  >
                    {msg.text}
                  </p>
                ))}
            </div>
            <div className="chat-input-box">
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button className="chat-send-btn" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}


