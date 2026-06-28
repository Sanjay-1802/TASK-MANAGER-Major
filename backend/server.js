require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(
cors({
origin: "http://localhost:5173",
credentials: true,
})
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
res.send("🚀 Task Manager API Running");
});

app.get("/api/health", (req, res) => {
res.status(200).json({
success: true,
message: "Server is healthy",
});
});

app.use("/api/tasks", taskRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
