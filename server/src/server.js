import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { authenticateJWT } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from CLIENT_URL or localhost:3000 for development
    const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean); // Remove undefined values

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Task Tracker API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: "Task Tracker API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/auth",
      tasks: "/api/tasks",
    },
  });
});

// Auth routes
app.use("/auth", authRoutes);

// Task routes (all protected with JWT authentication)
app.use("/api/tasks", authenticateJWT, taskRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS Error",
      message: "Origin not allowed",
    });
  }

  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || "localhost:3000"}`);
});

export default app;
