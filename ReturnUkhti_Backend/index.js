require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const resiRoutes = require("./src/routes/resiRoutes");

const app = express();

// ===========================
// CORS CONFIGURATION
// ===========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kelompok32-staterpack-zsmv.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // Ditambahkan 'ngrok-skip-browser-warning' agar diizinkan oleh server backend kamu
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
    credentials: true,
  })
);

// Note: Blok "fallback CORS" manual sebelumnya telah dihapus karena fungsinya 
// sudah sepenuhnya dicover dan dihandle dengan benar oleh middleware cors() di atas.

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