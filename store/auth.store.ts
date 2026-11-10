import { create } from 'zustand';
import { User, AuthState, RegisterCredentials, AuthActionResult } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

interface AuthStore extends AuthState {
  hasInitialized: boolean;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (data: RegisterCredentials) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
  checkAuth: (force?: boolean) => Promise<void>;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// A newer login/logout must always win over an older session request.
let sessionVersion = 0;
let sessionCheck: Promise<void> | null = null;
const signedOut = { user: null, isAuthenticated: false, isLoading: false, hasInitialized: true, error: null };

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...signedOut,
  isLoading: true,
  hasInitialized: false,

  login: async (email, password) => {
    const version = ++sessionVersion;
    set({ isLoading: true, error: null });
    const response = await authService.login({ email: email.trim().toLowerCase(), password });
    if (version !== sessionVersion) return { success: false, message: 'Session changed. Please try again.' };
    if (response.success && response.user) {
      set({ user: response.user, isAuthenticated: true, isLoading: false, hasInitialized: true, error: null });
      return { success: true, message: response.message };
    }
    const message = response.message || 'Login failed';
    set({ ...signedOut, error: message });
    return { success: false, message, fieldErrors: response.fieldErrors };
  },

  register: async (data) => {
    const version = ++sessionVersion;
    set({ isLoading: true, error: null });
    const response = await authService.register(data);
    if (version !== sessionVersion) return { success: false, message: 'Session changed. Please try again.' };
    // The registration endpoint also creates a session cookie.
    if (response.success && response.user) {
      set({ user: response.user, isAuthenticated: true, isLoading: false, hasInitialized: true, error: null });
      return { success: true, message: response.message };
    }
    const message = response.message || 'Registration failed';
    set({ ...signedOut, error: message });
    return { success: false, message, fieldErrors: response.fieldErrors };
  },

  logout: async () => {
    const version = ++sessionVersion;
    set({ isLoading: true, error: null });
    const result = await authService.logout();
    if (version !== sessionVersion) return;
    if (!result.success) {
      set({ isLoading: false, error: result.message });
      throw new Error(result.message);
    }
    set(signedOut);
  },

  checkAuth: (force = false) => {
    if (!force && get().hasInitialized) return Promise.resolve();
    if (sessionCheck) return sessionCheck;
    const version = sessionVersion;
    set({ isLoading: true });
    sessionCheck = (async () => {
      try {
        const response = await authService.getCurrentUser();
        if (version !== sessionVersion) return;
        if (response.success && response.user) {
          set({ user: response.user, isAuthenticated: true, isLoading: false, hasInitialized: true, error: null });
        } else {
          set(signedOut);
        }
      } finally {
        sessionCheck = null;
      }
    })();
    return sessionCheck;
  },

  setUser: (user) => { ++sessionVersion; set({ user, isAuthenticated: !!user, hasInitialized: true, isLoading: false }); },
  setAuthenticated: (value) => { ++sessionVersion; set(value ? { isAuthenticated: true } : signedOut); },
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => { ++sessionVersion; set(signedOut); },
}));
