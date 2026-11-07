export type UserRole = "Leader" | "Member" | "Admin" | "Visitor";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatar?: string;
  skills: string[];
  matchPct: number;
  rating: number;
  reviewCount: number;
  university?: string;
  gradient: [string, string];
  bio?: string;
  githubUrl?: string;
}

export interface ProblemCardItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  metric: string;
  metricLabel: string;
  accent: string;
  icon: string;
}

export interface StepItem {
  num: number;
  stepLabel: string;
  title: string;
  desc: string;
  accent: string;
  icon: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  bgTint: string;
  accentColor: string;
  isDarkCard?: boolean;
  icon: string;
  badge?: string;
}

export interface PersonaTab {
  id: string;
  name: string;
  persona: string;
  benefit: string;
  quote: string;
  avatarInitials: string;
  skills: string[];
  gradient: [string, string];
}

export interface ComparisonRow {
  feature: string;
  teamUp: boolean;
  campLink: boolean;
  collabConnect: boolean;
  devpost: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface StatItem {
  number: string;
  label: string;
  subtext: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  requiredSkills: string[];
  teamSize: number;
  currentMembers: number;
  leader: {
    name: string;
    avatarInitials: string;
  };
  deadline: string;
}

