// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
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
export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  university: string;
  graduationYear: string;
  currentLocation: string;
}

export interface Registration extends RegistrationRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  updatedAt?: string;
}