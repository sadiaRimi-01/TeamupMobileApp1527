const mongoose = require("mongoose");
const Review = require("../models/Review");
const User = require("../models/User");
const Project = require("../models/Project");

// @desc    Submit a review and rating for a team member
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    let { targetUserId, projectId, ratings, rating, comment } = req.body;

    if (!comment || (!rating && !ratings)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rating (1-5) and a review comment.",
      });
    }

    let finalRating = 5;
    if (typeof rating === "number") {
      finalRating = Math.min(5, Math.max(1, rating));
    } else if (typeof ratings === "number") {
      finalRating = Math.min(5, Math.max(1, ratings));
    } else if (ratings && typeof ratings.overall === "number") {
      finalRating = Math.min(5, Math.max(1, ratings.overall));
    } else if (ratings && typeof ratings === "object") {
      const comm = ratings.communication || 5;
      const tech = ratings.technicalSkills || 5;
      const resp = ratings.responsibility || 5;
      const team = ratings.teamwork || 5;
      finalRating = Number(((comm + tech + resp + team) / 4).toFixed(1));
    }

    // Resolve project
    let project = null;
    if (projectId && mongoose.isValidObjectId(projectId)) {
      project = await Project.findById(projectId);
    }
    if (!project && typeof projectId === "string") {
      project = await Project.findOne({ title: new RegExp(projectId.trim(), "i") });
    }
    if (!project) {
      project = await Project.findOne();
    }
    if (!project) {
      project = await Project.create({
        title: "Team Project",
        description: "Collaborative project on TeamUp",
        leader: req.user.id,
      });
    }

    // Resolve target user
    let targetUser = null;
    if (targetUserId && mongoose.isValidObjectId(targetUserId)) {
      targetUser = await User.findById(targetUserId);
    }
    if (!targetUser && typeof targetUserId === "string") {
      targetUser =
        (await User.findOne({ name: new RegExp(`^${targetUserId.trim()}$`, "i") })) ||
        (await User.findOne({ name: new RegExp(targetUserId.trim(), "i") }));
    }
    if (!targetUser) {
      const cleanName = (targetUserId || "Teammate").trim();
      targetUser = await User.create({
        name: cleanName,
        email: `${cleanName.replace(/\s+/g, "").toLowerCase()}@teamup.com`,
        password: "password123",
        role: "Team Member",
        skills: ["React Native", "TypeScript"],
        university: "University",
        avatarInitials: cleanName.substring(0, 2).toUpperCase(),
        rating: finalRating,
        reviewCount: 1,
      });
    }

    if (String(targetUser._id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot review yourself.",
      });
    }

    // Check duplicate review or update
    let review = await Review.findOne({
      reviewer: req.user.id,
      targetUser: targetUser._id,
      project: project._id,
    });

    if (review) {
      review.ratings = {
        communication: finalRating,
        technicalSkills: finalRating,
        responsibility: finalRating,
        teamwork: finalRating,
        overall: finalRating,
      };
      review.comment = comment.trim();
      await review.save();
    } else {
      review = await Review.create({
        reviewer: req.user.id,
        targetUser: targetUser._id,
        project: project._id,
        ratings: {
          communication: finalRating,
          technicalSkills: finalRating,
          responsibility: finalRating,
          teamwork: finalRating,
          overall: finalRating,
        },
        comment: comment.trim(),
      });
    }

    // Recalculate target user's total average rating & count
    const allReviews = await Review.find({ targetUser: targetUser._id });
    const totalScore = allReviews.reduce((sum, r) => sum + r.ratings.overall, 0);
    const avgScore = Number((totalScore / allReviews.length).toFixed(1));

    targetUser.rating = avgScore;
    targetUser.reviewCount = allReviews.length;
    await targetUser.save();

    res.status(201).json({
      success: true,
      message: "Review and rating saved successfully in MongoDB",
      review,
      updatedUserRating: {
        rating: targetUser.rating,
        reviewCount: targetUser.reviewCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    let targetUserId = req.params.userId;
    let query = { targetUser: targetUserId };

    if (!mongoose.isValidObjectId(targetUserId)) {
      const u = await User.findOne({ name: new RegExp(`^${targetUserId.trim()}$`, "i") });
      if (u) {
        query = { targetUser: u._id };
      }
    }

    const reviews = await Review.find(query)
      .populate("reviewer", "name avatarInitials role university")
      .populate("project", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

