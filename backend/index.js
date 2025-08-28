const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
require("dotenv").config({ path: "./config.env" });
const connectDatabase = require("./db");
const handleSocketConnection = require("./socket.js");
const errorMiddleware = require("./Middleware/error");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173", // For development
  "https://pathfinder-ai-2-u7yu.onrender.com", // For production
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Database connection
connectDatabase();

// Routes
app.get("/", (req, res) => res.send("Hello, Backend!"));

// API Routes
app.use("/api/v1/user", require("./Router/userRoute.js"));
app.use("/api/v1", require("./Router/progressRoute.js"));
app.use("/api/v1", require("./Router/roadmapRoute.js"));
app.use("/api/v1/image", express.static(`./upload/`));
app.use("/api/v1/uploads", express.static("uploads"));
app.use("/api/v1/resources", require("./Router/ResourceRoute.js"));
app.use("/api/v1/chat", require("./Routes/chatbotRoutes.js"));
app.use("/api/v1", require("./Routes/ResumeRoute.js"));
app.use("/api/v1", require("./Utils/InterviewGemini.js"));
app.use("/api/v1", require("./Utils/CodeEditor.js"));

// Error Handling Middleware (must be at the end)
app.use(errorMiddleware);

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io with server
const io = new Server(server, {
  cors: {
    origin: true, // Allows all origins in development
    credentials: true,
  },
  path: "/api/v1/socket.io",
});

// Integrate Socket.io logic
handleSocketConnection(io);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Global error handling for uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.log("Shutting down the server due to uncaught exception.");
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  console.log("Shutting down the server due to unhandled promise rejection.");
  server.close(() => process.exit(1));
});
