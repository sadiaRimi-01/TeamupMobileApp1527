const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(getAllTasks)
  .post(protect, createTask);

router
  .route("/:projectId")
  .post(protect, createTask)
  .get(protect, getTasksByProject);

router
  .route("/item/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;

