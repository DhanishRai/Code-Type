const express = require("express");
const router = express.Router();
const {
  getLanguages,
  getSnippets,
  getRandomSnippet
} = require("../controllers/snippetController");

router.get("/languages", getLanguages);
router.get("/snippets", getSnippets);
router.get("/snippets/random", getRandomSnippet);

module.exports = router;
