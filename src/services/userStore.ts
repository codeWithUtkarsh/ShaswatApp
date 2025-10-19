import { create } from "zustand";
import { shopDB } from "./database";

export interface User {
  id?: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStore {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;

  setCurrentUser: (user: User | null) => void;
  getCurrentUserRole: () => "admin" | "employee" | null;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  fetchUserByEmail: (email: string) => Promise<User | null>;
  fetchAllUsers: () => Promise<User[]>;
  addUser: (
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  syncUserFromClerk: (email: string, name: string) => Promise<User>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: null,
  users: [],
  loading: false,
  error: null,

  setCurrentUser: (user: User | null) => {
    set({ currentUser: user });
  },

  getCurrentUserRole: () => {
    const user = get().currentUser;
    return user ? user.role : null;
  },

  isAdmin: () => {
    const user = get().currentUser;
    return user?.role === "admin";
  },

  isEmployee: () => {
    const user = get().currentUser;
    return user?.role === "employee";
  },

  fetchUserByEmail: async (email: string) => {
    try {
      set({ loading: true, error: null });

      const user = await shopDB.getUserByEmail(email);

      if (user) {
        set({ currentUser: user, loading: false });
      } else {
        set({ loading: false });
      }

      return user;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return null;
    }
  },

  fetchAllUsers: async () => {
    try {
      set({ loading: true, error: null });

      const users = await shopDB.getAllUsers();

      set({ users, loading: false });
      return users;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  addUser: async (userData) => {
    try {
      set({ loading: true, error: null });

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await shopDB.addUser(newUser);

      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
      }));

      return newUser;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  updateUser: async (user: User) => {
    try {
      set({ loading: true, error: null });

      const updatedUser = await shopDB.updateUser(user);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u,
        ),
        currentUser:
          state.currentUser?.id === updatedUser.id
            ? updatedUser
            : state.currentUser,
        loading: false,
      }));

      return updatedUser;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ loading: true, error: null });

      await shopDB.deleteUser(id);

      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },

  syncUserFromClerk: async (email: string, name: string) => {
    try {
      set({ loading: true, error: null });

      // Check if user exists in database
      let user = await shopDB.getUserByEmail(email);

      if (!user) {
        // Create new user with employee role by default
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          role: "employee", // Default role is employee
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const createdUser = await shopDB.addUser(newUser);
        user = createdUser;

        set((state) => ({
          users: [...state.users, createdUser],
        }));
      }

      set({ currentUser: user, loading: false });
      return user;
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  },
}));
