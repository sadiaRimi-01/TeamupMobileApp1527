const mongoose = require("mongoose");
const Application = require("../models/Application");
const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Apply to join a project OR invite a candidate
// @route   POST /api/applications/:projectId
// @access  Private
exports.applyToProject = async (req, res) => {
  try {
    const { coverNote, candidateId, candidateName, candidateEmail, type } = req.body;
    let projectId = req.params.projectId;

    let project = null;
    if (mongoose.isValidObjectId(projectId)) {
      project = await Project.findById(projectId);
    }
    if (!project) {
      project = (await Project.findOne({ leader: req.user.id })) || (await Project.findOne());
    }
    if (!project) {
      const leader = (await User.findOne({ email: "sarah@teamup.com" })) || (await User.findOne());
      project = await Project.create({
        title: "AI-Powered Smart Campus Navigation",
        description: "Cross-platform indoor routing mobile application with graph pathfinding.",
        category: "Mobile & AI",
        requiredSkills: ["React Native", "TypeScript", "Node.js"],
        leader: leader ? leader._id : req.user.id,
      });
    }

    let applicantId = req.user.id;
    let inviterId = project.leader || req.user.id;
    let appType = type || "Application";

    // If candidateId or candidateName is provided, this is an Invitation to that candidate
    if (candidateId || candidateName) {
      appType = "Invitation";
      inviterId = req.user.id;

      let candidateUser = null;
      if (candidateId && mongoose.isValidObjectId(candidateId)) {
        candidateUser = await User.findById(candidateId);
      }

      if (!candidateUser && candidateEmail) {
        candidateUser = await User.findOne({ email: candidateEmail.toLowerCase().trim() });
      }

      const lookupName = candidateName || candidateId;
      if (!candidateUser && lookupName && typeof lookupName === "string") {
        candidateUser =
          (await User.findOne({ name: new RegExp(`^${lookupName.trim()}$`, "i") })) ||
          (await User.findOne({ name: new RegExp(lookupName.trim(), "i") })) ||
          (await User.findOne({ email: new RegExp(lookupName.trim(), "i") }));
      }

      if (!candidateUser) {
        const cleanName = (candidateName || candidateId || "Candidate").trim();
        const cleanEmail = candidateEmail ? candidateEmail.toLowerCase().trim() : `${cleanName.replace(/\s+/g, "").toLowerCase()}@teamup.com`;
        candidateUser = await User.create({
          name: cleanName,
          email: cleanEmail,
          password: "password123",
          role: "Team Member",
          skills: ["React Native", "TypeScript", "Node.js"],
          university: "University",
          avatarInitials: cleanName.substring(0, 2).toUpperCase(),
        });
      }

      applicantId = candidateUser._id;
    }

    // Check if application/invitation already exists
    const existing = await Application.findOne({
      project: project._id,
      applicant: applicantId,
    });

    if (existing) {
      existing.status = "Pending";
      existing.type = appType;
      existing.inviter = inviterId;
      if (coverNote) existing.coverNote = coverNote;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: `${appType} recorded in MongoDB`,
        application: existing,
      });
    }

    const application = await Application.create({
      project: project._id,
      applicant: applicantId,
      inviter: inviterId,
      type: appType,
      coverNote: coverNote || (appType === "Invitation" ? "You have been invited to join this project team." : "I would like to contribute my skills to this project."),
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: `${appType} successfully created in MongoDB`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all invitations for the logged in user
// @route   GET /api/applications/my-invitations
// @access  Private
exports.getMyInvitations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let orConditions = [{ applicant: req.user.id }];

    if (user) {
      const userConditions = [];
      if (user.email) userConditions.push({ email: user.email.toLowerCase() });
      if (user.name) {
        const safeName = user.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        userConditions.push({ name: new RegExp(`^${safeName}$`, "i") });
      }

      if (userConditions.length > 0) {
        const matchingUsers = await User.find({ $or: userConditions }).select("_id");
        const userIds = matchingUsers.map((u) => u._id);
        orConditions.push({ applicant: { $in: userIds } });
      }
    }

    const invitations = await Application.find({
      $or: orConditions,
      type: "Invitation",
      status: "Pending",
    })
      .populate("project", "title category description leader deadline maxTeamSize requiredSkills")
      .populate("inviter", "name email avatarInitials university role")
      .sort({ createdAt: -1 });

    const validInvitations = invitations.filter((i) => i.project != null);

    res.status(200).json({
      success: true,
      count: validInvitations.length,
      invitations: validInvitations,
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
// @access  Private
exports.getProjectApplications = async (req, res) => {
  try {
    let projectId = req.params.projectId;
    let query = {};

    if (mongoose.isValidObjectId(projectId)) {
      query.project = projectId;
    } else {
      const proj = await Project.findOne();
      if (proj) query.project = proj._id;
    }

    const applications = await Application.find(query)
      .populate("applicant", "name email university skills avatarInitials rating reviewCount bio")
      .populate("project", "title category leader")
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

// @desc    Accept or reject application/invitation
// @route   PUT /api/applications/:id
// @access  Private
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

    application.status = status;
    application.reviewedAt = Date.now();
    await application.save();

    // If accepted, add applicant to project members
    if (status === "Accepted" && application.project) {
      const project = await Project.findById(application.project._id);
      if (project) {
        const userIdToAdd = req.user ? (req.user._id || req.user.id) : application.applicant;
        const alreadyIn = project.members.some(
          (m) =>
            m.user &&
            (m.user.toString() === userIdToAdd.toString() ||
              m.user.toString() === application.applicant.toString())
        );
        if (!alreadyIn) {
          project.members.push({
            user: userIdToAdd,
            roleName: roleName || "Team Member",
            joinedAt: new Date(),
          });
          await project.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status} in MongoDB`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete / Cancel an application or invitation
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Application removed from MongoDB",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
