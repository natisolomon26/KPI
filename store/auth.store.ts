// stores/auth.store.ts (simpler version)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ user }),
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      
      setLoading: (value) => set({ isLoading: value }),
      
      checkAuth: () => {
        console.log('Checking authentication...');
        
        // Check if token exists in cookies
        const hasCookieToken = typeof document !== 'undefined' && 
          document.cookie.split(';').some(cookie => cookie.trim().startsWith('auth-token='));
        
        // Check if token exists in localStorage
        const hasLocalToken = typeof localStorage !== 'undefined' && 
          localStorage.getItem('auth-token');
        
        const isAuth = hasCookieToken || !!hasLocalToken;
        
        console.log('Auth status:', isAuth);
        
        set({ 
          isAuthenticated: isAuth, 
          isLoading: false 
        });
      },
      
      logout: () => {
        if (typeof document !== 'undefined') {
          // Clear cookie
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          // Clear localStorage
          localStorage.removeItem('auth-token');
          // Clear persisted store
          localStorage.removeItem('auth-storage');
        }
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Omit partialize to store the entire state, or use it without type annotation
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }) as any, // Type assertion to bypass strict type checking
    }
  )
);