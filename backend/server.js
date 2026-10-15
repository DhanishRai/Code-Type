const express = require("express");
const cors = require("cors");
const path = require("path");

const snippetRoutes = require("./routes/snippets");
const resultRoutes = require("./routes/results");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    name: "Code Type API",
    status: "running",
    endpoints: [
      "GET  /api/languages",
      "GET  /api/snippets?language=python&difficulty=3&count=1",
      "GET  /api/snippets/random?difficulty=3",
      "POST /api/results",
      "GET  /api/results?username=&limit=",
      "GET  /api/leaderboard?language=&difficulty=&limit="
    ]
  });
});

app.use("/api", snippetRoutes);
app.use("/api", resultRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Code Type API server running at http://localhost:${PORT}`);
});
