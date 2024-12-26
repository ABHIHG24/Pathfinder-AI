const { Server } = require("socket.io");
const Message = require("./model/Chat"); // Assuming a Message model exists

const handleSocketConnection = (io) => {
  console.log("Socket connection initialized");

  // Event handlers for Socket.io
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a community
    socket.on("joinCommunity", async (communityId) => {
      socket.join(communityId);
      console.log(`User joined community: ${communityId}`);

      try {
        const messages = await Message.find({ communityId })
          .sort({ createdAt: 1 })
          .limit(50);
        socket.emit("previousMessages", messages); // Send chat history
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    });

    // Handle sending a message
    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = new Message({
          communityId: data.community,
          userName: socket.id, // Use socket ID as a temporary username
          message: data.message,
        });
        await newMessage.save();
        io.to(data.community).emit("receiveMessage", {
          userName: socket.id, // Send socket ID as username
          message: data.message,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = handleSocketConnection;
