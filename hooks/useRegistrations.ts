// hooks/useRegistrations.ts (fixed)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '@/services/registration.service';
import { useRegistrationStore } from '@/store/registration.store';
import { RegistrationRequest } from '@/lib/types/api';

export const useRegistrations = () => {
  const { setRegistrations, setLoading, setTotalPages, setCurrentPage } = useRegistrationStore();
  const queryClient = useQueryClient();

  // Get all registrations with pagination and search
  const useGetRegistrations = (search?: string, page: number = 1) => {
    return useQuery({
      queryKey: ['registrations', page, search],
      queryFn: async () => {
        setLoading(true);
        try {
          const response = await registrationService.getAllRegistrations({ page, limit: 10, search });
          console.log('API Response:', response); // Debug log
          
          if (response.success) {
            // Ensure data is an array
            const registrationsData = Array.isArray(response.data) ? response.data : [];
            setRegistrations(registrationsData);
            setTotalPages(response.pagination?.pages || 1);
            setCurrentPage(response.pagination?.page || 1);
          } else {
            setRegistrations([]);
          }
          return response;
        } catch (error) {
          console.error('Error fetching registrations:', error);
          setRegistrations([]);
          throw error;
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Get single registration
  const useGetRegistration = (id: string) => {
    return useQuery({
      queryKey: ['registration', id],
      queryFn: async () => {
        const response = await registrationService.getRegistrationById(id);
        return response;
      },
      enabled: !!id,
    });
  };

  // Submit new registration (public)
  const submitRegistration = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      const response = await registrationService.submitRegistration(data);
      return response;
    },
  });

  // Update registration
  const updateRegistration = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RegistrationRequest> }) => {
      const response = await registrationService.updateRegistration(id, data);
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
    useGetRegistrations,
    useGetRegistration,
    submitRegistration,
    updateRegistration,
    deleteRegistration,
  };
};