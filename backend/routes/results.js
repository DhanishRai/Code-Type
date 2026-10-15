const express = require("express");
const router = express.Router();
const {
  postResult,
  getResults,
  getLeaderboard
} = require("../controllers/resultController");

router.post("/results", postResult);
router.get("/results", getResults);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
