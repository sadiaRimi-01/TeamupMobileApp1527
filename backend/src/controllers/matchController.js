const User = require("../models/User");
const Project = require("../models/Project");

// @desc    Match candidates based on required skills & calculate compatibility %
// @route   POST /api/matchmaker/teammates
// @access  Public
exports.matchTeammates = async (req, res) => {
  try {
    const { skills } = req.body; // e.g. ["Java", "MySQL", "Spring"]

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of required skills to run matching.",
      });
    }

    // Lowercase required skills for case-insensitive matching
    const reqSkillsLower = skills.map((s) => s.trim().toLowerCase());

    // Find all active team members & leaders
    const candidates = await User.find({ isAvailable: true }).select(
      "name email university skills bio rating reviewCount avatarInitials gradient githubUrl portfolioUrl"
    );

    const scoredCandidates = candidates.map((cand) => {
      const candSkills = cand.skills || [];
      const candSkillsLower = candSkills.map((s) => s.trim().toLowerCase());

      let matchedSkills = [];
      for (const reqSkill of reqSkillsLower) {
        if (candSkillsLower.includes(reqSkill)) {
          matchedSkills.push(reqSkill);
        }
      }

      // Base skill match percentage (60% weight)
      const skillMatchRatio = matchedSkills.length / reqSkillsLower.length;
      const skillScore = skillMatchRatio * 60;

      // Rating bonus (30% weight) based on 1-5 rating scale
      const ratingRatio = (cand.rating || 4.5) / 5.0;
      const ratingScore = ratingRatio * 30;

      // Profile completeness / review experience bonus (10% weight)
      const experienceBonus = Math.min(10, (cand.reviewCount || 0) * 1.5 + (cand.githubUrl ? 4 : 0));

      const totalPct = Math.min(99, Math.round(skillScore + ratingScore + experienceBonus));

      return {
        id: cand._id,
        name: cand.name,
        email: cand.email,
        university: cand.university,
        skills: cand.skills,
        bio: cand.bio,
        rating: cand.rating,
        reviewCount: cand.reviewCount,
        avatarInitials: cand.avatarInitials,
        gradient: cand.gradient,
        githubUrl: cand.githubUrl,
        portfolioUrl: cand.portfolioUrl,
        matchPct: totalPct,
        matchedSkillsCount: matchedSkills.length,
        totalRequiredCount: reqSkillsLower.length,
      };
    });

    // Sort by match percentage descending
    scoredCandidates.sort((a, b) => b.matchPct - a.matchPct);

    res.status(200).json({
      success: true,
      querySkills: skills,
      totalMatched: scoredCandidates.length,
      candidates: scoredCandidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Recommend projects for logged-in user based on their profile skills
// @route   GET /api/matchmaker/projects
// @access  Private
exports.recommendProjectsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.skills || user.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add skills to your profile to get personalized recommendations.",
      });
    }

    const userSkillsLower = user.skills.map((s) => s.trim().toLowerCase());

    const activeProjects = await Project.find({ status: "Recruiting" })
      .populate("leader", "name university avatarInitials rating")
      .populate("members.user", "name skills");

    const recommendedProjects = activeProjects.map((proj) => {
      const projSkills = proj.requiredSkills || [];
      const projSkillsLower = projSkills.map((s) => s.trim().toLowerCase());

      let overlapCount = 0;
      for (const s of userSkillsLower) {
        if (projSkillsLower.includes(s)) {
          overlapCount++;
        }
      }

      const matchRatio = projSkillsLower.length > 0 ? overlapCount / projSkillsLower.length : 0;
      const fitPct = Math.min(99, Math.max(40, Math.round(matchRatio * 50 + 49)));

      return {
        project: proj,
        fitPct,
        overlapSkillsCount: overlapCount,
      };
    });

    recommendedProjects.sort((a, b) => b.fitPct - a.fitPct);

    res.status(200).json({
      success: true,
      userSkills: user.skills,
      count: recommendedProjects.length,
      recommendations: recommendedProjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

