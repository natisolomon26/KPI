// services/registration.service.ts
import { apiClient } from '@/lib/api/client';
import { RegistrationRequest, Registration } from '@/lib/types/api';

export const registrationService = {
  submitRegistration: async (data: RegistrationRequest) => {
    const response = await apiClient.post<Registration>('/registrations', data);
    return response;
  },
  
  getAllRegistrations: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `/registrations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<any>(url);
    
    return {
      success: response.success,
      data: response.data || [],
      pagination: response.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
    };
  },
  
  getRegistrationById: async (id: string) => {
    const response = await apiClient.get<Registration>(`/registrations/${id}`);
    return response;
  },
  
  updateRegistration: async (id: string, data: Partial<RegistrationRequest>) => {
    const response = await apiClient.put<Registration>(`/registrations/${id}`, data);
    return response;
  },
  
  deleteRegistration: async (id: string) => {
    const response = await apiClient.delete(`/registrations/${id}`);
    return response;
  },

  // Export registrations to CSV
  exportToCSV: async () => {
    const response = await fetch('/api/registrations/export');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to export registrations');
    }
    
    return response.blob();
  },

  // Delete all registrations
  deleteAllRegistrations: async (confirm: string) => {
    const response = await apiClient.delete(`/registrations/delete-all?confirm=${confirm}`);
    return response;
  },
};