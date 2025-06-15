const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./config/db");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const packageRoutes = require("./routes/packageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const completedTransactionRoutes = require("./routes/completedTransactionRoutes");

// Trust first proxy (important when behind services like Render)
const app = express();
app.set("trust proxy", 1);

// CORS Configuration - MOVED TO THE TOP
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://parcelup.in/ ",
  // Add your production domain here
  // "https://yourdomain.com"
];

// Add environment-specific origins
if (process.env.NODE_ENV === "production") {
  // Add your production origins here
  // allowedOrigins.push("https://your-production-domain.com");
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Log the blocked origin for debugging
    console.warn(`CORS blocked origin: ${origin}`);
    const msg = `The CORS policy for this site does not allow access from the origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Enable CORS FIRST - before any other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // Handle preflight requests
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400"); // Cache preflight for 24 hours
    return res.sendStatus(200);
  }
  next();
});

// Initialize rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
  skip: (req) => {
    // Skip rate limiting for preflight requests
    return req.method === "OPTIONS";
  },
});

// Apply rate limiting to all API routes (but after CORS)
app.use("/api", limiter);

// Logging in production
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}

// Security headers - MOVED AFTER CORS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "same-origin" },
    // Disable some headers that might interfere with CORS
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Important for cross-origin cookies
    },
  })
);

// Special handling for Razorpay webhook (needs raw body) - BEFORE other routes
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", completedTransactionRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// CORS debugging endpoint (remove in production)
if (process.env.NODE_ENV !== "production") {
  app.get("/debug/cors", (req, res) => {
    res.json({
      origin: req.get("Origin"),
      headers: req.headers,
      allowedOrigins,
    });
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`Allowed CORS origins:`, allowedOrigins);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;
