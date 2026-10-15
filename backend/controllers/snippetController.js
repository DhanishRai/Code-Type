const { LANGUAGES } = require("../data");

function clampDifficulty(d) {
  const n = parseInt(d, 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(5, Math.max(1, n));
}

// GET /api/languages
function getLanguages(req, res) {
  const list = Object.entries(LANGUAGES).map(([key, val]) => ({
    key,
    label: val.label,
    icon: val.icon,
    difficulties: Object.keys(val.data).map(Number)
  }));
  res.json({ languages: list });
}

// GET /api/snippets?language=python&difficulty=3&count=1
function getSnippets(req, res) {
  const language = (req.query.language || "python").toLowerCase();
  const difficulty = clampDifficulty(req.query.difficulty || 1);
  const count = Math.min(20, Math.max(1, parseInt(req.query.count, 10) || 1));

  const lang = LANGUAGES[language];
  if (!lang) {
    return res.status(404).json({ error: `Unknown language: ${language}` });
  }

  const pool = lang.data[difficulty] || [];
  if (pool.length === 0) {
    return res.status(404).json({ error: "No snippets for this difficulty" });
  }

  // shuffle a copy and take `count`, wrapping around if count > pool length
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const chosen = [];
  for (let i = 0; i < count; i++) {
    chosen.push(shuffled[i % shuffled.length]);
  }

  res.json({
    language,
    difficulty,
    snippets: chosen
  });
}

// GET /api/snippets/random?difficulty=3  -> random language too
function getRandomSnippet(req, res) {
  const difficulty = clampDifficulty(req.query.difficulty || 1);
  const keys = Object.keys(LANGUAGES);
  const language = keys[Math.floor(Math.random() * keys.length)];
  const pool = LANGUAGES[language].data[difficulty] || [];
  const snippet = pool[Math.floor(Math.random() * pool.length)];

  res.json({ language, difficulty, snippet });
}

module.exports = { getLanguages, getSnippets, getRandomSnippet };
