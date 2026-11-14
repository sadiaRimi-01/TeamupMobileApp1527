const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(getProjects)
  .post(protect, createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.delete("/:id/members/:memberId", protect, removeMember);

module.exports = router;

