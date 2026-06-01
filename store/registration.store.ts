// stores/registration.store.ts
import { create } from 'zustand';
import { Registration } from '@/lib/types/api';

interface RegistrationState {
  registrations: Registration[];
  selectedRegistration: Registration | null;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  setRegistrations: (registrations: Registration[]) => void;
  setSelectedRegistration: (registration: Registration | null) => void;
  setLoading: (value: boolean) => void;
  setTotalPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
  addRegistration: (registration: Registration) => void;
  updateRegistration: (id: string, updates: Partial<Registration>) => void;
  removeRegistration: (id: string) => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  registrations: [],
  selectedRegistration: null,
  isLoading: false,
  totalPages: 1,
  currentPage: 1,
  setRegistrations: (registrations) => set({ registrations }),
  setSelectedRegistration: (selectedRegistration) => set({ selectedRegistration }),
  setLoading: (isLoading) => set({ isLoading }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  addRegistration: (registration) =>
    set((state) => ({ registrations: [registration, ...state.registrations] })),
  updateRegistration: (id, updates) =>
    set((state) => ({
      registrations: state.registrations.map((reg) =>
        reg._id === id ? { ...reg, ...updates } : reg
      ),
    })),
  removeRegistration: (id) =>
    set((state) => ({
      registrations: state.registrations.filter((reg) => reg._id !== id),
    })),
}));