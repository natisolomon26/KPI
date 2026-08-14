// store/registration.store.ts
import { create } from 'zustand';
import { Registration } from '@/lib/types/api';
import { registrationService, RegistrationsResponse } from '@/services/registration.service';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface StatsInfo {
  total: number;
  universities: number;
  thisMonth: number;
  countries: number;
}

interface RegistrationState {
  registrations: Registration[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  pagination: PaginationInfo;
  totalPages: number;
  stats: StatsInfo;
  userRole: 'user' | 'admin' | null;
  
  // Actions
  fetchRegistrations: (page?: number, limit?: number, search?: string) => Promise<void>;
  createRegistration: (data: Partial<Registration>) => Promise<any>;
  updateRegistration: (id: string, data: Partial<Registration>) => Promise<any>;
  deleteRegistration: (id: string) => Promise<any>;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  setFetching: (isFetching: boolean) => void;
}

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  registrations: [],
  isLoading: false,
  isFetching: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  totalPages: 0,
  stats: {
    total: 0,
    universities: 0,
    thisMonth: 0,
    countries: 0,
  },
  userRole: null,

  fetchRegistrations: async (page = 1, limit = 10, search = '') => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await registrationService.getAllRegistrations(page, limit, search);
      
      set({
        registrations: response.data || [],
        pagination: response.pagination || { page, limit, total: 0, pages: 0 },
        totalPages: response.pagination?.pages || 0,
        stats: response.stats || { total: 0, universities: 0, thisMonth: 0, countries: 0 },
        userRole: response.user?.role || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch registrations',
        isLoading: false,
        registrations: [],
      });
      throw error;
    }
  },

  createRegistration: async (data: Partial<Registration>) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await registrationService.createRegistration(data);
      // ✅ REMOVED: The auto-fetch that was causing the 401
      // No more fetchRegistrations call here!
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create registration',
        isLoading: false,
      });
      throw error;
    }
  },

  updateRegistration: async (id: string, data: Partial<Registration>) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await registrationService.updateRegistration(id, data);
      // ✅ REMOVED: Auto-fetch here too for consistency
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update registration',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRegistration: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await registrationService.deleteRegistration(id);
      // ✅ REMOVED: Auto-fetch here too for consistency
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete registration',
        isLoading: false,
      });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  setFetching: (isFetching: boolean) => set({ isFetching }),
  
  reset: () => set({
    registrations: [],
    isLoading: false,
    isFetching: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
    totalPages: 0,
    stats: {
      total: 0,
      universities: 0,
      thisMonth: 0,
      countries: 0,
    },
    userRole: null,
  }),
}));