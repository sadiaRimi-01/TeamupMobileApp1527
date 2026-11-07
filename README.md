# 🚀 TeamUp — Skill-Based Team Formation Mobile Platform

> **TeamUp** is a full-stack mobile application connecting students, developers, and designers for project collaboration. It replaces chaotic Facebook groups and unorganized messaging threads with algorithmic skill-matching, verifiable peer reviews, in-app messaging, and Kanban task management.

---

## 📱 Mobile Preview (Physical Smartphone Testing)

You do **NOT** need Android Studio or heavy emulators to run and test this app. You can test it live directly on your physical Android / iOS smartphone with instant Fast Refresh!

### Step 1: Install Expo Go on your Phone
- **Android**: Download **Expo Go** from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
- **iOS**: Download **Expo Go** from Apple App Store.

### Step 2: Start the Metro Development Server
Open your terminal in `C:\PROJECT\MobileApp\TeamUp` and run:

```bash
npm start
```
*(or `npx expo start`)*

### Step 3: Scan QR Code with Your Phone
- **Android Phone**: Open the **Expo Go** app → Tap **"Scan QR Code"** → Point your camera at the QR code in your PC terminal.
- **iOS Phone**: Open the default Camera app → Scan the QR code → Tap the Expo Go banner to open.

> 💡 **Tip (Different Wi-Fi / Mobile Data)**: If your phone and PC are on separate networks or mobile hotspot, run:
> ```bash
> npm run tunnel
> ```
> *(or `npx expo start --tunnel`)*
> This creates a secure tunnel that works anywhere in the world!

---

## 🎯 Objectives
- **Centralized Platform**: Provide a dedicated mobile platform for academic and software collaboration.
- **Skill-Based Matching**: Match teammates based on verified skills, portfolio links, and compatibility scores.
- **Task Management**: Empower project leaders to assign tasks, set deadlines, and track milestones.
- **Reputation & Review System**: Eliminate freeloading with post-project peer ratings and reviews.
- **Direct Communication**: In-app team chats and real-time alerts.

---

## ✨ Core Features

| Feature Category | Description |
| :--- | :--- |
| **Core 1: Profile Matching** | Detailed profiles featuring skills, university, experience, portfolio, and GitHub links. |
| **Core 2: Project Posting & Recruitment** | Leaders create project postings, specify competencies, and review incoming candidate applications. |
| **Core 3: Task Assignment & Tracking** | Kanban milestone tracking (To Do, In Progress, Done) with deadlines and assignee tags. |
| **Core 4: Rating & Real Review System** | Post-project multi-factor reviews (Communication, Technical Skill, Responsibility, Teamwork). |
| **Bonus: Smart Matching Engine** | Live algorithmic compatibility scoring dynamically matching candidate profiles with project requirements. |
| **Role-Based JWT Authentication** | Granular permissions for Admin, Project Leader, Team Member, and Visitor. |

---

## 🎨 Color Palette & Design System (Matching Java TeamUp)
Designed with a light-first modern canvas and high-energy brand accents:
- **Primary Brand Pink**: `#EA4C89`
- **Ink Dark Surface**: `#0D0C22`
- **Warm Canvas Light**: `#F8F7F4`
- **Accent Violet**: `#7C5CFF`
- **Accent Cyan**: `#22D3EE`
- **Success Mint**: `#10B981` / `#3DDBB0`
- **Pastel Card Tints**: `#FFF0F5`, `#F3F0FF`, `#EBFBF5`, `#FFFAEC`, `#F0F8FF`

---

## 🛠 Technology Stack
- **Mobile Frontend**: React Native with TypeScript & Expo Router (SDK 57)
- **Icons & UI**: `@expo/vector-icons` (Ionicons)
- **Backend API**: Node.js & Express.js REST API
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt hashing
- **Notifications**: Firebase Cloud Messaging (FCM)

---

## 📂 Project Architecture

```
TeamUp/
├── app/                              # Expo Router file-based pages
│   ├── _layout.tsx                   # Global Stack layout & Status Bar
│   ├── index.tsx                     # Landing Page (Full Java TeamUp Design)
│   ├── login.tsx                     # Sign In Screen
│   ├── register.tsx                  # Account Registration Screen
│   ├── projects.tsx                  # Explore & Post Projects Screen
│   ├── teams.tsx                     # Candidate Matching Screen
│   ├── tasks.tsx                     # Kanban Task Management Screen
│   ├── chat.tsx                      # Real-time Team Chat Screen
│   ├── profile.tsx                   # Professional Profile & Peer Reviews
│   └── notifications.tsx             # Notification Center
├── src/
│   ├── constants/
│   │   ├── theme.ts                  # Brand design tokens (Pink, Ink, Pastels)
│   │   ├── colors.ts                 # Color variables
│   │   └── mockData.ts               # Candidate data, features, FAQs, stats
│   ├── components/
│   │   ├── common/                   # Reusable UI primitives (Button, Chip, Badge, Logo)
│   │   ├── landing/                  # Landing page sections matching Java project
│   │   │   ├── HeaderNav.tsx         # Navbar with mobile menu & quick actions
│   │   │   ├── HeroSection.tsx       # Hero with search, pills, member cards carousel
│   │   │   ├── ProblemSection.tsx    # 3 Problem Cards with metrics
│   │   │   ├── HowItWorksSection.tsx # 4-step workflow
│   │   │   ├── MatchDemoSection.tsx  # Live interactive matching demo
│   │   │   ├── FeaturesSection.tsx   # 7 core features in pastel cards
│   │   │   ├── AudienceSection.tsx   # Persona tabs (Students, Developers, etc.)
│   │   │   ├── CompareSection.tsx    # Comparison table (TeamUp vs Old Way)
│   │   │   ├── NumbersSection.tsx    # 10k+ stats strip
│   │   │   ├── FaqSection.tsx        # Accordion FAQ
│   │   │   ├── CtaSection.tsx        # Early access newsletter / CTA
│   │   │   └── FooterSection.tsx     # Deep dark footer
│   │   └── navigation/
│   │       └── DrawerMenu.tsx        # Slide-out navigation drawer
│   ├── services/
│   │   └── api.ts                    # REST API abstraction for Node.js / MongoDB
│   └── types/
│       └── index.ts                  # TypeScript models & interfaces
├── app.json                          # Expo configuration
└── package.json                      # Dependencies & scripts
```

---

## 🎥 Project Demonstration & Submission
- **Demo Video (YouTube)**: *[Link to be added]*
- **Android APK Build**: Can be generated using `eas build -p android --profile preview`.

---

© 2026 **TeamUp Platform**. Developed for academic and software project collaboration.
