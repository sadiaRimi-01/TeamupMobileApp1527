# 🌐 TeamUp REST API Backend

> Complete Node.js + Express.js + MongoDB + JWT REST API server for the **TeamUp** mobile platform.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (.env)
Create or check `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/teamup
JWT_SECRET=teamup_super_secret_jwt_key_2026
JWT_EXPIRE=30d
```

### 3. Seed Sample Data (Optional)
Populate test accounts (Sarah Lin, David Chen, Tanvir Ahmed, Admin):
```bash
node src/seed.js
```

### 4. Start Server
- Development mode (with auto-restart):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

Server will run at: `http://localhost:5000` (or `http://YOUR_LAN_IP:5000` for mobile phone access).

---

## 📡 API Endpoints Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user profile with role & skills, return JWT.
- `POST /api/auth/login` - Verify password (bcrypt) & return JWT.
- `GET /api/auth/me` - Get authenticated profile (Protected).
- `PUT /api/auth/profile` - Update skills, university, bio, links (Protected).
- `GET /api/auth/users` - Search & filter candidates by skill/university.

### 💼 Projects (`/api/projects`)
- `POST /api/projects` - Create new project (Project Leader / Admin).
- `GET /api/projects` - Search & filter by skill, category, difficulty.
- `GET /api/projects/:id` - Project details with leader & members.
- `PUT /api/projects/:id` - Update project details.
- `DELETE /api/projects/:id` - Remove project.

### 📝 Applications (`/api/applications`)
- `POST /api/applications/:projectId` - Apply to join team.
- `GET /api/applications/project/:projectId` - Review applicants (Leader only).
- `PUT /api/applications/:id` - Accept/Reject application (Adds member on acceptance).

### 📋 Kanban Tasks (`/api/tasks`)
- `POST /api/tasks/:projectId` - Assign new task with deadline.
- `GET /api/tasks/:projectId` - Get tasks (todo, in_progress, done).
- `PUT /api/tasks/item/:id` - Update status or reassign.
- `DELETE /api/tasks/item/:id` - Delete task.

### ⭐ Ratings & Reviews (`/api/reviews`)
- `POST /api/reviews` - Rate member across 5 categories & calculate user average.
- `GET /api/reviews/user/:userId` - Get verified reviews of a profile.

### 🎯 Smart Matching Engine (`/api/matchmaker`)
- `POST /api/matchmaker/teammates` - Algorithmic compatibility scoring for skills array.
- `GET /api/matchmaker/projects` - Recommend projects based on user profile skills.

