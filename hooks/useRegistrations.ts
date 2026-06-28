// hooks/useRegistrations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRegistrationStore } from '@/store/registration.store';
import { registrationService } from '@/services/registration.service';
import { Registration } from '@/lib/types/api';

export function useRegistrations() {
  const queryClient = useQueryClient();
  const { 
    registrations, 
    isLoading, 
    isFetching,
    error, 
    pagination,
    totalPages,
    stats,
    fetchRegistrations,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    setError,
    clearError,
    setFetching
  } = useRegistrationStore();

  // Query for getting registrations with pagination and search
  const useGetRegistrations = (search: string, page: number) => {
    return useQuery({
      queryKey: ['registrations', page, search],
      queryFn: async () => {
        setFetching(true);
        try {
          const result = await registrationService.getAllRegistrations(page, 10, search);
          // Update store with the fetched data
          await fetchRegistrations(page, 10, search);
          return result;
        } finally {
          setFetching(false);
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      enabled: true,
    });
  };

  // Mutation for creating a new registration
  const submitRegistration = useMutation({
    mutationFn: (data: Partial<Registration>) => createRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Mutation for updating a registration
  const updateRegistrationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Registration> }) => 
      updateRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Mutation for deleting a registration
  const deleteRegistrationMutation = useMutation({
    mutationFn: (id: string) => deleteRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Mutation for exporting registrations
  const exportRegistrations = useMutation({
    mutationFn: () => registrationService.exportRegistrations(),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    // State
    registrations,
    isLoading,
    isFetching,
    error,
    pagination,
    totalPages,
    stats,
    
    // Query
    useGetRegistrations,
    
    // Mutations
    submitRegistration,
    updateRegistration: updateRegistrationMutation,
    deleteRegistration: deleteRegistrationMutation,
    exportRegistrations,
    
    // Actions
    fetchRegistrations,
    setError,
    clearError,
  };
}