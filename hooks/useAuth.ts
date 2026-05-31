// hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.services';
import { useAuthStore } from '@/store/auth.store';
import { LoginRequest } from '@/lib/types/api';

export const useLogin = () => {
  const router = useRouter();
  const { setUser, setAuthenticated, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      setLoading(true);
      const response = await authService.login(credentials);
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store token
        const { token, user } = response.data;
        document.cookie = `auth-token=${token}; path=/; max-age=604800; SameSite=Strict`;
        localStorage.setItem('auth-token', token);
        
        // Update store
        setUser(user);
        setAuthenticated(true);
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
      setLoading(false);
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      setLoading(false);
    },
  });
};