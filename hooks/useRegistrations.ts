import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRegistrationStore } from '@/store/registration.store';
import { useAuthStore } from '@/store/auth.store';
import { registrationService, RegistrationRequestError, type RegistrationFilters } from '@/services/registration.service';
import { Registration } from '@/lib/types/api';

export function useRegistrationQuery(search = '', page = 1, limit = 10, filters: RegistrationFilters = {}) {
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const reset = useAuthStore((state) => state.reset);
  const query = useQuery({
    queryKey: ['registrations', userId, page, limit, search, filters],
    queryFn: ({ signal }) => registrationService.getAllRegistrations(page, limit, search, signal, filters),
    enabled: isAuthenticated,
    staleTime: 60_000,
    placeholderData: (previousData, previousQuery) => previousQuery?.queryKey[1] === userId ? previousData : undefined,
    retry: (count, error) => !(error instanceof RegistrationRequestError && error.status === 401) && count < 1,
  });
  useEffect(() => {
    if (query.error instanceof RegistrationRequestError && query.error.status === 401) reset();
  }, [query.error, reset]);
  return query;
}

export function useRegistrations() {
  const queryClient = useQueryClient();
  const resetSession = useAuthStore((state) => state.reset);
  const { error, createRegistration, updateRegistration, deleteRegistration, setError, clearError } = useRegistrationStore();
  const onSuccess = () => { void queryClient.invalidateQueries({ queryKey: ['registrations'] }); };
  const onError = (error: Error) => {
    setError(error.message);
    if (error instanceof RegistrationRequestError && error.status === 401) resetSession();
  };
  const submitRegistration = useMutation({ mutationFn: createRegistration, onSuccess, onError });
  const updateRegistrationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Registration> }) => updateRegistration(id, data),
    onSuccess, onError,
  });
  const deleteRegistrationMutation = useMutation({ mutationFn: deleteRegistration, onSuccess, onError });
  const exportRegistrations = useMutation({ mutationFn: () => registrationService.exportRegistrations(), onError });
  return { error, submitRegistration, updateRegistration: updateRegistrationMutation,
    deleteRegistration: deleteRegistrationMutation, exportRegistrations, setError, clearError };
}
