// hooks/useRegistrations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '@/services/registration.service';
import { useRegistrationStore } from '@/store/registration.store';
import { RegistrationRequest } from '@/lib/types/api';

export const useRegistrations = () => {
  const { setRegistrations, setLoading } = useRegistrationStore();
  const queryClient = useQueryClient();

  // Get all registrations
  const { data: registrationsData, isLoading: isLoadingRegistrations } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      setLoading(true);
      const response = await registrationService.getAllRegistrations();
      if (response.success && response.data) {
        setRegistrations(response.data);
      }
      setLoading(false);
      return response;
    },
  });

  // Submit new registration
  const submitRegistration = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      const response = await registrationService.submitRegistration(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  // Update registration status
  const updateRegistrationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const response = await registrationService.updateRegistrationStatus(id, status);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  // Delete registration
  const deleteRegistration = useMutation({
    mutationFn: async (id: string) => {
      const response = await registrationService.deleteRegistration(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });

  return {
    registrations: registrationsData?.data || [],
    isLoading: isLoadingRegistrations,
    submitRegistration,
    updateRegistrationStatus,
    deleteRegistration,
  };
};