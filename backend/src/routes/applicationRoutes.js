const express = require("express");
const router = express.Router();
const {
  applyToProject,
  getProjectApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");

router.post("/:projectId", protect, applyToProject);
router.get("/project/:projectId", protect, getProjectApplications);
router.put("/:id", protect, updateApplicationStatus);

module.exports = router;

