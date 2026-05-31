// services/auth.service.ts
import { apiClient } from '@/lib/api/client';
import { LoginRequest, LoginResponse } from '@/lib/types/api';

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    return response;
  },
  
  logout: () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('auth-token');
    }
  },
  
  isAuthenticated: (): boolean => {
    if (typeof document === 'undefined') return false;
    const token = document.cookie.includes('auth-token');
    return token;
  }
};