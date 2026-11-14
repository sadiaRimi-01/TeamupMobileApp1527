const express = require("express");
const router = express.Router();
const {
  applyToProject,
  getMyInvitations,
  getProjectApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");

router.get("/my-invitations", protect, getMyInvitations);
router.post("/:projectId", protect, applyToProject);
router.get("/project/:projectId", protect, getProjectApplications);
router.put("/:id", protect, updateApplicationStatus);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
