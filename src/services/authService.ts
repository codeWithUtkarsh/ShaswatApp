import { create } from "zustand";

// Note: This app uses Clerk for authentication
// This store is kept for legacy compatibility but Clerk should be used instead

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: localStorage.getItem("isLoggedIn") === "true",
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      if (email === "admin@example.com" && password === "password") {
        const user: User = {
          id: "user-1",
          name: "Admin User",
          email: email,
          role: "admin",
        };

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(user));

        set({
          isAuthenticated: true,
          user: user,
          loading: false,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    set({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  },

  checkAuthStatus: async () => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userData = localStorage.getItem("user");

      if (isLoggedIn && userData) {
        const user = JSON.parse(userData) as User;
        set({ isAuthenticated: true, user });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking auth status:", error);
      set({ isAuthenticated: false, user: null });
      return false;
    }
  },
}));
