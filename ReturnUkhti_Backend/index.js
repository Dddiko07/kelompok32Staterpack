require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const resiRoutes = require("./src/routes/resiRoutes");

const app = express();

// ===========================
// CORS
// ===========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kelompok32-staterpack-zsmv.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// fallback CORS
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://kelompok32-staterpack-zsmv.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ===========================
// MIDDLEWARE
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// DATABASE
// ===========================
connectDB();

// ===========================
// ROUTES
// ===========================
app.use("/api/auth", authRoutes);
app.use("/api/resi", resiRoutes);

// ===========================
// TEST
// ===========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

// ===========================
// 404
// ===========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

// ===========================
// ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ===========================
// START SERVER
// ===========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});