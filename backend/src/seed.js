const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");

dotenv.config();

const seedData = async () => {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamup";
    await mongoose.connect(connUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    console.log("Cleared old data.");

    // Seed Users
    const users = await User.create([
      {
        name: "Sarah Lin",
        email: "sarah@teamup.com",
        password: "password123",
        role: "Project Leader",
        university: "BUET",
        skills: ["Java", "Spring Boot", "Docker", "PostgreSQL"],
        bio: "Passionate about concurrent architecture, microservices, and database tuning.",
        avatarInitials: "SL",
        rating: 4.9,
        reviewCount: 14,
      },
      {
        name: "David Chen",
        email: "david@teamup.com",
        password: "password123",
        role: "Team Member",
        university: "DU",
        skills: ["UI/UX", "Figma", "Design System", "Mobile"],
        bio: "Obsessed with clean typography, micro-interactions, and accessible designs.",
        avatarInitials: "DC",
        rating: 5.0,
        reviewCount: 19,
      },
      {
        name: "Tanvir Ahmed",
        email: "tanvir@teamup.com",
        password: "password123",
        role: "Project Leader",
        university: "AUST",
        skills: ["Python", "PyTorch", "NLP", "FastAPI"],
        bio: "Deep learning models, natural language processing, and data-driven intelligence.",
        avatarInitials: "TA",
        rating: 4.9,
        reviewCount: 16,
      },
      {
        name: "Admin User",
        email: "admin@teamup.com",
        password: "adminpassword123",
        role: "Admin",
        university: "TeamUp Admin",
        skills: ["Security", "Platform Management"],
        bio: "Platform moderator & administrator.",
        avatarInitials: "AD",
      },
    ]);

    console.log(`Created ${users.length} sample users.`);

    // Seed Project
    const project = await Project.create({
      title: "AI-Powered Smart Campus Navigation",
      description: "Building a React Native cross-platform indoor routing mobile application with graph pathfinding.",
      category: "Mobile & AI",
      difficulty: "Advanced",
      requiredSkills: ["React Native", "TypeScript", "Node.js", "Python"],
      maxTeamSize: 4,
      leader: users[2]._id,
      deadline: "Dec 15, 2026",
      status: "Recruiting",
    });

    console.log(`Created sample project: ${project.title}`);

    // Seed Task
    await Task.create({
      project: project._id,
      title: "Implement JWT Authentication & User Roles",
      description: "Setup bcrypt password hashing and token generation in Express.",
      assignee: users[0]._id,
      status: "in_progress",
      priority: "High",
      deadline: "Tomorrow",
    });

    console.log("Database seeded successfully! 🌱");
    console.log("Test Login Credentials:");
    console.log("👉 Sarah Lin: sarah@teamup.com | password: password123");
    console.log("👉 David Chen: david@teamup.com | password: password123");
    console.log("👉 Admin: admin@teamup.com | password: adminpassword123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();

