import { create } from 'zustand';
import { Registration } from '@/lib/types/api';
import { registrationService } from '@/services/registration.service';

interface RegistrationState {
  error: string | null;
  createRegistration: (data: Partial<Registration>) => ReturnType<typeof registrationService.createRegistration>;
  updateRegistration: (id: string, data: Partial<Registration>) => ReturnType<typeof registrationService.updateRegistration>;
  deleteRegistration: (id: string) => ReturnType<typeof registrationService.deleteRegistration>;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// React Query owns server data; this store holds shared mutation feedback only.
export const useRegistrationStore = create<RegistrationState>((set) => ({
  error: null,
  createRegistration: (data) => registrationService.createRegistration(data),
  updateRegistration: (id, data) => registrationService.updateRegistration(id, data),
  deleteRegistration: (id) => registrationService.deleteRegistration(id),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ error: null }),
}));
