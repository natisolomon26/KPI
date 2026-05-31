// stores/registration.store.ts
import { create } from 'zustand';
import { Registration } from '@/lib/types/api';

interface RegistrationState {
  registrations: Registration[];
  selectedRegistration: Registration | null;
  isLoading: boolean;
  setRegistrations: (registrations: Registration[]) => void;
  setSelectedRegistration: (registration: Registration | null) => void;
  setLoading: (value: boolean) => void;
  addRegistration: (registration: Registration) => void;
  updateRegistration: (id: string, updates: Partial<Registration>) => void;
  removeRegistration: (id: string) => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  registrations: [],
  selectedRegistration: null,
  isLoading: false,
  setRegistrations: (registrations) => set({ registrations }),
  setSelectedRegistration: (selectedRegistration) => set({ selectedRegistration }),
  setLoading: (isLoading) => set({ isLoading }),
  addRegistration: (registration) =>
    set((state) => ({ registrations: [registration, ...state.registrations] })),
  updateRegistration: (id, updates) =>
    set((state) => ({
      registrations: state.registrations.map((reg) =>
        reg.id === id ? { ...reg, ...updates } : reg
      ),
    })),
  removeRegistration: (id) =>
    set((state) => ({
      registrations: state.registrations.filter((reg) => reg.id !== id),
    })),
}));