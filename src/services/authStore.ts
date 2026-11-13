/**
 * TeamUp Authentication State Store
 * Manages active session, JWT token, and logged-in user profile.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Project Leader" | "Team Member";
  university?: string;
  skills?: string[];
  bio?: string;
  rating?: number;
  reviewCount?: number;
  avatarInitials?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

class AuthStore {
  private token: string | null = null;
  private user: AuthUser | null = null;
  private listeners: Array<() => void> = [];

  setSession(token: string, user: AuthUser) {
    this.token = token;
    this.user = user;
    this.notify();
  }

  clearSession() {
    this.token = null;
    this.user = null;
    this.notify();
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const authStore = new AuthStore();
