const Review = require("../models/Review");
const User = require("../models/User");
const Project = require("../models/Project");

// @desc    Submit a review and rating for a team member
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { targetUserId, projectId, ratings, comment } = req.body;

    if (!targetUserId || !projectId || !ratings || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide targetUserId, projectId, ratings object, and comment.",
      });
    }

    if (targetUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot review yourself.",
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found.",
      });
    }

    // Check duplicate review
    const existing = await Review.findOne({
      reviewer: req.user.id,
      targetUser: targetUserId,
      project: projectId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this member on this project.",
      });
    }

    // Calculate overall average for this review if not provided
    const { communication, technicalSkills, responsibility, teamwork } = ratings;
    const computedOverall =
      ratings.overall ||
      Number(
        ((communication + technicalSkills + responsibility + teamwork) / 4).toFixed(1)
      );

    const review = await Review.create({
      reviewer: req.user.id,
      targetUser: targetUserId,
      project: projectId,
      ratings: {
        communication,
        technicalSkills,
        responsibility,
        teamwork,
        overall: computedOverall,
      },
      comment,
    });

    // Recalculate target user's total average rating & count
    const allReviews = await Review.find({ targetUser: targetUserId });
    const totalScore = allReviews.reduce((sum, r) => sum + r.ratings.overall, 0);
    const avgScore = Number((totalScore / allReviews.length).toFixed(1));

    targetUser.rating = avgScore;
    targetUser.reviewCount = allReviews.length;
    await targetUser.save();

    res.status(201).json({
      success: true,
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
    const reviews = await Review.find({ targetUser: req.params.userId })
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

