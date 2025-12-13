const express = require("express");

const app = express();

app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ message: "API running" });
});

const authRoutes = require("./routes/auth");
const sweetsRoutes = require("./routes/sweets");

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

module.exports = app;
