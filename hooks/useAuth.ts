import { useAuthStore } from '@/store/auth.store';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterCredentials } from '@/types/auth.types';

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  checkAuthOnMount?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const store = useAuthStore();
  const { redirectIfAuthenticated = false, checkAuthOnMount = true } = options;
  const redirectTo = options.redirectTo ?? (redirectIfAuthenticated ? '/dashboard' : '/login');
  const { checkAuth, hasInitialized, isAuthenticated, isLoading, login: loginAction, register: registerAction, logout: logoutAction } = store;

  useEffect(() => {
    if (checkAuthOnMount) void checkAuth();
  }, [checkAuthOnMount, checkAuth]);

  useEffect(() => {
    if (!hasInitialized || isLoading) return;
    if (redirectIfAuthenticated ? isAuthenticated : !isAuthenticated) router.replace(redirectTo);
  }, [hasInitialized, isLoading, isAuthenticated, redirectIfAuthenticated, redirectTo, router]);

  const login = useCallback(async (email: string, password: string, redirectPath?: string) => {
    const result = await loginAction(email, password);
    if (result.success && redirectPath) router.replace(redirectPath);
    return result;
  }, [loginAction, router]);

  const register = useCallback(async (data: RegisterCredentials, redirectPath?: string) => {
    const result = await registerAction(data);
    if (result.success && redirectPath) router.replace(redirectPath);
    return result;
  }, [registerAction, router]);

  const logout = useCallback(async (redirectPath = '/login') => {
    await logoutAction();
    router.replace(redirectPath);
  }, [logoutAction, router]);

  return { ...store, login, register, logout, isAdmin: store.user?.role === 'admin',
    isUser: store.user?.role === 'user', isLoggedIn: isAuthenticated,
    hasRole: (role: 'user' | 'admin') => store.user?.role === role };
}
