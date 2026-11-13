const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    category: {
      type: String,
      required: [true, "Project category is required"],
      enum: [
        "Mobile & AI",
        "Full Stack & Cloud",
        "UI/UX & Web",
        "Machine Learning",
        "IoT & Embedded",
        "Other",
      ],
      default: "Full Stack & Cloud",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    requiredSkills: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one required skill is required",
      },
    },
    maxTeamSize: {
      type: Number,
      default: 4,
      min: 2,
      max: 10,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        roleName: {
          type: String,
          default: "Member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Recruiting", "In Progress", "Completed"],
      default: "Recruiting",
    },
    deadline: {
      type: String,
      default: "TBD",
    },
    githubRepo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for member count
projectSchema.virtual("memberCount").get(function () {
  return (this.members ? this.members.length : 0) + 1; // +1 for leader
});

module.exports = mongoose.model("Project", projectSchema);

