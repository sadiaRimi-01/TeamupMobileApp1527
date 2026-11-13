const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    ratings: {
      communication: { type: Number, required: true, min: 1, max: 5 },
      technicalSkills: { type: Number, required: true, min: 1, max: 5 },
      responsibility: { type: Number, required: true, min: 1, max: 5 },
      teamwork: { type: Number, required: true, min: 1, max: 5 },
      overall: { type: Number, required: true, min: 1, max: 5 },
    },
    comment: {
      type: String,
      required: [true, "Review feedback comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per reviewer per target user per project
reviewSchema.index({ reviewer: 1, targetUser: 1, project: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);

