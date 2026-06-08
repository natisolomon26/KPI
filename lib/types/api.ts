// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// types/registration.ts


// lib/types/api.ts
export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  university: string;
  campus: string;
  department: string;
  graduationYear: string;
  currentLocation: string;
}

export interface Registration {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  university: string;
  campus: string;
  department: string;
  graduationYear: string;
  currentLocation: string;
  registeredAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}