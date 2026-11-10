// types/auth.types.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type RegistrationErrors = Partial<Record<keyof RegisterCredentials | 'confirmPassword', string>>;

export interface AuthActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: RegistrationErrors;
}

export interface AuthResponse extends AuthActionResult {
  user?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}