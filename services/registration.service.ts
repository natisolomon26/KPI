// services/registration.service.ts
import { Registration, ApiResponse } from '@/lib/types/api';

export interface RegistrationsResponse extends ApiResponse<Registration[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    universities: number;
    thisMonth: number;
    countries: number;
  };
  user: {
    userId: string;
    email: string;
    role: 'user' | 'admin';
    iat: number;
    exp: number;
  };
}

class RegistrationService {
  private static instance: RegistrationService;
  private constructor() {}

  public static getInstance(): RegistrationService {
    if (!RegistrationService.instance) {
      RegistrationService.instance = new RegistrationService();
    }
    return RegistrationService.instance;
  }

  async getAllRegistrations(page = 1, limit = 10, search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await fetch(`/api/registrations?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch registrations');
    }

    return response.json() as Promise<RegistrationsResponse>;
  }

  async getRegistration(id: string) {
    const response = await fetch(`/api/registrations/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch registration');
    }

    return response.json();
  }

  async createRegistration(data: Partial<Registration>) {
    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create registration');
    }

    return response.json();
  }

  async updateRegistration(id: string, data: Partial<Registration>) {
    const response = await fetch(`/api/registrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update registration');
    }

    return response.json();
  }

  async deleteRegistration(id: string) {
    const response = await fetch(`/api/registrations/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete registration');
    }

    return response.json();
  }

  async exportRegistrations() {
    const response = await fetch('/api/registrations/export', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to export registrations');
    }

    return response.blob();
  }
}

export const registrationService = RegistrationService.getInstance();