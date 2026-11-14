const Project = require("../models/Project");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Project Leader / Admin)
exports.createProject = async (req, res) => {
  try {
    let { title, description, category, difficulty, requiredSkills, maxTeamSize, deadline, githubRepo } = req.body;

    if (typeof requiredSkills === "string") {
      requiredSkills = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      requiredSkills = ["React Native", "TypeScript"];
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description.",
      });
    }

    const leaderId = req.user ? (req.user._id || req.user.id) : null;

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      category: category || "Full Stack & Cloud",
      difficulty: difficulty || "Intermediate",
      requiredSkills,
      maxTeamSize: Math.max(1, parseInt(maxTeamSize, 10) || 4),
      deadline: deadline || "TBD",
      githubRepo: githubRepo || "",
      leader: leaderId,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("leader", "name email university avatarInitials rating");

    res.status(201).json({
      success: true,
      project: populatedProject || project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all projects with search & filtering
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const { search, category, skill, difficulty, status } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, "i")] };
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { requiredSkills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const projects = await Project.find(query)
      .populate("leader", "name email university avatarInitials rating")
      .populate("members.user", "name email skills avatarInitials")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("leader", "name email university avatarInitials rating bio")
      .populate("members.user", "name email skills avatarInitials rating");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Leader or Admin)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check ownership or admin
    if (project.leader.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove a member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.members = project.members.filter(
      (m) =>
        m._id.toString() !== req.params.memberId &&
        (m.user ? m.user.toString() !== req.params.memberId : true)
    );
    await project.save();

    res.status(200).json({
      success: true,
      message: "Member removed from project",
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Leader or Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.leader.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

