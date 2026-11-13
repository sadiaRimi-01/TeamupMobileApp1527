const Application = require("../models/Application");
const Project = require("../models/Project");

// @desc    Apply to join a project
// @route   POST /api/applications/:projectId
// @access  Private
exports.applyToProject = async (req, res) => {
  try {
    const { coverNote } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let applicantId = req.body?.candidateId || req.user.id;

    // Check existing application
    const existing = await Application.findOne({
      project: req.params.projectId,
      applicant: applicantId,
    });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Application already recorded in MongoDB",
        application: existing,
      });
    }

    const application = await Application.create({
      project: req.params.projectId,
      applicant: applicantId,
      coverNote: coverNote || "I'd love to contribute my technical skills.",
    });

    res.status(201).json({
      success: true,
      message: "Application successfully submitted and saved in MongoDB",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all applications for a specific project
// @route   GET /api/applications/project/:projectId
// @access  Private (Project Leader)
exports.getProjectApplications = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.leader.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applications for this project",
      });
    }

    const applications = await Application.find({ project: req.params.projectId })
      .populate("applicant", "name email university skills avatarInitials rating reviewCount bio")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Accept or reject application
// @route   PUT /api/applications/:id
// @access  Private (Project Leader)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, roleName } = req.body; // status: "Accepted" | "Rejected"

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Accepted' or 'Rejected'",
      });
    }

    const application = await Application.findById(req.params.id).populate("project");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const project = await Project.findById(application.project._id);

    if (project.leader.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to decide on this application",
      });
    }

    application.status = status;
    application.reviewedAt = Date.now();
    await application.save();

    // If accepted, add applicant to project members
    if (status === "Accepted") {
      const alreadyIn = project.members.some(
        (m) => m.user.toString() === application.applicant.toString()
      );
      if (!alreadyIn) {
        project.members.push({
          user: application.applicant,
          roleName: roleName || "Team Member",
          joinedAt: new Date(),
        });
        await project.save();
      }
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

