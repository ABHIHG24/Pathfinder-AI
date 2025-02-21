import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// Initialize Socket.io connection to the backend server (localhost:5000)
const socket = io("https://pathfinder-ai.onrender.com", {
  withCredentials: true,
});

const AllChat = () => {
  const { id: communityId } = useParams(); // Use community ID from URL params
  const [messages, setMessages] = useState([]); // Store messages
  const [currentMessage, setCurrentMessage] = useState(""); // Input message state
  const messagesEndRef = useRef(null); // Reference to the end of the message list
  const [userName, setUserName] = useState("You"); // Store user name, default to "You"

  useEffect(() => {
    // Cleanup previous listeners before attaching new ones
    socket.off("receiveMessage");
    socket.off("previousMessages");

    // Join the community
    socket.emit("joinCommunity", communityId);

    // Load previous messages
    socket.on("previousMessages", (messages) => {
      setMessages(messages);
    });

    // Listen for new messages
    socket.on("receiveMessage", (data) => {
      if (data?.userName && data?.message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { userName: data.userName, message: data.message },
        ]);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
      socket.off("previousMessages");
    };
  }, [communityId]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Send message to the server
    socket.emit("sendMessage", {
      community: communityId,
      message: currentMessage,
      userName: userName, // Send userName ("You" for the current user)
    });

    setCurrentMessage(""); // Clear input field
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-6">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Community Chat</h1>
        <p className="text-gray-600 text-sm mt-2">
          Community ID: {communityId}
        </p>
      </div>

      {/* Space for the image */}
      <div className="h-48 bg-blue-200 flex items-center justify-center mb-4 rounded-lg shadow-md">
        <img
          src="https://www.shutterstock.com/image-photo/group-diverse-hands-together-joining-260nw-633457583.jpg" // Replace with your image link
          alt="Placeholder"
          className="object-cover w-full h-full rounded-lg mt-4" // Adding margin-top to move the image higher
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50 rounded-lg shadow-inner p-4 overflow-auto mb-4">
        <div className="space-y-2 h-full">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${
                idx % 2 === 0 ? "bg-blue-100" : "bg-gray-200"
              } p-2 rounded-lg max-w-xs self-start`}
            >
              <span className="font-semibold text-sm text-gray-700">
                {msg.userName === "You" ? "You" : "Anonymous"}:
              </span>
              <span className="text-sm text-gray-800">{msg.message}</span>
            </div>
          ))}
          {/* Dummy div to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input & Send Section */}
      <div className="bg-white p-4 shadow-lg rounded-lg fixed bottom-4 left-4 right-4 flex gap-2 items-center">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition ease-in-out duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AllChat;
