'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';

export function AuthInitializer() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const userId = useAuthStore((state) => state.user?.id);
  const previousUserId = useRef(userId);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Old versions persisted authentication independently of the session cookie.
    localStorage.removeItem('auth-storage');
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (previousUserId.current !== userId) {
      void queryClient.cancelQueries({ queryKey: ['registrations', previousUserId.current] });
      queryClient.removeQueries({ queryKey: ['registrations', previousUserId.current] });
      previousUserId.current = userId;
    }
  }, [userId, queryClient]);

  return null;
}
