// hooks/useAuth.ts
import { useAuthStore } from '@/store/auth.store';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  checkAuthOnMount?: boolean;
}

export function useAuth(options?: UseAuthOptions) {
  const router = useRouter();
  const store = useAuthStore();
  const hasChecked = useRef(false);
  const redirectAttempted = useRef(false);

  const {
    redirectTo = '/login',
    redirectIfAuthenticated = false,
    checkAuthOnMount = true,
  } = options || {};

  // Check auth on mount
  useEffect(() => {
    if (checkAuthOnMount && !hasChecked.current) {
      hasChecked.current = true;
      store.checkAuth();
    }
  }, [checkAuthOnMount, store]);

  // Handle redirects
  useEffect(() => {
    if (store.isLoading || redirectAttempted.current) return;

    if (redirectIfAuthenticated && store.isAuthenticated) {
      redirectAttempted.current = true;
      router.replace(redirectTo);
      return;
    }

    if (!redirectIfAuthenticated && !store.isAuthenticated && !store.isLoading) {
      redirectAttempted.current = true;
      router.replace(redirectTo);
    }
  }, [
    store.isAuthenticated,
    store.isLoading,
    router,
    redirectTo,
    redirectIfAuthenticated,
  ]);

  // Reset redirect attempt on auth change
  useEffect(() => {
    if (store.isAuthenticated) {
      redirectAttempted.current = false;
    }
  }, [store.isAuthenticated]);

  // Login with redirect
  const login = useCallback(
    async (email: string, password: string, redirectPath?: string) => {
      redirectAttempted.current = false;
      const result = await store.login(email, password);
      
      if (result.success && redirectPath) {
        router.push(redirectPath);
      }
      
      return result;
    },
    [store.login, router]
  );

  // Register with redirect
  const register = useCallback(
    async (
      data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: 'user' | 'admin';
      },
      redirectPath?: string
    ) => {
      redirectAttempted.current = false;
      const result = await store.register(data);
      
      if (result.success && redirectPath) {
        router.push(redirectPath);
      }
      
      return result;
    },
    [store.register, router]
  );

  // Logout with redirect
  const logout = useCallback(
    async (redirectPath?: string) => {
      redirectAttempted.current = false;
      await store.logout();
      if (redirectPath) {
        router.push(redirectPath);
      }
    },
    [store.logout, router]
  );

  // Check auth manually
  const checkAuth = useCallback(async () => {
    await store.checkAuth();
  }, [store]);

  // Convenience methods
  const hasRole = useCallback(
    (role: 'user' | 'admin') => store.user?.role === role,
    [store.user]
  );

  const isAdmin = store.user?.role === 'admin';
  const isUser = store.user?.role === 'user';

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    setUser: store.setUser,
    setAuthenticated: store.setAuthenticated,
    setError: store.setError,
    clearError: store.clearError,
    reset: store.reset,
    
    // Convenience
    isAdmin,
    isUser,
    hasRole,
    isLoggedIn: store.isAuthenticated,
  };
}