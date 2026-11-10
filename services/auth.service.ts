// services/auth.service.ts
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse 
} from '@/types/auth.types';

const API_BASE = '/api/auth';

class AuthService {
  private static instance: AuthService;
  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }

      return {
        success: true,
        user: data.user,
        message: data.message || 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Registration failed',
        };
      }

      return {
        success: true,
        user: result.user,
        message: result.message || 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        return {
          success: false,
          message: 'Not authenticated',
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to get user',
        };
      }

      return {
        success: true,
        user: data.user,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Logout failed',
        };
      }

      return {
        success: true,
        message: data.message || 'Logout successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<boolean> {
    const response = await this.getCurrentUser();
    return response.success && !!response.user;
  }
}

export const authService = AuthService.getInstance();