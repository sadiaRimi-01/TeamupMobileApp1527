const express = require("express");
const router = express.Router();
const {
  matchTeammates,
  recommendProjectsForUser,
} = require("../controllers/matchController");
const { protect } = require("../middleware/auth");

router.post("/", matchTeammates);
router.post("/teammates", matchTeammates);
router.get("/projects", protect, recommendProjectsForUser);

module.exports = router;

