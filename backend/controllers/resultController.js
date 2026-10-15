const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data", "results.json");

function loadResults() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Failed to load results.json:", err.message);
    return [];
  }
}

function saveResults(results) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(results, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save results.json:", err.message);
  }
}

// POST /api/results
function postResult(req, res) {
  const { username, wpm, accuracy, language, difficulty, time, errors, rawWpm } = req.body || {};

  if (typeof wpm !== "number" || typeof accuracy !== "number") {
    return res.status(400).json({ error: "wpm and accuracy (numbers) are required" });
  }

  const results = loadResults();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    username: (username || "Anonymous").toString().slice(0, 30),
    wpm: Math.max(0, Math.round(wpm)),
    rawWpm: rawWpm ? Math.max(0, Math.round(rawWpm)) : Math.round(wpm),
    accuracy: Math.min(100, Math.max(0, Math.round(accuracy * 100) / 100)),
    language: (language || "unknown").toString(),
    difficulty: Math.min(5, Math.max(1, parseInt(difficulty, 10) || 1)),
    time: time ? Math.round(time) : null,
    errors: errors ? Math.max(0, Math.round(errors)) : 0,
    createdAt: new Date().toISOString()
  };

  results.push(entry);
  // keep at most 500 most-recent results to keep the file lean
  const trimmed = results.slice(-500);
  saveResults(trimmed);

  res.status(201).json({ ok: true, result: entry });
}

// GET /api/results?username=xyz&limit=20
function getResults(req, res) {
  const results = loadResults();
  let filtered = results;
  if (req.query.username) {
    filtered = filtered.filter(
      (r) => r.username.toLowerCase() === req.query.username.toLowerCase()
    );
  }
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
  res.json({ results: filtered.slice(-limit).reverse() });
}

// GET /api/leaderboard?language=python&difficulty=3&limit=10
function getLeaderboard(req, res) {
  let results = loadResults();

  if (req.query.language) {
    results = results.filter(
      (r) => r.language.toLowerCase() === req.query.language.toLowerCase()
    );
  }
  if (req.query.difficulty) {
    const d = parseInt(req.query.difficulty, 10);
    results = results.filter((r) => r.difficulty === d);
  }

  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const top = [...results].sort((a, b) => b.wpm - a.wpm).slice(0, limit);

  res.json({ leaderboard: top });
}

module.exports = { postResult, getResults, getLeaderboard };
