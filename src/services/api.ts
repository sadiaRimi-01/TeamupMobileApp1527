import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * TeamUp Backend API Configuration & Service Helpers
 * Connects React Native Frontend to Node.js & Express / MongoDB Backend.
 */

// Dynamically retrieve the host IP assigned by Expo Metro, or fall back to LAN IP
export const getApiBaseUrl = (): string => {
  try {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(":")[0];
      if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
        return `http://${ip}:5000/api`;
      }
    }
  } catch {
    // ignore
  }

  // Fallback to active Wi-Fi LAN IP
  return "http://192.168.0.196:5000/api";
};

export let API_BASE_URL = getApiBaseUrl();

export const setApiBaseUrl = (newUrl: string) => {
  API_BASE_URL = newUrl;
};

// Safe fetch with 6-second timeout to avoid long java.net.NoRouteToHostException hangs
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = 6000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error(`Connection timed out after ${timeoutMs / 1000}s. Backend server at ${API_BASE_URL} is not responding.`);
    }
    throw err;
  }
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: any;
  token?: string;
  project?: any;
  projects?: any[];
  task?: any;
  tasks?: any[];
  application?: any;
  applications?: any[];
  users?: any[];
  candidates?: any[];
  reviews?: any[];
  message?: string;
  error?: string;
}

export const ApiService = {
  // Check if Backend Server & MongoDB are reachable
  checkHealth: async (): Promise<{ online: boolean; message: string }> => {
    try {
      const rootUrl = API_BASE_URL.replace("/api", "");
      const res = await fetchWithTimeout(`${rootUrl}/`, { method: "GET" }, 3000);
      const data = await res.json();
      return { online: true, message: data.message || "Backend online" };
    } catch (err: any) {
      return { online: false, message: err.message || "Backend offline" };
    }
  },

  // Authentication
  login: async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err: any) {
      console.warn("API Login Error:", err.message);
      return {
        success: false,
        message: err.message || "Network request failed. Make sure backend is running on your PC.",
      };
    }
  },

  register: async (userData: any): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (err: any) {
      console.warn("API Register Error:", err.message);
      return {
        success: false,
        message: err.message || "Network request failed. Make sure backend is running on your PC.",
      };
    }
  },

  getMe: async (token: string): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  getAllUsers: async (search?: string): Promise<ApiResponse> => {
    try {
      let query = "";
      if (search) query = `?search=${encodeURIComponent(search)}`;
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/users${query}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Projects CRUD
  getProjects: async (category?: string, skill?: string, search?: string): Promise<ApiResponse> => {
    try {
      const params: string[] = [];
      if (category && category !== "All") params.push(`category=${encodeURIComponent(category)}`);
      if (skill) params.push(`skill=${encodeURIComponent(skill)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      const qs = params.length > 0 ? `?${params.join("&")}` : "";

      const res = await fetchWithTimeout(`${API_BASE_URL}/projects${qs}`);
      return await res.json();
    } catch (err: any) {
      console.warn("API getProjects Error:", err.message);
      return { success: false, message: err.message };
    }
  },

  createProject: async (
    token: string,
    projectData: {
      title: string;
      description: string;
      category?: string;
      difficulty?: string;
      requiredSkills: string[] | string;
      maxTeamSize?: number;
      deadline?: string;
    }
  ): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      return await res.json();
    } catch (err: any) {
      console.warn("API createProject Error:", err.message);
      return { success: false, message: err.message || "Network request failed" };
    }
  },

  getProjectById: async (id: string): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/projects/${id}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Project Applications
  applyToProject: async (token: string, projectId: string, coverNote?: string): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/applications/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coverNote }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Application failed" };
    }
  },

  // Tasks CRUD
  getTasks: async (token?: string, projectId?: string): Promise<ApiResponse> => {
    try {
      const endpoint = projectId ? `${API_BASE_URL}/tasks/${projectId}` : `${API_BASE_URL}/tasks`;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetchWithTimeout(endpoint, { headers });
      return await res.json();
    } catch (err: any) {
      console.warn("API getTasks Error:", err.message);
      return { success: false, message: err.message };
    }
  },

  createTask: async (
    token: string,
    taskData: {
      title: string;
      description?: string;
      priority?: string;
      deadline?: string;
      projectId?: string;
    }
  ): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Task creation failed" };
    }
  },

  updateTask: async (token: string, taskId: string, updateData: any): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/tasks/item/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || "Task update failed" };
    }
  },

  // Teammates & Matching
  matchTeammates: async (skills: string[]): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/matchmaker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Reviews
  createReview: async (token: string, reviewData: any): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  getUserReviews: async (userId: string): Promise<ApiResponse> => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/reviews/user/${userId}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },
};
