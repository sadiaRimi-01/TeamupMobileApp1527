/**
 * TeamUp Backend API Configuration & Service Helpers
 * Connects React Native Frontend to Node.js & Express / MongoDB Backend.
 */

// Replace with your local machine's LAN IP when testing on a physical phone,
// or your deployed cloud backend URL (e.g. Render, Railway, Vercel).
export const API_BASE_URL = "http://192.168.0.100:5000/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const ApiService = {
  // Authentication
  login: async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Network request failed" };
    }
  },

  register: async (userData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Network request failed" };
    }
  },

  // Projects CRUD
  getProjects: async (category?: string, skill?: string) => {
    try {
      const url = new URL(`${API_BASE_URL}/projects`);
      if (category) url.searchParams.append("category", category);
      if (skill) url.searchParams.append("skill", skill);

      const res = await fetch(url.toString());
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Teammates & Matching
  matchTeammates: async (skills: string[]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/matchmaker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },
};

