import { create } from 'zustand';

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

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: localStorage.getItem('isLoggedIn') === 'true',
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      // Mock API call - in a real app, this would be an API request
      await new Promise(resolve => setTimeout(resolve, 800));

      // This is just a simulation - in a real app, the backend would validate credentials
      // and return a JWT token or session cookie along with user data
      if (email === 'admin@example.com' && password === 'password') {
        const mockUser: User = {
          id: 'user-1',
          name: 'Admin User',
          email: email,
          role: 'admin'
        };

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(mockUser));

        set({
          isAuthenticated: true,
          user: mockUser,
          loading: false
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');

    set({
      isAuthenticated: false,
      user: null,
      error: null
    });
  },

  checkAuthStatus: async () => {
    try {
      // Check if user is logged in from localStorage
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('user');

      if (isLoggedIn && userData) {
        const user = JSON.parse(userData) as User;
        set({ isAuthenticated: true, user });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking auth status:', error);
      set({ isAuthenticated: false, user: null });
      return false;
    }
  }
}));
