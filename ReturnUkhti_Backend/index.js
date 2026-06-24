require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const resiRoutes = require("./src/routes/resiRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kelompok32-staterpack-zsmv.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/resi", resiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});