// store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    role?: 'user' | 'admin' 
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login action
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login({ email, password });
          
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, message: response.message };
          } else {
            set({
              isLoading: false,
              error: response.message || 'Login failed',
            });
            return { success: false, message: response.message || 'Login failed' };
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ 
            isLoading: false, 
            error: message,
            user: null,
            isAuthenticated: false,
          });
          return { success: false, message };
        }
      },

      /**
       * Register action
       */
      register: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.register(data);
          
          if (response.success) {
            // Don't automatically log in - user needs to login
            set({
              isLoading: false,
              error: null,
              // Keep user as null - they need to login manually
              user: null,
              isAuthenticated: false,
            });
            return { success: true, message: response.message };
          } else {
            set({
              isLoading: false,
              error: response.message || 'Registration failed',
            });
            return { success: false, message: response.message || 'Registration failed' };
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ 
            isLoading: false, 
            error: message,
            user: null,
            isAuthenticated: false,
          });
          return { success: false, message };
        }
      },

      /**
       * Logout action
       */
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear state even if API fails
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Check authentication status
       */
      checkAuth: async () => {
        // Don't check if already authenticated and user exists
        const { isAuthenticated, user } = get();
        if (isAuthenticated && user) {
          return;
        }

        set({ isLoading: true });
        
        try {
          const response = await authService.getCurrentUser();
          
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error('Check auth error:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * Set user
       */
      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user,
        });
      },

      /**
       * Set authentication status
       */
      setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
      },

      /**
       * Set error
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Reset store
       */
      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);