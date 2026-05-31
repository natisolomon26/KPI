// services/registration.service.ts
import { apiClient } from '@/lib/api/client';
import { RegistrationRequest, Registration } from '@/lib/types/api';

export const registrationService = {
  submitRegistration: async (data: RegistrationRequest) => {
    const response = await apiClient.post<Registration>('/registrations', data);
    return response;
  },
  
  getAllRegistrations: async () => {
    const response = await apiClient.get<Registration[]>('/registrations');
    return response;
  },
  
  getRegistrationById: async (id: string) => {
    const response = await apiClient.get<Registration>(`/registrations/${id}`);
    return response;
  },
  
  updateRegistrationStatus: async (id: string, status: 'approved' | 'rejected') => {
    const response = await apiClient.patch<Registration>(`/registrations/${id}/status`, { status });
    return response;
  },
  
  deleteRegistration: async (id: string) => {
    const response = await apiClient.delete(`/registrations/${id}`);
    return response;
  }
};