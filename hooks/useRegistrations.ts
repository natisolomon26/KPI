// hooks/useRegistrations.ts
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
          console.log('API Response:', response);
          
          if (response.success) {
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

  // Export registrations to CSV
  const exportRegistrations = useMutation({
    mutationFn: async () => {
      const blob = await registrationService.exportToCSV();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      link.setAttribute('download', `alumni-export-${date}-${time}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Export successful' };
    },
  });

  // Delete all registrations
  const deleteAllRegistrations = useMutation({
    mutationFn: async () => {
      const confirm = 'yes-i-really-want-to-delete-all-data';
      const response = await registrationService.deleteAllRegistrations(confirm);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      // Safely access deletedCount if it exists, otherwise log the response
      if (response && typeof response === 'object' && 'deletedCount' in response) {
        console.log(`Deleted ${(response as any).deletedCount} records`);
      } else {
        console.log('Delete all records operation completed', response);
      }
    },
  });

  return {
    useGetRegistrations,
    useGetRegistration,
    submitRegistration,
    updateRegistration,
    deleteRegistration,
    exportRegistrations,
    deleteAllRegistrations,
  };
};