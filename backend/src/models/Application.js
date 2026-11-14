const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inviter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["Application", "Invitation"],
      default: "Application",
    },
    coverNote: {
      type: String,
      trim: true,
      default: "I would like to contribute my skills to this project.",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications/invitations for the same project and applicant
applicationSchema.index({ project: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

