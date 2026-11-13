const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Enable CORS (Allows requests from Expo mobile app)
app.use(cors());

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "🚀 TeamUp Backend REST API is running...",
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mount
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/matchmaker", require("./routes/matchRoutes"));

// Error handling fallback
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 TeamUp Backend Server listening on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
});

