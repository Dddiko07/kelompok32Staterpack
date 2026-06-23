require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(express.json());

connectDB();

// Route Auth
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});