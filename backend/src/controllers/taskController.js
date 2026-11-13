const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public / Private
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "title")
      .populate("assignee", "name email avatarInitials")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a task for a project
// @route   POST /api/tasks or POST /api/tasks/:projectId
// @access  Private (Project Leader / Members)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignee, priority, deadline } = req.body;
    let projectId = req.params?.projectId || req.body?.projectId;

    let project = null;
    if (projectId) {
      project = await Project.findById(projectId);
    } else {
      project = await Project.findOne();
      if (!project) {
        project = await Project.create({
          title: "TeamUp General Project",
          description: "Default workspace project for team collaboration",
          category: "Full Stack & Cloud",
          requiredSkills: ["React Native", "Node.js"],
          leader: req.user ? req.user.id : null,
        });
      }
      projectId = project._id;
    }

    const task = await Task.create({
      project: projectId,
      title,
      description: description || "",
      assignee: assignee || (req.user ? req.user.id : null),
      priority: priority || "Normal",
      deadline: deadline || "TBD",
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "title")
      .populate("assignee", "name email avatarInitials");

    res.status(201).json({
      success: true,
      task: populatedTask || task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private (Project Team)
exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignee", "name email avatarInitials")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task status or details
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { status, title, description, assignee, priority, deadline } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (status) {
      task.status = status;
      if (status === "done") {
        task.completedAt = Date.now();
      }
    }
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignee !== undefined) task.assignee = assignee;
    if (priority) task.priority = priority;
    if (deadline) task.deadline = deadline;

    await task.save();

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Leader)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

